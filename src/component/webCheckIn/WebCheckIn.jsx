
import React, { useState } from 'react';
import Footer from '../Footer';
import { getImageUrl } from '../../utils/airlineUtils';

const WebCheckIn = () => {
  const [activeSection, setActiveSection] = useState("flightStatus");
  const [spicejet, setspicejet] = useState("flightStatus");
  const [airindia, setAirindia] = useState("flightStatus");
  const [indigoState, setIndigoState] = useState("flightStatus");
  const [akasaState, setAkasaState] = useState("flightStatus");
  const [expressState, setExpressState] = useState("flightStatus");
  return (
    <>
     
      <div className="container-fluid p-0 position-relative">
        <img
          src={getImageUrl("webcheckin.jpg")}
          alt="Web Check-In"
          className="w-100"
          style={{
            height: 'auto',
            maxHeight: '350px',
            objectFit: 'cover',
            //   borderRadius: '10px', 
            display: 'block',
            width: '100%'
          }}
        />
        <div
          className="position-absolute bottom-0 end-0 text-center p-3 text-white fs-4 fw-bold"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '8px',
            marginRight: '10px',
            marginBottom: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          WEB-CHECK-IN
        </div>
      </div>

      <div className="container bg-light mt-4 rounded ">
        <div className="row p-4">
          <div className="col-12 border border-secondary-subtle p-4 text-center rounded shadow-sm">
            <div className='fs-3 fw-bold text-dark'>Web Check-In</div>
          </div>
          <div className="col-12  p-3 mt-3 rounded-3 text-dark text-justify" style={{ fontSize: "0.9rem", backgroundColor: "#ecf8f4 " }}>
            <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>*</strong>  Important Information: Airlines may change their rules without notice. Please refer to airline policies for the most recent updates. For any amendments and cancellations, you will be charged as per the latest airline policy applicable.
          </div>
        </div>

        <div className="row p-3  ">


          {/* Indigo Airlines */}
          <div className="col-md-12 col-lg-6 mb-3" style={{
            border: '1px solid #f1c40f',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            padding: '20px'

          }}>
            <div className='text-center mb-4'>
              <img src={getImageUrl("indigologo.png")} alt="airindia Logo" className='img-fluid' style={{ maxWidth: '155px' }} />
            </div>

            <div className="row text-center mb-3">
              <div
                className={`col-4 p-2 ${indigoState === 'flightStatus' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: indigoState === 'flightStatus' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: indigoState === 'flightStatus' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setIndigoState('flightStatus')}
              >
                Check Flight Status
              </div>
              <div
                className={`col-4 p-2 ${indigoState === 'webCheckIn' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: indigoState === 'webCheckIn' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: indigoState === 'webCheckIn' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setIndigoState('webCheckIn')}
              >
                Web Check-in
              </div>
              <div
                className={`col-4 p-2 ${indigoState === 'updateContact' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: indigoState === 'updateContact' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: indigoState === 'updateContact' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setIndigoState('updateContact')}
              >
                Update Contact Details
              </div>
            </div>

            {indigoState === 'flightStatus' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Check Flight Status</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.goindigo.in/check-flight-status.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Check Flight Status</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '10px' }}>Enter the Origin, Destination, Flight Date, and Flight Number (e.g., 6E123), or use the Route Search feature.</li>
                  <li>Click Find Flights.</li>
                </ol>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', fontWeight: "bold" }}>
                  You can view the status for flights from the previous day, today, or the next day.
                </p>
              </div>
            )}

            {indigoState === 'webCheckIn' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Web Check-in</h5>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#333' }}>
                    Please visit:
                    <a
                      href="https://www.goindigo.in/web-check-in.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Web Check-in
                    </a>
                  </p>

                  <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '10px' }}>Input the PNR and Email/Last Name as per the booking</li>
                    <li style={{ marginBottom: '10px' }}>Select the passenger and add Nationality</li>
                    <li>Select add-ons (Seats, Baggage, etc.) and continue</li>
                  </ol>

                  <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Important Travel Notice:</strong> To ensure a smooth departure, please arrive at the airport at least 3 hours before your flight. This allows ample time for check-in and any necessary formalities.
                    </p>
                    <p>
                      If you need to reprint your boarding pass, simply visit
                      <a
                        href="https://www.goindigo.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1c40f', textDecoration: 'none' }}
                      >
                        www.goindigo.in
                      </a>
                      and enter your PNR details. Make sure you’ve already completed the check-in process to proceed.
                    </p>
                    <p style={{ fontWeight: 'bold' }}>
                      Safe travels, and we look forward to serving you!
                    </p>
                  </div>
                </div>


              </div>
            )}

            {indigoState === 'updateContact' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Update Contact Details</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.goindigo.in/update-contact-details.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Update Contact Details</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Enter your Booking Reference Number and Last Name.
                  </li>
                  <li style={{ fontSize: '14px' }}>
                    Click “Retrieve Booking.”
                  </li>
                </ol>

                <p style={{ color: '#333', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
                  <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>Please Note:</strong> Providing a guest contact number and email address is mandatory for your booking.
                </p>
              </div>
            )}
          </div>
          {/* AirIndia Airlines */}
          <div className="col-md-12 col-lg-6 mb-3 " style={{
            border: '1px solid #f1c40f',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            padding: '20px'

          }}>
            <div className='text-center mb-4'>
              <img src={getImageUrl("airindialogo.png")} alt="airindia Logo" className='img-fluid' style={{ maxWidth: '120px' }} />
            </div>

            <div className="row text-center mb-3">
              <div
                className={`col-4 p-2 ${airindia === 'flightStatus' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: airindia === 'flightStatus' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: airindia === 'flightStatus' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAirindia('flightStatus')}
              >
                Check Flight Status
              </div>
              <div
                className={`col-4 p-2 ${airindia === 'webCheckIn' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: airindia === 'webCheckIn' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: airindia === 'webCheckIn' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAirindia('webCheckIn')}
              >
                Web Check-in
              </div>
              <div
                className={`col-4 p-2 ${airindia === 'updateContact' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: airindia === 'updateContact' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: airindia === 'updateContact' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAirindia('updateContact')}
              >
                Update Contact Details
              </div>
            </div>

            {airindia === 'flightStatus' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Check Flight Status</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.airindia.com/in/en/manage/flight-status.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Check Flight Status</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '10px' }}>Enter the Origin, Destination, Flight Date, and Flight Number (e.g., AI202), or use the Route Search option.</li>
                  <li>Click Find Flights.</li>
                </ol>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', fontWeight: "bold" }}>
                  You can view the status for flights from the previous day, today, or the next day.
                </p>
              </div>
            )}

            {airindia === 'webCheckIn' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Web Check-in</h5>


                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#333' }}>
                    Please visit:
                    <a
                      href="https://www.airindia.com/in/en/manage/web-checkin.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Web Check-in
                    </a>
                  </p>

                  <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '10px' }}>Input the PNR and Email/Last Name as per the booking</li>
                    <li style={{ marginBottom: '10px' }}>Select the passenger and add Nationality</li>
                    <li>Select add-ons (Seats, Baggage, etc.) and continue</li>
                  </ol>

                  <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Important Travel Notice:</strong> To ensure a smooth departure, please arrive at the airport at least 3 hours before your flight. This allows ample time for check-in and any necessary formalities.
                    </p>
                    <p>
                      If you need to reprint your boarding pass, simply visit
                      <a
                        href="https://www.airindia.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1c40f', textDecoration: 'none' }}
                      >
                        www.airindia.in
                      </a>
                      and enter your PNR details. Make sure you’ve already completed the check-in process to proceed.
                    </p>
                    <p style={{ fontWeight: 'bold' }}>
                      Safe travels, and we look forward to serving you!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {airindia === 'updateContact' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Update Contact Details</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.airindia.com/in/en/contact-us.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Update Contact Details</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Enter your Booking Reference Number and Last Name.
                  </li>
                  <li style={{ fontSize: '14px' }}>
                    Click “Retrieve Booking.”
                  </li>
                </ol>

                <p style={{ color: '#333', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
                  <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>Please Note:</strong> Providing a guest contact number and email address is mandatory for your booking.
                </p>
              </div>
            )}
          </div>

          {/* Akasa Airlines */}
          <div className="col-md-12 col-lg-6 mb-3" style={{
            border: '1px solid #f1c40f',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            padding: '20px'

          }}>
            <div className='text-center mb-4'>
              <img src={getImageUrl("akasaairlogo.png")} alt="airindia Logo" className='img-fluid' style={{ maxWidth: '370px' }} />
            </div>

            <div className="row text-center mb-3">
              <div
                className={`col-4 p-2 ${akasaState === 'flightStatus' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: akasaState === 'flightStatus' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: akasaState === 'flightStatus' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAkasaState('flightStatus')}
              >
                Check Flight Status
              </div>
              <div
                className={`col-4 p-2 ${akasaState === 'webCheckIn' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: akasaState === 'webCheckIn' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: akasaState === 'webCheckIn' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAkasaState('webCheckIn')}
              >
                Web Check-in
              </div>
              <div
                className={`col-4 p-2 ${akasaState === 'updateContact' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: akasaState === 'updateContact' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: akasaState === 'updateContact' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setAkasaState('updateContact')}
              >
                Update Contact Details
              </div>
            </div>

            {akasaState === 'flightStatus' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Check Flight Status</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.akasaair.com/flight-status" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Check Flight Status</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '10px' }}>Enter the Origin, Destination, Flight Date, and Flight Number (e.g., AK123), or use the Route Search option.</li>
                  <li>Click Find Flights.</li>
                </ol>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', fontWeight: "bold" }}>
                  You can view the status for flights from the previous day, today, or the next day.
                </p>

              </div>
            )}

            {akasaState === 'webCheckIn' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Web Check-in</h5>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#333' }}>
                    Please visit:
                    <a
                      href="https://www.akasaair.com/check-in/web-check-in"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Web Check-in
                    </a>
                  </p>

                  <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '10px' }}>Input the PNR and Email/Last Name as per the booking</li>
                    <li style={{ marginBottom: '10px' }}>Select the passenger and add Nationality</li>
                    <li>Select add-ons (Seats, Baggage, etc.) and continue</li>
                  </ol>

                  <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Important Travel Notice:</strong> To ensure a smooth departure, please arrive at the airport at least 3 hours before your flight. This allows ample time for check-in and any necessary formalities.
                    </p>
                    <p>
                      If you need to reprint your boarding pass, simply visit
                      <a
                        href="https://www.akasaair.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1c40f', textDecoration: 'none' }}
                      >
                        www.akasaair.com
                      </a>
                      and enter your PNR details. Make sure you’ve already completed the check-in process to proceed.
                    </p>
                    <p style={{ fontWeight: 'bold' }}>
                      Safe travels, and we look forward to serving you!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {akasaState === 'updateContact' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Update Contact Details</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.akasaair.com/manage-booking/update-health-and-contact-details" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Update Contact Details</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Enter your Booking Reference Number and Last Name.
                  </li>
                  <li style={{ fontSize: '14px' }}>
                    Click “Retrieve Booking.”
                  </li>
                </ol>

                <p style={{ color: '#333', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
                  <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>Please Note:</strong> Providing a guest contact number and email address is mandatory for your booking.
                </p>
              </div>
            )}
          </div>

          {/* AIr Express Airlines */}
          <div className="col-md-12 col-lg-6 mb-3" style={{
            border: '1px solid #f1c40f',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            padding: '20px'

          }}>
            <div className='text-center mb-4'>
              <img src={getImageUrl("airExpresslogo.png")} alt="airindia Logo" className='img-fluid' style={{ maxWidth: '110px' }} />
            </div>

            <div className="row text-center mb-3">
              <div
                className={`col-4 p-2 ${expressState === 'flightStatus' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: expressState === 'flightStatus' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: expressState === 'flightStatus' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
                  fontWeight: '600',
                  fontSize: "13px",
                }}
                onClick={() => setExpressState('flightStatus')}
              >
                Check Flight Status
              </div>
              <div
                className={`col-4 p-2 ${expressState === 'webCheckIn' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: expressState === 'webCheckIn' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: expressState === 'webCheckIn' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setExpressState('webCheckIn')}
              >
                Web Check-in
              </div>
              <div
                className={`col-4 p-2 ${expressState === 'updateContact' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: expressState === 'updateContact' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: expressState === 'updateContact' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setExpressState('updateContact')}
              >
                Update Contact Details
              </div>
            </div>

            {expressState === 'flightStatus' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Check Flight Status</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.airindiaexpress.com/flightstatus" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Check Flight Status</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '10px' }}>Enter the Origin, Destination, Flight Date, and Flight Number (e.g., IX456), or use the Route Search feature.</li>
                  <li>Click Find Flights.</li>
                </ol>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', fontWeight: "bold" }}>
                  You can view the status for flights from the previous day, today, or the next day.
                </p>


              </div>
            )}

            {expressState === 'webCheckIn' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Web Check-in</h5>


                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#333' }}>
                    Please visit:
                    <a
                      href="https://www.airindiaexpress.com/checkin-home"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Web Check-in
                    </a>
                  </p>

                  <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '10px' }}>Input the PNR and Email/Last Name as per the booking</li>
                    <li style={{ marginBottom: '10px' }}>Select the passenger and add Nationality</li>
                    <li>Select add-ons (Seats, Baggage, etc.) and continue</li>
                  </ol>

                  <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Important Travel Notice:</strong> To ensure a smooth departure, please arrive at the airport at least 3 hours before your flight. This allows ample time for check-in and any necessary formalities.
                    </p>
                    <p>
                      If you need to reprint your boarding pass, simply visit
                      <a
                        href="https://www.airindiaexpress.com/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1c40f', textDecoration: 'none' }}
                      >
                        www.airindiaexpress.com
                      </a>
                      and enter your PNR details. Make sure you’ve already completed the check-in process to proceed.
                    </p>
                    <p style={{ fontWeight: 'bold' }}>
                      Safe travels, and we look forward to serving you!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {expressState === 'updateContact' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Update Contact Details</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://www.airindiaexpress.com/support#:~:text=Contact%20channels,and%20WhatsApp%20(%2B91%206360012345)." target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Update Contact Details</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Enter your Booking Reference Number and Last Name.
                  </li>
                  <li style={{ fontSize: '14px' }}>
                    Click “Retrieve Booking.”
                  </li>
                </ol>

                <p style={{ color: '#333', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
                  <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>Please Note:</strong> Providing a guest contact number and email address is mandatory for your booking.
                </p>
              </div>
            )}
          </div>

          {/* Spicejet Airlines */}
          <div className="col-md-12 col-lg-6 mb-3 " style={{
            border: '1px solid #f1c40f',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            padding: '20px'

          }}>
            <div className='text-center mb-4'>
              <img src={getImageUrl("spicejets.png")} alt="Vistara Logo" className='img-fluid' style={{ maxWidth: '190px' }} />
            </div>

            <div className="row text-center mb-3">
              <div
                className={`col-4 p-2 ${spicejet === 'flightStatus' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: spicejet === 'flightStatus' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: spicejet === 'flightStatus' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setspicejet('flightStatus')}
              >
                Check Flight Status
              </div>
              <div
                className={`col-4 p-2 ${spicejet === 'webCheckIn' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: spicejet === 'webCheckIn' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: spicejet === 'webCheckIn' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setspicejet('webCheckIn')}
              >
                Web Check-in
              </div>
              <div
                className={`col-4 p-2 ${spicejet === 'updateContact' ? 'text-primary' : 'text-secondary'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: spicejet === 'updateContact' ? '#eaf2f8' : '#f5f5f5',
                  borderBottom: spicejet === 'updateContact' ? '3px solid #f1c40f' : 'none',
                  transition: 'background-color 0.3s ease, border-bottom 0.3s ease',

                  fontWeight: '600',
                  fontSize: "13px"
                }}
                onClick={() => setspicejet('updateContact')}
              >
                Update Contact Details
              </div>
            </div>

            {spicejet === 'flightStatus' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Check Flight Status</h5>

                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://book.spicejet.com/FlightStatus.aspx" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Check Flight Status</a>
                </p>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '10px' }}>Enter the Origin, Destination, Flight Date, and Flight Number (e.g., SG8161), or use the Route Search.</li>
                  <li>Click Find Flights.</li>
                </ol>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', fontWeight: "bold" }}>
                  You can view the status for flights from the previous day, today, or the next day.
                </p>

              </div>
            )}

            {spicejet === 'webCheckIn' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Web Check-in</h5>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#333' }}>
                    Please visit:
                    <a
                      href="https://www.spicejet.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Web Check-in
                    </a>
                  </p>

                  <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '10px' }}>Input the PNR and Email/Last Name as per the booking</li>
                    <li style={{ marginBottom: '10px' }}>Select the passenger and add Nationality</li>
                    <li>Select add-ons (Seats, Baggage, etc.) and continue</li>
                  </ol>

                  <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Important Travel Notice:</strong> To ensure a smooth departure, please arrive at the airport at least 3 hours before your flight. This allows ample time for check-in and any necessary formalities.
                    </p>
                    <p>
                      If you need to reprint your boarding pass, simply visit
                      <a
                        href="https://www.spicejet.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1c40f', textDecoration: 'none' }}
                      >
                        www.spicejet.com
                      </a>
                      and enter your PNR details. Make sure you’ve already completed the check-in process to proceed.
                    </p>
                    <p style={{ fontWeight: 'bold' }}>
                      Safe travels, and we look forward to serving you!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {spicejet === 'updateContact' && (
              <div style={{ borderTop: '1px solid #f1c40f', borderRadius: '0 0 15px 15px', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Update Contact Details</h5>
                <p style={{ marginBottom: '15px' }}>
                  Please visit: <a href="https://book.spicejet.com/RetrieveBooking.aspx" target="_blank" rel="noopener noreferrer" style={{ color: '#f1c40f', textDecoration: 'none' }}>Update Contact Details</a>
                </p>


                <ol style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Enter your Booking Reference Number and Last Name.
                  </li>
                  <li style={{ fontSize: '14px' }}>
                    Click “Retrieve Booking.”
                  </li>
                </ol>

                <p style={{ color: '#333', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
                  <strong style={{ fontWeight: 'bold', color: '#d9534f' }}>Please Note:</strong> Providing a guest contact number and email address is mandatory for your booking.
                </p>


              </div>
            )}
          </div>


        </div>


      </div>
      <Footer />
    </>
  );
}

export default WebCheckIn;
