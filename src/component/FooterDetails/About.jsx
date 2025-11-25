
import React, { useEffect } from 'react';
// import './About.scss';
import Offer from '../Offer';
import Footer from '../Footer';
import { getImageUrl } from '../../utils/airlineUtils';
;
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  return (
    <div>
      
      <Offer title="About us" />

      <div className='pt-5'>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='text-center'>
                {/* ABOUT US */}
                <h3 className='my-3'>World Best Travel Agency Company For You!</h3>
              </div>
              <div className=''>
                <p className=''>
                  Wagnistrip Private Limited is a travel agency that provides all types of travel services all around the world. we are a recognized company by the Ministry of Tourism with an iata certification and iata Number <strong style={{ color: 'var(--main-color)' }}> 14385420</strong>. Our main goal is to provide the best travel services to travelers who can chase their dreams and explore the entire world. we have a GST certificate <strong style={{ color: 'var(--main-color)' }}> (07AAOCM4506GIZF)</strong> and a CIN Number that the government of india issues. if you ever make any flight booking from our side then we guarantee the cheapest flight ticket range you will ever find as compared to any other websites. we are working on you to provide you with the best facilities and the most convenient way to book any travel service. we also working on updating our recent facilities so that you won't face any difficulty and will get the best experience with us.

                </p>
                <p className='text-justify'>
                  We are very happy to announce that wagnistrip opc pvt. Ltd has been registered in the United States of America and also verified by the secretary of state. We finally got the certificate of formation of the wagnistrip company on 30 August 2023. We do not charge any type of convenience fee for our services and belief in a customer-centric approach.

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container p-3">
        <div className="card">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={getImageUrl("hotels.jpg")} className="img-fluid rounded-start" alt="Hotel Image" />
            </div>
            <div className="col-md-8">
              <h5 className="p-1" style={{ color: "var(--main-color)", fontSize: "2rem", fontWeight: "bold" }}>Our Products & Services</h5>
              <div className="card-body">
                <h5 className="">Hotel Booking</h5>
                <p className="card-text text-justify">
                  We make sure to provide every traveler with the best facilities in terms of the best accommodation according to their given requirements. we provide you with the most affordable hotels to the most luxurious ones with enormous discount offers For your reference you can compare the various hotels, prices, descriptions, and multiple reviews. On the other hand for your help, our customer team is available for you 24/7 to solve all your queries and help you with any special booking, etc.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-0 mt-3">
            <div className="col-md-4">
              <img src={getImageUrl("airplanImgae.jpg")} className="img-fluid rounded-start" alt="Flight Image" />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="">Flight Booking</h5>
                <p className="card-text text-justify">
                  You can compare our flight prices anywhere with any website and you will not find any of the prices that we offer as we offer the cheapest flight price rate. Our platform is user-friendly, anyone can use the website and book any travel survive with it. we have a variety of flight price rates which go from the normal ones to the premium and luxurious ones. From this, you can easily compare the ranges and choose the ones that fit your budget. we always make sure to give the best service to our customers. there are multiple discounts which are available for you that you can use and get discounted flights. we will give you the best prices that you don't have to think about before booking from our website and you will come back to our website again as you will get the finest experience.

                </p>
              </div>
            </div>
          </div>
          <div className="row g-0 mt-3">
            <div className="col-md-4">
              <img src={getImageUrl("holidayevent.jpg")} className="img-fluid rounded-start" alt="Holiday Event Image" />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="">Holiday Events</h5>
                <p className="card-text text-justify">
                  Our holiday packages and events were designed especially for the convenience of the customers. they can be personalized and the most famous ones also as per your requirement. we offer a variety of holiday packages starting from cultural ones, relaxing ones, and the most famous adventurous ones. All packages are different from each one as it is designed to your preferences. Our holiday services include a specialist itinerary, guide, and all the necessary arrangements to make your experience unforgettable. Based on your past experiences we can make a new holiday plan for you and add on new exciting adventurous activities with new memories based on new requirements.

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card mb-3">
          <img src={getImageUrl("vision.jpg")} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title text-center fs-3">Our Vision & Mission</h5>
            <p className="card-text text-justify" style={{ fontWeight: "500" }}>Wagnistrip is a growing travel company, which is known for its customer-centric approach, with no convenience services. you will be getting the cheapest and the finest prices rate of flights which you won't find anywhere. we have the most hard-working employees with an experienced team of excellent employees.therefore never hesitate to choose wagnistrip and see the difference by yourself.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
