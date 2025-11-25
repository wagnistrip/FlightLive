
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container, Grid, Typography, Radio, Tooltip, CircularProgress, Checkbox, RadioGroup, FormControlLabel, TextField, Box, Divider, Stack } from '@mui/material';
import TravellersDetails from '../travellsdetails/TravellersDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import Offer from '../Offer';
import Button from '@mui/material/Button';
import { setCommonChips, setGreenChipsUsed } from '../../redux/actions/bookingActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import FlightReviewBottom from '../FlightReviewBottom';
import { decryptPayload, encryptPayload, galileoApi } from '../../Api/apiService';
import { calculateTravelTime, getAirlineName, getAirportDataByCountry, getFlightSegments, getImageUrl1 } from '../../utils/airlineUtils';
import LoadingPage from '../../LoadingPage';
import CouponPurchase from '../CouponPurchase';

const SpecialFlightDetails = () => {
  const location = useLocation();
  const [passangerData, setPassangerData] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isPaying, setIsPaying] = useState(false);
  const [loadingcompon, setloadingcompon] = useState(false);
  const [selectedOption, setSelectedOption] = useState("withPrice");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [markup, setMarkup] = useState("");
  let allflight = [];
  let originCity = '';
  let destinationCity = '';
  let formatedate = ''

  const user = useSelector((state) => state.auth.user);
  const walletAmout = useSelector((state) => state.booking.walletAmount); // note: store key kept as-is
  const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
  const isGreenChipsUsed = useSelector((state) => state.booking.isGreenChipsUsed);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseData1 = location.state?.responseData1;
  const flight = responseData1?.responseData;
  const travellers = responseData1?.travellers;
  // --- Guards (optional) ---
  if (!responseData1 || !flight) {
    return (
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Typography variant="h6" align="center">No flight data found.</Typography>
      </Container>
    );
  }

  const goToStep = (step) => setActiveStep(step);

  const handlePassengersData = (
    email,
    localNumber,
    passengers,
    trips,
    triptype,
    adult,
    children,
    infant,
    apiType,
    countryCodevl,
    gstData
  ) => {
    setloadingcompon(true);
    const formData = {
      otherInformation: triptype,
      trip: trips,
      GstDetails: gstData ? gstData : '',
      travellerquantity: {
        noOfAdults: adult,
        noOfChilds: children,
        noOfInfants: infant
      },
      CustomerInfo: {
        Email: email,
        Mobile: localNumber,
        Address: "new delhi",
        City: "Rohini",
        State: "Delhi",
        CountryCode: "INR",
        CountryName: countryCodevl,
        ZipCode: "400101",
        PassengerDetails: passengers,
      },
    };

    setTimeout(() => {
      setPassangerData(formData);
      goToStep(2);
      setloadingcompon(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(setGreenChipsUsed(false));
  }, [])

  const trip = responseData1?.trip;

  const handleRadioChange = (amt) => {
    // dispatch(setGreenChipsUsed(!isGreenChipsUsed));
    // // If you’ll add tiered deductions later, compute here; right now it’s pass-through.
    // const deduction = greenChipsPrice - amt;
    // dispatch(setCommonChips(deduction));
    const deduction = amt;
    if (isGreenChipsUsed) {
      const deduction = greenChipsPrice + amt;
      dispatch(setGreenChipsUsed(false));
      dispatch(setCommonChips(deduction));
    } else {
      // checking
      const deduction = greenChipsPrice - amt;
      dispatch(setGreenChipsUsed(true));
      dispatch(setCommonChips(deduction));
    }
  };

  const getPassangerPaxtye = (passanger) => {
    if (passanger === "ADT") return "Adult";
    if (passanger === "CHD") return "Child";
    if (passanger === "INF") return "Infant";
    return passanger;
  };

  const walletBalance = Number(walletAmout || 0);
  // const totalFare = Number(flight?.total_payable_price || 0);
  const totalFare = Math.floor(Number(flight?.total_payable_price || 0) + (flight?.onward_connecting ? 300 : 0) + (flight?.ticket_id ? flight?.total_payable_price * 0.05 : 0));
  const passengerCount = (travellers?.adults || 0) + (travellers?.children || 0);
  // const baseFare = totalFare * passengerCount;
  const baseFare = totalFare
  // const baseFare = Number(flight?.price || 0);
  const chipsValue = Number(isGreenChipsUsed
    ? passengerCount * (responseData1?.useCoin || 0)
    : 0
  );

  const earnPercent = parseFloat(responseData1?.earnCoin?.replace('%', '') || 5);
  const commissionEarn = Math.round((flight?.total_payable_price || 0) * (earnPercent / 100));

  const grandTotal = baseFare
    + (passengerCount * (trip === 'D' ? 600 : 1000))
    - (isGreenChipsUsed ? chipsValue : 0);


  const canPayWithWallet = walletBalance >= grandTotal && !!passangerData && !isPaying;

  const payDisabledReason = useMemo(() => {
    if (!passangerData) return "Please fill traveller details first.";
    if (isPaying) return "Processing payment…";
    if (walletBalance < grandTotal) {
      return `Wallet balance must be at least ₹${grandTotal.toLocaleString()}. Current: ₹${walletBalance.toLocaleString()}.`;
    }
    return null;
  }, [passangerData, isPaying, walletBalance, grandTotal]);

  if (flight) {

    const fdSegments = getFlightSegments(flight);
    allflight = [...fdSegments];

    if (flight?.legs) {
      originCity = getAirportDataByCountry(flight?.origin_code, 'city') || 'Delhi'
      destinationCity = getAirportDataByCountry(flight?.destination_code, 'city') || 'Mumbai'
      formatedate = flight?.departure_time || ''
    }
    else if (flight?.onward_connecting) {
      originCity = getAirportDataByCountry(flight?.dep_airport_code, 'city') || 'Mumbai'
      destinationCity = getAirportDataByCountry(flight?.arr_airport_code, 'city') || 'Delhi'
      if (flight?.onward_date && flight?.dep_time) {
        formatedate = `${flight.onward_date}T${flight.dep_time}:00.000Z`;
      } else {
        formatedate = '';
      }
    }
    else if (flight?.ticket_id) {
      originCity = getAirportDataByCountry(flight?.origin, "city") || "Mumbai";
      destinationCity = getAirportDataByCountry(flight?.destination, "city") || "Delhi";

      if (flight?.departure_date && flight?.departure_time) {
        formatedate = `${flight.departure_date.replace(/\//g, "-")}T${flight.departure_time}:00.000Z`;
      } else {
        formatedate = "";
      }
    }
  }


  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleMarkupChange = (e) => {
    setMarkup(e.target.value);
  };

  console.log("data => res ",responseData1)

  
  const handlePayment = async (data) => {

    if (!flight || !passangerData) {
      toast.error("Flight or passenger data missing");
      return;
    }
    if (walletBalance < grandTotal) {
      toast.error("Insufficent balance");
      return;
    }
    const token = user?.token
    const travellersCount = travellers?.adults + travellers?.children;
    const requestbody = {
      special_flight_id: flight.id,
      passenger_data: [passangerData],
      chips: isGreenChipsUsed ? chipsValue : 0,
      totalAmt: grandTotal,
      seatCount: travellersCount,
      earnCoins: commissionEarn || 0,
      paymentShow: selectedOption || 0,
      markUp: markup || "0",
    }
    if (data?.price_breakup) {
      requestbody.flight = data;
      requestbody.booking_token_id = responseData1?.booking_token_id || ""
    }
    if (data?.ticket_id) {
      requestbody.airIq = data;
      requestbody.IQtoken = responseData1?.IQtoken || "";
    }

    console.log('requestbody => ', requestbody);
    // return;
    setIsPaying(true);

    try {

      const encryptedPayload = encryptPayload(requestbody || '');
      const responseData1 = await galileoApi('/passangerCreate', { payload: encryptedPayload }, token);
      const decryptedResponse1 = decryptPayload(responseData1?.data || "");
      const response = JSON?.parse(decryptedResponse1);
      console.log("response => ", responseData1, response, requestbody);
      // return;
      if (response?.status === 201 && response?.booking?.status === "Success") {
        // navigate("/SpecialTicket-booking", {
        //   state: { booking: response.booking, passenger: response.passenger },
        // });

        const alreadyHasSpecialFlight = !!response.booking?.special_flight;
        const updatedBooking = alreadyHasSpecialFlight
          ? response.booking
          : {
            ...response.booking,
            special_flight: flight
          };
        // console.log("Special flight => ",updatedBooking,response.passenger)
        // Navigate with updated booking
        navigate("/SpecialTicket-booking", {
          state: {
            booking: updatedBooking,
            passenger: response.passenger
          }
        });



      } else {
        navigate("/payment-error", {
          state: { error: response?.message || "Payment Failed" },
        });
      }
    } catch (error) {
      console.error("Error sending payment request:", error);
      navigate("/payment-error", {
        state: { error: "Payment request failed. Please try again." },
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>

      {loadingcompon && (
        <LoadingPage />
      )}
      <Offer title="Review & Payment" />

      <Container maxWidth="xl" sx={{ mt: 10, mb: 3 }}>
        <div className=' my-4 mt-5'>
          <h6>
            <span className={`fw-bold ${activeStep === 1 ? 'text-primary' : activeStep > 1 ? 'text-success' : 'text-muted'}`}>
              1. Review
            </span>
            <span className='px-3 text-muted'><i className='fas fa-greater-than'></i></span>
            <span className={` fw-bold ${activeStep === 2 ? 'text-primary fw-bold' : activeStep > 2 ? 'text-success' : 'text-muted'}`}>
              2. Travellers
            </span>
            <span className='px-3 text-muted'><i className='fas fa-greater-than'></i></span>
            <span className={` fw-bold ${activeStep === 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
              3. Payment
            </span>
          </h6>
        </div>

        <Grid container spacing={2}>
          {/* Left Panel: Flight Detail */}
          <Grid item xs={12} md={8}>
            <div className="bg-white card rounded">
              <div className="flight-detail-depart text-start">
                <h6><i className="fas fa-plane-departure me-3"></i> <span className="text-dark">Flight Detail</span></h6>
              </div>

              <div className="p-3">
                <div className="row mt-3 pl-3">
                  <div className="col-lg-12">
                    <div className="from-to-detail text-start">
                      <span className="h5">{originCity} - {destinationCity}</span> |
                      <span className="text-muted ms-2">
                        {new Date(formatedate).toLocaleDateString('en-GB', {
                          weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {
                  allflight && allflight.map((segment, index) => (
                    <FlightCardData key={index} segment={segment} segIndex={index} flight={allflight} />
                  ))
                }
              </div>
            </div>

            <FlightReviewBottom departCity={originCity} arriveCity={destinationCity} />
          </Grid>

          {/* Right Panel: Price Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  Price Summary
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <i className="fas fa-male" />
                    <Typography variant="body2">{responseData1?.travellers?.adults}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <i className="fas fa-child" />
                    <Typography variant="body2">{responseData1?.travellers?.children}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <i className="fas fa-baby" />
                    <Typography variant="body2">{responseData1?.travellers?.infants}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Fare */}
              <Box display="flex" justifyContent="space-between" py={1.2}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Fare:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹ {(baseFare + passengerCount * (trip === "D" ? 600 : 1000)).toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Divider />

              {/* Grand Total */}
              <Box display="flex" justifyContent="space-between" py={1.2}>
                <Typography variant="subtitle1" fontWeight="medium" color="primary">
                  Grand Total:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="error">
                  ₹ {(grandTotal + (isGreenChipsUsed ? chipsValue : 0)).toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Divider />

              {/* Payable Amount (if Green Chips used) */}
              {isGreenChipsUsed && (
                <>
                  <Box display="flex" justifyContent="space-between" py={1.2}>
                    <Typography variant="subtitle1" color="error" fontWeight="medium">
                      Payable Amount:
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through", color: "gray" }}
                      >
                        ₹ {(grandTotal + chipsValue).toLocaleString("en-IN")}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="error">
                        ₹ {grandTotal.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                </>
              )}

              {/* Commission Earn */}
              <Box display="flex" justifyContent="space-between" py={1.2}>
                <Typography variant="subtitle1" color="success.main" fontWeight="medium">
                  Commission Earn:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="error">
                  ₹ {commissionEarn.toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Divider />

              {/* Net Fare */}
              <Box display="flex" justifyContent="space-between" py={1.2}>
                <Typography variant="subtitle1" color="primary" fontWeight="medium">
                  Net Fare:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  ₹ {(grandTotal - commissionEarn).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Card>

            <div className='mt-4'>
              {user && (user?.users?.role === 2) && (
                <div className="">
                  <Card sx={{ p: 2 }}>
                    <div className="d-flex p-2 align-items-center justify-content-between">
                      <div className="d-flex align-items-center justify-content-start gap-1">
                        <Typography variant="body1" fontWeight="semibold" color='#01196d'>WT Wallet</Typography>
                      </div>
                      <Typography variant="h6" fontWeight="semibold">₹ {walletBalance.toLocaleString()}</Typography>
                    </div>
                    <Typography
                      variant="caption"
                      color={walletBalance >= grandTotal ? 'success.main' : 'text.secondary'}
                    >
                      {walletBalance >= grandTotal
                        ? 'Wallet balance covers the Grand Total — you can pay with wallet.'
                        : `Wallet must be at least ₹${grandTotal.toLocaleString()} to enable wallet payment.`}
                    </Typography>
                  </Card>
                </div>
              )}

              <div className='mt-4'>
                <div className="tour_details_right_sidebar_wrapper d-block mb-3">
                  <Card sx={{ p: 2 }}>
                    <div className="d-flex align-items-center justify-content-between gap-1">
                      <div className='d-flex align-items-center justify-content-start gap-1'>
                        <Checkbox
                          checked={isGreenChipsUsed}
                          disabled={greenChipsPrice < (responseData1?.useCoin || 0) * passengerCount}
                          onClick={() => handleRadioChange((responseData1?.useCoin || 0) * passengerCount)}
                        />
                        <Typography variant="body1">Use existing Commission Earn</Typography>
                      </div>
                      <Typography variant="h6">
                         ₹ {(responseData1?.useCoin || 0) * passengerCount}
                      </Typography>
                    </div>




                  </Card>
                </div>
              </div>

              <div className="">
                <Card sx={{ p: 2 }}>
                  <h6 className="fw-semibold text-danger">🎉 Bumper Offer!</h6>
                  <p className="mb-2">Pay ₹999 and get ₹2100 commission point instantly.</p>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      setSelectedOffer({
                        "price": 999,
                        "chips": 2100
                      });
                      setOpenModal(true);
                    }}

                  >
                    Purchase Now
                  </Button>
                </Card>
              </div>
            </div>
          </Grid>

          {/* Travellers Step */}
          {activeStep === 1 && (
            <Grid item xs={12} md={8} sx={{ mb: 3 }}>
              <TravellersDetails
                noOfAdults={responseData1?.travellers?.adults}
                noOfChildren={responseData1?.travellers?.children}
                noOfInfants={responseData1?.travellers?.infants}
                goToStep={goToStep}
                onContinue={handlePassengersData}
                existingData={passangerData}
                triptype={responseData1?.trip_type}
                apiType={"Galileo"}
                trips={responseData1?.trip}
                apiType1={""}
              />
            </Grid>
          )}

          {/* Payment Step */}
          {activeStep === 2 && (
            <Grid item xs={12} md={8} sx={{ mb: 3, mt: 3 }}>
              <Card className=" tour_details_boxed">
                <div className="d-flex justify-content-between">
                  <span className='fs-6 fw-bold'>Traveller Details</span>
                  <button onClick={() => goToStep(1)} type="button" className="btn btn-link">
                    <i className="fa-solid text-primary fa-pen-to-square"></i>
                  </button>
                </div>
                <div>
                  <>
                    <div className="text-black text-start fw-semibold">
                      Email: <span className="text-muted">{passangerData?.CustomerInfo?.Email}</span>
                    </div>
                    <div className="fw-semibold text-start text-black">
                      Contact No: <span className="text-muted">{passangerData?.CustomerInfo?.Mobile}</span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-1">
                      {passangerData?.CustomerInfo?.PassengerDetails?.map((passenger, index) => (
                        <div key={index} className="text-start fs-8 fw-normal text-muted">
                          <span>
                            {passenger.FirstName} {passenger.LastName} - <strong>({getPassangerPaxtye(passenger.PaxType)})</strong>
                          </span>
                          {index < passangerData.CustomerInfo.PassengerDetails.length - 1 ? ',' : ''}
                        </div>
                      ))}
                    </div>
                  </>
                </div>
              </Card>
              <Card className="tour_details_boxed">
                <div className={`d-flex justify-content-between align-items-center gap-3 w-100`}>
                  <RadioGroup
                    row
                    name="priceOption"
                    value={selectedOption}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="withPrice"
                      control={<Radio />}
                      label="With Price"
                    />
                    <FormControlLabel
                      value="withoutPrice"
                      control={<Radio />}
                      label="Without Price"
                    />
                  </RadioGroup>

                  <TextField
                    type="number"
                    label="Markup"
                    variant="outlined"
                    size="small"
                    value={markup}
                    onChange={handleMarkupChange}
                    style={{ width: "120px" }}
                  />
                </div>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  {/* Total Fare */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total Fare:{" "}
                      <Typography component="span" color="error" fontWeight="bold">
                        ₹{grandTotal}
                      </Typography>
                    </Typography>
                  </Box>

                  {/* Pay Button Section */}
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mt: { xs: 3, lg: 0 } }}
                  >
                    <Tooltip title={payDisabledReason || ""} disableHoverListener={canPayWithWallet}>
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          disabled={!canPayWithWallet}
                          startIcon={isPaying ? <CircularProgress size={18} /> : null}
                          onClick={() => handlePayment(flight)}
                        >
                          {isPaying ? "Processing…" : "Pay with Wallet"}
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
      <CouponPurchase selectedOffer={selectedOffer} openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default SpecialFlightDetails;


function FlightCardData({ segment, segIndex, flight }) {
  return (
    <div className="row mt-4 p-0 p-lg-2">
      <div className="col-12 d-flex d-lg-block align-items-center justify-content-between col-md-3">
        <div className="d-flex align-items-start text-start justify-content-start mb-3">
          <img
            src={getImageUrl1(`/flightlogo/${segment?.carrier_code}.png`)}
            className='img-fluid-flight me-2'
            alt="Airline Logo"
            onError={(e) => (e.target.src = '/flight/default.png')}
          />
          <div className="d-inline-block ms-2">
            <h6 className="mb-0 fw-semibold">{getAirlineName(segment?.carrier_code)}</h6>
            <small style={{ fontSize: '12px' }} className="text-muted">{segment?.carrier_code} - {segment?.flight_number}</small>
            <h6 style={{ fontSize: '12px' }} className="text-muted">Economy</h6>
          </div>
        </div>
        <span style={{ background: '#eae8e8', fontSize: '12px' }} className="rounded-pill fw-semibold p-2 px-3 text-black ms-auto">
          Retail Fare
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center col-12 col-lg-9 mb-3">
        {/* Departure */}
        <div style={{ fontSize: '14px', textAlign: 'start' }} className="text-muted ">
          <h6 className="fs-4 fw-semibold text-black">
            {segment?.departureTime?.substring(11, 16)}
          </h6>
          <small className="text-black fw-medium">{getAirportDataByCountry(segment?.Origin?.toUpperCase(), 'city')} ({segment?.Origin})</small><br />
          <small>{segment?.departureTime?.slice(0, 10).split('-').reverse().join('-')}</small>
          <h6 style={{ fontSize: '12px' }} className="text-muted">Terminal - {segment?.departure_terminal}</h6>
        </div>

        {/* Duration */}
        <div className="text-center">
          <small className="fw-semibold fs-6">
            {calculateTravelTime(segment?.departureTime, segment?.arrivalTime)}
          </small>

          <div style={{ borderBottom: '2px dotted #e0e0e0', position: 'relative' }} className="my-3">
            <div style={{ width: '30px', height: '30px', position: 'absolute', top: '-14px', right: '25%' }}
              className="border mx-4 d-flex align-items-center justify-content-center rounded-circle">
              <i className="fas text-muted fa-plane-departure"></i>
            </div>
          </div>
          <div className="mt-2">
            <span style={{ border: '1px solid red', fontSize: '10px', color: 'red' }} className="rounded-pill fw-semibold px-2 py-1 bg-white">
              {segment?.booking_Status}
            </span>
          </div>
        </div>

        {/* Arrival */}
        <div style={{ fontSize: '14px' }} className="text-muted text-end">
          <h6 className="fs-4 fw-semibold text-black">
            {segment?.arrivalTime?.substring(11, 16)}
          </h6>
          <small className="text-black fw-medium">{getAirportDataByCountry(segment?.Destination?.toUpperCase(), 'city')} ({segment?.Destination})</small><br />
          <small>{segment?.arrivalTime?.slice(0, 10).split('-').reverse().join('-')}</small>
          <h6 style={{ fontSize: '12px' }} className="text-muted">Terminal - {segment?.arrival_terminal}</h6>
        </div>
      </div>

      {/* Layover */}
      {segIndex < flight.length - 1 && (
        <div className="row mb-4 col-lg-12">
          <div className="col-lg-3"></div>
          <div style={{ borderBottom: '2px solid #e0e0e0' }} className="col-lg-9 text-center">
            <button style={{ background: '#e0e0e0', marginBottom: '-20px', fontSize: '12px', cursor: 'auto' }} className="btn fw-medium rounded-pill">
              <span className="fw-bold"> {
                calculateTravelTime(
                  flight[segIndex]?.arrivalTime,
                  flight[segIndex + 1]?.departureTime
                )
              } </span> Layover in <span className="fw-bold">{getAirportDataByCountry(segment.Destination, 'city')} ({segment.Destination}) </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}