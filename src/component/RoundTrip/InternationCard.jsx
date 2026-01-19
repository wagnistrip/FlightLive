

import React, { useEffect, useRef, useState } from 'react'
import { Radio } from '@mui/material';
import { Card, CardContent, Typography, Grid, Divider, Box, Button } from "@mui/material";
import { extraDiscountamount, getAdditiondiscount, getAirlineName, getAirportDataByCountry, getChipsByAmount, getImageUrl1, getServiceFee } from '../../utils/airlineUtils';
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import FlightFeeDetails from '../../component/FlightFeeDetails';
import { galileoApi } from '../../Api/apiService';
import { setModalvisible } from '../../redux/actions/bookingActions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../LoadingPage';
const InternationCard = ({ flights, currency, travellers, hostToken, trip, flightFare, coupons, chips, extra_discount }) => {
  const refd = useRef(null);
  const [loadingcompon, setloadingcompon] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function extractHostTokens(data, hostTokenList) {
    const hostTokensRequired = [];

    // Helper to match HostTokenRef with actual host token value
    const getHostTokenValue = (key) => {
      const match = hostTokenList.find(token => token._attributes.Key === key);
      return match ? match._value : null;
    };

    const processSegments = (segments) => {
      if (!segments || !Array.isArray(segments)) return;

      segments.forEach(segmentGroup => {
        segmentGroup.forEach(segment => {
          const bookingInfo = segment?.BookingInfo;
          const hostTokenRef = bookingInfo?.HostTokenRef;
          const segmentRef = bookingInfo?.SegmentRef;

          if (hostTokenRef && segmentRef) {
            const tokenValue = getHostTokenValue(hostTokenRef);
            hostTokensRequired.push({
              "Key": hostTokenRef,
              "_value": tokenValue
            });
          }
        });
      });
    };

    processSegments(data.segments);
    processSegments(data.returnSegments);

    return hostTokensRequired;
  }


  const handlebook = async (data, price, status) => {
    const carrierCode = data?.segments[0][0]["@attributes"].Carrier;
    refd.current.continuousStart();
    const hostTokens = extractHostTokens(data, hostToken?.original.common_v52_0_HostToken);
    const requestData = carrierCode === '6E' ? {
      "airSegments": data?.segments[0] || [],
      "returnSegments": data?.returnSegments[0] || [],
      "noOfAdults": data?.noOfAdults || 1,
      "noOfChilds": data?.noOfChilds || 0,
      "noOfInfants": data?.noOfInfants || 0,
      "trip": "I",
      "tripType": "roundtrip",
      "flightFare": data?.flightFare || "ADT",
      "hostTokenI": hostTokens || []
    } : data
    console.log("request data for pricing => ", requestData);
    const apiEndPoint = carrierCode === '6E' ? "/GalileoInd/pricing" : "/Galileo/pricing";
    // if(carrierCode === '6E'){
    //   return;
    // }
    try {
      status ? dispatch(setModalvisible(true)) : setloadingcompon(true);
      const response = await galileoApi(apiEndPoint, requestData);
      // console.log("airpricing requesting => ",response);
      // Pricing.original.Body.AirPriceRsp
      if (response && response?.status && response?.status === 200) {
        const responseData1 = {
          responseData: response?.Pricing.original.Body.AirPriceRsp,
          travellers: response.travellers,
          trip_type: response.trip_type,
          targetPrice: price,
          trip: response.trip || 'I',
          convenienceFees: response?.convenienceFees,
          flightFare: response?.flightFare,
          HostToken: response?.hostToken.original
        }
        console.log('Response:', responseData1);
        // return
        navigate("/flightreview", { state: { responseData1 } });
        status ? dispatch(setModalvisible(false)) : setloadingcompon(false);

      }
      else {
        status ? dispatch(setModalvisible(false)) : setloadingcompon(false);
        alert(response?.message);
      }

    } catch (error) {
      console.error('Error:', error);
      dispatch(setModalvisible(false));
    }
  }


  // const [visibleCount, setVisibleCount] = useState(10); // Show 10 cards initially
  // const [visibleFlights, setVisibleFlights] = useState([]);

  // const visibleCountRef = useRef(visibleCount);
  // const flightsRef = useRef(flights);

  // // Keep refs updated with latest state
  // useEffect(() => {
  //   visibleCountRef.current = visibleCount;
  // }, [visibleCount]);

  // useEffect(() => {
  //   flightsRef.current = flights;
  // }, [flights]);

  // // When flights change, reset pagination
  // useEffect(() => {
  //   if (flights?.length > 0) {
  //     setVisibleCount(10);
  //     setVisibleFlights(flights.slice(0, 10));
  //   } else {
  //     setVisibleCount(0);
  //     setVisibleFlights([]);
  //   }

  //   // Optional loading delay
  //   setTimeout(() => setloadingcompon(false), 300);
  // }, [flights]);

  // // Infinite scroll listener
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
  //       visibleCountRef.current < flightsRef.current.length
  //     ) {
  //       loadMoreFlights();
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []); // Only run once on mount

  // // Load more cards function
  // const loadMoreFlights = () => {
  //   setloadingcompon(true);
  //   setTimeout(() => {
  //     const newCount = visibleCountRef.current + 10;
  //     const newVisibleFlights = flightsRef.current.slice(0, newCount);
  //     setVisibleCount(newCount);
  //     visibleCountRef.current = newCount;
  //     setVisibleFlights(newVisibleFlights);
  //     setloadingcompon(false);
  //   }, 500);
  // };

  const flightPairs = [];

  // if (flights && flights.length > 0) {
  //   flights.forEach((flight, flightIndex) => {
  //     const { onwardsegments = [], returnsegments = [] } = flight; // Default to empty arrays
  //     if (Array.isArray(onwardsegments) && Array.isArray(returnsegments)) {
  //       onwardsegments.forEach((onward, onwardIndex) => {
  //         returnsegments.forEach((returnFlight, returnIndex) => {
  //           flightPairs.push({
  //             segments: onward,
  //             returnSegments: returnFlight,
  //             id: `${flightIndex}-${onwardIndex}-${returnIndex}`,
  //             PricingInfos: flight.PricingInfos,
  //             airFareInfolist: flight.onwardairFareInfolist,
  //             airFareInfolistreturn: flight.returnairFareInfolist,
  //           });
  //         });
  //       });
  //     }
  //   });
  // }

  return (
    <>
      <LoadingBar color="#f11946" ref={refd} />
      {/* <Offer/> */}
      {/* <div className='col-12 p-0 mt-2 d-none d-md-block'> */}
      {flights.map((flight) => (
        <FlightCard key={flight.flightkey} flight={flight} handlebook={handlebook} currency={currency} travellers={travellers} trip={trip} flightFare={flightFare} setloadingcompon={setloadingcompon} coupons={coupons} user={user} chips={chips} extra_discount={extra_discount} />
      ))}
      {/* </div> */}


      {/* <div className="gap-4 d-block d-md-none p-2"> */}
      <div className="gap-4 d-none p-2">
        {flightPairs.map((data, index) => (
          <Card onClick={() => handlebook({
            "segments": [data?.segments],
            "returnSegments": [data?.returnSegments],
            "noOfAdults": travellers?.adults || 1,
            "noOfChilds": travellers?.children || 0,
            "noOfInfants": travellers?.infants || 0,
            "trip": trip || "I",
            "tripType": "roundtrip",
            "flightFare": flightFare || "ADT"
          }, data?.PricingInfos["@attributes"]?.ApproximateTotalPrice, status = false)}

            key={index} sx={{ width: '100%', borderRadius: 2, boxShadow: 3, marginBottom: 2 }}>
            <CardContent>
              {/* Header */}
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle2" fontWeight="bold" color="var(--main-color)" fontSize="14px">
                    Onward
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" fontSize="10px">
                    {getAirlineName(data?.segments[0]["@attributes"].Carrier)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {data?.segments[0]["@attributes"].Carrier}-{data?.segments[0]["@attributes"].FlightNumber}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" fontWeight="bold" color="var(--main-color)" fontSize="14px">
                    Return
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" fontSize="10px">
                    {getAirlineName(data?.returnSegments[0]["@attributes"].Carrier)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {data?.returnSegments[0]["@attributes"].Carrier}-{data?.returnSegments[0]["@attributes"].FlightNumber}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" color="text.primary" fontWeight="bold" fontSize="16px">
                    {currency ? currency : '₹'} {data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "")}
                  </Typography>
                  <Typography variant="h6" fontWeight="medium" color='text.secondary' fontSize="10px">
                    Avg{currency ? currency : '₹'}{Math.floor(data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "") / 2)}
                  </Typography>
                </Grid>
              </Grid>


              <Divider sx={{ my: 1, borderColor: "rgba(27, 20, 20, 1)" }} />




              {/* segments Flight */}
              <Grid container alignItems="center">


                <Grid item xs={1.8} textAlign="start">
                  <img style={{ width: '36px', height: '36px' }}
                    src={getImageUrl1(`/flightlogo/${data?.segments[0]["@attributes"].Carrier}.png`)}
                    className="img-fluid-flight "
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                  />


                </Grid>
                <Grid item xs={2.2} textAlign="start">
                  <Typography variant="h6" fontWeight="bold" fontSize="14px">
                    {data?.segments[0]["@attributes"].DepartureTime.substring(11, 16)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary" fontSize="14px">
                    {data?.segments[0]["@attributes"].Origin}
                  </Typography>
                </Grid>
                {/* <Grid item xs={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    08h 30m | 1-stop
                  </Typography>
                  <Divider sx={{ my: 0.5, borderColor: "rgba(27, 20, 20, 0.8)" }} />
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    DEL, AUH - XNB
                  </Typography>
                </Grid> */}
                <Grid item xs={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {`${Math.floor(
                      (new Date(data?.segments[data?.segments.length - 1]["@attributes"].ArrivalTime) -
                        new Date(data?.segments[0]["@attributes"].DepartureTime)) / (1000 * 60 * 60)
                    )}h ${Math.floor(
                      ((new Date(data?.segments[data?.segments.length - 1]["@attributes"].ArrivalTime) -
                        new Date(data?.segments[0]["@attributes"].DepartureTime)) / (1000 * 60)) % 60
                    )
                      }m`} | {data?.segments.length - 1 === 0 ? "Non-stop" : `${data?.segments.length - 1}-stop`}
                  </Typography>
                  <Divider sx={{ my: 0.5, borderColor: "rgba(27, 20, 20, 0.8)" }} />
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {data?.segments.map(seg => seg["@attributes"].Origin).join(", ")} - {data?.segments[data?.segments.length - 1]["@attributes"].Destination}
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="end">
                  <Typography variant="h6" fontWeight="bold" fontSize="14px">
                    {data?.segments[0]["@attributes"].ArrivalTime.substring(11, 16)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary" fontSize="14px">
                    {data?.segments[data?.segments.length - 1]["@attributes"].Destination}
                  </Typography>
                  {/* <Typography variant="caption" color="text.secondary" fontSize="10px">
                 (3 km from Dubai)
               </Typography> */}
                </Grid>
                {/* <Grid item xs={12} textAlign="end">
             <Typography color="text.secondary" fontSize="10px">
                 (3 km from Dubai)
               </Typography>
             </Grid> */}
              </Grid>
              <Divider sx={{ my: 2 }} />


              {/* Return Flight */}
              <Grid container alignItems="center">
                <Grid item xs={1.8} textAlign="start">
                  {/* <FlightTakeoffIcon fontSize="large" color="primary" /> */}
                  <img style={{ width: '36px', height: '36px' }}
                    src={getImageUrl1(`/flightlogo/${data?.returnSegments[0]["@attributes"].Carrier}.png`)}
                    className="img-fluid-flight "
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                  />


                </Grid>
                <Grid item xs={2.2} textAlign="start">
                  <Typography variant="h6" fontWeight="bold" fontSize="14px">
                    {data?.returnSegments[0]["@attributes"].DepartureTime.substring(11, 16)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary" fontSize="14px">
                    {data?.returnSegments[0]["@attributes"].Origin}
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {`${Math.floor(
                      (new Date(data?.returnSegments[data?.returnSegments.length - 1]["@attributes"].ArrivalTime) -
                        new Date(data?.returnSegments[0]["@attributes"].DepartureTime)) / (1000 * 60 * 60)
                    )}h ${Math.floor(
                      ((new Date(data?.returnSegments[data?.returnSegments.length - 1]["@attributes"].ArrivalTime) -
                        new Date(data?.returnSegments[0]["@attributes"].DepartureTime)) / (1000 * 60)) % 60
                    )
                      }m`} | {data?.returnSegments.length - 1 === 0 ? "Non-stop" : `${data?.returnSegments.length - 1}-stop`}
                  </Typography>
                  <Divider sx={{ my: 0.5, borderColor: "rgba(27, 20, 20, 0.8)" }} />
                  <Typography variant="body2" color="text.secondary" fontSize="10px">
                    {data?.returnSegments.map(seg => seg["@attributes"].Origin).join(", ")} - {data?.returnSegments[data?.returnSegments.length - 1]["@attributes"].Destination}
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="end">
                  <Typography variant="h6" fontWeight="bold" fontSize="14px">
                    {data?.returnSegments[0]["@attributes"].ArrivalTime.substring(11, 16)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary" fontSize="14px">
                    {data?.returnSegments[data?.returnSegments.length - 1]["@attributes"].Destination}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} textAlign="end">
             <Typography color="red" fontSize="10px">
                 1 days +
               </Typography>
             </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        ))}
      </div>

      {loadingcompon && (
        <LoadingPage />
      )}
    </>


  )
}


export default InternationCard




const FlightCard = ({ flight, handlebook, currency, travellers, trip, flightFare, setloadingcompon, coupons, user, chips, extra_discount }) => {
  const [open, setOpen] = useState(false);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  // Auto-select the first available departure and return flight on mount
  useEffect(() => {
    if (flight.onwardsegments.length > 0) {
      setSelectedDeparture(flight.onwardsegments[0]);
    }
    if (flight.returnsegments.length > 0) {
      setSelectedReturn(flight.returnsegments[0]);
    }
  }, [flight]);


  const handleDepartureSelect = (segment) => {
    // setloadingcompon(true); // Show loading modal
    // setTimeout(() => {
    //   setSelectedDeparture(segment);
    //   setloadingcompon(false); // Hide loading modal after 1 second
    // }, 200);
    // setOpen(false)
    setSelectedDeparture(segment);
  };


  const handleReturnSelect = (segment) => {
    // setloadingcompon(true); // Show loading modal
    // setTimeout(() => {
    //   setSelectedReturn(segment)
    //   setloadingcompon(false); // Hide loading modal after 1 second
    // }, 200);
    // setOpen(false)
    setSelectedReturn(segment)
  };


  const handleBooking = () => {
    if (!selectedDeparture || !selectedReturn) {
      alert("Please select both departure and return flights.");
      return;
    }
    handlebook(
      {
        // "flightkey": flight.flightkey,
        "segments": [selectedDeparture],
        "returnSegments": [selectedReturn],
        "noOfAdults": travellers?.adults || 1,
        "noOfChilds": travellers?.children || 0,
        "noOfInfants": travellers?.infants || 0,
        "trip": trip || "I",
        "tripType": "roundtrip",
        "flightFare": flightFare || "ADT"
      }, flight?.PricingInfos["@attributes"]?.ApproximateTotalPrice,
      status = true
    );
  };
  return (

    <>
      <Card sx={{
        border: "1px solid #d3d3d3", borderRadius: 2, bgcolor: "#fff", p: 2, marginBottom: '16px', width: '100%', transition: "box-shadow 0.3s ease-in-out",
        ":hover": {
          boxShadow: 6
        }
      }} >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} pb={1} mb={2}>
          {/* Airline Info */}
          <Grid container spacing={2} alignItems="center">
            {selectedDeparture && selectedReturn && (
              <>
                <Grid item xs={4} display="flex" alignItems="center" gap={1}>


                  <img style={{ width: '36px', height: '36px' }}
                    display='flex'
                    src={getImageUrl1(`/flightlogo/${selectedDeparture[0]["@attributes"].Carrier}.png`)}
                    className="img-fluid-flight "
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                  />
                  <Box display="block">
                    <Typography sx={{ fontSize: '16px' }} display="block" color='black' fontWeight='bold' textAlign="center">
                      {getAirlineName(selectedDeparture[0]["@attributes"].Carrier)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="start">
                      {selectedDeparture[0]["@attributes"].Carrier} - {selectedDeparture[0]["@attributes"].FlightNumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} display="flex" alignItems="center" gap={1}>


                  <img style={{ width: '36px', height: '36px' }}
                    display='flex'
                    src={getImageUrl1(`/flightlogo/${selectedReturn[0]["@attributes"].Carrier}.png`)}
                    className="img-fluid-flight "
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                  />
                  <Box display="block">
                    <Typography sx={{ fontSize: '16px' }} display="block" color='black' fontWeight='bold' textAlign="center">
                      {getAirlineName(selectedReturn[0]["@attributes"].Carrier)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="start">
                      {selectedReturn[0]["@attributes"].Carrier} - {selectedReturn[0]["@attributes"].FlightNumber}
                    </Typography>
                  </Box>
                </Grid>
              </>


            )}


            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Typography fontWeight="bold" variant="h6" display="block" color="error">
                  {/* {currency ? currency : '₹'} {parseInt(flight.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "").trim())} */}
                  {currency ? currency : '₹'}{" "}
                  {(() => {
                    let price = parseInt(flight?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice?.replace("INR", "").trim());

                    if (isNaN(price)) return "Invalid Price";

                    if (user?.users?.role === 2) {
                      price += getServiceFee('I',"roundtrip",user?.users?.agent_type,travellers?.adults);
                    }

                    return price.toLocaleString();
                  })()}
                </Typography>
                {
                  !user || (user && user?.users?.role !== 2) ? (

                    <Typography sx={{ fontSize: '12px' }} display="block" color="text.secondary">
                      Avg {currency ? currency : '₹'} {Math.floor(parseInt(flight.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "").trim()) / 2)}
                    </Typography>

                  ) : null}

                {user?.users?.role === 2 &&
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }} display="block" color="text.primary">
                    Net Fare {currency ? currency : '₹'}{" "}
                    {(() => {
                      // Step 1: Get base price
                      const rawPrice = flight?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice || "0";
                      let price = parseFloat(rawPrice.replace("INR", "").trim()) || 0;

                      // Step 2: Add service fee
                      price += getServiceFee("I","roundtrip",user?.users?.agent_type,travellers?.adults);

                      let netFare = price;

                      // Step 3: Apply green chips
                      const greenChips = getChipsByAmount(price, chips);
                      if (!isNaN(greenChips) && greenChips > 0 ) {
                        netFare -= greenChips;
                      }
                      if(user?.users?.agent_type === 'A'){
                        netFare -= getAdditiondiscount("I")
                      }
                      // Step 4: Apply extra discount
                      const carrierCode = selectedDeparture?.[0]?.["@attributes"]?.Carrier || "";
                      const extraDiscount = extraDiscountamount(carrierCode, extra_discount || []);
                      if (!isNaN(extraDiscount) && extraDiscount > 0) {
                        netFare -= extraDiscount;
                      }
                       netFare = Math.floor(netFare); 

                      // Step 5: Return final result
                      return netFare > 0 ? `₹${netFare.toLocaleString()}` : "Not Available";
                    })()}
                  </Typography>
                }
              </Box>
            </Grid>


          </Grid>
        </Box>


        {/* Flight Details Section */}
        <Grid container spacing={2}>


          {/* Departure Section */}
          <Grid item xs={12} md={6}>
            <Typography sx={{
              fontSize: {
                xs: '10px',   // mobile
                sm: '14px',   // tablet
                md: '12px',
              }
            }} color='var(--main-color)' fontWeight='bold' variant="subtitle1">DEPARTURE</Typography>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              {flight.onwardsegments.map((segment, index, array) => (
                <Box key={index}>
                  <Box sx={{ p: 2 }} onClick={() => handleDepartureSelect(segment)} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    {/* Radio Button & Flight Info */}
                    <Box display="flex" alignItems="start">
                      <Radio sx={{
                        color: 'gray', // unselected color
                        '&.Mui-checked': {
                          color: 'var(--main-color)', // checked color
                        }
                      }} type="radio" name={`departure-${flight.flightkey}`}
                        checked={selectedDeparture === segment}
                      />
                      <Box>
                        <Typography>
                          {segment[0]['@attributes'].Origin} <strong variant="caption" className='text-black'>{segment[0]['@attributes'].DepartureTime.substring(11, 16)}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: '14px' }} fontWeight='semibold' color='black'>{getAirportDataByCountry(segment[0]['@attributes'].Origin, 'city')}</Typography>
                        <Typography variant="caption">{new Date(segment[0]['@attributes'].DepartureTime).toLocaleDateString(undefined, {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</Typography>
                      </Box>
                    </Box>


                    {/* Duration & Stops */}
                    <Box>
                      <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
                        {
                          Math.floor(
                            (new Date(segment[segment.length - 1]['@attributes'].ArrivalTime) -
                              new Date(segment[0]['@attributes'].DepartureTime)) /
                            (1000 * 60 * 60)
                          )
                        }h{' '}
                        {
                          ((new Date(segment[segment.length - 1]['@attributes'].ArrivalTime) -
                            new Date(segment[0]['@attributes'].DepartureTime)) /
                            (1000 * 60)) %
                          60
                        }m{' '}
                        | {segment.length === 1 ? 'Nonstop' : `${segment.length - 1}-stop`}
                      </Typography>
                      <Typography variant="caption" display="block" color="#8B3EEA" fontWeight="bold" textAlign="center">
                        {segment.map(seg => seg['@attributes'].Origin).join('-') + '-' + segment[segment.length - 1]['@attributes'].Destination}
                      </Typography>
                      <Typography variant="caption" color="error" display="block" textAlign="center">
                        9 seats left
                      </Typography>
                    </Box>




                    {/* Arrival Info */}
                    <Box textAlign="right">
                      <Typography>
                        {segment[segment.length - 1]['@attributes'].Destination} <strong className='text-black'>{segment[segment.length - 1]['@attributes'].ArrivalTime.substring(11, 16)}</strong>
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} fontWeight='semibold' color='black'>{getAirportDataByCountry(segment[segment.length - 1]['@attributes'].Destination, 'city')}</Typography>
                      <Typography variant="caption"> {new Date(segment[segment.length - 1]['@attributes'].ArrivalTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</Typography>
                    </Box>
                  </Box>
                  {/* Add Divider after each box except the last one */}
                  {index !== array.length - 1 && <Divider sx={{ borderColor: "rgba(27, 20, 20, 1)" }} />}
                </Box>
              ))}
            </Card>
          </Grid>


          {/* Return Section */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: '12px' }} color='var(--main-color)' fontWeight='bold' variant="subtitle1">RETURN</Typography>


            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              {flight.returnsegments.map((segment, index, array) => (
                <Box key={index}>
                  <Box sx={{ p: 2 }} onClick={() => handleReturnSelect(segment)} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    {/* Radio Button & Flight Info */}
                    <Box display="flex" alignItems="start">
                      <Radio sx={{
                        color: 'gray', // unselected color
                        '&.Mui-checked': {
                          color: 'var(--main-color)', // checked color
                        }
                      }} type="radio" name={`return-${flight.flightkey}`}
                        checked={selectedReturn === segment}
                      />
                      <Box>
                        <Typography>
                          {segment[0]['@attributes'].Origin} <strong variant="caption" className='text-black'>{segment[0]['@attributes'].DepartureTime.substring(11, 16)}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: '14px' }} fontWeight='semibold' color='black'>{getAirportDataByCountry(segment[0]['@attributes'].Origin, 'city')}</Typography>
                        <Typography variant="caption">{new Date(segment[0]['@attributes'].DepartureTime).toLocaleDateString(undefined, {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
                        {
                          Math.floor(
                            (new Date(segment[segment.length - 1]['@attributes'].ArrivalTime) -
                              new Date(segment[0]['@attributes'].DepartureTime)) /
                            (1000 * 60 * 60)
                          )
                        }h{' '}
                        {
                          ((new Date(segment[segment.length - 1]['@attributes'].ArrivalTime) -
                            new Date(segment[0]['@attributes'].DepartureTime)) /
                            (1000 * 60)) %
                          60
                        }m{' '}
                        | {segment.length === 1 ? 'Nonstop' : `${segment.length - 1}-stop`}
                      </Typography>
                      <Typography variant="caption" display="block" color="#8B3EEA" fontWeight="bold" textAlign="center">
                        {segment.map(seg => seg['@attributes'].Origin).join('-') + '-' + segment[segment.length - 1]['@attributes'].Destination}
                      </Typography>
                      <Typography variant="caption" color="error" display="block" textAlign="center">
                        {segment[0].BookingInfo.BookingCount} seats left
                      </Typography>
                    </Box>
                    {/* Arrival Info */}
                    <Box textAlign="right">
                      <Typography>
                        {segment[segment.length - 1]['@attributes'].Destination} <strong className='text-black'>{segment[segment.length - 1]['@attributes'].ArrivalTime.substring(11, 16)}</strong>
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} fontWeight='semibold' color='black'>{getAirportDataByCountry(segment[segment.length - 1]['@attributes'].Destination, 'city')}</Typography>
                      <Typography variant="caption"> {new Date(segment[segment.length - 1]['@attributes'].ArrivalTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</Typography>
                    </Box>
                  </Box>
                  {/* Add Divider after each box except the last one */}
                  {index !== array.length - 1 && <Divider sx={{ borderColor: "rgba(27, 20, 20, 1)" }} />}
                </Box>
              ))}
            </Card>
          </Grid>


        </Grid>


        {/* Footer Section */}
        <Grid container justifyContent="space-between" alignItems="center" marginTop={2}>
          <Grid item>
            <Button
              variant="contained"
              color={
                (Array.isArray(flight?.PricingInfos?.AirPricingInfo)
                  ? flight?.PricingInfos?.AirPricingInfo[0]?.["@attributes"]?.Refundable === "true"
                  : flight?.PricingInfos?.AirPricingInfo?.["@attributes"]?.Refundable === "true") ||
                  selectedDeparture?.[0]?.["@attributes"]?.Carrier === "6E"
                  ? "success"
                  : "error"
              }
              size="small"
            >
              {(Array.isArray(flight?.PricingInfos?.AirPricingInfo)
                ? flight?.PricingInfos?.AirPricingInfo[0]?.["@attributes"]?.Refundable === "true"
                : flight?.PricingInfos?.AirPricingInfo?.["@attributes"]?.Refundable === "true") ||
                selectedDeparture?.[0]?.["@attributes"]?.Carrier === "6E"
                ? "REFUNDABLE"
                : "NON-REFUNDABLE"}
            </Button>

          </Grid>

          {
            coupons && (
              <Typography
                variant="caption"
                color="text.secondary"
                backgroundColor="#e0ffe3"
                padding={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                textAlign="center"
              >
                <FiberManualRecordIcon fontSize="small" className="text-danger" />
                Get Flat Rs {coupons && coupons?.discount_amount} discount using <strong className="text-black">{coupons && coupons?.code}</strong>
              </Typography>

            )
          }

          <Grid item>


            <Button onClick={() => setOpen(!open)} variant="link" xs={{ fontSize: '10px' }} color="primary">Flight Detail {open ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}</Button>
            {/* <Button variant="contained" sx={{ ml: 1, backgroundColor: "var(--main-color)" }}>Book Now</Button> */}
            <Button onClick={handleBooking} variant="contained" sx={{ ml: 1, backgroundColor: "var(--main-color)" }}>Book Now</Button>
          </Grid>
        </Grid>


        <Grid justifyContent="space-between" alignItems="center" marginTop={2}>
          <FlightFeeDetails formData={{
            flightkey: flight.flightkey,
            segments: selectedDeparture,
            returnSegments: selectedReturn,
            PricingInfos: flight.PricingInfos,
            airFareInfolist: flight.onwardairFareInfolist,
            airFareInfolistreturn: flight.returnairFareInfolist,
            cabinService: flight.cabinService,
            bookingCode: flight.bookingCode
          }}
            travellers={travellers}
            buttonsOpen={open}
            trip='I' />
        </Grid>


      </Card>
    </>

  );
};
