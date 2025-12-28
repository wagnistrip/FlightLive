import {
  SET_BOOKING_STATUS,
  SET_BOOKING_DATA,
  SET_FARE_DETAILS,
  // SET_AIRLINES,
  SET_MODAL_VISIBLE,
  SET_COMMON_PRICE,
  SET_GREEN_CHIPS_USED,
  SET_COMMON_WALLET,
  SET_COMMON_CHIPS,
  SET_SELECTED_BAGGAGE,
  REMOVE_SELECTED_BAGGAGE,
} from "../actions/bookingActions";

const initialState = {
  bookingStatus: false,
  bookingData: null,
  faredetails: null,
  // airlines: [],
  modalvisible: false,
  commonPrice: "0",
  walletAmount: 0,
  greenChipsPrice: 0,
  isGreenChipsUsed: false,
  selectedBaggage: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOKING_STATUS:
      return { ...state, bookingStatus: action.payload };

    case SET_BOOKING_DATA:
      return { ...state, bookingData: action.payload };

    case SET_FARE_DETAILS:
      return { ...state, faredetails: action.payload };

    // case SET_AIRLINES:
    //   return { ...state, airlines: action.payload };

    case SET_MODAL_VISIBLE:
      return { ...state, modalvisible: action.payload };

    case SET_COMMON_PRICE: // Handle commonPrice
      return { ...state, commonPrice: action.payload };

    case SET_COMMON_WALLET: // Handle walletAmount
      return { ...state, walletAmount: action.payload };

    case SET_COMMON_CHIPS: // Handle walletAmount
      return { ...state, greenChipsPrice: action.payload };

    case SET_GREEN_CHIPS_USED:
      return { ...state, isGreenChipsUsed: action.payload };

    case SET_SELECTED_BAGGAGE:
      return { ...state,selectedBaggage: action.payload, };

    case REMOVE_SELECTED_BAGGAGE:
      return { ...state,selectedBaggage: null,};

    default:
      return state;
  }
};

export default bookingReducer;
