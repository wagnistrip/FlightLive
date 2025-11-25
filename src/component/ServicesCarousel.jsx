import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";


const CarouselWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  gap: "8px",
  position: "relative"
});


const CarouselContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  padding: "20px 0",
  width: "100%",
  flex: 1
});


const CarouselTrack = styled(Box)(({ offset }) => ({
  display: "flex",
  gap: "16px",
  transform: `translateX(${offset}px)`,
  transition: "transform 0.6s ease",
}));


const ServiceBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "75px",
  minWidth: "280px",
  display: "flex",
  alignItems: "center",
  borderRadius: "10px",
  flexShrink: 0,
  backgroundColor: "#1066cb",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));


const IconContainer = styled(Box)(({ theme }) => ({
  width: "45px",
  height: "45px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,255,255,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1.5),
  fontSize: "20px",
  fontWeight: "bold",
  color: "#fff",
  flexShrink: 0,
  cursor:'default',
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  },
}));


const NavButton = styled(IconButton)(() => ({
  backgroundColor: "#1066CB",
  color: "#fff",
  borderRadius: "50%",
  width: 45,
  height: 45,
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  border: "1px solid #e0e0e0",
  flexShrink: 0,
  "&:hover": {
    backgroundColor: "#f5f5f5",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
}));


const ServicesCarousel = ({user}) => {
  const allServices = [
    { icon: "💻", title: "API / XML", description: "Easy implementation", onlyRole2: true },
    { icon: "🚖", title: "Cab", description: "Private cab on demand" },
    { icon: "🎁", title: "Packages", description: "Curated travel experiences" },
    { icon: "🏪", title: "Suppliers", description: "Sell your inventory through us", onlyRole2: true },
    { icon: "✈️", title: "Flight Booking", description: "Global flight inventory access" },
    { icon: "🏨", title: "Hotel Booking", description: "Worldwide hotel integration" },
  ];

const services = allServices.filter(service =>
    service.onlyRole2 ? (user && user?.users?.role === 2) : true
  );
  const duplicatedServices = [...services, ...services];
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const cardWidth = 296;


  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        return newOffset <= -services.length * cardWidth ? 0 : newOffset;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused]);


  const handleNext = () => {
    setOffset((prev) => {
      const newOffset = prev - cardWidth;
      return newOffset <= -services.length * cardWidth ? 0 : newOffset;
    });
  };


  const handlePrev = () => {
    setOffset((prev) => {
      const newOffset = prev + cardWidth;
      return newOffset > 0 ? -(services.length - 1) * cardWidth : newOffset;
    });
  };


  return (
    <div className="container pt-3">
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h3"
          sx={{
            position: "relative",
            display: "inline-block",
            fontWeight: 800,
            fontSize: "2.7rem",
            color: "#0d47a1",
            fontFamily: `'Playfair Display', serif`,
            "&::after": {
              content: '""',
              position: "absolute",
              left: "50%",
              bottom: "-10px",
              transform: "translateX(-50%)",
              width: "140px",
              height: "4px",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #1066cb, #00c6ff)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            },
          }}
        >
          Our Services
        </Typography>
      </Box>


      {/* Carousel wrapper with buttons on sides */}
      <CarouselWrapper>
        {/* Left Navigation Button */}
        <NavButton onClick={handlePrev}>
          <ArrowBackIosNew sx={{ fontSize: "18px" }} />
        </NavButton>


        {/* Carousel container */}
        <CarouselContainer
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <CarouselTrack offset={offset}>
            {duplicatedServices.map((service, index) => (
              <ServiceBox key={index}>
                <IconContainer>{service.icon}</IconContainer>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      mb: 0.5,
                      color: "#fff",
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      lineHeight: 1.4,
                      background: "rgba(255,255,255,0.15)", // subtle highlight
                      padding: "2px 6px",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {service.description}
                  </Typography>


                </Box>
              </ServiceBox>
            ))}
          </CarouselTrack>
        </CarouselContainer>


        {/* Right Navigation Button */}
        <NavButton onClick={handleNext}>
          <ArrowForwardIos sx={{ fontSize: "18px" }} />
        </NavButton>
      </CarouselWrapper>
    </div>
  );
};


export default ServicesCarousel;