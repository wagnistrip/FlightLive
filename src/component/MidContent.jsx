import React, { useEffect, useState } from 'react'
import "./MidContent.css"
import { useLocation } from 'react-router-dom';
import Flightform from './FlightFom';
import TopDestinations from './topDestination';
import { Box, Typography } from '@mui/material';
import Promosection from './Promosection';
import domesticflight from '../image/domesticflight.webp'
import internationalflight from '../image/internationflight.webp'
import offerst2 from '../image/tu.webp'
import offerst3 from '../image/3.webp'
import { useSelector } from 'react-redux';
import ServicesCarousel from './ServicesCarousel';
const MidContent = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const currentPath = location.pathname;
  const [passangerData, setPassangerData] = useState(null);

  useEffect(() => {
    const searchdata = localStorage.getItem('formData');
    if (searchdata) {
      const parsedData = JSON.parse(searchdata);
      setPassangerData(parsedData);
    }
  }, []);



  const offers = [
    {
      image: user && user?.users?.role === 2 ? offerst2 : domesticflight,
      route: "/domestic-flights",
      btnName: user && user?.users?.role === 2 ? "Purchase Now" : "Book Now",
      status: user && user?.users?.role === 2 ? "true" : "false",
      price: 99,
      chips: 500,
    },
    {
      image: user && user?.users?.role === 2 ? offerst3 : internationalflight,
      route: "/international-flights",
      btnName: user && user?.users?.role === 2 ? "Purchase Now" : "Book Now",
      status: user && user?.users?.role === 2 ? "true" : "false",
      price: 199,
      chips: 1000,
    }

  ];
  const promoTitle =
    user && user?.users?.role === 2
      ? "Discount Coupons to Earn Commissions"
      : "Your Doorway to Domestic and International Journeys";
  return (
    <div>
      {/* {user && <SearchFlights />} */}
      <div className='d-block d-md-none'>
        <Flightform existingData={passangerData} />
      </div>
      {
        currentPath !== '/specialflight' && (
          <section className="section_padding_top">
            <div className="d-none d-md-block">
              <ServicesCarousel user={user} />
            </div>
          </section>

        )
      }
      {
        (!user || (user && user.users?.role === 1) || (user && user?.users?.agent_type === 'B')) && (
          <Promosection offersdata={offers} title={promoTitle} />
        )
      }

      {
        currentPath !== '/specialflight' && (
          <>
            <TopDestinations />
          </>

        )
      }
      <Articlesection />
    </div>
  )
}

export default MidContent

const Articlesection = () => {
  const [show, setShow] = useState(false);
  return (
    <Box className="pt-4 mb-3 text-justify">
      <Box className="container">


        {/* Section 1 */}
        <Typography
          variant="h5"
          fontWeight="bold" sx={{ mt: 1, color: "#0e0e0e", fontSize: "15px", lineHeight: 1.4 }}
        >
          Get Cheap Air Flight Tickets Deals​ With Wagnistrip


        </Typography>
        <Typography variant='h5' sx={{ mt: 1, color: "#565560", fontSize: "15px", lineHeight: 1.4 }}>
          Not able to find cheap air flight ticket deals, nothing to worry, wagnistrip is here to solve all your issues. We can guarantee that you will find the best cheap flight deals on Wagnistrip, with the cheapest fare available on the entire travel website, and also enjoy a premium experience throughout your trip. Through Wagnistrip, you can book the best budget flights worldwide. Because of the enormous discount coupons available on the website, you can easily book affordable business class flights with huge savings in your wallet.
          From googling the affordable last minute flights to getting cheap flight travel deals, you can get all these services with a bumper offer only on wagnistrip.


        </Typography>


        <Typography
          variant="h5"
          fontWeight="bold" sx={{ mt: 1, color: "#0e0e0e", fontSize: "15px", lineHeight: 1.4 }}
        >
          Make the whole Procedure Of Group Ticket Booking in Flight Easy with Wagnistrip


        </Typography>
        <Typography variant='h5' sx={{ mt: 1, color: "#565560", fontSize: "15px", lineHeight: 1.4 }}>
          Whenever we heard of group ticket booking flight, we always think that it is going to cost my pocket alot, and on top of that, if it's an international flight, then for the middle class it's the end point, but you dont have to take extra stress as we are one of the best flight ticket booking agency in india with an excellent customer dealing employers who are available for the users 24/7. If you are a new user and dont know how to book a ticket, you just have to write book my flight ticket online with wagnistrip then you will get the best cheap flight deals, and even if you are not satisfied till now, then you can compare the fare price with any other travel website.


        </Typography>
        <Typography variant="h5"
          fontWeight="bold" sx={{ mt: 1, color: "#0e0e0e", fontSize: "15px", lineHeight: 1.4 }}>
          Why Book with Wagnistrip?
        </Typography>
        <Typography variant='h5' sx={{ mt: 1, color: "#565560", fontSize: "15px", lineHeight: 1.4 }}>
          Booking with wagnistrip will give you perks only as we want from a travel website, while travelling from one destination to another, which is that we get the cheap air flight tickets deals, affordable last minute flights in case of emergencies, and a flight ticket booking agency that provides us with the best budget flight around the world and we can trust the agency anytime and also referred to our friends by which everyone can take the benefit and thats what we do right, then all these services are available on wagnistrip which you can avail by doing the sign up.




        </Typography>
        <Typography variant='h5' sx={{ mt: 1, color: "#565560", fontSize: "15px", lineHeight: 1.4 }}>
          The procedure for book my flight ticket online by a user is totally customer-friendly and without any inconvenience, anyone can book the flight tickets and other travel services with wagnistrip. Even the expensive business class flights are available as affordable business class flight on wagnistrip. We are not just a flight ticket booking agency; other than that, you can book travel packages, hotels, visa and passport services, and event management. We have multiple offers that will benefit your travel journey in many ways.




        </Typography>
        <Typography variant="h5"
          fontWeight="bold" sx={{ mt: 1, color: "#0e0e0e", fontSize: "15px", lineHeight: 1.4 }} >
          How to Get Cheap Flight Travel Deals
        </Typography>
        <Typography >
          We are going to share some tips which will help you get the Cheap air flight Ticket Deals, which are mentioned below for your reference:
        </Typography>
        <Box style={{ listStyleType: 'square' }} component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Book always in advance, as it will reduce the cost of the flight significantly compared to the fare that you are going to get at the last minute.


            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Always compare the prices to get the best budget flights.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Always make sure to book from a trusted company.
            </Typography>
          </li>
          <li>
            <Typography>
              Take advantage of the coupons and offers available on the website.
            </Typography>
          </li>
          <li>
            <Typography>
              To get an inexpensive business class flight, you can book a one-way ticket from one airline and then switch to the other one while coming back to your home country.
            </Typography>
          </li>
          <li>
            <Typography>
              Always sign up with travel companies like us to take advantage of the offers, as they end rapidly.
            </Typography>
          </li>
          <li>
            <Typography>
              Make sure you collect the tokens, like green chips, which are available on our website, to get more discounts.
            </Typography>
          </li>
          <li>
            <Typography>
              You can look for offers available at festivals as the price gets lower.
            </Typography>
          </li>
        </Box>
      </Box>
    </Box>
  )
}





