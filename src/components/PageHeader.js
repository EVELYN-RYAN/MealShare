import React from 'react'

export default function PageHeader(props) {
  return (
    <div className='PageHeader'>
        <div className="RightHeaderButton"></div>
        <div className='HeaderTitle'>{props.header}</div>
        <div className="LeftHeaderButton"></div>
    </div>
  )
}
