import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
const URL = `http://localhost:8080/meals`;
var meals = ["Tacos","Baked Potatoes","Pizza","Burgers","Costa Salads","Spaghetti"]

function Plan() {
  const[mealsData, setMealsData] = useState(meals)
  const[searchMealText, setSearchMealText] = useState("")
  const[addMealText,setAddMealText] = useState("")

  const handleSearch = (e) => {
    setSearchMealText(e.target.value)
  }
  const handleAddMealText = (e) => {
    setAddMealText(e.target.value)
  }
  const addMeal = (e) => {
    e.preventDefault();
    setMealsData(mealsData => [e.target["newMeal"].value,...mealsData])
    setAddMealText("")
  }
  console.log(searchMealText)
  const filteredMeals = mealsData.filter((ent) => ent.includes(searchMealText, 0));
  
  return (
    <div>
        <input id="searchText" type="text" placeholder='Search' onChange={handleSearch} />
        {filteredMeals.length > 0? filteredMeals.map(m => <h1>{m}</h1>): <h1>No Matching</h1>}
          <form onSubmit={addMeal}>
            <label htmlFor="addmeal">Add Meal</label>
            <input type="text" name="newMeal" id="newMeal" placeholder='Meal name' value={addMealText} onChange={handleAddMealText}/>
            <button type="submit">Add</button>
          </form>
        
    </div>
  )
}

export default Plan