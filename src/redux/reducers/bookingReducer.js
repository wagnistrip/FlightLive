import toast from "react-hot-toast";
import {
  SET_BOOKING_STATUS,
  SET_BOOKING_DATA,
  SET_FARE_DETAILS,
  SET_MODAL_VISIBLE,
  SET_COMMON_PRICE,
  SET_GREEN_CHIPS_USED,
  SET_COMMON_WALLET,
  SET_COMMON_CHIPS,
  SET_SELECTED_BAGGAGE,
  REMOVE_SELECTED_BAGGAGE,
  CLEAR_SELECTED_BAGGAGE
} from "../actions/bookingActions";

const initialState = {
  bookingStatus: false,
  bookingData: null,
  faredetails: null,
  modalvisible: false,
  commonPrice: "0",
  walletAmount: 0,
  greenChipsPrice: 0,
  isGreenChipsUsed: false,
  // selectedBaggage: {
  //   key: null,
  //   baggage: null,
  //   quantity: 0,
  //   price: 0,
  //   weight: "",
  // },
  selectedBaggage: [],
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOKING_STATUS:
      return { ...state, bookingStatus: action.payload };

    case SET_BOOKING_DATA:
      return { ...state, bookingData: action.payload };

    case SET_FARE_DETAILS:
      return { ...state, faredetails: action.payload };

    case SET_MODAL_VISIBLE:
      return { ...state, modalvisible: action.payload };

    case SET_COMMON_PRICE:
      return { ...state, commonPrice: action.payload };

    case SET_COMMON_WALLET:
      return { ...state, walletAmount: action.payload };

    case SET_COMMON_CHIPS:
      return { ...state, greenChipsPrice: action.payload };

    case SET_GREEN_CHIPS_USED:
      return { ...state, isGreenChipsUsed: action.payload };

    // case SET_SELECTED_BAGGAGE: {
    //   const { key, baggage, price, weight, maxBaggageAllowed } = action.payload;
    //   const selected = state.selectedBaggage;
    //   const currentQty = selected.quantity || 0;

    //   if (currentQty > 0 && selected.key !== key) {
    //     toast.error("Remove existing baggage to add another type.");
    //     return state;
    //   }
    //   if (currentQty >= maxBaggageAllowed) {
    //     toast.error(`Only ${maxBaggageAllowed} baggage allowed.`);
    //     return state;
    //   }

    //   toast.success("Baggage added successfully");

    //   return {
    //     ...state,
    //     selectedBaggage: {
    //       key,
    //       baggage,
    //       price,
    //       weight,
    //       quantity: currentQty + 1,
    //     },
    //   };
    // }

    case SET_SELECTED_BAGGAGE: {
      const { key, baggage, price, weight, maxBaggageAllowed } = action.payload;

      const list = [...state.selectedBaggage];

      // total baggage count across all types
      const totalQty = list.reduce((sum, i) => sum + i.quantity, 0);

      if (totalQty >= maxBaggageAllowed) {
        toast.error(`Only ${maxBaggageAllowed} baggage allowed.`);
        return state;
      }

      const index = list.findIndex((item) => item.key === key);

      if (index !== -1) {
        // increment existing baggage type
        list[index] = {
          ...list[index],
          quantity: list[index].quantity + 1,
        };
      } else {
        // add new baggage type
        list.push({
          key,
          baggage,
          price,
          weight,
          quantity: 1,
        });
      }

      toast.success("Baggage added successfully");

      return {
        ...state,
        selectedBaggage: list,
      };
    }

    // case REMOVE_SELECTED_BAGGAGE: {
    //   const selected = state.selectedBaggage;
    //   const currentQty = selected.quantity || 0;

    //   if (currentQty === 0) return state;

    //   const newQty = currentQty - 1;

    //   toast.success("Baggage removed successfully");

    //   return {
    //     ...state,
    //     selectedBaggage:
    //       newQty === 0
    //         ? { key: null, baggage: null, quantity: 0, price: 0, weight: "" }
    //         : { ...selected, quantity: newQty },
    //   };
    // }
    case REMOVE_SELECTED_BAGGAGE: {
      const list = [...state.selectedBaggage];
      const index = list.findIndex((item) => item.key === action.payload);

      if (index === -1) return state;

      if (list[index].quantity > 1) {
        list[index] = {
          ...list[index],
          quantity: list[index].quantity - 1,
        };
      } else {
        list.splice(index, 1);
      }

      toast.success("Baggage removed successfully");

      return {
        ...state,
        selectedBaggage: list,
      };
    }

    case CLEAR_SELECTED_BAGGAGE:
  return {
    ...state,
    selectedBaggage: [],
  };


    default:
      return state;
  }
};

export default bookingReducer;
