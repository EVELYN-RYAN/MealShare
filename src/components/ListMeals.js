import React, {useEffect, useState} from 'react'
import MealEntry from './MealEntry'
import EmptyMealEntry from './EmptyMealEntry'

const ListMeals = () => {
    const [meals, setMeals] = useState([])
    let groupId = 2;
    let daysBack = 6;
    
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupId, daysBack})
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/search/meals",options)
            .then(res => res.json())
            .then(data => { 
                console.log(data);    
                setMeals(data);
            })       
            .catch(error => console.log(error))                
    },[]);

  if (meals < 1) {
    return(
        <>
            <EmptyMealEntry/>
        </>
    );
  }else{
  return (
        <>
            {
                meals.map(m =>
                    <MealEntry key={m.mealId} meal={m} />)
            }
        </>
    );
  }
};

export default ListMeals