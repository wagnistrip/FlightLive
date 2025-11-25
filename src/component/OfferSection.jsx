
import React from 'react';
import { getImageUrl } from '../utils/airlineUtils';
import { Link } from 'react-router-dom';
const OfferSection = () => {
  return (
    <Link to="/login/user-login">
      <div
      className='tour_details_boxed'
      style={{
        // borderRadius: '15px',
        overflow: 'hidden',
        // boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        width: '100%',
        height: '130px',
        backgroundImage: `url(${getImageUrl("offerbanner.png")})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '4px',
      }}
    >

    </div>
    </Link>
  );
};

export default OfferSection;
