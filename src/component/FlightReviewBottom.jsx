
import React, { useState } from "react";
import { Card, Grid, Typography, Collapse } from "@mui/material";

const insuranceBenefits = [
  { title: "Hospitalization", amount: "USD 100000", icon: "🏥" },
  { title: "Trip Cancellation", amount: "USD 1000", icon: "❌" },
  { title: "Trip Delay", amount: "USD 300", icon: "⏳" },
  { title: "Baggage Loss", amount: "USD 500", icon: "🧳" },
  { title: "Baggage Delay", amount: "USD 200", icon: "⌛" },
  { title: "Personal Accident", amount: "USD 15000", icon: "🤕" },
  { title: "Repatriation of Remains", amount: "USD 100000", icon: "⚰️" },
  { title: "Dental Treatment", amount: "USD 300", icon: "🦷" },
  { title: "Personal Liability", amount: "USD 100000", icon: "⚖️" },
  { title: "Hijack Distress Allowance", amount: "USD 200/day max of 7 days", icon: "🚨" },
  { title: "Financial Emergency Allowance", amount: "USD 750", icon: "💰" },
  { title: "Missed (Flight) Connection", amount: "USD 500", icon: "✈️" },
  { title: "Compassionate Visit", amount: "USD 10000", icon: "🤝" },
  { title: "Loss of Passport", amount: "USD 250", icon: "📜" },
];
import './FlightReviewBottom.css'

function FlightReviewBottom({ baggage, departCity, arriveCity, matchedSolution }) {

 const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
    const baggageInfo = Array.isArray(baggage) && baggage.length > 0 ? baggage[0] : "15kg";

    const airPricingInfo = Array.isArray(matchedSolution?.AirPricingInfo)
        ? matchedSolution.AirPricingInfo[0]
        : matchedSolution?.AirPricingInfo;


    const cancellationFee = airPricingInfo?.CancelPenalty?.Amount || "Please ask the airline for cancellation fee details";

    return (
        <>
            <div className='container pb-2'>
                <div className='row card tour_details_boxed'>
                    <div className='col-lg-12 col-md-12'>
                        <div className='row'>
                            <div className='col-lg-12 gud-to-know'>
                                <span >
                                    <i className="fa fa-thumbs-up"></i>
                                    <span className='fw-bold ms-lg-2'>
                                        Good to Know  </span>

                                </span>

                            </div>


                        </div>

                        <div className='row text-start pt-3'>
                            <div className='col-lg-12'>
                                <div className='list'>
                                    <ul>
                                        {/* <li>
                                            <span className='fw-bold text-danger'>{baggageInfo}</span>  per passenger Check-in Baggage included for your selected flight on the sector  {departCity} to {arriveCity}
                                        </li> */}
                                        <li>
                                            Airline Cancellation Fee is  <span className='fw-bold text-danger'>{cancellationFee}</span> per passenger for your selected flight on the sector {departCity} to {arriveCity}
                                        </li>
                                        <li>
                                            Remember to web check-in before arriving at the airport
                                        </li>
                                        <li>
                                            Face masks are advisable
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>


                <div className='row card text-start rounded mt-3 tour_details_boxed'>
                    <div className='col-lg-12'>


                        <div className='row'>
                            <div className='col-lg-12 Imp-info'>
                                <div className='Important-Information'>
                                    <div className='h6 fw-bold'>Important Information </div>
                                    <ul>
                                        <li>
                                            Wearing face masks is no longer compulsory. However, it’s highly advised to wear masks to stay protected from threats imposed by COVID-19.
                                        </li>
                                        <li>Travellers can check the detailed travel guidelines issued by the Indian government.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='row card text-start tour_details_boxed mt-3'>
                    <div className='col-lg-12 col-md-12 gud-to-know-maindiv'>
                        <div className='row'>

                            <div className=' py-2 gud-to-know'>
                                <div className='d-flex align-items-start'>
                                    <div className=''>
                                        <i className="fa fa-plus-square"></i>
                                    </div>
                                    <div className='ms-lg-3'>
                                        <h6 className=' fw-bold '> Add Travel Insurance and Secure your Trip with ACKO View/ print your booking 199/Person  </h6>
                                        <p style={{ color: '#261dff' }}> (Upon Selecting Travel Insurance ,You accept the Terms and Conditions of the travel insurance policy )</p>
                                    </div>
                                </div>

                                <p>
                                    <i className="fa fa-chevron-right toggle-icon" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></i>
                                </p>
                            </div>

                            <div className="collapse d-none" id="collapseExample">
                                    <Grid container spacing={2} marginTop={1}>
                                        {/* Always show the first 3 cards */}
                                        {insuranceBenefits.slice(0, 3).map((item, index) => (
                                            <Grid item xs={6} sm={3} key={index}>
                                                <Card sx={{ textAlign: "center", padding: 2 }}>
                                                    <Typography variant="h5">{item.icon}</Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2">Sum Insured: {item.amount}</Typography>
                                                </Card>
                                            </Grid>
                                        ))}

                                        {/* More Button (only if not expanded) */}
                                        {!expanded && (
                                            <Grid item xs={6} sm={3}>
                                                <Card
                                                    sx={{
                                                        textAlign: "center",
                                                        padding: 2,
                                                        cursor: "pointer",
                                                        backgroundColor: "#f0f1f0",
                                                        height: "112px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                    onClick={toggleExpand}
                                                >
                                                    + More
                                                </Card>
                                            </Grid>
                                        )}
                                    </Grid>

                                    {/* Expanded Cards with Motion Effect */}
                                    <Collapse in={expanded} timeout={500} sx={{ marginTop: 2 }}>
                                        <Grid container spacing={2}>
                                            {insuranceBenefits.slice(3).map((item, index) => (
                                                <Grid item xs={6} sm={3} key={index}>
                                                    <Card sx={{ textAlign: "center", padding: 2 }}>
                                                        <Typography variant="h5">{item.icon}</Typography>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="body2">Sum Insured: {item.amount}</Typography>
                                                    </Card>
                                                </Grid>
                                            ))}

                                            {/* Show Less Button */}
                                            <Grid item xs={6} sm={3}>
                                                <Card
                                                    sx={{
                                                        textAlign: "center",
                                                        padding: 2,
                                                        cursor: "pointer",
                                                        backgroundColor: "#f5f5f5",
                                                        height: "112px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                    onClick={toggleExpand}
                                                >
                                                    Show Less
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                            </div>






                        </div>
                        <div className='row pt-3 pb-3'>
                            <div className='col-lg-12'>
                                <div className='list'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="insurance" id="flexRadioDefault1" />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            Yes, I want to secure my trip with insurance.
                                        </label>
                                        <div className='success_ins_msg'>More than 36% of our customer choose to secure their trip.</div>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="insurance" id="flexRadioDefault2" checked={true} readOnly />
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            No, I do not want to insure my trip
                                        </label>
                                        <div className='warning_ins_msg'>Ms. SAI got Rs. 2000 for the delay in trip since insurance was done for the trip.</div>
                                    </div>
                                </div>


                            </div>
                        </div>


                    </div>
                </div>

                <div>

                </div>


            </div>
        </>
    )
}


export default FlightReviewBottom 