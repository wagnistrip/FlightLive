import React from 'react'
import './FlightFeeDetails.css'
import { convertDate, formatTimeAma, getAirlineName, getAirportDataByCountry, getImageUrl1 } from '../utils/airlineUtils';

function FLightreviewdetails({ formData, bookingClass, flight_type, statusRefund }) {
    let galedata = [];
    let refundStatus = "";
    // console.log("dlkdkldlkl => ", formData?.AirSegment);

    if (formData) {
        if (flight_type === 'GDS-ONWARD' && formData?.AirSegment) {
            galedata = formData?.AirSegment;
            refundStatus = Array.isArray(statusRefund?.AirPricingInfo)
                ? statusRefund?.AirPricingInfo[0]?.["@attributes"]?.Refundable === "true"
                    ? "REFUNDABLE"
                    : "NON-REFUNDABLE"
                : statusRefund?.AirPricingInfo?.["@attributes"]?.Refundable === "true"
                    ? "REFUNDABLE"
                    : "NON-REFUNDABLE"
        } else if (flight_type === 'GDS-RETURN' && formData?.returnSegment) {
            galedata = formData.returnSegment;
            refundStatus = Array.isArray(statusRefund?.AirPricingInfo)
                ? statusRefund?.AirPricingInfo[0]?.["@attributes"]?.Refundable === "true"
                    ? "REFUNDABLE"
                    : "NON-REFUNDABLE"
                : statusRefund?.AirPricingInfo?.["@attributes"]?.Refundable === "true"
                    ? "REFUNDABLE"
                    : "NON-REFUNDABLE"
        }
    }

    const flightDetails = Array.isArray(galedata) ? galedata : [galedata];

    let flightData;
    if (formData && formData?.segmentInformation) {
        flightData = Array.isArray(formData.segmentInformation) ? formData?.segmentInformation : [formData?.segmentInformation];

    }

    // Define formatDate function
    const formatDate = (timestamp) => {
        if (!timestamp) return "";

        // take only the date part (YYYY-MM-DD) to avoid timezone shifts
        const datePart = String(timestamp).slice(0, 10); // "2025-10-08"
        const [yearStr, monthStr, dayStr] = datePart.split("-");

        const year = Number(yearStr);
        const month = Number(monthStr); // 1..12
        const dayOfMonth = Number(dayStr); // 1..31

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // create a UTC date so it won't be shifted by local timezone
        const weekdayIndex = new Date(Date.UTC(year, month - 1, dayOfMonth)).getUTCDay();
        const weekday = days[weekdayIndex];
        const monthName = months[month - 1];

        return `${weekday} - ${dayOfMonth} ${monthName} ${year}`;
    };



    return (
        <>
            <div className='container mt-3 p-lg-2  p-0 '>

                <div className='flightDetailopen  '>

                    {
                        (flightData && formData?.segmentInformation) && flightData.map((data, index) => (
                            <div key={index} >

                                <div style={{ textAlign: 'start' }} className='row col-lg-12'>
                                    <div className='col-12 d-flex d-lg-block align-items-center justify-content-between col-md-3'>
                                        <div className="d-flex align-items-start justify-content-start mb-3">

                                            <img src={getImageUrl1(`/flightlogo/${data?.flightDetails.companyDetails.marketingCompany}.png`)} className="me-2" style={{ width: '32px', height: '32px' }}
                                                onError={(e) => (e.target.src = '/flight/default.png')}
                                                alt="logo" />
                                            <div className='d-inline-block'>
                                                <h6 className="mb-0 fw-semibold">{getAirlineName(data?.flightDetails.companyDetails.marketingCompany)}</h6>
                                                <small style={{ fontSize: '12px' }} className='text-muted'>{data.flightDetails.companyDetails.marketingCompany} - {data?.flightDetails.flightIdentification.flightNumber}</small>
                                                <h6 style={{ fontSize: '12px' }} className='text-muted'>ECONOMY</h6>
                                            </div>
                                        </div>
                                        <span style={{ background: '#eae8e8', fontSize: '12px' }} className="rounded-pill fw-semibold p-2 px-3 text-black ms-auto">Retail Fare</span>
                                    </div>
                                    <div className="d-flex justify-content-between col-lg-9 mb-3">
                                        <div style={{ fontSize: '14px' }} className='text-muted'>
                                            <h6 className='fs-4 fw-semibold text-black'>{formatTimeAma(data?.flightDetails?.flightDate?.departureTime)}</h6>
                                            <small className='text-black fw-medium'>{getAirportDataByCountry(data.flightDetails.boardPointDetails.trueLocationId, 'city')} ({data.flightDetails.boardPointDetails.trueLocationId})</small><br />
                                            <small>{formatDate(convertDate(data.flightDetails.flightDate.departureDate))}</small><br />
                                            <small>Terminal - {data?.apdSegment && data?.apdSegment.departureStationInfo && data?.apdSegment.departureStationInfo.terminal}</small>

                                        </div>
                                        <div className="text-center">
                                            <small className='fw-semibold fs-6'>
                                                {(() => {
                                                    const departureDate = convertDate(data?.flightDetails?.flightDate?.departureDate || "211124");
                                                    const arrivalDate = convertDate(data?.flightDetails?.flightDate?.arrivalDate || "211124");

                                                    const departureTime = formatTimeAma(data?.flightDetails?.flightDate?.departureTime || "1445");
                                                    const arrivalTime = formatTimeAma(data?.flightDetails?.flightDate?.arrivalTime || "1700");

                                                    const departureDateTime = new Date(`${departureDate.toISOString().split('T')[0]}T${departureTime}`);
                                                    const arrivalDateTime = new Date(`${arrivalDate.toISOString().split('T')[0]}T${arrivalTime}`);

                                                    const durationMilliseconds = arrivalDateTime - departureDateTime;

                                                    // Calculate hours and minutes
                                                    const totalHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
                                                    const totalMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                                                    return `${totalHours}h ${totalMinutes}m`;
                                                })()}
                                            </small>
                                            <div style={{ borderBottom: '2px dotted #e0e0e0', position: 'relative' }} className='my-3'>
                                                <div style={{ width: '30px', height: '30px', position: 'absolute', top: '-14px' }} className='border ml-4 d-flex align-items-center justify-content-center rounded-circle'>
                                                    <i className='fas text-muted fa-plane-departure'></i>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <span style={{ border: '1px solid green', fontSize: '10px', color: 'green' }} className="rounded-pill fw-semibold px-2 py-1 bg-white">REFUNDABLE</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px' }} className='text-muted'>
                                            <h6 className='fs-4 fw-semibold text-black'>  {formatTimeAma(data?.flightDetails?.flightDate?.arrivalTime)}</h6>
                                            <small className='text-black fw-medium'>{getAirportDataByCountry(data.flightDetails.offpointDetails.trueLocationId, 'city')} ({data.flightDetails.offpointDetails.trueLocationId})</small><br />
                                            <small>{formatDate(convertDate(data.flightDetails.flightDate.arrivalDate))}</small><br />
                                            <small>Terminal - {data?.apdSegment && data?.apdSegment.arrivalStationInfo && data?.apdSegment.arrivalStationInfo.terminal}</small>

                                        </div>
                                    </div>


                                    {/* layover components i want to implement here layover  */}
                                    {index < flightData.length - 1 && (
                                        <div className="row mb-4 col-lg-12">
                                            <div className='col-lg-3'></div>
                                            <div style={{ borderBottom: '2px solid #e0e0e0' }} className='col-lg-9 text-center'>
                                                <button style={{ background: '#e0e0e0', marginBottom: '-20px', fontSize: '12px', cursor: 'auto' }} className='btn fw-medium rounded-pill'>
                                                    <span className='fw-bold'>
                                                        {(() => {
                                                            const currentArrivalTime = new Date(`${convertDate(flightData[index].flightDetails.flightDate.arrivalDate).toISOString().split('T')[0]}T${formatTimeAma(flightData[index].flightDetails.flightDate.arrivalTime)}`);
                                                            const nextDepartureTime = new Date(`${convertDate(flightData[index + 1].flightDetails.flightDate.departureDate).toISOString().split('T')[0]}T${formatTimeAma(flightData[index + 1].flightDetails.flightDate.departureTime)}`);

                                                            const layoverMilliseconds = nextDepartureTime - currentArrivalTime;
                                                            const layoverHours = Math.floor(layoverMilliseconds / (1000 * 60 * 60));
                                                            const layoverMinutes = Math.floor((layoverMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                                                            return `${layoverHours}h ${layoverMinutes}m`;
                                                        })()}
                                                    </span> Layover in <span className='fw-bold'> {getAirportDataByCountry(flightData[index].flightDetails.offpointDetails.trueLocationId, 'city')} ({flightData[index].flightDetails.offpointDetails.trueLocationId})</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                        ))
                    }
                    {
                        (formData?.AirSegment && flightDetails) && flightDetails.map((data, index) => (
                            <div key={index} style={{ textAlign: 'start' }} className=' row   p-0 p-lg-2'>
                                <div className='col-12 d-flex d-lg-block align-items-center justify-content-between col-md-3  '>
                                    <div className="d-flex align-items-start justify-content-start mb-3">
                                        <img src={getImageUrl1(`/flightlogo/${data?.["@attributes"].Carrier}.png`)} className="me-2" style={{ width: '32px', height: '32px' }}
                                            onError={(e) => (e.target.src = '/flight/default.png')}
                                            alt="logo" />
                                        <div className='d-inline-block'>
                                            <h6 className="mb-0 fw-semibold">{getAirlineName(data?.["@attributes"]?.Carrier)}</h6>
                                            <small style={{ fontSize: '12px' }} className='text-muted'>{data?.["@attributes"]?.Carrier} - {data?.["@attributes"]?.FlightNumber}</small>
                                            <h6 style={{ fontSize: '12px' }} className='text-muted'>{flight_type === 'GDS-ONWARD' ? bookingClass[index] : ''}</h6>
                                        </div>
                                    </div>
                                    <span style={{ background: '#eae8e8', fontSize: '12px' }} className="rounded-pill fw-semibold p-2 px-3 text-black ms-auto">Retail Fare</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center col-12  col-lg-9 mb-3 ">
                                    <div style={{ fontSize: '14px' }} className='text-muted p-0'>
                                        <h6 className='fs-4 fw-semibold text-black'>{data?.["@attributes"].DepartureTime.substring(11, 16)}</h6>
                                        <small className='text-black fw-medium'>{getAirportDataByCountry(data?.["@attributes"]?.Origin, 'city')} ( {data?.["@attributes"]?.Origin} )</small><br />
                                        <small>{formatDate(data?.["@attributes"].DepartureTime)}</small><br />
                                        <small>Terminal - </small>
                                    </div>
                                    <div className="text-center">
                                        <small className='fw-semibold fs-6'>
                                            {(() => {
                                                const departureTime = new Date(data?.["@attributes"].DepartureTime); // Ensure correct key here
                                                const arrivalTime = new Date(data?.["@attributes"].ArrivalTime);

                                                if (!isNaN(departureTime) && !isNaN(arrivalTime)) {
                                                    const durationMilliseconds = arrivalTime - departureTime;

                                                    // Calculate hours and minutes
                                                    const totalHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
                                                    const totalMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                                                    return `${totalHours}h ${totalMinutes}m`;
                                                } else {
                                                    return 'Invalid time data';
                                                }
                                            })()}

                                        </small>
                                        <div style={{ borderBottom: '2px dotted #e0e0e0', position: 'relative' }} className='my-3'>
                                            <div style={{ width: '30px', height: '30px', position: 'absolute', top: '-14px' }} className='border mx-4 d-flex align-items-center justify-content-center rounded-circle'>
                                                <i className='fas text-muted fa-plane-departure'></i>
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <span style={{
                                                border: `1px solid ${data?.["@attributes"]?.Carrier === "6E" || refundStatus === "REFUNDABLE"
                                                    ? "green"
                                                    : "red"
                                                    }`,
                                                fontSize: "10px",
                                                color:
                                                    data?.["@attributes"]?.Carrier === "6E" || refundStatus === "REFUNDABLE"
                                                        ? "green"
                                                        : "red",
                                            }} className="rounded-pill fw-semibold px-2 py-1 bg-white">{data?.["@attributes"]?.Carrier === '6E' ? 'REFUNDABLE' : refundStatus}</span>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '14px' }} className='text-muted text-end p-0'>
                                        <h6 className='fs-4 fw-semibold text-black'>{data?.["@attributes"].ArrivalTime.substring(11, 16)}</h6>
                                        <small className='text-black fw-medium'>{getAirportDataByCountry(data?.["@attributes"]?.Destination, 'city')} ( {data?.["@attributes"]?.Destination} )</small><br />
                                        <small>{formatDate(data?.["@attributes"].ArrivalTime)}</small><br />
                                        <small>Terminal - </small>
                                    </div>
                                </div>

                                {index < flightDetails.length - 1 && (() => {
                                    const currentArrivalTime = new Date(data?.["@attributes"].ArrivalTime);
                                    const nextDepartureTime = new Date(flightDetails[index + 1]?.["@attributes"].DepartureTime);

                                    if (!isNaN(currentArrivalTime) && !isNaN(nextDepartureTime)) {
                                        const layoverMilliseconds = nextDepartureTime - currentArrivalTime;
                                        const layoverHours = Math.floor(layoverMilliseconds / (1000 * 60 * 60));
                                        const layoverMinutes = Math.floor((layoverMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                                        if (layoverHours > 0 || layoverMinutes > 0) {
                                            return (
                                                <div className="row mt-2 mb-5 col-lg-12">
                                                    <div className='col-lg-3'></div>
                                                    <div style={{ borderBottom: '2px solid #e0e0e0' }} className='col-lg-9 text-center'>
                                                        <button style={{ background: '#e0e0e0', marginBottom: '-20px', fontSize: '12px', cursor: 'auto' }} className='btn fw-medium rounded-pill'>
                                                            <span className='fw-bold'>
                                                                {layoverHours}h {layoverMinutes}m
                                                            </span> Layover in <span className='fw-bold'> {getAirportDataByCountry(data?.["@attributes"].Destination, 'city')} ( {data?.["@attributes"].Destination} )</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }

                                    return null;
                                })()}
                            </div>
                        ))
                    }

                </div>

            </div >
        </>
    )
}

export default FLightreviewdetails
