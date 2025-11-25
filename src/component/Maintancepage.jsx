import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getImageUrl } from '../utils/airlineUtils'
const Maintancepage = () => {
   const location = useLocation();

 useEffect(() => {
    if (location.pathname === '/events') {
      window.location.href = 'https://event.wagnistrip.com/';
    }
    else if(location.pathname === '/visa'){
      window.location.href = 'https://visa.wagnistrip.com/';
    }
  }, [location]);
  return (
    <div className="container text-center d-flex flex-column align-items-center justify-content-center vh-100">
      <img src={getImageUrl("maintance.jpg")} alt="Under Maintenance" className="img-fluid mb-4" style={{ maxWidth: "500px" }} />
      <h2 className="fw-bold text-primary">We are Under Maintenance.</h2>
      <p className="text-muted fs-5">Will be Back Soon!</p>
      <Link className='mt-2' to="/">Go Back</Link>
    </div>
  )
}

export default Maintancepage