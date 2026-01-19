
import React, { useState } from 'react';
import { GoArrowRight } from "react-icons/go";
import { TfiAlarmClock } from "react-icons/tfi";
import { Offcanvas, Button } from 'react-bootstrap';
import { calculateTravelTime, extraDiscountamount, getAdditiondiscount, getAirlineName, getAirportDataByCountry, getChipsByAmount, getImageUrl1, getServiceFee } from '../../utils/airlineUtils';
import { useSelector } from 'react-redux';
const BottomNavbar = ({ handleBookNow, selectedDeparture, selectedReturn, currency, adult = 1, child, infant, trip = "D", chips, extra_discount }) => {
    const commonPrice = useSelector((state) => state.booking.commonPrice);
    const user = useSelector((state) => state.auth.user);
    const parseFlightData = (flightData) => {
        if (!flightData) {
            return null;
        }
        if (flightData.PricingInfos) {
            // Response type 1
            const segments = Array.isArray(flightData.segments) ? flightData.segments : [flightData.segments] || [];
            if (segments.length === 0) {
                return [];
            }

            const firstSegment = segments[0];
            const lastSegment = segments[segments.length - 1];
            return {
                departure: {
                    iataCode: firstSegment["@attributes"].Origin,
                    at: firstSegment["@attributes"].DepartureTime
                },
                arrival: {
                    iataCode: lastSegment["@attributes"].Destination,
                    at: lastSegment["@attributes"].ArrivalTime
                },
                carrierCode: firstSegment["@attributes"].Carrier,
                number: firstSegment["@attributes"].FlightNumber,
                price: flightData.PricingInfos["@attributes"].ApproximateTotalPrice.replace('INR', ""),
            };
        } else if (flightData.Itineraries) {
            // Response type 2
            const itineraries = flightData.Itineraries.Itinerary;
            if (itineraries.length === 0) {
                return [];
            }

            const firstSegment = itineraries[0];
            const lastSegment = itineraries[itineraries.length - 1];

            return {
                departure: {
                    iataCode: firstSegment.Origin.AirportCode,
                    at: firstSegment.Origin.DateTime
                },
                arrival: {
                    iataCode: lastSegment.Destination.AirportCode,
                    at: lastSegment.Destination.DateTime
                },
                carrierCode: firstSegment.AirLine.Code,
                number: firstSegment.AirLine.Identification,
                price: flightData.PricingInfos.PricingInfo[0]?.Total?.Fare || "N/A"
            };
        }
        return [];
    };
    const parseFlightData2 = (flightData) => {
        if (!flightData) {
            return null;
        }


        const calculateDuration = (startTime, endTime) => {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const diffMs = end - start;
            const diffMins = diffMs / (1000 * 60);
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            return `${hours}h ${minutes}m`;
        };

        let adultBaseFare = 0;
        let childBaseFare = 0;
        let infantBaseFare = 0;
        let totalBaseFare = 0;
        let totalOtherTaxes = 0;
        let totalNetFare = 0;
        let cancelprice = 0;
        let rescheduleprice = 0;
        if (flightData.PricingInfos) {
            const priceInfo = Array.isArray(flightData.PricingInfos.AirPricingInfo) ? flightData.PricingInfos.AirPricingInfo : [flightData.PricingInfos.AirPricingInfo]
            priceInfo.forEach(pricingInfo => {
                // Extract BasePrice and Taxes
                // return;
                const baseFare = parseFloat(pricingInfo["@attributes"].ApproximateBasePrice.replace("INR", ""));
                // const changePanelty = parseFloat(pricingInfo.CancelPenalty && pricingInfo.CancelPenalty.Amount ? pricingInfo.CancelPenalty.Amount.replace("INR", "") : pricingInfo.CancelPenalty.Percentage);
                // const reschedulePenlty = parseFloat(pricingInfo.ChangePenalty.Amount ? pricingInfo.ChangePenalty.Amount.replace("INR", "") : pricingInfo.ChangePenalty.Percentage);

                const changePanelty = pricingInfo.CancelPenalty
                    ? parseFloat(
                        pricingInfo.CancelPenalty.Amount
                            ? pricingInfo.CancelPenalty.Amount.replace("INR", "")
                            : pricingInfo.CancelPenalty.Percentage || "0"
                    )
                    : 0;

                const reschedulePenlty = pricingInfo.ChangePenalty
                    ? parseFloat(
                        pricingInfo.ChangePenalty.Amount
                            ? pricingInfo.ChangePenalty.Amount.replace("INR", "")
                            : pricingInfo.ChangePenalty.Percentage || "0"
                    )
                    : 0;
                // Calculate Total Net Fare for the PricingInfo
                totalBaseFare = parseFloat(flightData.PricingInfos["@attributes"].ApproximateBasePrice.replace("INR", ""));
                totalOtherTaxes = parseFloat(flightData.PricingInfos["@attributes"].Taxes.replace("INR", ""));
                totalNetFare = parseFloat(flightData.PricingInfos["@attributes"].TotalPrice.replace("INR", ""));
                // cancelprice += parseFloat(pricingInfo.CancelPenalty.Amount.replace("INR", ""));
                // rescheduleprice += parseFloat(pricingInfo.ChangePenalty.Amount.replace("INR", ""));
                const passengerTypes = Array.isArray(pricingInfo.PassengerType)
                    ? pricingInfo.PassengerType
                    : [pricingInfo.PassengerType];

                // Process Passenger Types
                passengerTypes.forEach(passengerType => {
                    if (passengerType["@attributes"].Code === "ADT") {
                        adultBaseFare += baseFare;
                        rescheduleprice += reschedulePenlty;
                        cancelprice += changePanelty;
                    } else if (passengerType["@attributes"].Code === "CNN") {
                        childBaseFare += baseFare;
                        rescheduleprice += reschedulePenlty;
                        cancelprice += changePanelty;
                    } else if (passengerType["@attributes"].Code === "INF") {
                        infantBaseFare += baseFare;
                        rescheduleprice += reschedulePenlty;
                        cancelprice += changePanelty;
                    }
                });
            });
        }

        if (flightData.travelerPricings) {
            flightData.travelerPricings.forEach(travelerPricing => {
                if (travelerPricing.travelerType === 'ADULT') {
                    adultBaseFare += parseFloat(travelerPricing.price.base);
                } else if (travelerPricing.travelerType === 'CHILD') {
                    childBaseFare += parseFloat(travelerPricing.price.base);
                } else if (travelerPricing.travelerType === 'HELD_INFANT') {
                    infantBaseFare += parseFloat(travelerPricing.price.base);
                }
                totalBaseFare += parseFloat(travelerPricing.price.base);
                totalOtherTaxes += (parseFloat(travelerPricing.price.total) - parseFloat(travelerPricing.price.base));
            });
            totalNetFare = parseFloat(flightData.price.grandTotal);
        }

        if (flightData.itineraries) {
            // Response type 1
            const segments = flightData.itineraries[0]?.segments || [];
            if (segments.length === 0) {
                return [];
            }

            return segments.map((segment, index) => {
                const nextSegment = segments[index + 1];
                const layoverDuration = nextSegment
                    ? calculateDuration(segment.arrival.at, nextSegment.departure.at)
                    : null;

                return {
                    departure: {
                        iataCode: segment.departure.iataCode,
                        at: segment.departure.at
                    },
                    arrival: {
                        iataCode: segment.arrival.iataCode,
                        at: segment.arrival.at
                    },
                    carrierCode: segment.carrierCode,
                    number: segment.number,
                    duration: calculateDuration(segment.departure.at, segment.arrival.at),
                    layover: layoverDuration,
                    price: flightData.price.total,
                    adultBaseFare: adultBaseFare,
                    childBaseFare: childBaseFare,
                    infantBaseFare: infantBaseFare,
                    totalBaseFare: totalBaseFare,
                    totalOtherTaxes: totalOtherTaxes,
                    totalNetFare: totalNetFare,
                    apitye: "Amadues"
                };
            });
        } else if (flightData.segments) {
            // Response type 2
            const itineraries = Array.isArray(flightData.segments) ? flightData.segments : [flightData.segments] || [];
            if (itineraries.length === 0) {
                return [];
            }
            return itineraries.map((segment, index) => {
                const nextSegment = itineraries[index + 1];
                const layoverDuration = nextSegment
                    ? calculateTravelTime(segment["@attributes"].ArrivalTime, nextSegment["@attributes"].DepartureTime)
                    : null;
                return {
                    departure: {
                        iataCode: segment["@attributes"].Origin,
                        at: segment["@attributes"].DepartureTime
                    },
                    arrival: {
                        iataCode: segment["@attributes"].Destination,
                        at: segment["@attributes"].ArrivalTime
                    },
                    carrierCode: segment["@attributes"].Carrier,
                    number: segment["@attributes"].FlightNumber,
                    // calculateTravelTime(data.segments[0]["@attributes"].DepartureTime, data.segments[data.segments.length - 1]["@attributes"].ArrivalTime)
                    duration: calculateTravelTime(segment["@attributes"].DepartureTime, segment["@attributes"].ArrivalTime),
                    layover: layoverDuration,
                    price: flightData.PricingInfos["@attributes"].TotalPrice.replace(/[^\d]/g, "") || "N/A",
                    adultBaseFare: adultBaseFare,
                    childBaseFare: childBaseFare,
                    infantBaseFare: infantBaseFare,
                    totalBaseFare: totalBaseFare,
                    totalOtherTaxes: totalOtherTaxes,
                    totalNetFare: totalNetFare,
                    reschedulePrice: rescheduleprice,
                    cancelPrice: cancelprice,
                    apitye: "Galellio"
                };
            });
        }
        return [];
    };

    const departureSegments = parseFlightData(selectedDeparture);
    const returnSegments = parseFlightData(selectedReturn);
    const departureSegments2 = parseFlightData2(selectedDeparture);
    const returnSegments2 = parseFlightData2(selectedReturn);

    const calculateTotalPrice = (segments) => {
        const total = parseFloat(segments?.price);
        return isNaN(total) ? 0 : total;
    };

    const departureTotal = calculateTotalPrice(departureSegments);
    const returnTotal = calculateTotalPrice(returnSegments);
    const grandTotal = departureTotal + returnTotal + (user?.users?.role === 2 ? getServiceFee('D',"roundtrip",user?.users?.agent_type,adult) : 0);; // update 375 to 420 amount
    const [showOffcanvas1, setShowOffcanvas1] = useState(false);
    const [activeTab, setActiveTab] = useState('flightDetails');
    const [currentActivedata, setCurrentActivedata] = useState(null);


    const handleCloseOffcanvas1 = () => setShowOffcanvas1(false);
    const handleShowOffcanvas1 = (data) => {
        setShowOffcanvas1(true)
        // console.log("current data : ",data);
        setCurrentActivedata(data);
    }

    // console.log(currentActivedata);

    function CalActuprice(passengerprice, apityp, passangercount) {

        if (apityp === undefined) {
            return "N/A"
        }
        else if (apityp === 'Galellio') {
            const totalprice = passengerprice;
            return totalprice;
        }
        else if (apityp === 'Amadues') {
            const totalprice = passengerprice;
            return totalprice;
        }
        return "N/A"
    }
    return (
        <>
            <div className='container-fluid bg-dark text-white py-3'>
                <div className="container">
                    <div className="row d-none d-lg-flex">

                        {
                            departureSegments && (
                                <>
                                    <div className='col-lg-4 col-md-6 d-block'>
                                        <div className='fs-6 px-3 text-light my-2'>
                                            Onward Flight - <strong>{getAirlineName(departureSegments && departureSegments?.carrierCode)}</strong>
                                        </div>
                                        <div className=" col-12 d-flex border-right align-items-center justify-content-between mb-3">
                                            <div style={{ marginRight: '10px' }}>
                                                <img src={getImageUrl1(`/flightlogo/${departureSegments.carrierCode}.png`)} alt="" className="img-fluid" style={{ maxWidth: '50px' }} />
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{getAirlineName(departureSegments && departureSegments?.carrierCode)}</span><br />
                                                <span style={{ fontSize: '12px' }}>{departureSegments.carrierCode} - {departureSegments.number}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{departureSegments.departure.at.substring(11, 16)}</div>
                                                <span style={{ fontSize: "13px" }}>{departureSegments.departure.iataCode}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <GoArrowRight size={24} />
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{departureSegments.arrival.at.substring(11, 16)}</div>
                                                <span style={{ fontSize: "13px" }}>{departureSegments.arrival.iataCode}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{currency} { } {parseInt(departureSegments?.price) + (user?.users?.role === 2 ? (getServiceFee('D',"roundtrip",user?.users?.agent_type,adult)/2) : 0)}</div>

                                                <div>
                                                    {/* {
                                                        trip === 'D' ? <>
                                                            {currency}{" "}
                                                            {(() => {
                                                                // Ensure commonPrice is a number by removing 'INR' and trimming spaces
                                                                const cleanCommonPrice = typeof commonPrice === "string"
                                                                    ? parseFloat(commonPrice.replace('INR', '').trim()) || 0
                                                                    : parseFloat(commonPrice) || 0;

                                                                // Ensure departureSegments.price is a number
                                                                const departurePrice = parseFloat(departureSegments.price) || 0;

                                                                // Calculate the total price
                                                                return departurePrice + cleanCommonPrice;
                                                            })()}</> : <>
                                                            {currency} { } {departureSegments.price}
                                                        </>
                                                    } */}

                                                    {/* {currency}{" "}
                                                    {(() => {
                                                        // Ensure commonPrice is a number by removing 'INR' and trimming spaces
                                                        const cleanCommonPrice = typeof commonPrice === "string"
                                                            ? parseFloat(commonPrice.replace('INR', '').trim()) || 0
                                                            : parseFloat(commonPrice) || 0;

                                                        // Ensure departureSegments.price is a number
                                                        const departurePrice = parseFloat(departureSegments.price) || 0;

                                                        // Calculate the total price
                                                        return departurePrice + cleanCommonPrice;
                                                    })()} */}

                                                </div>
                                                {(!user || user?.users?.role !== 2) && (
                                                    <span
                                                        style={{ fontSize: '11px', color: "wheat", cursor: 'pointer' }}
                                                        onClick={() => handleShowOffcanvas1(departureSegments2)}
                                                    >
                                                        Details
                                                    </span>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </>

                            )
                        }
                        {
                            returnSegments && (
                                <>

                                    <div className='col-lg-4 col-md-6 d-block'>
                                        <div className='fs-6 text-light px-3 my-2'>
                                            Return Flight - <strong>{getAirlineName(returnSegments && returnSegments?.carrierCode)}</strong>
                                        </div>
                                        <div className=" col-12 d-flex border-right align-items-center justify-content-between mb-3">
                                            <div style={{ marginRight: '10px' }}>
                                                <img src={getImageUrl1(`/flightlogo/${returnSegments.carrierCode}.png`)} alt="" className="img-fluid" style={{ maxWidth: '50px' }} />
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{getAirlineName(returnSegments && returnSegments?.carrierCode)}</span><br />
                                                <span style={{ fontSize: '12px' }}>{returnSegments.carrierCode} - {returnSegments.number}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{returnSegments.departure.at.substring(11, 16)}</div>
                                                <span style={{ fontSize: "13px" }}>{returnSegments.departure.iataCode}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <GoArrowRight size={24} />
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{returnSegments.arrival.at.substring(11, 16)}</div>
                                                <span style={{ fontSize: "13px" }}>{returnSegments.arrival.iataCode}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center">
                                                <div>{currency} { } {parseInt(returnSegments.price) + (user?.users?.role === 2 ? (getServiceFee('D',"roundtrip",user?.users?.agent_type,adult)/2) : 0)}</div>
                                                <div>
                                                    {/* {
                                                        trip==='D' ? <>
                                                        {(() => {
                                                        // Ensure commonPrice is a number by removing 'INR' and trimming spaces
                                                        const cleanCommonPrice = typeof commonPrice === "string"
                                                            ? parseFloat(commonPrice.replace('INR', '').trim()) || 0
                                                            : parseFloat(commonPrice) || 0;

                                                        // Ensure returnSegments.price is a number
                                                        const returnPrice = parseFloat(returnSegments.price) || 0;

                                                        // Calculate the price difference
                                                        return returnPrice > cleanCommonPrice ? returnPrice - cleanCommonPrice : 0;
                                                    })()}
                                                        </>:<>
                                                        {currency} { } {returnSegments.price}
                                                        </>
                                                    } */}

                                                    {/* {(() => {
                                                        // Ensure commonPrice is a number by removing 'INR' and trimming spaces
                                                        const cleanCommonPrice = typeof commonPrice === "string"
                                                            ? parseFloat(commonPrice.replace('INR', '').trim()) || 0
                                                            : parseFloat(commonPrice) || 0;

                                                        // Ensure returnSegments.price is a number
                                                        const returnPrice = parseFloat(returnSegments.price) || 0;

                                                        // Calculate the price difference
                                                        return returnPrice > cleanCommonPrice ? returnPrice - cleanCommonPrice : 0;
                                                    })()} */}

                                                </div>
                                                {(!user || user?.users?.role !== 2) && (
                                                    <span
                                                    style={{ fontSize: '11px', color: "wheat", cursor: 'pointer' }}
                                                    onClick={() => handleShowOffcanvas1(returnSegments2)}
                                                >
                                                    Details
                                                </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>

                            )
                        }
                        <div className="col-lg-4 col-md-12 d-flex align-items-center justify-content-between">
                            <div style={{ marginRight: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Grand Total</span><br />
                                <span className="text-light" style={{ fontSize: '14px' }}> {currency} { } {parseInt(grandTotal)}</span><br />

                                <span
                                    className={`text-light ${chips ? 'd-flex' : 'd-none'}`}
                                    style={{ fontSize: '14px' }}
                                >
                                    Net Fare :{" "}
                                    {grandTotal && !isNaN(grandTotal) ? (() => {
                                        let netFare = grandTotal;

                                        // Always apply chips first
                                        const chipsDiscount = getChipsByAmount(grandTotal, chips);
                                        if (!isNaN(chipsDiscount) && chipsDiscount > 0) {
                                            netFare -= chipsDiscount;
                                        }
                                        if(user?.users?.agent_type === 'A'){
                                            netFare -= getAdditiondiscount("D")
                                        }
                                        // Apply extra discount only if departure and return carriers match
                                        if (
                                            departureSegments?.carrierCode &&
                                            returnSegments?.carrierCode &&
                                            departureSegments.carrierCode === returnSegments.carrierCode
                                        ) {
                                            // console.log("Carriers match ✅ applying extra discount:", departureSegments.carrierCode, returnSegments.carrierCode, extra_discount);

                                            const extraDiscount = extraDiscountamount(departureSegments.carrierCode, extra_discount || []);
                                            if (!isNaN(extraDiscount) && extraDiscount > 0) {
                                                netFare -= extraDiscount;
                                            }
                                        } else {
                                            // console.log("Carriers don't match ❌ skipping extra discount");
                                        }

                                        // Ensure whole number only
                                        netFare = Math.floor(netFare);

                                        return `${currency} ${netFare.toLocaleString()}`;
                                    })() : "Not Available"}
                                </span>


                            </div>
                            <div>
                                <button onClick={() => handleBookNow(adult, child, infant)} type="button" className="btn btn-warning">Book Now</button>
                            </div>
                        </div>


                    </div>
                    <div className="row d-flex justify-content-between align-items-center d-block d-lg-none">
                        <div className="col-7 ">
                            <div className='d-flex gap-1' style={{ fontSize: "12px" }}>
                                {departureSegments && (<span>{departureSegments.carrierCode} - {currency} { } {departureSegments.price}</span>)} <span>|</span> {returnSegments && (<span>{returnSegments.carrierCode} - {currency} { } {returnSegments.price} </span>)}
                            </div>
                            <div style={{ fontSize: "12px" }} className='mt-1'>
                                <span>Total</span> <span>{currency} { } {grandTotal}</span>
                            </div>
                        </div>
                        <div className="col-5 text-end">
                            <button
                                type="button"
                                className="btn rounded-pill text-white"
                                style={{
                                    backgroundColor: "#e76910",
                                    padding: "10px 20px",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    border: "none",
                                }} onClick={() => handleBookNow(adult, child, infant)}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <Offcanvas
                show={showOffcanvas1}
                onHide={handleCloseOffcanvas1}
                placement="bottom"
                style={{ height: '60vh', maxHeight: '60vh' }}
            >
                <Offcanvas.Header style={{ backgroundColor: '#343a40', color: '#fff' }}>
                    <Offcanvas.Title>Flight Details</Offcanvas.Title>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        aria-label="Close"
                        onClick={handleCloseOffcanvas1}
                        style={{ filter: 'invert(1)' }}
                    />
                </Offcanvas.Header>
                <Offcanvas.Body style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
                    <div className='row'>
                        <div className="col-12 d-flex gap-5">
                            <div
                                onClick={() => setActiveTab('flightDetails')}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px 15px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '5px',
                                    backgroundColor: activeTab === 'flightDetails' ? '#6c757d' : '#e9ecef',
                                    color: activeTab === 'flightDetails' ? 'white' : 'black',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Flight Details
                            </div>
                            <div
                                onClick={() => setActiveTab('fareDetails')}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px 15px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '5px',
                                    backgroundColor: activeTab === 'fareDetails' ? '#6c757d' : '#e9ecef',
                                    color: activeTab === 'fareDetails' ? 'white' : 'black',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Fare Details
                            </div>
                        </div>
                        <div className="row p-4">
                            <div className={`col-12 ${activeTab === 'flightDetails' ? 'd-block' : 'd-none'}`}>
                                <div className="card border mb-3">
                                    <div className="card-header fw-bold">Flight Information</div>
                                    <div className="card-body">

                                        {Array.isArray(currentActivedata) && currentActivedata.length > 0 && (
                                            currentActivedata.map((segment, index) => (
                                                <>
                                                    <div key={index} className="d-flex border-bottom pb-2 mb-3 border-b justify-content-between align-items-center">
                                                        <div>
                                                            <div className='text-muted fw-bold' style={{ fontSize: "16px" }}>
                                                                <strong>{segment.departure.iataCode}</strong> <GoArrowRight size={24} />  <strong>{segment.arrival.iataCode}</strong>
                                                            </div>
                                                            <img src={getImageUrl1(`/flightlogo/${segment.carrierCode}.png`)} alt="" style={{ maxWidth: '50px', marginLeft: '10px' }} />
                                                        </div>
                                                        <div className='text-muted fw-bold' style={{ fontSize: "11px" }}>
                                                            <div className='text-black text-start fw-bold fs-6'>{getAirlineName(segment && segment?.carrierCode)}</div>
                                                            <div>{segment.carrierCode} - {segment.number}</div>
                                                        </div>
                                                        <div className='text-muted fw-bold' style={{ fontSize: "11px" }}>
                                                            <div>{segment.departure.at.substring(11, 16)}</div>
                                                            <div>{new Date(segment.departure.at).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                            <div>{getAirportDataByCountry(segment.departure.iataCode, "city")} <strong>({segment.departure.iataCode})</strong></div>
                                                        </div>
                                                        <div className='text-muted fw-bold' style={{ fontSize: "11px" }}>
                                                            <div className='fs-4'><TfiAlarmClock /></div>
                                                            <div>Duration: <strong>{segment.duration}</strong></div> {/* Update with actual duration if available */}
                                                        </div>
                                                        <div className='text-muted fw-bold' style={{ fontSize: "11px" }}>
                                                            <div>{segment.arrival.at.substring(11, 16)}</div>
                                                            <div>{new Date(segment.arrival.at).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                            <div>{getAirportDataByCountry(segment.arrival.iataCode, "city")} <strong>({segment.arrival.iataCode})</strong></div>
                                                        </div>

                                                    </div>
                                                    {
                                                        segment?.layover && (
                                                            <div className='w-full p-2 mb-3 rounded-circle text-primary fw-bold bg-danger-subtle' >Layover  {segment.layover}</div>
                                                        )
                                                    }
                                                </>

                                            ))
                                        )}


                                    </div>
                                </div>
                            </div>

                            <div className={`col-12 ${activeTab === 'fareDetails' ? 'd-block' : 'd-none'}`}>
                                <div className="card border mb-3">
                                    <div className="card-header">Fare Details</div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>Fare Rules</div>
                                            {/* <div style={{ border: '1px solid #198754', borderRadius: '20px', padding: '5px', fontSize: '14px' }} className='py-2 text-success fw-medium px-3'>Refundable</div> */}
                                        </div>
                                        <div style={{ border: '1px solid #dee2e6', borderRadius: '5px', padding: '10px' }}>
                                            {
                                                adult && (
                                                    <div className='d-flex justify-content-between border-bottom py-2'>
                                                        <div>{adult} x Adult</div>
                                                        <strong>{currency} { } {CalActuprice(currentActivedata && currentActivedata[0] && currentActivedata[0]?.adultBaseFare, currentActivedata && currentActivedata[0] && currentActivedata[0]?.apitye, adult)} </strong>
                                                    </div>

                                                )
                                            }
                                            {
                                                child > 0 && (
                                                    <div className='d-flex justify-content-between border-bottom py-2'>
                                                        <div>{child} x Child</div>
                                                        <strong>{currency} { } {CalActuprice(currentActivedata && currentActivedata[0] && currentActivedata[0]?.childBaseFare, currentActivedata && currentActivedata[0] && currentActivedata[0]?.apitye, child)} </strong>

                                                    </div>
                                                )
                                            }
                                            {
                                                infant > 0 && (
                                                    <div className='d-flex justify-content-between border-bottom py-2'>
                                                        <div>{infant} x Infant</div>
                                                        <strong>{currency} { }  {CalActuprice(currentActivedata && currentActivedata[0] && currentActivedata[0]?.infantBaseFare, currentActivedata && currentActivedata[0] && currentActivedata[0]?.apitye, infant)} </strong>
                                                    </div>
                                                )
                                            }
                                            <div className='d-flex justify-content-between border-bottom py-2'>
                                                <div className='fw-bold text-black' >Total (Base Fare)</div>
                                                <strong>{currency} { } {currentActivedata && currentActivedata[0] && currentActivedata[0]?.totalBaseFare}</strong>
                                            </div>
                                            <div className='d-flex justify-content-between border-bottom py-2'>
                                                <div className='fw-bold text-black' >Total (Fee & Surcharge) +</div>
                                                <strong>{currency} { } {currentActivedata && currentActivedata[0] && currentActivedata[0]?.totalOtherTaxes}</strong>
                                            </div>
                                            <div className='d-flex justify-content-between border-bottom py-2'>
                                                <div className='fw-bold text-black' >Grand Total</div>
                                                <strong>{currency} { } {currentActivedata && currentActivedata[0] && currentActivedata[0]?.totalNetFare}</strong>
                                            </div>

                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6">
                                                <div className="card border mb-3">
                                                    <div className="card-header">Cancellation Penalty Fees</div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-6" style={{ borderRight: '1px solid #dee2e6' }}>
                                                                <div className='border-bottom py-2'>Before 96 hours Departure</div>
                                                                {/* Repeat as needed */}
                                                            </div>
                                                            <div className="col-6">
                                                                <strong className='border-bottom py-2'>{currency} { } {currentActivedata && currentActivedata[0] && currentActivedata[0]?.cancelPrice}</strong>

                                                                {/* Repeat as needed */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="card border mb-3">
                                                    <div className="card-header">Reschedule Penalty Fees</div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-6" style={{ borderRight: '1px solid #dee2e6' }}>
                                                                <div className='border-bottom py-2'>Before 96 hours Departure</div>
                                                                {/* Repeat as needed */}
                                                            </div>
                                                            <div className="col-6">
                                                                <strong className='border-bottom py-2'>{currency} { } {currentActivedata && currentActivedata[0] && currentActivedata[0]?.reschedulePrice}</strong>
                                                                {/* Repeat as needed */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ul className='text-muted' style={{ fontSize: "11px" }}>
                                    <h3 style={{ fontSize: "15px" }}>Terms & Conditions</h3>
                                    <li>Total Rescheduling Charges Airlines Rescheduling fees Fare Difference if applicable + WT Fees.</li>
                                    <li>The airline cancel reschedule fees is indicative and can be changed without any prior notice by the airlines...</li>
                                    <li>WT does not guarantee the accuracy of cancel reschedule fees..</li>
                                    <li>Partial cancellation is not allowed on the flight tickets which are book under special round trip discounted fares.</li>
                                    <li>Airlines doesnt allow any additional baggage allowance for any infant added in the booking.</li>
                                    <li>In certain situations of restricted cases, no amendments and cancellation is allowed.</li>
                                    <li>Airlines cancel reschedule should be reconfirmed before requesting for a cancellation or amendment.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default BottomNavbar;
