import React from 'react'

function MealEntry(props) {
    const meal = props.meal
    var method = meal.mealDeliveries[0].method
    let date = new Date(`${meal.deliveryDate} ${meal.deliveryTime}`)
    const person = JSON.parse(localStorage.getItem('person'))
  return (
    <>
        <div id={meal.mealId} className={meal.responsibleFamily.familyId === person.family.familyId ? "MyMeal MealCard": "Meal MealCard"}>
            <div className='DayAbbrev'>{date.toLocaleDateString("en-us",{weekday:"short"})}</div>
            <div className='RecipeTitle'>{meal.recipe.name}</div>
            <div className='RespFam'>{meal.responsibleFamily.familyName}</div>
            <div className='DeliveryIcon'>{method}</div>
            <div className='Time'>{date.toLocaleTimeString("en-us",{hour: "numeric", minute: "2-digit"})}</div>
        </div>
    </>
  )
}

export default MealEntry

// Turn date into the day of the week