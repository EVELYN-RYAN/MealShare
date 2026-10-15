-- MealShare v2: initial schema (DRAFT, untested; see docs/V2-PLAN.md)
-- Target: Supabase Postgres. Uses auth.uid() and Row Level Security.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  created_by  uuid not null default auth.uid() references auth.users (id),
  created_at  timestamptz not null default now()
);

-- People in a household. Kids and partners don't need a login (user_id is null).
create table public.people (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households (id) on delete cascade,
  user_id       uuid references auth.users (id) on delete set null,
  name          text not null,
  allergies     text[] not null default '{}',
  created_at    timestamptz not null default now(),
  unique (household_id, user_id)
);
create index people_user_id_idx on public.people (user_id);

create table public.groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  invite_code  text not null unique
               default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  created_by   uuid not null default auth.uid() references auth.users (id),
  created_at   timestamptz not null default now()
);

create table public.group_households (
  group_id      uuid not null references public.groups (id) on delete cascade,
  household_id  uuid not null references public.households (id) on delete cascade,
  is_lead       boolean not null default false,
  joined_at     timestamptz not null default now(),
  primary key (group_id, household_id)
);
create index group_households_household_idx on public.group_households (household_id);

create type public.handoff_method as enum ('pickup', 'delivery', 'eat_together');

-- One night on the rotation, cooked by one household.
create table public.meals (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.groups (id) on delete cascade,
  cook_household_id  uuid not null references public.households (id),
  title              text not null,
  notes              text,
  serve_on           date not null,
  serve_at           time,
  created_by         uuid not null default auth.uid() references auth.users (id),
  created_at         timestamptz not null default now()
);
create index meals_group_date_idx on public.meals (group_id, serve_on);

-- A receiving household's share of a meal (replaces the old MealDelivery).
create table public.meal_portions (
  meal_id       uuid not null references public.meals (id) on delete cascade,
  household_id  uuid not null references public.households (id) on delete cascade,
  servings      int not null default 1 check (servings > 0),
  method        public.handoff_method not null default 'pickup',
  notes         text,
  created_at    timestamptz not null default now(),
  primary key (meal_id, household_id)
);

-- ---------------------------------------------------------------------------
-- Membership helpers (security definer so policies don't recurse through RLS)
-- ---------------------------------------------------------------------------

create function public.my_household_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select household_id from people where user_id = auth.uid()
$$;

create function public.my_group_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select group_id from group_households
  where household_id in (select my_household_ids())
$$;

-- Households visible to me: my own, plus every household in my groups.
create function public.visible_household_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select my_household_ids()
  union
  select household_id from group_households
  where group_id in (select my_group_ids())
$$;

-- Join a group by invite code, without exposing the groups table.
create function public.join_group(p_invite_code text, p_household_id uuid)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_group_id uuid;
begin
  if not exists (select 1 from my_household_ids() h where h = p_household_id) then
    raise exception 'You are not a member of that household';
  end if;

  select id into v_group_id from groups where invite_code = p_invite_code;
  if v_group_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into group_households (group_id, household_id)
  values (v_group_id, p_household_id)
  on conflict do nothing;

  return v_group_id;
end
$$;

revoke execute on function public.my_household_ids()      from public, anon;
revoke execute on function public.my_group_ids()          from public, anon;
revoke execute on function public.visible_household_ids() from public, anon;
revoke execute on function public.join_group(text, uuid)  from public, anon;
grant  execute on function public.my_household_ids()      to authenticated;
grant  execute on function public.my_group_ids()          to authenticated;
grant  execute on function public.visible_household_ids() to authenticated;
grant  execute on function public.join_group(text, uuid)  to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.households       enable row level security;
alter table public.people           enable row level security;
alter table public.groups           enable row level security;
alter table public.group_households enable row level security;
alter table public.meals            enable row level security;
alter table public.meal_portions    enable row level security;

-- households --------------------------------------------------------------
create policy households_select on public.households for select to authenticated
  using (id in (select visible_household_ids()) or created_by = auth.uid());

create policy households_insert on public.households for insert to authenticated
  with check (created_by = auth.uid());

create policy households_update on public.households for update to authenticated
  using (id in (select my_household_ids()))
  with check (id in (select my_household_ids()));

-- people (allergies are visible to the group, so cooks can plan around them) ----
create policy people_select on public.people for select to authenticated
  using (household_id in (select visible_household_ids()));

create policy people_insert on public.people for insert to authenticated
  with check (
    household_id in (select my_household_ids())
    or exists (select 1 from public.households h
               where h.id = household_id and h.created_by = auth.uid())
  );

create policy people_update on public.people for update to authenticated
  using (household_id in (select my_household_ids()))
  with check (household_id in (select my_household_ids()));

create policy people_delete on public.people for delete to authenticated
  using (household_id in (select my_household_ids()));

-- groups ------------------------------------------------------------------
create policy groups_select on public.groups for select to authenticated
  using (id in (select my_group_ids()) or created_by = auth.uid());

create policy groups_insert on public.groups for insert to authenticated
  with check (created_by = auth.uid());

create policy groups_update on public.groups for update to authenticated
  using (exists (select 1 from public.group_households gh
                 where gh.group_id = groups.id and gh.is_lead
                   and gh.household_id in (select my_household_ids())));

-- group_households (joins other than the creator's go through join_group) --
create policy group_households_select on public.group_households for select to authenticated
  using (group_id in (select my_group_ids()));

create policy group_households_insert_creator on public.group_households for insert to authenticated
  with check (
    household_id in (select my_household_ids())
    and exists (select 1 from public.groups g
                where g.id = group_id and g.created_by = auth.uid())
  );

create policy group_households_delete_self on public.group_households for delete to authenticated
  using (household_id in (select my_household_ids()));

-- meals -------------------------------------------------------------------
create policy meals_select on public.meals for select to authenticated
  using (group_id in (select my_group_ids()));

create policy meals_insert on public.meals for insert to authenticated
  with check (
    created_by = auth.uid()
    and group_id in (select my_group_ids())
    and cook_household_id in (select my_household_ids())
  );

create policy meals_update on public.meals for update to authenticated
  using (cook_household_id in (select my_household_ids()))
  with check (
    cook_household_id in (select my_household_ids())
    and group_id in (select my_group_ids())
  );

create policy meals_delete on public.meals for delete to authenticated
  using (cook_household_id in (select my_household_ids()));

-- meal_portions: claim your own; the cook can see and manage all of them ----
create policy meal_portions_select on public.meal_portions for select to authenticated
  using (exists (select 1 from public.meals m
                 where m.id = meal_id and m.group_id in (select my_group_ids())));

create policy meal_portions_insert on public.meal_portions for insert to authenticated
  with check (
    household_id in (select my_household_ids())
    and exists (select 1 from public.meals m
                where m.id = meal_id and m.group_id in (select my_group_ids()))
  );

create policy meal_portions_update on public.meal_portions for update to authenticated
  using (
    household_id in (select my_household_ids())
    or exists (select 1 from public.meals m
               where m.id = meal_id and m.cook_household_id in (select my_household_ids()))
  );

create policy meal_portions_delete on public.meal_portions for delete to authenticated
  using (
    household_id in (select my_household_ids())
    or exists (select 1 from public.meals m
               where m.id = meal_id and m.cook_household_id in (select my_household_ids()))
  );
