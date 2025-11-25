export const SET_BOOKING_STATUS = "SET_BOOKING_STATUS";
export const SET_BOOKING_DATA = "SET_BOOKING_DATA";
export const SET_FARE_DETAILS = "SET_FARE_DETAILS";
export const SET_AIRLINES = "SET_AIRLINES";
export const SET_MODAL_VISIBLE = "SET_MODAL_VISIBLE";
export const SET_COMMON_PRICE = "SET_COMMON_PRICE";
export const SET_COMMON_WALLET = "SET_COMMON_WALLET";
export const SET_GREEN_CHIPS_USED = "SET_GREEN_CHIPS_USED";
export const SET_COMMON_CHIPS = "SET_COMMON_CHIPS"
// Set Booking Status
export const setBookingStatus = (status) => ({
  type: SET_BOOKING_STATUS,
  payload: status,
});

// Set Booking Data
export const setBookingData = (data) => ({
  type: SET_BOOKING_DATA,
  payload: data,
});

// Set Fare Details
export const setFareDetails = (details) => ({
  type: SET_FARE_DETAILS,
  payload: details,
});

// Set Airlines
export const setAirlines = (airlines) => ({
  type: SET_AIRLINES,
  payload: airlines,
});

// Set Modal Visibility
export const setModalvisible = (visible) => ({
  type: SET_MODAL_VISIBLE,
  payload: visible,
});

//Add commonPrice
export const setCommonPrice = (price) => ({
  type: SET_COMMON_PRICE,
  payload: price,
});
//Add commonPrice
export const setCommonWallet = (price) => ({
  type: SET_COMMON_WALLET,
  payload: price,
});
export const setCommonChips = (price) => ({
  type: SET_COMMON_CHIPS,
  payload: price,
});

export const setGreenChipsUsed = (status) => ({
  type: SET_GREEN_CHIPS_USED,
  payload: status,
});