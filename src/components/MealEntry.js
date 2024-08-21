import React from 'react'
import { connect } from 'react-redux'
import MyMealDeliverDetails from './MyMealDeliverDetails'

function MealEntry(props) {
    const meal = props.meal
    var method = meal.mealDeliveries[0].method
    let date = new Date(`${meal.deliveryDate} ${meal.deliveryTime}`)
    const person = props.person
    const myMeal = meal.responsibleFamily.familyId === person.family.familyId ? true : false;

  return (
    <>
        <div id={meal.mealId} className={ myMeal? "MyMeal MealCard": "Meal MealCard"}>
            <div className='DayAbbrev'>{date.toLocaleDateString("en-us",{weekday:"short"})}</div>
            <div className='RecipeTitle'>{meal.recipe.name}</div>
            <div className='RespFam'>{meal.responsibleFamily.familyName}</div>
            <div className='DeliveryIcon'>{method}</div>
            <div className='Time'>{date.toLocaleTimeString("en-us",{hour: "numeric", minute: "2-digit"})}</div>
            {myMeal? <MyMealDeliverDetails deliveries={meal.mealDeliveries}/> : ""}
        </div>
    </>
  )
}
const mapStateToProps = (state) => {
  return{
    person: state.person
  }
}
export default connect(mapStateToProps)(MealEntry)

// Turn date into the day of the week