import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Card, Col, Row, Table } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import { IoAirplaneOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { getAirlineName, getAirportDataByCountry, getFlightSegments, getImageUrl, getImageUrl1 } from '../../utils/airlineUtils';
import Footer from '../Footer';
import toast from 'react-hot-toast';
import LoadingPage from '../../LoadingPage';
import { galileoApi } from '../../Api/apiService';

const SpecialTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, passenger } = location.state || {};
  const passengerDetails = passenger[0].CustomerInfo.PassengerDetails;
  let allflight = [];
  const [loadingcompon, setloadingcompon] = useState(false);
  useEffect(() => {
    // Agar user back button dabaye to home bhej do
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);



  if (booking) {
    const fdSegments = getFlightSegments(booking?.special_flight);
    allflight = [...fdSegments];
  }

    const handleDownloadPDF = async (id) => {
    const reqbody = {
      id: id
    }
    setloadingcompon(true);
    console.log("request data => ",reqbody);
    // return;
    try {
      const response = await galileoApi("/agent/specialFlight-ticket", reqbody, {});
      console.log("respnse => ", response);
      if (response.status === true && response?.Special_url) {
        const pdfUrl = response.Special_url;
        setTimeout(() => {
          window.open(pdfUrl, "_blank", "noopener,noreferrer");
          setloadingcompon(false);
        }, 2000);
      } else if (response.status === 400) {
        toast.error(response?.message || 'Invoice not generated');
        setloadingcompon(false);
      } else {
        toast.error(response?.message || 'Invoice not generated');
        setloadingcompon(false);
      }
    } catch (err) {
      setloadingcompon(false);
      console.error("fetch blog error", err);
    }
  };


  console.log("passenger data => ",passenger,booking);


  return (
    <>
     {loadingcompon && (
        <LoadingPage />
      )}
      <div className="bg-white shadow-md border-bottom py-2">
        <div className="container text-white">
          <Link to="/"><img style={{ width: '110px' }} src={getImageUrl("logo.png")} alt="" /></Link>
        </div>
      </div>
      <div className="container bg-white px-2 px-md-4 py-5">
        <Row>
          <Col xs={12} md={8}>
            <h3>
              <FaCheckCircle className='text-success' /> Congratulations! Your flight booking is confirmed!
            </h3>
          </Col>
        </Row>

        {/* Booking Details */}
        <Card className="p-2 p-sm-3 p-md-4 shadow-sm border-1 text-start rounded-3 my-4">
          <Row className="mb-3">
            <Col md={6} sm={12}>
              <div className="mb-2">
                <div style={{ fontSize: '14px' }}>PNR/Booking Reference:</div>
                <span className="fw-semibold">
                  {booking && booking?.refrence_id ? booking.refrence_id : booking?.special_flight?.PNR || "N/A"}
                </span>
                <Badge bg="success" className='mx-2'>Confirmed</Badge>
              </div>
              <div className="fw-bold mt-1">
                <span>{getAirportDataByCountry(allflight && allflight[0]?.Origin, 'city')}</span> <span>({allflight && allflight[0]?.Origin})</span> → {getAirportDataByCountry(allflight && allflight[allflight.length-1]?.Destination, 'city')} <span>({allflight && allflight[allflight.length-1]?.Destination})</span>
              </div>
              <div className="text-muted d-flex align-items-center mt-1">
                {/* Airline Logo */}
                <img
                  src={getImageUrl1(`/flightlogo/${allflight && allflight[0]?.carrier_code}.png`)}
                  className="img-fluid-flight me-2"
                  alt="Airline Logo"
                  onError={(e) => (e.target.src = '/flight/default.png')}
                  style={{ width: "40px", height: "40px", objectFit: "contain" }} // optional styling
                />

                {/* Flight Info */}
                <div className="d-flex flex-column">
                  <span>
                    {allflight && allflight[0]?.carrier_code} - {allflight && allflight[0]?.flight_number}
                  </span>
                  <span className="fw-semibold">
                    {allflight &&  getAirlineName(allflight[0]?.carrier_code || '')}
                  </span>
                </div>
              </div>

            </Col>

            <Col
              md={3}
              sm={6}
              className="d-flex flex-column justify-content-start mt-3 mt-md-0"
            >
              <div style={{ fontSize: '14px' }}>Payment Status:</div>
              <div className="fw-bold text-dark">Complete</div>
            </Col>
          </Row>
          <div className='col-lg-5 d-flex flex-wrap justify-content-start gap-3"'>
            <button onClick={() => handleDownloadPDF(booking?.id)} style={{ width: '100px', height: '80px' }} className="btn btn-outline-primary btn-sm">
              <FiDownload size={24} />
              <div>Download</div>
            </button>
          </div>
        </Card>

        {/* Passenger Details */}
        <Card className="p-2 p-sm-3 p-md-4 mb-4 border rounded-3 shadow-sm">
          <div className="text-start bg-white border-0 mb-4">
            <h5>Passenger(s) Details</h5>
          </div>

          {
            allflight && allflight.map((data, index) => (
              <div key={index}>
                <>
                  <div className="text-start mb-2">
                    <strong><span className="text-muted fs-6">{getAirportDataByCountry(data?.Origin, 'city')} </span>({data?.Origin})</strong>
                    {' '}<i className="bi bi-arrow-right"></i>{' '}
                    <strong><span className="text-muted fs-6">{getAirportDataByCountry(data?.Destination, 'city')} </span>({data?.Destination})</strong>
                  </div>
                  <div className="text-muted d-flex align-items-center mt-1 mb-2">
                    <img
                      src={getImageUrl1(`/flightlogo/${data?.carrier_code || ''}.png`)}
                      className='img-fluid-flight'
                      alt="Airline Logo"
                      onError={(e) => (e.target.src = '/flight/default.png')}
                    />
                    <div>
                      <div className='block text-start'>

                        <div className='mx-2'>
                          {getAirlineName(data.carrier_code)}
                        </div>
                        <div className='mx-2'>
                          {data.carrier_code || ''} - {data.flight_number || ''} • Economy
                        </div>
                      </div>
                    </div>
                  </div>
                  <Table bordered responsive className="text-start">
                    <thead className="table-secondary">
                      <tr>
                        <th>S No.</th>
                        <th>Passenger(s)</th>
                        <th>Baggage</th>
                        <th>Seat No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengerDetails
                        .filter(item => item.PaxType === "ADT" || item.PaxType === "CHD")
                        .map((item, index) => (
                          <tr key={item.Key}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.FirstName} {item.LastName}</strong>{" "}
                              <span className="text-muted">
                                ({item.PaxType === "ADT" ? "Adult" : "Child"})
                              </span>
                            </td>
                            <td>Check-In 15k, Cabin Upto 7k</td>
                            <td>No Seat Assigned</td>
                          </tr>
                        ))}

                    </tbody>
                  </Table>
                </>
              </div>
            ))
          }

        </Card>

        {/* Fare + Contact */}
        <Card className="p-2 p-sm-3 p-md-4 mt-5 shadow-sm border rounded-3">
          <Row>
            {/* Fare Summary */}
            <Col md={6} sm={12} className='border-end'>
              <h5 className="mb-0 fs-5 mb-4 text-start">Fare Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Base Fare</span>
                <span className="fw-bold"> ₹{(
                  parseFloat(booking.total_amount) + (booking.chips)
                ).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Taxes and Fees</span>
                <span className="fw-bold">₹ 0</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Applied Commission</span>
                <span className="fw-bold">- ₹ {booking.chips || 0}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Earn Commission</span>
                <span className="fw-bold"> ₹ {booking.earnCoins || 0}</span>
              </div>

              <hr />
              <div className="d-flex justify-content-between fw-bolder mt-2">
                <span>Total Price</span>
                <span>₹ {(parseFloat(booking.total_amount)).toFixed(2)}</span>
              </div>
            </Col>

            {/* Contact Details */}
            <Col md={6} sm={12} className="mt-4 mt-md-0 text-start">
              <h5 className="mb-0 fs-5 mb-4">Contact Details</h5>
              <div className="mb-2">
                <div className="text-muted">Full Name</div>
                <div className="fw-bold"><span>{booking.user.name}</span> <span>{booking.user.lastName}</span></div>
              </div>
              <div className="mb-2">
                <div className="text-muted">Passanger Mobile Number</div>
                <div className="fw-bold">{booking.user.phone}</div>
              </div>
              <div className="mb-2">
                <div className="text-muted">Email Id</div>
                <div className="fw-bold text-uppercase">{booking.user.email}</div>
              </div>
            </Col>
          </Row>
        </Card>

      </div>

       <Footer />
    </>
  )
}

export default SpecialTicket 
