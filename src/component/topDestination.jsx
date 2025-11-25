import React, { useState } from 'react'
import CommonHeader from './commonHeader'
import { galileoApi } from '../Api/apiService';
import { Link, useNavigate } from 'react-router-dom';
import LoadingComponents from './LoadingComponents';
import { flightRoutes, flightRoutes2 } from '../utils/airlineUtils';
import { useSelector } from 'react-redux';
const TopDestinations = () => {
    const user = useSelector((state) => state.auth.user);
    const [selectedFromCountry, setSelectedFromCountry] = useState(null);
    const [selectedToCountry, setSelectedToCountry] = useState(null);


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleSubmit = async (route) => {
        const token = user && user?.token || null;
        // event.preventDefault();
        const departuedata = {
            "id": route.code,
            "city": route.from,

        };
        const arivalData = {
            "id": route.code2,
            "city": route.to,

        }
        setSelectedFromCountry(departuedata);
        setSelectedToCountry(arivalData);
        const formData = {
            tripType: 'oneway',
            departure: route.code,
            arrival: route.code2,
            departureDate: formatDate(new Date(new Date().setDate(new Date().getDate() + 2))),
            returnDate: "",
            noOfAdults: 1,
            noOfChilds: 0,
            noOfInfants: 0,
            cabinClass: 'Y',
            flightFare: 'ADT'
        };


        if (user && user?.users?.role === 2 && user && user?.users.status === 0) {
            navigate("/agent/registration");
            return
        }

        setLoading(true);


        try {
            const responseData1 = await galileoApi("/flight/search",formData,token);

            setLoading(false);
            localStorage.setItem('formData', JSON.stringify(formData));
            const queryString = new URLSearchParams(formData).toString();

            if (responseData1?.tripType === 'oneway' && responseData1?.status === 200) {
                // console.log("flight data go to  :", responseData1);
                const responseData = {
                    travellers: responseData1.travellers,
                    amadeus: responseData1.amadeus[0],
                    currency: responseData1.currency,
                    galileo: responseData1?.galileo[0]?.LowFareSearchRsp,
                    tripType: responseData1?.tripType,
                    trip: responseData1.trip,
                    flightFare: responseData1?.flightfare,
                    coupons: responseData1?.coupons,
                    hostToken: responseData1.hostToken,
                    chips: responseData1?.chips,
                }
                // console.log("flight design  :", responseData);
                navigate(`/flightdetails?${queryString}`, { state: { responseData } })


            }
            else {
                {
                    // console.log("flight data go to  :", responseData1);
                    const responseData = {
                        travellers: responseData1.travellers,
                        amadeus: responseData1.amadeus,
                        currency: responseData1.currency,
                        galileo: responseData1?.galileo,
                        tripType: responseData1?.tripType,
                        trip: responseData1.trip,
                        flightFare: responseData1?.flightfare,
                        coupons: responseData1?.coupons,
                        hostToken: responseData1.hostToken,
                    }
                    // console.log("flight design  :", responseData);
                    navigate(`/flightdetails?${queryString}`, { state: { responseData } })


                }
            }


        }
        catch (error) {
            console.error('Error fetching flight details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    localStorage.setItem('arivalData', JSON.stringify(selectedToCountry));
    localStorage.setItem('departureData', JSON.stringify(selectedFromCountry));
    return (

        <>
            {
                loading ? (<LoadingComponents />) : null
            }

            <section id="destinations_area" className="section_padding_top">
                <div className="container">
                    <CommonHeader title="Destinations for you" />
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="theme_nav_tab">
                                <nav className="theme_nav_tab_item">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button
                                            className="nav-link active"
                                            id="nav-nepal-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-nepal"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-nepal"
                                            aria-selected="true"
                                        >
                                            Domestic
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-malaysia-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-malaysia"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-malaysia"
                                            aria-selected="false"
                                        >
                                            International
                                        </button>

                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tab-content" id="nav-tabContent1">
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-nepal"
                                    role="tabpanel"
                                    aria-labelledby="nav-nepal-tab"
                                >
                                    <div className="row">

                                        {flightRoutes.map((route, index) => (
                                            <div key={index} className="col-lg-4 col-md-6 col-sm-12 col-12">
                                                <div onClick={() => handleSubmit(route)} className="tab_destinations_boxed">
                                                    <div className="tab_destinations_img">
                                                        <a href="top-destinations.html">
                                                            <img src={route.image} alt={`${route.to} Destination`} />
                                                        </a>
                                                    </div>
                                                    <div className="tab_destinations_conntent">
                                                        <h3>
                                                            <Link to="">
                                                                {route.from} ↔ {route.to}
                                                            </Link>
                                                        </h3>
                                                        <p>
                                                            {route.code}-{route.code2}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        }

                                    </div>


                                </div>



                                <div
                                    className="tab-pane fade"
                                    id="nav-malaysia"
                                    role="tabpanel"
                                    aria-labelledby="nav-malaysia-tab"
                                >
                                    <div className="row">
                                        {
                                            flightRoutes2?.map((route, index) => (
                                                <div key={index} className="col-lg-4 col-md-6 col-sm-12 col-12">
                                                    <div onClick={() => handleSubmit(route)} className="tab_destinations_boxed">
                                                        <div className="tab_destinations_img">
                                                            <a href="top-destinations.html">
                                                                <img src={route.image} alt={`${route.to} Destination`} />
                                                            </a>
                                                        </div>
                                                        <div className="tab_destinations_conntent">
                                                            <h3>
                                                                <Link to="#">{route.from} ↔ {route.to}</Link>
                                                            </h3>
                                                            <p>
                                                                {route.code}-{route.code2}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))
                                        }

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default TopDestinations