import React from 'react'
import { calculateTravelTime, getImageUrl1 } from '../utils/airlineUtils'

const Commonmobilecard = ({data,responseData,bookFlightGAL}) => {
    return (
        <div className='col-sm-12 py-2 mobile-device' onClick={() => bookFlightGAL(data, responseData?.travellers, data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice, responseData?.trip, responseData?.flightFare, responseData.hostToken, responseData?.tripType)}>
            <div className="d-flex align-items-center gap-2">

                <div className="text-center mr-2">
                    <img style={{ width: "30px", height: '30px' }}
                        src={getImageUrl1(`/flightlogo/${data.segments[0]["@attributes"].Carrier}.png`)}
                        className="img-fluid-flight "
                        alt="Airline Logo"
                        onError={(e) => (e.target.src = '/flight/default.png')}
                    />

                </div>
                <div className='flex-grow-1'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className='origin-section text-center '>

                            <div className="text-center ">
                                <div className="fw-bold " style={{ fontSize: "10px" }}> {data?.segments?.[0]?.["@attributes"]?.DepartureTime
                                    ? data.segments[0]["@attributes"].DepartureTime.substring(11, 16) // Extracts HH:mm directly
                                    : "N/A"}</div>
                                {/* <div className="fw-bold " style={{ fontSize: "12px" }}> {data.segments[0]["@attributes"].Origin}</div> */}
                            </div>
                        </div>
                        <div className='text-center'>
                            <div className="text-center " style={{ fontSize: "10px" }}>
                                <div className="fw-bold">{
                                    data.segments && data.segments.length > 0
                                        ? calculateTravelTime(data.segments[0]["@attributes"].DepartureTime, data.segments[data.segments.length - 1]["@attributes"].ArrivalTime)
                                        : 'N/A'
                                }</div>

                            </div>
                        </div>
                        <div className='destination-section text-center'>
                            {data.segments && data.segments.length > 0 && (
                                <div className="text-center ">
                                    <div className="fw-bold " style={{ fontSize: "10px" }}>{data.segments[data.segments.length - 1]["@attributes"].ArrivalTime
                                        ? data.segments[data.segments.length - 1]["@attributes"].ArrivalTime.substring(11, 16)
                                        : "N/A"}</div>
                                    {/* <div className="fw-bold " style={{ fontSize: "12px" }}>{data.segments[data.segments.length - 1]["@attributes"].Destination}</div> */}
                                </div>

                            )}

                        </div>
                    </div>
                    <div className='duration-container-mobile my-1'>
                        <div className='mobile' ></div>
                        <h6 className="duration-arrow-mobile"></h6>
                        <div className='mobile'></div>
                    </div>
                    <div className='p-0 w-100 d-flex align-items-center justify-content-between' >
                        <div className="fw-bold " style={{ fontSize: "12px" }}> {data.segments[0]["@attributes"].Origin}</div>

                        <div className="text-center ">
                            <div className="text-center mb-1  ml-4" style={{ fontSize: "10px" }}>
                                {data.segments && data.segments.length === 1
                                    ? 'NonStop'
                                    : data.segments.length === 2
                                        ? '1-Stop'
                                        : `${data.segments.length - 1}-Stops`}
                            </div>
                        </div>
                        <div className="fw-bold " style={{ fontSize: "12px" }}>{data.segments[data.segments.length - 1]["@attributes"].Destination}</div>

                    </div>
                </div>
                <div className='text-end price-section-mobile'>
                    <div style={{ fontSize: "12px" }}>
                        <div>
                            <div className='fw-bold '>
                                {responseData && responseData.currency && responseData.currency.currency_symbol}{' '} {data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice && data.PricingInfos["@attributes"]?.ApproximateTotalPrice?.replace('INR', '').trim()}
                            </div>

                        </div>

                    </div>
                </div>

            </div>
            <div style={{ fontSize: '12px' }} className='fw-medium'>
                {data.segments[0]["@attributes"].Carrier}{" - "} {data.segments[0]["@attributes"].FlightNumber}


            </div>

        </div>
    )
}

export default Commonmobilecard