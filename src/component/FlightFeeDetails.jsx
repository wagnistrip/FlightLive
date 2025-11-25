import React, { useState, useEffect } from 'react'
import './FlightFeeDetails.css'
import { Collapse } from "@mui/material";
import { calculateTravelTime, convertMinutesToHoursMinutes, getAirlineName, getAirportDataByCountry, getImageUrl1, getServiceFee } from '../utils/airlineUtils';
import { useSelector } from 'react-redux';
function FlightFeeDetails({ formData, travellers, buttonsOpen, discoutAmt, trip = "D" }) {
    const user = useSelector((state) => state.auth.user);
    const flightDetailsArray = Array.isArray(formData?.flights?.flightDetails)
        ? formData?.flights?.flightDetails
        : [formData?.flights?.flightDetails];

    // console.log("dkkdkld => ",formData);

    const [tabopen, setTabopen] = useState("details");
    const [noOfAdults, setNoOfAdults] = useState();
    const [noOfChildrens, setNoOfChildren] = useState();
    const [noOfInfants, setNoOfInfants] = useState();

    useEffect(() => {
        if (travellers) {
            setNoOfAdults(travellers?.adults);
            setNoOfChildren(travellers?.children);
            setNoOfInfants(travellers?.infants);
        }
    }, [travellers])

    const combineFlightData = (formData, trip) => {
        // console.log('formdata for baggage =>',formData);
        if (!formData?.airFareInfolist || !formData?.segments) return [];

        let combinedData = [];

        formData?.airFareInfolist.forEach((fare, index) => {
            const flightSegments = formData?.segments[index]; // Get corresponding flight segment

            if (Array.isArray(flightSegments)) {
                // If there are multiple segments (roundtrip), iterate through them
                flightSegments.forEach((flight) => {
                    combinedData.push(getFlightDetails(fare, flight, trip));
                });
            } else {
                // If it's a one-way flight (single segment), process normally
                combinedData.push(getFlightDetails(fare, flightSegments, trip));
            }
        });

        return combinedData;
    };

    // Function to extract baggage details & airline info
    const getFlightDetails = (fare, flight, trip) => {
        if (!flight || !fare) return {};

        const baggageAllowance = fare?.BaggageAllowance;
        let baggagevalue = null, baggagesymbol = null;

        if (baggageAllowance) {
            if (baggageAllowance?.MaxWeight?.["@attributes"]?.Value) {
                baggagevalue = baggageAllowance?.MaxWeight["@attributes"]?.Value;
                baggagesymbol = baggageAllowance?.MaxWeight["@attributes"]?.Unit;
            } else if (baggageAllowance?.NumberOfPieces) {
                baggagevalue = baggageAllowance?.NumberOfPieces;
                baggagesymbol = "Pieces";
            }
        } else {
            baggagevalue = trip === 'D' ? "15" : "30";
            baggagesymbol = "KG";
        }

        return {
            airlinecode: flight["@attributes"].Carrier,
            airlineno: flight["@attributes"].FlightNumber,
            baggagevalue,
            baggagesymbol
        };
    };

    let cancelprice = 0;
    let rescheduleprice = 0;
    if (formData.PricingInfos) {
        const priceInfo = Array.isArray(formData.PricingInfos.AirPricingInfo)
            ? formData.PricingInfos.AirPricingInfo
            : [formData.PricingInfos.AirPricingInfo];

        let hasPercentageChange = false;
        let hasPercentageCancel = false;
        let totalChangePrice = 0;
        let totalCancelPrice = 0;

        priceInfo?.forEach((pricingInfo) => {
            // Safely access CancelPenalty and ChangePenalty
            const cancelPenalty = pricingInfo.CancelPenalty || {};
            const changePenalty = pricingInfo.ChangePenalty || {};

            // Extract penalties safely
            let changePenaltyAmount = 0;
            let cancelPenaltyAmount = 0;

            if (changePenalty.Amount) {
                changePenaltyAmount = parseFloat(changePenalty?.Amount?.replace("INR", ""));
            } else if (changePenalty.Percentage) {
                hasPercentageChange = true; // Flag to indicate percentage exists
            }

            if (cancelPenalty.Amount) {
                cancelPenaltyAmount = parseFloat(cancelPenalty?.Amount?.replace("INR", ""));
            } else if (cancelPenalty.Percentage) {
                hasPercentageCancel = true; // Flag to indicate percentage exists
            }

            const passengerTypes = Array.isArray(pricingInfo?.PassengerType)
                ? pricingInfo.PassengerType
                : [pricingInfo.PassengerType];

            // Process Passenger Types
            passengerTypes.forEach((passengerType) => {
                const passengerCode = passengerType?.["@attributes"]?.Code;

                if (passengerCode === "ADT" || passengerCode === "STU" || passengerCode === "SRC" ||
                    passengerCode === "CNN" || passengerCode === "INF") {

                    if (!hasPercentageChange) totalChangePrice += changePenaltyAmount;
                    if (!hasPercentageCancel) totalCancelPrice += cancelPenaltyAmount;
                }
            });
        });

        // Final output
        rescheduleprice = hasPercentageChange ? "100%" : totalChangePrice;
        cancelprice = hasPercentageCancel ? "100%" : totalCancelPrice;
    }

    const [flightInfo, setFlightInfo] = useState([]);
    // return;

    useEffect(() => {
        // setFlightInfo(combinedData);
        if (formData) {
            setFlightInfo({ onward: combineFlightData(formData, trip) });
        }
    }, [formData]);

    //   **************amadeus-baggage-data****************

    const [matchingData, setMatchingData] = useState([]);

    useEffect(() => {
        const baggageKeyData = formData?.baggageKey;
        const serviceFeesGrpData = formData?.serviceFeesGrp;
        const serviceCoverageInfoGrpData = serviceFeesGrpData?.[0]?.serviceCoverageInfoGrp;
        const bagageData = serviceFeesGrpData?.[0]?.freeBagAllowanceGrp;

        const refNumberData = Array.isArray(baggageKeyData)
            ? baggageKeyData[1]?.refNumber
            : null;

        // Collect all matching baggage details and flight info
        let result = Array.isArray(serviceCoverageInfoGrpData)
            ? serviceCoverageInfoGrpData.flatMap((item) => {
                const itemNumber = item.itemNumberInfo?.itemNumber?.number;
                // console.log("check number",item);
                if (refNumberData === itemNumber) {
                    // console.log(bagageData,itemNumber);
                    // const matchingBaggage = bagageData?.find(
                    //     (baggage) =>
                    //         baggage.itemNumberInfo?.itemNumberDetails?.number === itemNumber
                    // );
                    // Directly access the baggage data as an object
                    const matchingBaggage =
                        bagageData.itemNumberInfo?.itemNumberDetails?.number === itemNumber
                            ? bagageData
                            : null;
                    // const matchingBaggage = null;

                    // console.log(matchingBaggage);

                    if (matchingBaggage) {
                        // Map over all flights to get their info
                        return flightDetailsArray.map((flight) => ({
                            baggageDetails: matchingBaggage.freeBagAllownceInfo,
                            companyId: flight.flightInformation?.companyId,
                            flightOrtrainNumber: flight.flightInformation?.flightOrtrainNumber,
                        }));
                    }
                }
                return []; // Return an empty array if no matches
            })
            : [];

        // Update state with the result
        setMatchingData(result);
    }, [formData]); // Added dependencies for useEffect



    return (
        <>
            <div className='container flight-fee-conatiner text-primary'>
                <Collapse in={buttonsOpen} timeout="auto" unmountOnExit>
                    <>
                        <div className='row buttons-group my-2 '>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                                <div className='flight-fee-detail '>
                                    <button onClick={() => setTabopen("details")} className={`btn FlightInformation ${tabopen === 'details' ? 'bg-info text-white' : 'bg-light text-black'} fw-bold`} type='button' >Flight Information</button>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                                <div className='flight-fee-detail'>
                                    <button onClick={() => setTabopen("faredetails")} className={`btn FareDetailsRules ${tabopen === 'faredetails' ? 'bg-info text-white' : 'bg-light text-black'} fw-bold`} type='button' >Fare Details & Rules</button>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                                <div className='flight-fee-detail'>
                                    <button onClick={() => setTabopen("baggage")} className={`btn BaggageInformation ${tabopen === 'baggage' ? 'bg-info text-white' : 'bg-light text-black'} fw-bold`} type='button' >Baggage Information</button>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                                <div className='flight-fee-detail'>
                                    <button onClick={() => setTabopen("cancellation")} className={`btn CancellationChangeRule ${tabopen === 'cancellation' ? 'bg-info text-white' : 'bg-light text-black'} fw-bold`} type='button' >Cancellation & Change Rule</button>
                                </div>
                            </div>
                        </div>


                        {
                            tabopen === 'details' && (
                                <div className='flightDetailopen'>
                                    <div>


                                        {
                                            formData && (formData.PricingInfos && formData.returnSegments) && (
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                    margin: '20px 0 20px 0'
                                                }}>
                                                    Onward Flight
                                                    <span style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        bottom: -6,
                                                        left: 0,
                                                        width: '40px',
                                                        height: '4px',

                                                        backgroundColor: '#223fcf', // Adjust color as needed
                                                    }}></span>
                                                </h4>
                                            )
                                        }

                                        {formData && (formData?.PricingInfos && formData.segments) && (
                                            formData.segments.length > 0 && formData.segments.map((segment, index) => (
                                                <div key={index} className='FlightInformation mb-4'>


                                                    <div className='d-flex flex-column w-100'>
                                                        <div className='col-md-12 col-sm-12'>
                                                            <div className='iata-code w-100'>
                                                                <ul className='list-unstyled'>
                                                                    {/* <li className='fw-bold align-items-center d-flex'>{segment["@attributes"]?.Origin} → {segment["@attributes"]?.Destination}  {segment && segment?.CodeshareInfo ? <span style={{ fontSize: '10px', fontWeight: 400 }} className='ml-2'> Operated By :  -  </span> : ''}</li> */}
                                                                    <li className='fw-bold align-items-center d-flex'>{segment["@attributes"]?.Origin} → {segment["@attributes"]?.Destination}</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='d-flex flex-row pt-3'>
                                                        <div className='col-md-3 col-sm-6 mb-3'>
                                                            <ul className='list-unstyled text-center'>
                                                                <li>
                                                                    <img
                                                                        src={getImageUrl1(`/flightlogo/${segment["@attributes"].Carrier}.png`)}
                                                                        onError={(e) => (e.target.src = '/flight/default.png')}
                                                                        className='img-fluid-flight'
                                                                        alt=""
                                                                    />
                                                                </li>
                                                                <li>
                                                                    <h5 className='text-secondary airlinenumber'>{segment["@attributes"].Carrier} - {segment["@attributes"].FlightNumber}</h5>
                                                                    <span style={{ fontSize: '12px' }} className='text-danger classes-name'>
                                                                        ({formData && formData.cabinService ? formData?.cabinService[index] : segment?.BookingInfo.CabinClass})
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className='col-md-3 col-sm-6 mb-3 terminal'>
                                                            <ul className='list-unstyled text-center'>
                                                                <li>
                                                                    <h5 className='fw-bold terminal'>{segment["@attributes"]?.DepartureTime.substring(11, 16)}</h5>
                                                                    <h6 className='fw-bold text-secondary terminal'>{getAirportDataByCountry(segment["@attributes"]?.Origin, 'city')} ({segment["@attributes"]?.Origin})</h6>
                                                                    <h6 className='text-secondary terminal'>{segment["@attributes"]?.DepartureTime?.slice(0, 10).split('-').reverse().join('/')}</h6>
                                                                    <h6 className='text-secondary ternimal-number'>Terminal - {segment?.flightDetails && segment?.flightDetails["@attributes"].OriginTerminal}</h6>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className='col-md-3 col-sm-6 mb-3 clock'>
                                                            <ul className='list-unstyled text-center'>
                                                                <li>
                                                                    <i className='fa fa-clock-o clock-icon'></i>
                                                                    <h6 className='p-2 fw-bold text-secondary terminal'>
                                                                        {convertMinutesToHoursMinutes(segment["@attributes"]?.FlightTime)}
                                                                    </h6>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className='col-md-3 col-sm-6 mb-3 terminal'>
                                                            <ul className='list-unstyled text-center'>
                                                                <li>
                                                                    <h5 className='fw-bold terminal'>{segment["@attributes"]?.ArrivalTime.substring(11, 16)}</h5>
                                                                    <h6 className='fw-bold text-secondary terminal'>{getAirportDataByCountry(segment["@attributes"]?.Destination, 'city')} ({segment["@attributes"]?.Destination})</h6>
                                                                    <h6 className='text-secondary terminal'>{segment["@attributes"]?.ArrivalTime?.slice(0, 10).split('-').reverse().join('/')}</h6>
                                                                    <h6 className='text-secondary ternimal-number'>Terminal - {segment?.flightDetails && segment?.flightDetails["@attributes"].DestinationTerminal}</h6>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>


                                                    {index < formData?.segments.length - 1 && (
                                                        <div className='d-flex flex-row pt-3 pb-3'>
                                                            <div className='col-md-12 col-sm-12 text-center'>
                                                                <div className='layover p-3'>
                                                                    <span className='fw-bold text-dark'>LAYOVER: </span>
                                                                    <span className='fw-bold text-danger'>
                                                                        {
                                                                            calculateTravelTime(segment["@attributes"]?.ArrivalTime, formData.segments[index + 1]["@attributes"]?.DepartureTime)
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}

                                        {
                                            formData && (formData.PricingInfos && formData.returnSegments) && (
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                    marginBottom: '20px'
                                                }}>
                                                    Return Flight
                                                    <span style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        bottom: -6,
                                                        left: 0,
                                                        width: '40px',
                                                        height: '4px',

                                                        backgroundColor: '#223fcf', // Adjust color as needed
                                                    }}></span>
                                                </h4>
                                            )
                                        }


                                        {
                                            formData && (formData.PricingInfos && formData.returnSegments) && (
                                                formData.returnSegments.length > 0 && formData.returnSegments.map((segment, index) => (
                                                    <div key={index} className='FlightInformation mb-4'>
                                                        <div className='d-flex flex-column w-100'>
                                                            <div className='col-md-12 col-sm-12'>
                                                                <div className='iata-code w-100'>
                                                                    <ul className='list-unstyled'>
                                                                        <li className='fw-bold align-items-center d-flex'>{segment["@attributes"]?.Origin} → {segment["@attributes"]?.Destination}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='d-flex flex-row pt-3'>
                                                            <div className='col-md-3 col-sm-6 mb-3'>
                                                                <ul className='list-unstyled text-center'>
                                                                    <li>
                                                                        <img
                                                                            src={getImageUrl1(`/flightlogo/${segment["@attributes"].Carrier}.png`)}
                                                                            onError={(e) => (e.target.src = '/flight/default.png')}
                                                                            className='img-fluid-flight'
                                                                            alt=""
                                                                        />
                                                                    </li>
                                                                    <li>
                                                                        <h5 className='text-secondary airlinenumber'>{segment["@attributes"].Carrier} - {segment["@attributes"].FlightNumber}</h5>
                                                                        <span style={{ fontSize: '12px' }} className='text-danger classes-name'>
                                                                            ({formData && formData.cabinService ? formData?.cabinService[index] : segment?.BookingInfo.CabinClass})
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className='col-md-3 col-sm-6 mb-3 terminal'>
                                                                <ul className='list-unstyled text-center'>
                                                                    <li>
                                                                        <h5 className='fw-bold terminal'>{segment["@attributes"]?.DepartureTime.substring(11, 16)}</h5>
                                                                        <h6 className='fw-bold text-secondary terminal'>{getAirportDataByCountry(segment["@attributes"]?.Origin, 'city')} ({segment["@attributes"]?.Origin})</h6>
                                                                        <h6 className='text-secondary terminal'>{segment["@attributes"]?.DepartureTime?.slice(0, 10).split('-').reverse().join('/')}</h6>
                                                                        <h6 className='text-secondary ternimal-number'>Terminal - {segment?.flightDetails && segment?.flightDetails["@attributes"].OriginTerminal}</h6>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className='col-md-3 col-sm-6 mb-3 clock'>
                                                                <ul className='list-unstyled text-center'>
                                                                    <li>
                                                                        <i className='fa fa-clock-o clock-icon'></i>
                                                                        <h6 className='p-2 fw-bold text-secondary terminal'>
                                                                            {convertMinutesToHoursMinutes(segment["@attributes"]?.FlightTime)}
                                                                        </h6>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className='col-md-3 col-sm-6 mb-3 terminal'>
                                                                <ul className='list-unstyled text-center'>
                                                                    <li>
                                                                        <h5 className='fw-bold terminal'>{segment["@attributes"]?.ArrivalTime.substring(11, 16)}</h5>
                                                                        <h6 className='fw-bold text-secondary terminal'>{getAirportDataByCountry(segment["@attributes"]?.Destination, 'city')} ({segment["@attributes"]?.Destination})</h6>
                                                                        <h6 className='text-secondary terminal'>{segment["@attributes"]?.ArrivalTime?.slice(0, 10).split('-').reverse().join('/')}</h6>
                                                                        <h6 className='text-secondary ternimal-number'>Terminal - {segment?.flightDetails && segment?.flightDetails["@attributes"].DestinationTerminal}</h6>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>


                                                        {index < formData?.returnSegments.length - 1 && (
                                                            <div className='d-flex flex-row pt-3 pb-3'>
                                                                <div className='col-md-12 col-sm-12 text-center'>
                                                                    <div className='layover p-3'>
                                                                        <span className='fw-bold text-dark'>LAYOVER: </span>
                                                                        <span className='fw-bold text-danger'>
                                                                            {
                                                                                calculateTravelTime(segment["@attributes"]?.ArrivalTime, formData.returnSegments[index + 1]["@attributes"]?.DepartureTime)
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )
                                        }

                                        {/* Amadues flight card show  */}
                                    </div>
                                </div>
                            )
                        }


                        {tabopen === 'faredetails' && (
                            <div className='container'>
                                <div className='row'>
                                    <div className='FareDetails&Rules'>
                                        {/* this condititon for galileo flight */}
                                        {
                                            formData && formData?.PricingInfos && (
                                                <div className="row">

                                                    <div className='col-12 mb-3'>
                                                        <div className='card'>
                                                            <table className="table table-hover table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Fare Rules :</th>
                                                                        <th scope="col">
                                                                            {formData && (
                                                                                Array.isArray(formData?.PricingInfos?.AirPricingInfo)
                                                                                    ? formData?.PricingInfos?.AirPricingInfo[0]["@attributes"].Refundable === 'true' ? (
                                                                                        <button type='button' className='btn btn-success text-light ml-3'>
                                                                                            Refundable
                                                                                        </button>
                                                                                    ) : <button type='button' className={`btn ${formData?.segments[0]["@attributes"].Carrier === '6E' ? 'btn-success' : 'btn-danger'} text-light ml-3`}>
                                                                                        {formData?.segments[0]["@attributes"].Carrier === '6E' ? 'Refundable' : 'Non Refundable'}
                                                                                    </button>
                                                                                    : formData?.PricingInfos?.AirPricingInfo["@attributes"].Refundable === 'true' ? (
                                                                                        <button type='button' className='btn btn-success text-light ml-3'>
                                                                                            Refundable
                                                                                        </button>
                                                                                    ) : <button type='button' className={`btn ${formData?.segments[0]["@attributes"].Carrier === '6E' ? 'btn-success' : 'btn-danger'} text-light ml-3`}>
                                                                                        {formData?.segments[0]["@attributes"].Carrier === '6E' ? 'Refundable' : 'Non Refundable'}
                                                                                    </button>
                                                                            )}
                                                                        </th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>


                                                                    {formData?.PricingInfos && (
                                                                        (Array.isArray(formData?.PricingInfos?.AirPricingInfo)
                                                                            ? formData?.PricingInfos?.AirPricingInfo
                                                                            : [formData?.PricingInfos?.AirPricingInfo] // Convert object to array
                                                                        ).map((frs, i) => (
                                                                            <React.Fragment key={i}>
                                                                                {/* Handle Adults */}
                                                                                {(Array.isArray(frs?.PassengerType)
                                                                                    ? frs.PassengerType.some(pt => ["ADT", "SRC", "STU"].includes(pt["@attributes"]?.Code))
                                                                                    : ["ADT", "SRC", "STU"].includes(frs.PassengerType["@attributes"]?.Code)) && (

                                                                                        <tr className='d-none'>
                                                                                            <td className='font-weight-bold'>
                                                                                                {noOfAdults} x Adult
                                                                                            </td>
                                                                                            <td>
                                                                                                {`INR ${(parseFloat(frs["@attributes"]?.ApproximateBasePrice.replace(/[^0-9.-]+/g, "")) * noOfAdults)}`}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}

                                                                                {/* Handle Children */}
                                                                                {(Array.isArray(frs?.PassengerType)
                                                                                    ? frs?.PassengerType?.filter(pt => pt?.["@attributes"]?.Code === "CNN").length > 0
                                                                                    : frs?.PassengerType?.["@attributes"]?.Code === "CNN") && noOfChildrens > 0 && (
                                                                                        <tr className='d-none'>
                                                                                            <td className='font-weight-bold'>
                                                                                                {noOfChildrens} x Child
                                                                                            </td>
                                                                                            <td>
                                                                                                {`INR ${(parseFloat(frs["@attributes"]?.ApproximateBasePrice.replace(/[^0-9.-]+/g, "")) * noOfChildrens).toFixed(2)}`}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}

                                                                                {/* Handle Infants */}
                                                                                {(Array.isArray(frs?.PassengerType)
                                                                                    ? frs?.PassengerType?.filter(pt => pt?.["@attributes"]?.Code === "INF").length > 0
                                                                                    : frs?.PassengerType?.["@attributes"]?.Code === "INF") && noOfInfants > 0 && (
                                                                                        <tr className='d-none'>
                                                                                            <td className='font-weight-bold'>
                                                                                                {noOfInfants} x Infant
                                                                                            </td>
                                                                                            <td>
                                                                                                {`INR ${(parseFloat(frs["@attributes"]?.ApproximateBasePrice.replace(/[^0-9.-]+/g, "")) * noOfInfants).toFixed(2)}`}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                            </React.Fragment>
                                                                        ))
                                                                        // : (
                                                                        //     // Handle the case where `airAirPricingInfo` is a single object
                                                                        //     <React.Fragment key={formData?.PricingInfos?.AirPricingInfo["@attributes"]?.Key}>
                                                                        //         {/* Handle Adults */}
                                                                        //         {(Array.isArray(formData?.PricingInfos?.AirPricingInfo?.PassengerType)
                                                                        //             ? formData?.PricingInfos?.AirPricingInfo?.PassengerType?.filter(pt => pt?.["@attributes"]?.Code === "ADT").length > 0
                                                                        //             : formData?.PricingInfos?.AirPricingInfo?.PassengerType?.["@attributes"]?.Code === "ADT") && noOfAdults > 0 && (
                                                                        //                 <tr>
                                                                        //                     <td className='font-weight-bold'>
                                                                        //                         {noOfAdults} x Adult
                                                                        //                     </td>
                                                                        //                     <td>
                                                                        //                         {`INR ${(parseFloat(formData?.PricingInfos?.AirPricingInfo["@attributes"]?.BasePrice.replace(/[^0-9.-]+/g, "")) * noOfAdults).toFixed(2)}`}
                                                                        //                     </td>
                                                                        //                 </tr>
                                                                        //             )}

                                                                        //         {/* Handle Children */}
                                                                        //         {(Array.isArray(formData?.PricingInfos?.AirPricingInfo?.PassengerType)
                                                                        //             ? formData?.PricingInfos?.AirPricingInfo?.PassengerType?.filter(pt => pt?.["@attributes"]?.Code === "CNN").length > 0
                                                                        //             : formData?.PricingInfos?.AirPricingInfo?.PassengerType?.["@attributes"]?.Code === "CNN") && noOfChildrens > 0 && (
                                                                        //                 <tr>
                                                                        //                     <td className='font-weight-bold'>
                                                                        //                         {noOfChildrens} x Child
                                                                        //                     </td>
                                                                        //                     <td>
                                                                        //                         {`INR ${(parseFloat(formData?.PricingInfos?.AirPricingInfo["@attributes"]?.BasePrice.replace(/[^0-9.-]+/g, "")) * noOfChildrens).toFixed(2)}`}
                                                                        //                     </td>
                                                                        //                 </tr>
                                                                        //             )}

                                                                        //         {/* Handle Infants */}
                                                                        //         {(Array.isArray(formData?.PricingInfos?.AirPricingInfo?.PassengerType)
                                                                        //             ? formData?.PricingInfos?.AirPricingInfo?.PassengerType?.filter(pt => pt?.["@attributes"]?.Code === "INF").length > 0
                                                                        //             : formData?.PricingInfos?.AirPricingInfo?.PassengerType?.["@attributes"]?.Code === "INF") && noOfInfants > 0 && (
                                                                        //                 <tr>
                                                                        //                     <td className='font-weight-bold'>
                                                                        //                         {noOfInfants} x Infant
                                                                        //                     </td>
                                                                        //                     <td>
                                                                        //                         {`INR ${(parseFloat(formData?.PricingInfos?.AirPricingInfo["@attributes"]?.BasePrice.replace(/[^0-9.-]+/g, "")) * noOfInfants).toFixed(2)}`}
                                                                        //                     </td>
                                                                        //                 </tr>
                                                                        //             )}
                                                                        //     </React.Fragment>
                                                                        // )
                                                                    )}

                                                                    <tr>
                                                                        <td className='font-weight-bold'>Total (Base Fare)</td>
                                                                        <td>
                                                                            INR {
                                                                                formData?.PricingInfos
                                                                                    ? (
                                                                                        parseFloat(
                                                                                            formData?.PricingInfos["@attributes"]?.ApproximateBasePrice.replace(/[^0-9.-]+/g, "")
                                                                                        ) +
                                                                                        (user?.users?.role === 2
                                                                                             ? (getServiceFee(trip, user?.users?.agent_type) * 3) / 4 
                                                                                            : 0)
                                                                                    ).toLocaleString()
                                                                                    : '0'
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='font-weight-bold'>Total Tax</td>
                                                                        <td>
                                                                            INR {
                                                                                formData?.PricingInfos
                                                                                    ? (
                                                                                        parseFloat(
                                                                                            formData?.PricingInfos["@attributes"]?.ApproximateTaxes.replace(/[^0-9.-]+/g, "")
                                                                                        ) +
                                                                                        (user?.users?.role === 2
                                                                                            ? getServiceFee(trip, user?.users?.agent_type) / 4 
                                                                                            : 0)
                                                                                    ).toLocaleString()
                                                                                    : '0'
                                                                            }
                                                                        </td>
                                                                            {/* INR {formData && formData?.PricingInfos && parseFloat(formData?.PricingInfos["@attributes"]?.ApproximateTaxes.replace(/[^0-9.-]+/g, ""))} */}
                                                                    </tr>
                                                                    {
                                                                        user && user?.users && user?.users?.role === 2 && (
                                                                            <tr className='d-none'>
                                                                                <td className='font-weight-bold'>WT INSTANT DISCOUNT</td>
                                                                                <td>


                                                                                    INR 500
                                                                                </td>
                                                                            </tr>

                                                                        )
                                                                    }

                                                                    {
                                                                        (!user || user && user?.users && user?.users?.role === 1) && (discoutAmt && discoutAmt?.discount_amount > 0) && (
                                                                            <tr>
                                                                                <td className='font-weight-bold'>{discoutAmt && discoutAmt?.code}</td>
                                                                                <td>


                                                                                    INR {discoutAmt && discoutAmt?.discount_amount}
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    <tr>
                                                                        <td className='font-weight-bold'>Total (Fare)</td>
                                                                        <td>
                                                                            INR{' '}
                                                                            {formData?.PricingInfos?.["@attributes"]?.TotalPrice &&
                                                                                (() => {
                                                                                    let price = parseFloat(formData.PricingInfos["@attributes"].TotalPrice.replace(/[^0-9.-]+/g, ""));

                                                                                    if (isNaN(price)) return "Invalid Price";

                                                                                    // Apply ₹500 discount only for user role 2
                                                                                    if (user && user.users && user.users.role === 2) {
                                                                                        const extra = getServiceFee(trip,user?.users?.agent_type);
                                                                                        return (price + extra).toLocaleString();
                                                                                    }
                                                                                    else if (!user || user && user.users && user.users.role === 1) {
                                                                                        return price - (discoutAmt && discoutAmt?.discount_amount || 0)
                                                                                    }

                                                                                    return price;
                                                                                })()}
                                                                        </td>

                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }


                                    </div>


                                </div>
                            </div>
                        )}

                        {
                            tabopen === 'baggage' && (
                                <div className='container'>
                                    <div className='row'>
                                        <div className='BaggageInformation'>
                                            <table className="table table-hover table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Airline</th>
                                                        <th scope="col">Check-in Baggage</th>
                                                        <th scope="col">Cabin Baggage</th>
                                                    </tr>
                                                </thead>
                                                {
                                                    formData && (formData.PricingInfos && formData.returnSegments) && (
                                                        <h4 className='ml-3' style={{
                                                            fontSize: '18px',
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                            margin: '20px 0 20px 0'
                                                        }}>
                                                            Onward Flight
                                                            <span style={{
                                                                content: '',
                                                                position: 'absolute',
                                                                bottom: -6,
                                                                left: 0,
                                                                width: '40px',
                                                                height: '4px',

                                                                backgroundColor: '#223fcf', // Adjust color as needed
                                                            }}></span>
                                                        </h4>
                                                    )
                                                }
                                                <tbody>

                                                    {/* this condititon for galileo flight */}
                                                    {
                                                        (formData?.PricingInfos && flightInfo) && flightInfo?.onward.length > 0 && flightInfo?.onward.map((ir, index) => (
                                                            <tr key={index}>


                                                                <td>
                                                                    <div className='d-flex align-items-start justify-content-between'>
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <img
                                                                                src={getImageUrl1(`/flightlogo/${ir.airlinecode}.png`)}
                                                                                onError={(e) => (e.target.src = '/flight/default.png')}
                                                                                style={{ width: '32px', height: '32px', marginLeft: '20px', marginBottom: '8px' }}
                                                                                alt="logo"
                                                                            />
                                                                            <div className='ms-2'>
                                                                                <h6>{getAirlineName(ir?.airlinecode)}</h6>
                                                                                <small>{ir?.airlinecode} - {ir?.airlineno}</small>
                                                                            </div>
                                                                        </div>
                                                                        <span style={{ background: '#eae8e8', fontSize: '10px' }} className="rounded-pill fw-semibold bg-primary text-white py-1 px-2">
                                                                            Retail Fare
                                                                        </span>
                                                                    </div>
                                                                </td>


                                                                <td>
                                                                    {ir?.baggagevalue} {ir?.baggagesymbol}
                                                                </td>
                                                                {/* <td>7 {ir?.baggagesymbol}</td> */}
                                                                <td style={{ fontSize: '12px' }} className='fw-bold text-primary text-uppercase'>7 Kg</td>
                                                            </tr>
                                                        ))
                                                    }


                                                    {
                                                        matchingData && matchingData.length > 0 && matchingData.map((data, index) => (

                                                            <tr key={index}>

                                                                <td>
                                                                    <div className='d-flex align-items-start justify-content-between'>
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <img src={getImageUrl1(`/flightlogo/${data?.companyId.marketingCarrier}.png`)} style={{ width: '32px', height: '32px', marginLeft: '20px', marginBottom: '8px' }}
                                                                                alt="logo"
                                                                                onError={(e) => (e.target.src = '/flight/default.png')}
                                                                            />
                                                                            <div className='ms-2'>
                                                                                <h6>{data?.companyId.marketingCarrier}</h6>
                                                                                <small>{data?.flightOrtrainNumber}</small>
                                                                            </div>
                                                                        </div>
                                                                        <span style={{ border: '1px solid green', fontSize: '10px', color: 'green' }} className="rounded-pill fw-semibold px-2 py-1 bg-white">
                                                                            Retail Fare
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {data?.baggageDetails.baggageDetails.freeAllowance} {data && data?.baggageDetails.baggageDetails.quantityCode === 'W' ? 'KG' : 'Piece'}
                                                                </td>
                                                                <td>7KG</td>
                                                            </tr>
                                                        ))
                                                    }



                                                    {/* this condition for amadeus  */}

                                                    {/* </tr> */}

                                                    <tr>
                                                        <td colSpan={3}>
                                                            <ul>
                                                                <li>Baggage information mentioned above is obtained from airline's reservation system, Wagnistrip does not guarantee the accuracy of this information.</li>
                                                                <li>The baggage allowance may vary according to stop-overs, connecting flights. changes in airline rules. etc.</li>
                                                            </ul>

                                                        </td>

                                                    </tr>

                                                </tbody>

                                                {
                                                    formData && (formData.PricingInfos && formData.returnSegments) && (
                                                        <h4 className='ml-3' style={{
                                                            fontSize: '18px',
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                            margin: '20px 0 20px 0'
                                                        }}>
                                                            Return Flight
                                                            <span style={{
                                                                content: '',
                                                                position: 'absolute',
                                                                bottom: -6,
                                                                left: 0,
                                                                width: '40px',
                                                                height: '4px',

                                                                backgroundColor: '#223fcf', // Adjust color as needed
                                                            }}></span>
                                                        </h4>
                                                    )
                                                }
                                                <tbody>

                                                    {
                                                        formData?.PricingInfos &&
                                                        formData.returnSegments &&
                                                        formData.returnSegments.length > 0 &&
                                                        formData.returnSegments.map((ir, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-start justify-content-between">
                                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                            <img
                                                                                src={getImageUrl1(`/flightlogo/${ir["@attributes"].Carrier}.png`)}
                                                                                onError={(e) => (e.target.src = "/flight/default.png")}
                                                                                style={{ width: "32px", height: "32px", marginLeft: "20px", marginBottom: "8px" }}
                                                                                alt="logo"
                                                                            />
                                                                            <div className="ms-2">
                                                                                <h6>{getAirlineName(ir["@attributes"].Carrier)}</h6>
                                                                                <small>{ir["@attributes"]?.Carrier} - {ir["@attributes"].FlightNumber}</small>
                                                                            </div>
                                                                        </div>
                                                                        <span
                                                                            style={{ background: "#eae8e8", fontSize: "10px" }}
                                                                            className="rounded-pill fw-semibold bg-primary text-white py-1 px-2"
                                                                        >
                                                                            Retail Fare
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {ir?.FareInfo?.BaggageAllowance
                                                                        ? ir?.FareInfo?.BaggageAllowance?.MaxWeight?.["@attributes"]?.Value
                                                                            ? `${ir.FareInfo.BaggageAllowance.MaxWeight["@attributes"].Value} ${ir.FareInfo.BaggageAllowance.MaxWeight["@attributes"].Unit}`
                                                                            : ir?.FareInfo?.BaggageAllowance?.NumberOfPieces
                                                                                ? `${ir.FareInfo.BaggageAllowance.NumberOfPieces} Pc`
                                                                                : "Baggage Not Available"
                                                                        : "Baggage Not Available"}
                                                                </td>
                                                                <td style={{ fontSize: "12px" }} className="fw-bold text-primary text-uppercase">
                                                                    7 Kg
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }


                                                    {
                                                        formData && (formData.PricingInfos && formData.returnSegments) && (
                                                            <tr>
                                                                <td colSpan={3}>
                                                                    <ul>
                                                                        <li>Baggage information mentioned above is obtained from airline's reservation system, Wagnistrip does not guarantee the accuracy of this information.</li>
                                                                        <li>The baggage allowance may vary according to stop-overs, connecting flights. changes in airline rules. etc.</li>
                                                                    </ul>

                                                                </td>

                                                            </tr>
                                                        )
                                                    }

                                                </tbody>


                                            </table>
                                        </div>
                                    </div>

                                </div>
                            )
                        }
                        {
                            tabopen === 'cancellation' && (
                                <div className='container'>
                                    <div className='row'>
                                        <div className='Cancellation&ChangeRule'>
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr><td>
                                                        <div className='fw-bold fs-6 P-0'>Time Frame to Cancel </div><div className='P-0'>(Before scheduled departure time)</div>
                                                    </td>
                                                        <td>
                                                            <div className='fw-bold fs-6 P-0'>Airline Fees </div><div className='p-0'>per passenger</div>
                                                        </td>
                                                        <td>
                                                            <div className='fw-bold fs-6 p-0'>WT Fees </div><div className='p-0'>per passenger</div>
                                                        </td>
                                                    </tr>



                                                    {
                                                        formData?.PricingInfos && (cancelprice === 0) ? (

                                                            <>
                                                                {trip === "D" &&
                                                                    <tr>
                                                                        <td>Cancel Before 24 hours of departure time.</td>
                                                                        <td>
                                                                            {/* {formData?.PricingInfos
                                                                ? (cancelprice === 0
                                                                    ? 'As per Airline + WT fee + fare difference'
                                                                    : `INR ${cancelprice}`)
                                                                : ''} */}

                                                                            {/* {trip === "D" ? 4999 : null} */}
                                                                            4999
                                                                        </td>
                                                                        <td>INR 300</td>
                                                                    </tr>
                                                                }
                                                                {trip === "I" &&
                                                                    <tr>
                                                                        <td>Cancel Before 0-3 (days) before the departure time.</td>
                                                                        <td>
                                                                            {/* {formData?.PricingInfos
                                                                ? (cancelprice === 0
                                                                    ? 'As per Airline + WT fee + fare difference'
                                                                    : `INR ${cancelprice}`)
                                                                : ''} */}

                                                                            {/* {trip === "D" ? 4999 : null} */}
                                                                            upto 6500 or base fare + fuel cost (whichever is lower among  them) the cancellation fee will depend on the time of cancellation.
                                                                        </td>
                                                                        <td>INR 300</td>
                                                                    </tr>
                                                                }

                                                                {/* ********************* */}
                                                                {/* {trip === "I" && <p className='text-danger'>domestic</p>} */}
                                                                {trip === "D" &&
                                                                    <>
                                                                        <tr>
                                                                            <td>Cancel between (24-72) hours of departure time</td>
                                                                            <td>

                                                                                3999
                                                                            </td>
                                                                            <td>INR 300</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Cancel before 72 hours and beyond </td>
                                                                            <td>
                                                                                3999
                                                                            </td>
                                                                            <td>INR 300</td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                                {trip === "I" &&
                                                                    <>
                                                                        <tr>
                                                                            <td>Cancel between (4-24) hours before the departure time.</td>
                                                                            <td>

                                                                                upto 10000 or base fare + fuel cost (whichever is lower among  them) the cancellation fee will depend on the time of cancellation.
                                                                            </td>
                                                                            <td>INR 300</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>Cancel between (4-72) hours  before the  departure time.</td>
                                                                            <td>
                                                                                upto 8024 or base fare + fuel cost (whichever is lower among  them) the cancellation fee will depend on the time of cancellation.
                                                                            </td>
                                                                            <td>INR 300</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>Cancel between (4-24) hours before the departure time. </td>
                                                                            <td>
                                                                                upto 10000 or base fare + fuel cost (whichever is lower among  them) the cancellation fee will depend on the time of cancellation.
                                                                            </td>
                                                                            <td>INR 300</td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                <tr>
                                                                    <td>Cancel Before 24 hours of departure time.</td>
                                                                    <td>
                                                                        {formData?.PricingInfos
                                                                            ? (cancelprice === 0
                                                                                ? 'As per Airline + WT fee + fare difference'
                                                                                : `INR ${cancelprice}`)
                                                                            : ''}
                                                                    </td>
                                                                    <td>INR 300</td>
                                                                </tr></>
                                                        )

                                                    }



                                                    {/* ************************ */}
                                                    <tr><td>
                                                        <div className='fw-bold fs-6'>Time Frame to Reissue </div><div>(Before scheduled departure time)</div>
                                                    </td>
                                                        <td>
                                                            <div className='fw-bold fs-6 P-0'>Airline Fees </div><div className='P-0'>per passenger</div>
                                                        </td>
                                                        <td>
                                                            <div className='fw-bold fs-6'>WT Fees </div><div>per passenger</div>
                                                        </td>
                                                    </tr>

                                                    {
                                                        formData?.PricingInfos && (rescheduleprice === 0) ? (
                                                            <>
                                                                {trip === "D" &&
                                                                    <>
                                                                        <tr>
                                                                            <td>Reschedule between (3-72) hours of departure Time</td>
                                                                            <td>
                                                                                2999 + fare difference
                                                                            </td>

                                                                            <td>INR 300</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Reschedule before  72 hours  and beyond  departure Time</td>
                                                                            <td>
                                                                                2999 + fare difference
                                                                            </td>

                                                                            <td>INR 300</td>
                                                                        </tr>
                                                                    </>
                                                                }

                                                            </>
                                                        ) : (
                                                            <tr>
                                                                <td>Reschedule before 28 hours of departure time.</td>
                                                                <td>
                                                                    {formData?.PricingInfos
                                                                        ? (rescheduleprice === 0
                                                                            ? 'As per Airline + WT fee + fare difference'
                                                                            : `INR ${rescheduleprice}`)
                                                                        : 'Never Change'}
                                                                </td>

                                                                <td>INR 300</td>
                                                            </tr>
                                                        )
                                                    }

                                                    <tr>
                                                        <td colSpan={3}>
                                                            <ul>
                                                                <li>Total Rescheduling Charges Airlines Rescheduling fees Fare Difference if applicable + WT Fees.</li>
                                                                <li>The airline cancel reschedule fees is indicative and can be changed without any prior notice by the airlines...</li>
                                                                <li>WT does not guarantee the accuracy of cancel reschedule fees..</li>
                                                                <li>Partial cancellation is not allowed on the flight tickets which are book under special round trip discounted fares.</li>
                                                                <li>Airlines doesnt allow any additional baggage allowance for any infant added in the booking.</li>
                                                                <li>In certain situations of restricted cases, no amendments and cancellation is allowed.</li>
                                                                <li>Airlines cancel reschedule should be reconfirmed before requesting for a cancellation or amendment.</li>
                                                            </ul>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            )
                        }


                    </>
                </Collapse>


            </div >
        </>
    )
}

export default FlightFeeDetails;