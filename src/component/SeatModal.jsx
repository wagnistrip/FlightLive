import React, {useState } from 'react'
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
import {createRequestBody, formatPricingData, getRowsGroupedByOrigin } from '../utils/airlineUtils';

function SeatModal({ data, goToStep, modalVisible, setModalVisible, data1, flightType, setSeatMaps, setSeatMap, seatMaps, seatMap, setOptionalService, optionservice, setSeatMaps1, setSeatMap1, seatMap1 }) {
  const [loading, setLoading] = useState(false);

  const fetchofferAvalibilty = async (flightSegmentData) => {
    const trip = flightSegmentData?.trip;
    const type = flightSegmentData?.otherInformation;
    const carrier = flightSegmentData?.segmentData?.[0]?.["@attributes"]?.Carrier;

    // ONLY allow: I + oneway + NOT 6E
    if (!(trip === 'I' && type === 'oneway' && carrier !== '6E')) {
      return null;
    }
    const requestData = {
      "PassengerDetails": flightSegmentData?.CustomerInfo.PassengerDetails,
      "airSegment": flightSegmentData?.segmentData,
      "travellerquantity": flightSegmentData?.travellerquantity
    };

    try {
      // console.log("body request for offeravailbilty", requestData)
      const responseData = await galileoApi("/Galileo/OfferAvailabilty", requestData);
      console.log("return offeravaility dat => ", responseData);
      // return;

      if (responseData.status === 200) {
        setOptionalService(responseData?.passanger?.Body?.AirMerchandisingOfferAvailabilityRsp?.OptionalServices?.OptionalService || [])
        return responseData;
      }
      setOptionalService([]);
      return null;
    } catch (error) {
      console.error("Seat map fetch error:", error);
      setOptionalService([]);
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

  const fetchAllSeatMaps = async (parsedDatachange, tripType) => {
    if (parsedDatachange && parsedDatachange?.segmentdata && parsedDatachange?.returnSegmentData) {
      //this is international rooundtrip logic
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
      console.log("step -1 ")
      const apiEndPoint = CarrierCode === '6E' ? "/GalileoInd/seat-map" : "/Galileo/pre-seat-Map"
      if (parsedDatachange && seatMap === null && seatMap1 === null) {
        // if(CarrierCode === '6E'){
        //   return
        // }

        console.log("step -2 ")

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
      // this is oneway and and domestic roundtrip
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
          apiTasks.push(fetchAllSeatMaps(onwardReqData, "onward"));
          // apiTasks.push(fetchofferAvalibilty(requestData));
        }

        // Handle return flight seat maps
        if (returnResponse?.status === 200) {
          const returnReqData = {
            segmentdata: returnResponse?.passenger?.segmentData,
            Hosttoken: returnRequestData.common_v52_0HostToken,
            segmentkey: returnPricingData?.dataAdt?.airBookingInfo,
          };
          apiTasks.push(fetchAllSeatMaps(returnReqData, "return"));
          // apiTasks.push(fetchofferAvalibilty(returnRequestData));
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

  const Amaduespass = async (data) => {
    // remove amadues code
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
