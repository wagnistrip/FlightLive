import React, { useEffect, useState } from 'react'
import { galileoApi } from '../Api/apiService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addHostTokensToSegments, airpriceData, formatPassengers, getRowsGroupedByOrigin } from '../utils/airlineUtils';

function SeatModal({ data, goToStep, modalVisible, setModalVisible, data1, flightType, setSeatMaps, setSeatMap, seatMaps, seatMap, setOptionalService, optionservice, setSeatMaps1, setSeatMap1, seatMap1 }) {
  const [loading, setLoading] = useState(false);
  const traveldata = data?.travellerquantity;

  const offerAvalibiltycheck = async (flightSegmentData) => {
    // setModalvisible(true);// Show loading indicator
    // console.log(flightSegmentData,"data check for offer availaibity")
    const requestData = {
      "PassengerDetails": flightSegmentData?.CustomerInfo.PassengerDetails,
      "airSegment": flightSegmentData?.segmentData,
      "travellerquantity": flightSegmentData?.travellerquantity
    };

    try {
      console.log("body request for offeravailbilty", requestData)
      const responseData = await galileoApi("/Galileo/OfferAvailabilty", requestData);
      console.log("return offeravaility dat => ", responseData);
      // return;

      if (responseData.status === 200) {
        // return responseData;
        console.log("return data here : ", responseData?.passanger.Body.AirMerchandisingOfferAvailabilityRsp);
        setOptionalService(responseData)
        setLoading(false)
        setModalVisible(false);
        goToStep(2);
      }
      else {
        setOptionalService([])
        setLoading(false)
        setModalVisible(false);
        goToStep(2);
      }
    } catch (error) {
      console.error("Seat map fetch error:", error);
      return null;
    }
  };
  const fetchSeatMap = async (flightroutes, flightSegmentData) => {
    try {
      const responseData = await galileoApi(flightroutes, flightSegmentData);
      // const responseData = await galileoApi("/GalileoInd/seat-map", requestData);
      if (responseData.status === 200) {
        return responseData && responseData?.passanger;
      }
      else {
        return null;
      }

    } catch (error) {
      return null; // Return null in case of error
    } finally {
    }
  };

  const fetchAllSeatMaps = async (parsedDatachange, data, optionservice, tripType) => {
    if (parsedDatachange && parsedDatachange?.segmentdata && parsedDatachange?.returnSegmentData) {
      const firstOrigin = parsedDatachange && parsedDatachange?.segmentdata[0]["@attributes"].Origin;
      const CarrierCode = parsedDatachange && parsedDatachange?.segmentdata[0]["@attributes"].Carrier;
      const secondOrigin = parsedDatachange && parsedDatachange?.returnSegmentData[0]["@attributes"].Origin
      const itinerary = {
        segmentdata: parsedDatachange?.segmentdata,
        returnAirSegment: parsedDatachange?.returnSegmentData,
        Hosttoken: parsedDatachange?.Hosttoken,
        trip: 'I',
        tripType: 'roundtrip'
      }

      const apiEndPoint = CarrierCode === '6E' ? "/GalileoInd/seat-map" : "/Galileo/pre-seat-Map"
      if (parsedDatachange && seatMap === null && seatMap1 === null) {
        // if(CarrierCode === '6E'){
        //   return
        // }

        const seatMapData = await fetchSeatMap(apiEndPoint, itinerary);
        const formattedData = await getRowsGroupedByOrigin(seatMapData);
        await new Promise((resolve) => {
          setSeatMaps(formattedData?.onward);
          setSeatMap(formattedData?.onward[firstOrigin]);
          setSeatMaps1(formattedData?.return);
          setSeatMap1(formattedData?.return[secondOrigin]);
          resolve();
        });
      } else {
        setLoading(false)
        setModalVisible(false);
        goToStep(2);
      }
    } else {

      // console.log(parsedDatachange,"test here indigo");
      // const parsedData = parsedDatachange.segmentdata.map((segment, index) => ({
      //   airSegment: [segment],
      //   Hosttoken: parsedDatachange.Hosttoken,
      //   segmentkey: Array.isArray(parsedDatachange.segmentkey) ? parsedDatachange.segmentkey[index] : parsedDatachange.segmentkey
      // }));

      // if (parsedData && seatMap === null) {
      //   let allSeatMaps = {};
      //   for (let i = 0; i < parsedData.length; i++) {
      //     const itinerary = parsedData[i];
      //     const origin = itinerary.airSegment[0]["@attributes"].Origin;
      //     const seatMapData = await fetchSeatMap(itinerary);
      //     // Store seat map data in an object with origin as the key
      //     allSeatMaps[origin] = seatMapData;
      //   }
      //   // console.log("seatamp data combile here == > ",allSeatMaps);
      //   // setSeatMaps(allSeatMaps);
      //   // if (parsedData[0]) {
      //   //     const firstOrigin = parsedData[0].airSegment[0]["@attributes"].Origin;
      //   //     setSeatMap(allSeatMaps[firstOrigin]);

      //   //     if(optionservice.length === 0){
      //   //       // offerAvalibiltycheck(data);
      //   //       setOptionalService([])
      //   //       setLoading(false)
      //   //       setModalVisible(false);
      //   //       goToStep(2);
      //   //     }

      //   //     // call api here offerAvalabilites
      //   // }



      //   if (tripType === "onward" && parsedData[0]) {
      //     await new Promise((resolve) => {
      //       setSeatMaps(allSeatMaps);
      //       const firstOrigin = parsedData[0].airSegment[0]["@attributes"].Origin;
      //       setSeatMap(allSeatMaps[firstOrigin]);
      //       resolve();
      //     });
      //   } else if (tripType === "return" && parsedData[0]) {
      //     await new Promise((resolve) => {
      //       setSeatMaps1(allSeatMaps);
      //       const firstOrigin = parsedData[0].airSegment[0]["@attributes"].Origin;
      //       setSeatMap1(allSeatMaps[firstOrigin]);
      //       resolve();

      //     });
      //   }

      //   // if (optionservice.length === 0) {
      //   //   setOptionalService([]);
      //   //   // setLoading(false);
      //   //   // setModalVisible(false);
      //   //   // goToStep(2);
      //   // }

      //   if (optionservice.length === 0) {
      //     // console.log("Calling offerAvailibiltycheck since optionservice is empty.");
      //     // await offerAvalibiltycheck(data);
      //     setOptionalService([])
      //   }

      // } else {
      //   setLoading(false)
      //   setModalVisible(false);
      //   goToStep(2);
      // }


      const itinerary = {
        AirSegment: parsedDatachange?.segmentdata,
        HostToken: parsedDatachange?.Hosttoken,
      }
      if (parsedDatachange && seatMap === null) {
        const firstOrigin = parsedDatachange && parsedDatachange?.segmentdata && parsedDatachange?.segmentdata[0]["@attributes"]?.Origin;
        const CarrierCode = parsedDatachange && parsedDatachange?.segmentdata && parsedDatachange?.segmentdata[0]["@attributes"]?.Carrier;
        const apiEndPoint = CarrierCode === '6E' ? "/GalileoInd/seat-map" : "/Galileo/pre-seat-Map"
        const seatMapData = await fetchSeatMap(apiEndPoint, itinerary);
        const formattedData = await getRowsGroupedByOrigin(seatMapData);
        if (formattedData && formattedData?.onward && tripType === "onward") {
          await new Promise((resolve) => {
            setSeatMaps(formattedData?.onward);
            setSeatMap(formattedData?.onward[firstOrigin]);
            resolve();
          });
        } else if (formattedData && formattedData?.onward && tripType === "return") {
          await new Promise((resolve) => {
            setSeatMaps1(formattedData?.onward);
            setSeatMap1(formattedData?.onward[firstOrigin]);
            resolve();
          });
        }

      } else {
        setLoading(false)
        setModalVisible(false);
        goToStep(2);
      }
    }
  };

  const handleConfirm = async (data, data1) => {
    setLoading(true);

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

    const formatPricingData = (pricingSolution, travellerQuantity) => {
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


    const createRequestBody = (flightData, pricingData, customerInfo) => {

      const priceInfodata = Array.isArray(flightData?.pricingSolution?.AirPricingInfo) ? flightData?.pricingSolution?.AirPricingInfo : [flightData?.pricingSolution?.AirPricingInfo]
      const bookingData = Array.isArray(priceInfodata[0].BookingInfo) ? priceInfodata[0].BookingInfo : [priceInfodata[0].BookingInfo]


      const flightSegments = Array.isArray(flightData?.Flightdata?.AirItinerary?.AirSegment)
        ? flightData?.Flightdata?.AirItinerary?.AirSegment
        : [flightData?.Flightdata?.AirItinerary?.AirSegment];

      const updatedFlightSegments = addHostTokensToSegments(flightSegments, bookingData);
      const returnSegments = flightData?.Flightdata?.AirItinerary?.returnSegment
        ? (Array.isArray(flightData.Flightdata.AirItinerary.returnSegment)
          ? flightData.Flightdata.AirItinerary.returnSegment
          : [flightData.Flightdata.AirItinerary.returnSegment])
        : null; // Set to null if not available
      const updatedFlightSegments1 = addHostTokensToSegments(returnSegments, bookingData);

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
          "companyName": "WAGNISTRIP (OPC) PRIVATE LIMITED",
          "gstNumber": "07AAOCM4506G1ZF"
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
        ...(updatedFlightSegments1 ? { returnSegmentData: updatedFlightSegments1 } : {}),
        pricingSolution: [flightData.pricingSolution["@attributes"]],
        adultData: [pricingData.dataAdt],
        childData: [pricingData.dataChd],
        infantData: [pricingData.dataInf],
        common_v52_0HostToken: hostToken,
        hostTokenAgain: flightData?.HostTokenV2
      };
    };

    try {
      // Handle data (one-way) and data1 (return-trip) separately or combined
      const pricingData = formatPricingData(data.pricingSolution, data.travellerquantity);
      const requestData = createRequestBody(data, pricingData, data.CustomerInfo);
      let returnRequestData;
      let returnPricingData;
      if (data1) {
        returnPricingData = formatPricingData(data1.pricingSolution, data1.travellerquantity);
        returnRequestData = createRequestBody(data1, returnPricingData, data1.CustomerInfo);

      }
      // return;
      const apiCalls = [galileoApi("/Galileo/add-passenger-details", requestData)];
      if (returnRequestData) {
        apiCalls.push(galileoApi("/Galileo/add-passenger-details", returnRequestData));
      }
      // Execute API calls concurrently
      const responses = await Promise.all(apiCalls);
      const [response, returnResponse] = responses;

      if (response?.status === 200 || returnResponse?.status === 200) {
        const apiTasks = [];

        // Handle onward flight seat maps
        if (response?.status === 200 && response?.passenger?.segmentData) {
          const onwardReqData = {
            segmentdata: response?.passenger?.segmentData,
            ...(response?.passenger?.returnSegmentData ? { returnSegmentData: response?.passenger?.returnSegmentData } : {}),
            Hosttoken: requestData && requestData?.hostTokenAgain ? requestData?.hostTokenAgain : requestData?.common_v52_0HostToken,
            segmentkey: pricingData?.dataAdt?.airBookingInfo,
          };
          apiTasks.push(fetchAllSeatMaps(onwardReqData, requestData, optionservice, "onward"));
        }

        // Handle return flight seat maps
        if (returnResponse?.status === 200) {
          const returnReqData = {
            segmentdata: returnResponse?.passenger?.segmentData,
            Hosttoken: returnRequestData.common_v52_0HostToken,
            segmentkey: returnPricingData?.dataAdt?.airBookingInfo,
          };
          apiTasks.push(fetchAllSeatMaps(returnReqData, returnRequestData, optionservice, "return"));
        }

        try {
          // Execute both fetchAllSeatMaps calls concurrently
          await Promise.all(apiTasks);
          console.log("Seat maps fetched successfully for both segments.");

          // here also call offerAvalibiltycheck api
          setLoading(false)
          setModalVisible(false);
          goToStep(2);
          // Additional success handling
        } catch (error) {
          console.error("Error fetching seat maps:", error);
          // handleApiError();
        }
      } else {
        // Handle the case where neither response is successful
        // handleApiError();
        setLoading(false)
        setModalVisible(false);
      }


    } catch (error) {
      console.error('Error:', error);
      setLoading(false)
      setModalVisible(false);
    }
  };


  const Fare_PricePNRWithBooking = async (data) => {
    const reqbody = {
      "awsseSessionId": data?.Session.SessionId,
      "awsseSequenceNumber": data?.Session.SequenceNumber,
      "awsseSecurityToken": data?.Session.SecurityToken,
    };

    try {
      const response = await galileoApi("/amadeus/getPnr", reqbody);
      console.log('Response getPnr:', response);
      // alert(response.message);
      // if (response && response?.status === 200) {
      //   const result = tstform(response?.passanger.Header,traveldata);
      //   if(result){
      //     return result;
      //   }else{
      //     return null;
      //   }

      // } else {
      //     console.warn("Booking failed or response not 200", response);
      //     return null;  // Return null or handle this case as needed
      // }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSeatMap = async (segmentDetails) => {
    // console.log("Segment details received:", segmentDetails);

    const segments = Array.isArray(segmentDetails) ? segmentDetails : [segmentDetails];

    if (segments.length === 0) {
      // console.error("Invalid segment details:", segmentDetails);
      return;
    }

    let seatMapData = {};
    let firstOrigin = null; // Store the first origin

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const flightDetails = segment?.flightDetails;

      if (!flightDetails) {
        // console.error("Missing flightDetails in segment:", segment);
        continue;
      }

      const { boardPointDetails, offpointDetails, flightIdentification, flightDate, companyDetails } = flightDetails;

      if (
        !boardPointDetails?.trueLocationId ||
        !offpointDetails?.trueLocationId ||
        !flightIdentification?.flightNumber ||
        !companyDetails?.marketingCompany ||
        !flightDate?.departureDate
      ) {
        // console.error("Incomplete flight data in segment:", segment);
        continue;
      }

      const payload = {
        bookingClass: flightIdentification?.bookingClass || "N/A",
        FlightNumber: flightIdentification?.flightNumber,
        CompanyId: companyDetails?.marketingCompany,
        Destination: offpointDetails?.trueLocationId,
        Origin: boardPointDetails?.trueLocationId,
        DepartureDate: flightDate?.departureDate,
      };

      // Capture first origin only once
      if (i === 0) {
        firstOrigin = payload.Origin;
      }

      try {
        const seatResponse = await galileoApi("/amadeus/RetriveSeatmap", payload);
        // console.log(`Seat map response for Origin ${payload.Origin}:`, seatResponse);

        if (seatResponse?.seatMaps?.seatRows) {
          const originKey = payload.Origin;
          if (!seatMapData[originKey]) {
            seatMapData[originKey] = { rows: [] };
          }
          seatMapData[originKey].rows = seatResponse.seatMaps.seatRows;
        }
      } catch (error) {
        console.error("Error fetching seat map for payload:", payload, error);
      }
    }

    // console.log("Final Seat Map Data:", seatMapData);
    setSeatMaps(seatMapData); // Store full seat map data

    // Store only the first origin's rows or fallback to an empty array
    if (firstOrigin && seatMapData[firstOrigin]) {
      const firstsegmentdata = { "rows": seatMapData[firstOrigin].rows }
      setSeatMap(firstsegmentdata);
    } else {
      setSeatMap([]);
    }

    // UI updates after fetching seat maps
    setLoading(false);
    setModalVisible(false);
    goToStep(2); // Navigate to step 2
  };


  const Amaduespass = async (data) => {
    setLoading(true)
    const apiData = formatPassengers(data);
    const requestData = apiData;

    console.log("Request body for adding passengers:", requestData);

    // return;
    try {
      const response = await galileoApi("/amadeus/passangerInfo", requestData);
      console.log("console data response:", response);

      if (response && response?.status === 200) {
        await handleSeatMap(data?.segment);
      } else {
        setLoading(false);
        setModalVisible(false);
        goToStep(1);
      }
    } catch (error) {
      console.error('Error:', error);
      setModalVisible(false);
      setLoading(false)
    }
  };

  return (
    <>
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            width: "450px",
            maxWidth: "95vw",
            borderRadius: 1.5,
            p: 1,
            position: "relative",
          },
        }}
      >
        {/* Header with Close Button */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 5,
          }}
        >
          Review Details
          <IconButton
            onClick={() => setModalVisible(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#f2f2f2",
              backgroundColor: "#01186c",
              "&:hover": { backgroundColor: "#e0e0e0", color: '#01186c' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent dividers sx={{ maxHeight: 400, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please make sure that your name and other information match the
            spelling on your travel documents and government ID. If they don't, it
            will be unable to amend them later, and mistakes could result in
            cancellation fees.
          </Typography>

          {(data?.CustomerInfo?.PassengerDetails ||
            data1?.CustomerInfo?.PassengerDetails)?.map((passenger, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                borderRadius={2}
                boxShadow={1}
                sx={{ backgroundColor: "#fff" }}
              >
                <Typography fontWeight={600} color='black'>
                  Passenger {index + 1}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      First & Middle Name
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color='black'>
                      {passenger?.name?.firstName || passenger?.FirstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color='black'>
                      {passenger?.name?.lastName || passenger?.LastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color='black'>
                      {passenger?.gender || passenger?.Gender}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setModalVisible(false)}
            sx={{
              textTransform: "none",
              color: "#00194C",
              fontWeight: 600,
            }}
          >
            Edit
          </Button>

          {flightType === "Galileo" && (
            <Button
              onClick={() => handleConfirm(data, data1)}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#01186c",
                "&:hover": { backgroundColor: "#002a7f" },
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "4px",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
                  Loading...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          )}

          {flightType === "Amadeus" && (
            <Button
              onClick={() => Amaduespass(data)}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#00194C",
                "&:hover": { backgroundColor: "#002a7f" },
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "4px",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
                  Loading...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}


export default SeatModal;
