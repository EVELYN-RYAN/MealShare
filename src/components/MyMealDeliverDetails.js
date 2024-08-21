import React, { useEffect, useState } from 'react'

function MyMealDeliverDetails(props) {
    const deliveries = props.deliveries
    console.log(deliveries)

    // const options = {
    //     method: 'GET',
    //     headers: {'Content-Type': 'application/json'}
    // };
    // useEffect(() => {
    //     fetch("http://localhost:8080/api/meal/7",options)
    //     .then(res => res.json())
    //     .then(data => {
    //         setDeliveries(data);
    //     })
    //     .catch(e =>  console.log("Delivery not found"));
    // },[]) 
  return (
    <div className='MyMealDeliveryDetails'>
        <ul>
            {deliveries.map(d => 
                    <li>
                        <span>{d.family.familyName}</span>
                        <span>{d.method}</span>
                    </li>
                )}

        </ul>
    </div>
  )
}

export default MyMealDeliverDetails