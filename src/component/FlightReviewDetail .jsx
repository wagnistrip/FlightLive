

import React, { useState, useEffect } from 'react';
import { getAirlineName, getImageUrl1, indigoAirlinebaggage } from '../utils/airlineUtils';

function FlightReviewDetail({ responseData, origin, destination, setTransferBaggageData, segmentData, trip }) {
    let flightDetails = [];
    if (segmentData) {
        const departureSegments = Array.isArray(segmentData?.AirSegment)
            ? segmentData.AirSegment
            : segmentData?.AirSegment
                ? [segmentData.AirSegment]
                : [];

        const returnSegments = Array.isArray(segmentData?.returnSegment)
            ? segmentData.returnSegment
            : segmentData?.returnSegment
                ? [segmentData.returnSegment]
                : [];

        // Combine both segments safely
        flightDetails = [...departureSegments, ...returnSegments];
    }
    // const flightDetails = Array.isArray(segmentData) ? segmentData : [segmentData];
    // console.log(flightDetails[0].AirSegment["@attributes"].Carrier," baggage data ")
    const [baggageOpen, setBaggageOpen] = useState(false);
    const baggageHandler = () => setBaggageOpen(!baggageOpen);

    const groupBaggageData = (data) => {
        const uniqueSegments = new Map();

        data.forEach((item) => {
            const pricingInfos = Array.isArray(item?.AirPricingInfo)
                ? item.AirPricingInfo
                : [item?.AirPricingInfo];

            pricingInfos.forEach((pricingInfo) => {
                const baggageAllowances = pricingInfo?.BaggageAllowances;

                let allowances = [];
                if (baggageAllowances?.CarryOnAllowanceInfo) {
                    allowances = Array.isArray(baggageAllowances.CarryOnAllowanceInfo)
                        ? baggageAllowances.CarryOnAllowanceInfo
                        : [baggageAllowances.CarryOnAllowanceInfo];
                } else if (baggageAllowances?.BaggageAllowanceInfo) {
                    allowances.push(baggageAllowances.BaggageAllowanceInfo);
                }

                // console.log('dkddkdkd = > ',allowances);
                // return;

                allowances.forEach((allowance) => {
                    const { Origin, Destination, Carrier } = allowance["@attributes"] || {};
                    const key = `${Origin}-${Destination}-${Carrier}`;
                    if (!uniqueSegments.has(key)) {
                        uniqueSegments.set(key, {
                            origin: Origin || 'N/A',
                            destination: Destination || 'N/A',
                            carrier: Carrier || 'N/A',
                            checkInBaggage: Array.isArray(baggageAllowances?.BaggageAllowanceInfo) ? baggageAllowances?.BaggageAllowanceInfo[0].TextInfo?.Text[0] : baggageAllowances?.BaggageAllowanceInfo.TextInfo?.Text[0] || 'No Check-in Baggage',
                            cabinBaggage: allowance?.TextInfo?.Text || 'N/A',
                        });
                    }
                });
            });
        });

        return Array.from(uniqueSegments.values());
    };

    const formatBaggage = (baggage) => {
        if (!baggage) return 'N/A';
        if (baggage.includes('P')) return `${baggage.replace('P', '')} Piece`;
        if (baggage.includes('K')) return `${baggage.replace('K', '')} KG`;
        return baggage;
    };

    // useEffect(() => {
    //     const baggageData = groupBaggageData(Array.isArray(responseData) ? responseData : [responseData]);
    //     const baggageInformation = baggageData.map((item) => item.checkInBaggage);
    //     // setTransferBaggageData(baggageInformation);
    // }, [responseData]);

    const baggageData = groupBaggageData(Array.isArray(responseData) ? responseData : [responseData]);

    const filterBaggageData = (baggageData, origin, destination) => {
        if (!baggageData || baggageData.length === 0) return [];

        // Step 1: Check for direct flight
        const directFlight = baggageData.find(
            (flight) => flight.origin === origin && flight.destination === destination
        );

        if (directFlight) {
            return [directFlight]; // Return direct flight if found
        }

        // Step 2: Find layover flights using BFS (Breadth-First Search)
        let queue = [[origin, []]]; // Store [currentLocation, path]
        let visited = new Set();

        while (queue.length > 0) {
            let [currentOrigin, path] = queue.shift(); // Get first item from queue
            visited.add(currentOrigin); // Mark visited

            // Find next flights departing from currentOrigin
            let nextFlights = baggageData.filter(
                (flight) => flight.origin === currentOrigin && !visited.has(flight.destination)
            );

            for (let flight of nextFlights) {
                let newPath = [...path, flight]; // Add this flight to the path

                if (flight.destination === destination) {
                    return newPath; // If destination is found, return path
                }

                queue.push([flight.destination, newPath]); // Continue searching
            }
        }

        return []; // No valid route found
    };

    
    const result = (flightDetails && flightDetails.length > 0 && flightDetails[0]["@attributes"].Carrier === '6E') ? indigoAirlinebaggage(flightDetails, trip,origin, destination) : filterBaggageData(baggageData, origin, destination);
    return (
        <div className="container bg-light">
            <div className="text-start py-3 d-flex">
                <button
                    style={{ fontSize: '16px', border: '1px solid var(--main-color)', borderBottom: '0' }}
                    onClick={baggageHandler}
                    className={`btn ${baggageOpen ? 'text-primary' : 'text-muted'}`}
                >
                    Baggage
                </button>
            </div>

            {baggageOpen && (
                <div className="container">
                    <table className="table table-hover table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Airline</th>
                                <th scope="col">Origin</th>
                                <th scope="col">Destination</th>
                                <th scope="col">Check-in Baggage</th>
                                <th scope="col">Cabin Baggage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.length > 0 ? (
                                result.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={getImageUrl1(`/flightlogo/${item.carrier}.png`)}
                                                    alt={`${item.carrier || 'default'} logo`}
                                                    onError={(e) => (e.target.src = '/flight/default.png')}
                                                    style={{ width: '32px', height: '32px', marginRight: '8px' }}
                                                />
                                                <div>{getAirlineName(item.carrier)}</div>
                                            </div>
                                        </td>
                                        <td>{item.origin}</td>
                                        <td>{item.destination}</td>
                                        <td>{formatBaggage(item.checkInBaggage)}</td>
                                        <td>{formatBaggage(item.cabinBaggage)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No baggage information available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FlightReviewDetail;
