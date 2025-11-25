import React, { useState } from 'react';
import { Box, Typography, Button, MobileStepper, useTheme, Paper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Footer from '../Footer';
import Offer from '../Offer';
import { getImageUrl } from '../../utils/airlineUtils';
// import { Helmet } from 'react-helmet-async';

const testimonials = [
  {
    image: getImageUrl("testimonial1.png"),
    text: `Wagnistrip made booking my flight easy and stress-free, and they provided excellent service. 
           They provided excellent bargains and tailored recommendations. Their helpful and kind assistance 
           made sure everything went smoothly. Without a doubt, I'll use them on my next trip!`,
    name: 'Simran Rajput',
  },
  {
    image: getImageUrl("testimonial2.png"),
    text: `I'm really happy with the wagnistrip service. They handled every aspect and booked the ideal 
           flights for my journey. Their exceptional customer service made the entire process simple and 
           enjoyable. Strongly advised. Without a doubt, I'll use them on my next trip.`,
    name: 'Henry Jobs',
  },
  {
    image: getImageUrl("testimonial3.png"),
    text: `Wagnistrip made traveling easy for me recently. My search for the best flights was aided by their 
           helpful staff, and the booking process was simple thanks to their prompt service. They provided 
           excellent help, and I will use them again for my booking needs.`,
    name: 'Raushni Kumari',
  },
];

const Testimonial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const maxSteps = testimonials.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <>
      {/* <Helmet>
        <title>Customer Testimonials | Wagnistrip – Reviews from Our Users</title>
        <meta
          name="description"
          content="Read what our satisfied customers have to say about their experience with Wagnistrip. See why travelers trust us for their flight booking needs."
        />
        <link rel="canonical" href="https://www.wagnistrip.com/testimonial" />
      </Helmet> */}

      <Offer title="testimonial" />

      <Box sx={{ maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src={testimonials[activeStep].image}
          alt={`Testimonial from ${testimonials[activeStep].name}`}
          sx={{
            width: '100%',
            height: { xs: 300, md: 500 },
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: 3,
            borderRadius: 2,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="white" aria-live="polite">
            {testimonials[activeStep].text}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            — {testimonials[activeStep].name}
          </Typography>
        </Paper>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={maxSteps <= 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={maxSteps <= 1}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            justifyContent: 'space-between',
          }}
        />
      </Box>

      <Footer />
    </>
  );
};

export default Testimonial;