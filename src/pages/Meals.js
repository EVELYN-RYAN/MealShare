import React from 'react'
import PageHeader from '../components/PageHeader'
import ListMeals from '../components/ListMeals';
const URL = `http://localhost:8080/meals`;

function Meals() {
  return (
    <div>
        <PageHeader header="This Week's"/>
        <ListMeals/>
    </div>
  )
}

export default Meals