

import React, { useState } from 'react';
import "./Flightcard.scss";
import FlightFeeDetails from '../FlightFeeDetails';
import { calculateTravelTime, getAirlineName, getAirportDataByCountry, getImageUrl1 } from '../../utils/airlineUtils';
import { useSelector } from 'react-redux';
import { Radio } from '@mui/material';
const FlightCard = ({ data, index, currency, onSelect, isSelected, travellers, isReturn = false, trip }) => {
  const item = data;
  const commonPrice = useSelector((state) => state.booking.commonPrice);
  // Extract and clean the flight price
  const flightPrice = data?.PricingInfos["@attributes"]?.ApproximateTotalPrice
    ? parseFloat(data.PricingInfos["@attributes"].ApproximateTotalPrice.replace('INR', '').trim()) || 0
    : 0;

  // Ensure commonPrice is a valid number
  const cleanCommonPrice = typeof commonPrice === "string"
    ? parseFloat(commonPrice.replace('INR', '').trim()) || 0
    : parseFloat(commonPrice) || 0;

  // Calculate display price based on flight type
  let displayPrice;
  if (isReturn) {
    displayPrice = flightPrice > cleanCommonPrice ? flightPrice - cleanCommonPrice : 0;
  } else {
    displayPrice = flightPrice + cleanCommonPrice;
  }
  return (
    <div id='FlightCard' className='tour_details_boxed mt-2 p-0'>

      <div className=' container-fluid p-0 d-none d-md-block'>
        <div className="col-lg-12 p-0 mb-2">

          <div onClick={onSelect} className={`flight-card-section-1 overflow-hidden `} style={{ minHeight: "120px", border: "1px solid rgb(203, 172, 241)", borderRadius: "10px", backgroundColor: isSelected ? '#8b3eea17' : '' }}>
            <div className='w-full pt-2'></div>
            <div className="row d-flex align-items-center justify-content-around p-2">

              <div className="col-2">

                <div >
                  <img
                    src={getImageUrl1(`/flightlogo/${data.segments[0]["@attributes"].Carrier}.png`)}
                    // src={`/flight/${data.segments[0]["@attributes"].Carrier}.png`}
                    className='img-fluid'
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                    style={{ height: "30px", objectFit: "cover" }} />
                  <div className='fw-bold text-muted' style={{ fontSize: "12px" }}>
                    {getAirlineName(data.segments[0]["@attributes"].Carrier)}
                  </div>
                  <div className='fw-bolder text-muted' style={{ fontSize: "10px" }}>
                    {data.segments[0]["@attributes"].Carrier}{" - "} {data?.segments[0]["@attributes"].FlightNumber}
                  </div>
                </div>



              </div>
              <div className="col-2 from-origin">
                <div>
                  <div className='fw-bold fs-6 '>{data?.segments[0]["@attributes"].DepartureTime.substring(11, 16)}</div>
                  <div className='text-muted fw-bold' style={{ fontSize: "10px" }}> { } {getAirportDataByCountry(data?.segments[0]["@attributes"].Origin, 'city')}</div>
                </div>

              </div>
              <div className="col-3 duration-section">

                <div>
                  <div className='text-center fw-bolder' style={{ fontSize: "12px" }}>{
                    data.segments && data.segments.length > 0
                      ? calculateTravelTime(data.segments[0]["@attributes"].DepartureTime, data.segments[data.segments.length - 1]["@attributes"].ArrivalTime)
                      : 'N/A'
                  }</div>


                </div>

                <div className='duration-container-FlightCard'>
                  <div className='flightCard-circleIcon'></div>
                  <h6 className="duration-arrow-flightCard"></h6>
                  <div className='flightCard-circleIcon'></div>
                </div>

                <div>


                  <div className='text-center' style={{ marginTop: "-5px", fontSize: "12px" }}>
                    {data.segments && data.segments.length === 1
                      ? 'NonStop'
                      : data.segments.length === 2
                        ? '1-Stop'
                        : `${data.segments.length - 1}-Stops`}
                  </div>
                </div>

              </div>
              <div className="col-2 to-destination">



                <div>
                  <div className=' fs-6 fw-bold'>{data.segments[data.segments.length - 1]["@attributes"].ArrivalTime.substring(11, 16)}</div>
                  <div className='text-muted fw-bolder' style={{ fontSize: "10px" }}> {getAirportDataByCountry(data.segments[data.segments.length - 1]["@attributes"].Destination, 'city')}</div>
                </div>

              </div>
              <div className="col-3 d-flex justify-content-between">

                <div className='d-flex align-items-center justify-content-center'>
                  <p style={{ fontSize: '13px' }} className='text-danger fw-bold'>
                    {currency} { } {data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice && data.PricingInfos["@attributes"]?.ApproximateTotalPrice?.replace('INR', '').trim()}
                  </p>
                  <Radio sx={{
                    color: 'gray', // unselected color
                    '&.Mui-checked': {
                      color: 'var(--main-color)', // checked color
                    }
                  }} type="radio" name={`return-${index}`}
                    checked={isSelected}
                  />
                  <div className="text-danger fs-6 fw-bold">
                    {/* {
                    trip==='D' ? <>{new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(displayPrice).replace("INR", "").trim()}</> :<>
                    {currency} { } {data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice && data.PricingInfos["@attributes"]?.ApproximateTotalPrice?.replace('INR', '').trim()}</>
                  } */}
                    {/* {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(displayPrice).replace("INR", "").trim()} */}
                  </div>

                </div>




              </div>


            </div>

          </div>
        </div>
      </div>


      {/* *****************for mobile device ************************************** */}
      <div className="container-lg d-block d-md-none">
        <div className='row'>

          <div onClick={onSelect} className='col-12 p-1 mb-2 rounded' style={{ border: "1px solid #ccc", backgroundColor: isSelected ? '#e2f9ff' : '#ffff' }}>

            <div className='d-flex justify-content-between'>


              <div>

                <div >
                  <img
                    src={getImageUrl1(`/flightlogo/${data.segments[0]["@attributes"].Carrier}.png`)}
                    className='img-fluid'
                    alt="Airline Logo"
                    onError={(e) => (e.target.src = '/flight/default.png')}
                    style={{ height: "30px", objectFit: "cover" }} />


                  <div className='fw-bold text-muted' style={{ fontSize: "8px" }}>
                    {getAirlineName(data.segments[0]["@attributes"].Carrier)}

                  </div>

                </div>



              </div>

              <div>
                <div className='text-danger fw-bold' style={{ fontSize: "12px" }}>
                  {currency} { } {data?.PricingInfos["@attributes"] && data.PricingInfos["@attributes"]?.ApproximateTotalPrice && data.PricingInfos["@attributes"]?.ApproximateTotalPrice?.replace('INR', '').trim()}
                </div>




              </div>


            </div>
            <div className='d-flex justify-content-between'>


              <div>
                <div className='text-muted fw-bold' style={{ fontSize: "10px" }}>{data.segments[0]["@attributes"].DepartureTime.substring(11, 16)}</div>
                <div className='text-muted fw-bold' style={{ fontSize: "8px" }}>{getAirportDataByCountry(data?.segments[0]["@attributes"].Origin, 'city')}</div>
                {/* <div>Raushan</div> */}

              </div>

              <div className="text-center">


                <div>
                  <div className='fw-bold text-info' style={{ fontSize: "9px" }}>{
                    data.segments && data.segments.length > 0
                      ? calculateTravelTime(data.segments[0]["@attributes"].DepartureTime, data.segments[data.segments.length - 1]["@attributes"].ArrivalTime)
                      : 'N/A'
                  }</div>


                </div>

                <div className='duration-container-FlightCard'>
                  <div className='flightCard-circleIcon'></div>
                  <h6 className="duration-arrow-flightCard"></h6>
                  <div className='flightCard-circleIcon'></div>
                </div>


                <div>


                  <div className='fw-bold text-info' style={{ fontSize: "8px", marginTop: "-5px" }}>
                    {data.segments && data.segments.length === 1
                      ? 'NonStop'
                      : data.segments.length === 2
                        ? '1-Stop'
                        : `${data.segments.length - 1}-Stops`}
                  </div>
                </div>

              </div>
              <div>
                <div className='text-muted fw-bold' style={{ fontSize: "10px" }}>{data.segments[data.segments.length - 1]["@attributes"].ArrivalTime.substring(11, 16)}</div>
                <div className='text-muted fw-bold' style={{ fontSize: "8px" }}>{getAirportDataByCountry(data?.segments[data?.segments?.length - 1]["@attributes"]?.Destination, 'city')}</div>
                {/* <div className='text-muted fw-bold' style={{ fontSize: "8px" }}>{arriveCity === 'New Delhi' ? 'Delhi' : arriveCity}</div> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


export default FlightCard;