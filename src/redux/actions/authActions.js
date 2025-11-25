// import { clearSession, getSession, setSession } from "../../Api/authService";

// // Action Types
// export const LOGIN = 'LOGIN';
// export const LOGOUT = 'LOGOUT';

// // Action Creators
// export const login = (userData) => {
//   return (dispatch) => {
//     const expiryTimeInSeconds = 7 * 24 * 60 * 60; // 7 days
//     setSession(userData, expiryTimeInSeconds);
//     dispatch({ type: LOGIN, payload: userData });
//   };
// };

// export const logout = () => {
//   return (dispatch) => {
//     clearSession();
//     dispatch({ type: LOGOUT });
//   };
// };

// // Get session from cookies and dispatch login
// export const loadSession = () => {
//   return (dispatch) => {
//     const sessionUser = getSession();
//     if (sessionUser) {
//       dispatch({ type: LOGIN, payload: sessionUser });
//     }
//   };
// };

import { galileoApi } from "../../Api/apiService";
import { clearSession, getSession, setSession } from "../../Api/authService";
import { setCommonChips, setCommonWallet } from "./bookingActions";

// Action Types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_ROLE = "SET_ROLE";
export const SET_EXPIRY_TIME = "SET_EXPIRY_TIME";
// Login Action
// export const login = (userData) => {
//   return (dispatch) => {
//     const expiryTimeInSeconds = 7 * 24 * 60 * 60; // 7 days
//     setSession(userData, expiryTimeInSeconds); // Store userData including role

//     dispatch({ type: LOGIN, payload: userData });
//     dispatch({ type: SET_ROLE, payload: userData.role }); // Set role separately
//   };
// };

// Login Action
// Login Action

let inactivityTimer;
let removeListeners = () => {}; // Store cleanup function

// const INACTIVITY_TIMEOUT = 50 * 60 * 1000; // 50 minutes
const INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

const resetInactivityTimer = (dispatch) => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    dispatch(logout()); // Auto logout if inactive for 10 minutes
  }, INACTIVITY_TIMEOUT);
};
// Login Action
export const login = (userData) => {
  return (dispatch) => {
    const expiryTimestamp = Date.now() + INACTIVITY_TIMEOUT;
    const sessionData = { ...userData, expiryTime: expiryTimestamp };
    setSession(sessionData);

    dispatch({ type: LOGIN, payload: sessionData });
    dispatch({ type: SET_ROLE, payload: userData.role });
    dispatch({ type: SET_EXPIRY_TIME, payload: expiryTimestamp });

    resetInactivityTimer(dispatch);
    setupActivityListeners(dispatch);
  };
};
// // Logout Action
// export const logout = () => {
//   return (dispatch) => {
//     clearSession();
//     dispatch({ type: LOGOUT });
//     dispatch({ type: SET_ROLE, payload: null }); // Clear role on logout
//   };
// };

// Logout Action
export const logout = () => {
  return (dispatch) => {
    clearSession();
    removeListeners(); // Remove event listeners
    dispatch({ type: LOGOUT });
    dispatch({ type: SET_ROLE, payload: null });
    dispatch({ type: SET_EXPIRY_TIME, payload: null });

    window.location.href = "/login/agent-login"; // Redirect to login page
  };
};

// Set Role Action
export const setRole = (role) => {
  return (dispatch) => {
    dispatch({ type: SET_ROLE, payload: role });

    // Save role in session if it exists
    const sessionUser = getSession();
    if (sessionUser) {
      sessionUser.role = role;
      setSession(sessionUser);
    }
  };
};

// Load Session on App Start
// export const loadSession = () => {
//   return (dispatch) => {
//     const sessionUser = getSession();
//     if (sessionUser) {
//       dispatch({ type: LOGIN, payload: sessionUser });
//       dispatch({ type: SET_ROLE, payload: sessionUser.role || null }); // Ensure role is set
//     }
//   };
// };

// Auto Logout Timer
const startAutoLogoutTimer = (dispatch, expiryTimeInSeconds) => {
  setTimeout(() => {
    dispatch(logout());
  }, expiryTimeInSeconds * 1000);
};

// // Load Session
// export const loadSession = () => {
//   return (dispatch) => {
//     const sessionUser = getSession();
//     if (sessionUser) {
//       const currentTime = Date.now();

//       if (sessionUser.expiryTime && sessionUser.expiryTime > currentTime) {
//         dispatch({ type: LOGIN, payload: sessionUser });
//         dispatch({ type: SET_ROLE, payload: sessionUser.role });
//         dispatch({ type: SET_EXPIRY_TIME, payload: sessionUser.expiryTime });

//         const remainingTime = (sessionUser.expiryTime - currentTime) / 1000;
//         startAutoLogoutTimer(dispatch, remainingTime);
//       } else {
//         dispatch(logout()); // Expired session, auto logout
//       }
//     }
//   };
// };

// Load Session
export const loadSession = () => {
  return async (dispatch) => {
    const sessionUser = getSession();
    if (sessionUser) {
      dispatch({ type: LOGIN, payload: sessionUser });
      dispatch({ type: SET_ROLE, payload: sessionUser.role });
      dispatch({ type: SET_EXPIRY_TIME, payload: sessionUser.expiryTime });
      if (sessionUser && sessionUser?.users?.role === 2) {
        try {
          const response = await galileoApi(
            "agent/wallet-amount",
            {},
            sessionUser.token
          );
          if(response && response?.status === 200){
            dispatch(setCommonWallet(response?.total_balance || 0));
            dispatch(setCommonChips(response?.chips || 0));
          }
        } catch (err) {
          console.error("Failed to fetch wallet amount:", err);
        }
      }

      resetInactivityTimer(dispatch);
      setupActivityListeners(dispatch);
    }
  };
};

// Listen for User Activity and Reset Timer
const setupActivityListeners = (dispatch) => {
  const events = ["mousemove", "keydown", "click", "scroll"];

  const resetTimer = () => {
    resetInactivityTimer(dispatch);

    // Update session expiry time dynamically
    const sessionUser = getSession();
    if (sessionUser) {
      const newExpiryTimestamp = Date.now() + INACTIVITY_TIMEOUT;
      sessionUser.expiryTime = newExpiryTimestamp;
      setSession(sessionUser); // Update session storage
      dispatch({ type: SET_EXPIRY_TIME, payload: newExpiryTimestamp });
    }
  };

  events.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  // Function to remove event listeners
  removeListeners = () => {
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  };
};
