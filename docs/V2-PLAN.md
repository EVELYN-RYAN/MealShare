# MealShare v2: mobile + web plan

Status: **draft, nothing decided yet.** Written 2026-10-15 by Hustlyn (agent) for Ryan to review.

## What MealShare is
A meal rotation for a small group of families. Each night on the rotation, one
household cooks a large batch and the other households pick up their share, have
it delivered, or eat together. The goals are cheaper meals, fewer nights of
cooking, and more time with friends.

## What exists today (2024)
- **This repo:** React 18 + Redux, built with Create React App (now deprecated; GitHub
  reports 159 vulnerable dependencies). Three screens:
  - *Meals:* a read-only list. It fetches the **past** 30 days, though the screen says "This Week's".
  - *Bookings:* an empty stub.
  - *Plan:* a meal-idea list held only in memory, so nothing is saved.
  The logged-in user is hardcoded.
- **`apiMeals`:** a Spring Boot + JPA REST API with CRUD endpoints for Person, Family, Group,
  Meal, MealDelivery, Recipe, Ingredient and Grocery. Problems:
  - No authentication.
  - Passwords stored in plain text.
  - `List<String>` fields mapped as plain `@Column`s.
  - It only ran on localhost.
- **The missing piece:** the core loop, signing up to cook a night and claiming a
  portion, was never built.

## Recommendation: rewrite, don't port
There's very little front-end code worth keeping, and the backend would need
auth, hosting and schema fixes before it could ship. Rewriting is cheaper than
patching.

| Layer | Pick | Why |
|---|---|---|
| App | **Expo (React Native) + Expo Router + TypeScript** | One codebase for iOS, Android and web. Push notifications for "your night is tomorrow." The React skills carry over. |
| Backend | **Supabase** (Postgres + Auth + Row Level Security) | Auth, hosting and the database come built in, with no server to maintain. It replaces `apiMeals`. |
| Hosting | Expo EAS for the mobile builds; the web build on Vercel/Netlify/Expo hosting | Free tiers cover a friend-group app. |

**Decided 2026-10-15: Expo.** v1 is made of lists, forms and a calendar, which
work just as well on web (react-native-web) as on phones. The one gap is
reminders: phones get push notifications, and web users get an **email
reminder** (a Supabase scheduled function), so nobody misses their night.
Rollout: the web build plus Expo Go for the first families; pay for the app
stores ($99/yr Apple, $25 Google) only after a real rotation runs.

## v1 scope: the core loop only
1. Sign in (email magic link).
2. Create your household and add its people, with allergies. Kids don't need accounts.
3. Create a group, or join one with an invite code.
4. **Rotation calendar:** see the upcoming nights and claim one to cook (pick a dish, add a time).
5. **Claim a portion** for your household on someone else's night: number of servings, plus pickup, delivery or eat together.
6. The cook sees a combined view: total servings, allergy warnings for every person eating, and who's picking up.
7. A reminder the day before: push on mobile, email on web.

**Deferred:** recipes and ingredients, grocery lists and prices, cost splitting and "paid"
tracking, recipe approval, ads and revenue.

## Data model (see `supabase/migrations/0001_init.sql`)
- `households` 1—* `people`. A person row can optionally link to a login (`user_id`).
- `groups` *—* `households` through `group_households` (a household can be in more than one group).
- `meals`: one night on the rotation: group, cooking household, dish, date and time.
- `meal_portions`: one row per receiving household: servings, method and notes.
- Joining uses `join_group(invite_code, household_id)`, a server function, so
  invite codes can't be listed.

Row Level Security: you can see households, people (including allergies) and
meals only within groups your household belongs to. You can only edit your own
household, your own portions, and meals your household is cooking.

## Steps
- [x] 0. Scrub the real-looking sample data (`chore/scrub-sample-data`).
- [x] 1. This plan + a first draft of the schema (`v2/plan-and-schema`). **Untested.**
- [x] 2. Stack: Expo + Supabase (decided 2026-10-15). v1 scope: assumed OK unless Ryan objects.
- [ ] 3. Create the Supabase project (Ryan: account and keys; agents never see the keys) and apply the migration.
- [ ] 4. Scaffold the Expo app in `app/` with `npx create-expo-app`. This needs a machine/agent that can run npm.
- [ ] 5. Move the 2024 code to `legacy/` (or delete it; it's in git history either way).
- [ ] 6. Build the screens in core-loop order: auth → household → group/invite → calendar → claim night → claim portion → cook view.
- [ ] 7. Run a real week with 2–3 families before building anything else.
- [ ] 8. Archive `apiMeals`.
