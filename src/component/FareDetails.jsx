
import { useEffect, useState } from 'react';
import './faredetails.css';
import { setBookingStatus } from '../redux/actions/bookingActions';
import { useDispatch, useSelector } from 'react-redux';
const fareOptions = [
    {
      id: 1,
      title: "SAVER",
      price: 2377,
      discount: "Get Rs.600 OFF with BOOKNOW",
      baggage: ["7 Kg Cabin Baggage", "15 Kgs Check-in Baggage"],
      changeability: {
        cancellation_fee: 3000,
        date_change_fee: 2750
      },
      isRefundable: true
    },
    {
      id: 2,
      title: "FLEXI",
      price: 2766,
      discount: "Get Rs.700 OFF with FLEXISAVE",
      baggage: ["7 Kg Cabin Baggage", "20 Kgs Check-in Baggage"],
      changeability: {
        cancellation_fee: 2500,
        date_change_fee: 2300
      },
      isRefundable: true
    },
    {
      id: 3,
      title: "PREMIUM",
      price: 3200,
      discount: "Priority Check-in & Extra Baggage",
      baggage: ["10 Kg Cabin Baggage", "25 Kgs Check-in Baggage"],
      changeability: {
        cancellation_fee: 1800,
        date_change_fee: 1500
      },
      isRefundable: true
    },
    {
      id: 4,
      title: "ECO FLEX",
      price: 4200,
      discount: "Priority Check-in & Extra Baggage",
      baggage: ["10 Kg Cabin Baggage", "25 Kgs Check-in Baggage"],
      changeability: {
        cancellation_fee: 1800,
        date_change_fee: 1500
      },
      isRefundable: true
    }
  ];
const FareDetails = () => {
    const dispatch = useDispatch();
    const [selectedFare, setSelectedFare] = useState(null);
    const bookingStatus = useSelector((state) => state.booking.bookingStatus);
    return (
        <div className={`popup-overlay1 ${bookingStatus ? "show" : ""}`}>
            <div className="popup1">
                <div className='p-header'>
                    <p className='h5 fw'>More Fare Options Available</p>
                    <button onClick={() => dispatch(setBookingStatus(false))}  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>


                <div className='p-content'>
                    {/* Add your fare details content here */}

                    <div style={{ backgroundColor:'#8b3eea17' }} className="">
                        <div className="d-flex align-items-center border rounded">
                            <img src="https://i.pinimg.com/736x/69/21/a3/6921a359c4189653059b32f5b08cff30.jpg" className="airline-logo" alt="Airline Logo" />
                            <div style={{ fontSize:'12px' }} className="mb-0">
                                <span className="font-weight-bold">Delhi - Mumbai</span> AkasaAir • Wed-12Jun2024 • Departure at <span className="font-weight-bold">16:00</span> – Arrival at <span className="font-weight-bold">18:20</span>
                            </div>
                        </div>
                    </div>



                    <div className=" mt-3">
                        <div className=" w-100 d-flex flex-row overflow-x-scroll">
                            {fareOptions.map((fare) => (
                                <div key={fare.id} className="col-lg-4 col-12 col-md-6 mb-4">
                                    <div onClick={() => setSelectedFare(fare.id)} className="card fare-card">
                                        <div style={{ backgroundColor:'#8b3eea17' }} className="w-100 card-header align-content-center justify-content-between d-flex">
                                            <div>
                                                <strong style={{ color:'var(--main-color)' }}>{fare.title}</strong>
                                                <h5 className="card-price">₹ {fare.price}</h5>
                                                <p className="card-subtitle text-success">{fare.discount}</p>
                                            </div>
                                          <div>
                                          <input
                                                type="radio"
                                                class="form-check-input"
                                                name="fare"
                                                checked={selectedFare === fare.id}
                                            />
                                          </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-details">
                                                <p className="card-detail">
                                                    <i className="fas fa-suitcase"></i> Baggage
                                                </p>
                                                <ul>
                                                    {fare.baggage.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                                <p className="card-detail">
                                                    <i className="fas fa-exchange-alt"></i> Changeability
                                                </p>
                                                <ul>
                                                    <li>
                                                        Cancellation fee starts at Rs. {fare.changeability.cancellation_fee} onwards
                                                    </li>
                                                    <li>
                                                        Date Change fee starts at Rs. {fare.changeability.date_change_fee} onwards
                                                    </li>
                                                </ul>
                                                {fare.isRefundable && <span className="badge bg-success">Refundable</span>}
                                            </div>
                                            <button style={{ backgroundColor: selectedFare === fare.id ? 'var(--main-color)' : '#fff' }} className={` py-2 border rounded-lg w-100 mt-3 ${selectedFare === fare.id ? " text-white" : " bg-muted"}`}>
                                                {selectedFare === fare.id ? "Selected" : "Lock Now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>


                <div style={{ borderTop:'2px solid #e9e8e8' }} className='d-flex w-100 align-items-center justify-content-between p-3'>
                    <p>Grand Total <span className='h5 fw text-primary font-weight-bold'>Rs. 5178</span></p>
                    <button type="button" className="btn btn_theme btn_md">Book Now</button>
                </div>
            </div>
        </div>
    );
};

export default FareDetails;