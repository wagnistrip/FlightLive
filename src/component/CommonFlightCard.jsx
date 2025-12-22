import React, { useState } from 'react'
import FlightFeeDetails from './FlightFeeDetails';
import OfferSection from './OfferSection';
import { IoMdArrowDropdown } from 'react-icons/io';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { calculateTravelTime, extraDiscountamount, getAdditiondiscount, getAirlineName, getAirportDataByCountry, getBookingCount, getChipsByAmount, getImageUrl1, getServiceFee, matchSpecialFlight } from '../utils/airlineUtils';
import { useSelector } from 'react-redux';

const CommonFlightCard = ({ index, data, responseData, bookFlightGAL, isOpen, toggleFlightDetails, bookNowSpecialflight }) => {
    const user = useSelector((state) => state.auth.user);
    // console.log("user => ", user);
    const samed = "Ak"
    return (
        <div className='list-unstyled'>


            <div style={{ borderRadius: '4px', position: 'relative' }} data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-offset="0" className="py-1 tour_details_boxed mt-3">
            
            {/* {
                (user && user?.users?.role === 2) && (
               <>
                <div className="watermark" style={{ top: '40%', left: '10%' }}>Wagnistrip</div>
                <div className="watermark" style={{ top: '40%', right: '35%' }}>Wagnistrip</div>
                <div className="watermark" style={{ top: '40%', right: '65%' }}>Wagnistrip</div>
                <div className="watermark" style={{ top: '40%', right: '10%' }}>Wagnistrip</div>
               </>

                )
            } */}

                <div style={{ marginBottom: 0 }} className='row flight-row-cardlist border-2  overflow-hidden p-0'>
                    {
                        samed !== 'Ak' ? (
                            <div style={{ fontSize: '10px', background: 'linear-gradient(to right, #d2ffc2, #ffffff)', color: '#0e0e0e' }} className='d-sm-flex px-2 fw-semibold align-items-center justify-items-start gap-1 w-25 p-1 mb-2 fw-medium'>
                                <img style={{ width: '13px', height: '16px' }} src={LuggageIcon} alt="" />Enjoy Free Meals
                            </div>
                        ) : (
                            <div className='w-full pt-3'></div>
                        )
                    }

                    <div className='row'>
                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='row'>
                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                    <div className='left-flightdetail-content'>
                                        <ul className='list-unstyled'>

                                            <li>
                                                <img
                                                    src={getImageUrl1(`/flightlogo/${data.segments[0]["@attributes"].Carrier}.png`)}
                                                    className='img-fluid-flight'
                                                    alt="Airline Logo"
                                                    onError={(e) => (e.target.src = '/flight/default.png')}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='col-lg-8 col-md-8 col-sm-8'>
                                    <div className='right-flightdetail-content float-right'>
                                        <ul className='list-unstyled'>
                                            <li>
                                                <h6 className='fw-bold'>
                                                    {getAirlineName(data.segments[0]["@attributes"].Carrier)}
                                                </h6>
                                                <div>
                                                    {data.segments[0]["@attributes"].Carrier}{" - "} {data.segments[0]["@attributes"].FlightNumber}
                                                </div>

                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>





                        </div>
                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='text-center '>

                                <ul className='list-unstyled'>
                                    <li>
                                        <h5 className="fw-bold fs-5">
                                            {data?.segments?.[0]?.["@attributes"]?.DepartureTime
                                                ? data.segments[0]["@attributes"].DepartureTime.substring(11, 16) // Extracts HH:mm directly
                                                : "N/A"}
                                        </h5>
                                        {/* <h5 className='fw-bold fs-5'>{format(new Date(data.segments[0]["@attributes"].DepartureTime), 'HH:mm')}</h5> */}
                                        <p style={{ fontSize: '14px' }} className='fw-normal'>{getAirportDataByCountry(data?.segments[0]['@attributes']?.Origin, 'city')} </p>
                                    </li>
                                </ul>



                            </div>
                        </div>
                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='time-duration-flight text-center'>

                                <div className='text-center '>
                                    <ul className='list-unstyled'>
                                        <li>
                                            <h6 className='duration-arrow pb-2'>{
                                                data.segments && data.segments.length > 0
                                                    ? calculateTravelTime(data.segments[0]["@attributes"].DepartureTime, data.segments[data.segments.length - 1]["@attributes"].ArrivalTime)
                                                    : 'N/A'
                                            }</h6>
                                            <span style={{ fontSize: '13px' }} className='text-center text-secondary fw-normal'>
                                                {data.segments && data.segments.length === 1
                                                    ? 'NonStop'
                                                    : data.segments.length === 2
                                                        ? '1-Stop'
                                                        : `${data.segments.length - 1}-Stops`}
                                            </span>
                                        </li>
                                    </ul>

                                </div>

                            </div>
                        </div>
                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='text-center '>
                                <ul className='list-unstyled'>

                                    {data.segments && data.segments.length > 0 && (
                                        <li>
                                            <h5 className='fw-bold fs-5'>
                                                {data.segments[data.segments.length - 1]["@attributes"].ArrivalTime
                                                    ? data.segments[data.segments.length - 1]["@attributes"].ArrivalTime.substring(11, 16)
                                                    : "N/A"}

                                            </h5>
                                            <p style={{ fontSize: '14px' }} className='fw-normal'>
                                                {getAirportDataByCountry(data?.segments[data?.segments.length - 1]['@attributes']?.Destination, 'city')}
                                            </p>
                                        </li>
                                    )}
                                </ul>



                            </div>

                            <div>

                            </div>
                        </div>
                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='text-center '>
                                <ul className=' list-unstyled'>
                                    <li>
                                        {data?.PricingInfos && (
                                            (() => {
                                                // galileo.AirPricePointList.AirPricePoint[0].AirPricingInfo.PassengerType
                                                const priceInfo = Array.isArray(data?.PricingInfos.AirPricingInfo) ? [data?.PricingInfos.AirPricingInfo[0]] : [data?.PricingInfos.AirPricingInfo]
                                                // Convert PassengerType to an array if it's an object
                                                const passengerTypes = Array.isArray(priceInfo[0].PassengerType)
                                                    ? priceInfo[0].PassengerType
                                                    : [priceInfo[0].PassengerType];
                                                // Get unique passenger type values
                                                const uniquePassengerTypes = [...new Set(passengerTypes.map(pt => pt["@attributes"]?.Code))];

                                                // Mapping passenger type codes to labels
                                                const passengerLabels = {
                                                    STU: "Student",
                                                    SRC: "Senior Citizen"
                                                };

                                                // Get the label if a known type exists
                                                const passengerLabel = uniquePassengerTypes
                                                    .map(type => passengerLabels[type])
                                                    .filter(Boolean) // Remove undefined values
                                                    .join(", "); // Join if multiple passenger types exist

                                                return passengerLabel ? (
                                                    <div className="btntest border-primary rounded-pill">{passengerLabel}</div>
                                                ) : null;
                                            })()
                                        )}

                                        {/* <h6 className='fw-bold fs-6 text-danger'>
                                                                                                {responseData && responseData.currency && responseData.currency.currency_symbol}{' '} {data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice && data.PricingInfos["@attributes"]?.ApproximateTotalPrice?.replace('INR', '').trim()} {user && user?.users?.role === 2 ? 500:0}
                                                                                            </h6> */}

                                        <h6 className='fw-bold fs-6 text-danger'>

                                            {(!user || user?.users?.role === 1) && (responseData && responseData?.coupons && responseData?.coupons?.discount_amount > 0) ? <strike className="text-secondary fw-normal" >{responseData?.currency?.currency_symbol} {data?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice.replace('INR', '').trim()}</strike> : user?.users?.role === 2 && <strong style={{ borderRight: '1px solid black', paddingRight: '3px' }} className="text-secondary d-none mr-1">{responseData?.currency?.currency_symbol} {data?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice.replace('INR', '').trim()}</strong>}
                                            <span>{ }  {responseData?.currency?.currency_symbol} {data?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice &&
                                                (() => {
                                                    let price = parseFloat(
                                                        data.PricingInfos["@attributes"].ApproximateTotalPrice.replace('INR', '').trim()
                                                    );
                                                    if (user?.users?.role === 2) {
                                                        price += getServiceFee(responseData?.trip, user?.users?.agent_type);
                                                    } else if (user?.users.role === 1) {
                                                        price -= responseData && responseData?.coupons && responseData?.coupons?.discount_amount || 0
                                                    } else {
                                                        price -= responseData && responseData?.coupons && responseData?.coupons?.discount_amount || 0
                                                    }
                                                    return price;
                                                })()}</span>


                                        </h6>
                                        {
                                            user?.users?.role === 2 && (
                                                <h6 className='fw-semibold'>Net Fare :  <span>
                                                    {(() => {
                                                        // Step 1: Get base price safely
                                                        const rawPrice = data?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice || "0";
                                                        let price = parseFloat(rawPrice.replace("INR", "").trim()) || 0;

                                                        // 🟩 Step 2: Add service fee (using utility function)
                                                        const serviceFee = getServiceFee(responseData?.trip, user?.users?.agent_type);
                                                        price += serviceFee;

                                                        let netFare = price;

                                                        // Step 3: Apply green chips
                                                        const greenChips = getChipsByAmount(price, responseData?.chips);
                                                        if (!isNaN(greenChips) && greenChips > 0 && user?.users?.agent_type === 'B') {
                                                            netFare -= greenChips;

                                                        }
                                                        if (user?.users?.agent_type === 'A') {
                                                            netFare -= getAdditiondiscount(responseData?.trip);
                                                        }

                                                        // Step 4: Apply extra discount
                                                        const carrierCode = data?.segments?.[0]?.["@attributes"]?.Carrier || "";
                                                        const extraDiscount = extraDiscountamount(carrierCode, responseData?.extra_discount || []);
                                                        if (!isNaN(extraDiscount) && extraDiscount > 0 && user?.users?.agent_type === 'B') {
                                                            netFare -= extraDiscount;
                                                        }

                                                        // Step 5: Return final result
                                                        return netFare > 0 ? `₹${netFare.toLocaleString()}` : "Not Available";
                                                    })()}

                                                </span></h6>

                                            )
                                        }



                                        {/* <button onClick={() => dispatch(setBookingStatus(true))} type="button" className="btn btntest border border-info text-info rounded-pill"> + More Fare</button> */}
                                    </li>

                                </ul>

                            </div>
                        </div>

                        <div className='col-lg-2 col-md-4 col-sm-6'>
                            <div className='text-center shetleft'>

                                <button type='button' onClick={() => bookFlightGAL(data, responseData?.travellers, data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice, responseData?.trip, responseData?.flightFare, responseData.hostToken, responseData?.tripType)} className="button">
                                    Book Now
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                                        <path
                                            clipRule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                                            fillRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>


                                <h6 className='fw-bold text-primary'>

                                    <span style={{ fontSize: '11px' }} className='text-danger'>
                                        <i className='fa fa-wheelchair flight-chair-icon'></i>
                                        {getBookingCount(
                                            Array.isArray(data?.PricingInfos?.AirPricingInfo)
                                                ? data?.PricingInfos?.AirPricingInfo[0]
                                                : data?.PricingInfos?.AirPricingInfo,
                                            data?.segments
                                        )} Seats Left
                                    </span>
                                </h6>

                            </div>
                        </div>
                    </div>

                    {/* add here special fare deals  */}

                    {(() => {
                        const matchedSpecial = matchSpecialFlight(data.segments, responseData?.specialFare);

                        return (
                            user &&
                            user?.users.role === 2 &&
                            matchedSpecial && (
                                <div className="d-flex col-12 bg-light-subtle justify-content-between align-items-center">
                                    <div className="col-6"></div>
                                    <div className="d-flex col-6 align-items-center justify-content-around gap-lg-3">
                                        <div style={{ fontSize: '13px' }}>
                                            <FiberManualRecordIcon fontSize="14px" className="text-danger" /> Special Fare
                                        </div>
                                        <div className="text-center">
                                            <div>
                                                <strike>
                                                    ₹ {Math.round(
                                                        matchedSpecial.total_payable_price +
                                                        (matchedSpecial?.ticket_id ? (matchedSpecial.total_payable_price * 0.05) : 0) +
                                                        ((responseData?.trip === 'D' ? 600 : 1000) * (responseData?.travellers?.adults + responseData?.travellers?.children))
                                                    ).toLocaleString("en-IN")}

                                                </strike>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold fs-6 text-danger">
                                                    <span> ₹ {Math.round(matchedSpecial.total_payable_price + (matchedSpecial?.ticket_id ? (matchedSpecial.total_payable_price * 0.05) : 0)
                                                    ).toLocaleString("en-IN")} </span>

                                                </h6>
                                            </div>
                                        </div>
                                        <div className="text-center pe-3">
                                            <button
                                                onClick={() =>
                                                    bookNowSpecialflight(
                                                        matchedSpecial,
                                                        responseData?.travellers,
                                                    )
                                                }
                                                className="button"
                                            >
                                                Book Now

                                            </button>
                                            <h6 className="fw-bold text-primary">
                                                <span style={{ fontSize: '11px' }} className="text-danger">
                                                    <i className="fa fa-wheelchair flight-chair-icon"></i>
                                                    {matchedSpecial && matchedSpecial?.ticket_id ? matchedSpecial?.pax : matchedSpecial?.legs ? matchedSpecial.available_seats : matchedSpecial?.onward_connecting ? matchedSpecial.available_seats : 0 || 0} Seats Left
                                                </span>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        );
                    })()}

                    {/* add here special flight discount coupon show  */}

                    {
                        responseData && responseData?.coupons && (

                            (!user || user?.users.role === 1) ? (
                                <div
                                    style={{ fontSize: '12px', width: 'fit-content', background: '#e0ffe3' }}
                                    className='my-3 d-flex align-items-center justify-content-center gap-2 mx-auto py-1 text-black text-center'
                                >
                                    <FiberManualRecordIcon fontSize='14px' className='text-danger' /> FLAT ₹ {responseData && responseData?.coupons && responseData?.coupons?.discount_amount} OFF using <strong>{responseData && responseData?.coupons && responseData?.coupons?.code}</strong> UPTO 10% OFF
                                </div>
                            ) : null
                        )

                    }



                    <div onClick={() => toggleFlightDetails(index)} style={{ background: '#8b3eea17', cursor: "pointer", }} className='px-2 pt-2 w-100 justify-content-between d-flex rounded-sm align-align-items-center'>

                        <div
                            style={{

                                fontSize: "12px",
                                color: "#000",
                                width: "fit-content",
                                fontWeight: 400,
                            }}
                            className="text-start"
                        >
                            Flight Detail
                        </div>

                        <div> <IoMdArrowDropdown /></div>

                    </div>
                    <FlightFeeDetails formData={data} travellers={responseData.travellers} buttonsOpen={isOpen} discoutAmt={responseData && responseData?.coupons} trip={responseData && responseData?.trip} />
                </div>

            </div>


            {index == 1 &&

                <div className=' border-2 overflow-hidden p-0'>
                    <OfferSection />
                </div>


            }

        </div>
    )
}

export default CommonFlightCard