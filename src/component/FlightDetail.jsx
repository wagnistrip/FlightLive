import { useEffect, useRef, useState } from 'react'
import './FlightDetail.css'
import FlightFom from './FlightFom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FareDetails from './FareDetails';
import ReactSlider from 'react-slider';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { galileoApi } from '../Api/apiService';
import FlightCard from './RoundTrip/FlightCard';
import { PiAirplaneTakeoffLight, PiAirplaneInFlight } from "react-icons/pi";
import BottomNavbar from './RoundTrip/BottomNavbar';
import LoadingBar from 'react-top-loading-bar';
import { filterFlights, filterGalileoData, filterGalileoDataIntern, formatDate, getAirlineName, getAirportDataByCountry, getImageUrl1, matchSegmentsWithHostToken, matchWithHostToken, processFlightData, timeRangeData, timeRanges } from '../utils/airlineUtils';
import { FaRegEdit } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import errorimg from '../../src/image/errorpage.png'
import { FaFilter } from "react-icons/fa";
import TimeRangeSelector from './TimeRangeSelector';
import Offer from './Offer';
import { useDispatch, useSelector } from 'react-redux';
import { setCommonPrice, setModalvisible } from '../redux/actions/bookingActions';
import { useMediaQuery } from '@mui/material';
import InternationCard from './RoundTrip/InternationCard';
import LoadingPage from '../LoadingPage';
import CommonFlightCard from './CommonFlightCard';
import LoadingSlicer from './LoadingSlicer';
import Commonmobilecard from './Commonmobilecard';
function FlightDetail() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const refd = useRef(null);
    const [openCardIndex, setOpenCardIndex] = useState(null);
    const toggleFlightDetails = (index) => {
        setOpenCardIndex(openCardIndex === index ? null : index);
    };
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const bookingStatus = useSelector((state) => state.booking.bookingStatus);
    const fareDetails = useSelector((state) => state.booking.fareDetails);
    const user = useSelector((state) => state.auth.user);
    const modalvisible = useSelector((state) => state.booking.modalvisible);
    const location = useLocation();
    const responseData = location.state?.responseData;
    if (!responseData) {
        // Render a loading or fallback UI if responseData is missing
        return <div>Loading...</div>;
    }
    console.log("response data : ", responseData);
    const formData = responseData;
    const [departCity, setDepartCity] = useState("New Delhi");
    const [arriveCity, setArrivalCity] = useState("Mumbai");
    const [nonStop, setNonStop] = useState(false);
    const [stops, setStops] = useState(null);
    const [stops1, setStops1] = useState(null);
    const [passangerData, setPassangerData] = useState(null);
    const [carrierCodes, setCarrierCodes] = useState([]);
    const [loadingcompon, setloadingcompon] = useState(false);
    const [selectedAirlines, setSelectedAirlines] = useState(carrierCodes.map(({ code }) => code));
    let depar_date;
    let inputDate;
    const data = JSON.parse(localStorage.getItem('formData'));
    const [flightData, setFlightData] = useState([]);
    const [flightDataInt, setFlightDataInt] = useState([]);
    const [flightData1, setFlightData1] = useState([]);
    const [values, setValues] = useState([0, 0]);
    const [minPrice, setMinprice] = useState(0);
    const [maxPrice, setMaxpric] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const MAX_VISIBLE_CARRIERS = 4;
    const visibleCarriers = showMore ? carrierCodes : carrierCodes.slice(0, MAX_VISIBLE_CARRIERS);
    useEffect(() => {
        if (responseData?.galileo) {
            // Check if the trip type is 'oneway'
            if (responseData.tripType === 'oneway') {
                // Check if there is a fault in the response
                if (responseData?.galileo === 'undefined') {
                    console.error("No availability for oneway flight");
                    setFlightData([]); // Set to null if no availability
                } else if (responseData && responseData?.galileo === undefined) {
                    console.error("No availability for oneway flight");
                    setFlightData([]); // Set to null if no availability
                } else {
                    // alert('Raushan')
                    // Process valid data
                    const processedData = processFlightData(responseData.galileo);
                    setFlightData(processedData);
                }
            }
            // Check if trip type is roundtrip and response contains multiple datasets
            else if (responseData?.trip === 'D' && responseData.galileo.length > 1) {
                const [firstResponse, secondResponse] = responseData.galileo;
                // Check availability for the first dataset
                const processedData =
                    firstResponse?.Fault?.faultstring === "NO AVAILABILITY FOR THIS REQUEST"
                        ? []
                        : processFlightData(firstResponse.LowFareSearchRsp);

                // Check availability for the second dataset
                const processedData1 =
                    secondResponse?.Fault?.faultstring === "NO AVAILABILITY FOR THIS REQUEST"
                        ? []
                        : processFlightData(secondResponse.LowFareSearchRsp);

                // Update state for both datasets
                setFlightData(processedData);
                setFlightData1(processedData1);
            }
            // Handle case when only one dataset exists
            else if (responseData.galileo.length === 1) {
                const firstResponse = responseData.galileo[0];

                // Check availability for the single dataset
                if (
                    firstResponse?.Fault?.faultstring === "NO AVAILABILITY FOR THIS REQUEST"
                ) {
                    console.error("No availability for single dataset in roundtrip");
                    setFlightData(null); // Set to null if no availability
                    setFlightData1([]);  // Clear second dataset
                } else {
                    const processedData = processFlightData(firstResponse.LowFareSearchRsp);
                    setFlightData(processedData);
                    setFlightData1([]); // Clear the second dataset if only one exists
                }
            }
            else if (responseData.tripType === 'roundtrip' && responseData.trip === 'I') {
                if (responseData && responseData.galileo && responseData?.galileo.length > 0) {
                    setFlightData([]);
                    setFlightData1([]);
                    setFlightDataInt(responseData?.galileo)
                } else {
                    setFlightData([]);
                    setFlightData1([]);
                    setFlightDataInt([])
                }
            }
            // Handle case when galileo is empty
            else {
                console.error("No data available in responseData.galileo");
                setFlightData([]);
                setFlightData1([]);
                setFlightDataInt([])
            }
        }
        else {
            setFlightData([]);
        }
    }, [responseData]);

    // console.log("merge data ", flightData);
    depar_date = data.returnDate;
    inputDate = data.departureDate

    useEffect(() => {
        const searchdata = localStorage.getItem('formData');
        if (searchdata) {
            const parsedData = JSON.parse(searchdata);
            const arrivalData = getAirportDataByCountry(parsedData?.arrival, "city");
            const departureData = getAirportDataByCountry(parsedData?.departure, "city");
            setDepartCity(departureData)
            setArrivalCity(arrivalData);
            setPassangerData(parsedData);
        }
        let amadeusCarriers = [];
        if (responseData.tripType === 'oneway') {
            const flightDetails = formData?.amadeus || [];
            amadeusCarriers = flightDetails.map(flight => {
                const companyid = Array.isArray(flight.flights.flightDetails) ? flight.flights.flightDetails : [flight.flights.flightDetails]
                const marketingCarrier = companyid?.[0]?.flightInformation?.companyId.marketingCarrier || 'NA';
                const priceAmount = flight?.recommendations?.recPriceInfo?.monetaryDetail[0]?.amount || "0";
                const priceAmount1 = flight?.recommendations?.recPriceInfo?.monetaryDetail[1]?.amount || "0";
                const price = parseFloat(priceAmount) + parseFloat(priceAmount1);
                const totalPrice = Math.round(price);

                return {
                    code: marketingCarrier,
                    price: totalPrice,
                };
            }) || [];


        }
        else if (responseData.trip_type === 'roundtrip') {
            const extractCarrierCodes = (flights) => {
                return flights?.flatMap(flight =>
                    flight?.itineraries?.flatMap(itinerary =>
                        itinerary?.segments?.map(segment => ({
                            code: segment?.carrierCode,
                            price: parseFloat(flight.price.grandTotal)
                        }))
                    )
                ) || [];
            };

            const arrivalCarriers = extractCarrierCodes(formData?.amadeus?.amadeus_arrival?.data);
            const departureCarriers = extractCarrierCodes(formData?.amadeus?.amadeus_departure?.data);

            amadeusCarriers = [...arrivalCarriers, ...departureCarriers];

            console.log(amadeusCarriers);
        }



        let galileoCarriers = [];
        // Extract carrier codes and prices from Galileo data only if Availibilities is not null or undefined

        if (responseData.tripType === 'oneway') {
            if (formData?.galileo && formData?.galileo?.AirPricePointList) {
                galileoCarriers = flightData.length > 0 && flightData.map(flight => ({
                    code: flight?.segments[0]["@attributes"].Carrier,
                    price: parseFloat(flight?.PricingInfos["@attributes"].ApproximateTotalPrice.replace('INR', ''))
                })) || [];
            }
        }
        else if (responseData.tripType === 'roundtrip' && responseData.trip === 'D') {
            // if (formData?.galileo && formData?.galileo[1].LowFareSearchRsp.AirPricePointList) {
            if (flightData1) {
                // Combine departure and arrival flights
                const combinedFlights = [...flightData, ...flightData1];

                galileoCarriers = combinedFlights.length > 0
                    ? combinedFlights.map(flight => ({
                        code: flight?.segments[0]["@attributes"].Carrier,
                        price: parseFloat(flight?.PricingInfos["@attributes"].ApproximateTotalPrice.replace('INR', '')),
                    }))
                    : [];
            }
        }

        else if (responseData.tripType === 'roundtrip' && responseData.trip === 'I') {
            if (flightDataInt) {
                const combinedFlights = [...flightDataInt];
                galileoCarriers = [];

                combinedFlights.forEach(flight => {
                    const onwardCarrier = flight?.onwardsegments?.[0]?.[0]?.["@attributes"]?.Carrier;
                    const returnCarrier = flight?.returnsegments?.[0]?.[0]?.["@attributes"]?.Carrier;
                    const price = parseFloat(flight?.PricingInfos?.["@attributes"]?.ApproximateTotalPrice.replace('INR', ''));

                    // Add onward carrier
                    if (onwardCarrier) {
                        galileoCarriers.push({ code: onwardCarrier, price });
                    }

                    // Add return carrier only if it's different
                    if (returnCarrier && returnCarrier !== onwardCarrier) {
                        galileoCarriers.push({ code: returnCarrier, price });
                    }
                });
            }
        }
        // Combine Amadeus and Galileo data
        const combinedCarriers = [...amadeusCarriers, ...galileoCarriers];

        // Create a map to store the minimum price for each carrier code
        const carrierPriceMap = new Map();
        combinedCarriers.forEach(({ code, price }) => {
            if (!carrierPriceMap.has(code) || price < carrierPriceMap.get(code)) {
                carrierPriceMap.set(code, price);
            }
        });

        // Convert the map to an array and sort by price
        const sortedCarriers = Array.from(carrierPriceMap.entries())
            .map(([code, price]) => ({ code, price }))
            .sort((a, b) => a.price - b.price);

        setCarrierCodes(sortedCarriers);
    }, [formData, responseData, flightData, flightData1]);

    // amadues flight booking function

    const bookFlightGAL = async (data, travellers, price, trip, flightFare, hosttokedata, tripType) => {

        // return;
        const carriercode = data?.segments[0]["@attributes"].Carrier || '';
        refd.current.continuousStart();
        const pricehost = Array.isArray(data?.PricingInfos.AirPricingInfo) ? data?.PricingInfos.AirPricingInfo[0] : data?.PricingInfos.AirPricingInfo
        const data1 = pricehost?.FlightOptionsList?.FlightOption;
        const hostdetails = Array.isArray(data1?.Option) ? data1.Option : [data1?.Option];
        const segmentdata = data.segments
        const matchedSegments = matchSegmentsWithHostToken(hostdetails, segmentdata);
        const pricingModifiers = carriercode === "6E"
            ? data && data?.airFareInfolist.map(item => ({
                key: item["@attributes"].Key,
                FareBasisCode: item["@attributes"].FareBasis
            }))
            : [];
        const hosttokematch = matchWithHostToken(hosttokedata && hosttokedata[0] && hosttokedata[0]?.original && hosttokedata[0]?.original?.common_v52_0_HostToken ? hosttokedata[0]?.original?.common_v52_0_HostToken : null, matchedSegments);
        const requestData = {
            airSegments: carriercode === '6E' ? matchedSegments :
                data?.segments?.map((segment, index) => ({
                    Key: segment?.["@attributes"]?.Key,
                    group: segment?.["@attributes"]?.Group,
                    carrier: segment?.["@attributes"]?.Carrier,
                    flightNumber: segment?.["@attributes"]?.FlightNumber,
                    origin: segment?.["@attributes"]?.Origin,
                    destination: segment?.["@attributes"]?.Destination,
                    departureTime: segment?.["@attributes"]?.DepartureTime,
                    arrivalTime: segment?.["@attributes"]?.ArrivalTime,
                    flightTime: segment?.["@attributes"]?.FlightTime,
                    status: segment?.["@attributes"]?.Status,
                    supplierCode: segment?.["@attributes"]?.supplierCode,
                    changeOfPlane: segment?.["@attributes"]?.changeOfPlane,
                    classOfService: data?.cabinService?.[index] || "",
                    optionalServicesIndicator: segment?.["@attributes"]?.optionalServicesIndicator,
                    cabinClass: data?.bookingCode?.[index] || "",
                    operatingCarrier: "",
                    equipment: segment?.["@attributes"]?.Equipment,
                    providerCode: segment?.AirAvailInfo?.["@attributes"]?.ProviderCode,
                })),
            ...(carriercode === '6E' ? { hostToken: hosttokematch } : {}),
            ...(carriercode === "6E" ? { PricingModifiers: pricingModifiers } : {}),
            ...(carriercode !== '6E' ? { hasConnection: data?.segments?.length > 1 ? "hasConnection" : 1 } : {}),
            noOfAdults: travellers?.adults || 1,
            noOfChilds: travellers?.children || 0,
            noOfInfants: travellers?.infants || 0,
            trip: trip,
            tripType: tripType,
            flightFare: flightFare
        };

        try {
            dispatch(setModalvisible(true));
            const apiEndPoint = carriercode === '6E' ? "/GalileoInd/pricing" : "/Galileo/pricing"
            const response = await galileoApi(apiEndPoint, requestData);
            // if (carriercode === '6E') {
            //     return;
            // }
            // return

            const trip = responseData?.trip;
            // const flightFare = response?.flightFare
            if (response && response?.status && response?.status === 200) {
                // dispatch(setModalvisible(false));
                refd.current.complete();

                const responseData1 = {
                    responseData: response?.Pricing.Body.AirPriceRsp,
                    travellers: response.travellers,
                    trip_type: response.trip_type,
                    targetPrice: price,
                    trip,
                    convenienceFees: response?.convenienceFees,
                    flightFare: flightFare,
                    ...(carriercode === '6E' ? { Carrier: '6E' } : {}),
                }
                // console.log('Response:', responseData1);
                navigate("/flightreview", { state: { responseData1 } });
                dispatch(setModalvisible(false));

            }
            else {
                dispatch(setModalvisible(false));
                alert(response.message);
            }

        } catch (error) {
            console.error('Error:', error);
            dispatch(setModalvisible(false));
        }
    };

    const [selectedTimeRange, setSelectedTimeRange] = useState(null);
    const [selectedTimeRangearrival, setSelectedTimeRangearrival] = useState(null);
    const [selectedTimeRange1, setSelectedTimeRange1] = useState(null);
    const [selectedTimeRangearrival1, setSelectedTimeRangearrival1] = useState(null);


    const handleTimeRangeClick = (timeRange, type) => {
        if (type === 'onward') {
            setSelectedTimeRangearrival((prevValue) =>
                prevValue === timeRange ? null : timeRange
            );

        }
        else {
            setSelectedTimeRangearrival1((prevValue) =>
                prevValue === timeRange ? null : timeRange
            );
        }
    };

    const handleDepartureTimeRangeClick = (range, type) => {
        if (type === 'onward') {

            setSelectedTimeRange(prevRange => prevRange === range ? null : range);
        } else {
            setSelectedTimeRange1(prevRange => prevRange === range ? null : range);

        }
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedTimeRange(timeRanges.BEFORE_6_AM);
        } else {
            setSelectedTimeRange(null); // Remove the value if unchecked
        }
    };

    useEffect(() => {
        let newAmadeusFlights = [];
        let newGalileoFlights = [];

        if (responseData?.tripType === "oneway") {
            newAmadeusFlights = formData?.amadeus || [];
            newGalileoFlights = flightData.length > 0 ? flightData : [];
        } else if (responseData?.tripType === "roundtrip" && responseData.trip === 'D') {
            // newAmadeusFlights = [
            //     ...(formData?.amadeus?.amadeus_departure || []),
            //     ...(formData1?.amadeus?.amadeus_return || []),
            // ];
            newAmadeusFlights = [];
            newGalileoFlights = [
                ...(flightData.length > 0 ? flightData : []),
                ...(flightData1.length > 0 ? flightData1 : []),
            ];
        } else if (responseData?.tripType === "roundtrip" && responseData.trip === 'I') {
            setValues([0, 0])
            setMinprice(0)
            setMaxpric(0);
            // newAmadeusFlights = [
            //     ...(formData?.amadeus?.amadeus_departure || []),
            //     ...(formData1?.amadeus?.amadeus_return || []),
            // ];
            newAmadeusFlights = [];
            newGalileoFlights = [
                ...(flightDataInt.length > 0 ? flightDataInt : []),
            ];
        }
        // Calculate prices
        const galileoPrices = newGalileoFlights.length > 0
            ? newGalileoFlights.map(flight =>
                parseFloat(flight?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", ""))
            )
            : [];

        const amadeusPrices = newAmadeusFlights.length > 0
            ? newAmadeusFlights.map(flight => {
                const priceAmount = flight?.recommendations?.recPriceInfo?.monetaryDetail[0]?.amount || "0";
                const priceAmount1 = flight?.recommendations?.recPriceInfo?.monetaryDetail[1]?.amount || "0";
                return Math.round(parseFloat(priceAmount) + parseFloat(priceAmount1));
            })
            : [];

        const allPrices = [...galileoPrices, ...amadeusPrices];
        //  minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
        //  maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

        // setValues([minPrice, maxPrice]);

        // console.log("all price data ",allPrices);

        if (allPrices.length > 0) {
            const calculatedMinPrice = Math.min(...allPrices);
            const calculatedMaxPrice = Math.max(...allPrices);

            // Update state with the calculated values
            setMinprice(calculatedMinPrice);
            setMaxpric(calculatedMaxPrice);

            // Set the initial slider values based on min and max prices
            setValues([calculatedMinPrice, calculatedMaxPrice]);
        }
    }, [responseData, flightData, flightData1]);

    const handleChange = (newValues) => {
        setValues(newValues);
    };


    const handleAirlineSelection = (code) => {
        setSelectedAirlines((prevSelected) => {
            const updatedSelection = prevSelected.includes(code)
                ? prevSelected.filter((airline) => airline !== code) // Remove the airline
                : [...prevSelected, code]; // Add the airline
            // If only one airline was selected and is now removed, reset to all carrier codes
            return updatedSelection.length === 0 ? carrierCodes.map(({ code }) => code) : updatedSelection;
        });
    };

    // Function to filter only one airline when "Only" is clicked
    const handleOnlySelection = (code) => {
        setSelectedAirlines((prevSelected) =>
            prevSelected.length === 1 && prevSelected.includes(code)
                ? carrierCodes.map(({ code }) => code) // Reset to all airlines
                : [code] // Select only the clicked airline
        );
    }


    const handleNonStopSelection = () => {
        setNonStop(prevNonStop => !prevNonStop);
    };

    const handleStopsSelection = (stopCount, type) => {
        if (type === 'onward') {
            setStops((prevStop) => (prevStop === stopCount ? null : stopCount));
        } else {
            setStops1((prevStop) => (prevStop === stopCount ? null : stopCount));
        }
    };



    let filteredData = [];
    if (responseData?.tripType === 'oneway') {
        filteredData = filterFlights(responseData?.amadeus, selectedAirlines, stops, nonStop, values[0], values[1], selectedTimeRange, selectedTimeRangearrival);
    }

    // const [galedata,setGaleData]=useState([]);
    let filteredGalileoData = [];
    let returnGalileoData = [];

    if (responseData.tripType === 'oneway') {
        const galileoAvailabilities = flightData;
        filteredGalileoData = filterGalileoData(galileoAvailabilities, selectedAirlines, values[0], values[1], selectedTimeRange, selectedTimeRangearrival, stops, nonStop);

    }
    else if (responseData.tripType === 'roundtrip' && responseData?.trip === 'D') {
        const galileoAvailabilities = flightData;
        if (flightData.length > 0) {
            filteredGalileoData = filterGalileoData(galileoAvailabilities, selectedAirlines, values[0], values[1], selectedTimeRange, selectedTimeRangearrival, stops, nonStop);
        }
        const galileoAvailabilities1 = flightData1;
        if (flightData1.length > 0) {
            returnGalileoData = filterGalileoData(galileoAvailabilities1, selectedAirlines, values[0], values[1], selectedTimeRange1, selectedTimeRangearrival1, stops1, nonStop);
        }
    }
    else if (responseData.tripType === 'roundtrip' && responseData?.trip === 'I') {
        const galileoAvailabilities = flightDataInt;
        filteredGalileoData = filterGalileoDataIntern(galileoAvailabilities, selectedAirlines, values[0], values[1], selectedTimeRange, selectedTimeRangearrival, stops, selectedTimeRange1, selectedTimeRangearrival1, stops1, nonStop);
    }

    const formattedDate1 = formatDate(inputDate);
    const formattedDate = formatDate(depar_date);

    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);


    const handleSelectDeparture = (flight) => {
        // setSelectedDeparture(flight);
        setloadingcompon(true); // Show loading modal
        setTimeout(() => {
            setSelectedDeparture(flight);
            setloadingcompon(false); // Hide loading modal after 1 second
        }, 500);
    };

    const handleSelectReturn = (flight) => {
        // setSelectedReturn(flight);
        setloadingcompon(true); // Show loading modal
        setTimeout(() => {
            setSelectedReturn(flight);
            setloadingcompon(false); // Hide loading modal after 1 second
        }, 500);
    };
    useEffect(() => {
        setSelectedAirlines(carrierCodes.map(({ code }) => code));
    }, [carrierCodes]); // Update selectedAirlines when carrierCodes changes

    // this is used for makeing roundtrip formate
    let st;
    let st2;


    useEffect(() => {
        // console.log("this condtion for: ", filteredData,filteredReturningData)
        if (filteredGalileoData.length > 0 && returnGalileoData.length > 0) {
            setSelectedDeparture(filteredGalileoData[0]);
            setSelectedReturn(returnGalileoData[0]);
            // console.log("this condtion for 1")
        }
        else if (filteredGalileoData.length > 0 && returnGalileoData.length === 0) {
            setSelectedDeparture(filteredGalileoData[0]);
            setSelectedReturn(null);
        } else if (filteredGalileoData.length === 0 && returnGalileoData.length > 0) {
            setSelectedDeparture(null);
            setSelectedReturn(returnGalileoData[0]);
        }
        // else if (filteredData.length > 0 && filteredReturningData.length > 0) {

        //     setSelectedDeparture(filteredData[0]);
        //     setSelectedReturn(filteredReturningData[0]);
        //     // console.log("this condtion for 2 ")
        // }
        // else {
        //     setSelectedDeparture(null);
        //     setSelectedReturn(returngalFilter[0]);

        // }

        else {
            setSelectedDeparture(null);
            setSelectedReturn(null);
        }

    }, [flightData, flightData]);

    const removeFilter = () => {
        setSelectedAirlines([]);
        setNonStop(false);
        setStops(null);
        setStops1(null);
        setSelectedTimeRange(null);
        setSelectedTimeRangearrival(null);
    };


    useEffect(() => {
        if (responseData.tripType === 'roundtrip') {

            if (flightData.length > 0 && flightData1.length > 0) {
                setSelectedDeparture(flightData[0]);
                setSelectedReturn(flightData1[0]);
                // console.log("this condtion for 1")
            }
            else if (flightData.length > 0 && flightData1.length === 0) {
                setSelectedDeparture(flightData[0]);
                setSelectedReturn(null);
            } else if (flightData.length === 0 && flightData1.length > 0) {
                setSelectedDeparture(null);
                setSelectedReturn(flightData1[0]);
            }
            else {
                setSelectedDeparture(null);
                setSelectedReturn(null);
            }
        } else {
            if (flightData.length > 0) {
                setSelectedDeparture(flightData[0]);
            }
        }
    }, [flightData, flightData1])

    const handleBookNow = async (adult, child, infant) => {
        if (selectedDeparture && selectedReturn) {
            if (selectedDeparture?.PricingInfos && selectedReturn?.PricingInfos) {
                refd.current.continuousStart();

                const hosttokedata = responseData && responseData?.hostToken
                const carriercode = selectedDeparture?.segments[0]["@attributes"].Carrier || '';
                const pricehost = Array.isArray(selectedDeparture?.PricingInfos.AirPricingInfo) ? selectedDeparture?.PricingInfos.AirPricingInfo[0] : selectedDeparture?.PricingInfos.AirPricingInfo
                const data1 = pricehost?.FlightOptionsList?.FlightOption;
                const hostdetails = Array.isArray(data1?.Option) ? data1.Option : [data1?.Option];
                const segmentdata = selectedDeparture.segments
                const matchedSegments = matchSegmentsWithHostToken(hostdetails, segmentdata);
                const pricingModifiers = carriercode === "6E"
                    ? selectedDeparture && selectedDeparture?.airFareInfolist.map(item => ({
                        key: item["@attributes"].Key,
                        FareBasisCode: item["@attributes"].FareBasis
                    }))
                    : [];

                const hosttokematch = matchWithHostToken(hosttokedata && hosttokedata[0] && hosttokedata[0]?.original && hosttokedata[0]?.original?.common_v52_0_HostToken ? hosttokedata[0]?.original?.common_v52_0_HostToken : null, matchedSegments);

                const carriercode1 = selectedReturn?.segments[0]["@attributes"].Carrier || '';
                const pricehost1 = Array.isArray(selectedReturn?.PricingInfos.AirPricingInfo) ? selectedReturn?.PricingInfos.AirPricingInfo[0] : selectedReturn?.PricingInfos.AirPricingInfo
                const data2 = pricehost1?.FlightOptionsList?.FlightOption;
                const hostdetails1 = Array.isArray(data2?.Option) ? data2.Option : [data2?.Option];
                const segmentdata1 = selectedReturn.segments
                const matchedSegments1 = matchSegmentsWithHostToken(hostdetails1, segmentdata1);
                const pricingModifiers1 = carriercode1 === "6E"
                    ? selectedReturn && selectedReturn?.airFareInfolist.map(item => ({
                        key: item["@attributes"].Key,
                        FareBasisCode: item["@attributes"].FareBasis
                    }))
                    : [];

                const hosttokematch1 = matchWithHostToken(hosttokedata && hosttokedata[1] && hosttokedata[1]?.original && hosttokedata[1]?.original?.common_v52_0_HostToken ? hosttokedata[1].original.common_v52_0_HostToken : null, matchedSegments1);

                const apiEndPoint = carriercode === '6E' ? "/GalileoInd/pricing" : "/Galileo/pricing"
                const apiEndPointreturn = carriercode1 === '6E' ? "/GalileoInd/pricing" : "/Galileo/pricing"

                refd.current.continuousStart();
                const requestData = {
                    airSegments: carriercode === '6E' ? matchedSegments : selectedDeparture?.segments?.map((segment, index) => ({
                        Key: segment?.["@attributes"]?.Key,
                        carrier: segment?.["@attributes"]?.Carrier,
                        flightNumber: segment?.["@attributes"]?.FlightNumber,
                        origin: segment?.["@attributes"]?.Origin,
                        destination: segment?.["@attributes"]?.Destination,
                        departureTime: segment?.["@attributes"]?.DepartureTime,
                        arrivalTime: segment?.["@attributes"]?.ArrivalTime,
                        classOfService: "",
                        cabinClass: selectedDeparture?.bookingCode?.[index] || "",
                        operatingCarrier: "",
                        equipment: segment?.["@attributes"]?.Equipment,
                        providerCode: segment?.AirAvailInfo?.["@attributes"]?.ProviderCode,
                    })),
                    ...(carriercode === '6E' ? { hostToken: hosttokematch } : {}),
                    ...(carriercode === "6E" ? { PricingModifiers: pricingModifiers } : {}),
                    ...(carriercode !== '6E' ? { hasConnection: selectedDeparture?.segments?.length > 1 ? "hasConnection" : 1 } : {}),
                    "noOfAdults": adult || 1,
                    "noOfChilds": child || 0,
                    "noOfInfants": infant || 0,
                    "trip": responseData?.trip,
                    "tripType": 'oneway',
                    "flightFare": responseData?.flightFare
                };
                const requestData1 = {
                    airSegments: carriercode1 === '6E' ? matchedSegments1 : selectedReturn?.segments?.map((segment, index) => ({
                        Key: segment?.["@attributes"]?.Key,
                        carrier: segment?.["@attributes"]?.Carrier,
                        flightNumber: segment?.["@attributes"]?.FlightNumber,
                        origin: segment?.["@attributes"]?.Origin,
                        destination: segment?.["@attributes"]?.Destination,
                        departureTime: segment?.["@attributes"]?.DepartureTime,
                        arrivalTime: segment?.["@attributes"]?.ArrivalTime,
                        classOfService: "",
                        cabinClass: selectedReturn?.bookingCode?.[index] || "",
                        operatingCarrier: "",
                        equipment: segment?.["@attributes"]?.Equipment,
                        providerCode: segment?.AirAvailInfo?.["@attributes"]?.ProviderCode,
                    })),
                    ...(carriercode1 === '6E' ? { hostToken: hosttokematch1 } : {}),
                    ...(carriercode1 === "6E" ? { PricingModifiers: pricingModifiers1 } : {}),
                    ...(carriercode1 !== '6E' ? { hasConnection: selectedReturn?.segments?.length > 1 ? "hasConnection" : 1 } : {}),
                    "noOfAdults": adult || 1,
                    "noOfChilds": child || 0,
                    "noOfInfants": infant || 0,
                    "trip": responseData?.trip,
                    "tripType": 'oneway',
                    flightFare: responseData?.flightFare
                };

                const price = selectedDeparture.PricingInfos["@attributes"].TotalPrice;
                const price1 = selectedReturn.PricingInfos["@attributes"].TotalPrice;
                // if(carriercode === '6E' || carriercode1 === '6E'){
                //     return;
                // }

                try {
                    dispatch(setModalvisible(true));
                    const [response, response1] = await Promise.all([
                        galileoApi(apiEndPoint, requestData),
                        galileoApi(apiEndPointreturn, requestData1)
                    ]);

                    console.log("response : ", response, "response1 : ", response1);
                    dispatch(setModalvisible(false));
                    if (
                        response?.status === 200 && response1.status === 200
                    ) {
                        const feecharge = response?.convenienceFees + response1?.convenienceFees
                        // setModalvisible(false);
                        // refd.current.complete();
                        const responseData1 = {
                            responseData: response?.Pricing.Body.AirPriceRsp,
                            responseData1: response1?.Pricing.Body.AirPriceRsp,
                            travellers: response.travellers,
                            trip_type: 'roundtrip',
                            targetPrice: price,
                            targetPricereturn: price1,
                            trip: response.trip,
                            flightFare: response.flightFare,
                            convenienceFees: feecharge && response?.convenienceFees + response1?.convenienceFees,
                        }
                        navigate("/flightreview", { state: { responseData1 } });

                    }
                    else {
                        alert("Booking failed, please try again later.");
                    }

                } catch (error) {
                    console.error('Error:', error);
                    dispatch(setModalvisible(false));
                }
            }
            else {
                return;
            }

        } else {
            console.log('Please select both departure and return flights');
        }
    };

    st = selectedDeparture?.FlightKey ? selectedDeparture.FlightKey : selectedDeparture?.id;
    st2 = selectedReturn?.FlightKey ? selectedReturn.FlightKey : selectedReturn?.id;

    useEffect(() => {
        if (returnGalileoData && returnGalileoData.length > 0) {
            const data = returnGalileoData[0];
            const originalPrice = data?.PricingInfos["@attributes"].TotalPrice || "0";
            dispatch(setCommonPrice(originalPrice.toString())); // Store in Redux
        }
    }, [returnGalileoData, dispatch]);

    // console.log("filter data => ", filteredGalileoData);

    const bookNowSpecialflight = (data, travellers) => {
        setloadingcompon(true); // Show loading modal

        const responseData1 = {
            responseData: data,
            travellers: travellers,
            trip_type: responseData?.tripType,
            trip: responseData?.trip,
            useCoin: responseData?.trip === 'D' ? 600 : 1000,
            earnCoin: "5%"
        };

        if (data?.onward_connecting) {
            responseData1.booking_token_id = responseData?.booking_token_id || "";
        }
        if (data?.ticket_id) {
            responseData1.IQtoken = responseData?.IQtoken || "";
        }

        setTimeout(() => {
            navigate('/SpecialFlightDetails', { state: { responseData1 } });
            setloadingcompon(false);
        }, 2000);

    };

    return (
        <>

            {loadingcompon && (
                <LoadingPage />
            )}
            <LoadingBar color="#f11946" ref={refd} />
            {
                modalvisible ? (
                    <div>
                        <LoadingSlicer />
                    </div>
                ) : (
                    <div className=''>
                        {
                            !isMobile ? <>
                                <Offer title="---" />
                                <FlightFom existingData={passangerData} />
                            </> : null
                        }




                        <div className='container mt-1 mt-lg-3 '>
                            <div className='row   py-5 pt-0'>
                                <div className=' mt-2 w-100 p-1'>
                                    <div
                                        className="col-12 rounded d-flex justify-content-between align-content-center p-3 d-xl-none "
                                        style={{
                                            backgroundColor: "white",
                                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Softer and more subtle shadow
                                            border: "1px solid #ccc", // Adds a light border
                                            width: "100%", // Ensures it spans 100% width
                                            maxWidth: "100%", // Prevents it from exceeding the container
                                        }}
                                    >


                                        <FaFilter data-bs-toggle="offcanvas"
                                            data-bs-target="#staticBackdrop"
                                            aria-controls="staticBackdrop"
                                            style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                                color: "#555", // Slightly darker icon color for better contrast
                                            }} />
                                        <Link to="/">
                                            <FaRegEdit style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                                color: "#555", // Slightly darker icon color for better contrast
                                            }} /></Link>
                                    </div>
                                </div>
                                <div className='col-xl-3 bg-transparent  col-md-12 pt-20'>

                                    <div style={{ borderRadius: '4px' }} className={`filter d-none ${responseData.tripType === 'roundtrip' ? 'bg-transparent ' : 'bg-white tour_details_boxed mt-3'} d-xl-block p-2`}>

                                        <div className={`w-100 bg-white mb-4 p-2 ${responseData.tripType === 'roundtrip' ? 'shadow' : ''} `}>
                                            <div className='filter-text'>
                                                <h6 className='text-lg-left'>Filter</h6>
                                            </div>
                                            <div className='popular-filter py-3'>
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    position: 'relative',
                                                    display: 'inline-block'
                                                }}>
                                                    Popular Filter
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
                                            </div>
                                            <div className='checklist pb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value="Nonstop"
                                                        id="flexCheckNonstop"
                                                        onChange={handleNonStopSelection}
                                                    />
                                                    <label className="form-check-label text-muted" htmlFor="flexCheckNonstop">
                                                        Nonstop
                                                    </label>
                                                </div>


                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value="MorningDeparture"
                                                        id="flexCheckChecked"
                                                        onChange={handleCheckboxChange}
                                                        checked={selectedTimeRange === timeRanges.BEFORE_6_AM}
                                                    />
                                                    <label className="form-check-label text-muted" htmlFor="flexCheckChecked">
                                                        Morning Departure
                                                    </label>
                                                </div>

                                                <div>
                                                    {visibleCarriers.map(({ code }) => (
                                                        <div className="form-check" key={code}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={code}
                                                                id={`flexCheck${code}`}
                                                                onChange={() => handleAirlineSelection(code)}
                                                                checked={selectedAirlines.includes(code)}
                                                            />
                                                            <label className="form-check-label text-muted" htmlFor={`flexCheck${code}`}>
                                                                {getAirlineName(code)}
                                                            </label>
                                                        </div>
                                                    ))}

                                                    {
                                                        carrierCodes.length > 4 && (

                                                            <button
                                                                style={{ fontSize: '13px' }}
                                                                className="btn btn-link"
                                                                onClick={() => setShowMore(prevShowMore => !prevShowMore)}
                                                            >
                                                                {showMore ? 'Show Less' : `+${carrierCodes.length - 4} More`}
                                                            </button>
                                                        )
                                                    }

                                                </div>

                                            </div>
                                            <div className='price-range mt-3 pb-3'>
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    position: 'relative',
                                                    display: 'inline-block'
                                                }}>
                                                    Price range
                                                    <span style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        bottom: -6,
                                                        left: 0,
                                                        width: '30px',
                                                        height: '4px',

                                                        backgroundColor: '#223fcf', // Adjust color as needed
                                                    }}></span>
                                                </h4>
                                                {/* <label htmlFor="customRange1" className="form-label fw-bold ">Price range</label> */}

                                                <ReactSlider
                                                    className="horizontal-slider"
                                                    thumbClassName="example-thumb"
                                                    trackClassName="example-track"
                                                    value={values}
                                                    min={minPrice}
                                                    max={maxPrice}
                                                    // min={values[0]} // Use the first value as min
                                                    // max={values[1]}
                                                    step={1}
                                                    onChange={handleChange}
                                                    renderTrack={(props, state) => {
                                                        let trackClassName = 'example-track';
                                                        if (state.index === 0) {
                                                            trackClassName += ' left-track';
                                                        } else if (state.index === 1) {
                                                            trackClassName += ' right-track';
                                                        }
                                                        return (
                                                            <div
                                                                key={props.key}
                                                                className={trackClassName}
                                                                style={props.style}
                                                                onMouseDown={props.onMouseDown}
                                                            />
                                                        );
                                                    }}
                                                />

                                                <div className="range-values">
                                                    <span>Rs: {values[0]}</span>
                                                    <span>Rs: {values[1]}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-100 bg-white ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}  p-2 d-inline-block`}>
                                            {
                                                responseData.tripType === 'roundtrip' && (
                                                    // <h4 style={{ fontSize: '18px' }}>Onward Flight</h4>
                                                    <h4 style={{
                                                        fontSize: '18px',
                                                        position: 'relative',
                                                        display: 'inline-block'
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


                                                )}
                                            <div className='stops mt-3 pb-3'>
                                                <h6 className='fw-bold'>Stops</h6>



                                                <div className='stop-buttons d-flex align-items-center gap-3 mt-2'>
                                                    {[{ label: "0<br />NonStop", value: 1 }, { label: "1<br />Stop", value: 2 }, { label: "2+<br />Stop", value: 3 }].map((stop, index) => (
                                                        <button
                                                            style={{
                                                                backgroundColor: stops === stop.value ? "var(--main-color)" : "transparent",
                                                                border: `1px solid var(--main-color)`, // Optional: Add a border
                                                            }}
                                                            key={index}
                                                            className={`btn ${stops === stop.value ? ' text-white' : 'text-muted'} mr-3`}
                                                            type='button'
                                                            onClick={() => handleStopsSelection(stop.value, "onward")}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: stop.label }} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>



                                            <div className='departure-from mt-3 pb-2'>
                                                <h6 className='fw-bold pb-3'>Departure From {departCity} </h6>
                                                <div className='row'>
                                                    {timeRangeData && timeRangeData?.map((item, index) => (
                                                        <TimeRangeSelector
                                                            key={index}
                                                            timeRange={item.timeRange}
                                                            selectedTimeRange={selectedTimeRange}
                                                            onClick={handleDepartureTimeRangeClick}
                                                            iconClass={item.iconClass}
                                                            label={item.label}
                                                            traveltype="onward"
                                                        />
                                                    ))}
                                                </div>

                                            </div>

                                            <div className='departure-from mt-3 pb-2'>
                                                <h6 className='fw-bold pb-3'>Arrival at {arriveCity} </h6>
                                                <div className='row'>
                                                    {timeRangeData && timeRangeData?.map((item, index) => (
                                                        <TimeRangeSelector
                                                            key={index}
                                                            timeRange={item.timeRange}
                                                            selectedTimeRange={selectedTimeRangearrival}
                                                            onClick={handleTimeRangeClick}
                                                            iconClass={item.iconClass}
                                                            label={item.label}
                                                            traveltype="onward"
                                                        />
                                                    ))}
                                                </div>

                                            </div>
                                        </div>

                                        {
                                            responseData.tripType === 'roundtrip' && (
                                                <div className={`w-100 bg-white  mt-4 p-2 d-inline-block ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}`}>
                                                    <h4 style={{
                                                        fontSize: '18px',
                                                        position: 'relative',
                                                        display: 'inline-block'
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
                                                    <div className='stops mt-3 pb-3'>
                                                        <h6 className='fw-bold'>Stops</h6>

                                                        <div className='stop-buttons d-flex align-items-center gap-3 mt-2'>
                                                            {[{ label: "0<br />NonStop", value: 1 }, { label: "1<br />Stop", value: 2 }, { label: "2+<br />Stop", value: 3 }].map((stop, index) => (
                                                                <button
                                                                    style={{
                                                                        backgroundColor: stops1 === stop.value ? "var(--main-color)" : "transparent",
                                                                        border: `1px solid var(--main-color)`, // Optional: Add a border
                                                                    }}
                                                                    key={index}
                                                                    className={`btn ${stops1 === stop.value ? ' text-white' : 'text-muted'} mr-3`}
                                                                    type='button'
                                                                    onClick={() => handleStopsSelection(stop.value, "return")}
                                                                >
                                                                    <span dangerouslySetInnerHTML={{ __html: stop.label }} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>



                                                    <div className='departure-from mt-3 pb-2'>
                                                        <h6 className='fw-bold pb-3'>Departure From {departCity} </h6>

                                                        <div className='row'>
                                                            {timeRangeData && timeRangeData?.map((item, index) => (
                                                                <TimeRangeSelector
                                                                    key={index}
                                                                    timeRange={item.timeRange}
                                                                    selectedTimeRange={selectedTimeRange1}
                                                                    onClick={handleDepartureTimeRangeClick}
                                                                    iconClass={item.iconClass}
                                                                    label={item.label}
                                                                    traveltype="return"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className='departure-from mt-3 pb-2'>
                                                        <h6 className='fw-bold pb-3'>Arrival at {arriveCity} </h6>
                                                        <div className='row'>
                                                            {timeRangeData && timeRangeData?.map((item, index) => (
                                                                <TimeRangeSelector
                                                                    key={index}
                                                                    timeRange={item.timeRange}
                                                                    selectedTimeRange={selectedTimeRangearrival1}
                                                                    onClick={handleTimeRangeClick}
                                                                    iconClass={item.iconClass}
                                                                    label={item.label}
                                                                    traveltype="return"
                                                                />
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }


                                        <div className={`w-100 bg-white mt-4 p-2 ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}`}>
                                            <div className='popular-filter py-2'>
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    position: 'relative',
                                                    display: 'inline-block'
                                                }}>
                                                    Airlines
                                                    <span style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        bottom: -6,
                                                        left: 0,
                                                        width: '20px',
                                                        height: '4px',

                                                        backgroundColor: '#223fcf', // Adjust color as needed
                                                    }}></span>
                                                </h4>


                                            </div>


                                            <div>


                                                {visibleCarriers.map(({ code, price }) => (
                                                    <div key={code} className="form-check d-flex align-items-center justify-content-lg-between col-lg-12">
                                                        <label className="form-check-label text-muted align-items-sm-start" htmlFor={`flexCheck${code}`}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={code}
                                                                id={`flexCheck${code}`}
                                                                onChange={() => handleAirlineSelection(code)}
                                                                checked={selectedAirlines.includes(code)}
                                                            />
                                                            <img
                                                                style={{ width: '16px', height: '16px' }}
                                                                src={getImageUrl1(`/flightlogo/${code}.png`)}
                                                                className='img-fluid-flight mr-1 mb-1'
                                                                alt="Airline Logo"
                                                                onError={(e) => (e.target.src = '/flight/default.png')}
                                                            />
                                                            <span className='mx-1'>{getAirlineName(code)}</span>
                                                        </label>

                                                        {/* "Only" text appears on hover */}
                                                        <span
                                                            className="only-text"
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'blue',
                                                                marginLeft: '2px',
                                                                fontSize: '10px',

                                                            }}
                                                            onClick={() => handleOnlySelection(code)}
                                                        >
                                                            Only
                                                        </span>

                                                        <div className='form-check-label text-end text-muted fw-semibold'>
                                                            {formData?.currency?.currency_symbol} {price}
                                                        </div>
                                                    </div>
                                                ))}


                                                {
                                                    carrierCodes.length > 4 && (

                                                        <button
                                                            style={{ fontSize: '13px' }}
                                                            className="btn btn-link"
                                                            onClick={() => setShowMore(prevShowMore => !prevShowMore)}
                                                        >
                                                            {showMore ? 'Show Less' : `+${carrierCodes.length - 4} More`}
                                                        </button>
                                                    )
                                                }

                                            </div>

                                        </div>
                                    </div>


                                    {/* ******************for mobile device ********************* */}
                                    {/* Offcanvas for small and medium devices */}
                                    <div
                                        className="offcanvas offcanvas-start d-xl-none "
                                        data-bs-backdrop="static"
                                        tabIndex="-1"
                                        id="staticBackdrop"
                                        aria-labelledby="staticBackdropLabel"
                                    >
                                        <div className="offcanvas-header ">
                                            <h5 className="offcanvas-title" id="staticBackdropLabel">Filter</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>
                                        <div className="offcanvas-body">
                                            {/* Filter content copied from above */}
                                            <div className='filter'>
                                                <div className='filter-text'>
                                                    <h6 className='text-lg-left'>Filter</h6>
                                                </div>
                                                <div className='popular-filter pt-3'>
                                                    <h6 className='fw-bold'>Popular Filter </h6>
                                                </div>

                                                <div className='checklist pb-3'>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value="Nonstop"
                                                            id="flexCheckNonstop"
                                                            onChange={handleNonStopSelection}
                                                        />
                                                        <label className="form-check-label text-muted" htmlFor="flexCheckNonstop">
                                                            Nonstop
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value="MorningDeparture"
                                                            id="flexCheckChecked"
                                                            onChange={handleCheckboxChange}
                                                            checked={selectedTimeRange === timeRanges.BEFORE_6_AM}
                                                        />
                                                        <label className="form-check-label text-muted" htmlFor="flexCheckChecked">
                                                            Morning Departure
                                                        </label>
                                                    </div>
                                                    <div>
                                                        {visibleCarriers.map(({ code }) => (
                                                            <div className="form-check" key={code}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={code}
                                                                    id={`flexCheck${code}`}
                                                                    onChange={() => handleAirlineSelection(code)}
                                                                    checked={selectedAirlines.includes(code)}
                                                                />
                                                                <label className="form-check-label text-muted" htmlFor={`flexCheck${code}`}>
                                                                    {getAirlineName(code)}
                                                                </label>
                                                            </div>
                                                        ))}

                                                        {
                                                            carrierCodes.length > 4 && (

                                                                <button
                                                                    style={{ fontSize: '13px' }}
                                                                    className="btn btn-link"
                                                                    onClick={() => setShowMore(prevShowMore => !prevShowMore)}
                                                                >
                                                                    {showMore ? 'Show Less' : `+${carrierCodes.length - 4} More`}
                                                                </button>
                                                            )
                                                        }

                                                    </div>


                                                </div>


                                                <div className='price-range mt-3 pb-3'>
                                                    <h4 style={{
                                                        fontSize: '18px',
                                                        position: 'relative',
                                                        display: 'inline-block'
                                                    }}>
                                                        Price range
                                                        <span style={{
                                                            content: '',
                                                            position: 'absolute',
                                                            bottom: -6,
                                                            left: 0,
                                                            width: '30px',
                                                            height: '4px',

                                                            backgroundColor: '#223fcf', // Adjust color as needed
                                                        }}></span>
                                                    </h4>
                                                    {/* <label htmlFor="customRange1" className="form-label fw-bold ">Price range</label> */}

                                                    <ReactSlider
                                                        className="horizontal-slider"
                                                        thumbClassName="example-thumb"
                                                        trackClassName="example-track"
                                                        value={values}
                                                        min={minPrice}
                                                        max={maxPrice}
                                                        // min={values[0]} // Use the first value as min
                                                        // max={values[1]}
                                                        step={1}
                                                        onChange={handleChange}
                                                        renderTrack={(props, state) => {
                                                            let trackClassName = 'example-track';
                                                            if (state.index === 0) {
                                                                trackClassName += ' left-track';
                                                            } else if (state.index === 1) {
                                                                trackClassName += ' right-track';
                                                            }
                                                            return (
                                                                <div
                                                                    key={props.key}
                                                                    className={trackClassName}
                                                                    style={props.style}
                                                                    onMouseDown={props.onMouseDown}
                                                                />
                                                            );
                                                        }}
                                                    />

                                                    <div className="range-values">
                                                        <span>Rs: {values[0]}</span>
                                                        <span>Rs: {values[1]}</span>
                                                    </div>
                                                </div>

                                                <div className={`w-100 bg-white ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}  p-2 d-inline-block`}>
                                                    {
                                                        responseData.tripType === 'roundtrip' && (
                                                            // <h4 style={{ fontSize: '18px' }}>Onward Flight</h4>
                                                            <h4 style={{
                                                                fontSize: '18px',
                                                                position: 'relative',
                                                                display: 'inline-block'
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


                                                        )}
                                                    <div className='stops mt-3 pb-3'>
                                                        <h6 className='fw-bold'>Stops</h6>



                                                        <div className='stop-buttons d-flex align-items-center gap-3 mt-2'>
                                                            {[{ label: "0<br />NonStop", value: 1 }, { label: "1<br />Stop", value: 2 }, { label: "2+<br />Stop", value: 3 }].map((stop, index) => (
                                                                <button
                                                                    style={{
                                                                        backgroundColor: stops === stop.value ? "var(--main-color)" : "transparent",
                                                                        border: `1px solid var(--main-color)`, // Optional: Add a border
                                                                    }}
                                                                    key={index}
                                                                    className={`btn ${stops === stop.value ? ' text-white' : 'text-muted'} mr-3`}
                                                                    type='button'
                                                                    onClick={() => handleStopsSelection(stop.value, "onward")}
                                                                >
                                                                    <span dangerouslySetInnerHTML={{ __html: stop.label }} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>



                                                    <div className='departure-from mt-3 pb-2'>
                                                        <h6 className='fw-bold pb-3'>Departure From {departCity} </h6>
                                                        <div className='row'>
                                                            {timeRangeData && timeRangeData?.map((item, index) => (
                                                                <TimeRangeSelector
                                                                    key={index}
                                                                    timeRange={item.timeRange}
                                                                    selectedTimeRange={selectedTimeRange}
                                                                    onClick={handleDepartureTimeRangeClick}
                                                                    iconClass={item.iconClass}
                                                                    label={item.label}
                                                                    traveltype="onward"
                                                                />
                                                            ))}
                                                        </div>

                                                    </div>

                                                    <div className='departure-from mt-3 pb-2'>
                                                        <h6 className='fw-bold pb-3'>Arrival at {arriveCity} </h6>
                                                        <div className='row'>
                                                            {timeRangeData && timeRangeData?.map((item, index) => (
                                                                <TimeRangeSelector
                                                                    key={index}
                                                                    timeRange={item.timeRange}
                                                                    selectedTimeRange={selectedTimeRangearrival}
                                                                    onClick={handleTimeRangeClick}
                                                                    iconClass={item.iconClass}
                                                                    label={item.label}
                                                                    traveltype="onward"
                                                                />
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>


                                                {
                                                    responseData.tripType === 'roundtrip' && (
                                                        <div className={`w-100 bg-white  mt-4 p-2 d-inline-block ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}`}>
                                                            <h4 style={{
                                                                fontSize: '18px',
                                                                position: 'relative',
                                                                display: 'inline-block'
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
                                                            <div className='stops mt-3 pb-3'>
                                                                <h6 className='fw-bold'>Stops</h6>

                                                                <div className='stop-buttons d-flex align-items-center gap-3 mt-2'>
                                                                    {[{ label: "0<br />NonStop", value: 1 }, { label: "1<br />Stop", value: 2 }, { label: "2+<br />Stop", value: 3 }].map((stop, index) => (
                                                                        <button
                                                                            style={{
                                                                                backgroundColor: stops1 === stop.value ? "var(--main-color)" : "transparent",
                                                                                border: `1px solid var(--main-color)`, // Optional: Add a border
                                                                            }}
                                                                            key={index}
                                                                            className={`btn ${stops1 === stop.value ? ' text-white' : 'text-muted'} mr-3`}
                                                                            type='button'
                                                                            onClick={() => handleStopsSelection(stop.value, "return")}
                                                                        >
                                                                            <span dangerouslySetInnerHTML={{ __html: stop.label }} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>



                                                            <div className='departure-from mt-3 pb-2'>
                                                                <h6 className='fw-bold pb-3'>Departure From {departCity} </h6>

                                                                <div className='row'>
                                                                    {timeRangeData && timeRangeData?.map((item, index) => (
                                                                        <TimeRangeSelector
                                                                            key={index}
                                                                            timeRange={item.timeRange}
                                                                            selectedTimeRange={selectedTimeRange1}
                                                                            onClick={handleDepartureTimeRangeClick}
                                                                            iconClass={item.iconClass}
                                                                            label={item.label}
                                                                            traveltype="return"
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className='departure-from mt-3 pb-2'>
                                                                <h6 className='fw-bold pb-3'>Arrival at {arriveCity} </h6>
                                                                <div className='row'>
                                                                    {timeRangeData && timeRangeData?.map((item, index) => (
                                                                        <TimeRangeSelector
                                                                            key={index}
                                                                            timeRange={item.timeRange}
                                                                            selectedTimeRange={selectedTimeRangearrival1}
                                                                            onClick={handleTimeRangeClick}
                                                                            iconClass={item.iconClass}
                                                                            label={item.label}
                                                                            traveltype="return"
                                                                        />
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                }


                                                <div className={`w-100 bg-white mt-4 p-2 ${responseData.tripType === 'roundtrip' ? 'shadow' : ''}`}>
                                                    <div className='popular-filter py-2'>
                                                        <h4 style={{
                                                            fontSize: '18px',
                                                            position: 'relative',
                                                            display: 'inline-block'
                                                        }}>
                                                            Airlines
                                                            <span style={{
                                                                content: '',
                                                                position: 'absolute',
                                                                bottom: -6,
                                                                left: 0,
                                                                width: '20px',
                                                                height: '4px',

                                                                backgroundColor: '#223fcf', // Adjust color as needed
                                                            }}></span>
                                                        </h4>


                                                    </div>


                                                    <div>


                                                        {visibleCarriers.map(({ code, price }) => (
                                                            <div key={code} className="form-check d-flex align-items-center justify-content-lg-between col-lg-12">
                                                                <label className="form-check-label text-muted align-items-sm-start" htmlFor={`flexCheck${code}`}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        value={code}
                                                                        id={`flexCheck${code}`}
                                                                        onChange={() => handleAirlineSelection(code)}
                                                                        checked={selectedAirlines.includes(code)}
                                                                    />
                                                                    <img
                                                                        style={{ width: '16px', height: '16px' }}
                                                                        src={getImageUrl1(`/flightlogo/${code}.png`)}
                                                                        className='img-fluid-flight mr-1 mb-1'
                                                                        alt="Airline Logo"
                                                                        onError={(e) => (e.target.src = '/flight/default.png')}
                                                                    />
                                                                    <span className='mx-1'>{getAirlineName(code)}</span>
                                                                </label>

                                                                {/* "Only" text appears on hover */}
                                                                <span
                                                                    className="only-text"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: 'blue',
                                                                        marginLeft: '2px',
                                                                        fontSize: '10px',

                                                                    }}
                                                                    onClick={() => handleOnlySelection(code)}
                                                                >
                                                                    Only
                                                                </span>

                                                                <div className='form-check-label text-end text-muted fw-semibold'>
                                                                    {formData?.currency?.currency_symbol} {price}
                                                                </div>
                                                            </div>
                                                        ))}


                                                        {
                                                            carrierCodes.length > 4 && (

                                                                <button
                                                                    style={{ fontSize: '13px' }}
                                                                    className="btn btn-link"
                                                                    onClick={() => setShowMore(prevShowMore => !prevShowMore)}
                                                                >
                                                                    {showMore ? 'Show Less' : `+${carrierCodes.length - 4} More`}
                                                                </button>
                                                            )
                                                        }

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>




                                <div className='col-xl-9 px-2 col-md-12 '>

                                    {
                                        responseData && responseData?.tripType === 'oneway' && (

                                            <>

                                                <div className='px-2 d-none d-lg-block'>

                                                    {
                                                        filteredGalileoData.length > 0 && filteredGalileoData.map((data, index) => (

                                                            <CommonFlightCard key={index}
                                                                index={index}
                                                                data={data}
                                                                responseData={responseData}
                                                                bookFlightGAL={bookFlightGAL}
                                                                isOpen={openCardIndex === index}
                                                                toggleFlightDetails={toggleFlightDetails}
                                                                bookNowSpecialflight={bookNowSpecialflight}

                                                            />))
                                                    }


                                                </div>


                                                {/* galileo mobile ui  */}
                                                <div className='row p-2 d-block d-lg-none test22'>
                                                    {
                                                        filteredGalileoData.length > 0 && filteredGalileoData.map((data, index) => (

                                                            <Commonmobilecard key={index} data={data} responseData={responseData} bookFlightGAL={bookFlightGAL} />
                                                        ))}


                                                </div>
                                                {/* amedus-mobile-device */}

                                            </>

                                        )}
                                    {
                                        (responseData.tripType === 'roundtrip' && responseData.trip === 'D') && (
                                            <>
                                                <div className='col-xl-12 d-flex p-0 col-md-12'>


                                                    <div className='col-6 px-1'>
                                                        {
                                                            flightData.length > 0 && (
                                                                <div className='d-flex align-items-center justify-content-between bg-white p-3 mb-3 rounded-lg shadow-sm d-none d-lg-block'>

                                                                    <div className='fw-bold text-black fs-6 ' ><PiAirplaneTakeoffLight size={24} />  {departCity} → {arriveCity}</div>
                                                                    <div className='text-muted'>{formattedDate1}</div>
                                                                </div>
                                                            )
                                                        }

                                                        <div className=' bg-white p-2 mb-1 rounded-lg shadow-sm d-block d-lg-none text-center'>

                                                            <div className='fw-bold text-black  ' style={{ fontSize: "10px" }} ><PiAirplaneTakeoffLight size={24} /> {departCity} → {arriveCity}</div>
                                                            <div className='text-muted'>{formattedDate1} {flightData1.length}</div>
                                                        </div>


                                                        {filteredGalileoData.length > 0 && filteredGalileoData.map((data, index) => (
                                                            <FlightCard data={data} key={index} currency={formData && formData.currency && formData.currency.currency_symbol} formData={data} onSelect={() => handleSelectDeparture(data)} selectedDeparture={selectedDeparture} isSelected={st === data.FlightKey} travellers={responseData && responseData?.travellers} isReturn={false} trip={responseData?.trip} />

                                                        ))}


                                                    </div>

                                                    {/* {returngalFilter ? ( */}
                                                    <div className='col-6 px-1'>
                                                        {
                                                            flightData1.length > 0 && (

                                                                <div className='d-flex align-items-center justify-content-between bg-white p-3 mb-3 rounded-lg shadow-sm d-none d-lg-block'>

                                                                    <div className='fw-bold text-black fs-6'><PiAirplaneInFlight size={24} /> {arriveCity} → {departCity}</div>
                                                                    <div className='text-muted'>{formattedDate}</div>
                                                                </div>
                                                            )
                                                        }
                                                        <div className=' bg-white p-2 mb-1 rounded-lg shadow-sm d-block d-lg-none text-center d-block d-lg-none'>
                                                            <div className='fw-bold text-black  ' style={{ fontSize: "10px" }} ><PiAirplaneTakeoffLight size={24} />{arriveCity} → {departCity}</div>
                                                            <div className='text-muted'>{formattedDate}</div>
                                                        </div>

                                                        {returnGalileoData.length > 0 && returnGalileoData.map((data, index) => (

                                                            <FlightCard data={data} key={index} currency={formData && formData.currency && formData.currency.currency_symbol} formData={data} onSelect={() => handleSelectReturn(data)} selectedReturn={selectedReturn} isSelected={st2 === data.FlightKey} travellers={responseData && responseData?.travellers} isReturn={true} trip={responseData?.trip} />

                                                        ))}


                                                    </div>
                                                </div>

                                            </>

                                        )
                                    }

                                    {
                                        responseData.tripType === 'roundtrip' && responseData.trip === 'I' && (
                                            flightDataInt.length === 0 ? (
                                                <div className="text-center text-danger fw-bold mt-3">
                                                    No flights available for this route.
                                                </div>
                                            ) : (flightDataInt.length > 0 && filteredGalileoData.length === 0) ? (
                                                <div className="text-center text-warning fw-bold mt-3">
                                                    Multiple filters applied. No flights found.
                                                </div>
                                            ) : (
                                                <InternationCard
                                                    flights={filteredGalileoData}
                                                    currency={formData?.currency?.currency_symbol}
                                                    travellers={responseData?.travellers}
                                                    hostToken={responseData && responseData?.hostToken[0] && responseData?.hostToken[0]}
                                                    coupons={
                                                        !user || user?.users?.role === 1
                                                            ? responseData?.coupons
                                                            : null
                                                    }
                                                    chips={responseData?.chips}
                                                    extra_discount={responseData && responseData?.extra_discount}
                                                />
                                            )
                                        )
                                    }


                                    {
                                        (flightData.length === 0 && filteredData.length === 0 && flightDataInt.length === 0) && (
                                            <Container className="text-center bg-info bg-white col-sm-12 col-md-9">
                                                <Row className="p-0">
                                                    <Col>
                                                        <div className="w-100  h-50 mb-4 d-flex align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
                                                            <img className="img-fluid" src={errorimg} alt="" style={{ objectFit: 'contain' }} />
                                                        </div>
                                                        <h3 className="text-primary">No Matching Flight Found</h3>
                                                        <div className="my-4">There are no flights available right now for the current date and route.</div>
                                                        <Button variant="primary" className="mr-2">GO BACK</Button>
                                                        <Button variant="info">TRY ANOTHER FLIGHT <span role="img" aria-label="airplane">✈️</span></Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        )
                                    }
                                    {
                                        (flightData.length > 0 && filteredGalileoData.length === 0 && responseData.tripType === 'oneway') && (
                                            <Container className="text-center bg-white p-5 col-sm-12 col-md-9">
                                                <Row>
                                                    <Col>
                                                        {/* <Image src={"https://www.flight.wagnistrip.com/assets/images/flights/no_flit.png"} alt="Map" fluid className="mb-3" style={{ maxWidth: '300px' }} /> */}
                                                        {/* <h3 className="text-primary">NO FLIGHTS FOUND</h3> */}
                                                        <FaFilterCircleXmark size={160} />
                                                        <h3 className="text-primary">Multiple Filters applied</h3>
                                                        <p style={{ fontSize: '13px' }} className='p-0'>Please try different filters or remove or adjust this one to get a result.</p>
                                                        <button className='btn btn-link text-primary' onClick={() => removeFilter()}>Clear all filters</button>
                                                    </Col>
                                                </Row>
                                            </Container>

                                        )
                                    }

                                </div>

                            </div>

                        </div>
                    </div>

                )
            }

            {
                bookingStatus ? (<FareDetails />) : null

            }
            {(responseData.tripType === 'roundtrip' && responseData.trip === 'D') && (
                <div className='sticky-bottom'>
                    <BottomNavbar handleBookNow={handleBookNow} selectedDeparture={selectedDeparture} selectedReturn={selectedReturn} currency={formData && formData.currency && formData.currency.currency_symbol} adult={formData && formData?.travellers && formData?.travellers?.adults} child={formData && formData?.travellers && formData?.travellers?.children} infant={formData && formData?.travellers && formData?.travellers?.infants} trip={responseData?.trip} chips={responseData?.chips} extra_discount={responseData && responseData?.extra_discount} />
                </div>
            )}

        </>
    )
}

export default FlightDetail