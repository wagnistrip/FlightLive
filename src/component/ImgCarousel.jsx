

import React, { useEffect, useState } from 'react';
import "./MidContent.css"
import { getImageUrl } from '../utils/airlineUtils';
import Flightform from './FlightFom';
import { useSelector } from 'react-redux';
function ImgCarousel() {
  const [passangerData, setPassangerData] = useState(null);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const searchdata = localStorage.getItem('formData');
    if (searchdata) {
      const parsedData = JSON.parse(searchdata);
      setPassangerData(parsedData);
    }
  }, []);

  return (
    <section
    // style={{ 
    //   backgroundImage: `url(${getImageUrl("herosection.png")})`,
    //  }}
    id="home_one_banner">
    <div className="container">
      <Flightform existingData={passangerData} />
    </div>

    {
      user && (
        <p className='blinktext'>GENERATE 50 PNR & WIN SILVER COIN IN PAID PORTAL</p>
      )
    }
  </section>
  );
}

export default ImgCarousel;
