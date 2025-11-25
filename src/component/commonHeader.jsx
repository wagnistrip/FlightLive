import React from 'react'
import "./MidContent.css"
const CommonHeader = ({title}) => {
  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="section_heading_center">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  )
}


export default CommonHeader