import React, { useState, useEffect } from 'react'
import "./Career.scss"
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import Offer from '../Offer'
import Footer from '../Footer'
import { getImageUrl } from '../../utils/airlineUtils'

const Career = () => {


  const [activeTab, setActiveTab] = useState('Impact');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };




  const cardData = [
    {
      title: 'Front-End Developer',
      text: 'Responsible for implementing visual elements that users see and interact with in a web application.',
      country: 'IND',
      state: 'Delhi',
      yearOfExperience: '2 years',
      companyName: 'Tech Innovators',
      jobType: 'Full-time',
      salaryRange: '₹6,00,000 - ₹8,00,000',
      aboutCompany: 'Tech Innovators is a leading company in software development and technology solutions.',
      link: '/apply/front-end-developer'
    },
    {
      title: 'Full Stack Developer',
      text: 'Works with both the front and back ends of a website or application.',
      country: 'IND',
      state: 'Mumbai',
      yearOfExperience: '3 years',
      companyName: 'Global Tech',
      jobType: 'Full-time',
      salaryRange: '₹8,00,000 - ₹10,00,000',
      aboutCompany: 'Global Tech provides comprehensive IT solutions and services to clients worldwide.',
      link: '/apply/full-stack-developer'
    },
    {
      title: 'Laravel Developer',
      text: 'Specializes in developing web applications using the Laravel framework.',
      country: 'IND',
      state: 'Bangalore',
      yearOfExperience: '2 years',
      companyName: 'Web Solutions Ltd',
      jobType: 'Full-time',
      salaryRange: '₹5,00,000 - ₹7,00,000',
      aboutCompany: 'Web Solutions Ltd is known for creating robust and scalable web applications.',
      link: '/apply/laravel-developer'
    },
    {
      title: 'PHP Developer',
      text: 'Writes server-side web application logic using PHP.',
      country: 'IND',
      state: 'Chennai',
      yearOfExperience: '2 years',
      companyName: 'Code Masters',
      jobType: 'Full-time',
      salaryRange: '₹5,50,000 - ₹7,50,000',
      aboutCompany: 'Code Masters specializes in developing high-quality PHP applications.',
      link: '/apply/php-developer'
    },
    {
      title: 'Business Analyst',
      text: 'Analyzes and documents business processes and systems.',
      country: 'IND',
      state: 'Pune',
      yearOfExperience: '4 years',
      companyName: 'Business Insights',
      jobType: 'Full-time',
      salaryRange: '₹7,00,000 - ₹9,00,000',
      aboutCompany: 'Business Insights offers top-notch business analysis and consulting services.',
      link: '/apply/business-analyst'
    },
    {
      title: 'GDS Specialist',
      text: 'Manages reservations and distribution of travel products.',
      country: 'IND',
      state: 'Kolkata',
      yearOfExperience: '2 years',
      companyName: 'Travel Experts',
      jobType: 'Full-time',
      salaryRange: '₹4,00,000 - ₹6,00,000',
      aboutCompany: 'Travel Experts is a leader in the travel and tourism industry.',
      link: '/apply/gds-specialist'
    },
    {
      title: 'Digital Marketing Specialist',
      text: 'Plans and executes digital marketing campaigns.',
      country: 'IND',
      state: 'Hyderabad',
      yearOfExperience: '3 years',
      companyName: 'Marketing Gurus',
      jobType: 'Full-time',
      salaryRange: '₹5,50,000 - ₹7,50,000',
      aboutCompany: 'Marketing Gurus provides comprehensive digital marketing solutions.',
      link: '/apply/digital-marketing-specialist'
    },
    {
      title: 'Content Writer',
      text: 'Creates engaging written content for various platforms.',
      country: 'IND',
      state: 'Ahmedabad',
      yearOfExperience: '2 years',
      companyName: 'Creative Minds',
      jobType: 'Full-time',
      salaryRange: '₹6,00,000 - ₹7,00,000',
      aboutCompany: 'Creative Minds is a content creation agency known for its high-quality writing services.',
      link: '/apply/content-writer'
    },
    {
      title: 'Human Resources Manager',
      text: 'Oversees recruitment, training, and employee relations.',
      country: 'IND',
      state: 'Jaipur',
      yearOfExperience: '5 years',
      companyName: 'HR Solutions',
      jobType: 'Full-time',
      salaryRange: '₹8,00,000 - ₹10,00,000',
      aboutCompany: 'HR Solutions provides human resource management services to various industries.',
      link: '/apply/hr-manager'
    },
    {
      title: 'Technical Support Engineer',
      text: 'Provides technical assistance and support for incoming queries.',
      country: 'IND',
      state: 'Lucknow',
      yearOfExperience: '2 years',
      companyName: 'Support Heroes',
      jobType: 'Full-time',
      salaryRange: '₹4,00,000 - ₹6,00,000',
      aboutCompany: 'Support Heroes specializes in providing top-notch technical support services.',
      link: '/apply/technical-support-engineer'
    },
    {
      title: 'Graphic Designer',
      text: 'Creates visual concepts to communicate ideas.',
      country: 'IND',
      state: 'Surat',
      yearOfExperience: '3 years',
      companyName: 'Design Studio',
      jobType: 'Full-time',
      salaryRange: '₹5,00,000 - ₹7,00,000',
      aboutCompany: 'Design Studio is renowned for its innovative graphic design solutions.',
      link: '/apply/graphic-designer'
    },
    {
      title: 'Testing Engineer',
      text: 'Tests software to ensure quality and functionality.',
      country: 'IND',
      state: 'Bhopal',
      yearOfExperience: '2 years',
      companyName: 'Quality Assured',
      jobType: 'Full-time',
      salaryRange: '₹5,00,000 - ₹7,00,000',
      aboutCompany: 'Quality Assured provides expert software testing and quality assurance services.',
      link: '/apply/testing-engineer'
    }
  ];

  return (
    <>
      
      <Offer title="Carrier" />
      <div id='career-outer-section'>
        <div className="container p-2">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h1>Join Us</h1>
              <h3>Why Join Us?</h3>
              <p>Wagnistrip provides alot of Personal and field development opportunities that will help you to
                make you stand yourself uniquely and differently. With an enthusiastic work environment,
                employees can enjoy a work-life balance. The employee can learn new skills and work on
                various projects. Your life&#39;s journey to success will start from here.</p>
            </div>
            <div className="col-12 col-md-6">
              <img src={getImageUrl("careerimage.jpg")} alt="Innovation" className="img-fluid p-3" />
            </div>
          </div>
        </div>

        <div className='container p-3 '>
          <h2 className='fs-2' style={{ color: "#8a3c3c" }}>The WAGNISTRIP Difference</h2>
          <div className="row">

            <div className="col-12 col-md-4 mb-3">
              <div className="card card-hover text-bg-dark">
                <div className="card-img-wrapper">
                  <img src={getImageUrl("innovation.jpg")} className="card-img" alt="..." />
                  <div className="card-img-overlay">
                    <h5 className="card-title">Discover Your Next Adventure</h5>
                    <p className="text-white text-justify">
                      Almost everyone loves traveling and experiencing new things in their life. With the help of
                      wagnistrip, you can experience new adventures, see mesmerizing places, have a romantic
                      experience with your loved ones, and see the most eternal beaches you have ever seen in your
                      life.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <div className="card card-hover text-bg-dark">
                <div className="card-img-wrapper">
                  <img src={getImageUrl("workplace.jpg")} className="card-img" alt="..." />
                  <div className="card-img-overlay">
                    <h5 className="card-title">What Does Wagnistrip Do? </h5>
                    <p className="text-white text-justify">
                      Wagnistrip is an travel company that provides fantastic deals on flights, tour packages, hotels,
                      Visa Services, and event management. the process is very easy and convenient to avail any of
                      our services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <div className="card card-hover text-bg-dark">
                <div className="card-img-wrapper">

                  <img src={getImageUrl("investment.jpg")} className="card-img" alt="..." />
                  <div className="card-img-overlay">
                    <h5 className="card-title">Exclusive Deals and Offers Through Wagnistrip</h5>
                    <p className="text-white text-justify">
                      Make your Booking with wagnistrip and take benefit of the enormous discount offers throughout
                      the year. we have the cheapest flight ticket prices you ever found on any other website.
                      We have affordable rates for all the tours and travel services provided to our customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="container-fluid bg-dark py-3 text-light">
          <div className="container">
            <div style={{ borderBottom: "1px solid white", textAlign: 'center' }}>
              <h2>Why Wagnistrip</h2>
            </div>
            <div className="card text-center bg-dark text-light">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  {['Impact', 'Development', 'Support', 'Progress'].map(tab => (
                    <li className="nav-item" key={tab}>
                      <a
                        className={`nav-link ${activeTab === tab ? 'tab-active' : ''} text-white`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabClick(tab);
                        }}
                        href="#"
                      >
                        {tab}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'Impact' && (
                  <div>

                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <img src={getImageUrl("impact.jpg")} alt="Innovation" className="img-fluid p-3" />
                      </div>
                      <div className="col-12 col-md-6">
                        <h2>Guide with motive </h2>
                        <p className='text-justify'>Wagnistrip provides you excellent offers with flight booking, you can book a flight with us
                          and why you choose us ? Because we will provides you all types of travel Services such as flight booking, tour packages, holiday packages,
                          any type of event management, you can also apply for any type of visa, our duty is happiness of customers.
                        </p>
                      </div>

                    </div>
                  </div>
                )}
                {activeTab === 'Development' && (
                  <div>
                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <img src={getImageUrl("development.jpg")} alt="Innovation" className="img-fluid p-3" style={{ height: "620px", width: "600px", objectFit: "cover" }} />
                      </div>
                      <div className="col-12 col-md-6">
                        <h2>Constant Research </h2>
                        <p className='text-justify'>We enable our associates to provide creative solutions by providing them with the opportunity to access and
                          leverage the vast collective experience that exists within Wagnistrip. We ensure that they continue to lead the way in innovation
                          because this wagnistrip provides you a wonderful flights and other facilities. </p>


                      </div>

                    </div>
                  </div>
                )}
                {activeTab === 'Support' && (
                  <div>
                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <img src={getImageUrl("support.jpg")} alt="Innovation" className="img-fluid p-3" />
                      </div>
                      <div className="col-12 col-md-6">
                        <h2>Support</h2>
                        <p className='text-justify'>Our first priority is help people for their travel arrangements and not only the travel arrangements but also
                          in hotel, visa, event management as well. Wagnistrip plays a major role in tour & travel agency because it has a more excellent services
                          for you, great and more comfortable flights are availbale in cheap rate as well.
                        </p>
                      </div>

                    </div>
                  </div>
                )}
                {activeTab === 'Progress' && (
                  <div>
                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <img src={getImageUrl("progress.jpg")} alt="Innovation" className="img-fluid p-3" style={{ height: "620px", width: "600px", objectFit: "cover" }} />
                      </div>
                      <div className="col-12 col-md-6">
                        <h2>Progress</h2>
                        <p className='text-justify'>Wagnistrip involves coordination between the tour vendor and local guides, we see people as long term relations,
                          this will build through the information they give us while booking and we keep them private and safe, this is our duty to win their trust on us. </p>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white p-3">
          <div className="row">
            <h4 style={{
              fontSize: '36px',
              position: 'relative',
              display: 'inline-block',
              textAlign: 'center'
            }}>
              Latest Jobs
              <span style={{
                content: '',
                position: 'absolute',
                bottom: -10,
                left: '45%',
                // right:'70%',
                width: '150px',
                height: '4px',

                backgroundColor: '#0e0e0e', // Adjust color as needed
              }}></span>
            </h4>
            {/* <h2 style={{ borderBottom: '2px solid black' }} className="text-center mb-5 border-black">Latest Jobs</h2> */}
            {!cardData ? cardData.map((card, index) => (
              <div className="col-lg-4 col-sm-6 mb-3" key={index}>
                <div className="custom-card-new">
                  <div className="custom-card-body-new d-flex flex-column">
                    <p className="custom-card-text-new">
                      {card.state} | {card.country}
                    </p>
                    <h5 className="custom-card-title-new fs-6 text-muted">{card.title}</h5>
                    <p className="custom-card-text-new">{card.text}</p>

                    <p className="custom-card-text-new">
                      <strong className='text-muted'>Experience:</strong> {card.yearOfExperience}
                    </p>
                    <p className="custom-card-text-new">
                      <strong className='text-muted'>Company:</strong> {card.companyName}
                    </p>
                    <p className="custom-card-text-new">
                      <strong className='text-muted'>Job Type:</strong> {card.jobType}
                    </p>
                    <p className="custom-card-text-new">
                      <strong className='text-muted'>Salary:</strong> {card.salaryRange}
                    </p>
                    <p className="custom-card-text-new">
                      <strong className='text-muted'>About Company:</strong> {card.aboutCompany}
                    </p>
                    {/* <button
                    className="custom-btn-primary-new mt-auto bg-info"

                  >
                    APPLY NOW
                  </button> */}
                    <div className='w-100 d-flex align-items-center justify-content-end'>
                      <button style={{ width: 'fit-content' }} type="button" className="btn rounded-pill fs-6 btn-outline-info"> APPLY NOW <TbCircleArrowUpRightFilled size={24} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (<div className='text-center w-50 mt-5 mx-auto overflow-hidden py-5 fs-4'>
              <img className='w-50' src="https://www.shutterstock.com/image-vector/coming-soon-letter-hanging-door-600nw-2497993761.jpg" alt="" />
            </div>)}
          </div>
        </div>

      </div>
      <Footer />
    </>

  )
}

export default Career