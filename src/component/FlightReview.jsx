import { useEffect, useState } from 'react';
import './FlightReview.css'
import { Link, useLocation } from 'react-router-dom';
import FlightReviewBottom from './FlightReviewBottom'
import TravellersDetails from './travellsdetails/TravellersDetails';
import FLightreviewdetails from './Flightreviewdetails';
import Meal from './Meal/Meal';
import { Row, Col, Card } from 'react-bootstrap';
import SeatModal from './SeatModal';
import FlightReviewDetail from './FlightReviewDetail ';
import { decryptPayload, encryptPayload, galileoApi } from '../Api/apiService';
import { ImAirplane } from "react-icons/im";
import { buildPassengerFormData, extractFlightAma, extractFlightDetails, findMatchingPricingSolution, formatDate, getAdditiondiscount, getAirportDataByCountry, getSeatCodes, getServiceFee, handleBookingupdate, isAfterThreeDays, matchSegmentsWithHostToken, mergeSegmentData } from '../utils/airlineUtils';
import Offer from './Offer';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup, TextField, useMediaQuery } from '@mui/material';
import { removeSelectedBaggage, setCommonChips, setGreenChipsUsed } from '../redux/actions/bookingActions';
import LoadingPage from '../LoadingPage';
import PaymentSummary from './PaymentSummary';
import toast from 'react-hot-toast';
function FlightReview() {

    const user = useSelector((state) => state.auth.user);
    const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
    const isGreenChipsUsed = useSelector((state) => state.booking.isGreenChipsUsed);
    const selectedBaggage = useSelector(state => state.booking.selectedBaggage);
    const walletAmout = useSelector((state) => state.booking.walletAmount);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [couponOption, setCouponOptions] = useState([]);
    const location = useLocation();
    const { responseData1 } = location.state;
    console.log('Response Data:', responseData1);
    const responseData = responseData1 && responseData1.triptype === 'oneway' ? responseData1 : responseData1.response ? responseData1 : responseData1?.departure;
    let trip = responseData1?.trip;
    let noOfAdults = parseInt(responseData1?.travellers?.noOfAdults) || 0;
    let noOfChildren = parseInt(responseData1?.travellers?.noOfChilds) || 0;
    let noOfInfants = parseInt(responseData1?.travellers?.noOfInfants) || 0;
    let adultPrice = 0;
    let childPrice = 0;
    let infantPrice = 0;
    let adultPrice2 = 0;
    let childPrice2 = 0;
    let infantPrice2 = 0;

    let totalTaxes = 0;
    let totalTaxes2 = 0;
    let originCity = '';
    let carrierCode = '';
    let destinationCity = '';
    let stopFlight = ''
    let stopFlight1 = ''
    let timeDuration = '';
    let timeDuration1 = '';

    // let discountedPrice = 0;
    let formatedate = ""
    let formatedateRetun = ""
    let flightType = '';
    let bookingCLASS = [];
    let bookingCLASS1 = [];
    let flightType1 = '';

    const [convenienceFee, setConvenienceFee] = useState(0);
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const [othercharges, setOtherCharge] = useState(0);
    const [baggagecharge, setbaggageCharge] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [greenchipsamt, setGreenchipsamout] = useState(0);
    const [usechipsamt1, setUsedchipsamout1] = useState([]);
    const [usechipsamt, setUsedchipsamout] = useState(0);
    const [othercharges1, setOtherCharge1] = useState(0);
    const [discountMessage, setDiscountMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [passangerData, setPassangerData] = useState(null);
    const [passangerData1, setPassangerData1] = useState(null);
    const [TransactionID] = useState(responseData1?.responseData && responseData1?.responseData["@attributes"].TransactionId ? responseData1?.responseData["@attributes"].TransactionId : null);
    const [TransactionID1] = useState(responseData1?.responseData1 && responseData1?.responseData1["@attributes"].TransactionId ? responseData1?.responseData1["@attributes"].TransactionId : null);
    const [galileoData] = useState(responseData1.responseData);
    const [galileoData1] = useState(responseData1.responseData1);
    const [modalVisible, setModalVisible] = useState(false);
    const [typedCoupon, setTypedCoupon] = useState('');
    const [optionservice, setOptionalService] = useState([]);
    const [selectSeat, setSelectSeat] = useState({});
    const [selectSeat1, setSelectSeat1] = useState({});
    const [seatMaps, setSeatMaps] = useState({});
    const [seatMap, setSeatMap] = useState(null);
    const [seatMaps1, setSeatMaps1] = useState({});
    const [seatMap1, setSeatMap1] = useState(null);
    const [loadingcompon, setloadingcompon] = useState(false);

    const [selectedOption, setSelectedOption] = useState("withPrice");
    const [markup, setMarkup] = useState("");

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const handleMarkupChange = (e) => {
        setMarkup(e.target.value);
    };
    let seatSegmentRt = null;
    if (
        responseData1?.trip === 'I' &&
        responseData1?.trip_type === 'roundtrip' &&
        responseData1?.responseData?.AirItinerary?.returnSegment
    ) {
        seatSegmentRt = {
            AirItinerary: {
                AirSegment: responseData1?.responseData?.AirItinerary?.returnSegment
            }
        };
    }

    let matchedSolution;
    let matchedSolution1;
    const HostToken = responseData1 && responseData1?.HostToken
    const handlePassengersData = (email, localNumber, passengers, trips, triptype, adult, children, infant, apiType, countryCodevl, gstData) => {
        const { formData, formData1 } = buildPassengerFormData({
            triptype,
            trips,
            apiType,
            email,
            localNumber,
            passengers,
            adult,
            children,
            infant,
            countryCodevl,
            gstData,
            responseData1,
            TransactionID,
            TransactionID1,
            galileoData,
            galileoData1,
            matchedSolution,
            matchedSolution1,
            HostToken,
        });

        setPassangerData(formData || null);
        setPassangerData1(formData1 || null);
        setModalVisible(true);
    };

    const handleRadioChange = (amt) => {
        const deduction = parseFloat(amt);

        // Case 1: If the same coupon is clicked again — remove it
        if (isGreenChipsUsed && usechipsamt === deduction) {
            setUsedchipsamout(0);
            dispatch(setGreenChipsUsed(false));
            dispatch(setCommonChips(greenChipsPrice + deduction));
            return;
        }

        // Case 2: If switching to a new coupon
        if (isGreenChipsUsed && usechipsamt !== deduction) {
            // First add back the previous coupon amount
            const restoredBalance = greenChipsPrice + usechipsamt;
            // Then deduct the new coupon amount
            const updatedBalance = restoredBalance - deduction;

            setUsedchipsamout(deduction);
            dispatch(setGreenChipsUsed(true));
            dispatch(setCommonChips(updatedBalance));
            return;
        }

        // Case 3: If applying for the first time
        setUsedchipsamout(deduction);
        dispatch(setGreenChipsUsed(true));
        dispatch(setCommonChips(greenChipsPrice - deduction));
    };


    function EditPassanger() {
        goToStep(1);
    }


    function updateCountsFromGalileo(responseData) {
        const flightType = "Galileo";
        let adultPrice = 0;
        let childPrice = 0;  // In your data there are no "CHD" (Child) fares, but I've left this here for future expansion
        let infantPrice = 0; // Same for "INF" (Infant) fares
        let totalTaxes = 0;
        let totalFee = 0;
        let bookingClass = [];
        // Helper function to convert a currency price to INR

        totalTaxes = responseData["@attributes"].Taxes.includes("INR")
            ? parseFloat(responseData["@attributes"].Taxes.replace("INR", ""))
            : responseData["@attributes"].Taxes;
        // : convertToINR(responseData["@attributes"].Taxes);
        totalFee = responseData && responseData["@attributes"] && responseData["@attributes"]?.Fees && parseFloat(responseData["@attributes"].Fees.replace("INR", "")) || 0;
        // Check if pricing info exists
        const pricingInfo = Array.isArray(responseData?.AirPricingInfo) ? responseData.AirPricingInfo : [responseData.AirPricingInfo];
        const bookingInfo = pricingInfo[0].BookingInfo;

        if (Array.isArray(bookingInfo)) {
            // Extract unique CabinClass values
            bookingClass = [...new Set(bookingInfo.map(info => info["@attributes"]?.CabinClass))];
        } else if (bookingInfo?.["@attributes"]?.CabinClass) {
            // Handle single direct flight case
            bookingClass = [bookingInfo["@attributes"].CabinClass];
        }
        pricingInfo.forEach(pricingInfo => {
            const fareInfo = pricingInfo?.PassengerType;
            const passengerType = Array.isArray(fareInfo)
                ? fareInfo[0]["@attributes"].Code
                : fareInfo["@attributes"].Code;

            let basePrice = pricingInfo["@attributes"].ApproximateBasePrice;
            // Convert base price to INR if necessary
            const convertedBasePrice = basePrice.includes("INR")
                ? parseFloat(basePrice.replace("INR", ""))
                : basePrice;
            // : convertToINR(basePrice);
            if (passengerType === "ADT" || passengerType === 'STU' || passengerType === 'SRC') {
                adultPrice += convertedBasePrice;
            } else if (passengerType === "CNN" || passengerType === 'CHD') {
                childPrice += convertedBasePrice;
            } else if (passengerType === "INF") {
                infantPrice += convertedBasePrice;
            }
        });

        return {
            totalTaxes: Math.round(totalTaxes) + totalFee,  // Ensure taxes are returned as rounded integer
            adultPrice: Math.round(adultPrice),  // Ensure price is rounded to nearest integer
            childPrice,  // No data for child or infant, left as 0
            infantPrice,
            flightType,
            bookingClass
        };
    }


    if (responseData1 && responseData1.trip_type === 'oneway') {
        if (responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary) {
            const details = extractFlightDetails(responseData1?.responseData?.AirItinerary?.AirSegment);
            stopFlight = details.stopFlight;
            timeDuration = details.timeDuration;
            originCity = details.originCity;
            carrierCode = details?.carrierCode
            destinationCity = details.destinationCity;

            matchedSolution = findMatchingPricingSolution(responseData1?.responseData?.AirPriceResult, responseData1?.targetPrice);
            const {
                adultPrice: calculatedAdultPrice,
                childPrice: calculatedChildPrice,
                infantPrice: calculatedInfantPrice,
                totalTaxes: calculatedTotalTaxes,
                flightType: calculatedFlightType,
                bookingClass: calulatedbookingClass
            } = updateCountsFromGalileo(matchedSolution);

            adultPrice = calculatedAdultPrice;
            childPrice = calculatedChildPrice;
            infantPrice = calculatedInfantPrice;
            totalTaxes = calculatedTotalTaxes;
            flightType = calculatedFlightType;
            bookingCLASS = calulatedbookingClass;
        }
        else if (responseData1 && responseData1.result) {
            const details = extractFlightAma(responseData1?.result?.itineraryDetails);
            stopFlight = details.stopFlight;
            timeDuration = details.timeDuration;
            originCity = details.originCity;
            destinationCity = details.destinationCity;
            formatedate = details.formatedate;
            carrierCodes = details.carrierscode;
        }
    } else if (responseData1 && responseData1.trip_type === 'roundtrip' && responseData1.trip === 'D') {
        if ((responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary) && (responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary)) {
            const [details, details1] = [
                extractFlightDetails(responseData1.responseData.AirItinerary?.AirSegment),
                extractFlightDetails(responseData1.responseData1.AirItinerary?.AirSegment)
            ];
            stopFlight = details.stopFlight;
            timeDuration = details.timeDuration;
            originCity = details.originCity;
            carrierCode = details.carrierCode;
            destinationCity = details.destinationCity;

            stopFlight1 = details1.stopFlight;
            timeDuration1 = details1.timeDuration;


            matchedSolution = findMatchingPricingSolution(responseData1?.responseData?.AirPriceResult, responseData1?.targetPrice);
            matchedSolution1 = findMatchingPricingSolution(responseData1?.responseData1?.AirPriceResult, responseData1?.targetPricereturn);
            const {
                adultPrice: calculatedAdultPrice,
                childPrice: calculatedChildPrice,
                infantPrice: calculatedInfantPrice,
                totalTaxes: calculatedTotalTaxes,
                flightType: calculatedFlightType,
                bookingClass: calulatedbookingClass
            } = updateCountsFromGalileo(matchedSolution);

            adultPrice = calculatedAdultPrice;
            childPrice = calculatedChildPrice;
            infantPrice = calculatedInfantPrice;
            totalTaxes = calculatedTotalTaxes;
            flightType = calculatedFlightType;
            bookingCLASS = calulatedbookingClass;

            const {
                adultPrice: calculatedAdultPrice1,
                childPrice: calculatedChildPrice1,
                infantPrice: calculatedInfantPrice1,
                totalTaxes: calculatedTotalTaxes1,
                flightType: calculatedFlightType1,
                bookingClass: calulatedbookingClass1
            } = updateCountsFromGalileo(matchedSolution1);


            adultPrice2 = calculatedAdultPrice1;
            childPrice2 = calculatedChildPrice1;
            infantPrice2 = calculatedInfantPrice1;
            totalTaxes2 = calculatedTotalTaxes1;
            flightType1 = calculatedFlightType1;
            bookingCLASS1 = calulatedbookingClass1;
        }
        else if (responseData1 && responseData1.result) {
            const details = extractFlightAma(responseData1?.result?.itineraryDetails);
            stopFlight = details.stopFlight;
            timeDuration = details.timeDuration;
            originCity = details.originCity;
            destinationCity = details.destinationCity;
            formatedate = details.formatedate;
            // carrierCode = details.carrierCode;
        }
    } else if (responseData1 && responseData1.trip_type === 'roundtrip' && responseData1.trip === 'I') {
        if (responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary) {

            const [details, details1] = [
                extractFlightDetails(responseData1.responseData.AirItinerary?.AirSegment),
                extractFlightDetails(responseData1.responseData.AirItinerary?.returnSegment)
            ];
            stopFlight = details.stopFlight;
            timeDuration = details.timeDuration;
            originCity = details.originCity;
            carrierCode = details.carrierCode;
            destinationCity = details.destinationCity;

            stopFlight1 = details1.stopFlight;
            timeDuration1 = details1.timeDuration;
            matchedSolution = findMatchingPricingSolution(responseData1?.responseData?.AirPriceResult, responseData1?.targetPrice);
            const {
                adultPrice: calculatedAdultPrice,
                childPrice: calculatedChildPrice,
                infantPrice: calculatedInfantPrice,
                totalTaxes: calculatedTotalTaxes,
                flightType: calculatedFlightType,
                bookingClass: calulatedbookingClass
            } = updateCountsFromGalileo(matchedSolution);

            adultPrice = calculatedAdultPrice;
            childPrice = calculatedChildPrice;
            infantPrice = calculatedInfantPrice;
            totalTaxes = calculatedTotalTaxes;
            flightType = calculatedFlightType;
            bookingCLASS = calulatedbookingClass;
        }
        else if (responseData1 && responseData1.result) {
            // const details = extractFlightAma(responseData1?.result?.itineraryDetails);
            // stopFlight = details.stopFlight;
            // timeDuration = details.timeDuration;
            // originCity = details.originCity;
            // destinationCity = details.destinationCity;
            // formatedate = details.formatedate;
            // carrierCodes = details.carrierscode;
        }
    }
    else {
        console.log("not data will come ")
    }

    const isCouponActive = (couponCode) => {
        if (!couponCode.startsWith('WTNCF')) return true; // Non-WTNCF coupons are always active

        // Find applicable range for the current grandTotal
        const matchingCoupon = couponOption.find(range => grandTotal >= range.min && grandTotal <= range.max);

        return matchingCoupon ? couponCode === matchingCoupon.code : false;
        // return false;
    };

    const handleApplyCoupon = () => {
        const matchedCoupon = couponOption.find(coupon => coupon.code === typedCoupon);
        // return
        if (matchedCoupon && isCouponActive(matchedCoupon.code)) {
            if (matchedCoupon.code === "WT FREE SEAT") {
                if (othercharges === 0 || othercharges > 300) {
                    alert("Applicable only when seat charge is greater than 0 and up to Rs. 300");
                    return;
                }
            }
            else if (matchedCoupon && matchedCoupon?.code === 'WT FREE MEAL' && baggagecharge === 0) {
                alert("Applicable for chargeable meal");
                return
            }
            let discountAmount = 0;
            // if (typeof matchedCoupon.discount_amount === 'string' && matchedCoupon.discount_amount.includes('%')) {
            if (matchedCoupon?.code === "WT FREE SEAT" && othercharges > 0 && othercharges <= 300) {
                discountAmount = othercharges;
            }
            else if (typeof matchedCoupon.discount_amount === 'string') {
                const percentage = parseFloat(matchedCoupon?.discount_amount);
                // discountAmount = Math.round((grandTotal * percentage) / 100);
                discountAmount = Math.round(percentage);
            } else if (typeof matchedCoupon.discount_amount === 'number') {
                discountAmount = matchedCoupon.discount_amount;
            }

            setSelectedCoupon(matchedCoupon.code);
            setDiscountedPrice(discountAmount);
            setDiscountMessage(`Congratulations! Discount of Rs. ${discountAmount} has been applied successfully.`);
            setWarningMessage('');
        } else {
            setSelectedCoupon('');
            setDiscountedPrice(0);
            setDiscountMessage('');
            setWarningMessage('Invalid or inactive coupon. Please check the payment amount.');
        }
    };

    // console.log(originCity,destinationCity,dayTime,stopFlight);
    const totalAdults = noOfAdults * adultPrice;
    const totalChildren = noOfChildren * childPrice;
    const totalInfants = noOfInfants * infantPrice;
    const totalAdults2 = noOfAdults * adultPrice2;
    const totalChildren2 = noOfChildren * childPrice2;
    const totalInfants2 = noOfInfants * infantPrice2;
    const grandTotal = totalAdults + totalChildren + totalInfants + totalTaxes;
    const grandTotal2 = totalAdults2 + totalChildren2 + totalInfants2 + totalTaxes2;

    const handleCouponSelect = (couponCode) => {
        if (couponCode === "WT FREE SEAT") {
            if (othercharges === 0 || othercharges > 300) {
                alert("Applicable only when seat charge is greater than 0 and up to Rs. 300");
                return;
            }
        }
        else if (couponCode === 'WT FREE MEAL' && baggagecharge === 0) {
            alert("Applicable for chargeable meal");
            return
        }
        setSelectedCoupon(couponCode);
        setTypedCoupon(couponCode);

        const matchedCoupon = couponOption.find(coupon => coupon.code === couponCode);
        let discountAmount = 0;

        if (matchedCoupon) {

            // if (typeof matchedCoupon.discount_amount === 'string' && matchedCoupon.discount_amount.includes('%')) {
            if (couponCode === "WT FREE SEAT" && othercharges > 0 && othercharges <= 300) {
                discountAmount = othercharges;
            }
            else if (typeof matchedCoupon.discount_amount === 'string') {
                // Extract percentage and calculate discount
                const percentage = parseFloat(matchedCoupon.discount_amount);
                discountAmount = Math.round(percentage);
            } else if (typeof matchedCoupon.discount === 'number') {
                // Fixed discount amount
                discountAmount = matchedCoupon.discount;
            }

            setDiscountedPrice(discountAmount);
            setDiscountMessage(`Congratulations! Discount of Rs. ${discountAmount} has been applied successfully.`);
        }
    };


    const handleClearCoupon = () => {
        setSelectedCoupon('');
        setTypedCoupon('');
        setDiscountMessage('');
        setDiscountedPrice(0); // Reset discount
    };

    const handleCouponChange = (e) => {
        const inputValue = e.target.value.toUpperCase(); // Convert to uppercase
        setTypedCoupon(inputValue);

        // Remove warning message when typing
        if (warningMessage) {
            setWarningMessage('');
        }
    };



    // Extract origin date from the response
    if (responseData1 && responseData1.trip_type === 'oneway') {
        if (responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary) {
            const originDateTime = Array.isArray(responseData1.responseData.AirItinerary.AirSegment) ? responseData1.responseData.AirItinerary.AirSegment[0]["@attributes"].DepartureTime : responseData1.responseData.AirItinerary.AirSegment["@attributes"].DepartureTime;
            formatedate = formatDate(originDateTime);
            // formatedateRetun
        }
    } else if (responseData1?.trip_type === 'roundtrip' && responseData1?.trip === 'D') {
        if (
            responseData1?.responseData?.AirItinerary &&
            responseData1?.responseData1?.AirItinerary
        ) {
            const [originDateTime, originDateTime1] = [
                Array.isArray(responseData1.responseData.AirItinerary.AirSegment)
                    ? responseData1.responseData.AirItinerary.AirSegment[0]["@attributes"].DepartureTime
                    : responseData1.responseData.AirItinerary.AirSegment["@attributes"].DepartureTime,

                Array.isArray(responseData1.responseData1.AirItinerary.AirSegment)
                    ? responseData1.responseData1.AirItinerary.AirSegment[0]["@attributes"].DepartureTime
                    : responseData1.responseData1.AirItinerary.AirSegment["@attributes"].DepartureTime
            ];

            [formatedate, formatedateRetun] = [formatDate(originDateTime), formatDate(originDateTime1)];
        }
    }
    else if (responseData1?.trip_type === 'roundtrip' && responseData1.trip === 'I') {
        // alert('Raushan')
        if (
            responseData1?.responseData?.AirItinerary
        ) {
            // alert('Raushan')
            const [originDateTime, originDateTime1] = [
                Array.isArray(responseData1.responseData.AirItinerary.AirSegment)
                    ? responseData1.responseData.AirItinerary.AirSegment[0]["@attributes"].DepartureTime
                    : responseData1.responseData.AirItinerary.AirSegment["@attributes"].DepartureTime,

                Array.isArray(responseData1.responseData.AirItinerary.returnSegment)
                    ? responseData1.responseData.AirItinerary.returnSegment[0]["@attributes"].DepartureTime
                    : responseData1.responseData.AirItinerary.returnSegment["@attributes"].DepartureTime
            ];
            [formatedate, formatedateRetun] = [formatDate(originDateTime), formatDate(originDateTime1)];
        }
    } else {
        console.log("not data will come")
    }

    const [activeStep, setActiveStep] = useState(1);

    const goToStep = (step) => {
        setActiveStep(step);
    };

    const getPassangerPaxtye = (passanger) => {
        if (passanger === "ADT") {
            return "Adult";
        }
        else if (passanger === "CHD") {
            return "Child";
        }
        else if (passanger === "INF") {
            return "Infant";
        }
        return passanger;
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeStep]);

    useEffect(() => {
        if (responseData1) {
            setConvenienceFee(responseData1 && responseData1?.convenienceFees);
        }
    }, [responseData1, noOfAdults, noOfChildren, noOfInfants]);




    const [showAll, setShowAll] = useState(false);
    const visibleCoupons = showAll ? couponOption : couponOption.slice(0, 6);

    // ***************easebuzz-payment detail**************
    const handleBooking = async (TransactionID, apitype, selectSeat, passangerData, galileoData, totalFlgithAmt, selectSeat1, TransactionID1, passangerData1, galileoData1, flightFare, trip, triptype, data, traveler, discountedPrice, matchedSolution, matchedSolution1, hostToken, bookingType, AdditionCharge) => {
        const token = user?.token;
        const userdata = user?.users
        if (userdata?.role === 2) {
            setloadingcompon(true);
        }
        const travelerData = passangerData && passangerData?.CustomerInfo && passangerData?.CustomerInfo?.PassengerDetails || "";
        const datagal = data && data?.responseData?.AirItinerary || ""
        const datagalRet = data && data?.responseData1 && data?.responseData1?.AirItinerary || ""

        // onward request for pricing solution

        const pricehost = Array.isArray(matchedSolution?.AirPricingInfo) ? matchedSolution?.AirPricingInfo[0] : matchedSolution?.AirPricingInfo;
        const hostdetails = Array.isArray(pricehost?.BookingInfo) ? pricehost.BookingInfo : [pricehost?.BookingInfo];
        const FareInfodetails = Array.isArray(pricehost?.FareInfo) ? pricehost.FareInfo : [pricehost?.FareInfo];


        const pricehostRt = Array.isArray(matchedSolution1?.AirPricingInfo) ? matchedSolution1?.AirPricingInfo[0] : matchedSolution1?.AirPricingInfo;
        const hostdetailsRt = Array.isArray(pricehostRt?.BookingInfo) ? pricehostRt.BookingInfo : [pricehostRt?.BookingInfo];
        const FareInfodetailsRt = Array.isArray(pricehostRt?.FareInfo) ? pricehostRt.FareInfo : [pricehostRt?.FareInfo];

        // return request for pricing solution pending


        const flightcommonsector = Array.isArray(datagal?.AirSegment) ? datagal?.AirSegment : [datagal?.AirSegment]
        const updateApitype = flightcommonsector[0]["@attributes"]?.Carrier === '6E' ? 'Indigo' : apitype;

        let flightcommonsectorRt = [];
        let updateApitype1 = null;
        let matchedSegmentsRt = [];
        if (datagalRet) {
            flightcommonsectorRt = Array.isArray(datagalRet?.AirSegment) ? datagalRet?.AirSegment : [datagalRet?.AirSegment]
            updateApitype1 = flightcommonsectorRt[0]["@attributes"]?.Carrier === '6E' ? 'Indigo' : apitype;
            matchedSegmentsRt = mergeSegmentData(hostdetailsRt, flightcommonsectorRt);
        }

        const matchedSegments = mergeSegmentData(hostdetails, flightcommonsector);
        let matchedSegmentsIRt = [];
        if (updateApitype === 'Indigo' && trip === 'I' && triptype === 'roundtrip') {
            const flightcommonsectorRt = Array.isArray(datagal?.returnSegment) ? datagal?.returnSegment : [datagal?.returnSegment]
            matchedSegmentsIRt = mergeSegmentData(hostdetails, flightcommonsectorRt);
        }

        const pricingModifiers = updateApitype === "Indigo"
            ? FareInfodetails && FareInfodetails.map(item => ({
                key: item["@attributes"].Key,
                FareBasisCode: item["@attributes"].FareBasis
            }))
            : [];

        const pricingModifiersRt = updateApitype1 === "Indigo"
            ? FareInfodetailsRt && FareInfodetailsRt.map(item => ({
                key: item["@attributes"].Key,
                FareBasisCode: item["@attributes"].FareBasis
            }))
            : [];


        const flightOrigin = flightcommonsector[0]["@attributes"].Origin;
        const flightDestination = flightcommonsector[flightcommonsector.length - 1]["@attributes"].Destination;
        const returnInternational = passangerData && passangerData?.Flightdata && passangerData?.Flightdata?.AirItinerary && passangerData?.Flightdata?.AirItinerary?.returnSegment || null
        let returnRequest = null;
        let returnRequestInt = null;

        const requestData = await handleBookingupdate(TransactionID, updateApitype, selectSeat, traveler?.noOfAdults, traveler?.noOfChilds, passangerData.CustomerInfo.PassengerDetails, galileoData?.AirItinerary.AirSegment, totalFlgithAmt, passangerData?.CustomerInfo.PassengerDetails[0].FirstName, passangerData?.CustomerInfo.Email, passangerData?.CustomerInfo.Mobile, flightFare);
        if (passangerData1) {
            returnRequest = await handleBookingupdate(TransactionID1, updateApitype1, selectSeat1, traveler?.noOfAdults, traveler?.noOfChilds, passangerData1.CustomerInfo.PassengerDetails, galileoData1?.AirItinerary.AirSegment, totalFlgithAmt, passangerData1?.CustomerInfo.PassengerDetails[0].FirstName, passangerData1?.CustomerInfo.Email, passangerData1?.CustomerInfo.Mobile, flightFare);
        }
        if (returnInternational) {
            // alert('request is under process')
            returnRequestInt = await handleBookingupdate(TransactionID, updateApitype, selectSeat1, traveler?.noOfAdults, traveler?.noOfChilds, passangerData.CustomerInfo.PassengerDetails, galileoData?.AirItinerary.returnSegment, totalFlgithAmt, passangerData1?.CustomerInfo.PassengerDetails[0].FirstName, passangerData1?.CustomerInfo.Email, passangerData1?.CustomerInfo.Mobile, flightFare);
        }

        // console.log("check data here => ",returnRequestInt);
        // return;
        const Airpricereq = updateApitype === 'Indigo' && (
            (trip === 'D') ||
            (trip === 'I' && triptype !== 'roundtrip')
        ) ? {
            "airSegments": matchedSegments,
            "hostToken": datagal?.HostToken,
            "PricingModifiers": pricingModifiers || {},
            "selectSeat": requestData && requestData?.selectSeat,
            "infantData": travelerData || "",
            "flightFare": flightFare,
        } : updateApitype === 'Indigo' && trip === 'I' && triptype === 'roundtrip' ? {
            "airSegments": matchedSegments,
            "hostToken": datagal?.HostToken,
            "PricingModifiers": pricingModifiers || {},
            "returnSegment": matchedSegmentsIRt,
            "selectSeat": requestData && requestData?.selectSeat,
            "returnselectSeat": returnRequestInt && returnRequestInt?.selectSeat,
            "infantData": travelerData || "",
            "flightFare": flightFare,
        } : null


        const AirpricereqRt = updateApitype1 === 'Indigo' ? {
            "airSegments": matchedSegmentsRt,
            "hostToken": datagalRet?.HostToken,
            "PricingModifiers": pricingModifiersRt || {},
            "selectSeat": returnRequest && returnRequest?.selectSeat,
            "flightFare": flightFare,
            "infantData": [passangerData1],
        } : null;

        const airPriceArray = [];

        if (updateApitype === 'Indigo' && Airpricereq) {
            airPriceArray.push({ onwardAirpricereq: Airpricereq });
        }

        if (updateApitype1 === 'Indigo' && AirpricereqRt) {
            airPriceArray.push({ onwardAirpricereq: AirpricereqRt });
        }
        const newreq = {
            "onward": requestData,
            ...(returnRequest && { return: returnRequest }),
            ...(returnRequestInt && { return: { origin: returnRequestInt?.origin, selectSeat: returnRequestInt?.selectSeat } }),
            trip: trip,
            tripType: triptype,
            Origin: flightOrigin,
            noOfAdults: traveler?.noOfAdults || 1,
            noOfChilds: traveler?.noOfChilds || 0,
            noOfInfants: traveler?.noOfInfants || 0,
            Destination: flightDestination,
            additionFee: (AdditionCharge || 0),
            discountAmt: discountedPrice,
            ...(userdata?.role === 2 && { payment_type: "wallet" }),
            ...(userdata?.role === 2 && { markUp: markup }),
            ...(userdata?.role === 2 && { paymentShow: selectedOption }),
            ...(userdata?.role === 2 && bookingType === 'WithoutWailet' && { bookingType: "WithoutWailet" }),
            ...(airPriceArray.length > 0 && { airPriceArray }),
            // ...(userdata?.role === 2 && { earnCoins: (greenchipsamt ?? 0) - (isGreenChipsUsed ? (usechipsamt ?? 0) : 0) }),
            ...(userdata?.role === 2 && { earnCoins: 0 }),
            ...(userdata?.role === 2 && {
                useCoin: isGreenChipsUsed ? usechipsamt : 0
            }),
        }

        // return;
        try {
            const encryptedPayload = encryptPayload(newreq || '');
            console.log("request from booking", newreq);
            // return;
            // setloadingcompon(false);
            const response = await galileoApi("/payment/initiate", { payload: encryptedPayload }, token);
            const decryptedResponse1 = decryptPayload(response?.data || "");
            const parsed = JSON.parse(decryptedResponse1);
            const redirectUrl = parsed?.redirect_url;
            // console.log(redirectUrl);

            if (redirectUrl) {
                // console.log("Redirect URL:", redirectUrl);
                setloadingcompon(false);
                // Redirect to the payment gateway in the same tab
                window.location.href = redirectUrl;

                // Note: No interval check for window close since it's in the same tab
            } else {
                setloadingcompon(false);
                 toast.error('booking is failed due to technical issue')
                console.error("No redirect URL received in the response");
            }

        } catch (error) {
             setloadingcompon(false);
             toast.error('booking is failed due to technical issue')
            console.error('Error createReservation:', error);
            throw error;
        }

    }

    const totalFlgithAmt = grandTotal + grandTotal2 + othercharges + othercharges1 + ((!user || user?.users?.role === 1) ? convenienceFee : 0) + (user?.users?.role === 2 ? getServiceFee(trip, user?.users?.agent_type) : 0) - (user && user?.users.role === 1 ? 0 : (isGreenChipsUsed ? usechipsamt : 0)) - (user?.users?.role === 2 && user?.users?.agent_type === 'A' ? getAdditiondiscount(trip) : 0) - (user?.users?.role === 2 && user?.users?.agent_type === 'B' ? greenchipsamt : 0) - discountedPrice;
    // add here 4% extra charge
    const AdditionCharge = (!user || user?.users?.role === 1) ? parseFloat((totalFlgithAmt * 0.045).toFixed(2)) : 0;

    const greenChipsfetch = async (token, trip, triptype, amount, travellers, carrierCode, carrierCode1) => {
        const flightcode = Array.isArray(carrierCode?.AirSegment) ? carrierCode?.AirSegment : [carrierCode?.AirSegment]
        const flightcode1 = Array.isArray(carrierCode1?.AirSegment) ? carrierCode1?.AirSegment : [carrierCode1?.AirSegment] || ""
        const serviceFee = getServiceFee(trip, user?.users?.agent_type);
        const finalTotal = (amount || 0) + serviceFee;
        const carrier1 = flightcode?.[0]?.["@attributes"]?.Carrier || "";
        const carrier2 = flightcode1?.[0]?.["@attributes"]?.Carrier || "";
        const Origin_Code = flightcode[0]['@attributes']?.Origin || ""
        const destination_Code = flightcode[flightcode.length - 1]['@attributes']?.Destination || ""
        const destination_Code1 = flightcode1?.[0]?.['@attributes']?.Origin || ""
        const requestbody = {
            Trip: trip,
            trip_type: triptype,
            amount: finalTotal || 0,
            adult: travellers?.noOfAdults || 1,
        };

        // Logic for carrierCode
        if (carrier1 && !carrier2) {
            // Only departure exists
            requestbody.carrierCode = carrier1;
            requestbody.origin = Origin_Code;
            requestbody.destination = destination_Code;
        } else if (carrier1 && carrier2 && carrier1 === carrier2) {
            // Both exist and are the same
            requestbody.carrierCode = carrier1;
            requestbody.origin = Origin_Code;
            requestbody.destination = destination_Code1;
        } else {
            // Either different carriers or both missing → do not include
            console.log("Skipping carrierCode, mismatch or no data");
        }

        //  console.log("reqdddddddddddd => ",requestbody);
        //  return ;
        try {
            const res = await galileoApi('/green-chips', requestbody, token);
            // return;
            if (res.status === 200) {
                setGreenchipsamout(res?.GreenChips);
                setUsedchipsamout1([]);
                // setUsedchipsamout1(res?.useGreenChips || []);
            } else {
                setGreenchipsamout(0); // Uncomment if needed
                setUsedchipsamout1([]);
                // setUsedchipsamout1(res?.useGreenChips || [])

            }
        } catch (err) {
            console.log(err, "here show error for offer card");
        }
    };

    useEffect(() => {
        const offerApi = async (trip, triptype, travellers, data) => {
            // console.log("current data = > ",data);
            // return;
            const requestbody = {
                trip: trip,
                tripType: triptype,
                noOfAdults: travellers?.noOfAdults || 1,
                noOfChilds: travellers?.noOfChilds || 0,
                noOfInfants: travellers?.noOfInfants || 0,
            }
            try {
                const res = await galileoApi('get-coupons', requestbody);
                if (res.success === true) {
                    setCouponOptions(res?.coupons);
                } else {
                    setCouponOptions([]); // Uncomment if needed
                }
            } catch (err) {
                console.log(err, "here show error for offer card");
            }
        };

        const totalAmt = grandTotal + grandTotal2 || 0;
        const token = user?.token || 0;

        if (totalAmt > 0 && user?.users.role === 2) {
            const carrierCode = responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary
            const carrierCode1 = responseData1 && responseData1?.responseData && responseData1?.responseData1?.AirItinerary || ""
            greenChipsfetch(token, responseData1 && responseData1?.trip, responseData1 && responseData1?.trip_type, totalAmt, responseData1 && responseData1?.travellers, carrierCode, carrierCode1);
        }
        dispatch(setGreenChipsUsed(false));
        dispatch(removeSelectedBaggage());
        offerApi(responseData1 && responseData1?.trip, responseData1 && responseData1?.trip_type, responseData1 && responseData1?.travellers, responseData1);
    }, [responseData1]);

    // console.log("dkldlkdlk=> ", totalFlgithAmt);
    return (
        <>
            {
                isMobile ? null : <Offer title="Review & Payment" />
            }
            {loadingcompon && (
                <LoadingPage />
            )}
            <div className='container p-2'>

                <div className=''>
                    <div className='col-lg-12 p-0 col-md-12 col-sm-12'>
                        <div className='w-100 px-4 my-4 mt-5'>
                            <h6>
                                <span
                                    className={`fw-bold ${activeStep === 1 ? 'text-primary' : activeStep > 1 ? 'text-success' : 'text-muted'}`}
                                >
                                    1. Review
                                </span>
                                <span className='px-3 text-muted'><i className='fas fa-greater-than'></i></span>
                                <span
                                    className={` fw-bold ${activeStep === 2 ? 'text-primary fw-bold' : activeStep > 2 ? 'text-success' : 'text-muted'}`}
                                >
                                    2. Travellers
                                </span>
                                <span className='px-3 text-muted'><i className='fas fa-greater-than'></i></span>
                                <span
                                    className={` fw-bold ${activeStep === 3 ? 'text-primary fw-bold' : 'text-muted'}`}
                                >
                                    3. Payment
                                </span>
                            </h6>
                        </div>

                        {
                            (activeStep === 2 || activeStep === 3) &&
                            (

                                <div style={{ color: 'var(--main-color)' }} className='fw-semibold fs-4 ml-lg-3   '>Complete your booking</div>
                            )

                        }
                        <div className='col-lg-12  gap-4 d-lg-flex align-content-center justify-content-between p-0'>
                            {/* <div className={`col-lg-8 ${ responseData1 &&  responseData1?.Carrier === '6E' ? 'd-none' : 'd-block'} p-0 mb-4 col-sm-12 col-md-12`}> */}
                            <div className="col-lg-8 p-0 mb-4 col-sm-12 col-md-12">
                                {activeStep === 1 &&
                                    <div className=''>
                                        {/* <div className='bg-white card rounded tour_details_boxed'> */}
                                        <div className="bg-white card rounded tour_details_boxed">


                                            <div className='flight-detail-depart text-start'>
                                                <h6><i className='fas fa-plane-departure me-3'></i> <span className=' text-dark'>Flight Detail</span></h6>
                                            </div>
                                            <div className='p-3'>
                                                <div className=''>
                                                    <div className='row'>
                                                        <div className='col-lg-12'>
                                                            <div className='depart-text'>
                                                                <span className=''>DEPART</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row mt-3 pl-3'>
                                                        <div className='col-lg-12'>
                                                            <div className='from-to-detail text-start'>
                                                                <span className='' ><ImAirplane style={{ rotate: '90deg' }} className='me-3' size={28} />
                                                                    <span className='h5'>{getAirportDataByCountry(originCity, 'city')} - {getAirportDataByCountry(destinationCity, 'city')} | </span>
                                                                    <span className='text-muted'>{formatedate}</span>

                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {
                                                        responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} bookingClass={bookingCLASS} flight_type='GDS-ONWARD' statusRefund={matchedSolution} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                    }


                                                </div>

                                            </div>
                                            <div className='text-start align-items-center justify-content-start pt-0'>
                                                {
                                                    responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution} origin={originCity} destination={destinationCity} segmentData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} trip={responseData1 && responseData1?.trip} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                }

                                            </div>

                                            {responseData1?.trip_type === "roundtrip" &&
                                                responseData1?.trip === "D" &&
                                                responseData1?.responseData &&
                                                responseData1?.responseData1 && (

                                                    <div className='mt-4'>

                                                        <div className='p-3'>
                                                            <div className=''>
                                                                <div className='row'>
                                                                    <div className='col-lg-12'>
                                                                        <div className='depart-text'>
                                                                            <span className=''>Return</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='row mt-3 pl-3'>

                                                                    <div className='col-lg-12'>

                                                                        <div className='from-to-detail text-start'>
                                                                            <span className='' ><ImAirplane className='me-3' size={28} />
                                                                                <span className='h5'>{getAirportDataByCountry(destinationCity, 'city')} - {getAirportDataByCountry(originCity, 'city')} | </span>

                                                                                <span className='text-muted'>{formatedateRetun || 'day-dd/mm/yyyy'}</span>


                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {
                                                                    responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary} bookingClass={bookingCLASS1} flight_type={responseData1.trip === 'I' && responseData1.trip_type === 'roundtrip' ? '' : 'GDS-ONWARD'} statusRefund={matchedSolution} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                                }


                                                            </div>

                                                        </div>

                                                        <div className='text-start align-items-center justify-content-start py-3 pt-0'>
                                                            {
                                                                responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution1} origin={destinationCity} destination={originCity} segmentData={responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary} trip={responseData1 && responseData1?.trip} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {responseData1?.trip_type === "roundtrip" &&
                                                responseData1?.trip === "I" &&
                                                responseData1?.responseData && (

                                                    <div className='mt-4'>

                                                        <div className='p-3'>
                                                            <div className=''>
                                                                <div className='row'>
                                                                    <div className='col-lg-12'>
                                                                        <div className='depart-text'>
                                                                            <span className=''>Return</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='row mt-3 pl-3'>

                                                                    <div className='col-lg-12'>

                                                                        <div className='from-to-detail text-start'>
                                                                            <span className='' ><ImAirplane className='me-3' size={28} />
                                                                                <span className='h5'>{getAirportDataByCountry(destinationCity, 'city')} - {getAirportDataByCountry(originCity, 'city')} | </span>

                                                                                <span className='text-muted'>{formatedateRetun || 'day-dd/mm/yyyy'}</span>


                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {
                                                                    responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} bookingClass={bookingCLASS1} flight_type="GDS-RETURN" statusRefund={matchedSolution} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                                }


                                                            </div>

                                                        </div>

                                                        <div className='text-start align-items-center justify-content-start py-3 pt-0'>
                                                            {
                                                                responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution} origin={destinationCity} destination={originCity} segmentData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} trip={responseData1 && responseData1?.trip} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }




                                        </div>
                                        <div className=' p-0 mt-3'>
                                            <FlightReviewBottom departCity={originCity} arriveCity={destinationCity} />
                                        </div>
                                        <div className='tour_details_boxed card text-start'>
                                            <TravellersDetails noOfAdults={responseData1?.travellers?.noOfAdults} noOfChildren={responseData1?.travellers?.noOfChilds} noOfInfants={responseData1?.travellers?.noOfInfants} goToStep={goToStep} onContinue={handlePassengersData} existingData={passangerData} triptype={responseData1?.trip_type} apiType={flightType} trips={responseData1?.trip} apiType1={flightType1} />
                                        </div>
                                    </div>
                                }

                                {
                                    (activeStep === 2 || activeStep === 3) &&
                                    <>
                                        <div className='col-12 col-sm-12 col-md-8 p-0 col-lg-12'>
                                            {/* <span className='fw-semibold fs-4 mb-5 text-muted '>Complete your booking</span> */}
                                            <Row className="justify-content-center">
                                                <Col lg={12}>


                                                    <>

                                                        <Card className="mb-3 p-3 tour_details_boxed ">
                                                            <div className="d-flex justify-content-between">
                                                                <span className='fs-6 fw-bold'>Flights Summary <span style={{ fontSize: '12px' }} className='text-muted fw-normal'>{responseData1?.trip_type === 'roundtrip' ? 'Onward' : ''}</span></span>
                                                                <button onClick={() => goToStep(1)} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-caret-down"></i></button>
                                                            </div>

                                                            <div className='d-flex align-items-center'>
                                                                <div className='text-start fs-6 fw-semibold text-muted me-2'><i className='fas fa-plane-departure text-primary me-3'></i>{getAirportDataByCountry(originCity, 'city')} → {getAirportDataByCountry(destinationCity, 'city')}</div>
                                                                <div className='text-start fs-8 fw-normal text-muted'>{formatedate} · {stopFlight}{flightType === 'Amadeus' ? "-Stop" : ""} · {timeDuration}</div>
                                                            </div>

                                                            <div className=''>
                                                                {
                                                                    responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} bookingClass={bookingCLASS} flight_type="GDS-ONWARD" statusRefund={matchedSolution} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                                }
                                                            </div>
                                                            <div className='text-start align-items-center justify-content-start my-2'>
                                                                {
                                                                    responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution} origin={originCity} destination={destinationCity} segmentData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} trip={responseData1 && responseData1?.trip} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                                }
                                                            </div>
                                                        </Card>


                                                        {
                                                            responseData1 && (responseData1?.trip_type === 'roundtrip' && responseData1?.trip === "D") && (
                                                                <Card className=" bg-white tour_details_boxed">
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className='fs-6 fw-bold'>Flights Summary <span style={{ fontSize: '12px' }} className='text-muted fw-normal'>Return</span></span>
                                                                        <button onClick={() => goToStep(1)} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-caret-down"></i></button>
                                                                    </div>

                                                                    <div className='d-flex align-items-center'>
                                                                        <div className='text-start fs-6 fw-semibold text-muted me-2'><i className='fas fa-plane-departure text-primary me-3'></i>{getAirportDataByCountry(destinationCity, 'city')} → {getAirportDataByCountry(originCity, 'city')}</div>
                                                                        <div className='text-start fs-8 fw-normal text-muted'>{formatedateRetun} · {stopFlight1}{flightType === 'Amadeus' ? "-Stop" : "-Stop"} · {timeDuration1}</div>
                                                                    </div>

                                                                    {
                                                                        responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary} bookingClass={bookingCLASS1} flight_type='GDS-ONWARD' statusRefund={matchedSolution1} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                                    }

                                                                    <div className='text-start align-items-center justify-content-start py-3 pt-0'>
                                                                        {
                                                                            responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution1} origin={destinationCity} destination={originCity} segmentData={responseData1 && responseData1?.responseData1 && responseData1?.responseData1?.AirItinerary} trip={responseData1 && responseData1?.trip} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                                        }
                                                                    </div>
                                                                </Card>
                                                            )
                                                        }

                                                        {responseData1?.trip_type === "roundtrip" &&
                                                            responseData1?.trip === "I" &&
                                                            responseData1?.responseData && (
                                                                <Card className=" bg-white tour_details_boxed">
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className='fs-6 fw-bold'>Flights Summary <span style={{ fontSize: '12px' }} className='text-muted fw-normal'>Return</span></span>
                                                                        <button onClick={() => goToStep(1)} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-caret-down"></i></button>
                                                                    </div>

                                                                    <div className='d-flex align-items-center'>
                                                                        <div className='text-start fs-6 fw-semibold text-muted me-2'><i className='fas fa-plane-departure text-primary me-3'></i>{getAirportDataByCountry(destinationCity, 'city')} → {getAirportDataByCountry(originCity, 'city')}</div>
                                                                        <div className='text-start fs-8 fw-normal text-muted'>{formatedateRetun} · {stopFlight1}{flightType === 'Amadeus' ? "-Stop" : "-Stop"} · {timeDuration1}</div>
                                                                    </div>

                                                                    {
                                                                        responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FLightreviewdetails formData={responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary} bookingClass={bookingCLASS1} flight_type="GDS-RETURN" statusRefund={matchedSolution} />) : (<FLightreviewdetails formData={responseData1 && responseData1?.result && responseData1?.result.itineraryDetails} />)
                                                                    }

                                                                    <div className='text-start align-items-center justify-content-start py-3 pt-0'>
                                                                        {
                                                                            responseData1 && responseData1?.responseData && responseData1?.responseData?.AirItinerary ? (<FlightReviewDetail responseData={matchedSolution} origin={destinationCity} destination={originCity} />) : (<FlightReviewDetail responseData={responseData?.flightOptions?.AirPricingResponse[0]} />)

                                                                        }
                                                                    </div>
                                                                </Card>
                                                            )
                                                        }


                                                    </>






                                                    <Card className=" tour_details_boxed">
                                                        <div className="d-flex justify-content-between">
                                                            <span className='fs-6 fw-bold'>Traveller Details</span>
                                                            <button onClick={EditPassanger} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-pen-to-square"></i></button>
                                                        </div>
                                                        <div>
                                                            {flightType === 'Galileo' && passangerData && (
                                                                <>
                                                                    <div className="text-black text-start fw-semibold">Email: <span className="text-muted">{passangerData.CustomerInfo.Email}</span></div>
                                                                    <div className="fw-semibold text-start text-black">Contact No: <span className="text-muted">{passangerData.CustomerInfo.Mobile}</span></div>
                                                                    <div className="d-flex align-items-center">
                                                                        {passangerData.CustomerInfo.PassengerDetails.map((passenger, index) => (
                                                                            <div key={index} className="text-start fs-8 fw-normal text-muted">
                                                                                <span>{passenger.FirstName} {passenger.LastName} - <strong>({getPassangerPaxtye(passenger.PaxType)})</strong></span>
                                                                                {index < passangerData.CustomerInfo.PassengerDetails.length - 1 ? ',' : ''}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}

                                                            {flightType === 'Amadeus' && passangerData && (
                                                                <>
                                                                    <div className="text-black text-start fw-semibold">Email: <span className="text-muted">{passangerData.CustomerInfo.Email}</span></div>
                                                                    <div className="fw-semibold text-start text-black">Contact No: <span className="text-muted">{passangerData.CustomerInfo.Mobile}</span></div>
                                                                    <div className="d-flex align-items-center">
                                                                        {passangerData.CustomerInfo.PassengerDetails.map((traveler, index) => (
                                                                            <div key={traveler.id} className="text-start fs-8 fw-normal text-muted">
                                                                                <span>{traveler.name.firstName} {traveler.name.lastName} - <strong>({traveler.gender})</strong></span>
                                                                                {index < passangerData.length - 1 ? ',' : ''}
                                                                                {index < passangerData.CustomerInfo.PassengerDetails.length - 1 ? ',' : ''}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                    </Card>

                                                    {
                                                        activeStep === 3 &&
                                                        <>
                                                            <Card className="tour_details_boxed">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>


                                                                        <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                            <span className='fs-6 fw-bold'>Seats</span>
                                                                            <span style={{ fontSize: '13px' }} className='d-flex flex-wrap'>
                                                                                <strong>Departure :</strong>
                                                                                {selectSeat ? (
                                                                                    Object.entries(getSeatCodes(selectSeat)).map(([origin, seats]) => (
                                                                                        <span key={origin}>
                                                                                            <strong> {origin}:</strong> {seats.length > 0 ? seats.join(", ") : "Not Assigned"}
                                                                                        </span>
                                                                                    ))
                                                                                ) : "Not Assigned"}

                                                                                {responseData1 && responseData1.trip_type === "roundtrip" && (
                                                                                    <span className=''>
                                                                                        <strong> Return:</strong>
                                                                                        {selectSeat1 ? (
                                                                                            Object.entries(getSeatCodes(selectSeat1)).map(([origin, seats]) => (
                                                                                                <span key={origin}>
                                                                                                    <strong> {origin}:</strong> {seats.length > 0 ? seats.join(", ") : "Not Assigned"}
                                                                                                </span>
                                                                                            ))
                                                                                        ) : "Not Assigned"}
                                                                                    </span>
                                                                                )}

                                                                            </span>
                                                                        </div>

                                                                        {
                                                                            selectedBaggage && (
                                                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                                    <span className='fs-6 fw-bold'>Baggage</span>
                                                                                    <span style={{ fontSize: '13px' }} className='d-flex flex-wrap'>
                                                                                        1 Bag Added
                                                                                    </span>
                                                                                </div>

                                                                            )
                                                                        }
                                                                    </div>

                                                                    <button onClick={() => goToStep(2)} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-pen-to-square"></i></button>
                                                                </div>
                                                            </Card>
                                                            {
                                                                user && user?.users.id ? null :
                                                                    <Card className="tour_details_boxed">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className=' d-flex align-items-center justify-content-lg-start'>
                                                                                <img style={{ width: '80px', height: '70px' }} className='me-4' src="https://www.shutterstock.com/image-vector/limited-offer-banner-sale-clock-600nw-1912324219.jpg" alt="visa" />
                                                                                <div className='inline-block row'>

                                                                                    <span className='text-start fw-medium text-primary fs-4'>Get additional discounts</span>
                                                                                    <span className='fs-6 text-muted text-start'>LOGIN TO ACCESS SAVED PAYMENTS AND DISCOUNTS!</span>
                                                                                </div>
                                                                            </div>

                                                                            <Link to="/login/user-login">

                                                                                <button type="button" className="btn gap-2 fs-6 fw-medium d-flex justify-content-between align-items-center px-3 btn-primary">Login </button>
                                                                            </Link>

                                                                        </div>
                                                                    </Card>

                                                            }



                                                            {/* <PaymentMethod totalAmt={grandTotal} /> */}


                                                            <Card className="tour_details_boxed">
                                                                <div className={`${user && user?.users?.role === 2 ? 'd-flex' : 'd-none'}  justify-content-between align-items-center gap-3 w-100`}>
                                                                    <RadioGroup
                                                                        row
                                                                        name="priceOption"
                                                                        value={selectedOption}
                                                                        onChange={handleChange}
                                                                    >
                                                                        <FormControlLabel
                                                                            value="withPrice"
                                                                            control={<Radio />}
                                                                            label="With Price"
                                                                        />
                                                                        <FormControlLabel
                                                                            value="withoutPrice"
                                                                            control={<Radio />}
                                                                            label="Without Price"
                                                                        />
                                                                    </RadioGroup>

                                                                    <TextField
                                                                        type="number"
                                                                        label="Markup"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={markup}
                                                                        onChange={handleMarkupChange}
                                                                        style={{ width: "120px" }}
                                                                    />
                                                                </div>
                                                                <div className='mt-2 d-flex flex-column flex-md-row justify-content-between gap-2'>
                                                                    <div className='d-flex justify-content-between align-items-center flex-wrap"'>
                                                                        <span className='fw-bold fs-4'>Total Fare: <span className='text-danger'>{responseData && responseData.currency && responseData.currency.currency_symbol} {(totalFlgithAmt + AdditionCharge)}</span></span>
                                                                    </div>
                                                                    <div className="d-flex flex-column flex-md-row gap-2 mt-3 mt-lg-0">

                                                                        {!(responseData1?.trip === "D" && responseData1?.trip_type === "roundtrip") && isAfterThreeDays(formatedate, carrierCode) && (
                                                                            <button onClick={() => handleBooking(TransactionID, flightType, selectSeat, passangerData, galileoData, totalFlgithAmt, selectSeat1, TransactionID1, passangerData1, galileoData1, responseData1?.flightFare, responseData1.trip, responseData1.trip_type, responseData1, responseData1 && responseData1?.travellers, discountedPrice, matchedSolution, matchedSolution1, responseData?.HostToken, "WithoutWailet", AdditionCharge)} disabled={
                                                                                user &&
                                                                                user?.users?.role === 2 &&
                                                                                ((responseData1?.trip === 'D' && walletAmout <= 100) ||
                                                                                    (responseData1?.trip === 'I' && walletAmout <= 200))
                                                                            } className={`btn ${user && user?.users?.role === 2 ? 'd-flex' : 'd-none'} btn-warning`}>{responseData1?.trip === 'I' && 'Hold With Wallet - ₹200'}
                                                                                {responseData1?.trip === 'D' && 'Hold With Wallet - ₹100'}
                                                                            </button>
                                                                        )
                                                                        }


                                                                        <button disabled={user && user?.users?.role === 2 && walletAmout <= totalFlgithAmt} onClick={() => handleBooking(TransactionID, flightType, selectSeat, passangerData, galileoData, Number((totalFlgithAmt + AdditionCharge).toFixed(2)), selectSeat1, TransactionID1, passangerData1, galileoData1, responseData1?.flightFare, responseData1.trip, responseData1.trip_type, responseData1, responseData1 && responseData1?.travellers, discountedPrice, matchedSolution, matchedSolution1, responseData?.HostToken, {}, AdditionCharge)} className='btn btn-warning'>{user && user?.users.role === 2 ? 'Pay with WT wallet' : 'Make payment'}</button>
                                                                    </div>
                                                                </div>
                                                            </Card>


                                                        </>

                                                    }

                                                </Col>
                                            </Row>
                                            {
                                                flightType === 'Galileo' && activeStep === 2 &&
                                                <>



                                                    <div className="tour_details_boxed text-start card">
                                                        <div className="d-flex justify-content-between mb-4">
                                                            <span className='fs-6 ml-1 ml-lg-0 fw-bold'>Select your seat</span>
                                                            {/* <button onClick={EditPassanger} type="button" className="btn btn-link"><i className="fa-solid text-primary fa-pen-to-square"></i></button> */}
                                                        </div>
                                                        <div className="accordion" id="accordionExample">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingOne">
                                                                    <div className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                        <h6 className='d-block align-items-center justify-content-start gap-3'>
                                                                            <div className=' align-items-center d-none d-lg-flex'>
                                                                                <ImAirplane style={{ rotate: '90deg' }} className='me-3' size={28} />
                                                                                {getAirportDataByCountry(originCity, "city")} <strong>( {originCity} )</strong> - {getAirportDataByCountry(destinationCity, "city")} <strong>( {destinationCity} )</strong>
                                                                            </div>

                                                                            <div className=' align-items-center d-flex d-lg-none' style={{ fontSize: "12px" }}>
                                                                                <ImAirplane style={{ rotate: '90deg' }} className='me-3' size={20} />
                                                                                {getAirportDataByCountry(originCity, "city")} <strong>( {originCity} )</strong> - {getAirportDataByCountry(destinationCity, "city")} <strong>( {destinationCity} )</strong>
                                                                            </div>
                                                                            <div className='text-muted fs-6 mt-2'>
                                                                                <div className='text-start fs-8 fw-normal text-muted'>
                                                                                    {formatedate} · {stopFlight}{flightType === 'Amadeus' ? "-Stop" : ""} · {timeDuration}
                                                                                </div>
                                                                            </div>
                                                                        </h6>
                                                                    </div>
                                                                </h2>
                                                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                                    <Meal goToStep={goToStep} responseData={responseData1?.responseData} flightType={flightType} noOfAdults={responseData1?.travellers?.noOfAdults} noOfChildren={responseData1?.travellers?.noOfChilds} sea={seatMaps} seat={seatMap} optionservice={optionservice} selectSeat={selectSeat} setSelectSeat={setSelectSeat} setOtherCharge={setOtherCharge} />
                                                                </div>
                                                            </div>
                                                            {

                                                                responseData1 && responseData1.trip_type === "roundtrip" && (
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="headingTwo">
                                                                            <div className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                                <h6 className='d-block align-items-center justify-content-start gap-3'>
                                                                                    <div className='align-items-center d-none d-lg-flex'>
                                                                                        <ImAirplane className='me-3' size={28} />
                                                                                        {getAirportDataByCountry(destinationCity, "city")} <strong>( {destinationCity} )</strong> - {getAirportDataByCountry(originCity, "city")} <strong>( {originCity} )</strong>
                                                                                    </div>

                                                                                    <div className=' align-items-center d-flex d-lg-none' style={{ fontSize: "13px" }}>
                                                                                        <ImAirplane className='me-3' size={20} />
                                                                                        {getAirportDataByCountry(destinationCity, "city")} <strong>( {destinationCity} )</strong> - {getAirportDataByCountry(originCity, "city")} <strong>( {originCity} )</strong>
                                                                                    </div>
                                                                                    <div className='text-muted fs-6 mt-2'>
                                                                                        <div className='text-start fs-8 fw-normal text-muted'>
                                                                                            {formatedateRetun || 'day-dd/mm/yyyy'} · {stopFlight1}{flightType === 'Amadeus' ? "-Stop" : ""} · {timeDuration1}
                                                                                        </div>
                                                                                    </div>
                                                                                </h6>
                                                                            </div>
                                                                        </h2>
                                                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                                            <Meal goToStep={goToStep} responseData={responseData1 && responseData1.trip === 'I' && responseData1.trip_type === 'roundtrip' ? seatSegmentRt : responseData1?.responseData1} flightType={flightType} noOfAdults={responseData1?.travellers?.noOfAdults} noOfChildren={responseData1?.travellers?.noOfChilds} sea={seatMaps1} seat={seatMap1} optionservice={optionservice} selectSeat={selectSeat1} setSelectSeat={setSelectSeat1} setOtherCharge={setOtherCharge1} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }

                                                        </div>

                                                    </div>


                                                </>
                                            }
                                        </div>
                                    </>
                                }

                                {
                                    activeStep === 2 && (
                                        <>

                                            <div className="pb-2 bg-white d-flex align-items-center mt-4 p-4 justify-content-between">
                                                <button
                                                    type="button"
                                                    style={{ background: '#295c60' }}
                                                    className="btn text-white p-2 px-4 fs-6"
                                                    onClick={() => {
                                                        const currentAccordion = document.getElementById('collapseOne');
                                                        const nextAccordion = document.getElementById('collapseTwo');

                                                        if (responseData1?.trip_type === "roundtrip") {
                                                            if (nextAccordion && nextAccordion.classList.contains('show')) {
                                                                // If the second accordion (return trip) is already open, go to step 3
                                                                goToStep(3);
                                                            } else {
                                                                // Handle logic for switching accordions in roundtrip
                                                                if (currentAccordion && currentAccordion.classList.contains('show')) {
                                                                    currentAccordion.classList.remove('show'); // Close the first accordion
                                                                }
                                                                if (nextAccordion) {
                                                                    nextAccordion.classList.add('show'); // Open the second accordion
                                                                }
                                                            }
                                                        } else {
                                                            // Handle oneway trip logic
                                                            goToStep(3); // Move to the next step directly
                                                        }
                                                    }}
                                                >
                                                    Continue
                                                </button>

                                                <button onClick={() => goToStep(3)} className=' border-0 bg-transparent btn-link'>
                                                    Skips to payment
                                                </button>

                                            </div>
                                        </>
                                    )
                                }
                            </div>

                            <div div className='col-lg-4 d-none d-md-block l-md-12 p-0 mt-4'>
                                <PaymentSummary
                                    noOfAdults={noOfAdults}
                                    noOfChildren={noOfChildren}
                                    noOfInfants={noOfInfants}
                                    responseData={responseData}
                                    responseData1={responseData1}
                                    activeStep={activeStep}
                                    othercharges={othercharges}
                                    othercharges1={othercharges1}
                                    adultPrice={adultPrice}
                                    adultPrice2={adultPrice2}
                                    childPrice={childPrice}
                                    childPrice2={childPrice2}
                                    totalTaxes={totalTaxes}
                                    totalTaxes2={totalTaxes2}
                                    discountedPrice={discountedPrice}
                                    grandTotal={grandTotal}
                                    grandTotal2={grandTotal2}
                                    user={user}
                                    couponOption={couponOption}
                                    selectedCoupon={selectedCoupon}
                                    typedCoupon={typedCoupon}
                                    handleCouponChange={handleCouponChange}
                                    handleApplyCoupon={handleApplyCoupon}
                                    warningMessage={warningMessage}
                                    discountMessage={discountMessage}
                                    visibleCoupons={visibleCoupons}
                                    isCouponActive={isCouponActive}
                                    handleClearCoupon={handleClearCoupon}
                                    infantPrice={infantPrice}
                                    infantPrice2={infantPrice2}
                                    convenienceFee={convenienceFee}
                                    handleCouponSelect={handleCouponSelect}
                                    setShowAll={setShowAll}
                                    showAll={showAll}
                                    isGreenChipsUsed={isGreenChipsUsed}
                                    greenChipsPrice={greenChipsPrice}
                                    walletAmout={walletAmout}
                                    handleRadioChange={handleRadioChange}
                                    greenchipsamt={greenchipsamt}
                                    tripType={responseData1?.trip_type}
                                    trip={responseData1?.trip}
                                    usechipsamt1={usechipsamt1}
                                    AdditionCharge={AdditionCharge}
                                    usechipsamt={usechipsamt}
                                />
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <SeatModal modalVisible={modalVisible} setModalVisible={setModalVisible} goToStep={goToStep} data={passangerData} data1={passangerData1} flightType={flightType} setSeatMaps={setSeatMaps} setSeatMap={setSeatMap} seatMaps={seatMaps} seatMap={seatMap} setOptionalService={setOptionalService} optionservice={optionservice} setSeatMaps1={setSeatMaps1} setSeatMap1={setSeatMap1} seatMap1={seatMap1} />

        </>
    )
}


export default FlightReview
