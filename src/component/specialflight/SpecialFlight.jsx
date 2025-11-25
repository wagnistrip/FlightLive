import React, { useEffect, useState } from 'react'
import Offer from '../Offer';
import MidContent from '../MidContent';
import Flightform from '../FlightFom';
import Footer from '../Footer';
const SpecialFlight = () => {
    const [passangerData, setPassangerData] = useState(null);
  
    useEffect(() => {
      const searchdata = localStorage.getItem('formData');
      if (searchdata) {
        const parsedData = JSON.parse(searchdata);
        setPassangerData(parsedData);
      }
    }, []);
  return (
    <div>
      <Offer title="---" />
      <Flightform existingData={passangerData} type='specailFlight'/>
      <MidContent/>
      <Footer/>
    </div>
  )
}

export default SpecialFlight

