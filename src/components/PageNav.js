import React from 'react'
import Meals from '../pages/Meals'
import Plan from '../pages/Plan';
import Bookings from '../pages/Bookings';

function PageNav(props) {
  let page = props.page
  if (page == "meals"){
    return(
      <Meals/>
    );}
  if (page == "bookings"){
    return (
    <Bookings/>
    );
  };
  if (page == "plan"){
    return (
    <Plan/>
    );
  };
}

export default PageNav