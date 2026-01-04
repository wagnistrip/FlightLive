

import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import image from "./img/Coffees.png";
import { BsSuitcase2Fill } from "react-icons/bs";
import "./meal.scss"
import seatIcon from "./img/first1.png"
import MealIcon from "./img/first3.png"
import LuggageIcon from "./img/first2.png";
import pouplarIcon from "./img/pouplarIcon.png"
import extraLargeSeat from "./img/extraLarge.png"
import nonReaclining from "./img/nonReclining.png"
import exitRowSeat from "./img/exitSeat.png"
import seatTypeIcon from "./img/windowSeatIcon.png"
import flightfrontIcon from "./img/flightFrontIcon.png"
import FlightbackIcon from "./img/flightBackIcon.png"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SeatStructure from './SeatStructure';
import SeatMapGal from './SeatMapGal';
import toast from 'react-hot-toast';
import { calculateTotalPriceByOrigin, getAirlineName, getImageUrl1 } from '../../utils/airlineUtils';
import { Fade } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedBaggage, setSelectedBaggage } from '../../redux/actions/bookingActions';
const fareRanges = [
    { className: 'free', label: 'Free' },
    { className: 'fare1', label: '0-200' },
    { className: 'fare2', label: '201-400' },
    { className: 'fare3', label: '401-500' },
    { className: 'fare4', label: '501-1200' },
    { className: 'fare5', label: '1201-1399' },
    { className: 'fare6', label: '1400-1499' },
    { className: 'fare7', label: '1500-3000' },
    { className: 'fare8', label: '3000+' },
];
const Meal = ({ responseData, flightType, noOfAdults, noOfChildren, sea, seat, optionservice, selectSeat, setSelectSeat, setOtherCharge }) => {
    const [activeSection, setActiveSection] = useState('seatMap');
    const maxBaggageAllowed = noOfAdults + noOfChildren;

    const selectedBaggage = useSelector(state => state.booking.selectedBaggage);
    console.log("dldlkdl => ",selectedBaggage);
    const dispatch = useDispatch();
    const hasBaggage =
        Array.isArray(optionservice) && optionservice.length > 0;
    // console.log("Baggage data => ", optionservice);
    const sections = [
        { key: 'seatMap', label: 'Seat', icon: seatIcon },
        // { key: 'meal', label: 'Meal', icon: MealIcon },
        ...(hasBaggage
            ? [{ key: "baggage", label: "Baggage", icon: LuggageIcon }]
            : []),
        // { key: 'popular', label: 'Popular Add-Ons', icon: pouplarIcon },
    ];
    // console.log("offer bagage data =>",responseData,sea,seat);
    const [seatMaps] = useState(sea);
    const [seatMap, setSeatMap] = useState(seat);
    const [activeBtn, setActiveBtn] = useState("");
    const adultsCount = noOfAdults + noOfChildren;
    const [currentAdultIndex, setCurrentAdultIndex] = useState(0);
    const selectSeats = selectSeat[activeBtn] || [];
    let totalFare = 0;
    let grandTotal = 0;
    let segmentDetails;
    let amadeusSegmentdetails;

    const handleAddBaggage = (item) => {
        dispatch(setSelectedBaggage({
            key: item["@attributes"].Key,
            baggage: item,
            price: Number(item["@attributes"].TotalPrice.replace(/[^\d]/g, "")),
            weight: item["@attributes"].TotalWeight,
            maxBaggageAllowed
        }));
    };

    // const handleRemoveBaggage = () => {
    //     dispatch(removeSelectedBaggage());
    // };

    const handleRemoveBaggage = (key) => {
  dispatch(removeSelectedBaggage(key));
};


    const mealSection = [
        { mealimage: image, text: "Masala Tea", price: "150" },
        { mealimage: image, text: "Coffe", price: "200" },
        { mealimage: image, text: "Masala Cofee", price: "220" },
        { mealimage: image, text: "Garam Chaye", price: "250" },
        { mealimage: image, text: "Lemon Tea", price: "350" },


    ]


    useEffect(() => {
        if (responseData && responseData.itineraryDetails) {
            setActiveBtn(responseData?.itineraryDetails.originDestination.origin);
        } else if (responseData && responseData?.AirItinerary) {
            const getOrigin = Array.isArray(responseData?.AirItinerary.AirSegment)
                ? responseData?.AirItinerary.AirSegment
                : [responseData?.AirItinerary.AirSegment];
            setActiveBtn(getOrigin[0]["@attributes"].Origin);
        }
    }, []);



    const handleSegmentClick = (itinerary, flightType) => {
        let origin = "";

        if (flightType === "Galileo") {
            origin = itinerary["@attributes"].Origin;
        } else if (flightType === "Amadeus") {
            origin = itinerary?.flightDetails?.boardPointDetails?.trueLocationId;
        }

        setActiveBtn(origin); // Set the active button
        // Set the correct seat map based on the selected flight segment
        if (seatMaps[origin]) {
            setSeatMap(seatMaps[origin]);
        } else {
            setSeatMap(seatMaps[origin])
        }
    };


    if (responseData && responseData?.AirItinerary) {
        segmentDetails = Array.isArray(responseData?.AirItinerary.AirSegment) ? responseData?.AirItinerary.AirSegment : [responseData?.AirItinerary.AirSegment];
    } else if (responseData && responseData?.itineraryDetails) {
        amadeusSegmentdetails = Array.isArray(responseData?.itineraryDetails.segmentInformation) ? responseData.itineraryDetails.segmentInformation : [responseData.itineraryDetails.segmentInformation];
    } else {
        return null
    }

    const handleSeatSelect = (adultIndex, seat, origin) => {
        setSelectSeat((prevSelections = {}) => {
            const newSelections = { ...prevSelections };
            // Ensure there is an array of seats for the current segment
            if (!newSelections[origin]) {
                newSelections[origin] = Array(adultsCount).fill(null);
            }

            const seatCode = seat?.["@attributes"]?.SeatCode;
            if (!seatCode) {
                // toast.warn("Seat code is missing.");
                return prevSelections;
            }

            // Check if the seat is already selected by another adult
            const isSeatTaken = newSelections[origin].some(
                (selectedSeat, index) => selectedSeat?.["@attributes"]?.SeatCode === seatCode && index !== adultIndex
            );
            if (isSeatTaken) {
                toast.error("Seat already selected by another passenger.");
                return prevSelections;
            }

            // Update the seat selection for the current adult
            newSelections[origin][adultIndex] = seat;
            if (seat && seatCode) {
                toast.success(`Seat ${seatCode} selected successfully.`);
            } else {
                toast.warn("Seat code is missing.");
            }
            return newSelections;
        });

        // Automatically switch to the next adult index
        setCurrentAdultIndex((prevIndex) => (prevIndex + 1) % adultsCount);
    };
    const handleSeatSelects = (adultIndex, seat, origin, row) => {
        console.log(adultIndex, seat, origin, row);

        setSelectSeat((prevSelections = {}) => {
            const newSelections = { ...prevSelections };

            // Ensure there is an array of seats for the current origin (if not, initialize it)
            if (!newSelections[origin]) {
                newSelections[origin] = Array(adultsCount).fill(null);  // Initialize with null for each adult
            }

            // Get the seat column and row for this seat (adjust this depending on your data structure)
            const seatColumn = seat?.seatColumn;
            const seatRow = row;

            if (!seatColumn || !seatRow) {
                toast.success("Seat data is incomplete.");
                return prevSelections;
            }

            // Check if the seat is already selected by another adult
            const isSeatTaken = newSelections[origin].some(
                (selectedSeat, index) => selectedSeat?.seatColumn === seatColumn && selectedSeat?.seatRowNumber === seatRow && index !== adultIndex
            );
            if (isSeatTaken) {
                toast.success("Seat already selected by another passenger.");
                return prevSelections;
            }

            // Update the seat selection for the current adult
            newSelections[origin][adultIndex] = {
                seatColumn,
                seatRowNumber: seatRow,
                seatCharacteristic: seat.seatCharacteristic, // First two characteristics
            };

            // Uncomment if you want a success message on selection
            toast.success(`Seat ${seatRow} ${seatColumn} selected successfully.`);

            return newSelections;
        });

        // Automatically move to the next adult index, wrapping around if needed
        setCurrentAdultIndex((prevIndex) => (prevIndex + 1) % adultsCount);
    };

    const handleSeatRemove = (adultIndex, origin) => {
        setSelectSeat((prevSelections) => {
            const newSelections = { ...prevSelections };
            if (newSelections[origin]) {
                const removedSeat = newSelections[origin][adultIndex]; // Store the removed seat for the message
                newSelections[origin][adultIndex] = null; // Clear the seat selection for the adult
                if (removedSeat && removedSeat["@attributes"]?.SeatCode) {
                    const seatCode = removedSeat["@attributes"].SeatCode;
                    toast.success(`Seat ${seatCode} removed successfully.`);
                }
                // Handle Custom API Response Format
                else if (removedSeat && removedSeat.seatColumn && removedSeat.seatRowNumber) {
                    const seatCode = `${removedSeat.seatRowNumber}-${removedSeat.seatColumn}`;
                    toast.success(`Seat ${seatCode} removed successfully.`);
                }
                // If no seat was assigned
                else {
                    toast.warn("No seat was assigned to this passenger.");
                }

            }
            return newSelections;
        });
    };


    if (selectSeats && Array.isArray(selectSeats) && selectSeats.length > 0) {
        selectSeats.forEach((seat, index) => {
            // Check if seat is valid
            if (flightType === 'Galileo') {
                // Galileo seat handling
                if (seat?.["@attributes"]?.TotalPrice) {
                    const priceString = seat["@attributes"].TotalPrice; // Example: "INR375"
                    const parsedPrice = parseFloat(priceString.replace(/[^\d.-]/g, "")); // Remove "INR" and parse as float

                    if (!isNaN(parsedPrice)) {
                        totalFare += parsedPrice;
                    } else {
                        console.warn(`Invalid price format for seat at index ${index}: ${priceString}`);
                    }
                } else {
                    console.warn(`Galileo seat at index ${index} is invalid or does not contain price data:`, seat);
                }
            } else if (flightType === 'Amadeus') {
                // Amadeus seat handling
                const seatPrice = Array.isArray(seat?.seatCharacteristic)
                    ? seat.seatCharacteristic?.find(item => typeof item === "object" && item.seatPrice)
                    : null;

                if (seatPrice && seatPrice.seatPrice?.[0]?.amount) {
                    const parsedPrice = parseFloat(seatPrice.seatPrice[0].amount); // Amount is directly available
                    if (!isNaN(parsedPrice)) {
                        totalFare += parsedPrice;
                    } else {
                        console.warn(`Invalid price format for Amadeus seat at index ${index}: ${seatPrice.seatPrice[0].amount}`);
                    }
                } else {
                    console.warn(`Amadeus seat at index ${index} is invalid or does not contain price data:`, seat);
                }
            }
        });

        // Add current segment's total fare to the grand total
        grandTotal += totalFare;
    } else {
        console.warn("No seats selected or invalid selectSeats structure.");
    }

    useEffect(() => {
        const originprice = calculateTotalPriceByOrigin(selectSeat)
        setOtherCharge(originprice)

    }, [grandTotal])
    return (
        <>
            <div className='container mt-3 mb-3 pb-4 bg-white' id='baggage-meal'>


                <div className="container-fluid pt-4 border-bottom">

                    <div className="row flex-nowrap">
                        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">

                            {sections.map((section) => (
                                <div
                                    key={section.key}
                                    className={`p-2 fs-6 fw-bold d-flex underline align-items-center flex-sm-nowrap ${activeSection === section.key ? 'text-primary' : ''
                                        }`}
                                    onClick={() => setActiveSection(section.key)}
                                >
                                    <button type="button" className="btn text-primary fw-semibold p-0">
                                        {section.label}
                                    </button>
                                    <img
                                        style={{ width: '50px', height: '50px' }}
                                        src={section.icon}
                                        alt={section.label}
                                        className="p-1 d-none d-sm-inline"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {activeSection === 'seatMap' && (
                    <div className="container">
                        <div className='row'>
                            {/* left side  */}
                            <div className='col-lg-6 col-md-12 col-sm-6 border-right mt-2'>

                                <div>
                                    <div className='d-flex align-items-center justify-content-start gap-2'>

                                        {responseData && segmentDetails && segmentDetails.map((itinerary, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSegmentClick(itinerary, "Galileo")}
                                                style={{ fontSize: '12px' }}
                                                className={`py-1 px-3 ${activeBtn === itinerary["@attributes"].Origin ? 'btn btn-primary' : 'btn btn-secondary'} rounded-pill mr-2 mb-2`}
                                            >
                                                {itinerary["@attributes"].Origin} → {itinerary["@attributes"].Destination}
                                            </div>
                                        ))}
                                    </div>


                                    {responseData && segmentDetails && segmentDetails
                                        .filter(itinerary => itinerary["@attributes"].Origin === activeBtn)
                                        .map((itinerary, index) => (

                                            <div key={index} className="row d-flex mt-2">
                                                <div className='col-lg-2'>
                                                    <img
                                                        className='p-2' height="45px"
                                                        src={getImageUrl1(`/flightlogo/${itinerary["@attributes"].Carrier}.png`)}
                                                        // src={`/flight/${itinerary["@attributes"].Carrier}.png`}
                                                        alt="Airline Logo"
                                                        onError={(e) => (e.target.src = '/flight/default.png')}
                                                    />
                                                </div>
                                                <div className='col-lg-10'>
                                                    <h6 className='font-weight-bold'>{getAirlineName(itinerary["@attributes"].Carrier)}</h6>
                                                    <div className='text-muted'>{itinerary["@attributes"].Carrier} - {itinerary["@attributes"].FlightNumber}</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* amadues flight data here */}
                                <div>

                                    {(responseData && amadeusSegmentdetails) && amadeusSegmentdetails.map((itinerary, index) => (
                                        <div
                                            key={index}
                                            style={{ fontSize: '12px' }}
                                            onClick={() => handleSegmentClick(itinerary, "Amadeus")}
                                            // onClick={() => setActiveBtn(itinerary?.flightDetails.boardPointDetails.trueLocationId)}
                                            className={`py-1 px-3 ${activeBtn === itinerary?.flightDetails.boardPointDetails.trueLocationId ? 'btn btn-primary' : 'btn btn-secondary'} rounded-pill mr-2 mb-2`}
                                        >
                                            {itinerary?.flightDetails.boardPointDetails.trueLocationId} → {itinerary?.flightDetails.offpointDetails.trueLocationId}
                                        </div>
                                    ))}

                                    {(responseData && amadeusSegmentdetails) && amadeusSegmentdetails
                                        .filter(itinerary => itinerary?.flightDetails.boardPointDetails.trueLocationId === activeBtn)
                                        .map((itinerary, index) => (
                                            <div key={index} className="row d-flex mt-2">
                                                <div className='col-lg-2'>
                                                    <img
                                                        className='p-2' height="45px"
                                                        src={getImageUrl1(`/flightlogo/${itinerary?.flightDetails.companyDetails.marketingCompany}.png`)}
                                                        alt="Airline Logo"
                                                        onError={(e) => (e.target.src = '/flight/default.png')}
                                                    />
                                                </div>
                                                <div className='col-lg-10'>
                                                    <h6 className='font-weight-bold'>{getAirlineName(itinerary?.flightDetails.companyDetails.marketingCompany)}</h6>
                                                    <div className='text-muted'>{itinerary?.flightDetails.companyDetails.marketingCompany} - {itinerary?.flightDetails.flightIdentification.flightNumber}</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>


                                <div className="row mt-3 border border-muted m-2">
                                    {Array.from({ length: adultsCount }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="col-lg-12 bg-light d-sm-inline-block p-2 seat-container"
                                        >
                                            <div className="p-1 d-flex align-items-center justify-content-between position-relative">
                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                    <div>Adult {i + 1}</div>
                                                    <button className="btn btn-success ml-2">
                                                        {
                                                            flightType === 'Galileo' ? (
                                                                <span>
                                                                    {selectSeats[i]?.["@attributes"].SeatCode || "Select Seat"}
                                                                </span>
                                                            ) : flightType === 'Amadeus' ? (
                                                                <span>
                                                                    {selectSeats[i] ? `${selectSeats[i].seatRowNumber} - ${selectSeats[i].seatColumn}` : "Select Seat"}
                                                                </span>
                                                            ) : null
                                                        }

                                                    </button>

                                                    {selectSeat[activeBtn]?.[i] && (
                                                        <button
                                                            className="btn-link ml-2 remove-btn"
                                                            onClick={() => handleSeatRemove(i, activeBtn)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="float-right">
                                                    Rs { }
                                                    {
                                                        flightType === 'Galileo' ? (
                                                            <span>{selectSeats[i]?.["@attributes"].TotalPrice.replace("INR", "") || 0}</span>
                                                        ) : flightType === 'Amadeus' ? (
                                                            <span>{
                                                                Array.isArray(selectSeats[i]?.seatCharacteristic) && selectSeats[i]?.seatCharacteristic.length > 0
                                                                    ? selectSeats[i]?.seatCharacteristic?.find(
                                                                        (item) => typeof item === "object" && item.seatPrice
                                                                    )?.seatPrice?.[0]?.amount || "0"
                                                                    : "0"
                                                            }</span>
                                                        ) : null}

                                                </span>
                                            </div>
                                        </div>
                                    ))}


                                    <div className="col-lg-12 mt-2 p-2">
                                        <div className='p-1 d-flex align-items-center justify-content-between'>
                                            <span className='float-left'>Total Fare</span>
                                            <span className='float-right'>Rs {totalFare}</span>
                                        </div>
                                    </div>
                                </div>



                                <div className='row mt-5'>
                                    <div className='col-lg-12'><img style={{ width: '40px', height: '40px' }} src={seatIcon} alt="" className="p-1 d-none d-sm-inline" /> Seat Type</div>
                                </div>



                                <div className='container'>
                                    <div className="row">
                                        {fareRanges.map((fare, index) => (
                                            <div key={index} className="col-4 col-md-4 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <span className={fare.className}></span>
                                                    <span className="mx-1 text-muted fs-7">
                                                        {fare.label === 'Free' ? (
                                                            'Free'
                                                        ) : (
                                                            <>
                                                                <i className="fa-solid fa-indian-rupee-sign rupee-icon"></i>
                                                                {fare.label}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>



                                    <div className='row mt-2'>
                                        <div className='col-lg-4 col-md-4 col-sm-4 col-4'>
                                            <img src={extraLargeSeat} className="img-fluid" alt="Extra Legroom" />
                                            <div className='small'>Extra</div>
                                            <div className='small'>Legroom</div>
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-sm-4 col-4'>
                                            <img src={nonReaclining} className="img-fluid" alt="Non Reclining" />
                                            <div className='small'>Non</div>
                                            <div className='small'>Reclining</div>
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-sm-4 col-4'>
                                            <img src={exitRowSeat} className="img-fluid" alt="Exit Row Seats" />
                                            <div className='small'>Exit Row</div>
                                            <div className='small'>Seats</div>
                                        </div>
                                    </div>


                                </div>


                            </div>
                            {/* right side */}
                            <div className='col-lg-6 col-md-12 px-4 col-sm-6 py-5 d-flex bg-white flex-column align-items-center seat-design-section scroll-grid overflow-auto '>
                                {flightType === 'Amadeus' && (
                                    seatMap != null ? (
                                        <SeatStructure
                                            row={seatMap.rows?.[0]}
                                            seatMap={seatMap.rows}
                                            handleSeatSelect={handleSeatSelects}  // Pass handleSeatSelect function for Amadeus
                                            currentAdultIndex={currentAdultIndex}
                                            selectSeat={selectSeat}
                                            activeBtn={activeBtn}

                                        />
                                    ) : (
                                        <div className='w-100 d-flex align-items-center h-100 gap-2 justify-content-center'>
                                            {["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"].map((color) => (
                                                <div key={color} className={`spinner-grow text-${color}`} role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                                {flightType === 'Galileo' && (
                                    seatMap != null ? (
                                        <Fade in={!!seatMap} timeout={500} key={activeBtn}>
                                            <div>
                                                <SeatMapGal
                                                    row={seatMap.rows?.[0]}
                                                    seatMap={seatMap.rows}
                                                    handleSeatSelect={(adultIndex, seat) => handleSeatSelect(adultIndex, seat, activeBtn)}
                                                    currentAdultIndex={currentAdultIndex}
                                                    selectSeat={selectSeat}
                                                    activeBtn={activeBtn}
                                                />
                                            </div>
                                        </Fade>
                                    ) : (
                                        <div className='w-100 d-flex align-items-center h-100 gap-2 justify-content-center'>
                                            {["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"].map((color) => (
                                                <div key={color} className={`spinner-grow text-${color}`} role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                )}
                {activeSection === 'meal' && (

                    <div className='row mt-3'>
                        <div className='row mt-3 meal-section'>

                            {mealSection.map((item, index) => (
                                <div className='col-lg-6 col-md-12 col-sm-12 p-2' key={index}>
                                    <div className='d-flex flex-row border-bottom ml-2 align-items-center'>
                                        <div className='p-2'>
                                            <img src={item.mealimage} alt={item.text} height="100px" width="100px" />
                                        </div>
                                        <div className='p-2'>
                                            <div>{item.text}</div>
                                            <div>R {item.price}</div>
                                        </div>
                                        <div className='p-2 ml-auto'>
                                            <div className="btn-group" role="group" aria-label="First group">
                                                <button type="button" className="btn btn-outline-secondary">-</button>
                                                <button type="button" className="btn btn-outline-secondary">0</button>
                                                <button type="button" className="btn btn-outline-secondary">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                )}
                {activeSection === "baggage" && (
                    <div className='row mt-3'>
                        {/* <div
                            className=" col-auto px-3 ml-4 py-1 rounded-pill bg-primary text-white"
                            style={{
                                whiteSpace: "nowrap", // Prevents wrapping, ensuring the text stays on one line
                            }}
                        >
                            {optionservice &&
                                optionservice?.passanger &&
                                optionservice?.passanger.Body.AirMerchandisingOfferAvailabilityRsp.AirSolution.AirSegment["@attributes"].Origin}{" "}
                            - {" "}
                            {optionservice?.passanger.Body.AirMerchandisingOfferAvailabilityRsp.AirSolution.AirSegment["@attributes"].Destination}
                        </div> */}
                        <div className="row mt-3 scroll-grid overflow-auto"  style={{ maxHeight: "450px" }}>
                            {optionservice
                                ?.filter(
                                    (item) =>
                                        item?.["@attributes"]?.TotalWeight &&
                                        item?.["@attributes"]?.TotalPrice
                                )
                                .map((item, index) => {
                                    const baggageKey = item["@attributes"].Key;

                                    // const isSelected = selectedBaggage.key === baggageKey;
                                    // const qty = isSelected ? selectedBaggage.quantity : 0;
                                    const selectedItem = selectedBaggage.find(
                                        b => b.key === baggageKey
                                    );

                                    const qty = selectedItem?.quantity || 0;


                                    return (
                                        <div
                                            className="col-lg-6 col-md-12 col-sm-12 p-2"
                                            key={baggageKey || index}
                                        >
                                            <div className="d-flex align-items-center justify-content-between border-bottom py-1 px-2">

                                                {/* LEFT : Icon + Baggage Info */}
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-success p-2 bg-opacity-10 rounded">
                                                        <BsSuitcase2Fill size={36} className="text-primary" />
                                                    </div>

                                                    <div className="p-2">
                                                        <div className="fw-bold">
                                                            {item["@attributes"].TotalWeight}
                                                        </div>
                                                        <div>
                                                            INR {item["@attributes"].TotalPrice.replace("INR", "")}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT : Add / Remove */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        // disabled={!isSelected || qty === 0}
                                                        // onClick={handleRemoveBaggage}

                                                        disabled={qty === 0}
                                                        onClick={() => handleRemoveBaggage(baggageKey)}
                                                    >
                                                        −
                                                    </button>

                                                    <div className="fw-bold">{qty}</div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => handleAddBaggage(item)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                    </div>
                )}

                {activeSection === "popular" && (


                    // <div className="row p-3">
                    //     <div className="col-lg-6 border border-primary-subtle rounded p-4  d-flex align-items-center justify-content-between g-3" style={{ backgroundColor: "#f7fafd" }}>
                    //         <div>
                    //             <img src={PopularImage} alt="Popular" />
                    //         </div>
                    //         <div className="ml-5 flex-grow-1">
                    //             <div className="d-flex align-items-center mb-2">
                    //                 <img src={AirIndaiIcon} height="20px" className="mr-2" alt="AirIndia Icon" />
                    //                 <span>AirIndia Express</span>
                    //             </div>
                    //             <div className="mb-3">
                    //                 Priority Check-in + Priority Boarding + Priority Baggage 700 / Guest
                    //             </div>
                    //             <button
                    //                 type="button"
                    //                 className={`btn w-100 ${isAdded ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                    //                 style={{
                    //                     borderRadius: isAdded ? '0' : '',
                    //                     color: isAdded ? 'warning' : ''
                    //                 }}
                    //                 onClick={handleToggle}
                    //             >
                    //                 {isAdded ? 'Remove' : 'Add'}
                    //             </button>
                    //         </div>
                    //     </div>

                    // </div>
                    <div>
                        <i
                            className="fas fa-filter"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#staticBackdrop"
                            aria-controls="staticBackdrop"
                            style={{ fontSize: '24px', cursor: 'pointer' }}
                        ></i>

                        <div
                            className="offcanvas offcanvas-start"
                            data-bs-backdrop="static"
                            tabIndex="-1"
                            id="staticBackdrop"
                            aria-labelledby="staticBackdropLabel"
                        >
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="staticBackdropLabel">Offcanvas</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <div>
                                    I will not close if you click outside of me.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );

}

export default Meal;
