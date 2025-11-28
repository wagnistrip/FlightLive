
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

import hotelicon from '../image/hotelicon.png';
import flighticon from '../image/flighticon.png';
import contacticon from '../image/contacticon.png';
import visaicon from '../image/visaicon.png';
import eventicon from '../image/eventicon.png';
import blogicon from '../image/blogicon.png';
import splicon from '../image/splicon.png';

const TopNavbar = () => {
    const [activeBtn, setActiveBtn] = useState('Flights');
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);



    useEffect(() => {
        const path = location.pathname.toLowerCase();

        if (path === '/' || (path.includes('flight') && !path.includes('specialflight'))) {
            setActiveBtn('Flights');
        } else if (path.includes('specialflight')) {
            setActiveBtn('specialflight');
        } else if (path.startsWith('/hotels')) {
            setActiveBtn('Hotels');
        } else if (path.startsWith('/contact-us')) {
            setActiveBtn('Contact');
        } else if (path.startsWith('/blogs')) {
            setActiveBtn('blogs');
        } else {
            setActiveBtn('');
        }
    }, [location]);


    // inline style for blinking
    const blinkStyle = {
        animation: 'blinkAnim 1s infinite'
    };

    return (
        <div>
            {/* Inline <style> for animation */}
            <style>{`
        @keyframes blinkAnim {
          50% { opacity: 0.3; }
        }
      `}</style>

            <div className="d-flex justify-content-between align-items-center text-center">
                {/* Flight */}
                <Link to="/" className="d-flex flex-column align-items-center">
                    <img
                        src={flighticon}
                        alt="Flight"
                        style={{
                            height: '32px',
                            ...(activeBtn === 'Flights' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'Flights' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'Flights' ? '700' : '400',
                        }}
                    >
                        Flight
                    </p>
                </Link>

                {/* Special Flight */}
                {user?.users?.role === 2 && (
                    <Link to="/specialflight" className="d-flex flex-column align-items-center">
                        <img
                            src={splicon}
                            alt="Special Flight"
                            style={{
                                height: '32px',
                                ...(activeBtn === 'specialflight' ? blinkStyle : {})
                            }}
                        />
                        <p
                            style={{
                                color: activeBtn === 'specialflight' ? 'var(--main-color)' : '#4a4a4a',
                                fontSize: '14px',
                                fontWeight: activeBtn === 'specialflight' ? '700' : '400',
                            }}
                        >
                            Special Flight Deal
                        </p>
                    </Link>
                )}

                {/* Event */}
                <Link to="https://event.wagnistrip.com/" className="d-flex flex-column align-items-center">
                    <img
                        src={eventicon}
                        alt="Event"
                        style={{
                            height: '32px',
                            ...(activeBtn === 'Events' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'Events' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'Events' ? '700' : '400',
                        }}
                    >
                        Event
                    </p>
                </Link>
                {/* Cabs */}
                <Link to="https://cab.wagnistrip.com/" className="d-flex flex-column align-items-center">
                    <LocalTaxiIcon
                        sx={{
                            fontSize: 32,
                            color: activeBtn === 'Cabs' ? 'var(--main-color)' : '#4a4a4a',
                            ...(activeBtn === 'Cabs' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'Cabs' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'Cabs' ? '700' : '400',
                        }}
                    >
                        Cabs
                    </p>
                </Link>
                {/* Blogs */}
                <Link to="/blogs" className="d-flex flex-column align-items-center">
                    <img
                        src={blogicon}
                        alt="Blog"
                        style={{
                            height: '32px',
                            ...(activeBtn === 'blogs' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'blogs' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'blogs' ? '700' : '400',
                        }}
                    >
                        Blog
                    </p>
                </Link>



                {/* Visa */}
                <Link to="https://visa.wagnistrip.com/" className="d-flex flex-column align-items-center">
                    <img
                        src={visaicon}
                        alt="Visa"
                        style={{
                            height: '32px',
                            ...(activeBtn === 'Visa' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'Visa' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'Visa' ? '700' : '400',
                        }}
                    >
                        Visa
                    </p>
                </Link>
                {/* Contact */}
                <Link to="/contact-us" className="d-flex flex-column align-items-center">
                    <img
                        src={contacticon}
                        alt="Contact"
                        style={{
                            height: '32px',
                            ...(activeBtn === 'Contact' ? blinkStyle : {})
                        }}
                    />
                    <p
                        style={{
                            color: activeBtn === 'Contact' ? 'var(--main-color)' : '#4a4a4a',
                            fontSize: '14px',
                            fontWeight: activeBtn === 'Contact' ? '700' : '400',
                        }}
                    >
                        Contact
                    </p>
                </Link>

            </div>
        </div>
    );
};

export default TopNavbar;
