import React, { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { logout, loadSession } from '../redux/actions/authActions';
import { FaUserAstronaut } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { getImageUrl } from '../utils/airlineUtils';
import { Box } from '@mui/material';
import AddFundModal from './agent/AddFundModal';


const Navbar = () => {
  const [activeBtn, setActiveBtn] = useState('Flights');
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const displayName = user?.users ? user.users.email || user.users.phone || '' : '';
  const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
  const walletAmout = useSelector((state) => state.booking.walletAmount);
  useEffect(() => {
    dispatch(loadSession()); // Load session on mount
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/user-login');
  };

  const handleSetRole = (role) => {
    // Determine the correct path based on role
    let path = role === 1 ? "/login/user-login" : role === 2 ? "/agents" : "/";

    navigate(path, { state: { role } });
  };
  const location = useLocation();

  // check if the current route starts with /flightdetails
  const isFlightDetails = location.pathname.startsWith('/flightdetails');

  const logoStyle = {
    width: '183px',
    height: '81px',
    marginTop: '8px',
    ...(isFlightDetails && {
   
      marginTop: '18px',
    }),
  };
// style={{ width: '183px' ,height:"81px",marginTop:"8px"}}
  return (
    <>
      <header className="main_header_arae">
        <div className="topbar-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6">
                <ul className="topbar-list">
                  <li>
                    <Link to="https://www.facebook.com/tripwagnis/">
                      <i className="fab fa-facebook" />
                    </Link>
                    <Link to="https://twitter.com/wagnistrip/">
                      <i className="fab fa-twitter-square" />
                    </Link>
                    <Link to="https://www.instagram.com/wagnistrip/">
                      <i className="fab fa-instagram" />
                    </Link>
                    <Link to="https://www.linkedin.com/company/88455961/">
                      <i className="fab fa-linkedin" />
                    </Link>
                  </li>
                  {
                    !user && 
                  <li>
                    <Link to="tel:+918069145571">
                      <span>+91 965 451 9719</span>
                    </Link>
                  </li>
                  }
                  <li>
                    <Link to="mailto:customercare@wagnistrip.com">
                      <span>customercare@wagnistrip.com</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-lg-6 col-md-6">
                <ul className="topbar-others-options">


                  {user && user.users ? (
                    user && user?.users && user?.users?.role === 1 ? (

                      <li className='d-block d-lg-none'>
                        <Link to='/customer-profile'> <div style={{ cursor: 'pointer' }} className="nav-link nav-item gap-2 text-white" to="/">
                          <FaUserCircle className='mx-1' size={24} />
                          <span>  H! {displayName}</span>
                        </div></Link>
                      </li>
                    ) : <ul className="topbar-list"><li> <Link to="tel:+919654519719">
                      <span className='text-danger fw-bold'>Customer support 24*7 - <span className='text-black'>+91965 451 9719</span></span>
                    </Link></li></ul>) : ((
                      <>
                        {/* <li>
                        <Link onClick={() => handleSetRole(1)} to="/user-login">Login</Link>
                      </li>
                      <li>
                        <Link onClick={() => handleSetRole(1)} to='/user-login'>Sign up</Link>
                      </li> */}
                        <li className="nav-item dropdown">
                          <div
                            className="nav-link dropdown-toggle"
                            id="loginDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: 'pointer', color: 'white' }}
                          >
                            Login / Sign up
                          </div>
                          <ul className="dropdown-menu custom-dropdown" aria-labelledby="loginDropdown">
                            <li className='w-100'>
                              <div onClick={() => handleSetRole(1)} className=" custom-hover">
                                <AiOutlineUser size={18} /> User Login
                              </div>
                            </li>
                            <li className='w-100'>
                              <div onClick={() => handleSetRole(2)} className=" custom-hover">
                                <FaUserAstronaut size={18} /> Agent Login
                              </div>
                            </li>

                          </ul>
                        </li>
                      </>
                    ))
                  }



                </ul>

              </div>
            </div>
          </div>
        </div>

        <div className={`navbar-area ${isSticky ? 'is-sticky' : ''}`}>
          {/* <div className={`navbar-area`}> */}
          <div className="main-responsive-nav">
            <div className="container">
              <div className="main-responsive-menu">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="logo">
                      <Link to="/" >
                        <img style={{ width: '100px' }} src={getImageUrl("logo.png")} alt="logo" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-navbar">
            <div className="container">
              <nav className="navbar navbar-expand-md navbar-light"style={{ marginLeft:"80px" }}>
                <Link onClick={() => setActiveBtn('Flights')} to="/" >
                  <img src={getImageUrl("logo.png")} style={logoStyle} alt="logo" />
                </Link>
                <div
                  className="collapse navbar-collapse mean-menu"
                  id="navbarSupportedContent"
                >
                  {/* <ul className="navbar-nav " style={{ visibility: 'hidden' }}> */}
                  <ul className="navbar-nav" style={{ visibility: isSticky ? 'visible' : 'hidden' }}>
                    <li className="nav-item">
                      <Link onClick={() => setActiveBtn('Flights')} className={`nav-link  ${activeBtn === 'Flights' ? 'active' : ''}`} to="/">
                        Flights
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link onClick={() => setActiveBtn('package')} className={`nav-link  ${activeBtn === 'Hotels' ? 'active' : ''}`} to="https://package.wagnistrip.com/package-list">
                        Holidays
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link`} to="https://event.wagnistrip.com/">
                        Events
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link onClick={() => setActiveBtn('Blogs')} className={`nav-link  ${activeBtn === 'Blogs' ? 'active' : ''}`} to="/blogs">
                        Blogs
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      <Link className={`nav-link`} to="https://visa.wagnistrip.com/">
                        Visa
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link onClick={() => setActiveBtn('Cabs')} className={`nav-link  ${activeBtn === 'Cabs' ? 'active' : ''}`} to="https://cab.wagnistrip.com/">
                        Cabs
                      </Link>
                    </li>
                    {
                      user && user?.users?.role === 2 && (
                        <li className="nav-item">
                          <Link onClick={() => setActiveBtn('Specialflights')} className={`nav-link  ${activeBtn === 'Specialflights' ? 'active' : ''}`} to="/specialflight">
                            Special flights
                          </Link>
                        </li>
                      )
                    }

                    <li className="nav-item">
                      <Link onClick={() => setActiveBtn('Contact')} className={`nav-link  ${activeBtn === 'Contact' ? 'active' : ''}`} to="/contact-us">
                        Contact
                      </Link>
                    </li>

                  </ul>
                  <div className="others-options d-flex gap-2 align-items-center">


                    {user && user.users ? (
                      user && user?.users && user?.users?.role === 1 ? (

                        <ul className="navbar-nav d-none d-lg-flex">
                          <li className="nav-item">

                            <div style={{ cursor: 'pointer', color: isSticky ? 'black' : 'white' }} className="nav-link border border-dark-subtle d-flex rounded-lg align-items-center justify-content-center nav-item gap-2">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center text-white`} style={{ width: '30px', height: '30px', fontSize: '18px', background: 'var(--main-color)' }}>
                                {displayName ? displayName.charAt(0).toUpperCase() : ''}
                              </div>
                              <span className="">
                                {displayName && `Hii ${displayName.split('@')[0]}...`}
                              </span>
                            </div>

                            <ul className="dropdown-menu">
                              <li className="nav-item">
                                <Link to='/customer-profile' className="nav-link">
                                  My Profile
                                </Link>
                              </li>
                              <li to='/customer-profile' className="nav-item">
                                <Link className="nav-link" to="/customer-profile">
                                  My Booking
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link onClick={handleLogout} className="nav-link" to="/news-details">
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      ) : user && user?.users && user?.users?.role === 2 ? (


                        <ul className="navbar-nav d-none d-lg-flex">
                          <li className="nav-item">

                            <div style={{ cursor: 'pointer', color: isSticky ? 'black' : 'white' }} className="nav-link border border-dark-subtle d-flex rounded-lg align-items-center justify-content-center nav-item gap-2">
                              <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '30px', height: '30px', fontSize: '18px', background: 'var(--main-color)' }}>
                                {displayName ? displayName.charAt(0).toUpperCase() : ''}
                              </div>
                              <span className="">
                                {displayName && `Hii ${displayName.split('@')[0]}...`}
                              </span>
                              <div><IoMdArrowDropdown size={20} /></div>
                            </div>

                            <ul className="dropdown-menu">
                              <li className="nav-item">
                                <Link to='/agent/profile' className="nav-link">
                                  My Profile
                                </Link>
                              </li>
                              <li to='/agent/profile' className="nav-item">
                                <Link className="nav-link" to="/agent/profile">
                                  My Booking
                                </Link>
                              </li>
                              <li to='/agent/profile' className="nav-item">
                                <Link className="nav-link d-flex w-100 align-items-center justify-content-between" to="/agent/profile">
                                  <div>My Wallet</div>
                                  <strong>
                                    ₹ {walletAmout || 0}
                                  </strong>
                                </Link>

                              </li>
                              <li to='/agent/profile' className="nav-item">
                                <Link className="nav-link d-flex w-100 align-items-center justify-content-between" to="/agent/profile">
                                  <div>Target Price</div>
                                  <strong>
                                    ₹ {greenChipsPrice}
                                  </strong>
                                </Link>

                              </li>
                             
                              <li className="nav-item">
                                <Link onClick={handleLogout} className="nav-link" to="#">
                                  Logout
                                </Link>
                              </li>
                               <li> <Box>
                                <button
                                  onClick={() => setOpen(true)}
                                  style={{
                                    backgroundColor: '#1565c0',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    transition: '0.3s',
                                  }}

                                >
                                  + Add Fund
                                </button>
                              </Box></li>
                            </ul>
                          </li>
                        </ul>


                      ) : null) : <div className="option-item">
                      <Link className="btn  btn_navber" to="/agents">
                        Become Expert
                      </Link>
                    </div>
                    }

                    {/* <div className="option-item">
                    <Link className="btn  btn_navber" to="/become-expert">
                      Become Expert
                    </Link>
                  </div> */}
                  </div>
                </div>
              </nav>
            </div>
          </div>
          <div className="others-option-for-responsive">
            <div className="container">
              <div className="dot-menu">
                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  Menu
                </button>
                <div
                  className="offcanvas offcanvas-end"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header-two">
                    <div className="offcanvas-logo">
                      <img style={{ width: '100px' }} src={getImageUrl("logo.png")} alt="logo" />
                    </div>
                    <div className="offcanvas_off">
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                  </div>


                  <div className="offcanvas-body ">


                    {/* customer profile logic here */}
                    <div style={{ fontSize: '13px' }} className='mb-3 bg-light p-2 text-danger' data-bs-dismiss="offcanvas">
                      {user && user.users ? (
                        user && user?.users && user?.users?.role === 1 ? (
                          <Link to='/customer-profile'

                            className=''><FaUserCircle className='mx-1' size={16} />Hiii { } {displayName && displayName}</Link>

                        ) : null) : ((
                          <>
                            <Link to='/login/user-login'>User (Login/Signup)</Link>
                          </>
                        ))
                      }

                    </div>

                    {/* agent profile logic here  */}
                    <div style={{ fontSize: '13px' }} className='mb-3 bg-light p-2 text-danger' data-bs-dismiss="offcanvas">
                      {user && user.users ? (
                        user && user?.users && user?.users?.role === 2 ? (
                          <Link to='/agent/profile'

                            className=''><FaUserCircle className='mx-1' size={16} />Hiii { } {displayName && displayName}</Link>

                        ) : null) : ((
                          <>
                            <Link to='/agents'>Agent</Link>
                          </>
                        ))
                      }

                    </div>


                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                      <div className="container-fluid">
                        <div>
                          <ul className="navbar-nav">
                            <li className="nav-item">
                              <Link className="nav-link active" to="/" data-bs-dismiss="offcanvas">
                                Home
                              </Link>
                            </li>
                            <li className="nav-item" data-bs-dismiss="offcanvas">
                              <Link className="nav-link active" to="/">
                                Flights
                              </Link>
                            </li>
                            <li className="nav-item" data-bs-dismiss="offcanvas">
                              <Link className="nav-link active" to="/hotels">
                                Hotels
                              </Link>

                            </li>
                            <li className="nav-item">
                              <Link className="nav-link active" to="https://event.wagnistrip.com/">
                                Events
                              </Link>

                            </li>
                            <li className="nav-item" data-bs-dismiss="offcanvas">
                              <Link className="nav-link active" to="/contact-us">
                                Contact
                              </Link>
                            </li>
                            {/* <li className="nav-item" data-bs-dismiss="offcanvas">
                              <Link className="nav-link active" to="https://demo.wagnistrip.com/">
                                Visa
                              </Link>
                            </li> */}
                            {user?.users ? (
                              user.users.role === 2 ? (
                                <li className="nav-item" data-bs-dismiss="offcanvas">
                                  <Link className="nav-link active" to="/specialflight">
                                    Special flight
                                  </Link>
                                </li>
                              ) : null
                            ) : null}



                          </ul>

                        </div>
                      </div>
                    </nav>


                  </div>


                  <div className="offcanvas-header-two">
                    <ul style={{ fontSize: '12px' }} className='d-flex text-center gap-2'>
                      <li data-bs-dismiss="offcanvas"> <Link to="/user-agreement"> User Agreement</Link></li>
                      <li data-bs-dismiss="offcanvas"> <Link to="/terms-and-conditions"> Term's Condition</Link></li>
                      <li data-bs-dismiss="offcanvas"> <Link to="/privacy-policy"> Privacy Policy</Link></li>
                    </ul>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </header>

      <AddFundModal open={open} onClose={() => setOpen(false)}/>

    </>


  );
}


export default Navbar;