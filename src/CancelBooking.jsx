import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './component/Footer'
import { FaCheckCircle } from "react-icons/fa";
import { IoAirplaneOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import toast from 'react-hot-toast';
import { calculatePassengerFare, formatDate, maskEmail, calculateTravelDurationIgnoreTimeZone, getAirportDataByCountry, getImageUrl1, getImageUrl, getAirlineName, calculateTravelTime, getServiceFee, getAdditiondiscount } from './utils/airlineUtils';
import { galileoApi } from './Api/apiService';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';
const CancelBooking = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const query = new URLSearchParams(location.search);
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [loading, setLoading] = useState(true);
  const success = query.get('status') === '200';
  const transitionId = query.get('transaction_id');
  const success1 = query.get('status1') === '200';
  const transitionId1 = query.get('transaction_id1');
  const [loadingcompon, setloadingcompon] = useState(false);
  const navigate = useNavigate();
  const [showGamePrompt, setShowGamePrompt] = useState(false);

  const popupTriggered = useRef(false);

  const onPlayGame = () => {
    navigate('/play-game');
  };

  // useEffect(() => {
  //   if (!data || popupTriggered.current) return;

  //   if (data?.booking_status === "Unknown" && user?.users?.role === 2) {
  //     popupTriggered.current = true;
  //     const t = setTimeout(() => setShowGamePrompt(true), 3000);
  //     return () => clearTimeout(t);
  //   }
  // }, [data, user]);
  const [state] = useState({
    success,
    transitionId,
  });
  const [state1] = useState({
    success1,
    transitionId1,
  });
  const [formateddata, setFormateddata] = useState(null);
  const [formateddata1, setFormateddata1] = useState(null);

  const fetchData = async (state, setFormattedData) => {
    const requestData = {
      "TransactionId": state
    }
    setLoading(true);
    try {
      // Replace with your API endpoint and axios request
      const response = await galileoApi("/Galileo/getUniversal", requestData);
      setFormattedData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flight details:", error);
    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    if (!data && state.transitionId && !state1.transitionId1) {
      fetchData(state.transitionId, setData);
    }

    if (state.transitionId && state1.transitionId1) {
      if (!data) fetchData(state?.transitionId, setData);
      if (!data1) fetchData(state1?.transitionId1, setData1);
    }
  }, [
    state.success,
    state.transitionId,
    state1.success1,
    state1.transitionId1,
  ]);

  useEffect(() => {
    const fetchFareData = async () => {
      try {
        const promises = [];
        if (data) {
          promises.push(calculatePassengerFare(data?.record?.Body?.UniversalRecordRetrieveRsp?.UniversalRecord, data?.trip, data?.tripType, data?.origin, data?.destination));
        }
        if (data1) {
          promises.push(calculatePassengerFare(data1?.record?.Body?.UniversalRecordRetrieveRsp?.UniversalRecord, data1?.trip, data1?.tripType));
        }

        const results = await Promise.all(promises);

        // Update the respective states
        if (data) {
          setFormateddata(results[0]);
        }
        if (data1) {
          setFormateddata1(results[1]);
        }
      } catch (error) {
        console.error("Error calculating passenger fare:", error);
      }
    };

    if (data || data1) {
      fetchFareData();
    }
  }, [data, data1]);


  const handleDownloadPDF = async (id) => {
    const reqbody = {
      transaction_id: id === 1 ? transitionId : transitionId1
    }
    setloadingcompon(true);
    try {
      const response = await galileoApi("/agent/ticket-genrate", reqbody, {});
      console.log("respnse => ", response);
      if (response.status === true && response?.ticket_url) {
        const pdfUrl = response.ticket_url;
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

  if (loading && !data) {
    return (
      <div className="container text-center py-5">
        <h3>Loading, please wait...</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  if (!data) {
    return (
      <div className="container text-center bg-info h-100 w-100 d-flex align-items-center justify-content-center py-5">
        <h3>No data Found</h3>
        {/* <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div> */}
      </div>
    );
  }

  const convertToIST = (utcDateTime) => {
    // Parse the UTC datetime string
    const date = new Date(utcDateTime);
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    };
    // Format the date to IST and return only the time
    return date?.toLocaleTimeString('en-IN', options);
  };

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
        <>
          <div id="ticket-content" className='text-[#1e1e1e]'>
            <h3 className='fs-4'><FaCheckCircle className={`text-success`} /> Congratulations! Your flight booking is <span className={`${data && data?.booking_status === 'HoldA' ? "text-danger" : data?.booking_status === 'Cancel' ? 'text-danger' : "text-success"}`}>{data && data?.booking_status === 'HoldA' ? "Hold" : data?.booking_status === 'Cancel' ? 'Cancel' : "confirmed"}!</span></h3>
            <div style={{ fontSize: '14px' }} className=' my-2 fw-normal'>*Booked On: {formateddata && formateddata?.createdDate ?
              `${formateddata?.createdDate}`
              : 'N/A'
            } {''}  {convertToIST(formateddata?.createdTime)} (UTC)*</div>
            <BookingDetails formateddata={formateddata} formateddata1={formateddata1} handleDownloadPDF={handleDownloadPDF} handleDownloadPDF1={handleDownloadPDF} bookingStatus={data && data?.booking_status} />

            {/* Passenger Details Section */}
            <Passengercomponent formateddata={formateddata?.flightdata} />
            {
              formateddata && formateddata?.flightdataRT && (
                <Passengercomponent formateddata={formateddata?.flightdataRT} />
              )
            }

            {
              formateddata1 && (

                <Passengercomponent formateddata={formateddata1?.flightdata} />
              )
            }
            {/* Flight Details Section */}
            <FlightDetails formateddata={formateddata?.flightdata} title="Onward flight" />
            {
              formateddata && formateddata?.flightdataRT && (
                <FlightDetails formateddata={formateddata?.flightdataRT} title="Return flight" />
              )
            }
            {
              formateddata1 && (

                <FlightDetails formateddata={formateddata1?.flightdata} title="Return flight" />
              )
            }

            {/* Contact Details Section */}
            <div className="card border-1 mt-4 shadow-sm">
              <div className="card-body">
                <div className="row">

                  <div className="col-md-6 border-end text-start pr-4">
                    <h5 className="mb-0 fs-5 mb-4">Fare Summary</h5>
                    <div className="d-flex fs-6 justify-content-between mb-2">
                      <span>Base Fare</span>
                      <strong>
                        ₹{" "}
                        {((formateddata?.Amount?.BaseFare || 0) + (formateddata1?.Amount?.BaseFare || 0) + (user?.users?.role === 2
                          ? (getServiceFee(data?.trip,data?.tripType, user?.users?.agent_type,data?.noOfAdults) * 3) / 4
                          : 0)).toLocaleString()}
                      </strong>
                    </div>
                    <div className="d-flex fs-6 justify-content-between mb-2">
                      <span>Taxes and Fees</span>
                      <strong>
                        ₹{" "}
                        {((formateddata?.Amount?.Taxes || 0) + (formateddata?.Amount?.Fees || 0) + (formateddata1?.Amount?.Taxes || 0) + (formateddata1?.Amount?.Fees || 0) + (user?.users?.role === 2
                          ? getServiceFee(data?.trip,data?.tripType, user?.users?.agent_type,data?.noOfAdults) / 4 
                          : 0)).toLocaleString()}
                      </strong>
                    </div>
                    <div className="d-flex fs-6 justify-content-between mb-2">
                      <span>Optional Services</span>
                      <strong>
                        ₹{" "}
                        {((formateddata?.Amount?.optionalPrice || 0) + (formateddata1?.Amount?.optionalPrice || 0)).toLocaleString()}
                      </strong>
                    </div>
                    {(!user || user?.users?.role === 1) &&
                      data?.charges &&
                      data?.useCoin === 0 &&
                      data?.earnCoins === 0 && (
                        <div className="d-flex fs-6 justify-content-between mb-2">
                          <span>Convenience Fee</span>
                          <strong>₹ {((data?.charges || 0) + (data?.plateformFee || 0))}</strong>
                        </div>
                      )}
                    {/* {
                      data && data?.discountAmt > 0 && (
                        <div className="d-flex fs-6 text-success justify-content-between mb-2">
                          <span>Discout</span>
                          <strong>
                            - ₹{" "}
                            {data && data?.discountAmt || 0}
                          </strong>
                        </div>
                      )
                    } */}
                    {
                      data && data?.discountAmt > 0 && (
                        <div className="d-flex fs-6 text-success justify-content-between mb-2">
                          <span>Discout</span>
                          <strong>
                            - ₹{" "}
                            {data && data?.discountAmt || 0}
                          </strong>
                        </div>
                      )
                    }
                    {
                      data && data?.useCoin > 0 && (
                        <div className="d-none fs-6 text-success justify-content-between mb-2">
                          <span>Applied Commission Earn</span>
                          <strong>
                            - ₹{" "}
                            {data && data?.useCoin || 0}
                          </strong>
                        </div>
                      )
                    }
                    {
                      data && data?.earnCoins > 0 && (
                        <div className="d-flex fs-6 text-success justify-content-between mb-2">
                          <span>Commission Earn</span>
                          <strong>
                            ₹{" "}
                            {data && data?.earnCoins || 0}
                          </strong>
                        </div>
                      )
                    }

                    <hr />
                    <div className="d-flex fs-6 justify-content-between fw-bold">
                      <span>Total Price</span>
                      {/* <strong>
                        ₹{" "}
                        {((formateddata?.Amount?.grandTotal || 0) + (formateddata1?.Amount?.grandTotal || 0) + (data && data?.charges || 0) - (data && data?.discountAmt || 0)).toLocaleString()}
                      </strong> */}
                      <div>
                        {
                          (!user || user && user?.users?.role === 1) ? (
                            <strong>
                              ₹{" "}
                              {(
                                (formateddata?.Amount?.grandTotal || 0) +
                                (formateddata1?.Amount?.grandTotal || 0) +
                                (
                                  ((!user || user?.users?.role === 1) &&
                                    data?.charges &&
                                    data?.useCoin === 0 &&
                                    data?.earnCoins === 0)
                                    ? (data?.charges || 0)
                                    : 0
                                ) + (
                                  ((!user || user?.users?.role === 1) && data?.plateformFee)
                                    ? (data?.plateformFee || 0)
                                    : 0
                                ) -
                                (data?.discountAmt || 0) -
                                (data?.useCoin || 0) +
                                (user?.users?.role === 2 ? getServiceFee(data?.trip,data?.tripType,user?.users?.agent_type,data?.noOfAdults) : 0)
                              ).toLocaleString()}
                            </strong>
                          ) : (
                            <>

                              <strike style={{ fontSize: '13px' }} className={`${user && user?.users.role === 2 && user?.users?.agent_type === 'A' ? '': 'd-none'}`}>
                                ₹{" "}
                                {(
                                  (formateddata?.Amount?.grandTotal || 0) +
                                  (formateddata1?.Amount?.grandTotal || 0) +
                                  (
                                    ((!user || user?.users?.role === 1) &&
                                      data?.charges &&
                                      data?.useCoin === 0 &&
                                      data?.earnCoins === 0)
                                      ? (data?.charges || 0)
                                      : 0
                                  ) + (
                                    ((!user || user?.users?.role === 1) && data?.plateformFee)
                                      ? (data?.plateformFee || 0)
                                      : 0
                                  ) -
                                  (data?.discountAmt || 0) -
                                  (data?.useCoin || 0) +
                                  (user?.users?.role === 2 ? getServiceFee(data?.trip,data?.tripType,user?.users?.agent_type,data?.noOfAdults) : 0)
                                ).toLocaleString()}
                              </strike>
                              <span className='ms-2'>
                                ₹{" "}
                                {(
                                  (formateddata?.Amount?.grandTotal || 0) +
                                  (formateddata1?.Amount?.grandTotal || 0) +
                                  (
                                    ((!user || user?.users?.role === 1) &&
                                      data?.charges &&
                                      data?.useCoin === 0 &&
                                      data?.earnCoins === 0)
                                      ? (data?.charges || 0)
                                      : 0
                                  ) + (
                                    ((!user || user?.users?.role === 1) && data?.plateformFee)
                                      ? (data?.plateformFee || 0)
                                      : 0
                                  ) -
                                  (data?.discountAmt || 0) -
                                  (data?.useCoin || 0) +
                                  (user?.users?.role === 2 ? getServiceFee(data?.trip,data?.tripType,user?.users?.agent_type,data?.noOfAdults) : 0) -
                                  (
                                    (user?.users?.role === 2 && user?.users?.agent_type === 'A')
                                      ? getAdditiondiscount(data?.trip)
                                      : 0
                                  )
                                ).toLocaleString()}
                              </span>
                            </>

                          )
                        }
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 text-start">
                    <h5 className="mb-0 fs-5 mb-4">Contact Details</h5>
                    {/* <div className="mt-2">
                      <div className="text-muted">Address</div>
                      <strong>New Delhi</strong>
                    </div> */}
                    <div className="mt-2">
                      <div className="text-muted">Full Name</div>
                      <strong className='text-uppercase'>
                        {formateddata && formateddata?.PassengerDetails ?
                          `${formateddata?.PassengerDetails[0].Prefix} ${formateddata?.PassengerDetails[0].FirstName} ${formateddata?.PassengerDetails[0].LastName}`
                          : 'N/A'
                        }
                      </strong>

                    </div>
                    <div className="mt-2">
                      <div className="text-muted">Passanger Mobile Number</div>
                      <strong className='text-uppercase'>
                        {formateddata && formateddata?.PassengerDetails ?
                          `${formateddata?.PassengerDetails[0].PhoneNumber}`
                          : 'N/A'
                        }
                      </strong>
                    </div>
                    <div className="mt-2 ">
                      <div className="text-muted">Email Id</div>
                      <strong className='text-uppercase'>
                        {formateddata && formateddata?.PassengerDetails && formateddata?.PassengerDetails[0].Email
                          ? maskEmail(formateddata?.PassengerDetails[0].Email)
                          : 'N/A'}
                      </strong>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      {showGamePrompt && (
        <div
          // className="modal fade show d-block"

          className="modal fade show d-none"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Continue to Play?</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowGamePrompt(false)}
                />
              </div>
              <div className="modal-body">
                <p>
                  Your booking is <strong className='text-success'> confirmed!</strong> Would you like to play a quick game and win exciting prizes?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowGamePrompt(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onPlayGame}
                >
                  Play Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />

    </>

  );
};

export default CancelBooking;



const FlightDetails = ({ formateddata, title }) => {
  return (
    <div className='d-inline-block gap-3 w-100'>
      <div className='d-flex w-100 align-items-center justify-content-between rounded p-3 border'>
        <div className="w-100 d-block overflow-hidden">
          <div className=" text-start border-0">
            <h5 className="mb-0 d-flex align-items-center justify-content-start">Flight Details - <span className='text-muted' style={{ fontSize: '12px' }}>{title}</span></h5>
          </div>
          <div className=" my-2 mb-4 text-start">
            <div style={{ fontSize: '14px' }} className='p-0 fw-normal'>
              <IoAirplaneOutline size={20} /> <>Departing Flight</> {" "}
              {formateddata && formateddata[0].flightData ?
                `${formateddata[0].flightData["@attributes"].DepartureTime.substring(0, 10)}`
                : 'N/A'
              }  {" - "} {formateddata
                ? (
                  formateddata.length === 1
                    ? 'Nonstop'
                    : `${formateddata.length - 1} Stop${formateddata.length - 1 > 1 ? 's' : ''}`
                )
                : 'N/A'}
            </div>
          </div>

          {
            formateddata && (
              <div className="text-start mb-3">
                {getAirportDataByCountry(formateddata && formateddata[0].flightData["@attributes"].Origin, 'city')} (<strong>{formateddata && formateddata[0].flightData["@attributes"].Origin}</strong>) → {getAirportDataByCountry(formateddata && formateddata[formateddata.length - 1]?.flightData["@attributes"]?.Destination, "city")} (<strong>{formateddata && formateddata[formateddata.length - 1]?.flightData["@attributes"]?.Destination}</strong>) (T{formateddata && formateddata[0]?.flightData?.FlightDetails && formateddata[0]?.flightData?.FlightDetails["@attributes"] && formateddata[0]?.flightData?.FlightDetails["@attributes"]?.OriginTerminal})

              </div>

            )
          }



          {
            formateddata &&
            formateddata?.map((data, index) => (
              <div className="" key={index}>
                {/* Flight Header */}
                <div className="text-muted d-flex gap-2">
                  <img style={{ width: '20px', height: '20px' }}
                    src={getImageUrl1(`/flightlogo/${data.flightData["@attributes"].Carrier}.png`)}
                    className='img-fluid-flight'
                    alt=""
                  />
                  <div>
                    {data?.flightData
                      ? `${data.flightData["@attributes"].Carrier} - ${data.flightData["@attributes"].FlightNumber}`
                      : "N/A"}{" "}
                    •{" "}
                    {data?.flightData
                      ? `${data.flightData["@attributes"].CabinClass}`
                      : "N/A"}
                  </div>

                </div>

                {/* Flight Details */}
                <div style={{ borderLeft: "2px dashed #c2c2d6" }} className="pl-2">
                  <div className="text-start">
                    <strong className="mr-2">
                      {data.flightData["@attributes"]?.DepartureTime.substring(11, 16)}
                    </strong>{" "}
                    <span>
                      {data?.flightData["@attributes"].Origin} -{" "}
                      {getAirportDataByCountry(data?.flightData["@attributes"].Origin, "airport")}
                    </span>
                  </div>

                  {/* Travel Time */}
                  <div
                    style={{ fontSize: "13px" }}
                    className="text-start px-2 ml-5 my-2 text-muted"
                  >
                    Travel Time{" "}
                    <strong className='text-black'>
                      {calculateTravelDurationIgnoreTimeZone(
                        data.flightData["@attributes"]?.DepartureTime, data.flightData["@attributes"]?.ArrivalTime
                      )}</strong>
                  </div>

                  <div className="text-start">
                    <strong className="mr-2">
                      {data.flightData["@attributes"]?.ArrivalTime.substring(11, 16)}
                    </strong>{" "}
                    <span>
                      {data?.flightData["@attributes"].Destination} -{" "}
                      {getAirportDataByCountry(data?.flightData["@attributes"].Destination, "airport")}
                    </span>
                  </div>

                  {/* Layover Section */}


                </div>
                {
                  index < formateddata.length - 1 && (
                    <div className='p-2 fw-medium  text-start my-4 bg-light gap-3 col-md-6 col-lg-6'>

                      <strong className="fw-bold text-danger mr-2">
                        {
                          calculateTravelTime(
                            data?.flightData["@attributes"]?.ArrivalTime,
                            formateddata[index + 1]?.flightData["@attributes"]?.DepartureTime
                          )
                        }
                      </strong>
                      layover at •  {getAirportDataByCountry(formateddata[index + 1]?.flightData["@attributes"]?.Origin, "city")} <strong>Change of aircraft</strong>
                    </div>
                  )
                }

              </div>
            ))
          }


        </div>


      </div>
      {
        formateddata && (
          <div className='my-2 ml-1'>
            Operated By :  <img style={{ width: '30px', height: '30px' }}
              src={getImageUrl1(`/flightlogo/${formateddata[0].flightData["@attributes"].Carrier}.png`)}
              className='img-fluid-flight'
              alt=""
            /> { } {getAirlineName(formateddata[0].flightData["@attributes"]?.Carrier)}
          </div>

        )
      }
    </div>
  )
}

const Passengercomponent = ({ formateddata }) => {
  return (
    <div className="card border-1 my-4">
      <div className="card-header text-start bg-white border-0">
        <h5 className="mb-0">Passenger(s) Details</h5>
      </div>
      <div className="card-body text-start">
        <div className="d-lg-block gap-4 text-start align-items-lg-end mb-3">


          <div className="d-block gap-4 text-start align-items-lg-end mb-1">
            {formateddata &&
              formateddata.map((data, index) => (
                <div key={index} className='mb-5'>
                  <div className="flex mb-2">
                    <strong><span className='text-muted fs-6'>{getAirportDataByCountry(data.flightData["@attributes"].Origin, "city")}</span> ({data?.flightData["@attributes"].Origin})</strong>{" "}
                    <i className="bi bi-arrow-right"></i>{" "}
                    <strong> <span className='text-muted fs-6'>{getAirportDataByCountry(data.flightData["@attributes"].Destination, "city")}</span> ({data?.flightData["@attributes"].Destination})</strong>
                    <div className="text-muted d-flex mt-2 gap-2">
                      <img style={{ width: '20px', height: '20px' }}
                        src={getImageUrl1(`/flightlogo/${data.flightData["@attributes"].Carrier}.png`)}
                        className='img-fluid-flight'
                        alt=""
                      />
                      <div>
                        {data?.flightData
                          ? `${data.flightData["@attributes"].Carrier} - ${data.flightData["@attributes"].FlightNumber}`
                          : "N/A"}{" "}
                        •{" "}
                        {data?.flightData
                          ? `${data.flightData["@attributes"].CabinClass}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <table className="table table-bordered text-start">
                    <thead className="table-secondary">
                      <tr>
                        <th scope="col">S No.</th>
                        <th scope="col">Passenger(s)</th>
                        <th scope="col">Baggage</th>
                        <th scope="col">Seat No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.customerInfo && data.customerInfo.length > 0 ? (
                        data.customerInfo.map((customer, customerIndex) => (
                          <tr key={customerIndex}>
                            <td>{customerIndex + 1}</td>
                            <td>
                              <strong>
                                {customer.Prefix} {customer.FirstName}{" "}
                                {customer.LastName}
                              </strong>{" "}
                              <span className="text-muted">
                                (
                                {customer.TravelerType === "ADT"
                                  ? "Adult"
                                  : customer.TravelerType === "CNN"
                                    ? "Child"
                                    : customer.TravelerType === "CHD"
                                      ? "Child"
                                      : customer.TravelerType === "INF"
                                        ? "Infant"
                                        : "Transgender"}
                                )
                              </span>
                            </td>
                            <td>
                              Check-In  {customer.Baggagesymbol === "Piece(s)"
                                ? `${customer.BaggageUnit} Pc`
                                : `${customer.BaggageUnit}${customer.Baggagesymbol === "Kilograms" ? 'k' : ''}`
                              }, Cabin
                              Upto 7k
                            </td>
                            <td className="text-start">
                              {customer.Seat
                                ? `${customer.Seat.slice(0, -1).replace(
                                  /^0+/,
                                  ""
                                )}-${customer.Seat.slice(-1)}`
                                : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>


          {/* <img
                      src="https://barcode.tec-it.com/barcode.ashx?data=ABC-abc-1234&code=Code128&translate-esc=on"
                      alt="Barcode"
                      className="img-fluid mt-2"
                      style={{ maxHeight: "40px" }}
                    /> */}

          {/* {formateddata && formateddata.FlightDetails && formateddata.FlightDetails.length > 0 && (
                    <img
                    src={generateBarcode(formateddata.FlightDetails[0],formateddata.Pnr)}
                      alt="Barcode"
                      className="img-fluid mt-2"
                      
                    />
                  )} */}
        </div>

      </div>
    </div>
  )
}

const BookingDetails = ({ formateddata, formateddata1, handleDownloadPDF, handleDownloadPDF1, bookingStatus }) => {

  const checkCondition = formateddata && formateddata?.flightdataRT ? "showdata" : "hidedata";

  return (
    <div className="card text-start border-1 mt-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-5">
            <div>
              <div style={{ fontSize: '14px' }}>PNR/Booking Reference: {formateddata1 && (<>- <span className=''>Onward flight</span> </>)}</div>
              <div className='d-block'>
                <span className='d-flex align-items-center gap-2 justify-content-start'>
                  <strong>

                    {formateddata ? formateddata.Pnr : null}{" "}
                  </strong>
                  <span className={`badge ${bookingStatus && bookingStatus === 'HoldA' ? 'bg-danger' : bookingStatus === 'Cancel' ? 'bg-danger' : 'bg-success'} bg-success text-white`}>{bookingStatus && bookingStatus === 'HoldA' ? 'Hold' : bookingStatus === 'Cancel' ? 'Cancel' : 'Confirm'}</span>
                </span>
              </div>
            </div>

            {
              checkCondition && checkCondition === 'showdata' ? (
                <div className={`mt-2 `}>
                  <h5 className='my-3'>{getAirportDataByCountry(formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Origin, 'city')} ( <strong>{formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Origin}</strong> )  →  {getAirportDataByCountry(formateddata && formateddata?.flightdataRT[0].flightData["@attributes"].Origin, 'city')} ( <strong>{formateddata && formateddata?.flightdataRT[0].flightData["@attributes"].Origin}</strong> ) → {getAirportDataByCountry(formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT?.length - 1].flightData["@attributes"].Destination, 'city')} ( <strong>{formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT?.length - 1].flightData["@attributes"].Destination}</strong> )</h5>
                  <div className='d-block gap-2 mb-3'>
                    <div className="text-muted d-flex gap-1">

                      <div>
                        {formatDate(formateddata && formateddata?.flightdata && formateddata?.flightdata[0]?.flightData["@attributes"]?.DepartureTime)}
                      </div>
                      •
                      <div>
                        {formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.DepartureTime?.substring(11, 16)}
                      </div>
                      -
                      <div>
                        {formateddata && formateddata?.flightdata[formateddata?.flightdata.length - 1]?.flightData["@attributes"]?.ArrivalTime?.substring(11, 16)}
                      </div>
                    </div>

                    <strong>
                      {formateddata && formateddata?.flightdata
                        ? `${getAirportDataByCountry(formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Origin, "city")} (${formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Origin})`
                        : 'N/A'}</strong> → <strong>  {formateddata && formateddata?.flightdata
                          ? `${getAirportDataByCountry(formateddata && formateddata?.flightdata[formateddata?.flightdata.length - 1]?.flightData["@attributes"]?.Destination, "city")} (${formateddata && formateddata?.flightdata[formateddata?.flightdata.length - 1]?.flightData["@attributes"]?.Destination})`
                          : 'N/A'}</strong> ( Onward - flight )
                    <div className="text-muted d-flex gap-2">            <img style={{ width: '20px', height: '20px' }}
                      src={getImageUrl1(`/flightlogo/${formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Carrier}.png`)}

                      className='img-fluid-flight'
                      alt=""
                    /> <div>{formateddata && formateddata?.FlightDetails ?
                      `${formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.Carrier} - ${formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.FlightNumber}`
                      : 'N/A'
                    }  • {formateddata?.flightdata
                      ? formateddata.flightdata.length === 1
                        ? 'nonStop'
                        : `${formateddata.flightdata.length - 1} Stop${formateddata.flightdata.length - 1 > 1 ? 's' : ''}`
                      : 'N/A'}
                        {" • "} {calculateTravelTime(formateddata && formateddata?.flightdata[0]?.flightData["@attributes"]?.DepartureTime, formateddata && formateddata?.flightdata[formateddata?.flightdata.length - 1]?.flightData["@attributes"]?.ArrivalTime)}</div></div>
                  </div>
                  <div className='d-block gap-2'>
                    <div className="text-muted d-flex gap-1">

                      <div>
                        {formatDate(formateddata && formateddata?.flightdataRT && formateddata?.flightdataRT[0]?.flightData["@attributes"]?.DepartureTime)}
                      </div>
                      •
                      <div>
                        {formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"]?.DepartureTime?.substring(11, 16)}
                      </div>
                      -
                      <div>
                        {formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT.length - 1]?.flightData["@attributes"]?.ArrivalTime?.substring(11, 16)}
                      </div>
                    </div>

                    <strong>
                      {formateddata && formateddata?.flightdataRT
                        ? `${getAirportDataByCountry(formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"]?.Origin, "city")} (${formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"]?.Origin})`
                        : 'N/A'}</strong> → <strong>  {formateddata && formateddata?.flightdataRT
                          ? `${getAirportDataByCountry(formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT.length - 1]?.flightData["@attributes"]?.Destination, "city")} (${formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT.length - 1]?.flightData["@attributes"]?.Destination})`
                          : 'N/A'}</strong> ( Return - flight )
                    <div className="text-muted d-flex gap-2">            <img style={{ width: '20px', height: '20px' }}
                      src={getImageUrl1(`/flightlogo/${formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"].Carrier}.png`)}

                      className='img-fluid-flight'
                      alt=""
                    /> <div>{formateddata && formateddata?.flightdataRT ?
                      `${formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"].Carrier} - ${formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"].FlightNumber}`
                      : 'N/A'
                    }  • {formateddata?.flightdataRT
                      ? formateddata.flightdataRT.length === 1
                        ? 'nonStop'
                        : `${formateddata.flightdataRT.length - 1} Stop${formateddata.flightdataRT.length - 1 > 1 ? 's' : ''}`
                      : 'N/A'}
                        {" • "} {calculateTravelTime(formateddata && formateddata?.flightdataRT[0]?.flightData["@attributes"]?.DepartureTime, formateddata && formateddata?.flightdataRT[formateddata?.flightdataRT.length - 1]?.flightData["@attributes"]?.ArrivalTime)}</div></div>
                  </div>


                </div>
              ) : (
                <div className={`mt-2`}>
                  <div className="text-muted d-flex gap-1">
                    <div>
                      {formateddata && formateddata?.FlightDetails && formateddata?.FlightDetails[0]?.DepartureDate
                        ? formatDate(formateddata.FlightDetails[0].DepartureDate)
                        : 'N/A'}
                    </div>
                    •
                    <div>
                      {formateddata?.FlightDetails?.[0]?.DepartureTime
                        ? formateddata.FlightDetails[0].DepartureTime.substring(11, 16)
                        : 'N/A'}
                    </div>
                    -
                    <div>
                      {formateddata?.FlightDetails?.[0]?.ArrivalTime
                        ? formateddata.FlightDetails[0].ArrivalTime.substring(11, 16)
                        : 'N/A'}
                    </div>
                  </div>

                  <strong>
                    {formateddata && formateddata?.FlightDetails
                      ? `${getAirportDataByCountry(formateddata?.FlightDetails[0].Origin, "city")} (${formateddata?.FlightDetails[0].Origin})`
                      : 'N/A'}</strong> → <strong>  {formateddata && formateddata?.FlightDetails
                        ? `${getAirportDataByCountry(formateddata?.FlightDetails[0].Destination, "city")} (${formateddata?.FlightDetails[0].Destination})`
                        : 'N/A'}</strong>
                  <div className="text-muted d-flex gap-2">            <img style={{ width: '20px', height: '20px' }}
                    src={getImageUrl1(`/flightlogo/${formateddata?.FlightDetails[0].CarrierFlightInfo[0].CarrierCode}.png`)}

                    className='img-fluid-flight'
                    alt=""
                  /> <div>{formateddata && formateddata?.FlightDetails ?
                    `${formateddata?.FlightDetails[0].CarrierFlightInfo[0].CarrierCode} - ${formateddata?.FlightDetails[0].CarrierFlightInfo[0].FlightNumber}`
                    : 'N/A'
                  }  • {formateddata && formateddata?.FlightDetails ?
                    `${formateddata?.FlightDetails[0].StopFlight}`
                    : 'N/A'
                      } • {formateddata && formateddata?.FlightDetails ?
                        `${formateddata?.FlightDetails[0].TotalTravelTime}`
                        : 'N/A'
                      }</div></div>
                </div>
              )
            }


          </div>

          {
            formateddata1 && (
              <div className="col-md-5">
                <div>
                  <div style={{ fontSize: '14px' }}>PNR/Booking Reference: - <span className=''>Return flight</span></div>
                  <div className='d-block'>
                    <span className='d-flex align-items-center gap-2 justify-content-start'>
                      <strong>

                        {formateddata1 ? formateddata1.Pnr : null}{" "}
                      </strong>
                      <span className="badge bg-success text-white">Confirmed</span>
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-muted d-flex gap-1">
                    <div>
                      {formateddata1 && formateddata1?.FlightDetails && formateddata1?.FlightDetails[0]?.DepartureDate
                        ? formatDate(formateddata1.FlightDetails[0].DepartureDate)
                        : 'N/A'}
                    </div>
                    •
                    <div>
                      {formateddata1?.FlightDetails?.[0]?.DepartureTime
                        ? formateddata1.FlightDetails[0].DepartureTime.substring(11, 16)
                        : 'N/A'}
                    </div>
                    -
                    <div>
                      {formateddata1?.FlightDetails?.[0]?.ArrivalTime
                        ? formateddata1.FlightDetails[0].ArrivalTime.substring(11, 16)
                        : 'N/A'}
                    </div>
                  </div>

                  <strong>
                    {formateddata1 && formateddata1?.FlightDetails
                      ? `${getAirportDataByCountry(formateddata1?.FlightDetails[0].Origin, "city")} (${formateddata1?.FlightDetails[0].Origin})`
                      : 'N/A'}</strong> → <strong>  {formateddata1 && formateddata1?.FlightDetails
                        ? `${getAirportDataByCountry(formateddata1?.FlightDetails[0].Destination, "city")} (${formateddata1?.FlightDetails[0].Destination})`
                        : 'N/A'}</strong>
                  <div className="text-muted d-flex gap-2">            <img style={{ width: '20px', height: '20px' }}
                    src={getImageUrl1(`/flightlogo/${formateddata1?.FlightDetails[0].CarrierFlightInfo[0].CarrierCode}.png`)}
                    className='img-fluid-flight'
                    alt=""
                  /> <div>{formateddata1 && formateddata1?.FlightDetails ?
                    `${formateddata1?.FlightDetails[0].CarrierFlightInfo[0].CarrierCode} - ${formateddata1?.FlightDetails[0].CarrierFlightInfo[0].FlightNumber}`
                    : 'N/A'
                  }  • {formateddata1 && formateddata1?.FlightDetails ?
                    `${formateddata1?.FlightDetails[0].StopFlight}`
                    : 'N/A'
                      } • {formateddata1 && formateddata1?.FlightDetails ?
                        `${formateddata1?.FlightDetails[0].TotalTravelTime}`
                        : 'N/A'
                      }</div></div>
                </div>

              </div>
            )
          }
          <div className="col-md-2 text-start">
            <div>
              <div style={{ fontSize: '14px' }}>Payment Status:</div>
              <strong className="">{bookingStatus && bookingStatus === 'HoldA' ? 'Pending' : 'Complete'}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="d-flex flex-wrap justify-content-start gap-3 mt-4"> */}
        <div className="row col-12 d-flex flex-wrap mt-4">
          {/* <button style={{ width: '80px', height: '80px' }} className="btn btn-outline-primary btn-sm">
            <FaEdit size={24} />
            <div>Modify</div>
          </button>
          <button className="btn btn-outline-primary btn-sm">
            <IoTicketOutline size={24} />
            <div>6E Add-ons</div>

          </button>
          <button className="btn btn-outline-primary btn-sm">
            <MdEmail size={24} />
            <div>Email Itinerary</div>

          </button> */}
          <div className='col-lg-5 d-flex flex-wrap justify-content-start gap-3"'>
            <button onClick={() => handleDownloadPDF(1)} style={{ width: '100px', height: '80px' }} className="btn btn-outline-primary btn-sm">
              <FiDownload size={24} />
              <div>Download</div>
            </button>
            {/* <button className="btn mx-lg-3 btn-outline-primary btn-sm">
          <FaPlaneCircleExclamation size={24} />
          <div> Flight Status</div>

        </button> */}
          </div>
          {
            formateddata1 && (
              <div className=' col-6 d-flex flex-wrap mt-4 mt-lg-0 justify-content-start gap-3'>
                <button onClick={() => handleDownloadPDF1(2)} style={{ width: '100px', height: '80px' }} className="btn btn-outline-primary btn-sm">
                  <FiDownload size={24} />
                  <div>Download</div>
                </button>
                {/* <button className="btn btn-outline-primary btn-sm">
          <FaPlaneCircleExclamation size={24} />
          <div> Flight Status</div>

        </button> */}
              </div>
            )
          }
        </div>

      </div>
    </div>
  )
}