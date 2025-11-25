import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "./commonHeader";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  customerProfile,
  decryptPayload,
  galileoApi,
} from "../Api/apiService";
import { getAirportDataByCountry } from "../utils/airlineUtils";
import dayjs from "dayjs";
import LoadingComponents from "./LoadingComponents";
import CouponPurchase from "./CouponPurchase";

const Promosection = ({ offersdata, title }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const location = useLocation();
  const [loading1, setLoading1] = useState(false);
  const currentPath = location.pathname;
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = user?.token;
      try {
        const response = await customerProfile("/get-specialFlights", token);
        console.log("Special flight data => ", response);
        if (response?.status === 200) {
          setFlights(response?.specialFlights || []);
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.log("Error fetching special flight: ", err);
        setFlights([]);
      }
    };

    if (
      user &&
      user?.users.role === 2 &&
      currentPath === "/specialflight" &&
      flights.length === 0
    ) {
      fetchData();
    }
  }, [user, currentPath, flights.length]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    let date = new Date(timestamp);
    if (isNaN(date.getTime())) return "N/A";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]} - ${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const handleCardClick = async (flight) => {
    if (user && user?.users?.role === 2 && user?.users.status === 0) {
      navigate("/agent/registration");
      return;
    }

    setLoading1(true);
    const departureDate = dayjs(flight.departure_time).format("YYYY-MM-DD");
    const formData = {
      tripType: "oneway",
      departure: flight.origin_code,
      arrival: flight.destination_code,
      departureDate: departureDate,
      returnDate: null,
      noOfAdults: 1,
      noOfChilds: 0,
      noOfInfants: 0,
      cabinClass: "Y",
      flightFare: "ADT",
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    const queryString = new URLSearchParams(formData).toString();
    const token =
      user && user.users && user.users.role === 2 ? user.token : null;

    try {
      const response = await galileoApi(
        "/specialFlight/search",
        formData,
        token
      );
      const decryptedResponse1 = decryptPayload(response?.data || "");
      const responseData1 = JSON.parse(decryptedResponse1);

      if (responseData1?.status === 200) {
        setTimeout(() => {
          navigate(`/SpecialFlightCard?${queryString}`, {
            state: { spldata: responseData1 },
          });
          setLoading1(false);
        }, 1500);
      } else {
        toast.error("Failed to load special flight data");
        setLoading1(false);
      }
    } catch (error) {
      console.log("Error loading flight details:", error);
      toast.error("Error loading flight details");
      setLoading1(false);
    }
  };

  const handleOfferClick = (offer) => {
    if (offer.status === "true" || offer.status === true) {
      setSelectedOffer(offer);
      setOpenModal(true);
    } else {
      // navigate(offer.route);
    }
  };

  return (
    <>
      {loading1 && <LoadingComponents />}

      {/* Promo section */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          background: "white",
        }}
      >
        <div
          className={`${
            currentPath === "/specialflight" ? "d-none" : "d-block"
          } container`}
        >
          <CommonHeader title={title} />

          <Grid container spacing={4} justifyContent="center">
            {offersdata.map((offer, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "none", // Removed shadow
                    backgroundColor: "transparent", // No white background
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                  onClick={() => handleOfferClick(offer)} // image click triggers same function
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={offer.image}
                      alt={offer.title || "Offer"}
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Box>

      {/* Special flight page */}
      <div
        className={`container ${
          currentPath === "/specialflight" ? "d-block" : "d-none"
        }`}
      >
        <CommonHeader title={"Special flight sector"} />
        <Grid container spacing={1} mt={2}>
          {flights && flights.length > 0 ? (
            flights.map((flight, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 0,
                    boxShadow: 0,
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 2,
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => handleCardClick(flight)}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getAirportDataByCountry(
                        flight.origin_code.toUpperCase(),
                        "city"
                      )}{" "}
                      ({flight?.origin_code}) - To -{" "}
                      {getAirportDataByCountry(
                        flight.destination_code.toUpperCase(),
                        "city"
                      )}{" "}
                      ({flight?.destination_code})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {formatDate(flight.departure_time)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ mt: 3, textAlign: "center", width: "100%" }}>
              No special flights available.
            </Typography>
          )}
        </Grid>
      </div>

      {/* Coupon modal */}
      <CouponPurchase
        selectedOffer={selectedOffer}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default Promosection;
