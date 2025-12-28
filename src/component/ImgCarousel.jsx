

import React, { useEffect, useState } from 'react';
import "./MidContent.css"
import Flightform from './FlightFom';
function ImgCarousel() {
  const [passangerData, setPassangerData] = useState(null);
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
    </section>
  );
}

export default ImgCarousel;
