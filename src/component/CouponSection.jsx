import React from 'react'
import Footer from './Footer'
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import Offer from './Offer';
import offersection12 from '../../src/image/offerimg12.png'
import { useLocation } from "react-router-dom";
const CouponSection = () => {
    const location = useLocation();
    const coupon = location.state?.coupon;
    console.log("coupon ==>", coupon);

    return (
        <>
            <Offer title="offers & promocode " />
            {/* <Flightform /> */}
            <div className='container mt-5'>
                <Box sx={{paddingTop:'20px' }}>
                    {/* Header Section */}
                    <Typography variant="h5" fontWeight="bold" align="start" gutterBottom>
                        Travel the World with Wagnistrip and Get Exciting Vouchers Worth an amount of  25000 on Flights, Holiday, and Hotels.
                    </Typography>

                    <Grid container spacing={5}>
                        {/* Left Content Section */}
                        <Grid item xs={12} md={8}>
                            {/* Booking Period & Promo Code Section */}
                            <Grid container spacing={2} sx={{ my: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ bgcolor: "#f5f5f5", textAlign: "center" }}>
                                        <CardContent>
                                            <Typography color="#8B3EEA" fontWeight="bold">
                                                BOOKING PERIOD
                                            </Typography>
                                            <Typography color='#0e0e0e' fontWeight="bold">15th Jan - 14th Feb, 2025</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ bgcolor: "#8B3EEA", color: "white", textAlign: "center" }}>
                                        <CardContent>
                                            <Typography style={{ fontSize: '12px' }} color="#fff">Promo Code</Typography>
                                            <Typography color='white' variant='h5' fontWeight="bold">
                                                {coupon ? coupon.code : 'WTJKFGHK'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                          

                            {/* Offer Details Table */}
                            <Card sx={{ my: 8 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">What Do You Get?</Typography>
                                    <table className="table table-bordered mt-3">
                                        {/* <thead style={{ backgroundColor: "#8B3EEA", color: "white" }}> */}
                                        <thead style={{ backgroundColor: "#b87fff61", color: "#0e0e0e" }}>
                                            <tr style={{ backgroundColor:'#b87fff61' }}>
                                            <th>Services</th>
                                            <th>Minimum Booking Amount</th>
                                            <th>Offer</th>
                                            </tr>
                                        </thead>
                                        {/* </thead> */}
                                        <tbody>
                                            <tr>
                                                <td>Domestic Flight</td>
                                                <td>No Minimum Booking Amount</td>
                                                <td>Flat 12% Up to INR 2,000</td>
                                            </tr>
                                            <tr>
                                                <td>International Flight</td>
                                                <td>No Minimum Booking Amount</td>
                                                <td>Flat 10% Up to INR 5,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>

                            {/* How Do You Get It Section */}
                            <Card sx={{ my: 8 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">How can you acquire it?</Typography>
                                    <div style={{ paddingLeft: '20px' }} className='mt-3'>
                                        <p>All you have to do to get this offer is just add the coupon code <b>{coupon ? coupon.code : 'WTJKFGHK'}</b> before paying for any flight, holiday, or hotel service.</p>
                                        <p>After using the code then you become eligible for the lucky draw.</p>
                                        <p>After the whole procedure, you will receive an email on the booking email or the regular one which is linked as who had a list of all the offers worth 25000.</p>
                                        <p>The ones who got selected will receive a mail regarding their selection in the lucky draw within 48 to 72 hours of your booking.</p>
                                        <p>This coupon offer will apply to all new and existing customers.</p>
                                        <p>You can book through the website, mobile, iOS, or wagnistrip.</p>
                                        <p>One thing you have to keep in mind is that once you book any flight, holiday, or hotel from the above coupon if you cancel any of the above services then the amount you have paid is not refundable.</p>

                                    </div>
                                </CardContent>
                            </Card>
                            <Card sx={{ my: 8 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">What other things do you have to know about this coupon?
                                    </Typography>
                                    <div style={{ paddingLeft: '20px' }} className='mt-3'>
                                        <p>Users can use only one coupon at a time.</p>
                                        <p>The offer is for both users the new one and the existing one.</p>
                                        <p>The specific offer cannot be merged with any other promotions or offers.
                                        </p>
                                        <p>The convenience fees will be charged.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card sx={{ my: 8 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">Terms & Conditions</Typography>
                                    <div style={{ paddingLeft: '20px' }} className='mt-3'>
                                        <p>Wagnistrip has all the rights to reserve the specific offer in case of any miss apply or exploitation of the coupon.
                                        </p>
                                        <p>Wagnistrip has the sole authority of all the terms & conditions.
                                        </p>
                                        <p>Wagnistrip booking and privacy policy will be applied to the specific coupon offer.</p>
                                        <p>The jurisdiction will be handled by the new Delhi High Court in case of any dispute.
                                        </p>
                                        <p>Wagnistrip has the full authority to change the offer with any other one or modify, it without giving any prior notice.
                                        </p>
                                        <p>Wagnistrip is not responsible for any kind of damage caused by uncontrollable events like earthquakes, hurricanes, tornados or all type of force majure.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Right-Side Banner */}
                        <Grid item xs={12} md={4} sx={{ textAlign: "start" }}>
                            <img
                                src={offersection12}
                                alt="Promo Banner"
                                style={{ borderRadius: '8px', marginTop: '30px' }}
                            />
                            {/* <Typography variant="h6" fontWeight="bold" mt={2}>
                                Kickstart 2025 With a Vacation!
                            </Typography> */}
                            <Typography mt={2} > {coupon ? coupon.description : 'Enjoy Up to ₹5,000 OFF* on Travel with J&K Bank Mastercard.'} </Typography>
                            <div className='d-flex align-items-center justify-content-start mt-2 gap-2'>
                                {/* <Button variant="contained" color="primary" sx={{ my: 2 }}>
                                Use Code: WTJKFGHK
                            </Button> */}
                                <button style={{ background: '#8B3EEA', color: 'var(--white-color)' }} className='btn shadow'>
                                    Use Code: {coupon ? coupon.code : 'WTJKFGHK'}
                                </button>
                                <Typography variant="caption">*T&C Apply</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <Footer />
        </>

    )
}

export default CouponSection