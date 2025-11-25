
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Navbar from "./component/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";

// Import Components
import FlightDetail from "./component/FlightDetail";
import Layout from "./pages/Layout";
import FlightReview from "./component/FlightReview";
import About from "./component/FooterDetails/About";
import Career from "./component/FooterDetails/Career";
// import TourDetails from './component/tourDetails';
import CancelBooking from "./CancelBooking";
import WebCheckIn from "./component/webCheckIn/WebCheckIn";
import LocationRequest from "./LocationRequest";
import ContactUs from "./component/FooterDetails/ContactUs";
import Userlogin from "./component/LoginPage/Userlogin";
import PrivacyPolicy from "./component/termandcondition/PrivacyPolicy";
import TermsCondition from "./component/termandcondition/TermsCondition";
import UserAgreement from "./component/termandcondition/UserAgreement";
import ProfileData from "./component/customer/ProfileData";
import NotFound from "./component/NotFound";
import Testimonial from "./component/FooterDetails/Testimonial";
import PaymentFailed from "./paymentFailed";
import CouponSection from "./component/CouponSection";
import Maintancepage from "./component/Maintancepage";
import Test from "./Test";
import { loadSession } from "./redux/actions/authActions";
import Dashboard from "./component/agent/Dashboard";
import { navbarRoutes } from "./utils/airlineUtils";
import AgentData from './component/agent/AgentPage';
import AgentLogin from "./component/agent/Agentkyc";
import Blogpage from "./component/Blogpage";
import SpecialFlight from "./component/specialflight/SpecialFlight";
import SpecialFlightCard from "./component/specialflight/SpecialFlightCard";
import SpecialFlightDetails from "./component/specialflight/SpecialFlightDetails";
import SpecialTicket from "./component/specialflight/SpecialTicket";
import PaymentError from "./component/specialflight/PaymentError";
import WheelSpinner from "./component/WheelSpinner";
import Domesticroutes from "./component/Domesticroutes";
import Internationalroutes from "./component/Internationalroutes";
import { HelmetProvider } from "react-helmet-async";
import Seo from "./seo/Seo";
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const PublicRoute = ({ element }) => {
  // const user = useSelector((state) => state.auth.user);
  // return user ? <Navigate to="/" replace /> : element;
  return element;
};

const PrivateRoute = ({ element, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  // console.log("userdata =>",user);

  if (!user) {
    return <Navigate to="/login/user-login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.users?.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};


function ConditionalNavbar() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const showNavbar =
    // user &&
    navbarRoutes.some((route) => {
      const regex = new RegExp(`^${route.replace(/:\w+/g, ".*")}$`);
      return regex.test(location.pathname);
    });


  return showNavbar ? <Navbar /> : null;
}


function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const images = document.images;
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      setTimeout(() => setLoading(false), 2000); // If no images, hide loader after 1 sec
    } else {
      Array.from(images).forEach((img) => {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            setTimeout(() => setLoading(false), 2000);
          }
        };
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [location]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession()); // Load session on app start
  }, [dispatch]);

  return (
    <>
     <HelmetProvider>
    
     {loading && <LoadingScreen />}
     {/* <LoadingScreen/> */}
  
      <ScrollToTop />
      <ConditionalNavbar />
      <LocationRequest />
      <Seo/>
      <Routes>
        {/* Public Routes (Accessible without login) */}
        <Route path="/login/user-login" element={<PublicRoute element={<Userlogin />} />} />
        <Route path="/login/agent-login" element={<PublicRoute element={<Userlogin />} />} />
        
        {/* Private Routes (Require Login) */}
        <Route path="/agent/profile" element={<PrivateRoute element={<Dashboard />} allowedRoles={[2]} />} />
        <Route path="/agent/registration" element={<PrivateRoute element={<AgentLogin />} allowedRoles={[2]} />} />
        <Route path="/customer-profile" element={<PrivateRoute element={<ProfileData />} allowedRoles={[1]} />} />

        <Route path="/" element={<PublicRoute element={<Layout />} />} />
        <Route path="/contact-us" element={<PublicRoute element={<ContactUs />} />} />
        <Route path="/agents" element={<PublicRoute element={<AgentData />} />} />
        <Route path="/testimonial" element={<PublicRoute element={<Testimonial />} />} />
        <Route path="/web-check-in" element={<PublicRoute element={<WebCheckIn />} />} />
        <Route path="/privacy-policy" element={<PublicRoute element={<PrivacyPolicy />} />} />
        <Route path="/terms-and-conditions" element={<PublicRoute element={<TermsCondition />} />} />
        <Route path="/user-agreement" element={<PublicRoute element={<UserAgreement />} />} />
        <Route path="/about-pages" element={<PublicRoute element={<About />} />} />
        <Route path="/careerspages" element={<PublicRoute element={<Career />} />} />
        <Route path="/offers/terms-and-conditionss" element={<PublicRoute element={<CouponSection />} />} />
        <Route path="/flightreview" element={<PublicRoute element={<FlightReview />} />} />
        {/* <Route path="/tour-details/:title" element={<PublicRoute element={<TourDetails />} />} /> */}
        <Route path="/flightdetails/*" element={<PublicRoute element={<FlightDetail />} />} />
        <Route path="/api/payment/success/" element={<PublicRoute element={<CancelBooking />} />} />
        <Route path="/api/payment/failed" element={<PublicRoute element={<PaymentFailed />} />} />
        <Route path="/flights/*" element={<PublicRoute element={<Test />} />} />
        <Route path="/hotels" element={<PublicRoute element={<Maintancepage />} />} />
        <Route path="/blogs" element={<PublicRoute element={<Blogpage />} />} />
        <Route path="/holidays" element={<PublicRoute element={<Maintancepage />} />} />
        <Route path="/domestic-flights" element={<PublicRoute element={<Domesticroutes />} />} />
        <Route path="/international-flights" element={<PublicRoute element={<Internationalroutes />} />} />
        <Route path="/SpecialFlight" element={<PrivateRoute element={<SpecialFlight/>} allowedRoles={[2]} />} />
        <Route path="/SpecialFlightCard" element={<PublicRoute element={<SpecialFlightCard/>} />} />
        <Route path="/SpecialFlightDetails" element={<PublicRoute element={ <SpecialFlightDetails/>} />} />
        <Route path="/SpecialTicket-booking" element={<PublicRoute element={ <SpecialTicket/>} />} />
        <Route path="/play-game" element={<PrivateRoute element={ <WheelSpinner/>}  allowedRoles={[2]}/>} />
        <Route path="/payment-error" element={<PublicRoute element={ <PaymentError/>} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </HelmetProvider>
    </>

  );
}

export default App;


const LoadingScreen = () => {
  return (
    <div className="loading-container">
    {[...Array(3)].map((_, i) => (
      <span key={i} className="dot" style={{ animationDelay: `${i * 0.1}s` }}></span>
    ))}
  </div>
  );
}

