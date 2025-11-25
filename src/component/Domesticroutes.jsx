import React from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { CheckCircle, FiberManualRecord } from "@mui/icons-material";
import ImgCarousel from "./ImgCarousel";
import Footer from "./Footer";
import { Helmet } from 'react-helmet-async';

// Section heading with underline
const SectionHeading = ({ title }) => (
  <Box mb={3}>
    <Typography
      variant="h5"
      fontWeight="600"
      sx={{
        display: "inline-block",
        borderBottom: "2px solid #01186c",
        pb: 0.5,
        color: "#01186c",
      }}
    >
      {title}
    </Typography>
  </Box>
);


const Domesticroutes = () => {
  return (
    <>
    
      <ImgCarousel />
      <Container sx={{ py: 6, maxWidth: "1447px !important", width: "100%" }}>
        {/* 1. Best Site to Book Cheap Domestic Flights in India */}
        <SectionHeading title="Best Site to Book Cheap Domestic Flights in India" />
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We can place a wager that on Wagnistrip, you will get low cost domestic flight tickets with enormous deals on domestic flight bookings. If we talk about flight fares, then it's nearly impossible for a middle-class person to afford flight tickets for all the members of the family, but now you will not face this issue either as because Wagnistrip is the solution for all of your problems.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Wagnistrip will solve all your issues and help you find huge discounted deals on domestic flight booking. Sometimes, some emergencies happen, and we have to travel from one state to another, and for that, we have last minute domestic flight deals, where you can easily book your flight tickets without spending too much money and can save a good amount of money.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Even on the busy days, you will get to see cheap domestic business class flights, and you can compare the fare with other sites for your own satisfaction.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We have the best domestic flight discount coupon which are available all the time and throughout the year, they keep changing with multiple new benefits.
        </Typography>


        {/* 2. Best Ways to Get Cheap Domestic Flights */}
        <SectionHeading title="Best Ways to Get Cheap Domestic Flights" />
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          The following best ways to get cheap domestic flights will help you find low cost domestic flight tickets, which help you invest the saved money in other things during your whole trip:
        </Typography>
        <List sx={{ pl: 2 }}>
          {[
            "You should always book your tickets in advance, and this is the only advice that you will get from everyone in case of travel booking.",
            "You should avoid making your booking in the peak festival season and on weekends. Tuesday and Thursday usually have the best deals.",
            "You can compare the fare prices with various travel websites to get the maximum discount on domestic flights.",
            "Join newsletters or turn on notifications to grab the lowest fare alerts. On Wagnistrip, this guarantees maximum discounts.",
            "Set alerts for budget airlines to stay within your budget and still get a good experience.",
            "Save tokens and points — on Wagnistrip we have Green Chips, which help you purchase a ticket at a reduced price.",
            "Clear your browser cookies or search in incognito mode to get fresh deals."
          ].map((tip, i) => (
            <ListItem key={i} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <FiberManualRecord sx={{ fontSize: 10, color: "#01186c" }} />
              </ListItemIcon>
              <ListItemText
                primary={tip}
                primaryTypographyProps={{ fontSize: "1rem", lineHeight: 1.7 }}
              />
            </ListItem>
          ))}
        </List>


        {/* 3. Wagnistrip Makes Booking Easy */}
        <SectionHeading title="Wagnistrip Makes the Online Domestic Flight Booking Easy" />
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          With Wagnistrip, you don't have to go through a long procedure to book a ticket, as the whole procedure is very easy and convenient for any user, even if they are using the website for the very first time. All you have to do is search on Google and type Wagnistrip, and then you have to click on the sector that you want to travel, add the passengers, and here you go — Wagnistrip makes the online domestic flight booking easy and makes your trip more memorable.
        </Typography>


        {/* 4. Why Choose Wagnistrip */}
        <SectionHeading title="Why Choose Wagnistrip to Get the Best Cheap Domestic Flights?" />
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Trusted company with 24/7 assistance"
              secondary="You are not just choosing a platform to book a ticket but a trusted company with highly experienced employees available 24/7 to assist you during your trip."
              primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
            />
          </ListItem>


          <ListItem sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="No hidden charges and discount coupons"
              secondary="We offer the best domestic flight discount coupons with no hidden charges or convenience fees. These reduce the final fare significantly."
              primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
            />
          </ListItem>


          <ListItem sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Flexibility of options"
              secondary="Choose any flight according to your trip with multiple flexible options available on Wagnistrip."
              primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
            />
          </ListItem>


          <ListItem sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircle sx={{ color: "#01186c" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Ongoing discounts & Green Chips"
              secondary="We provide multiple discounts throughout the year. New users get vouchers up to ₹2000 and Green Chips to purchase tickets at a reduced fare."
              primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              secondaryTypographyProps={{ fontSize: "0.95rem", lineHeight: 1.7 }}
            />
          </ListItem>
        </List>


        {/* 5. FAQ Section */}
        <SectionHeading title="Frequently Asked Questions" />
        <List sx={{ pl: 2 }}>
          {[
            {
              q: "Is a passport required for a domestic flight?",
              a: "No, a passport is not required for domestic flights in India. A valid government-approved photo ID is enough."
            },
            {
              q: "How much cash can be carried in a domestic flight?",
              a: "There is no strict limit, but if you carry between ₹50,000 to ₹2,00,000, you must carry documents to justify the amount."
            },
            {
              q: "How to book online domestic flight tickets in India?",
              a: "You can book either directly through an airline’s website or via aggregators like Wagnistrip. Just select the sector, passengers, airline, and complete payment."
            },
            {
              q: "Can we carry gold on a domestic flight?",
              a: "Yes, but you must carry the receipt if you are carrying gold in bulk amounts."
            },
            {
              q: "What ID proofs are required for domestic flights?",
              a: "A government-approved photo ID (like Aadhaar, PAN, Voter ID, Driving License) is required."
            },
            {
              q: "How to change name on a domestic flight?",
              a: "Most airlines don’t allow name changes except for minor corrections, which may involve a fee. Contact your mediator or the airline directly."
            },
            {
              q: "How much gold is allowed on a domestic flight?",
              a: "There is no specific weight limit defined, but receipts are mandatory if carrying large amounts."
            },
            {
              q: "Are pets allowed in domestic flights in India?",
              a: "Yes, some airlines allow pets if you provide proper vaccination and travel documents. Always check airline policies first."
            }
          ].map((faq, i) => (
            <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ color: "#01186c" }}>
                {faq.q}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {faq.a}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Container>
      <Footer />
    </>
  );
};


export default Domesticroutes;
