import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

// Offers Data
const offers = [
  {
    title: "Fly to Kuala Lumpur with",
    highlight: "Malaysia Airlines",
    description:
      "Book Flights from Thiruvananthapuram to Kuala Lumpur at Fares Starting from INR 5,155*",
    valid: "Valid till: 31st Oct 2025",
    bg: "linear-gradient(to right, #647ea5, #91fff9)",
    img: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
  },
  {
    title: "Exclusive Deals on",
    highlight: "Indonesia Airlines",
    description:
      "Enjoy Up to INR 1,500 OFF* & Extra Baggage Allowance on Flights with Malaysia Airlines",
    valid: "Valid till: 30th Sep, 2025",
    code: "EMTMH",
    bg: "linear-gradient(to right, #9c1d41, #FF9800)",
    img: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg",
  },
  {
    title: "Best Deals for Your",
    highlight: "International Travel",
    description:
      "Get Best Deals on Popular Airlines like EGYPTAIR, ITA Airways, British Airways, KLM and many more.",
    valid: "Book Now",
    bg: "linear-gradient(to right, #e444ff, #c09cff)",
    img: "https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg",
  },
];

// Custom arrows
function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 15,
        zIndex: 2,
        background: "rgba(255,255,255,0.9)",
        "&:hover": { background: "#fff" },
      }}
    >
      <ArrowForwardIos fontSize="small" />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 15,
        zIndex: 2,
        background: "rgba(255,255,255,0.9)",
        "&:hover": { background: "#fff" },
      }}
    >
      <ArrowBackIos fontSize="small" />
    </IconButton>
  );
}

export default function OfferCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      {/* Title + Line */}
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Exclusive Offers
      </Typography>

      <Box
        sx={{
          width: 120,
          height: 4,
          mx: "auto",
          my: 1.5,
          borderRadius: 2,
          background: "linear-gradient(90deg, #ff512f, #dd2476)",
          transform: "skewX(-20deg)",
        }}
      />

      <Slider {...settings}>
        {offers.map((offer, index) => (
          <Box
            key={index}
            sx={{
              padding: "10px",
              margin: "10px 0",
              width: "100%",
            }}
          >
            <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
              {/* Top Section */}
              <Box
                sx={{
                  display: "flex",
                  position: "relative", // for absolute image
                  height: 180,
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                {/* Left Gradient Section */}
                <Box
                  sx={{
                    flex: 1,
                    background: offer.bg,
                    color: "#fff",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2">{offer.title}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {offer.highlight}
                  </Typography>

                  {/* Coupon Code */}
                  {offer.code && (
                    <Chip
                      label={`Use Code: ${offer.code}`}
                      sx={{
                        mt: 1,
                        background: "#fff",
                        color: "#d32f2f",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        borderRadius: 1,
                        width: "fit-content",
                      }}
                    />
                  )}
                </Box>

                {/* Right Image Section */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 120,
                    minWidth: 140,
                    minHeight: 181,
                    maxHeight: 186,
                    borderRadius: "35% 0 0 0",
                    backgroundImage: `url(${offer.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 0 7px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>

              {/* Bottom Section */}
              <CardContent>
                <Typography variant="body2">{offer.description}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "text.secondary" }}
                >
                  {offer.valid}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
