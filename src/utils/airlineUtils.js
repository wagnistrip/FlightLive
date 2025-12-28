import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import airportdata from "./data.json";
import airlinesCode from "./airlinesCode.json";
const BASE_URL = "https://admin.wagnistrip.com/public";
export const getAirlineName = (iata_code) => {
  const airline = airlinesCode?.find(
    (airline) => airline.airline_code === iata_code
  );
  return airline ? airline.airline_name : iata_code;
};
// this function is used for merge data
export const processFlightData = (data2) => {
  // console.log(data2,"kldkldkllk");

  const cutoffDate = new Date("2026-02-25");
  const today = new Date();
  if (today > cutoffDate) {
    return [];
  }
  if (!data2) {
    return [];
  }
  // const airPricePoints = data2.airAirPricePointList.airAirPricePoint;
  let airPricePoints = data2.AirPricePointList.AirPricePoint;
  // const airSegments = data2.AirPricePointList.AirPricePoint;

  // Ensure airPricePoints is always an array
  airPricePoints = Array.isArray(airPricePoints)
    ? airPricePoints
    : [airPricePoints];
  const airSegments = data2.AirSegmentList.AirSegment;
  const normalizedAirSegments = Array.isArray(airSegments)
    ? airSegments
    : [airSegments];
  //  airSegments = Array.isArray(airSegments) ? airSegments : [airSegments];
  const flightDetails = data2.FlightDetailsList.FlightDetails;

  const normalizedflightDetails = Array.isArray(flightDetails)
    ? flightDetails
    : [flightDetails];
  let airFareinforeList = data2.FareInfoList.FareInfo;

  // Ensure airFareinforeList is always an array
  airFareinforeList = Array.isArray(airFareinforeList)
    ? airFareinforeList
    : [airFareinforeList];
  // const airFareinforeList = data2.airFareInfoList.airFareInfo;

  const allFlights = [];
  let flightCounter = 1;
  // Iterate over each price point
  airPricePoints.forEach((pricePoint) => {
    // Handle both array and object for airAirPricingInfo (can be single or multiple)
    // console.log("check validation : ",Array.isArray(pricePoint.airAirPricingInfo))
    const airPricingInfos = Array.isArray(pricePoint.AirPricingInfo)
      ? [pricePoint.AirPricingInfo[0]]
      : [pricePoint.AirPricingInfo];

    airPricingInfos.forEach((pricingInfo) => {
      // console.log("check here array: ", pricingInfo)
      const flightOptions = pricingInfo.FlightOptionsList.FlightOption;

      // Ensure airOption is always an array
      const airOptions = Array.isArray(flightOptions.Option)
        ? flightOptions.Option
        : [flightOptions.Option];

      airOptions.forEach((option) => {
        const bookingInfo = option.BookingInfo;
        const segments = Array.isArray(bookingInfo)
          ? bookingInfo.map((info) => info["@attributes"].SegmentRef)
          : [bookingInfo["@attributes"].SegmentRef];

        const cabinService = Array.isArray(bookingInfo)
          ? bookingInfo.map((info) => info["@attributes"].CabinClass)
          : [bookingInfo["@attributes"].CabinClass];
        const bookingCode = Array.isArray(bookingInfo)
          ? bookingInfo.map((info) => info["@attributes"].BookingCode)
          : [bookingInfo["@attributes"].BookingCode];

        // Extract fareInfo references
        const fareInfoRefs = Array.isArray(bookingInfo)
          ? bookingInfo.map((info) => info["@attributes"].FareInfoRef)
          : [bookingInfo["@attributes"].FareInfoRef];

        // Construct the flight detail object
        const flightDetail = {
          FlightKey: flightCounter++,
          cabinService,
          bookingCode,
          PricingInfos: pricePoint,
          // airpriceInfo: {
          //     FareBreakDowns: {
          //         priceStatus: pricingInfo, // Full pricing info object for each passenger type
          //     },
          // },
          segments: segments
            .map((segKey) => {
              // Find the corresponding segment
              const segment = normalizedAirSegments.find(
                (s) => s["@attributes"].Key === segKey
              );
              if (segment) {
                // Check if airFlightDetailsRef and its attributes exist
                const flightDetailsRefKey =
                  segment.FlightDetailsRef?.["@attributes"]?.Key;

                if (flightDetailsRefKey) {
                  // Find the corresponding flight details using the flight details ref key
                  const flightDetail = normalizedflightDetails.find(
                    (fd) => fd["@attributes"].Key === flightDetailsRefKey
                  );

                  return {
                    ...segment,
                    flightDetails: flightDetail || null, // Add flight details to each segment or null if not found
                  };
                }
                return segment;
              }
              return null; // Return null if no segment is found
            })
            .filter(Boolean), // Filter out any null segments

          airFareInfolist: fareInfoRefs
            .map((fareRefKey) => {
              const fareInfo = airFareinforeList.find(
                (f) => f["@attributes"].Key === fareRefKey
              );
              if (fareInfo) {
                return fareInfo;
              }
              return null; // Return null if no fareInfo is found
            })
            .filter(Boolean), // Filter out any null fareInfos
        };

        allFlights.push(flightDetail);
      });
    });
  });

  // Update the state with the combined flight data
  // setFlightData(allFlights);
  return allFlights;
};
// utils.js
export const calculateTravelTime = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);

  // Calculate the difference in milliseconds
  const totalTimeInMillis = arrival - departure;

  // Convert milliseconds to hours and minutes
  const totalHours = Math.floor(totalTimeInMillis / (1000 * 60 * 60));
  const totalMinutes = Math.floor(
    (totalTimeInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${totalHours}h : ${totalMinutes}m`;
};

// utils.js
export const convertMinutesToHoursMinutes = (flightTimeInMinutes) => {
  const hours = Math.floor(flightTimeInMinutes / 60);
  const minutes = flightTimeInMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const calculateTravelDurationIgnoreTimeZone = (
  departureTime,
  arrivalTime
) => {
  // Manually parse the date and time ignoring the timezone
  const parseDateTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };

  // Parse departure and arrival times
  const departure = parseDateTime(departureTime);
  const arrival = parseDateTime(arrivalTime);

  // Calculate the difference in milliseconds
  const differenceInMs = arrival - departure;

  // Convert milliseconds to total minutes
  const totalMinutes = Math.floor(differenceInMs / (1000 * 60));

  // Convert to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export function getBookingCount(airAirPricingInfo, segments) {
  // console.log("getBookingCount", airAirPricingInfo);
  // Extract airFlightOption from airAirPricingInfo with null/undefined checks
  const airFlightOptions =
    airAirPricingInfo?.FlightOptionsList?.FlightOption?.Option;
  // If airFlightOptions is neither array nor object, log an error and return null
  if (!airFlightOptions) {
    // console.error("airFlightOptions is undefined or missing.");
    return null;
  }
  // Normalize airFlightOptions to be always an array (even if it's a single object)
  const optionsArray = Array.isArray(airFlightOptions)
    ? airFlightOptions
    : [airFlightOptions];

  // console.log("optionsArray", optionsArray);

  // Iterate through segments and find matching SegmentRef
  for (const segment of segments) {
    const segmentKey = segment["@attributes"]?.Key;

    // Handle case where @attributes or Key might be missing
    if (!segmentKey) {
      // console.error("Segment Key is missing:", segment);
      continue;
    }

    // Iterate through each airOption
    for (const option of optionsArray) {
      // If airConnection is present, return the first booking count (special condition)
      if (option?.Connection) {
        const airBookingInfo = Array.isArray(option.BookingInfo)
          ? option.BookingInfo[0]
          : option.BookingInfo;
        return airBookingInfo?.["@attributes"]?.BookingCount || null;
      }

      // For cases without airConnection, look for the matching SegmentRef
      const airBookingInfos = Array.isArray(option.BookingInfo)
        ? option.BookingInfo
        : [option.BookingInfo];

      for (const bookingInfo of airBookingInfos) {
        const segmentRef = bookingInfo?.["@attributes"]?.SegmentRef;

        // If the keys match, return the BookingCount
        if (segmentKey === segmentRef) {
          const bookingCount = bookingInfo?.["@attributes"]?.BookingCount;
          if (bookingCount !== undefined) {
            return bookingCount; // Return BookingCount if found
          } else {
            // console.error("BookingCount is missing in airBookingInfo:", bookingInfo);
          }
        }
      }
    }
  }

  // Return null if no match is found
  return null;
}

export function getBookingClass(airAirPricingInfo, segments) {
  console.log("getBookingCount", airAirPricingInfo, segments);

  // Extract airFlightOption from airAirPricingInfo with null/undefined checks
  const airFlightOptions =
    airAirPricingInfo?.FlightOptionsList?.FlightOption?.Option;

  // If airFlightOptions is neither array nor object, log an error and return null
  if (!airFlightOptions) {
    // console.error("airFlightOptions is undefined or missing.");
    return null;
  }

  // Normalize airFlightOptions to be always an array (even if it's a single object)
  const optionsArray = Array.isArray(airFlightOptions)
    ? airFlightOptions
    : [airFlightOptions];

  // console.log("optionsArray", optionsArray);

  // Iterate through segments and find matching SegmentRef
  for (const segment of segments) {
    const segmentKey = segment["@attributes"]?.Key;

    // Handle case where @attributes or Key might be missing
    if (!segmentKey) {
      // console.error("Segment Key is missing:", segment);
      continue;
    }

    // Iterate through each airOption
    for (const option of optionsArray) {
      // If airConnection is present, return the first booking count (special condition)
      if (option?.Connection) {
        const airBookingInfo = Array.isArray(option.BookingInfo)
          ? option.BookingInfo[0]
          : option.BookingInfo;
        return airBookingInfo?.["@attributes"]?.CabinClass || null;
      }

      // For cases without airConnection, look for the matching SegmentRef
      const airBookingInfos = Array.isArray(option.BookingInfo)
        ? option.BookingInfo
        : [option.BookingInfo];

      for (const bookingInfo of airBookingInfos) {
        const segmentRef = bookingInfo?.["@attributes"]?.SegmentRef;

        // If the keys match, return the BookingCount
        if (segmentKey === segmentRef) {
          const CabinClass = bookingInfo?.["@attributes"]?.CabinClass;
          if (CabinClass !== undefined) {
            return CabinClass; // Return BookingCount if found
          } else {
            // console.error("BookingCount is missing in airBookingInfo:", bookingInfo);
          }
        }
      }
    }
  }

  // Return null if no match is found
  return null;
}

// calculate Amt tax + subtotal amt
export function calculateTotalAmount(subtotal, tax) {
  if (subtotal && tax) {
    return +subtotal + +tax;
  }

  return null;
}

export const extractCarrierCodesAndPrices = (galileoData, amadeusData) => {
  console.log(galileoData, "first dkdl");
  console.log(amadeusData, "second dkdl");
  const carrierPriceMap = {};

  // Extract carrier codes and prices from Galileo
  galileoData.forEach((flight) => {
    const carrier = flight.carrierCode; // Adjust according to your data structure
    const price = flight.price; // Adjust according to your data structure
    if (!carrierPriceMap[carrier]) {
      carrierPriceMap[carrier] = price;
    } else {
      carrierPriceMap[carrier] = Math.min(carrierPriceMap[carrier], price);
    }
  });

  // Extract carrier codes and prices from Amadeus
  amadeusData.forEach((flight) => {
    const carrier = flight.ref; // Adjust according to your data structure
    const price = flight.totalFareAmount; // Adjust according to your data structure
    if (!carrierPriceMap[carrier]) {
      carrierPriceMap[carrier] = price;
    } else {
      carrierPriceMap[carrier] = Math.min(carrierPriceMap[carrier], price);
    }
  });

  return carrierPriceMap;
};

export const combineFlightData = (galileoData, amadeusData) => {
  const combinedData = [];

  // Process Galileo Flights
  // const galileoFlights = galileoData.map(flight => ({
  //     carrierCode: flight.carrierCode, // Adjust based on your actual structure
  //     flightDetails: flight,
  //     source: 'galileo'
  // }));

  // Process Amadeus Flights
  // const amadeusFlights = amadeusData.map(flight => ({
  //     carrierCode: flight.ref, // Adjust based on your actual structure
  //     flightDetails: flight,
  //     source: 'amadeus'
  // }));

  return [...galileoData, ...amadeusData];
};

// layover calculation amadeus
export const calculateLayover = (firstArrival, secondDeparture) => {
  const firstArrivalDateTime = new Date(
    `20${firstArrival.dateOfArrival.slice(
      4
    )}-${firstArrival.dateOfArrival.slice(
      2,
      4
    )}-${firstArrival.dateOfArrival.slice(
      0,
      2
    )}T${firstArrival.timeOfArrival.slice(
      0,
      2
    )}:${firstArrival.timeOfArrival.slice(2)}`
  );

  const secondDepartureDateTime = new Date(
    `20${secondDeparture.dateOfDeparture.slice(
      4
    )}-${secondDeparture.dateOfDeparture.slice(
      2,
      4
    )}-${secondDeparture.dateOfDeparture.slice(
      0,
      2
    )}T${secondDeparture.timeOfDeparture.slice(
      0,
      2
    )}:${secondDeparture.timeOfDeparture.slice(2)}`
  );

  const layover = secondDepartureDateTime - firstArrivalDateTime;

  if (isNaN(layover) || layover < 0) {
    return "Layover not available";
  }

  const hours = Math.floor(layover / (1000 * 60 * 60));
  const minutes = Math.floor((layover % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const calculateDuration = (departure, arrival) => {
  const departureDateTime = new Date(
    `20${departure.dateOfDeparture.slice(4)}-${departure.dateOfDeparture.slice(
      2,
      4
    )}-${departure.dateOfDeparture.slice(
      0,
      2
    )}T${departure.timeOfDeparture.slice(
      0,
      2
    )}:${departure.timeOfDeparture.slice(2)}`
  );

  const arrivalDateTime = new Date(
    `20${arrival.dateOfArrival.slice(4)}-${arrival.dateOfArrival.slice(
      2,
      4
    )}-${arrival.dateOfArrival.slice(0, 2)}T${arrival.timeOfArrival.slice(
      0,
      2
    )}:${arrival.timeOfArrival.slice(2)}`
  );

  const duration = arrivalDateTime - departureDateTime;

  if (isNaN(duration) || duration < 0) {
    return "Duration not available";
  }

  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

//find cabin class Amadeus
export const cabinClassAm = (data) => {
  const cabinClassMap = {
    C: "Business",
    M: "Economy",
    W: "Economy",
    F: "First Class",
  };

  return cabinClassMap[data] || "N/A";
};

export const showSwal = (
  navigate,
  type,
  redirectPath = "/booking-details",
  data = null
) => {
  if (type === "success-message") {
    swal({
      title: "Congratulations!",
      text: "Your Booking is Confirmed! Check your mail.",
      icon: "success",
      button: {
        text: "Okay",
        value: true,
        visible: true,
        className: "btn btn-primary",
      },
    }).then(() => {
      // // Redirect to the booking-details page with data
      // if (data) {
      //     const url = new URL(window.location.origin + redirectPath);
      //     Object.keys(data).forEach(key => {
      //         url.searchParams.append(key, data[key]);
      //     });
      //     window.location.href = url.toString();
      // } else {
      //     window.location.href = redirectPath;
      // }

      navigate(redirectPath, { state: { bookingData: data } });
    });
  } else {
    swal("Error occurred!");
  }
};

export const formatTimeAma = (time) => {
  if (time && time.length === 4) {
    return `${time.substring(0, 2)}:${time.substring(2)}`;
  }
  return time; // Return the original if formatting isn't possible
};

export const airpriceData = (pricesoldata) => {
  // Check if airFareInfo is an object, if so, convert it to an array
  let airFareInfo = null;
  if (pricesoldata.FareInfo) {
    airFareInfo = Array.isArray(pricesoldata.FareInfo)
      ? pricesoldata.FareInfo
      : [pricesoldata.FareInfo];
  }

  // Check if airBookingInfo is an object, if so, convert it to an array
  let airBookingInfo = null;
  if (pricesoldata.BookingInfo) {
    airBookingInfo = Array.isArray(pricesoldata.BookingInfo)
      ? pricesoldata.BookingInfo
      : [pricesoldata.BookingInfo];
  }

  // Check if airTaxInfo is an object, if so, convert it to an array
  let airTaxInfo = null;
  if (pricesoldata.TaxInfo) {
    airTaxInfo = Array.isArray(pricesoldata.TaxInfo)
      ? pricesoldata.TaxInfo
      : [pricesoldata.TaxInfo];
  }

  // Check if airPassengerType is an object, if so, convert it to an array (optional)
  let airPassengerType = null;
  if (pricesoldata.PassengerType) {
    airPassengerType = Array.isArray(pricesoldata.PassengerType)
      ? pricesoldata.PassengerType
      : [pricesoldata.PassengerType];
  }

  // Create the object with the checked and formatted data
  const adultDataObject = {
    attributes: pricesoldata["@attributes"] || null, // Assuming attributes might come from pricesoldata["@attributes"]
    airFareInfo: airFareInfo || null,
    airBookingInfo: airBookingInfo || null,
    airTaxInfo: airTaxInfo || null,
    airPassengerType: airPassengerType || null,
  };
  return adultDataObject;
};

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${dayOfMonth}-${month}-${year}`;
};

export const convertDate = (dateStr) => {
  // Extract day, month, and year from the string
  const day = parseInt(dateStr.slice(0, 2), 10); // First two characters are the day
  const month = parseInt(dateStr.slice(2, 4), 10) - 1; // Next two characters are the month (zero-indexed in JS)
  const year = parseInt(dateStr.slice(4, 6), 10) + 2000; // Last two characters are the year (assuming it's in the 21st century)
  // Create and return a new date object
  return new Date(year, month, day);
};

export const maskEmail = (email) => {
  if (!email) return "N/A";

  const firstPart = email.slice(0, 4);
  const lastPart = email.slice(-4);
  const middlePart = email.slice(4, email.length - 4);
  // Show first 4 characters, replace middle part with 'XXXX', and show last 4 characters.
  return `${firstPart}${"X".repeat(middlePart.length)}${lastPart}`;
};

export const findMatchingPricingSolution = (responseData, targetPrice) => {
  const pricingSolutions = Array.isArray(responseData?.AirPricingSolution)
    ? responseData?.AirPricingSolution
    : [responseData?.AirPricingSolution];
  // Find the solution that matches the target price
  const matchingSolution = pricingSolutions.find((solution) => {
    const totalPrice = solution["@attributes"].TotalPrice;
    // console.log("check price",totalPrice);
    return totalPrice === targetPrice;
  });

  if (!matchingSolution) {
    // Show an alert when the price has increased
    // alert("The selected price is no longer available. The new price has increased.");

    // Return the first pricing solution as the fallback
    return pricingSolutions[0];
  }

  return matchingSolution;

  // console.log("demo ",matchingSolution);
  // return matchingSolution || pricingSolutions[0];
};

export const extractFlightAma = (responseData) => {
  // Initialize variables to store the extracted information
  let originCity = responseData?.originDestination?.origin;
  let destinationCity = responseData?.originDestination?.destination;
  let stopFlight = "";
  let timeDuration = "";
  let formatedate = "";
  let carrierscode = "";

  // Ensure the segment information is always in array format
  const segments = Array.isArray(responseData?.segmentInformation)
    ? responseData.segmentInformation
    : [responseData.segmentInformation];

  if (segments.length > 0) {
    // Get first and last segment
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    // console.log(firstSegment.flightDetails.companyDetails.marketingCompany,"check code here");
    carrierscode = firstSegment.flightDetails.companyDetails.marketingCompany;
    // Stop information
    stopFlight = segments.length > 1 ? segments.length - 1 : "Nonstop";

    // Extract departure and arrival times
    const firstDepartureDate =
      firstSegment?.flightDetails?.flightDate?.departureDate || "";
    const firstDepartureTime =
      firstSegment?.flightDetails?.flightDate?.departureTime || "";
    const lastArrivalDate =
      lastSegment?.flightDetails?.flightDate?.arrivalDate || "";
    const lastArrivalTime =
      lastSegment?.flightDetails?.flightDate?.arrivalTime || "";

    // Convert first departure and last arrival to Date objects
    const departureDateTime = new Date(
      `20${firstDepartureDate.slice(4, 6)}-${firstDepartureDate.slice(
        2,
        4
      )}-${firstDepartureDate.slice(0, 2)}T${firstDepartureTime.slice(
        0,
        2
      )}:${firstDepartureTime.slice(2)}`
    );
    const arrivalDateTime = new Date(
      `20${lastArrivalDate.slice(4, 6)}-${lastArrivalDate.slice(
        2,
        4
      )}-${lastArrivalDate.slice(0, 2)}T${lastArrivalTime.slice(
        0,
        2
      )}:${lastArrivalTime.slice(2)}`
    );

    // Calculate total duration in milliseconds
    const totalDurationMs = arrivalDateTime - departureDateTime;

    // Convert duration into hours and minutes
    const totalHours = Math.floor(totalDurationMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (totalDurationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    timeDuration = `${totalHours}h ${totalMinutes}m`;

    // Format departure date from the first segment to "Sun-10Nov2024"
    const departureDate =
      firstSegment?.flightDetails?.flightDate?.departureDate || "";
    const formattedDepartureDateTime = new Date(
      `20${departureDate.slice(4, 6)}-${departureDate.slice(
        2,
        4
      )}-${departureDate.slice(0, 2)}`
    );
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = daysOfWeek[formattedDepartureDateTime.getUTCDay()];
    const date = formattedDepartureDateTime.getUTCDate();
    const month = monthsOfYear[formattedDepartureDateTime.getUTCMonth()];
    const year = formattedDepartureDateTime.getUTCFullYear();

    formatedate = `${day} - ${date < 10 ? "0" + date : date} ${month} ${year}`;
  }

  return {
    originCity,
    destinationCity,
    stopFlight,
    timeDuration,
    formatedate,
    carrierscode,
  };
};

export const extractFlightDetails = (responseData) => {
  const airSegments = responseData;

  if (!airSegments) {
    return {};
  }

  let originCity,
    destinationCity,
    stopFlight,
    carrierCode,
    timeDuration = "";

  if (Array.isArray(airSegments)) {
    // Handle multiple segments (connecting flights)
    const firstSegment = airSegments[0]["@attributes"];
    const lastSegment = airSegments[airSegments.length - 1]["@attributes"];

    originCity = firstSegment.Origin;
    destinationCity = lastSegment.Destination;
    carrierCode = firstSegment?.Carrier;
    // Calculate stop count
    stopFlight =
      airSegments.length === 1 ? "NonStop" : `${airSegments.length - 1} - stop`;
    // Get the first segment's departure time and last segment's arrival time
    const firstDepartureTime = new Date(firstSegment.DepartureTime);
    const lastArrivalTime = new Date(lastSegment.ArrivalTime);

    // Calculate time duration in hours and minutes
    const durationMs = lastArrivalTime - firstDepartureTime;
    const totalHours = Math.floor(durationMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    timeDuration = `${totalHours}h ${totalMinutes}m`;
  } else {
    // Handle direct flight (single segment)
    const airSegment = airSegments["@attributes"];
    originCity = airSegment.Origin;
    destinationCity = airSegment.Destination;
    carrierCode = airSegment?.Carrier;
    stopFlight = airSegment.ChangeOfPlane === "false" ? "NonStop" : 1;

    // Get departure and arrival times from the single segment
    const departureTime = new Date(airSegment.DepartureTime);
    const arrivalTime = new Date(airSegment.ArrivalTime);

    // Calculate duration in hours and minutes
    const durationMs = arrivalTime - departureTime;
    const totalHours = Math.floor(durationMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    timeDuration = `${totalHours}h ${totalMinutes}m`;
  }

  return {
    originCity,
    destinationCity,
    stopFlight,
    timeDuration,
    carrierCode,
  };
};

const formatPassengerDetails = (customerInfo) => {
  const structuredPassengers = { adult: [], child: [], infant: [] };
  customerInfo?.PassengerDetails?.forEach((passenger) => {
    if (passenger.PaxType === "ADT") {
      structuredPassengers.adult.push(passenger);
    } else if (passenger.PaxType === "CHD") {
      structuredPassengers.child.push(passenger);
    } else if (passenger.PaxType === "INF") {
      structuredPassengers.infant.push(passenger);
    }
  });
  return structuredPassengers;
};

export const formatPricingData = (pricingSolution, travellerQuantity) => {
  const airPriceCheck = Array.isArray(pricingSolution?.AirPricingInfo)
    ? pricingSolution?.AirPricingInfo
    : [pricingSolution?.AirPricingInfo];

  let dataAdt, dataChd, dataInf;

  if (airPriceCheck[0]) {
    dataAdt = airpriceData(airPriceCheck[0]);
  }
  if (airPriceCheck[1]) {
    if (travellerQuantity.noOfChilds && travellerQuantity.noOfChilds > 0) {
      dataChd = airpriceData(airPriceCheck[1]);
    } else {
      dataInf = airpriceData(airPriceCheck[1]);
    }
  }
  if (airPriceCheck[2]) {
    dataInf = airpriceData(airPriceCheck[2]);
  }

  return { dataAdt, dataChd, dataInf };
};

export const createRequestBody = (flightData, pricingData, customerInfo) => {
  const priceInfodata = Array.isArray(
    flightData?.pricingSolution?.AirPricingInfo
  )
    ? flightData?.pricingSolution?.AirPricingInfo
    : [flightData?.pricingSolution?.AirPricingInfo];
  const bookingData = Array.isArray(priceInfodata[0].BookingInfo)
    ? priceInfodata[0].BookingInfo
    : [priceInfodata[0].BookingInfo];

  const flightSegments = Array.isArray(
    flightData?.Flightdata?.AirItinerary?.AirSegment
  )
    ? flightData?.Flightdata?.AirItinerary?.AirSegment
    : [flightData?.Flightdata?.AirItinerary?.AirSegment];

  const updatedFlightSegments = addHostTokensToSegments(
    flightSegments,
    bookingData
  );
  const returnSegments = flightData?.Flightdata?.AirItinerary?.returnSegment
    ? Array.isArray(flightData.Flightdata.AirItinerary.returnSegment)
      ? flightData.Flightdata.AirItinerary.returnSegment
      : [flightData.Flightdata.AirItinerary.returnSegment]
    : null; // Set to null if not available
  const updatedFlightSegments1 = addHostTokensToSegments(
    returnSegments,
    bookingData
  );

  // console.log("debug here hosttoke details => ",updatedFlightSegments1,updatedFlightSegments);

  const hostToken = Array.isArray(flightData?.pricingSolution?.HostToken)
    ? flightData?.pricingSolution?.HostToken
    : [flightData?.pricingSolution?.HostToken];

  return {
    otherInformation: flightData?.otherInformation,
    trip: flightData?.trip,
    TransactionId: flightData?.TransactionId,
    travellerquantity: flightData?.travellerquantity,
    gstDetails: flightData?.GstDetails || {
      companyName: "WAGNISTRIP (OPC) PRIVATE LIMITED",
      gstNumber: "07AAOCM4506G1ZF",
    },
    CustomerInfo: {
      Email: customerInfo?.Email,
      Mobile: customerInfo?.Mobile,
      Address: "",
      City: "",
      State: "",
      CountryCode: customerInfo?.CountryName,
      CountryName: customerInfo?.CountryName,
      ZipCode: "",
      Flightdate: flightSegments[0]["@attributes"].DepartureTime,
      flightNumber: `${flightSegments[0]["@attributes"].Carrier}-${flightSegments[0]["@attributes"].FlightNumber}`,
      PassengerDetails: formatPassengerDetails(customerInfo),
    },
    segmentData: updatedFlightSegments,
    ...(updatedFlightSegments1
      ? { returnSegmentData: updatedFlightSegments1 }
      : {}),
    pricingSolution: [flightData.pricingSolution["@attributes"]],
    adultData: [pricingData.dataAdt],
    childData: [pricingData.dataChd],
    infantData: [pricingData.dataInf],
    common_v52_0HostToken: hostToken,
    hostTokenAgain: flightData?.HostTokenV2,
  };
};

export const calculateTotalFare = (seats) => {
  return seats.reduce((acc, seat) => {
    const priceString = seat["@attributes"]?.TotalPrice || "INR0"; // Default to INR0 if missing
    const price = parseInt(priceString.replace("INR", ""), 10) || 0; // Convert to number or fallback to 0
    return acc + price;
  }, 0);
};

export const calculateTotalPriceByOrigin = (dataStore) => {
  // Check if dataStore is null or undefined, return 0 if true
  if (!dataStore) {
    return 0;
  }

  let totalPrice = 0; // Initialize total price accumulator

  // Loop through each origin (e.g., "BOM", "DEL")
  for (const origin in dataStore) {
    if (dataStore.hasOwnProperty(origin)) {
      const seats = dataStore[origin];
      let totalOriginPrice = 0;

      // Loop through each seat in the origin
      seats.forEach((seat) => {
        // Check if seat data is valid and parse accordingly
        if (seat && seat["@attributes"] && seat["@attributes"].TotalPrice) {
          // First data structure: seat has `@attributes` and `TotalPrice`
          const priceString = seat["@attributes"].TotalPrice;
          const parsedPrice = parseFloat(priceString.replace(/[^\d.-]/g, ""));

          if (!isNaN(parsedPrice)) {
            totalOriginPrice += parsedPrice;
          } else {
            console.warn(`Invalid price format for seat: ${priceString}`);
          }
        } else if (
          seat &&
          seat.seatCharacteristic &&
          Array.isArray(seat.seatCharacteristic)
        ) {
          // Find the seatPrice inside seatCharacteristic
          const priceData = seat.seatCharacteristic.find(
            (characteristic) => characteristic.seatPrice
          );

          if (priceData && Array.isArray(priceData.seatPrice)) {
            // Only take the first index price
            const firstPrice = priceData.seatPrice[0]; // Get the first seat price
            const parsedPrice = parseFloat(firstPrice.amount); // Extract numeric value from the first price

            if (!isNaN(parsedPrice)) {
              totalOriginPrice += parsedPrice;
            } else {
              console.warn(
                `Invalid price format for seat at row ${seat.seatRowNumber}: ${firstPrice.amount}`
              );
            }
          } else {
            console.warn(
              `Missing seat price information for seat at row ${seat.seatRowNumber}`
            );
          }
        } else {
          console.warn("Missing or invalid seat data:", seat);
        }
      });

      // Add the total price for the origin to the grand total
      totalPrice += totalOriginPrice;
    }
  }

  return totalPrice;
};

export const parseApiResponse = (response) => {
  const extractTravelers = (travelers) => {
    let adults = [];
    let children = [];
    let infants = [];
    if (travelers === null) {
      return { adults, children, infants };
    }
    const travelerGal = Array.isArray(travelers) ? travelers : [travelers];

    travelerGal.forEach((traveler) => {
      const travelerData = {
        prefix: traveler.BookingTravelerName["@attributes"].Prefix || "",
        firstName: traveler.BookingTravelerName["@attributes"].First || "",
        lastName: traveler.BookingTravelerName["@attributes"].Last || "",
        age: traveler["@attributes"].Age,
        gender: traveler["@attributes"].Gender,
        dob: traveler["@attributes"].DOB,
      };

      // Categorize by TravelerType
      if (traveler["@attributes"].TravelerType === "ADT") {
        adults.push(travelerData);
      } else if (traveler["@attributes"].TravelerType === "CNN") {
        children.push(travelerData);
      } else if (traveler["@attributes"].TravelerType === "INF") {
        infants.push(travelerData);
      }
    });

    return { adults, children, infants };
  };

  function parseFlightSegments(segments) {
    const airSegments = Array.isArray(segments?.AirSegment)
      ? segments.AirSegment
      : [segments?.AirSegment];
    return airSegments.map((segment) => {
      const flightSegment = segment["@attributes"];
      const flightDetails = segment.FlightDetails["@attributes"];

      return {
        Key: flightSegment.Key,
        // hostTokenRef: "",  // Placeholder value
        availabilitySource: flightSegment.AvailabilitySource,
        equipment: flightDetails.Equipment,
        availabilityDisplayType: "Fare Specific Fare Quote Unbooked", // Placeholder value
        group: flightSegment.Group,
        carrier: flightSegment.Carrier,
        flightNumber: flightSegment.FlightNumber,
        origin: flightSegment.Origin,
        destination: flightSegment.Destination,
        departureTime: flightSegment.DepartureTime,
        arrivalTime: flightSegment.ArrivalTime,
        flightTime: flightDetails.FlightTime,
        travelTime: flightDetails.TravelTime,
        distance: "708", // Placeholder value (you may need to calculate or extract this if available)
        providerCode: flightSegment.ProviderCode,
        classOfService: flightSegment.ClassOfService,
        operatingCarrier: segment.CodeshareInfo
          ? segment.CodeshareInfo["@attributes"].OperatingCarrier
          : null,
      };
    });
  }
  // Extract flight segment information
  // const flightSegment = response.universalUniversalRecord.airAirReservation.airAirSegment["@attributes"];
  // const flightDetails = response.universalUniversalRecord.airAirReservation.airAirSegment.airFlightDetails["@attributes"];

  const flightSegments =
    response && response.UniversalRecord
      ? response.UniversalRecord.AirReservation
      : null;
  let parsedFlightData = [];
  if (flightSegments !== null) {
    parsedFlightData = parseFlightSegments(flightSegments);
  }

  const travelers =
    response && response.UniversalRecord
      ? response.UniversalRecord.BookingTraveler
      : null;
  const { adults, children, infants } = extractTravelers(travelers);

  return {
    parsedFlightData,
    adults,
    children,
    infants,
  };
};

const convertDateFormat1 = (date) => {
  // Check if the date is already in yyyy-mm-dd format
  if (date.includes("/")) {
    return date; // Return the date as it is
  }

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const convertDateFormat = (date) => {
  // Check if the date is already in yyyy-mm-dd format
  if (date.includes("-")) {
    return date; // Return the date as it is
  }
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

const generateDynamicKey = () => {
  const randomData = new Uint8Array(16);
  crypto.getRandomValues(randomData);
  return btoa(String.fromCharCode(...randomData));
};

export const formatDataForGalileo = (
  adults,
  children,
  infants,
  getGenderFromTitle,
  countryCode,
  countryCodevl
) => {
  return [
    ...adults.map((adult) => ({
      Key: generateDynamicKey(),
      Title: adult.title,
      Gender: getGenderFromTitle(adult.title),
      FirstName: adult.firstName,
      MiddleName: adult.middleName || "",
      LastName: adult.lastName,
      DateOfBirth:
        !adult.dateOfBirth || adult.dateOfBirth.includes("undefined/undefined/")
          ? "02/01/2001"
          : convertDateFormat1(adult.dateOfBirth),
      PaxType: "ADT",
      PassportNumber: adult.passportNumber || "",
      // PassportNumber: "",
      MealType: adult.MealType,
      MealCode: "",
      FFNo: adult.FrequentFlyerAirline,
      InfAssPaxName: "",
      TicketNo: "",
      Status: "",
      ModifyStatus: "",
      Nationality: countryCodevl,
      IssuingCountry: countryCode,
      ExpiryDate: adult.expirydate || "",
      // ExpiryDate: "10/01/2031",
      FrequentFlyerAirline: adult.FrequentFlyerAirline,
      SeatListDetails: adult.seatListDetails || [],
      ConfirmSeat: adult.confirmSeat || [],
    })),
    ...children.map((child) => ({
      Key: generateDynamicKey(),
      Title: child.title,
      Gender: getGenderFromTitle(child.title),
      FirstName: child.firstName,
      MiddleName: child.middleName || "",
      LastName: child.lastName,
      DateOfBirth:
        !child.dateOfBirth || child.dateOfBirth.includes("undefined/undefined/")
          ? ""
          : convertDateFormat1(child.dateOfBirth),
      // DateOfBirth: convertDateFormat1(child.dateOfBirth) || "02/01/2017",
      PaxType: "CHD",
      PassportNumber: child.passportNumber || "",
      MealType: child.MealType,
      MealCode: "",
      FFNo: child.FrequentFlyerAirline,
      InfAssPaxName: "",
      TicketNo: "",
      Status: "",
      ModifyStatus: "",
      Nationality: countryCodevl,
      IssuingCountry: countryCode,
      ExpiryDate: child.expirydate || "",
      FrequentFlyerAirline: child.FrequentFlyerAirline,
      SeatListDetails: child.seatListDetails || [],
      ConfirmSeat: child.confirmSeat || [],
    })),
    ...infants.map((infant) => ({
      Key: generateDynamicKey(),
      Title: infant.title,
      Gender: getGenderFromTitle(infant.title),
      FirstName: infant.firstName,
      MiddleName: infant.middleName || "",
      LastName: infant.lastName,
      DateOfBirth: convertDateFormat1(infant.dateOfBirth) || "02/01/2017",
      PaxType: "INF",
      PassportNumber: infant.passportNumber || "",
      MealType: infant.MealType,
      MealCode: "",
      FFNo: infant.FrequentFlyerAirline,
      InfAssPaxName: "",
      TicketNo: "",
      Status: "",
      ModifyStatus: "",
      Nationality: countryCodevl,
      IssuingCountry: countryCode,
      ExpiryDate: infant.expirydate || "",
      FrequentFlyerAirline: infant.FrequentFlyerAirline,
      SeatListDetails: infant.seatListDetails || [],
      ConfirmSeat: infant.confirmSeat || [],
    })),
  ];
};

export const formatDataForAmadeus = (
  adults,
  children,
  infants,
  getGenderFromTitle,
  email,
  countryCode,
  localNumber,
  countryCodevl
) => {
  // const phoneValues = parsePhoneNumber(phoneValue);
  const formatTraveler = (traveler, type, id) => ({
    id: id,
    // "dateOfBirth": traveler.dateOfBirth || "2000-06-26",
    dateOfBirth:
      traveler.dateOfBirth != "undefined-undefined-"
        ? convertDateFormat(traveler.dateOfBirth)
        : "2000-06-26",
    name: {
      firstName: traveler.firstName,
      lastName: traveler.lastName,
    },
    gender: getGenderFromTitle(traveler.title).toUpperCase(),
    contact: {
      emailAddress: email,
      phones: [
        {
          deviceType: "MOBILE",
          countryCallingCode: countryCode,
          number: localNumber,
        },
      ],
    },
    documents: [
      {
        documentType: "PASSPORT",
        birthPlace: traveler.birthPlace || "Madrid",
        issuanceLocation: traveler.issuanceLocation || "Madrid",
        issuanceDate: traveler.issuanceDate || "2015-04-14",
        number: traveler.passportNumber || "00000000",
        expiryDate: traveler.expiryDate || "2025-04-14",
        issuanceCountry: countryCodevl || "ES",
        validityCountry: countryCodevl || "ES",
        nationality: countryCodevl || "ES",
        holder: true,
      },
    ],
    type: type,
  });

  let travelers = [];
  let id = 1;
  adults.forEach((adult) => travelers.push(formatTraveler(adult, "ADT", id++)));
  children.forEach((child) =>
    travelers.push(formatTraveler(child, "CHD", id++))
  );
  infants.forEach((infant) =>
    travelers.push(formatTraveler(infant, "INF", id++))
  );

  return travelers;
};

export const initialPersonState = {
  key: "",
  title: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  MealType: "",
  FrequentFlyerAirline: "",
  nameFieldVisible: true,
  icon: true,
  seatListDetails: [],
  confirmSeat: [],
  passportNumber: "",
  passportExpiryDay: "",
  passportExpiryMonth: "",
  passportExpiryYear: "",
  expirydate: "",
};

export const calculatePassengerFare = async (
  data,
  trip,
  tripType,
  flightOrigin,
  flightDestination
) => {
  // console.log("trip and tripType ", adult,child,infant);
  if (!data) {
    return;
  }
  const AirReservation = Array.isArray(data?.AirReservation)
    ? data.AirReservation[0]
    : data.AirReservation;
  const providerReservation = Array.isArray(data?.ProviderReservationInfo)
    ? data.ProviderReservationInfo[0]
    : data.ProviderReservationInfo;
  const segmentData = Array.isArray(AirReservation.AirSegment)
    ? AirReservation.AirSegment
    : [AirReservation.AirSegment];
  const carrierCode =
    (segmentData && segmentData[0]["@attributes"].Carrier) || "";
  const priceInfo = Array.isArray(AirReservation?.AirPricingInfo)
    ? AirReservation?.AirPricingInfo
    : [AirReservation.AirPricingInfo];

  const formatedata = Array.isArray(data?.BookingTraveler)
    ? data?.BookingTraveler
    : [data?.BookingTraveler];

  // const seatprice = Array.isArray(AirReservation.OptionalServices.OptionalService) ? AirReservation.OptionalServices.OptionalService : [AirReservation.OptionalServices.OptionalService];
  const seatprice = Array.isArray(
    AirReservation?.OptionalServices?.OptionalService
  )
    ? AirReservation?.OptionalServices?.OptionalService
    : AirReservation?.OptionalServices?.OptionalService
      ? [AirReservation?.OptionalServices?.OptionalService]
      : [];
  const cabinflightclass = Array.isArray(priceInfo[0].BookingInfo)
    ? priceInfo[0].BookingInfo
    : [priceInfo[0].BookingInfo];
  let BaseFare = 0;
  let Taxes = 0;
  let Fees = 0;
  let optionalPrice = 0;
  let grandTotal = 0;
  let Convenience = 300;
  let discountAmt = 0;
  const createdDate = formatDate(providerReservation["@attributes"].CreateDate);
  const createdTime = providerReservation["@attributes"].CreateDate;
  const Pnr =
    AirReservation &&
    AirReservation?.SupplierLocator &&
    AirReservation?.SupplierLocator["@attributes"]?.SupplierLocatorCode;
  // const Pnr = data?.ProviderReservationInfo["@attributes"].LocatorCode;
  const cabinClass = cabinflightclass[0]["@attributes"].CabinClass;
  let paidseatprice;

  if (seatprice.length > 0) {
    const seatData = seatprice
      .map((seat) => {
        const seatAttributes = seat["@attributes"];
        const serviceData = seat.ServiceData["@attributes"];
        optionalPrice +=
          parseFloat(seatAttributes?.TotalPrice?.replace(/[^\d.]/g, "")) || 0;

        return {
          Seat: serviceData?.Data || "", // Seat data like "4-A"
          TotalPrice: seatAttributes?.TotalPrice || "", // Seat price
          BookingTravelerRef: serviceData?.BookingTravelerRef || "", // Adding BookingTravelerRef
          AirSegmentRef: serviceData?.AirSegmentRef || "", // Adding AirSegmentRef
        };
      })
      .filter((item) => item !== null);

    paidseatprice = seatData;
  }

  const customerDetails = formatedata.map((traveler) => {
    const { Prefix, First, Last } = traveler.BookingTravelerName["@attributes"];
    const { TravelerType, Key: travelerKey } = traveler["@attributes"];
    const matchingPricing = priceInfo.find((price) => {
      // Check if PassengerType is an array
      const passengerTypes = Array.isArray(price.PassengerType)
        ? price.PassengerType
        : [price.PassengerType];
      // console.log("Raushanddd => ", passengerTypes);
      if (!price?.PassengerType) {
        return false;
      }
      // return
      // Find a matching traveler reference within the array
      return passengerTypes.some(
        (type) => type["@attributes"].BookingTravelerRef === travelerKey
      );
    });

    let baggageUnit = "0";
    let baggageSymbol = "";
    const data = matchingPricing?.FareInfo;

    // Ensure `data` is an array or object
    if (Array.isArray(data)) {
      // Iterate over `FareInfo` array to find `BaggageAllowance`
      const baggageInfo = data.find((fare) => fare.BaggageAllowance);

      if (baggageInfo?.BaggageAllowance) {
        // Check if MaxWeight is available
        if (baggageInfo.BaggageAllowance.MaxWeight) {
          const baggage = baggageInfo.BaggageAllowance.MaxWeight;
          baggageUnit = baggage["@attributes"]?.Value || "0";
          baggageSymbol = baggage["@attributes"]?.Unit || "";
        }
        // Check if NumberOfPieces is available
        else if (baggageInfo.BaggageAllowance.NumberOfPieces) {
          baggageUnit = baggageInfo.BaggageAllowance.NumberOfPieces;
          baggageSymbol = "Piece(s)";
        }
      } else {
        if (carrierCode === "6E" && trip === "D") {
          baggageUnit = "15";
          baggageSymbol = "Kilograms";
        } else {
          baggageUnit = "30";
          baggageSymbol = "Kilograms";
        }
        console.warn(
          "No baggage allowance information found in FareInfo array."
        );
      }
    } else if (data?.BaggageAllowance) {
      // Handle case where `FareInfo` is not an array
      if (data.BaggageAllowance.MaxWeight) {
        const baggage = data.BaggageAllowance.MaxWeight;
        baggageUnit = baggage["@attributes"]?.Value || "0";
        baggageSymbol = baggage["@attributes"]?.Unit || "";
      } else if (data.BaggageAllowance.NumberOfPieces) {
        baggageUnit = data.BaggageAllowance.NumberOfPieces;
        baggageSymbol = "Piece(s)";
      }
    } else {
      if (carrierCode === "6E" && trip === "D") {
        baggageUnit = "15";
        baggageSymbol = "Kilograms";
      } else {
        baggageUnit = "30";
        baggageSymbol = "Kilograms";
      }
      console.warn("No baggage allowance information found.");
    }

    const seatAssignment =
      traveler?.AirSeatAssignment?.["@attributes"]?.Seat || "";
    const seatobject = Array.isArray(traveler?.AirSeatAssignment)
      ? traveler?.AirSeatAssignment
      : [traveler?.AirSeatAssignment];

    // Check service data for additional seat info
    const seatFromService = seatAssignment;
    // const airSegmentkey =
    return {
      Prefix,
      FirstName: First,
      LastName: Last,
      TravelerType,
      BaggageUnit: baggageUnit,
      Baggagesymbol: baggageSymbol,
      BookingTravelerRef: travelerKey,

      seatobject: seatobject,
      Seat: seatFromService,
    };
  });

  const result = segmentData.map((flight) => {
    const segmentKey = flight["@attributes"].Key;

    // Filter and map customer data for this flight segment
    const customerInfo = customerDetails.map((customer) => {
      let seatData = null;
      if (customer.seatobject) {
        // Extract the seat matching the flight segment if `seatobject` exists
        seatData = customer.seatobject
          .filter((seat) => seat && seat["@attributes"]) // Filter out null or invalid seats
          .find((seat) => seat["@attributes"].SegmentRef === segmentKey);
      }

      // Return customer information with seat and other details
      return {
        Prefix: customer.Prefix,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        TravelerType: customer.TravelerType,
        BaggageUnit: customer.BaggageUnit,
        Baggagesymbol: customer.Baggagesymbol,
        Seat: seatData ? seatData["@attributes"].Seat : "No Seat Assigned", // Default value for missing seats
      };
    });
    return {
      flightData: flight,
      customerInfo, // An array of customer details with only the required fields
    };
  });

  const adultPassengers = formatedata.filter(
    (traveler) => traveler["@attributes"].TravelerType === "ADT"
  );
  const passengerDetails = adultPassengers.map((traveler) => {
    const nameInfo = traveler.BookingTravelerName["@attributes"];
    const emailInfo = traveler.Email["@attributes"];
    const phoneInfo = Array.isArray(traveler?.PhoneNumber)
      ? traveler?.PhoneNumber[0]["@attributes"]
      : traveler.PhoneNumber["@attributes"];
    return {
      Prefix: nameInfo?.Prefix || "",
      FirstName: nameInfo?.First || "",
      LastName: nameInfo?.Last || "",
      Email: emailInfo?.EmailID || "",
      PhoneNumber: `+${phoneInfo?.CountryCode || ""} ${
        phoneInfo?.Number || ""
      }`,
    };
  });

  // Calculate flight details
  const firstSegment = segmentData[0];
  const lastSegment = segmentData[segmentData.length - 1];

  const origin = firstSegment["@attributes"].Origin;
  const destination = lastSegment["@attributes"].Destination;
  const departureDate = firstSegment["@attributes"].DepartureTime.split("T")[0]; // Extract date part
  const departureTime = firstSegment["@attributes"].DepartureTime; // Full departure time
  const arrivalTime = lastSegment["@attributes"].ArrivalTime; // Full arrival time
  const totalTime = calculateTravelTime(departureTime, arrivalTime);
  const stopStatus =
    segmentData.length > 1 ? `${segmentData.length - 1} Stop(s)` : "NonStop";

  const carrierFlightInfo = segmentData.map((segment) => ({
    CarrierCode: segment["@attributes"].Carrier,
    FlightNumber: segment["@attributes"].FlightNumber,
  }));

  // Iterate over price info to calculate fares
  priceInfo.forEach((info) => {
    const passengerLength = Array.isArray(info?.PassengerType)
      ? info?.PassengerType
      : [info?.PassengerType];

    const baseFare =
      parseFloat(
        info["@attributes"]?.ApproximateBasePrice?.replace(/[^\d.]/g, "")
      ) || 0;
    const taxes =
      parseFloat(info["@attributes"]?.Taxes?.replace(/[^\d.]/g, "")) || 0;

    const fees = info["@attributes"]?.Fees
      ? parseFloat(info["@attributes"]?.Fees.replace(/[^\d.]/g, ""))
      : 0;
    // if (carrierCode === "6E") {
    //   BaseFare += baseFare * passengerLength.length;
    //   Taxes += taxes * passengerLength.length;
    //   Fees += fees * passengerLength.length;
    // } else {
    //   BaseFare += baseFare;
    //   Taxes += taxes;
    //   Fees += fees;
    // }

    BaseFare += baseFare * passengerLength.length;
    Taxes += taxes * passengerLength.length;
    Fees += fees * passengerLength.length;
  });
  // grandTotal = (BaseFare*2) + (Taxes*2) + optionalPrice;
  grandTotal = BaseFare + Taxes + Fees + optionalPrice;
  const origindata = origin;
  const destinationdata = destination;

  const flightDetails = [
    {
      Origin: origin,
      origindata: origindata,
      destinationdata: destinationdata,
      Destination: destination,
      DepartureDate: departureDate,
      DepartureTime: departureTime,
      ArrivalTime: arrivalTime,
      TotalTravelTime: totalTime,
      StopFlight: stopStatus,
      CarrierFlightInfo: carrierFlightInfo,
    },
  ];

  const onwardFlights = [];
  const returnFlights = [];

  let collectingOnward = false;
  let reachedDestination = false;

  for (const segment of result) {
    const attr = segment.flightData["@attributes"];
    const origin = attr.Origin;
    const destination = attr.Destination;

    if (!reachedDestination) {
      // Start collecting onward if origin matches flightOrigin
      if (!collectingOnward && origin === flightOrigin) {
        collectingOnward = true;
      }

      if (collectingOnward) {
        onwardFlights.push(segment);

        // If we reach the destination, switch to return collection
        if (destination === flightDestination) {
          reachedDestination = true;
        }
      }
    } else {
      returnFlights.push(segment);
    }
  }

  const flightdataOnward =
    trip === "I" && tripType === "roundtrip" ? onwardFlights : result;
  const flightdataReturn =
    trip === "I" && tripType === "roundtrip" ? returnFlights : null;
  return {
    Amount: {
      BaseFare,
      Taxes,
      Fees,
      grandTotal,
      optionalPrice,
      Convenience,
      discountAmt,
    },
    flightdata: flightdataOnward,
    ...(flightdataReturn ? { flightdataRT: flightdataReturn } : {}),
    customerInfo: customerDetails,
    paidseatprice: paidseatprice,
    PassengerDetails: passengerDetails,
    FlightDetails: flightDetails,
    createdDate: createdDate,
    createdTime: createdTime,
    Pnr: Pnr,
    cabinClass: cabinClass,
  };
};

//design data to formate for galileo flight here
export const handleBookingupdatess = async (
  data,
  apitype,
  selectSeat,
  adult,
  child,
  passanger,
  galileoData,
  amt,
  name,
  email,
  phone,
  flightFare
) => {
  const originKeys = Object.keys(selectSeat);
  console.log("data test ==>", passanger);
  const segmentDataArray = Array.isArray(galileoData)
    ? galileoData
    : [galileoData];
  const updatedRequestData = {
    amount: 1,
    firstname: name,
    email: email,
    phone: phone,
    apitype: apitype,
    TransactionId: data,
    origin: originKeys,
    selectSeat: {},
    flightFare: flightFare,
  };

  originKeys.forEach((origin) => {
    const seatsArray = Array.isArray(selectSeat[origin])
      ? selectSeat[origin]
      : [];
    const segment = segmentDataArray.find(
      (seg) => seg["@attributes"]?.Origin === origin
    );
    updatedRequestData.selectSeat[origin] = seatsArray.map((seat, index) => {
      const passenger =
        index < adult
          ? passanger.find((pax) => pax.PaxType === "ADT")
          : passanger.find((pax) => pax.PaxType === "CHD");
      const segmentDetails = segment ? { ...segment } : null;

      if (seat) {
        return {
          ...seat,
          segmentDetails,
          passangerDetails: passenger || {},
          Type: index < adult ? "ADT" : "CHD",
        };
      } else {
        return {
          SeatCode: null,
          Type: "CHD",
          segmentDetails,
          passangerDetails: passenger || {},
        };
      }
    });
  });

  return updatedRequestData;
};

export const handleBookingupdate = async (
  data,
  apitype,
  selectSeat,
  adult,
  child,
  passanger,
  galileoData,
  amt,
  name,
  email,
  phone,
  flightFare
) => {
  const originKeys = Object.keys(selectSeat);
  const segmentDataArray = Array.isArray(galileoData)
    ? galileoData
    : [galileoData];

  const updatedRequestData = {
    amount: amt,
    firstname: name,
    email: email,
    phone: phone,
    apitype: apitype,
    TransactionId: data,
    origin: originKeys,
    selectSeat: {},
    flightFare: flightFare,
  };

  // Separate passengers by type
  const adults = passanger.filter((pax) => pax.PaxType === "ADT");
  const children = passanger.filter((pax) => pax.PaxType === "CHD");

  originKeys.forEach((origin) => {
    const seatsArray = Array.isArray(selectSeat[origin])
      ? selectSeat[origin]
      : [];
    const segment = segmentDataArray.find(
      (seg) => seg["@attributes"]?.Origin === origin
    );

    updatedRequestData.selectSeat[origin] = seatsArray.map((seat, index) => {
      let passenger;

      if (index < adult) {
        // Assign each adult passenger in sequence
        passenger = adults[index] || adults[0]; // Fallback in case of mismatch
      } else {
        // Assign child passengers in sequence
        passenger = children[index - adult] || children[0];
      }

      const segmentDetails = segment ? { ...segment } : null;

      if (seat) {
        return {
          ...seat,
          segmentDetails,
          passangerDetails: passenger || {},
          Type: index < adult ? "ADT" : "CHD",
        };
      } else {
        return {
          SeatCode: null,
          Type: "CHD",
          segmentDetails,
          passangerDetails: passenger || {},
        };
      }
    });
  });

  return updatedRequestData;
};

export function getAirportDataByCountry(airportCode, airports = "state") {
  if (!airportCode) {
    throw new Error("Airport code is required");
  }
  // Find the airport object based on the CountryCode (if that's your identifier)
  const airportname = airportdata?.find(
    (airport) => airport.iata === airportCode
  );
  if (!airportname) {
    return `${airportCode}`;
  }

  // Based on the 'airports' parameter, return the respective data
  let data;
  switch (airports) {
    case "airport":
      data = airportname.airport;
      break;
    case "state":
      data = airportname.state;
      break;
    case "city":
      data = airportname.city;
      break;
    case "country":
      data = airportname.country;
      break;
    case "all":
      data = airportname;
      break;
    default:
      data = `Invalid 'airports' parameter: ${airports}. Choose 'airport', 'state', or 'country'.`;
  }

  return data;
}

export const getSeatCodes = (seatData) => {
  if (!seatData) {
    return {};
  }

  const seatCodesByOrigin = {};

  // Iterate over each origin (HYD, DEL, etc.)
  Object.keys(seatData).forEach((origin) => {
    seatCodesByOrigin[origin] = (seatData[origin] || [])
      .map((seat) => seat?.["@attributes"]?.SeatCode)
      .filter(Boolean); // Remove any null or undefined SeatCodes
  });

  return seatCodesByOrigin;
};

export const getImageUrl = (imageName) =>
  `${BASE_URL}/homepageimg/${imageName}`;
export const getImageUrl1 = (imageName) => `${BASE_URL}${imageName}`;

export const images = [
  getImageUrl("holidaypackage.jpg"),
  getImageUrl("australia.jpg"),
  getImageUrl("China.jpg"),
  getImageUrl("Darjeeling.jpg"),
  getImageUrl("Gangtok.jpg"),
  getImageUrl("London.jpg"),
  getImageUrl("Malaysia.jpg"),
  getImageUrl("Thailand.jpg"),
  getImageUrl("USA.jpg"),
];

export const getRowsGroupedByOrigin = async (data) => {
  const result = { onward: {}, return: {} };

  const groupRows = (segments) => {
    const grouped = {};
    segments?.forEach((segment) => {
      // const origin = segment['@attributes']?.Origin;
      // const rows = segment && segment.Rows && segment.Rows[0]?.Row || null;

      // if (!origin) return;

      // if (!grouped[origin]) {
      //   grouped[origin] = { rows: [] };
      // }

      // grouped[origin].rows.push(...rows);

      const origin = segment["@attributes"]?.Origin;
      if (!origin) return;

      const rowsWrapper = segment?.Rows;
      const rowArray =
        Array.isArray(rowsWrapper) && rowsWrapper.length > 0
          ? rowsWrapper[0]?.Row
          : null;

      if (!grouped[origin]) {
        grouped[origin] = { rows: [] };
      }

      if (Array.isArray(rowArray) && rowArray.length > 0) {
        grouped[origin].rows = rowArray;
      } else {
        grouped[origin] = null;
      }
    });

    return grouped;
  };

  // Group onward data
  if (Array.isArray(data?.onward)) {
    result.onward = groupRows(data.onward);
  }

  // Group return data
  if (Array.isArray(data?.returnsegment)) {
    result.return = groupRows(data.returnsegment);
  }

  return result;
};

export const travelNewsimg = [
  {
    id: 1,
    title: "Top Countries to Visit In the Month of Summer",
    date: "26 Jan 2025",
    readTime: "5min read",
    image: getImageUrl("Topcountrieslist.png"),
    tags: ["Travel", "Summer", "Adventure", "Top Destinations"],
  },
  {
    id: 2,
    title:
      "Best Spiti Valley Tour Guide with itinerary, Destinations, and Travel Advice",
    date: "16 Jan 2025",
    readTime: "3min read",
    image: getImageUrl("spitilist.jpg"),
    tags: ["Valley tour", "Spiti ", "National Park", "Best Month"],
  },
  {
    id: 3,
    title: "Cheap Places to Travel in the World",
    date: "28 Jan 2025",
    readTime: "2min read",
    image: getImageUrl("cheapplaceslist.png"),
    tags: ["World", "Must Visit", "Adventure", "Tour"],
  },
  {
    id: 4,
    title: "Top 5 Places to Visit in Dubai for Free",
    date: "12 Jan 2025",
    readTime: "5min read",
    image: getImageUrl("dubailist.jpg"),
    tags: [
      "Dubai Fountain",
      "Dubai Tour",
      "places ",
      "Wildlife",
      "top places",
      "cheap things",
    ],
  },
  {
    id: 5,
    title: "Goa Tourism Guide for Your Upcoming Trip of 2025",
    date: "12 Jan 2025",
    readTime: "5min read",
    image: getImageUrl("goalist.png"),
    tags: ["tourism", "Beach", "resort ", "roaming"],
  },
];

export const specialofferimg = [
  getImageUrl("specialoffer.jpg"),
  getImageUrl("newsletter.jpg"),
  getImageUrl("traveltips.jpg"),
];

export const flightRoutes = [
  {
    from: "Chennai",
    to: "Mumbai",
    code: "MAA",
    code2: "BOM",
    image: getImageUrl("Mumbai.jpg"),
  },
  {
    from: "Mumbai",
    to: "Chennai",
    code: "BOM",
    code2: "MAA",
    image: getImageUrl("Chennai.jpg"),
  },
  {
    from: "Hyderabad",
    to: "Bangalore",
    code: "HYD",
    code2: "BLR",
    image: getImageUrl("Bangalore.jpg"),
  },
  {
    from: "Delhi",
    to: "Ahmedabad",
    code: "DEL",
    code2: "AMD",
    image: getImageUrl("Ahemdabad.jpg"),
  },
  {
    from: "Delhi",
    to: "Lucknow",
    code: "DEL",
    code2: "LKO",
    image: getImageUrl("Lucknow.jpg"),
  },
  {
    from: "Mumbai",
    to: "Kolkata",
    code: "BOM",
    code2: "CCU",
    image: getImageUrl("Kolkata.jpg"),
  },
];

export const flightRoutes2 = [
  {
    from: "Chandigarh",
    to: "Bangkok",
    code: "IXC",
    code2: "BKK",
    image: getImageUrl("Bangkok.jpg"),
  },
  {
    from: "Kolkata",
    to: "Malaysia",
    code: "CCU",
    code2: "KUL",
    image: getImageUrl("Malaysia2.jpg"),
  },
  {
    from: "Mumbai",
    to: "Dubai",
    code: "BOM",
    code2: "DXB",
    image: getImageUrl("Dubai.jpg"),
  },
  {
    from: "Delhi",
    to: "Dubai",
    code: "DEL",
    code2: "DXB",
    image: getImageUrl("Dubai.jpg"),
  },
  {
    from: "Delhi",
    to: "Singapore",
    code: "DEL",
    code2: "SIN",
    image: getImageUrl("Singapore.jpg"),
  },
  {
    from: "Mumbai",
    to: "Bangkok",
    code: "BOM",
    code2: "BKK",
    image: getImageUrl("Bangkok.jpg"),
  },
];

export const addHostTokensToSegments = (flightSegments, bookingData) => {
  if (!flightSegments) {
    return;
  }
  // Create a map of segment references to host tokens
  const hostTokenMap = bookingData.reduce((acc, item) => {
    const segmentRef = item["@attributes"].SegmentRef;
    const hostTokenRef = item["@attributes"].HostTokenRef;
    if (segmentRef && hostTokenRef) {
      acc[segmentRef] = hostTokenRef;
    }
    return acc;
  }, {});

  // Update flight segments by adding the matching host token
  return flightSegments.map((segment) => {
    const segmentKey = segment["@attributes"].Key;

    if (hostTokenMap[segmentKey]) {
      // Add HostTokenRef at the segment level
      segment.HostTokenRef = hostTokenMap[segmentKey];

      // Ensure HostTokenRef is removed from FlightDetails if it exists
      if (segment.FlightDetails && segment.FlightDetails["@attributes"]) {
        delete segment.FlightDetails["@attributes"].HostTokenRef;
      }
    }
    return segment;
  });
};

export const matchSegmentsWithHostToken = (hosttokedetails, segmentData) => {
  return segmentData.map((flightSegment) => {
    const segmentKey = flightSegment["@attributes"].Key;

    // Flatten all BookingInfo items from hosttokedetails
    const matchingBookingInfo = hosttokedetails
      .flatMap((item) => item.BookingInfo)
      .find((booking) => booking["@attributes"].SegmentRef === segmentKey);

    return {
      ...flightSegment,
      bookingInfoAttributes: matchingBookingInfo
        ? matchingBookingInfo["@attributes"]
        : null,
    };
  });
};

export const matchWithHostToken = (hosttokedetails, segmentData) => {
  if (!Array.isArray(hosttokedetails) || !Array.isArray(segmentData)) {
    return null;
  }

  const matchedTokens = segmentData
    .map((segment) => {
      const matchedToken = hosttokedetails.find(
        (token) =>
          token?._attributes?.Key ===
          segment?.bookingInfoAttributes?.HostTokenRef
      );
      if (matchedToken) {
        return {
          key: matchedToken._attributes.Key,
          hostTokenVal: matchedToken._value,
        };
      }
      return null;
    })
    .filter((token) => token !== null);

  return matchedTokens.length > 0 ? matchedTokens : null;
};

export const mergeSegmentData = (segmentRefs, flightSegments) => {
  if (!Array.isArray(segmentRefs) || !Array.isArray(flightSegments)) {
    return [];
  }

  return flightSegments.map((segment) => {
    const segmentKey = segment["@attributes"].Key;
    const matchedRef = segmentRefs.find(
      (ref) => ref["@attributes"].SegmentRef === segmentKey
    );
    if (matchedRef) {
      // Remove existing segmentkey if it exists
      delete segment.segmentkey;
      // Add bookinginfoattributes
      segment.bookingInfoAttributes = matchedRef["@attributes"];
    }

    return segment;
  });
};

// calculate price for plateform fee
export const calculateConvenienceFee = (
  tripType,
  trip,
  noOfAdults = 1,
  noOfChildren,
  noOfInfants
) => {
  let fee = 0;
  let adultFee = 0;

  const isDomestic = trip === "D";

  if (tripType === "oneway") {
    adultFee = isDomestic ? 349 : 849;
  } else if (tripType === "roundtrip") {
    adultFee = isDomestic ? 699 : 1499;
  }

  if (noOfAdults === 1) {
    fee += adultFee;
  } else if (noOfAdults >= 2) {
    const increasedFee = Math.round((adultFee * 70) / 100);
    fee += adultFee + increasedFee * (noOfAdults - 1);
  }

  fee += Math.round((adultFee * 50) / 100) * noOfChildren;
  fee += Math.round((adultFee * 60) / 100) * noOfInfants;

  return fee;
};

export const timeRanges = {
  BEFORE_6_AM: "Before 6 AM",
  BETWEEN_6_AM_12_PM: "6 AM - 12 PM",
  BETWEEN_12_PM_6_PM: "12 PM - 6 PM",
  AFTER_6_PM: "After 6 PM",
};

export const isWithinTimeRange1 = (time, range) => {
  // const hour = new Date(time).getHours();
  const hour = time?.substring(11, 13);
  switch (range) {
    case timeRanges.BEFORE_6_AM:
      return hour < 6;
    case timeRanges.BETWEEN_6_AM_12_PM:
      return hour >= 6 && hour < 12;
    case timeRanges.BETWEEN_12_PM_6_PM:
      return hour >= 12 && hour < 18;
    case timeRanges.AFTER_6_PM:
      return hour >= 18;
    default:
      return true; // If no range is selected, return all times.
  }
};

export const timeRangeData = [
  {
    timeRange: timeRanges.BEFORE_6_AM,
    iconClass: "fa-cloud-sun",
    label: "Before 6 AM",
  },
  {
    timeRange: timeRanges.BETWEEN_6_AM_12_PM,
    iconClass: "fa-sun",
    label: "6 AM - 12 PM",
  },
  {
    timeRange: timeRanges.BETWEEN_12_PM_6_PM,
    iconClass: "fa-smog",
    label: "12 PM - 6 PM",
  },
  {
    timeRange: timeRanges.AFTER_6_PM,
    iconClass: "fa-cloud-moon",
    label: "After 6 PM",
  },
];

export const isWithinTimeRange = (time, range) => {
  // console.log("both data ", time, range,time?.substring(11, 13))
  const hour = time?.substring(11, 13);
  // const hour = new Date(time).getHours();
  switch (range) {
    case timeRanges.BEFORE_6_AM:
      return hour < 6;
    case timeRanges.BETWEEN_6_AM_12_PM:
      return hour >= 6 && hour < 12;
    case timeRanges.BETWEEN_12_PM_6_PM:
      return hour >= 12 && hour < 18;
    case timeRanges.AFTER_6_PM:
      return hour >= 18;
    default:
      return true; // If no range is selected, return all times.
  }
};

export const filterGalileoDataIntern = (
  availabilities,
  selectedAirlines,
  minPrice,
  maxPrice,
  selectedTimeRange,
  selectedTimeRangearrival,
  stops,
  selectedTimeRange1,
  selectedTimeRangearrival1,
  stops1,
  nonStop
) => {
  // Filter the availabilities based on the conditions
  const filteredData =
    availabilities?.filter((data) => {
      const onwardSegmentsList = data.onwardsegments || [];
      const returnSegmentsList = data.returnsegments || [];
      // Onward filter
      const isAnyOnwardValid = onwardSegmentsList.some((segmentArray) => {
        const firstSegment = segmentArray?.[0];
        const lastSegment = segmentArray?.[segmentArray.length - 1];
        const stopsCount = segmentArray.length;

        const depTime = firstSegment?.["@attributes"]?.DepartureTime;
        const arrTime = lastSegment?.["@attributes"]?.ArrivalTime;
        const airline = firstSegment?.["@attributes"]?.Carrier;

        const isDepValid = isWithinTimeRange(depTime, selectedTimeRange);
        const isArrValid = isWithinTimeRange(arrTime, selectedTimeRangearrival);
        const isStopsValid = stops === null || stops === stopsCount;
        const isNonStopValid = !nonStop || stopsCount === 1;
        const isSelectedAirline = selectedAirlines.includes(airline);

        return (
          isDepValid &&
          isArrValid &&
          isStopsValid &&
          isNonStopValid &&
          isSelectedAirline
        );
      });

      // Return filter
      const isAnyReturnValid = returnSegmentsList.some((segmentArray) => {
        const firstSegment = segmentArray?.[0];
        const lastSegment = segmentArray?.[segmentArray.length - 1];
        const stopsCount = segmentArray.length;

        const depTime = firstSegment?.["@attributes"]?.DepartureTime;
        const arrTime = lastSegment?.["@attributes"]?.ArrivalTime;
        const airline = firstSegment?.["@attributes"]?.Carrier;
        const isSelectedAirline = selectedAirlines.includes(airline);

        const isDepValid = isWithinTimeRange(depTime, selectedTimeRange1);
        const isArrValid = isWithinTimeRange(
          arrTime,
          selectedTimeRangearrival1
        );
        const isStopsValid = stops1 === null || stops1 === stopsCount;
        const isNonStopValid = !nonStop || stopsCount === 1;
        return (
          isDepValid &&
          isArrValid &&
          isStopsValid &&
          isNonStopValid &&
          isSelectedAirline
        );
      });

      // Check if the price is within the specified range
      const isPriceInRange =
        parseFloat(
          data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace(
            "INR",
            ""
          )
        ) >= minPrice &&
        parseFloat(
          data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace(
            "INR",
            ""
          )
        ) <= maxPrice;

      // Return true if all conditions are met
      return isPriceInRange && isAnyOnwardValid && isAnyReturnValid;
      // return isSelectedAirline && isPriceInRange && isTimeInRange && isTimeInRange1 && isStopCountValid && isNonStopValid;
    }) || [];

  // Sort the filtered data in ascending order of price
  return filteredData.sort((a, b) => {
    const priceA = parseFloat(
      a?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "")
    );
    const priceB = parseFloat(
      b?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "")
    );
    return priceA - priceB;
  });
};

export const filterGalileoData = (
  availabilities,
  selectedAirlines,
  minPrice,
  maxPrice,
  selectedTimeRange,
  selectedTimeRangearrival,
  stops,
  nonStop
) => {
  // Filter the availabilities based on the conditions
  const filteredData =
    availabilities?.filter((data) => {
      const itinerary = data.segments[0]["@attributes"].Carrier; // Find airline code
      const departureTime = data?.segments[0]?.["@attributes"]?.DepartureTime;
      // Access the last segment's arrival time
      const lastItinerarySegment = data?.segments?.[data?.segments.length - 1];
      const arrivalTime = lastItinerarySegment?.["@attributes"]?.ArrivalTime;

      // Check if the airline is not in the selectedAirlines array
      // const isSelectedAirline = !selectedAirlines.includes(itinerary);
      const isSelectedAirline = selectedAirlines.includes(itinerary);

      // Check if the price is within the specified range
      const isPriceInRange =
        parseFloat(
          data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace(
            "INR",
            ""
          )
        ) >= minPrice &&
        parseFloat(
          data?.PricingInfos["@attributes"].ApproximateTotalPrice.replace(
            "INR",
            ""
          )
        ) <= maxPrice;

      // Check if the departure time is within the selected range
      const isTimeInRange = selectedTimeRange
        ? isWithinTimeRange(departureTime, selectedTimeRange)
        : true;
      const isTimeInRange1 = selectedTimeRangearrival
        ? isWithinTimeRange(arrivalTime, selectedTimeRangearrival)
        : true;

      // Check if the stops match the selected criteria
      const isStopCountValid = stops === null || data.segments.length === stops;

      // Check for non-stop flights if applicable
      const isNonStopValid = !nonStop || data.segments.length === 1;

      // Return true if all conditions are met
      return (
        isSelectedAirline &&
        isPriceInRange &&
        isTimeInRange &&
        isTimeInRange1 &&
        isStopCountValid &&
        isNonStopValid
      );
    }) || [];

  // Sort the filtered data in ascending order of price
  return filteredData.sort((a, b) => {
    const priceA = parseFloat(
      a?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "")
    );
    const priceB = parseFloat(
      b?.PricingInfos["@attributes"].ApproximateTotalPrice.replace("INR", "")
    );
    return priceA - priceB;
  });
};

export const filterFlights = (
  flightsData,
  selectedAirlines = [],
  stops,
  nonStop,
  minPrice,
  maxPrice,
  selectedTimeRange,
  selectedTimeRangearrival
) => {
  // Check if flightsData is a valid array, if not return an empty array
  if (!Array.isArray(flightsData)) {
    return [];
  }

  // Filter flights based on provided criteria
  return flightsData.filter((flight) => {
    // Ensure flightDetails is always an array
    const flightDetails = Array.isArray(flight?.flights?.flightDetails)
      ? flight?.flights?.flightDetails
      : [flight?.flights?.flightDetails];

    // If flightDetails is empty, exclude the flight
    if (!flightDetails || flightDetails.length === 0) {
      return false;
    }

    // Extract departure and arrival times from the first and last flight segments
    const firstSegment = flightDetails[0];
    const lastSegment = flightDetails[flightDetails.length - 1];

    // Get departure and arrival times
    const departureTime =
      firstSegment?.flightInformation?.productDateTime?.timeOfDeparture;
    const arrivalTime =
      lastSegment?.flightInformation?.productDateTime?.timeOfArrival;
    const departureDate =
      firstSegment?.flightInformation?.productDateTime?.dateOfDeparture;
    const arrivalDate =
      lastSegment?.flightInformation?.productDateTime?.dateOfArrival;

    // Convert departure and arrival dates to Date objects
    const departureDateTime = new Date(
      `20${departureDate.slice(4)}-${departureDate.slice(2, 4)}-${departureDate.slice(0, 2)}T${departureTime.slice(0, 2)}:${departureTime.slice(2)}`
    );
    const arrivalDateTime = new Date(
      `20${arrivalDate.slice(4)}-${arrivalDate.slice(2, 4)}-${arrivalDate.slice(0, 2)}T${arrivalTime.slice(0, 2)}:${arrivalTime.slice(2)}`
    );

    // Extract the marketing carrier from the first flight segment
    const marketingCarrier =
      firstSegment?.flightInformation?.companyId?.marketingCarrier || "";

    // Calculate total fare by adding different monetary details (ensure values are parsed as floats)
    const totalFare =
      (parseFloat(
        flight?.recommendations?.recPriceInfo?.monetaryDetail?.[0]?.amount
      ) || 0) +
      (parseFloat(
        flight?.recommendations?.recPriceInfo?.monetaryDetail?.[1]?.amount
      ) || 0);

    // Helper function to check if a time is within a given range
    const isWithinDepartureRange = selectedTimeRange
      ? isWithinTimeRange1(departureDateTime, selectedTimeRange)
      : true; // If no time range is selected, allow all flights

    const isWithinArrivalRange = selectedTimeRangearrival
      ? isWithinTimeRange1(arrivalDateTime, selectedTimeRangearrival)
      : true;

    // Filtering logic
    return (
      // Filter by airline: Exclude flights for selected airlines if any are chosen
      (selectedAirlines.length === 0 ||
        selectedAirlines.some((code) => marketingCarrier.includes(code))) &&
      // Filter by price range: Ensure the total fare is within the given range
      totalFare >= minPrice &&
      totalFare <= maxPrice &&
      // Filter by number of stops: If a specific number of stops is required, match it
      (stops === null || flightDetails.length === stops) &&
      // Filter by non-stop flights: Ensure there is only one segment if nonStop is true
      (!nonStop || flightDetails.length === 1) &&
      // Filter by time ranges: Ensure flight falls within the selected departure and arrival time ranges
      isWithinDepartureRange &&
      isWithinArrivalRange
    );
  });
};

export const navbarRoutes = [
  "/",
  "/blog/:id",
  "/contact-us",
  "/blogs",
  "/testimonial",
  "/SpecialFlightCard",
  "/SpecialFlightDetails",
  "/specialflight",
  "/domestic-flights",
  "/international-flights",
  // "/login/user-login",
  // "/login/agent-login",
  "/web-check-in",
  "/privacy-policy",
  "/terms-and-conditions",
  "/user-agreement",
  "/customer-profile",
  "/about-pages",
  "/careerspages",
  "/flightreview",
  "/flightdetails/*",
  "/flights/*",
  "/offers/terms-and-conditionss",
];

export const indigoAirlinebaggage = (
  flightDetails,
  trip = "D",
  origin,
  destination
) => {
  if (!flightDetails || flightDetails.length === 0) {
    return []; // No flight details, return empty array
  }

  const checkInBaggage = trip === "I" ? "30K" : "15K"; // Baggage weight based on trip type

  const baggageInfo = flightDetails
    .map((segment) => {
      if (!segment["@attributes"]) return null;

      const { Origin, Destination, Carrier } = segment["@attributes"];

      // Only include if matches direction: origin -> destination path
      const isValidDirection =
        origin && destination
          ? Origin !== destination && Destination !== origin
          : true; // fallback: if no filter provided, return all

      if (!isValidDirection) return null;

      return {
        origin: Origin,
        destination: Destination,
        carrier: Carrier,
        checkInBaggage: checkInBaggage,
        cabinBaggage: "7K",
      };
    })
    .filter((item) => item !== null); // Remove nulls

  return baggageInfo;
};

export const getChipsByAmount = (amount, data) => {
  if (!amount || !Array.isArray(data)) return null;

  // const slab = data.find(
  //   (item) =>
  //     amount >= item.from_amount && amount <= item.to_amount && item.status
  // );

  // return slab ? slab.chips : null;
  return data[0] ? data[0]?.chips : null;
};
export const extraDiscountamount = (carrierCode, data) => {
  if (!carrierCode || !Array.isArray(data)) return 0;

  const match = data.find(
    (item) => item.airline === carrierCode && item.status === "1"
  );

  return match ? Number(match.amount) : 0;
};

export const matchSpecialFlight = (segments = [], specialFlights = []) => {
  if (!segments.length || !specialFlights?.length) return null;

  const matched = specialFlights.find((sf) => {
    const legs = sf.legs || [];

    if (legs.length) {
      if (legs.length !== segments.length) return false;

      return legs.every((leg, i) => {
        const seg = segments[i]["@attributes"];
        return (
          leg.carrier_code?.toUpperCase() === seg.Carrier?.toUpperCase() &&
          String(leg.flight_number) === String(seg.FlightNumber) &&
          leg.origin_code?.toUpperCase() === seg.Origin?.toUpperCase() &&
          leg.destination_code?.toUpperCase() === seg.Destination?.toUpperCase()
        );
      });
    }

    if (sf.ticket_id) {
      if (segments.length !== 1) return false;

      const seg = segments[0]["@attributes"];
      const [carrierCode, ...rest] = (sf.flight_number || "").split(" ");
      const flightNum = rest.join("").trim();

      return (
        carrierCode?.toUpperCase() === seg.Carrier?.toUpperCase() &&
        flightNum === String(seg.FlightNumber) &&
        sf.origin?.toUpperCase() === seg.Origin?.toUpperCase() &&
        sf.destination?.toUpperCase() === seg.Destination?.toUpperCase()
      );
    }

    if (sf.onward_connecting) {
      if (sf.onward_connecting.length === 0) {
        if (segments.length !== 1) return false;

        const seg = segments[0]["@attributes"];
        return (
          sf.airline_code?.toUpperCase() === seg.Carrier?.toUpperCase() &&
          String(sf.flight_number) === String(seg.FlightNumber) &&
          sf.dep_airport_code?.toUpperCase() === seg.Origin?.toUpperCase() &&
          sf.arr_airport_code?.toUpperCase() === seg.Destination?.toUpperCase()
        );
      }

      if (sf.no_of_stop > 0 && sf.onward_connecting?.length) {
        if (sf.onward_connecting.length !== segments.length) return false;

        return sf.onward_connecting.every((leg, i) => {
          const seg = segments[i]["@attributes"];
          return (
            leg.airline_code?.toUpperCase() === seg.Carrier?.toUpperCase() &&
            String(leg.flight_number) === String(seg.FlightNumber) &&
            leg.departure_airport_code?.toUpperCase() ===
              seg.Origin?.toUpperCase() &&
            leg.arrival_airport_code?.toUpperCase() ===
              seg.Destination?.toUpperCase()
          );
        });
      }
    }

    return false;
  });

  return matched || null;
};

export const getFlightSegments = (flightData) => {
  const segments = [];
  // ✅ Case 1: Special flight (has `legs`)
  if (flightData?.legs?.length > 0) {
    flightData.legs.forEach((leg) => {
      segments.push({
        Origin: leg.origin_code?.toUpperCase(),
        Destination: leg.destination_code?.toUpperCase(),
        carrier_code: leg.carrier_code || "",
        flight_number: leg.flight_number || "",
        departureTime: leg?.departure_time || "",
        arrivalTime: leg?.arrival_time,
        departure_terminal: leg.departure_terminal || "",
        arrival_terminal: leg.arrival_terminal || "",
        booking_Status: leg.booking_status || "Non Refundable (LIVE Booking)",
      });
    });
  }

  // // ✅ Case 2: FDKing direct flight (no onward_connecting)
  // else if (flightData?.onward_connecting?.length === 0) {
  //   segments.push({
  //     Origin: flightData.dep_city_code?.toUpperCase(),
  //     Destination: flightData.arr_city_code?.toUpperCase(),
  //     carrier_code: flightData.airline_code || "",
  //     flight_number: flightData.flight_number || "",
  //     departureTime: `${flightData.onward_date || ""}T${flightData.dep_time || "00:00"}:00.000Z`,
  //     arrivalTime: `${flightData.arr_date || ""}T${flightData.arr_time || "00:00"}:00.000Z`,
  //     departure_terminal: flightData.dep_terminal_no || "",
  //     arrival_terminal: flightData.arr_terminal_no || "",
  //     booking_Status:
  //       flightData.booking_status || "Non Refundable (LIVE Booking)",
  //   });
  // }

  // // ✅ Case 3: FDKing layover flight (has onward_connecting)
  // else if (flightData?.onward_connecting?.length > 0) {
  //   flightData.onward_connecting.forEach((seg) => {
  //     segments.push({
  //       Origin: seg.departure_city_code?.toUpperCase(),
  //       Destination: seg.arrival_city_code?.toUpperCase(),
  //       carrier_code: seg.airline_code || "",
  //       flight_number: seg.flight_number || "",
  //       departureTime: `${seg.departure_date || ""}T${seg.departure_time || "00:00"}:00.000Z`,
  //       arrivalTime: `${seg.arrival_date || ""}T${seg.arrival_time || "00:00"}:00.000Z`,
  //       departure_terminal: seg.departure_terminal_no || "",
  //       arrival_terminal: seg.arrival_terminal_no || "",
  //       booking_Status: seg.booking_status || "Non Refundable (LIVE Booking)",
  //     });
  //   });
  // }
  // ✅ Case 4: AirIQ flight data (flat structure, no onward_connecting or legs)
  else if (
    flightData?.departure_date &&
    flightData?.departure_time &&
    flightData?.arival_date &&
    flightData?.arival_time &&
    flightData?.ticket_id
  ) {
    segments.push({
      Origin: flightData.origin?.toUpperCase(),
      Destination: flightData.destination?.toUpperCase(),
      carrier_code: flightData.flight_number?.slice(0, 2).toUpperCase() || "",
      flight_number:
        flightData.flight_number?.substring(
          flightData.flight_number.indexOf(" ") + 1
        ) || "",
      departureTime: `${flightData.departure_date.replace(/\//g, "-")}T${flightData.departure_time}:00.000Z`,
      arrivalTime: `${flightData.arival_date.replace(/\//g, "-")}T${flightData.arival_time}:00.000Z`,
      departure_terminal: flightData.departure_terminal || "",
      arrival_terminal: flightData.arrival_terminal || "",
      booking_Status:
        flightData.booking_status || "Non Refundable (LIVE Booking)",
    });
  }

  return segments;
};

export const getServiceFee = (tripType, agentType) => {
  const fees = {
    A: { D: 220, I: 1095 },
    B: { D: 200, I: 1199 },
    C: { D: 420, I: 1095 },
  };

  const agentFees = fees[agentType] || fees["A"];

  return agentFees[tripType] || 0;
};

export const getAdditiondiscount = (tripType) => {
  switch (tripType) {
    case "D":
      return 500;
    case "I":
      return 1400;
    default:
      return 0;
  }
};

export const paymentModes = [
  { key: "credit", label: "CREDIT CARD" },
  { key: "debit", label: "DEBIT CARD" },
  { key: "upi", label: "UPI" },
  { key: "netbanking", label: "NET BANKING" },
  { key: "wallet", label: "WALLET" },
];

export const getDeductionPercent = (mode) => {
  switch (mode) {
    case "credit":
      return 2.5;
    case "debit":
      return 2.5;
    case "upi":
      return 0.5;
    case "wallet":
      return 2.5;
    default:
      return 0;
  }
};

export const getDeductedAmount = (amount, mode) => {
  if (mode === "netbanking") {
    return (amount - 50).toFixed(2);
  }

  const percent = getDeductionPercent(mode);
  return (amount - (amount * percent) / 100).toFixed(2);
};

export const isAfterThreeDays = (formattedDate, carrierCode) => {
  if (!formattedDate) return false;
  if (!carrierCode) return false;
  if (carrierCode === "6E") {
    const bookingDate = new Date(formattedDate);
    bookingDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 4);
    return bookingDate > threeDaysLater;
  }
  return true;
};

export const buildPassengerFormData = ({
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
}) => {
  if (apiType !== "Galileo") return {};

  const commonCustomerInfo = {
    Email: email,
    Mobile: localNumber,
    Address: "new delhi",
    City: "Rohini",
    State: "Delhi",
    CountryCode: "INR",
    CountryName: countryCodevl,
    ZipCode: "400101",
    PassengerDetails: passengers,
  };

  const travellerquantity = {
    noOfAdults: adult,
    noOfChilds: children,
    noOfInfants: infant,
  };

  const baseFormData = {
    otherInformation: triptype,
    trip: trips,
    travellerquantity,
    CustomerInfo: commonCustomerInfo,
  };

  /* ================= ONE WAY ================= */
  if (triptype === "oneway") {
    return {
      formData: {
        ...baseFormData,
        TransactionId: TransactionID || "",
        GstDetails: gstData || "",
        Flightdata: galileoData,
        pricingSolution: matchedSolution,
      },
      formData1: null,
    };
  }

  /* ================= ROUND TRIP ================= */
  if (triptype !== "oneway" && responseData1?.trip === "D") {
    return {
      formData: {
        ...baseFormData,
        TransactionId: TransactionID || "",
        Flightdata: galileoData,
        pricingSolution: matchedSolution,
      },
      formData1: {
        ...baseFormData,
        TransactionId: TransactionID1 || "",
        Flightdata: galileoData1,
        pricingSolution: matchedSolution1,
      },
    };
  }

  /* ================= INTERNATIONAL ================= */
  if (triptype !== "oneway" && responseData1?.trip === "I") {
    return {
      formData: {
        ...baseFormData,
        TransactionId: TransactionID || "",
        GstDetails: gstData || "",
        Flightdata: galileoData,
        pricingSolution: matchedSolution,
        HostTokenV2: HostToken || null,
      },
      formData1: null,
    };
  }

  return {};
};

export const indigoFlightType = (data) => {
  const fareList = data?.airFareInfolist;

  if (!Array.isArray(fareList)) return null;

  // Find first Indigo (6E) fare with FareFamily
  const indigoFare = fareList.find(
    (item) =>
      item?.["@attributes"]?.SupplierCode === "6E" &&
      item?.["@attributes"]?.FareFamily
  );

  return indigoFare?.["@attributes"]?.FareFamily || null;
};
