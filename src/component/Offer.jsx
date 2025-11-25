import React from 'react'
import { getImageUrl } from '../utils/airlineUtils'
import { useLocation } from 'react-router-dom';
import TopNavbar from './topNavbar';
import { useMediaQuery } from '@mui/material';

const Offer = ({ title, image = "pagebanner.webp" }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sectionPadding = (currentPath === '/flightdetails' || currentPath === '/specialflight' || currentPath === '/SpecialFlightCard' || currentPath.startsWith('/flights')) ? '140px 0 110px 0' : '100px 0 50px 0';
  return (
    <section
      style={{
        // backgroundImage: `url(${getImageUrl("pagebanner.webp")})`,
        backgroundImage: `url(${getImageUrl(image)})`,
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: sectionPadding,
      }}
      id="common_banner"
    >
      {/* Black overlay for better text visibility */}
      <div className="overlay"></div>

      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="common_bannner_text">
              <h2 style={{ fontSize: isMobile ? '22px' : '', lineHeight: isMobile ? '32px' : '' }}>{title ? title : "Destination Details"}</h2>

              {!title ? (
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <span>
                      <i className="fas fa-circle" />
                    </span>{" "}
                    Destination details
                  </li>
                </ul>
              ) : (
                <ul>
                  {/* Placeholder for additional breadcrumb links */}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>


      <div
        className="container d-none d-md-block sec-1"
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: '-45px',
          left: 50,
          right: 50,
          zIndex: '1',
          width: '53%',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '20px 30px',
        }}
      >

        <TopNavbar />
      </div>
    </section>
  )
}

export default Offer