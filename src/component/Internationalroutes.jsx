import React from "react";
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { FlightTakeoff, CheckCircle } from "@mui/icons-material";
import ImgCarousel from "./ImgCarousel";


import { FiberManualRecord } from "@mui/icons-material";
import Footer from "./Footer";
// Section Heading component
const SectionHeading = ({ title }) => (
    <Box mb={3}>
        <Typography
            variant="h5"
            fontWeight="600"
            sx={{
                display: "inline-block",
                borderBottom: "2px solid #01186c", // thin underline
                pb: 0.5,
                color: "#01186c", // heading color
            }}
        >
            {title}
        </Typography>
    </Box>
);


const Internationalroutes = () => {
    return (
        <div>
    

            <ImgCarousel />
            <Container maxWidth="lg" sx={{
                py: 6,
                maxWidth: "1447px !important", // force custom width
                width: "100%",                  // still responsive
            }}>
                {/* Main Heading */}
                <Typography
                    variant="h4"
                    fontWeight="600"
                    gutterBottom
                    sx={{ color: "#01186c" }}
                >
                    Best International Airfare Deals
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    paragraph
                    sx={{ fontWeight: 500 }}
                >
                    Cheap Airfare International Flights
                </Typography>


                {/* Intro */}
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    If you are planning an international trip and are tired of not finding the low cost international airfare, then your search is going to end here, as we are going to give you the best international airfare deals with no comprising in the quality and experience. After your experience with us, you will get to about why wagnistrip is ranked as one of the best and cheapest international flight booking sites. No matter if you are flying in business class or economy, here you will find the lowest international flight booking prices with enormous coupons and huge deals throughout the year.


                </Typography>


                {/* Why Choose Us */}
                <SectionHeading title="Why Choose Us for Cheap Airfare International Flights?" />


                {/* Intro paragraph above list */}
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    We give you a straight guarantee that you will find the low cost international fare at our site, and if you have any doubts in your mind, then you can compare our prices with other websites,   and you will get the answer by yourself. For the next time, you dont have to search for any other website, and you will come back to wagnistrip only.
                </Typography>


                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Book international flight tickets at lowest price"
                            secondary=" on our websites, you will find the lowest prices for every international flight, and this is also applicable for the domestic ones. By comparing all the sites' prices, we come up with the cheapest fare that exists on all the websites, which is going to save a good amount of your money as well, and you can use this amount in any other thing."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Booking international flights last minute"
                            secondary=" we know that last-minute flights cause alot of stress on your wallet, but here you are free of that also, as no matter if you are booking international flights last minute or a regular one, you are going to get the best price for your flight."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Trusted Travel Company"
                            secondary="We are a totally trusted travel company, which you can trust blindly for your travel experience. We are the best cheap international flight booking sites, where you will get the best rates for your travel journey, like international flights, even at the lowest fare, which is nearly impossible, as travelling to a foreign country is already very expensive, and if you are spending so much amount on your flight, then how are you going to manage other expenses."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="International Flight Group Booking"
                            secondary=" We also have multiple coupons and offers that help you get the best price for your international flight group booking. Travelling to a foreign country already costs more than we think, and when it comes to the international flight group booking, you must choose the  best international flight site in india, which is none other than wagnistrip, which is here to make your experience better with great travel services."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Cheap international flight tickets booking online"
                            secondary=" the procedure of booking from our website, wagnistrip, is quite easy and very convenient who even for a first-time user experiencing booking a flight online. It's not just our tag line of providing the cheapest flight fare here, but it's the actual reality, and for your peace of mind, you can book a ticket from our site and see the result by yourself.’"
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>
                </List>




                {/* How to Book */}
                <SectionHeading title="How to Book International Flight Tickets at Lowest Price?" />


                {/* Intro paragraph */}
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The procedure to book international tickets at the lowest price through Wagnistrip
                    is very convenient, and anyone can book it without any difficulty.
                </Typography>


                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                            <FiberManualRecord sx={{ fontSize: 10, color: "#01186c" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="If you want to get a bigger discount, then you should always sign up on the website, as without that, you won't be able to take advantage of those coupons."
                            primaryTypographyProps={{ fontSize: "1rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                            <FiberManualRecord sx={{ fontSize: 10, color: "#01186c" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="After completing that process, you had to search for the sector you want for your flight."
                            primaryTypographyProps={{ fontSize: "1rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                            <FiberManualRecord sx={{ fontSize: 10, color: "#01186c" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="You can compare the prices for self-clearance, and after that, you can search for the available coupons that are available at that specific amount of time."
                            primaryTypographyProps={{ fontSize: "1rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                            <FiberManualRecord sx={{ fontSize: 10, color: "#01186c" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="The next step is you choose which payment option is the most suitable for you, and then done, the steps are complete, and you are good to go for your flight."
                            primaryTypographyProps={{ fontSize: "1rem", lineHeight: 1.7 }}
                        />
                    </ListItem>
                </List>


                {/* Closing paragraph */}
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    We always focus on how we can provide the lowest international flight booking rates
                    to you, so that users never experience any type of inconvenience at any time.
                </Typography>




                {/* Effortless Travel */}
                <SectionHeading title="Enjoy an Effortless Travel Experience with the Best international Flight Booking site in india " />
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Unlike other websites that, in the name of providing cheap fare, cut alot of things which you had to compromise, but here you will not face any of these types of issues and have a seamless experience. At wagnistrip, you get the low airfare international flight. Whether you are  looking for an international flight group booking or for a usual solo trip, you are going to get an unforgettable experience that you are going to remember for your entire life, and with the best fare, which will take you to come back to our site. We always make sure these things, like even if the prices of the flight fares are cheaper, but there is no compromise in the quality of the experience, because this is the thing which makes the trip more memorable, and if you had a worse experience, then it's a total waste of your money and thats what we are dont wanna do to anyone.


                </Typography>


                {/* Why Travelers Trust */}
                <SectionHeading title="Why Travelers Trust Wagnistrip for Cheap International Flight Tickets Booking Online" />


                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Available multiple coupons throughout the year"
                            secondary="We have multiple and enormous discount coupons which are available throughout the year, so that users can avail the maximum discount whenever they book. For loyal users, we even provide huge discounts and gifts."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Convenient low airfare international flight options"
                            secondary="There are multiple convenient options available for you when booking a low fare international flight."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Exact price with no hidden charges"
                            secondary="Wagnistrip never charges extra fees beyond the original base fare. The amount you pay is always less than other fares available on competing websites."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>


                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon>
                            <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="24/7 Customer Support Available"
                            secondary="We provide full, round-the-clock customer support to anyone who avails travel services through our website."
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                            secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        />
                    </ListItem>
                </List>


            </Container>
            <Footer />
        </div>
    );
};


export default Internationalroutes;
