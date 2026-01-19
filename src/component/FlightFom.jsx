import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import "./Flightform.css"
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaPlaneArrival } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";
import LoadingBar from 'react-top-loading-bar';
import DatePicker from 'react-multi-date-picker';
import LoadingComponents from './LoadingComponents'
import { decryptPayload, fetchAirlineCodes, galileoApi } from '../Api/apiService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAirportDataByCountry } from '../utils/airlineUtils';
import { useMediaQuery } from '@mui/material';
import TopNavbar from './topNavbar';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
function Flightform({ existingData, type = '' }) {

  const location = useLocation();

  // Check if current route is homepage
  const isHome = location.pathname === "/";

  const user = useSelector((state) => state.auth.user);
  const datePrices = {
    "2025-01-25": "$100",
    "2025-01-26": "$120",
    "2025-01-27": "$95",
    "2025-01-28": "$130",
  };
  const specialFlightData = [
    {
      "origin_code": "DEL",
      "destination_code": "BOM",
      "origin": "New Delhi",
      "destination": "Mumbai (Bombay)",
      "departure_time": "2025-10-01T09:45:00.000000Z"
    }
  ];

  const availableSpecialDates = [
    ...new Set(specialFlightData.map(f => f.departure_time.split("T")[0]))
  ];

  const datePickerRef = useRef();
  const returnDatePickerRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const navigate = useNavigate();
  const [airlineData, setAirlineData] = useState([]);
  const [openModalId, setOpenModalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFromCountry, setSelectedFromCountry] = useState({
    "iata": "DEL",
    "text": "New Delhi\n (DEL) \n Delhi India\nIndira Gandhi International Airport",
    "head": "New Delhi\n India",
    "airport": "Indira Gandhi International Airport",
    "city": "New Delhi",
    "state": "Delhi",
    "country": "India"
  });
  const [selectedToCountry, setSelectedToCountry] = useState({
    "iata": "BOM",
    "text": "Mumbai\n (BOM) \n Maharashtra India\nChhatrapati Shivaji International Airport",
    "head": "Mumbai\n India",
    "airport": "Chhatrapati Shivaji International Airport",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  });
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [flightOptions, setFlightOptions] = useState({
    tripSelection: "oneway",
    cabinClass: "Y",
    flightFare: "ADT",
    departureDate: dayjs().add(1, "day"),
    returnDate: null,
  });
  const totalPassengers = adultCount + childCount + infantCount;

  const [formData, setFormData] = useState({
    destination: "",
    journeyDate: "29 Sep 25",
    returnDate: "30 Sep 25",
    rooms: 4,
    adults: 2,
    children: 2,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      destination: formData.destination,
      journeyDate: formData.journeyDate,
      returnDate: formData.returnDate,
      rooms: formData.rooms,
      adults: formData.adults,
      children: formData.children,
    }).toString();

    // redirect to hotel.wagnistrip.com with params
    window.location.href = `http://localhost:3000/hotel-list/?${queryParams}`;
  };


  const updatePassengerCount = (type, action) => {
    let newAdultCount = adultCount;
    let newChildCount = childCount;
    let newInfantCount = infantCount;

    const maxTotalWithoutInfant = 9; // adults + children

    if (action === "increment") {
      if (type === "adult") {
        if (newAdultCount + newChildCount < maxTotalWithoutInfant) {
          newAdultCount += 1;
        } else {
          // Show error: Max 9 passengers (excluding infants)
          return;
        }
      }

      if (type === "child") {
        if (newAdultCount + newChildCount < maxTotalWithoutInfant) {
          newChildCount += 1;
        } else {
          // Show error: Max 9 passengers (excluding infants)
          return;
        }
      }

      if (type === "infant") {
        if (newInfantCount < newAdultCount) {
          newInfantCount += 1;
        } else {
          // Show error: Infants cannot exceed adults
          return;
        }
      }
    } else if (action === "decrement") {
      if (type === "adult" && newAdultCount > 1) {
        newAdultCount -= 1;

        // Adjust children and infants if they exceed new adult limit
        if (newChildCount > maxTotalWithoutInfant - newAdultCount) {
          newChildCount = maxTotalWithoutInfant - newAdultCount;
        }
        if (newInfantCount > newAdultCount) {
          newInfantCount = newAdultCount;
        }
      }

      if (type === "child" && newChildCount > 0) {
        newChildCount -= 1;
      }

      if (type === "infant" && newInfantCount > 0) {
        newInfantCount -= 1;
      }
    }

    // Final constraints
    if (newAdultCount + newChildCount > maxTotalWithoutInfant) {
      newChildCount = maxTotalWithoutInfant - newAdultCount;
    }
    if (newInfantCount > newAdultCount) {
      newInfantCount = newAdultCount;
    }

    // Update state
    setAdultCount(newAdultCount);
    setChildCount(newChildCount);
    setInfantCount(newInfantCount);
  };







  const selectCabinClass = (key, value) => {
    setFlightOptions((prev) => {
      let updatedFlightOptions = { ...prev, [key]: value };

      if (key === "tripSelection") {
        if (value === "roundtrip") {
          // Set return date = departure date + 1 day
          updatedFlightOptions.returnDate = prev.departureDate
            ? prev.departureDate.add(1, "day")
            : dayjs().add(1, "day");
        } else {
          // Reset return date for one-way
          updatedFlightOptions.returnDate = null;
        }
      }



      return updatedFlightOptions;
    });
  };


  const selectFare = (fareType) => {
    setFlightOptions((prev) => ({
      ...prev,
      flightFare: fareType,
    }));
  };




  const toggleModal = (modalId) => {
    const allModals = document.querySelectorAll('.dropdown-modal');
    const modal = document.getElementById(modalId);




    // Close all other modals
    allModals.forEach((m) => {
      if (m.id !== modalId) {
        m.style.display = 'none';
      }
    });




    // Toggle current modal
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
      setTimeout(() => {
        document.getElementById(`${modalId}Input`).focus();
      }, 0); // Focus the input field
    }
  };


  const fetchData = useCallback((query = '', type) => {
    const result = fetchAirlineCodes(query); // sync
    setAirlineData(result);
  }, []);



  const debouncedFetchData = useCallback(debounce(fetchData, 500), []);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchData(value, type);
  };








  const handleSelect = (item, type) => {
    if (type === 'from') {
      setSelectedFromCountry(item);
    } else if (type === 'to') {
      setSelectedToCountry(item);
    }




    toggleModal(type === 'from' ? 'fromModal' : 'toModal'); // Close the modal
  };




  const handleModalOpen = (modalId, type) => {
    const modal = document.getElementById(modalId);




    // Close all other modals
    document.querySelectorAll('.dropdown-modal').forEach((m) => {
      if (m.id !== modalId) {
        m.style.display = 'none';
      }
    });




    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
      setOpenModalId(null); // No modal is open
    } else {
      modal.style.display = 'flex';
      setOpenModalId(modalId); // Track the open modal
      setSearchQuery(''); // Clear the search query
      setLoading(true); // Show loading spinner initially
      // fetchAirlineCodes('').then((data) => {
      //   setAirlineData(data || []);
      //   setLoading(false); // Hide loading spinner
      // });

      const data = fetchAirlineCodes('');
      setAirlineData(data || []);
      setLoading(false); // Hide loading spinner
      setTimeout(() => {
        document.getElementById(`${type}Input`).focus();
      }, 0); // Focus the input field
    }
  };




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openModalId) {
        const modal = document.getElementById(openModalId);
        if (modal && !modal.contains(event.target)) {
          modal.style.display = 'none'; // Close the modal
          setOpenModalId(null); // Reset open modal ID
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModalId]);




  const handleDateChange = (key, value) => {
    setFlightOptions((prev) => ({
      ...prev,
      [key]: value ? dayjs(value) : null,  // Use dayjs to ensure the return is a dayjs object
    }));
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check flightFare conditions
    if (["arms", "SRC", "STU"].includes(flightOptions.flightFare) && (childCount > 0 || infantCount > 0)) {
      alert("For selected fare type, children and infants are not allowed.");
      return; // Stop the form submission
    }


    if (selectedFromCountry?.iata === selectedToCountry?.iata) {
      alert("Origin and destination cannot be the same.");
      return;
    }
    ref.current.continuousStart();


    // Get the current date
    const currentDate = dayjs().startOf("day");


    // Format the departure date
    let departureDate = flightOptions?.departureDate ? dayjs(flightOptions.departureDate) : dayjs();


    // Check if departure date is in the past
    if (departureDate.isBefore(currentDate, "day")) {
      alert("Departure date cannot be before today.");
      return;
    }


    // Format the return date (if applicable)
    const returnDate = flightOptions?.tripSelection === "oneway" ? null : dayjs(flightOptions.returnDate);


    // Check if return date is before or on the same day as departure date
    if (returnDate && (returnDate.isSame(departureDate, "day") || returnDate.isBefore(departureDate, "day"))) {
      alert("Return date must be greater than departure date.");
      return;
    }




    const formData = {
      tripType: flightOptions?.tripSelection ? flightOptions?.tripSelection : 'oneway',
      departure: selectedFromCountry ? selectedFromCountry.iata : 'DEL',
      arrival: selectedToCountry ? selectedToCountry.iata : 'BOM',
      departureDate: departureDate.format('YYYY-MM-DD'),
      returnDate: returnDate ? returnDate.format('YYYY-MM-DD') : null,
      noOfAdults: adultCount ? adultCount : 1,
      noOfChilds: childCount,
      noOfInfants: infantCount,
      cabinClass: flightOptions?.cabinClass ? flightOptions?.cabinClass : 'Y',
      flightFare: flightOptions.flightFare ? flightOptions?.flightFare : 'ADT',
      CCODE: 'IN',
      curr: 'INR',
      apptype: user && user?.users.role === 2 ? 'B2B' : 'B2C',
      usertype: user && user?.users.role === 2 && user?.users.agent_type === "B" ? 'intermediate' : user?.users.agent_type === "A" ? 'beginer' : 'guest'
    };
    if (infantCount > 0 && type === "specailFlight") {
      toast.error("don't select infant");
      return;
    }


    console.log("request data for flight search =>", formData);
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('arivalData', JSON.stringify(selectedToCountry));
    localStorage.setItem('departureData', JSON.stringify(selectedFromCountry));


    if (user && user?.users?.role === 2 && user && user?.users.status === 0) {
      navigate("/agent/registration");
      return
    }
    setLoading1(true);



    const queryString = new URLSearchParams(formData).toString();
    const token = (user && user.users && user.users.role === 2)
      ? user.token
      : null;


    try {
      if (type === "specailFlight") {

        const response = await galileoApi("/specialFlight/search", formData, token);
        const decryptedResponse1 = decryptPayload(response?.data || "");
        const responseData1 = JSON.parse(decryptedResponse1);

        if (responseData1?.status === 200) {
          navigate(`/SpecialFlightCard?${queryString}`, { state: { spldata: responseData1 } });
          return;
        } else if (responseData1?.status === 403) {
          navigate(`/SpecialFlightCard?${queryString}`, { state: { spldata: responseData1 } });
          return
        } else {
          return
        }
      }


      console.log("dklldk =? ", formData);

      const responseData1 = await galileoApi("/flight/search", formData, token);
      if (responseData1?.tripType === 'oneway' && responseData1.status === 200) {
        // console.log("flight data go to  :", responseData1);
        const responseData = {
          travellers: responseData1.travellers,
          amadeus: responseData1.amadeus[0],
          currency: responseData1.currency,
          galileo: responseData1?.galileo[0]?.LowFareSearchRsp,
          tripType: responseData1?.tripType,
          trip: responseData1.trip,
          flightFare: responseData1?.flightfare,
          hostToken: responseData1.hostToken,
          coupons: responseData1?.coupons,
          chips: responseData1?.chips,
          extra_discount: responseData1?.extraChips,
          specialFare: responseData1?.data || null,
          IQtoken: responseData1?.IQtoken || null,
          booking_token_id: responseData1?.booking_token_id || null
        }
        // console.log("flight design  :", responseData);
        navigate(`/flightdetails?${queryString}`, { state: { responseData } })


      }
      else {
        {
          // console.log("flight data go to  :", responseData1);
          const responseData = {
            travellers: responseData1.travellers,
            amadeus: responseData1.amadeus,
            currency: responseData1.currency,
            galileo: Array.isArray(responseData1?.galileo)
              ? (responseData1.galileo.length > 150
                ? responseData1.galileo.slice(0, 150)
                : responseData1.galileo)
              : [],
            // galileo: responseData1?.galileo,
            tripType: responseData1?.tripType,
            trip: responseData1.trip,
            flightFare: responseData1?.flightfare,
            hostToken: responseData1.hostToken,
            coupons: responseData1?.coupons,
            chips: responseData1?.chips,
            extra_discount: responseData1?.extraChips,


          }
          // console.log("flight design  :", responseData);
          navigate(`/flightdetails?${queryString}`, { state: { responseData } })








        }
      }
















    } catch (error) {
      console.error('Error fetching flight details:', error);
    } finally {
      setLoading1(false);
      ref.current.complete();








    }
  };

  const handleExchangeClick = () => {
    setSelectedFromCountry(selectedToCountry);
    setSelectedToCountry(selectedFromCountry);
  };





  const currentNum = user && user?.users.agent_type === 'C' ? 0 : 1;


  useEffect(() => {
    if (existingData) {

      const dubaiSector = {
        iata: "DXB",
        text: "Dubai\n (DXB) \n Dubai United Arab Emirates\nDubai International Airport",
        head: "Dubai\n United Arab Emirates",
        airport: "Dubai International Airport",
        city: "Dubai",
        state: "Dubai",
        country: "United Arab Emirates"
      };
      const mumbaiSector = {
        "iata": "BOM",
        "text": "Mumbai\n (BOM) \n Maharashtra India\nChhatrapati Shivaji International Airport",
        "head": "Mumbai\n India",
        "airport": "Chhatrapati Shivaji International Airport",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India"
      };


      // this is testing start 
      const currentDate = dayjs().startOf("day"); // today's start
      const minAllowedDate = currentDate.add(1, "day"); // today + 1
      let departureDate = existingData.departureDate ? dayjs(existingData.departureDate) : currentDate.add(currentNum, "day");

      // If departureDate is less than (today + 1), update it to (today + 2)
      if (departureDate.isBefore(minAllowedDate, "day")) {
        departureDate = currentDate.add(currentNum, "day");
      }

      let returnDate = existingData.returnDate ? dayjs(existingData.returnDate) : null;

      // If return date exists but is before or equal to departure date, set it to departure date + 1 day
      if (returnDate && (returnDate.isSame(departureDate, "day") || returnDate.isBefore(departureDate, "day"))) {
        returnDate = departureDate.add(1, "day");
      }

      // end ----------

      setFlightOptions({
        tripSelection: existingData.tripType || "oneway",
        cabinClass: existingData.cabinClass || "Y",
        flightFare: existingData.flightFare === 'regular' ? 'ADT' : existingData.flightFare || "ADT",
        departureDate: departureDate,
        returnDate: returnDate
      });




      const departureAirport = existingData?.departure || "DEL";
      const arrivalAirport = existingData?.arrival || "DEL";
      const arrivalData = getAirportDataByCountry(arrivalAirport, "all");
      const departureData = getAirportDataByCountry(departureAirport, "all");
      if (location.pathname === "/international-flights") {
        setSelectedToCountry(dubaiSector);
      } else if (location.pathname === "/domestic-flights") {
        setSelectedToCountry(mumbaiSector);
      } else {
        setSelectedToCountry(arrivalData);
      }
      setSelectedFromCountry(departureData);
      // setSelectedToCountry(arrivalData);

      setAdultCount(existingData.noOfAdults ?? 1);
      setChildCount(existingData.noOfChilds ?? 0);
      setInfantCount(existingData.noOfInfants ?? 0);
    }
  }, [existingData]);





  return (


    <>
      <LoadingBar color="#8B3EEA" ref={ref} />


      {
        loading1 ? (<LoadingComponents />) : null
      }


      <LocalizationProvider dateAdapter={AdapterDayjs}>




        <section id="theme_search_form">
          <div className="container">

            <div style={{ position: 'relative' }} className="flight-form-section">


              <div
                className="container d-none d-md-block sec-1"
                style={{
                  backgroundColor: '#fff',
                  position: 'absolute',
                  top: '-45px',
                  left: 50,
                  right: 50,
                  zIndex: '1',
                  width: '53%',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '20px 30px',
                }}
              >

                <TopNavbar />
              </div>


              <div className=' flight-form-inner-sec' role="tablist">
                <div className='d-flex gap-3 ' role='presentation' >
                  <div className=" nav-link active"
                    id="flights-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#flights"
                    type="button"
                    role="tab"
                    aria-controls="flights"
                    aria-selected="true"><span><MdOutlineFlightTakeoff size={23} /></span>Flights </div>

                  {/* 
                  <div className=" nav-link"
                    id="hotels-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#hotels"
                    type="button"
                    role="tab"
                    aria-controls="hotels"
                    aria-selected="false">  <span><FaHotel size={23} /></span>Hotels</div> */}


                </div>
                <div className=' form-trip-sec' style={{ fontSize: "16px", fontWeight: "500", padding: "8px 15px" }}>
                  <div onClick={() => selectCabinClass("tripSelection", "oneway")} className='form-inner-trip' style={{
                    color: flightOptions.tripSelection === "oneway" ? "var(--main-color)" : "#808080",
                    cursor: "pointer",
                  }}>One Way</div>
                  <div onClick={() => selectCabinClass("tripSelection", "roundtrip")} style={{
                    color: flightOptions.tripSelection === "roundtrip" ? "var(--main-color)" : "#808080",
                    cursor: "pointer",
                  }} className='form-inner-trip' >Roundtrip</div>

                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="flights"
                  role="tabpanel"
                  aria-labelledby="flights-tab"
                >
                  <div className="row mt-4 d-flex"
                  >


                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <div className="flight_Search_boxed" onClick={() => handleModalOpen('fromModal', 'from')}>
                        <p className="form-p">From</p>
                        <h3>{selectedFromCountry.city}</h3>
                        <div className='d-flex align-items-center justify-content-start'>
                          <strong className="fw-bold">{selectedFromCountry.iata}</strong>, <span>{selectedFromCountry.airport}</span>
                        </div>
                        <div className="plan_icon_posation">
                          <i className="fas fa-plane-departure"></i>
                        </div>




                        <div id="fromModal" className="dropdown-modal" onClick={(e) => e.stopPropagation()}>
                          <div className="dropdown-content p-0 bg-white">
                            <input
                              id="fromInput"
                              style={{ height: '60px' }}
                              type="text"
                              className="search-inputs shadow-lg px-2 fs-6 w-100"
                              placeholder="Search cities..."
                              value={searchQuery}
                              onChange={handleInputChange}




                            />




                            {loading ? (
                              <div className="loading-indicator p-3 text-center">Loading...</div>
                            ) : (
                              <ul id="fromList" className="fromList bg-white">
                                {airlineData.map((item, index) => (
                                  <li style={{ borderBottom: '1px solid #ddd' }} key={index} onClick={() => handleSelect(item, 'from')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="d-flex gap-2 w-100 align-items-start justify-content-start">
                                        <div className="pt-1">
                                          <FaPlaneDeparture className="text-muted" size={18} />
                                        </div>
                                        <div className="d-inline-block text-start">
                                          <div className="d-flex text-black fw-medium">
                                            <span>
                                              {`${item.city}, ${item.country}`.length > 36
                                                ? `${item.city}, ${item.country}`.slice(0, 36) + '...'
                                                : `${item.city}, ${item.country}`}
                                            </span>
                                          </div>
                                          <span>
                                            {item?.airport.length > 30
                                              ? item.airport.slice(0, 40) + '...'
                                              : item.airport}
                                          </span>
                                        </div>
                                      </div>
                                      <strong>{item.iata}</strong>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )
                            }




                          </div>








                        </div>
                      </div>
                    </div>



                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <div className="flight_Search_boxed">
                        <p className="form-p">To</p>
                        <h3 onClick={() => handleModalOpen('toModal', 'to')}>{selectedToCountry?.city}</h3>
                        <div className='d-flex align-items-center justify-content-start'>
                          <strong className="fw-bold">{selectedToCountry?.iata}</strong>, <span>{selectedToCountry?.airport}</span>
                        </div>
                        <div className="plan_icon_posation">
                          <i className="fas fa-plane-arrival"></i>
                        </div>
                        <div onClick={handleExchangeClick} className="range_plan d-none d-md-block ">
                          <i className="fas fa-exchange-alt"></i>
                        </div>
                        <div id="toModal" className="dropdown-modal" onClick={(e) => e.stopPropagation()}>
                          <div className="dropdown-content p-0 bg-white">
                            <input
                              id="toInput"
                              style={{ height: '60px' }}
                              type="text"
                              className="search-inputs shadow-lg px-2 fs-6 w-100"
                              placeholder="Search cities..."
                              value={searchQuery}
                              onChange={handleInputChange}
                            />




                            {loading ? (
                              <div className="loading-indicator p-3 text-center">Loading...</div>
                            ) : (<ul id="toList" className="fromList bg-white">
                              {airlineData.map((item, index) => (
                                <li style={{ borderBottom: '1px solid #ddd' }} key={index} onClick={() => handleSelect(item, 'to')}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex gap-2 w-100 align-items-start justify-content-start">
                                      <div className="pt-1">
                                        <FaPlaneArrival className="text-muted" size={18} />
                                      </div>
                                      <div className="d-inline-block text-start">
                                        <div className="d-flex text-black fw-medium">
                                          <span>
                                            {`${item.city}, ${item.country}`.length > 36
                                              ? `${item.city}, ${item.country}`.slice(0, 36) + '...'
                                              : `${item.city}, ${item.country}`}
                                          </span>
                                        </div>
                                        <span>
                                          {item?.airport.length > 30
                                            ? item.airport.slice(0, 40) + '...'
                                            : item.airport}
                                        </span>
                                      </div>
                                    </div>
                                    <strong>{item?.iata}</strong>
                                  </div>
                                </li>
                              ))}
                            </ul>)}




                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="form_search_date">
                        <div className="flight_Search_boxed d-lg-flex d-block justify-content-start gap-5 date_flex_area">
                          {/* Departure Date Section */}




                          <div style={{ position: "relative" }} className="Journey_date pl-3">
                            <p className="form-p">Departure date</p>








                            <div
                              style={{ cursor: "pointer" }}
                              className="d-flex align-items-center justify-content-start fs-3"
                              onClick={() => datePickerRef.current?.openCalendar()} // Open directly
                            >
                              <h3 className="">
                                {flightOptions.departureDate
                                  ? new Date(flightOptions.departureDate).getDate()
                                  : "--"}
                              </h3>{" "}
                              <h4 className="fw-normal">
                                {flightOptions.departureDate
                                  ? new Date(flightOptions.departureDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "2-digit",
                                  })
                                  : "MM'YY"}
                              </h4>
                            </div>








                            <span>
                              {flightOptions?.departureDate
                                ? new Date(flightOptions.departureDate).toLocaleDateString("en-US", {
                                  weekday: "long",
                                })
                                : ""}
                            </span>












                            <div>
                              <DatePicker
                                ref={datePickerRef}
                                value={flightOptions.departureDate.toDate()}
                                onChange={(date) => {
                                  handleDateChange("departureDate", date);
                                }}
                                showDaysOutsideCurrentMonth
                                numberOfMonths={isSmallScreen ? 1 : 2}
                                minDate={
                                  user && user?.users.agent_type === 'C' ? dayjs().startOf("day").toDate() : new Date(new Date().setDate(new Date().getDate() + 0))
                                }
                                // minDate={new Date(new Date().setDate(new Date().getDate() + 0))}
                                // minDate={dayjs().startOf("day").toDate()}
                                containerStyle={{
                                  position: "absolute",
                                  zIndex: 1000,
                                  top: 50,
                                  left: 0,
                                  visibility: "hidden",
                                }}
                                className="custom-calendar"
                                mapDays={({ date }) => {
                                  const formattedDate = date.format("YYYY-MM-DD");
                                  const price = datePrices[formattedDate] || "--";

                                  if (type === "Raushan") {
                                    const isAvailable = availableSpecialDates.includes(formattedDate);

                                    return {
                                      disabled: !isAvailable,
                                      className: isAvailable ? "available-date" : "unavailable-date",
                                      children: (
                                        <div style={{ textAlign: "center" }}>
                                          <div>{date.day}</div>
                                          <div
                                            style={{
                                              fontSize: "10px",
                                              color: isAvailable ? "green" : "red",
                                            }}
                                          >
                                            {isAvailable ? price : "X"}
                                          </div>
                                        </div>
                                      ),
                                    };
                                  }

                                  return {
                                    children: (
                                      <div style={{ textAlign: "center" }}>
                                        <div>{date.day}</div>
                                        <div style={{ fontSize: "10px", color: "green" }}>{price}</div>
                                      </div>
                                    ),
                                  };
                                }}
                              />

                            </div>
                          </div>




                          {/* Arrival Date Section */}
                          <div style={{ position: "relative" }} className="Journey_date pl-3">
                            <p className="form-p">Arrival date</p>
                            {flightOptions.tripSelection === "roundtrip" ? (
                              <div style={{ position: "relative" }}>
                                {/* Click to Open DatePicker Directly */}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="d-flex align-items-center justify-content-start fs-3"
                                  onClick={() => returnDatePickerRef.current?.openCalendar()} // Open directly
                                >
                                  <h3 className="">
                                    {flightOptions.returnDate && dayjs.isDayjs(flightOptions.returnDate)
                                      ? flightOptions.returnDate.date()
                                      : "--"}
                                  </h3>{" "}
                                  <h4 className="fw-normal">
                                    {flightOptions.returnDate && dayjs.isDayjs(flightOptions.returnDate)
                                      ? flightOptions.returnDate.format("MMM YY")
                                      : "MM'YY"}
                                  </h4>
                                </div>




                                {/* Weekday Display */}
                                <span>
                                  {flightOptions?.returnDate && dayjs.isDayjs(flightOptions.returnDate)
                                    ? flightOptions.returnDate.format("dddd")
                                    : ""}
                                </span>








                                <div >
                                  <DatePicker
                                    ref={returnDatePickerRef}
                                    value={flightOptions.returnDate ? flightOptions.returnDate.toDate() : null}
                                    onChange={(date) => {
                                      handleDateChange("returnDate", date);
                                    }}
                                    minDate={flightOptions.departureDate ? new Date(flightOptions.departureDate) : new Date()} // Ensures minDate is set
                                    showDaysOutsideCurrentMonth
                                    numberOfMonths={isSmallScreen ? 1 : 2}
                                    containerStyle={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      top: 30,
                                      left: 0,
                                      visibility: "hidden",
                                    }}
                                    className="custom-calendar"
                                    mapDays={({ date }) => {
                                      const formattedDate = date.format("YYYY-MM-DD");
                                      const price = datePrices[formattedDate] || "--"; // Default price if not found




                                      return {
                                        children: (
                                          <div style={{ textAlign: "center" }}>
                                            <div>{date.day}</div>
                                            <div style={{ fontSize: "10px", color: "green" }}>{price}</div>
                                          </div>
                                        ),
                                      };
                                    }}
                                  />
                                </div>




                                {/* Close Button */}
                                <div
                                  style={{ position: "absolute", top: "-20px", right: "-60px" }}
                                  className="offcanvas_off d-none d-md-flex"
                                >
                                  <button
                                    onClick={() => selectCabinClass("tripSelection", "oneway")}
                                    type="button"
                                    className="btn-close text-reset"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                  ></button>
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{ cursor: "pointer" }}
                                className="d-flex align-items-center justify-content-start fs-3"
                                onClick={() => selectCabinClass("tripSelection", "roundtrip")}
                              >
                                <h3 style={{ fontSize: "14px" }} className="text-muted">
                                  Select return <br /> date for big discount
                                </h3>
                              </div>
                            )}
                          </div>








                        </div>








                      </div>
                    </div>



                    <div className="col-lg-2  col-md-6 col-sm-12 col-12">
                      <div className="flight_Search_boxed dropdown_passenger_area">
                        <p className='d-flex align-item-center form-p'>Passenger, ClassName </p>
                        <div className="dropdown">
                          <button
                            className="final-count"
                            data-toggle="dropdown"
                            type="button"
                            id="dropdownMenuButton1"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                          >
                            {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
                          </button>
                          <div
                            className="dropdown-menu dropdown_passenger_info"
                            aria-labelledby="dropdownMenuButton1"
                            onClick={(e) => e.stopPropagation()} // Prevent closing on button clicks inside
                          >
                            <div className="traveller-calulate-persons">
                              <div className="passengers">
                                <h6>Passengers</h6>
                                <div className="passengers-types">
                                  {/* Adults */}
                                  <div className="passengers-type">
                                    <div className="text">
                                      <span className="count pcount">{adultCount}</span>
                                      <div className="type-label">
                                        <p className="form-p">Adult</p>
                                        <span>12+ yrs</span>
                                      </div>
                                    </div>
                                    <div className="button-set">




                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('adult', 'decrement');
                                        }}
                                        type="button"
                                        className="btn-subtract"
                                      >
                                        <i className="fas fa-minus" style={{ fontWeight: 'bold' }} />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('adult', 'increment');
                                        }}
                                        type="button"
                                        className="btn-add"
                                      >
                                        <i className="fas fa-plus" style={{ fontWeight: '900' }} />
                                      </button>
                                    </div>
                                  </div>




                                  {/* Children */}
                                  <div className="passengers-type">
                                    <div className="text">
                                      <span className="count ccount">{childCount}</span>
                                      <div className="type-label">
                                        <p className="fz14 mb-xs-0 form-p">Children</p>
                                        <span>2 - Less than 12 yrs</span>
                                      </div>
                                    </div>
                                    <div className="button-set">




                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('child', 'decrement');
                                        }}
                                        type="button"
                                        className="btn-subtract-c"
                                      >
                                        <i className="fas fa-minus" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('child', 'increment');
                                        }}
                                        type="button"
                                        className="btn-add-c"
                                      >
                                        <i className="fas fa-plus" />
                                      </button>
                                    </div>
                                  </div>




                                  {/* Infants */}
                                  <div className="passengers-type">
                                    <div className="text">
                                      <span className="count incount">{infantCount}</span>
                                      <div className="type-label">
                                        <p className="fz14 mb-xs-0 form-p">Infant</p>
                                        <span>Less than 2 yrs</span>
                                      </div>
                                    </div>
                                    <div className="button-set">




                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('infant', 'decrement');
                                        }}
                                        type="button"
                                        className="btn-subtract-in"
                                      >
                                        <i className="fas fa-minus" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updatePassengerCount('infant', 'increment');
                                        }}
                                        type="button"
                                        className="btn-add-in"
                                      >
                                        <i className="fas fa-plus" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>




                              <div className="cabin-selection">
                                <h6>Cabin Class</h6>
                                <div className="cabin-list">
                                  <button
                                    type="button"
                                    className={`label-select-btn ${flightOptions.cabinClass === "Y" ? "active" : ""}`}
                                    onClick={() => selectCabinClass("cabinClass", "Y")}
                                  >
                                    <span className="muiButton-label">Economy</span>
                                  </button>
                                  <button
                                    type="button"
                                    className={`label-select-btn  ${flightOptions.cabinClass === "W" ? "active" : ""}`}
                                    onClick={() => selectCabinClass("cabinClass", "W")}
                                  >
                                    <span className="muiButton-label">Premium Economy</span>
                                  </button>
                                  <button
                                    type="button"
                                    className={`label-select-btn ${flightOptions.cabinClass === "C" ? "active" : ""}`}
                                    onClick={() => selectCabinClass("cabinClass", "C")}
                                  >
                                    <span className="muiButton-label">Business</span>
                                  </button>
                                  <button
                                    type="button"
                                    className={`label-select-btn ${flightOptions.cabinClass === "F" ? "active" : ""}`}
                                    onClick={() => selectCabinClass("cabinClass", "F")}
                                  >
                                    <span className="MuiButton-label">First Class</span>
                                  </button>
                                </div>
                              </div>








                              {/* Close Dropdown Button */}
                              <div className="top_form_search_button text-center">




                                <button onClick={() => document.getElementById('dropdownMenuButton1').click()} type='button' className=" btn btn_theme_form btn_md_form text-center py-2 w-100 fs-6  rounded">




                                  Apply




                                </button>
                              </div>
                            </div>
                          </div>
                        </div>




                        <span> {(() => {
                          switch (flightOptions.cabinClass) {
                            case "Y":
                              return "Economy";
                            case "W":
                              return "Premium Economy";
                            case "C":
                              return "Business";
                            case "F":
                              return "First Class";
                            default:
                              return "Unknown Class";
                          }
                        })()}</span>
                      </div>
                    </div>


                  </div>
                  <div className=' w-100 my-3 d-flex flex-wrap gap-3 justify-content-between align-items-center'>
                    <div className="gap-2 d-flex flex-wrap align-items-center justify-content-start">
                      {["ADT", "STU", "SRC"].map((fare) => (
                        <div
                          key={fare}
                          style={{
                            fontSize: "12px",
                            borderRadius: "4px",
                            backgroundColor:
                              flightOptions.flightFare === fare ? "var(--main-color)" : isHome ? 'white' : "transparent",
                            color: flightOptions.flightFare === fare ? "white" : "var(--black-color)",
                            border:
                              "1px solid var(--main-color)",
                            cursor: "pointer",
                          }}
                          className="btn py-1 px-2"
                          onClick={() => selectFare(fare)}
                        >
                          {fare === "ADT"
                            ? "Regular Fares"
                            // : fare === "arms"
                            //   ? "Armed Force Fares"
                            : fare === "STU"
                              ? "Student Fares"
                              : "Senior Citizen Fares"}
                        </div>
                      ))}
                    </div>




                    <Link to="/web-check-in">
                      <button style={{ fontSize: '12px' }} className='btn btn_theme py-2 btn_md'>
                        Web Checking
                      </button></Link>
                  </div>
                  <div className="top_form_search_button d-flex align-items-center justify-content-center"><button onClick={handleSubmit} type='button' style={{ width: isSmallScreen ? "100%" : 'fit' }} className="btn btn_theme btn_md">{loading1 ? <span className='gap-2 d-flex align-items-center justify-content-center'> <i className="fa fa-spinner fa-spin"></i>Loading</span> : 'Search'}</button></div>
                </div>


                <div
                  className="tab-pane fade"
                  id="hotels"
                  role="tabpanel"
                  aria-labelledby="hotels-tab"
                >
                  <div className="row mt-4">
                    <div className="col-lg-12">
                      <div className="tour_search_form">
                        <form>
                          <div className="row">
                            {/* Destination with Dropdown */}
                            <div className="col-lg-5 col-md-12 col-sm-12 col-12">
                              <div className="flight_Search_boxed dropdown_passenger_area">
                                <p>Destination</p>
                                <div className="dropdown">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Where are you going?"
                                    value={formData.destination}
                                    onChange={(e) => handleChange("destination", e.target.value)}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  />
                                  <ul className="dropdown-menu w-100">
                                    {["New Delhi", "Mumbai", "Bangalore", "Goa"].map((city) => (
                                      <li key={city}>
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() => handleChange("destination", city)}
                                        >
                                          {city}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <span>Select a destination</span>
                              </div>
                            </div>

                            {/* Journey Dates */}
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                              <div className="form_search_date">
                                <div className="flight_Search_boxed d-block d-lg-flex date_flex_area">
                                  <div className="Journey_date">
                                    <p>Journey date</p>
                                    <div
                                      style={{ cursor: "pointer" }}
                                      className="d-flex align-items-center justify-content-start fs-3"
                                    >
                                      <h3
                                        style={{ fontSize: "22px" }}
                                        className="fw-normal py-1"
                                      >
                                        29 Aug 25
                                      </h3>
                                    </div>
                                    <span>Thursday</span>
                                  </div>
                                  <div className="Journey_date ms-lg-3">
                                    <p>Return date</p>
                                    <div
                                      style={{ cursor: "pointer" }}
                                      className="d-flex align-items-center justify-content-start fs-3"
                                    >
                                      <h3
                                        style={{ fontSize: "22px" }}
                                        className="fw-normal py-1"
                                      >
                                        30 Aug 25
                                      </h3>
                                    </div>
                                    <span>Friday</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Room Dropdown with Increment/Decrement */}
                            <div className="col-lg-2 col-md-6 col-sm-12 col-12">
                              <div className="flight_Search_boxed dropdown_passenger_area">
                                <p>Room</p>
                                <div className="dropdown">
                                  <button
                                    className="dropdown-toggle final-count"
                                    type="button"
                                    id="dropdownMenuRooms"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    1 Room
                                  </button>
                                  <div
                                    className="dropdown-menu dropdown_passenger_info p-3"
                                    aria-labelledby="dropdownMenuRooms"
                                  >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span>Rooms</span>
                                      <div>
                                        <button type="button" className="btn btn-sm btn-outline-primary me-2">
                                          <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="fw-bold">1</span>
                                        <button type="button" className="btn btn-sm btn-outline-primary ms-2">
                                          <i className="fas fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span>Number of rooms</span>
                              </div>
                            </div>

                            {/* Passenger Dropdown */}
                            <div className="col-lg-2  col-md-6 col-sm-12 col-12">
                              <div className="flight_Search_boxed dropdown_passenger_area">
                                <p>Passenger, Class</p>
                                <div className="dropdown">
                                  <button
                                    className="dropdown-toggle final-count"
                                    data-toggle="dropdown"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    1 Passenger
                                  </button>
                                  <div
                                    className="dropdown-menu dropdown_passenger_info"
                                    aria-labelledby="dropdownMenuButton1"
                                  >
                                    <div className="traveller-calulate-persons">
                                      <div className="passengers">
                                        <h6>Passengers</h6>
                                        <div className="passengers-types">
                                          <div className="passengers-type">
                                            <div className="text">
                                              <span className="count pcount">2</span>
                                              <div className="type-label">
                                                <p>Adult</p>
                                                <span>12+ yrs</span>
                                              </div>
                                            </div>
                                            <div className="button-set">
                                              <button type="button" className="btn-add">
                                                <i className="fas fa-plus" />
                                              </button>
                                              <button type="button" className="btn-subtract">
                                                <i className="fas fa-minus" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="passengers-type">
                                            <div className="text">
                                              <span className="count ccount">0</span>
                                              <div className="type-label">
                                                <p className="fz14 mb-xs-0">Children</p>
                                                <span>2 - Less than 12 yrs</span>
                                              </div>
                                            </div>
                                            <div className="button-set">
                                              <button type="button" className="btn-add-c">
                                                <i className="fas fa-plus" />
                                              </button>
                                              <button type="button" className="btn-subtract-c">
                                                <i className="fas fa-minus" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="me-2">1 Adult</span>
                                  <span>2 Child</span>
                                </div>
                              </div>
                            </div>

                            {/* Search Button */}
                            <div className="top_form_search_button  d-flex align-items-center justify-content-center mt-4">
                              <button type='button' onClick={handleSearch} className="btn btn_theme btn_md">Search</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>



              </div>


            </div>




          </div>
        </section>


      </LocalizationProvider>
    </>




  )
}




export default Flightform
