import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LuggageIcon from '@mui/icons-material/Luggage';
import Offer from '../Offer';
import notfound from '../../image/notfound.png'
import { calculateTravelTime, getAirlineName, getAirportDataByCountry, getImageUrl1 } from '../../utils/airlineUtils';
import Flightform from '../FlightFom';
import LoadingPage from '../../LoadingPage';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
const SpecialFlightCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const response = location?.state?.spldata;
  const flights = response?.data || [];
  const [loadingcompon, setloadingcompon] = useState(false);
  const [passangerData, setPassangerData] = useState([]);

  useEffect(() => {
    const searchdata = localStorage.getItem('formData');
    if (searchdata) {
      const parsedData = JSON.parse(searchdata);
      setPassangerData(parsedData);
    }
  }, []);

  const travellers = response && response?.travellers || {
    adults: parseInt(passangerData.noOfAdults),
    children: parseInt(passangerData.noOfChilds),
    infants: parseInt(passangerData.noOfInfants),
  };

  const handleBookNow = (data, travellers) => {
    setloadingcompon(true);

    const responseData1 = {
      responseData: data,
      travellers: travellers,
      trip_type: response?.tripType,
      trip: response?.trip,
      useCoin:  response?.trip === 'D' ? 600 : 1000,
      earnCoin: response?.earnCoins
    };
    if (data?.onward_connecting) {
      responseData1.booking_token_id = response?.booking_token_id || "";
    }
    if (data?.ticket_id) {
      responseData1.IQtoken = response?.IQtoken || "";
    }
    console.log("Req Body => ", responseData1);
    // return
    setTimeout(() => {
      navigate('/SpecialFlightDetails', { state: { responseData1 } });
      setloadingcompon(false);
    }, 2000);

  };

  console.log("response => ",response);

  return (
    <>

      {loadingcompon && (
        <LoadingPage />
      )}
      {
        !isMobile ? <>
          <Offer title="---" />
          <Flightform existingData={passangerData} type='specailFlight' />
        </> : null
      }
      <div className='container my-4'>
        {/* <div className='col-lg-12 d-flex'>
          <div className='col-lg-3'>
sddd
          </div>
          <div className='col-lg-9'> */}

        {flights && flights.length > 0 ? (
          flights.map((flight, index) => {
            const isSpecialFlight = flight?.legs && Array.isArray(flight.legs) && flight.legs.length > 0;
            const isAirIqFlight = flight?.ticket_id && flight?.origin && flight?.destination;
            return (
              <div key={index}>
                {isSpecialFlight ? (
                  <SpecialCard flight={flight} travellers={travellers} handleBookNow={handleBookNow} />
                )
                  : isAirIqFlight ? (
                    <AirIqCard flight={flight} travellers={travellers} handleBookNow={handleBookNow} />
                  )
                    :
                    <FdKingCard flight={flight} travellers={travellers} handleBookNow={handleBookNow} />
                }
              </div>
            );
          })
        ) : (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            <Box
              component="img"
              src={notfound}
              alt=""
              sx={{ width: '90%', height: '500px', objectFit: 'contain' }}
            />
          </Typography>
        )}

        {/* </div>
        </div> */}
      </div>
    </>
  );
};

export default SpecialFlightCard;

function SpecialCard({ flight, travellers, handleBookNow }) {
  return (
    <Card
      elevation={3}
      sx={{
        marginBottom: '20px',
        borderRadius: 1,
        backgroundColor: '#fff',
      }}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Airline Info */}
          <Grid item xs={3} sm={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <img
                src={getImageUrl1(`/flightlogo/${flight?.legs[0]?.carrier_code}.png`)}
                className="img-fluid-flight"
                alt="Airline Logo"
                onError={(e) => (e.target.src = '/flight/default.png')}
              />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {getAirlineName(flight?.legs[0]?.carrier_code)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight?.legs[0]?.carrier_code} - {flight?.legs[0]?.flight_number}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Departure Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.legs[0]?.departure_time?.substring(11, 16)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight.legs[0].origin_code.toUpperCase(), 'city')}
            </Typography>
          </Grid>

          {/* Duration & Stops */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <span style={{ fontWeight: 600 }}>
                {calculateTravelTime(
                  flight?.legs[0]?.departure_time,
                  flight?.legs[flight?.legs.length - 1]?.arrival_time
                )}
              </span>
            </Typography>
            <Box
              sx={{
                borderBottom: '1px dashed #bbb',
                width: '50px',
                mx: 'auto',
                mb: 0.5,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {flight?.legs.length === 1 ? 'NonStop' : `${flight?.legs.length - 1}-stop`}
            </Typography>
          </Grid>

          {/* Arrival Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.legs[flight?.legs.length - 1]?.arrival_time?.substring(11, 16)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight?.legs[0]?.destination_code.toUpperCase(), 'city')}
            </Typography>
          </Grid>

          {/* Price Info */}
           <Grid item xs={3} sm={2} textAlign="center">
            <Typography
              variant="body1" fontWeight="bold"
              sx={{ color: "red", fontSize: '16px' }}
            >
             ₹ {Math.round(
               (flight.total_payable_price)
                + ((flight.trip === 'D' ? 600 : 1000) * (travellers?.adults + travellers?.children))
              ).toLocaleString("en-IN")}
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ color: '#052c65',fontSize:'14px' }}>
               Net Fare :  ₹ {Math.round(
                flight.total_payable_price - (flight.total_payable_price * 0.05)
              ).toLocaleString("en-IN")}
            </Typography>
          </Grid>

          {/* Book Now */}
          <Grid
            item
            xs={12}
            sm={2}
            sx={{
              marginTop: { xs: '10px', sm: '10px', md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <button onClick={() => handleBookNow(flight, travellers)} type="button" className="button">
              Book Now
              <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                <path
                  clipRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>

            <Typography variant="caption" color="error" mt={1} display="block" sx={{ fontSize: '13px', fontWeight: 500 }}>
              <AirlineSeatReclineNormalIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {flight.available_seats} Seats Left
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              mt={0.5}
              sx={{ fontSize: '13px' }}
            >
              <LuggageIcon fontSize="small" sx={{ mr: 0.5 }} />
              Luggage: 15kg
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function FdKingCard({ flight, travellers, handleBookNow }) {
  return (
    <Card
      elevation={3}
      sx={{
        marginBottom: '20px',
        borderRadius: 1,
        backgroundColor: '#fff',
      }}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Airline Info */}
          <Grid item xs={3} sm={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <img
                src={getImageUrl1(`/flightlogo/${flight?.airline_code || '6E'}.png`)}
                className="img-fluid-flight"
                alt="Airline Logo"
                onError={(e) => (e.target.src = '/flight/default.png')}
              />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {getAirlineName(flight?.airline_code)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight?.airline_code} - {flight?.flight_number?.replace(flight?.airline_code, '')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Departure Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.dep_time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight?.dep_airport_code, 'city')}
            </Typography>
          </Grid>

          {/* Duration & Stops */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <span style={{ fontWeight: 600 }}>{flight?.duration || 'N/A'}</span>
            </Typography>
            <Box sx={{ borderBottom: '1px dashed #bbb', width: '50px', mx: 'auto', mb: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {flight?.no_of_stop === 0 ? 'NonStop' : `${flight?.no_of_stop}-stop`}
            </Typography>
          </Grid>

          {/* Arrival Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.arr_time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight?.arr_airport_code, 'city')}
            </Typography>
          </Grid>

          {/* Price Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography
              variant="body1"
              sx={{ color: 'gray', textDecoration: 'line-through', fontSize: '13px' }}
            >
              ₹ {(flight.total_payable_price + 300)
                + (((flight.trip === 'D' || flight.trip_type === 0)
                  ? 600
                  : 1000) * (travellers?.adults + travellers?.children))}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'red' }}>
              ₹ {flight.total_payable_price + 300}
            </Typography>
          </Grid>

          {/* Book Now */}
          <Grid
            item
            xs={12}
            sm={2}
            sx={{
              marginTop: { xs: '10px', sm: '10px', md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <button onClick={() => handleBookNow(flight, travellers)} type="button" className="button">
              Book Now
              <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                <path
                  clipRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>
            <Typography variant="caption" color="error" mt={1} display="block" sx={{ fontSize: '13px', fontWeight: 500 }}>
              <AirlineSeatReclineNormalIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {flight.available_seats} Seats Left
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              mt={0.5}
              sx={{ fontSize: '13px' }}
            >
              <LuggageIcon fontSize="small" sx={{ mr: 0.5 }} />
              Luggage: {flight.check_in_baggage_adult || 15}kg
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const AirIqCard = ({ flight, travellers, handleBookNow }) => {

  return (
    <Card
      elevation={3}
      sx={{
        marginBottom: "20px",
        borderRadius: 1,
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Airline Info */}
          <Grid item xs={3} sm={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <img
                // src={getImageUrl1(`/flightlogo/${flight?.legs[0]?.carrier_code}.png`)}
                src={getImageUrl1(`/flightlogo/${flight?.flight_number?.slice(0, 2)}.png`)}
                alt="Airline Logo"
                onError={(e) => (e.target.src = "/flight/default.png")}
                className="img-fluid-flight"
              />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {getAirlineName(flight?.flight_number?.slice(0, 2))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.flight_number?.split(" ").join(" - ")}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Departure Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.departure_time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight.origin, 'city')}
            </Typography>
          </Grid>

          {/* Duration & Stops */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <span style={{ fontWeight: 600 }}>
                {calculateTravelTime(
                  `${flight.departure_date.replace(/\//g, "-")}T${flight.departure_time}:00.000Z`,
                  `${flight.arival_date.replace(/\//g, "-")}T${flight.arival_time}:00.000Z`
                )}
              </span>
            </Typography>
            <Box
              sx={{
                borderBottom: '1px dashed #bbb',
                width: '50px',
                mx: 'auto',
                mb: 0.5,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {flight.flight_route || "Non-stop"}
            </Typography>
          </Grid>

          {/* Arrival Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {flight?.arival_time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAirportDataByCountry(flight.destination, 'city')}
            </Typography>
          </Grid>

          {/* Price Info */}
          <Grid item xs={3} sm={2} textAlign="center">
            <Typography
              variant="body1" fontWeight="bold"
              sx={{ color: "red", fontSize: '16px' }}
            >
              ₹ {Math.round(
                flight.total_payable_price +
                (flight.total_payable_price * 0.005) +
                // ((flight.isinternational ? 1000 : 600) * (travellers?.adults + travellers?.children))
                ((flight.isinternational ? 200 : 200) * (travellers?.adults + travellers?.children))
              ).toLocaleString("en-IN")}
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ color: '#052c65',fontSize:'14px' }}>
               Net Fare : {Math.round(
                flight.total_payable_price +
                (flight.total_payable_price * 0.005) + 50
              ).toLocaleString("en-IN")}
            </Typography>
          </Grid>

          {/* Book Now */}
          <Grid
            item
            xs={12}
            sm={2}
            sx={{
              marginTop: { xs: "10px", sm: "10px", md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <button
              onClick={() => handleBookNow(flight, travellers)}
              type="button"
              className="button"
            >
              Book Now
              <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                <path
                  clipRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>

            <Typography variant="caption" color="error" mt={1} display="block" sx={{ fontSize: '13px', fontWeight: 500 }}>
              <AirlineSeatReclineNormalIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {flight?.pax} Seats Left
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              mt={0.5}
              sx={{ fontSize: "13px" }}
            >
              <LuggageIcon fontSize="small" sx={{ mr: 0.5 }} />
              Luggage: {flight?.cabin_baggage || "7"}kg
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Box
        sx={{
          fontSize: "12px",
          width: "fit-content",
          backgroundColor: "#e0ffe3",
          color: "black",
          textAlign: "center",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mx: "auto",
          mb: 2,
          py: 0.5,
          px: 1,
          borderRadius: 1,
        }}
      >
        <FiberManualRecordIcon sx={{ fontSize: 10, color: "error.main" }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          Commission Earn upto {("I" === "I" ? "3000" : "1000")}
        </Typography>
      </Box>
    </Card>
  );
};

