import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { galileoApi } from './Api/apiService'; // Replace with your actual API service function
import LoadingComponents from './component/LoadingComponents';
import {
  Box,
  Grid,
  Typography,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Flightform from './component/FlightFom';
import Offer from '../src/component/Offer';
import Navbar from './component/Navbar';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const pathSegments = location.pathname.split('/');

  const currentDate = new Date();
  const [routeInfo, setRouteInfo] = useState({
    fromCity: "",
    fromIata: "",
    toCity: "",
    toIata: "",
  });
  // console.log("path segent", routeInfo);
  // Add 4 days to the current date
  const departureDate = new Date(currentDate);
  departureDate.setDate(departureDate.getDate() + 4);


  // Convert the date to a string in the format 'YYYY-MM-DD'
  const formattedDepartureDate = departureDate.toISOString().split('T')[0];


  const [formData, setFormData] = useState({
    tripType: 'oneway',
    departure: '',
    arrival: '',
    departureDate: formattedDepartureDate,
    returnDate: "",
    noOfAdults: 1,
    noOfChilds: 0,
    noOfInfants: 0,
    cabinClass: 'Y',
    flightFare: 'ADT'
  });


  const [routs, setroutes] = useState(null);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean); // removes empty ""

    setroutes(pathSegments[1]); // "flights"

    // If URL has city route
    if (pathSegments.length >= 2) {
      const lastSegment = pathSegments[pathSegments.length - 1]; // city-iata-to-city-iata

      if (lastSegment.includes("-to-")) {
        const [departureSegment, arrivalSegment] = lastSegment
          .split("-to-")
          .map((segment) => segment.toUpperCase());

        if (departureSegment && arrivalSegment) {
          const depParts = departureSegment.split("-");
          const arrParts = arrivalSegment.split("-");

          const capitalize = (str) =>
            str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

          const fromCity = capitalize(depParts[0] || "");
          const fromIata = depParts[1] ? depParts[1].toUpperCase() : "";

          const toCity = capitalize(arrParts[0] || "");
          const toIata = arrParts[1] ? arrParts[1].toUpperCase() : "";

          setRouteInfo({
            fromCity,
            fromIata,
            toCity,
            toIata,
          });

          setFormData((prevFormData) => ({
            ...prevFormData,
            departure: fromIata,
            arrival: toIata,
          }));
          return; // ✅ Exit after setting route
        }
      }
    }

    // ✅ Default: Delhi → Mumbai
    setRouteInfo({
      fromCity: "Delhi",
      fromIata: "DEL",
      toCity: "Mumbai",
      toIata: "BOM",
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      departure: "DEL",
      arrival: "BOM",
    }));
  }, [location.pathname]);




  const handleSearch = async () => {
    setLoading(true);


    try {
      localStorage.setItem('formData', JSON.stringify(formData));
      const responseData1 = await galileoApi("/flight/search", formData, {});
      const queryString = new URLSearchParams(formData).toString();
      console.log('Flight search response:', responseData1);
      if (responseData1?.tripType === 'oneway' && responseData1.status === 200) {
        // console.log("flight data go to  :", responseData1);
        const responseData = {
          travellers: responseData1.travellers,
          amadeus: responseData1.amadeus[0],
          currency: responseData1.currency,
          galileo: responseData1?.galileo[0]?.LowFareSearchRsp,
          tripType: responseData1?.tripType,
          trip: responseData1.trip,
          flightFare: responseData1?.flightfare,
          hostToken: responseData1.hostToken,
          coupons: responseData1?.coupons
        }
        // navigate(`/flightdetails?${queryString}`, { state: { responseData } })
      }
      setLoading(false);
      // navigate(`/flightdetails/${routs}`, { state: { responseData } });
    } catch (error) {
      console.error('Error fetching flight details:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (formData.departure && formData.arrival) {
      // console.log('Searching for flights from', formData.departure, 'to', formData.arrival);
      // handleSearch();
    }
  }, [formData?.departure, formData?.arrival]);


  return (

    <>
      <Navbar />
      <div>
        {loading ? <LoadingComponents /> : null}
        <Offer title="flight sector" />
        <Flightform existingData={formData} type="specil" />
        <div className='container'>
          <Grid container spacing={3} sx={{ py: 3 }}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <SidebarSection
                  title="Top Flights From Delhi"
                  items={[
                    { label: 'Delhi To Pune Flights', href: '/flights/delhi-del-to-pune-pnq/' },
                    { label: 'Delhi To Bilaspur Flights', href: '/flights/delhi-del-to-bilaspur-pab/' },
                    { label: 'Delhi To Goa Flights', href: '/flights/delhi-del-to-goa-goi/' },
                    { label: 'Delhi To Rajahmundry Flights', href: '/flights/delhi-del-to-rajahmundry-rja/' },
                    { label: 'Delhi To Kochi Flights', href: '/flights/delhi-del-to-kochi-cok/' },
                  ]}
                />

                <SidebarSection
                  title="Top Flights From Pune"
                  items={[
                    { label: "Pune To Agartala Flights", href: "/flights/pune-pnq-to-agartala-aix/" },
                    { label: "Pune To Hyderabad Flights", href: "/flights/pune-pnq-to-hyderabad-hyd/" },
                    { label: "Pune To Jorhat Flights", href: "/flights/pune-pnq-to-jorhat-jet/" },
                    { label: "Pune To Coimbatore Flights", href: "/flights/pune-pnq-to-coimbatore-cjb/" },
                    { label: "Pune To Cuddapah Flights", href: "/flights/pune-pnq-to-cuddapah-cup/" },
                  ]}
                />

                <SidebarSection
                  title="Cheap Flights From Delhi"
                  items={[
                    { label: "Delhi To Pune Flights", href: "/flights/delhi-del-to-pune-pnq/" },
                    { label: "Delhi To Bilaspur Flights", href: "/flights/delhi-del-to-bilaspur-pab/" },
                    { label: "Delhi To Goa Flights", href: "/flights/delhi-del-to-goa-goi/" },
                    { label: "Delhi To Rajahmundry Flights", href: "/flights/delhi-del-to-rajahmundry-rja/" },
                    { label: "Delhi To Kochi Flights", href: "/flights/delhi-del-to-kochi-cok/" },
                  ]}
                />

                <SidebarSection
                  title="Cheap Flights From Pune"
                  items={[
                    { label: 'Pune To Agartala Flights', href: '/flights/pune-pnq-to-agartala-aix/' },
                    { label: 'Pune To Hyderabad Flights', href: '/flights/pune-pnq-to-hyderabad-hyd/' },
                    { label: 'Pune To Jorhat Flights', href: '/flights/pune-pnq-to-jorhat-jet/' },
                    { label: 'Pune To Coimbatore Flights', href: '/flights/pune-pnq-to-coimbatore-cjb/' },
                    { label: 'Pune To Cuddapah Flights', href: '/flights/pune-pnq-to-cuddapah-cup/' },
                  ]}
                />

                <SidebarSection
                  title="Top International Flights From Delhi"
                  items={[
                    { label: 'Delhi To Dar Es Salaam Flights', href: '/flights/delhi-del-to-daressalaam-dsm/' },
                    { label: 'Delhi To Mykonos Flights', href: '/flights/delhi-del-to-mykonos-myk/' },
                    { label: 'Delhi To Roanoke Flights', href: '/flights/delhi-del-to-roanoke-rke/' },
                    { label: 'Delhi To Birmingham Flights', href: '/flights/delhi-del-to-birmingham-bhx/' },
                    { label: 'Delhi To Poznan Flights', href: '/flights/delhi-del-to-poznan-poz/' },
                  ]}
                />

                <SidebarSection
                  title="Top International Flights From Pune"
                  items={[
                    { label: 'Pune To Sharjah Flights', href: '/flights/pune-pnq-to-sharjah-shj/' },
                    { label: 'Pune To Raleigh Durham Flights', href: '/flights/pune-pnq-to-raleighdurham-rdu/' },
                    { label: 'Pune To Abu Dhabi Flights', href: '/flights/pune-pnq-to-abudhabi-auh/' },
                    { label: 'Pune To Vancouver Flights', href: '/flights/pune-pnq-to-vancouver-yvr/' },
                    { label: 'Pune To Berlin Flights', href: '/flights/pune-pnq-to-berlin-ber/' },
                  ]}
                />

                <SidebarSection
                  title="Flight Distance From Delhi"
                  items={[
                    { label: 'Delhi To Pune Distance', href: '/flights/delhi-del-to-pune-pnq/' },
                    { label: 'Delhi To Bilaspur Distance', href: '/flights/delhi-del-to-bilaspur-pab/' },
                    { label: 'Delhi To Goa Distance', href: '/flights/delhi-del-to-goa-goi/' },
                    { label: 'Delhi To Rajahmundry Distance', href: '/flights/delhi-del-to-rajahmundry-rja/' },
                    { label: 'Delhi To Kochi Distance', href: '/flights/delhi-del-to-kochi-cok/' },
                  ]}
                />

                <SidebarSection
                  title="Flight Distance From Pune"
                  items={[
                    { label: 'Pune To Agartala Distance', href: '/flights/pune-pnq-to-agartala-aix/' },
                    { label: 'Pune To Hyderabad Distance', href: '/flights/pune-pnq-to-hyderabad-hyd/' },
                    { label: 'Pune To Jorhat Distance', href: '/flights/pune-pnq-to-jorhat-jet/' },
                    { label: 'Pune To Coimbatore Distance', href: '/flights/pune-pnq-to-coimbatore-cjb/' },
                    { label: 'Pune To Cuddapah Distance', href: '/flights/pune-pnq-to-cuddapah-cup/' },
                  ]}
                />

                <SidebarSection
                  title="Flight Schedule From Delhi"
                  items={[
                    { label: 'Delhi To Pune Flight Schedule', href: '/flights/delhi-del-to-pune-pnq/' },
                    { label: 'Delhi To Bilaspur Flight Schedule', href: '/flights/delhi-del-to-bilaspur-pab/' },
                    { label: 'Delhi To Goa Flight Schedule', href: '/flights/delhi-del-to-goa-goi/' },
                    { label: 'Delhi To Rajahmundry Flight Schedule', href: '/flights/delhi-del-to-rajahmundry-rja/' },
                    { label: 'Delhi To Kochi Flight Schedule', href: '/flights/delhi-del-to-kochi-cok/' },
                  ]}
                />

                <SidebarSection
                  title="Flight Schedule From Pune"
                  items={[
                    { label: 'Pune To Agartala Flight Schedule', href: '/flights/pune-pnq-to-agartala-aix/' },
                    { label: 'Pune To Hyderabad Flight Schedule', href: '/flights/pune-pnq-to-hyderabad-hyd/' },
                    { label: 'Pune To Jorhat Flight Schedule', href: '/flights/pune-pnq-to-jorhat-jet/' },
                    { label: 'Pune To Coimbatore Flight Schedule', href: '/flights/pune-pnq-to-coimbatore-cjb/' },
                    { label: 'Pune To Cuddapah Flight Schedule', href: '/flights/pune-pnq-to-cuddapah-cup/' },
                  ]}
                />


                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Delhi Airport Contact Info</Typography>
                  <Typography>Name: <Typography
                    component="span"
                    sx={{
                      textDecoration: 'none',
                      color:'#1976d2',
                      cursor: 'default',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Indira Gandhi International Airport
                  </Typography></Typography>
                  <Typography>Code: DEL</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Pune Airport Contact Info</Typography>
                  <Typography>Name: <Typography
                    component="span"
                    sx={{
                      textDecoration: 'none',
                      color:'#1976d2',
                      cursor: 'default',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Pune Airport
                  </Typography></Typography>
                  <Typography>Code: PNQ</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <Paper
                sx={{
                  p: 3,
                  boxShadow: "none",
                  borderRight: "none",
                }}
                elevation={3}
              >
                {/* Heading */}
                <Typography
                  variant="h5"
                  mb={2}
                  fontWeight="bold"
                  gutterBottom
                  textAlign="center"
                  color="primary"
                >
                  {routeInfo.fromCity} ({routeInfo.fromIata}) to {routeInfo.toCity} ({routeInfo.toIata}) Flight Information
                </Typography>

                {/* Paragraphs */}
                <Typography paragraph>
                  You can now easily make online flight bookings from{" "}
                  {routeInfo.fromCity} ({routeInfo.fromIata}) to {routeInfo.toCity} (
                  {routeInfo.toIata}) at just ₹3999 (per person) with Wagnistrip...
                </Typography>

                <Typography paragraph>
                  Nevertheless, with Wagnistrip you can also avail of multiple special
                  offers and exciting deals...
                </Typography>

                {/* Details */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {routeInfo.fromCity} ({routeInfo.fromIata}) to {routeInfo.toCity} (
                  {routeInfo.toIata}) Flights Details
                </Typography>

                <Typography paragraph>
                  It’s really intimidating to search, visit, and check out flights from{" "}
                  {routeInfo.fromCity} ({routeInfo.fromIata}) to {routeInfo.toCity} (
                  {routeInfo.toIata})...
                </Typography>

                <Typography paragraph>
                  When it comes to the distance between {routeInfo.fromCity} to{" "}
                  {routeInfo.toCity}, then the average distance would be 1156 Kilometre
                  approximately...
                </Typography>

                {/* Connectivity Info */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Flight Connectivity & Schedule Info
                </Typography>

                <Typography paragraph>
                  Currently, all the well-renowned flights offer non-stop flights from{" "}
                  {routeInfo.fromCity} to {routeInfo.toCity}...
                </Typography>

                <Typography paragraph>
                  Besides this, {routeInfo.fromCity} Airport and {routeInfo.toCity} Airport
                  are the nearest airports...
                </Typography>
              </Paper>

              <FAQSection
                origin={routeInfo.fromCity}
                destination={routeInfo.toCity}
                originCode={routeInfo.fromIata}
                destinationCode={routeInfo.toIata}
              />
            </Grid>

          </Grid>
        </div>
      </div>
    </>
  );
};


export default Test;


const SidebarSection = ({ title, items }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <List dense>
      {items.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            component="a"
            href={item.href}
            // target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);


const FAQSection = ({ origin = "Delhi", destination = "Mumbai", originCode = "DEL", destinationCode = "BOM" }) => {
  const faqData = [
    {
      question: `Is there a web check-in option for the flight from ${origin} to ${destination}?`,
      answer: `Yes, passengers can make online or airport check-ins for the flight from ${origin} (${originCode}) to ${destination} (${destinationCode}).`
    },
    {
      question: `Can I make online reservations for cheap hotels close to the ${destination} Airport?`
    },
    {
      question: `How can I get an online cheap flight ticket from ${origin} to ${destination}?`
    },
    {
      question: `When is the best time to purchase airline tickets from ${origin} to ${destination} at the lowest price?`
    },
    {
      question: `How long does it take to travel between ${origin} and ${destination} by flight?`
    },
    {
      question: `How many classes are available to fly from ${origin} to ${destination}?`
    },
    {
      question: `What are the traveller’s most preferred airlines from ${origin} to ${destination}?`
    },
    {
      question: `What are the latest ${origin} to ${destination} Flight Offers at Wagnistrip?`
    },
    {
      question: `What’s the best time to book a flight ticket with the lowest airfare from ${origin} to ${destination}?`
    },
  ];

  return (
    <div sx={{ mt: 5, mb: 5 }} className='p-3'>
      <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
        FAQ's
      </Typography>

      {faqData.map((faq, index) => (
        <Accordion key={index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq-${index}-content`} id={`faq-${index}-header`}>
            <Typography fontWeight="bold">Q. {faq.question}</Typography>
          </AccordionSummary>
          {faq.answer && (
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </div>
  );
};

