// import { LOGIN, LOGOUT } from '../actions/authActions';

// const initialState = {
//   user: null,
//   role: null,
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN:
//       return { ...state, user: action.payload, role: action.payload.role || null };
//     case LOGOUT:
//       return { ...state, user: null, role: null };
//     default:
//       return state;
//   }
// };

// export default authReducer;



import { LOGIN, LOGOUT, SET_EXPIRY_TIME, SET_ROLE } from "../actions/authActions";
import { getSession } from "../../Api/authService";

const initialState = {
  user: getSession() || null,
  role: getSession()?.role || null, // Retrieve role from session
  expiryTime: null, // NEW: Store expiry time
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload, role: action.payload.role };

    case LOGOUT:
      return { ...state, user: null, role: null };

    // case SET_ROLE:
    //   return { ...state, role: action.payload };
      case SET_EXPIRY_TIME:
      return { ...state, expiryTime: action.payload };

    default:
      return state;
  }
};

export default authReducer;
