import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from './utils/airlineUtils';

const PaymentFailed = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

   
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    <div className="bg-white container-fluid rounded">
      <div className="row align-items-center">
       
        <div className="col-lg-6 col-12">
          <div
            className="d-flex flex-column"
            style={{
              paddingLeft: windowWidth > 1000 ? "150px" : "15px",
            }}
          >
            <h1 className=" fw-bold"  style={{
              fontSize: windowWidth > 1000 ? "80px" : "36px",color:"rgb(168 170 173)"
            }}>
              Payment Error
            </h1>
            <p className="mt-3 mb-0  text-muted" style={{fontFamily:"cursive",fontSize:'16px'}}>
            We are facing an issue while processing your payment. This may be caused by entering incorrect details or insufficient balance in your bank account. 
            Kindly check the details and try again. 
            This can be caused by numerous people attempting to make the payment at the same time, resulting in a server-down problem. 
            We sincerely apologize for the inconvenience caused. 

            </p>
         
            <Link to="/" type="button" className="btn btn-secondary mt-5">BACK-To-HOME</Link>
          </div>
        </div>

        <div className="col-lg-6 col-12 text-center mt-4 mt-lg-0">
          <img src={getImageUrl("errorimage.jpg")} alt="error" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>
    </div>
    </>
    
  );
};

export default PaymentFailed;