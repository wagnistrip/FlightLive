
import React, { useState } from 'react';
import { MdWifiCalling3 } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import "./contactus.scss"
import Footer from '../Footer';
import Offer from '../Offer';
import { getImageUrl } from '../../utils/airlineUtils';
import { galileoApi } from '../../Api/apiService';
import toast from 'react-hot-toast';

const ContactUs = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await galileoApi("Contactus", formData);
      if (response && response.status === 200) {
        toast.success(response.message || "Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error('Try Again')
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };
  return (

    <>
    
      <Offer title="Contact Us" />
      <div
        className="container-fluid p-0"
        style={{ height: '100%', overflow: 'auto' }}
      >
        <div
          className="content-wrapper pt-0 pt-lg-5" // Added a class for flex styling
          style={{
            height: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row', // Default to row for larger screens
          }}
        >
          {/* Background Image */}
          <img
            src={getImageUrl("ContactImage.jpg")}
            alt="Contact Us"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              position: 'absolute', // Keep the background fixed
              top: 0,
              left: 0,
              zIndex: -1, // Ensure it's in the background
            }}
          />
          {/* Black opacity overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              opacity: '0.6',
            }}
          ></div>
          {/* Text Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              color: 'white',
              textAlign: 'left',
              padding: '40px',
              maxWidth: '90%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '60px',
            }}
          >
            {/* Left Section */}
            <div style={{ flex: '1 1 40%', padding: '10px' }}>
              {/* <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: "30px" }}>CONTACT US</h1> */}

              <div className='d-block mb-5'>
                <div className='mb-3 d-flex gap-3' style={{ fontSize: "25px" }}>
                  <MdWifiCalling3 className=' mt-1 text-warning' size={32} />
                  Call Us:
                </div>
                <div>0 (806) 914 - 5571, 0 (1140) 453 - 111</div>
              </div>
              <div className='d-block mb-5'>
                <div className='mb-3 d-flex gap-3' style={{ fontSize: "25px" }}>
                  <FaLocationDot className=' mt-1 text-warning' size={32} />
                  Location:
                </div>
                <div>No. 5-B/13, Land Area Measuring 200 SQ. YDS, Tilak Nagar, Tilak
                  Nagar, West Delhi, West Delhi, Delhi, 110018</div>
              </div>

              <div className='d-block mb-5'>
                <div className='mb-3 d-flex gap-3' style={{ fontSize: "25px" }}>
                  <GoClockFill className=' mt-1 text-warning' size={32} />
                  Business Hours:
                </div>
                <div>Mon – Sun …… 10 am – 8 pm,</div>
              </div>
            </div>

            {/* Right Section (Form) */}
            <div style={{ flex: '1 1 50%', padding: '10px' }}>
              <form style={{ maxWidth: '500px', margin: '0 auto' }}>
                {/* Name and Email Section */}
                <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-center">
                  <div style={{ flex: '1', marginBottom: '10px' }}>
                    <label
                      htmlFor="name"
                      style={{
                        fontWeight: 'bold',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control input-placeholder-color"
                      placeholder="Enter name"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        borderBottom: '1px solid white',
                        fontSize: '1.2rem',
                        padding: '8px 10px',
                        borderRadius: '0',
                      }}
                      value={formData.name} onChange={handleChange}
                    />
                  </div>

                  <div style={{ flex: '1', marginBottom: '10px' }} className='email-section'>
                    <label
                      htmlFor="email"
                      style={{
                        fontWeight: 'bold',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control input-placeholder-color"
                      placeholder="Enter your email"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        borderBottom: '1px solid white',
                        fontSize: '1.2rem',
                        padding: '8px 10px',
                        borderRadius: '0',
                      }}
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Phone Section */}
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    style={{
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control input-placeholder-color"
                    placeholder="Enter your phone number"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      borderBottom: '1px solid white',
                      fontSize: '1.2rem',
                      padding: '8px 10px',
                      borderRadius: '0',
                    }}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Message Section */}
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    style={{
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    type="message"
                    className="form-control input-placeholder-color"
                    rows="4"
                    placeholder="Enter your message"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      borderBottom: '1px solid white',
                      fontSize: '1.2rem',
                      padding: '8px 10px',
                      borderRadius: '0',
                    }}

                    value={formData.message} onChange={handleChange}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="btn btn_theme btn_md w-100 rounded"

                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </>

  );
};

export default ContactUs;
