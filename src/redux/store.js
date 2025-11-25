


import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from 'redux-thunk';  // Use named import instead of default
import authReducer from "./reducers/authReducer";
import bookingReducer from "./reducers/bookingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
