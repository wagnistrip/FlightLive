import React from 'react'
import Footer from '../Footer';
import { Link } from 'react-router-dom';
import Offer from '../Offer';


const TermsCondition = () => {
    return (
        <>
           
            <Offer title="Terms & Conditions" />

            <div className='container-fluid bg-white py-3 text-justify'>
                <div className="container mt-0 mt-lg-5">
                    {/* <h3 className="mb-4">Terms and Conditions </h3> */}
                    <div className='mb-3'>Online payment gateways are used to process payments from Mastercard and American Express. You do not have to take extra stress of disclosure of any information through your card as the same process will be done from the bank side without giving us any details. In about 2530 seconds, your bank will provide you with an authorization code and a confirmation that the transaction has been completed (depending on your internet connection). Credit card information is protected using the most recent 128-bit encryption technology via a Verisign Certified website. According to the secured transaction of Internet standards. your card details will be fully safe and secure and they will be not shared with us in any how. we are using the most prominent security standard in the market right now for all your credential information.
                        If the credit card payments somehow do not get completed or get declined in the mid way then there are plenty of other options are also available for you. The order will be canceled if it is not canceled 72 hours before departure. A service fee will be chargeable on all domestic flights. the fee is not refundable from our side in any type of booking cancelation.
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Internet Banking</h4>
                        <p>
                            <Link to="#">Wagnistrip</Link> Pvt. Ltd. uses an internet gateway technology to accept payments, ensuring safe and secure transactions.
                        </p>
                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>HDFC</li>
                            <li>Allahabad Bank</li>
                            <li>Axis Bank</li>
                            <li>SBI</li>
                            <li>YES</li>
                            <li>Bank of Baroda</li>
                            <li>Bank of India</li>
                            <li>City Union Bank</li>
                            <li>Corporation Bank</li>
                            <li>IDBI</li>
                            <li>Federal Bank</li>
                            <li>Karnataka Bank</li>
                            <li>Kotak Bank</li>
                            <li>PNB</li>
                            <li>Central Bank of India</li>
                            <li>Indian Bank</li>
                            <li>Lakshmi Vilas Bank</li>
                            <li>Vijaya Bank</li>
                            <li>South Indian Bank</li>
                            <li>Citibank</li>
                            <li>United Bank</li>
                            <li>Union Bank</li>
                            <li>Jammu & Kashmir Bank</li>
                            <li>ICICI</li>
                            <li>Standard Chartered</li>
                            <li>Punjab & Maharashtra Bank</li>
                            <li>Canara Bank</li>
                            <li>Bank of Maharashtra</li>

                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className="mb-3">Pay at the Hotel (Post Pay)</h4>
                        <p>
                            Alongside several of our partner hotels,  <Link to="#">Wagnistrip</Link> Pvt. Ltd. has arranged a special agreement that allows customers to pay in person at the hotel reception when they check-in:
                        </p>
                        < ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>KLM</li>
                            <li>Kuwait Airways</li>
                            <li>Air France</li>
                            <li>Saudi Arabian Airlines</li>
                            <li>American Airlines</li>
                            <li>Continental Airlines</li>
                            <li>Delta Airlines</li>
                            <li>United Airlines</li>
                            <li>Kenya Airways</li>
                            <li>China Southern Airlines</li>
                            <li>China Eastern Airlines</li>
                            <li>Aeroflot</li>
                            <li>Egypt Air</li>
                            <li>Biman Bangladesh Airlines</li>
                            <li> To issue an e-ticket, Uzbekistan Airways requires copies of the passport and visa. If you are going to Europe, the United States, or Canada, or if you are flying with any of the airlines listed above,  <Link to="#">Wagnistrip</Link> Pvt. Ltd. will undoubtedly approach you for your passport information. Please have the following information handy:</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className="mb-3">Passport Information</h4>
                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>Passport Number: </li>
                            <li>Issuing Country: </li>
                            <li>Date of Birth (DD/MMM/YY): </li>
                            <li>Gender:</li>
                            <li>Expiry Date of Passport (DD/MMM/YY):</li>
                            <li>Last Name/Surname of Traveler:</li>
                            <li>First Name/Given Name of Traveler: </li>
                            <li>The Traveler's Middle Name, If Any: </li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Visa Instructions  </h4>
                        <p>About the visa requirements do bring an acceptable visa of the country you are visiting and kindly verify the visa with the embassy or the airline itself.
                        </p>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Delivery of the Services to the Customers</h4>

                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li><strong>What does the e-ticket mean?</strong>
                                <p>An electronic ticket is a document that will be present in your electronic devices. It includes a unique confirmation number which is given to every passenger who booked this ticket.</p>
                            </li>
                            <li><strong>By which procedure do I have to follow to get my e-ticket?</strong>
                                <p>All the information regarding your e-ticket will be given to you through your mail which will be provided to you during your booking procedure. If you haven't received your e-ticket within 8 hours then kindly contact our customer organisation. If customers disregard this requirement,  <Link to="#">Wagnistrip</Link> Pvt. Ltd. won't be held responsible.</p>
                            </li>
                            <li><strong>Is it compulsory to carry the e-ticket?</strong>
                                <p>Yes, the requirement of the e-ticket is necessary as it is one of the documents required at the airport, and without the ticket, you won't be able to get the boarding pass for your flight. If you won't carry the e-ticket  <Link to="#">Wagnistrip</Link> is not responsible for any delay in your journey.</p>
                            </li>
                            <li><strong>What steps are involved in obtaining a boarding pass?</strong>
                                <p>When you reach the airport you have to present your e-ticket to the airport service provider with a confirmation email then they provide the boarding pass of the particular country.</p>
                            </li>
                            <li><strong>What do you mean by PTA?</strong>
                                <p>Prepaid ticket advice is known as a PTA. We will provide you with a PTA number that you must provide at the airline's check-in counter at the airport. The airline employee will then print and give you your ticket at that point.</p>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">The Refund Policy of  <Link to="#">Wagnistrip</Link></h4>

                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li><strong>In terms of the cancellation of the flight, how much time does  <Link to="#">Wagnistrip</Link> take to give me the refund?</strong>
                                <p>Regarding the cancellation of any flight, the customer will get a refund in 24-30 days and it also depends on the airline guidelines. The payment will be received by you in the same mode as you have made the payment.</p>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Refund Guidelines in Terms of Hotels</h4>

                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>The cancellation amount you will get is based on the policy of the hotel, the period of cancellation, and it includes some of the other aspects also.</li>
                            <li>If you cancel any booking which is non-cancelable, then the customer will get no refund.</li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Passport Fees</h4>

                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>In the case of the passport, you will never get the refund fee as it is not refundable or transferable.</li>
                            <li>Even if the passport is rejected or the application is withdrawn, the application money is not refundable.</li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Cruise Refund Guidelines</h4>

                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'>
                            <li>Up to 24 hours before the scheduled departure date, you may cancel and get a Future Cruise Credit equal to 50% of the total amount paid.</li>
                            <li>You will lose your deposit if you cancel after the first 24 hours of the scheduled date.</li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="mb-3">Event Cancellation Refund Information</h4>
                        <ul style={{ listStyle: 'square' }} className='ml-4 my-3'    >
                            <li>In case of any event cancellation, you will not get any refundable amount.</li>
                        </ul>
                    </div>
                    <div className='mb-4'>
                        <h4 className='mb-3 fs-2'>Flights</h4>
                        <h4>Relevance of this Agreement</h4>
                        <p>This agreement is based on all the terms and conditions of our website Wagnisitrip and this agreement is related
                            to all the services that the user is booking with us or through any third-party, or any other available medium.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>The User is Aware of this Contract</h4>
                        <p>The user is already aware of the terms and conditions of  <Link to="#">Wagnistrip</Link> and the other party service,
                            it includes all the transactions, and services availed by our website for various purposes and all the services that are going to be provided by  <Link to="#">Wagnistrip</Link> shall be limited to this contract only.
                            Our website has the command and the control to delete the access of any other third-party website without any notice.
                        </p>
                        <p>From outside this agreement, users have to accept all the types of terms and conditions that are offered to them while booking any flight, tour package, or event management, they are also part of this agreement, and if the user does not agree with the terms and condition offer in any above-mentioned details then the user will not able to take any benefit and service avail by  <Link to="#">Wagnistrip</Link></p>
                    </div>
                    <div className='mb-4'>
                        <h4>Other Parties Involved Account Information</h4>
                        <p>When the user uses this access service they are permitted  <Link to="#">Wagnistrip</Link> to use the other party's information or any getaway for their knowledge.
                            While registering the account the user is responsible for their password and privacy and in case of any unauthorized login/ activity that happens in your account make sure to connect with us  <Link to="#">Wagnistrip</Link> is not responsible for any unauthorised activity or usage of the account.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Payments</h4>
                        <p> <Link to="#">Wagnistrip</Link> takes some fee for some of the listening and on every flight booking there is some fee taken from our side and  <Link to="#">Wagnistrip</Link> can change the fee before the interval without any notice.
                            If somehow the booking did not get confirmed we give the customer the refund or if they want another flight we will provide them the next booking.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Privacy</h4>
                        <p>Any confidentiality news announced by us will remain between us and the user only. We assure you of the confidentiality of your information.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Methods of Contact with the Customer</h4>
                        <p>There are many ways where we can contact the customer, it can be because of any flight booking, tour plan, event management, or any other regarding the booking. contact can be done by calls, emails through chat, we need this information for future upcoming news also and any offers, therefore, our customers can benefit from it.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>User Responsibility</h4>
                        <p> <Link to="#">Wagnistrip</Link> is responsible for that transaction which is done by us only, not for any other outside or third-party transaction, kindly follow the basic guidelines for all the users, and to be in this contract the user must be legally aged and the user must not be a minor</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Linked website with <Link to="#">Wagnistrip</Link></h4>
                        <p> <Link to="#">Wagnistrip</Link> does not link or advertise any other website on our native website thus be, attentive before entering and sharing your details with any of the websites then we are not responsible for your leaked information.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4 className=''>Feedback</h4>
                        <p>Feedback is important for customer relations users with the company, we ask for feedback so we can improve ourselves and add better policies for customers to give them the finest experience of their lives.</p>
                    </div>
                    <div className='mb-4'>
                        <h4 className='my-2'>How to Book from our Website <Link to="#">Wagnistrip</Link></h4>
                        <p>It is quite straightforward to book a flight via wagnistrip; GST is included in the flight booking fee as well as the cancellation and rescheduling fees and service charge at the end.  <Link to="#">Wagnistrip</Link> does not take any additional fees for any personal purpose
                            Before booking an infant flight ticket make sure you have valid ID proof documents and while traveling make sure the infant is carried by a legal age ( 18 years old )person.
                            If the child age is older than 2 years then the child will not be considered an infant anymore you have to book an extra flight for the child. { }
                            <Link to="#">Wagnistrip</Link> is not in the beeline to any of the airlines and in the event of cancelation by any airline you have to reach  <Link to="#">Wagnistrip</Link> itself then you can apply for the refund process and  <Link to="#">Wagnistrip</Link> is not responsible for the delay and cancelation from the airway company.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>The Cancelation Policy of  <Link to="#">Wagnistrip</Link></h4>
                        <p>According to the cancellation policy of the  <Link to="#">Wagnistrip</Link>, there will be no refund for the tickets whose range comes under 5k, and you are eligible for the refund when the ticket price is above 5k and it also depends on the sector and date of the flight, cancelation can be done through online and offline through both processes. You just have to contact Wagnistriip through emails, calls, chat or in some cases you have to contact the airline directly.
                            In case of cancellation of a flight after the departure, if it's showing a show in the area then  <Link to="#">Wagnistrip</Link> is not responsible for any kind of cancelation charges, for that you have to reach out to the airline
                            For cancellation regarding the holiday package if you are canceling before 30 days then a 25% cancelation amount will be deducted from your holiday package amount or from the advance you have paid.
                        </p>
                        <ul>
                            <li>Secondly, if you cancel between 29 to 15 days then 50% of your tour package amount will be deducted.</li>
                            <li>If you cancel the holiday tour package between 14 to 8 days then 75% will be deducted as cancelation charges amount</li>
                            <li>And the last case if you cancel your journey within the 8-day then 100% of the charges will be deducted from your tour package and no refund will be given to the customer.</li>

                        </ul>
                    </div>
                    <div className='mb-4'>
                        <h4> The Refund policy of  <Link to="#">Wagnistrip</Link></h4>
                        <p>The refund policy of  <Link to="#">Wagnistrip</Link> is only applicable to those customers who raise the cancelation request and then only they are going to be considered, a refund will be done through the same process as the customer has made the payment and the refund will be given to the customer by the concern we get from the particular airline/traveling agency or any other mode.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Refund in Situations like Bankruptcy/ Insolvency</h4>
                        <p>Wagnistrip is not responsible for any of the situations that happen like bankruptcy or insolvency and in this case, there will be no responsibility for our agency in some cases,  <Link to="#">Wagnistrip</Link> will give the refund but when the airline is giving assurity only
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Visa Requirements</h4>
                        <p>Visa is the basic requirement for most of the country therefore, you need to carry a visa with you while traveling to various destinations.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Right to Deny</h4>
                        <p> <Link to="#">Wagnistrip</Link> had a right to deny all the offers of the customers if they found something irrelevant or something wrong with the user and any agreement made by the customer with us would be incomplete without our approval after their payment.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Right of Cancellation in case of  any Wrong Information</h4>
                        <p>If  <Link to="#">Wagnistrip</Link> finds out that the customer is lying to us in any way and try to misrepresent any required information then  <Link to="#">Wagnistrip</Link> has a strict right to take action against that customer and in the future also not give any type of service to him.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Clarification of all types of Gender</h4>
                        <p>Clarification of all the types of genders is defined.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Severability of  <Link to="#">Wagnistrip</Link></h4>
                        <p>This scenario will come when only some unacceptable conditions come then only it applies to them otherwise the normal agreement is valid.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>The relationship of  <Link to="#">Wagnistrip</Link> with the user</h4>
                        <p>Users have the full right to use the website as the all terms and conditions but it does not create any partnership with them.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>User Donation Refund</h4>
                        <p>There is no policy regarding the refund of the donation which is made by the user during the booking of the flight by Wagnsitrip.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Upgrading of Information</h4>
                        <p>For the smooth running of the website,  <Link to="#">Wagnistrip</Link> keeps doing updates and adding information that is needed for the customer on their  <Link to="#">Wagnistrip</Link> website so that the customer will not face any trouble while using the website. some technical glitches can be seen on the website and to get rid of these glitches we often do this procedure.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Upgrading of Terms and Conditions of  <Link to="#">Wagnistrip</Link></h4>
                        <p> <Link to="#">Wagnistrip</Link> has a full right to change the terms and conditions as per the agreement conditions without giving any notice to the customer in advance.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Authority and Control</h4>
                        <p> <Link to="#">Wagnistrip</Link> declines all the types of implied warranties, they prefer more representation in the court itself</p>
                    </div>
                    <div className='mb-4'>
                        <h4>User Agreement for the Customers</h4>
                        <p>Any user who is using our website or a user who uses any facility, or service of  <Link to="#">Wagnistrip</Link> will be responsible for all the service done by us and the user agrees to all the terms and conditions by themselves only, <Link to="#">Wagnistrip</Link> is not responsible for any kind of delaying and cancelation of flight which is done by the airline.
                            If something happens like cancellation of a flight or delay of the flight the customer has to inform  <Link to="#">Wagnistrip</Link> as  <Link to="#">Wagnistrip</Link> does not get notified by the flight
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4 className='fs-2'>Hotels </h4>
                        <h4>General </h4>
                        <p>You can book a hotel through our sites and get the best deals on hotel booking also if you are booking a hotel before 1 month we can say that you don’t have to go anywhere for hotel booking  <Link to="#">Wagnistrip</Link> is the best and overall booking platform along with flights, you can easily book hotels as well. Through our company, if you are booking a flight then you can also book a hotel at that time and get a chance for better services.
                        </p>

                    </div>
                    <div className='mb-4'>
                        <h4>Booking and Confirmation</h4>
                        <p>When making a booking of hotels you must required to state your name, address, phone number, arrival and departure time, and date. And also the payment method, if you want to book a room at any hotel then you must have the age of 18 for a minor liable regardless. For security reasons, we allow the hotel staff members to check guests in our hotel rooms.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Arrival and Departure</h4>
                        <p>The time of arrival and departure depends on your booking date and the price of your booking, so when you have to depart depends on your hotel booking.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Cancellation and No Arrival </h4>
                        <p>Cancellation made only 24 hours before your arrival date, You will be charged for one night's stay if you don't show up or if you cancel less than 24 hours before your scheduled arrival date.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Early Departure and Open-Ended Stays </h4>
                        <p>If you have booked a particular period but you depart earlier. Then the price will be manageable for your booking, you have to contact the hotel to notify your departure. If you are planning to stay in the hotel for extra time and want to stay extra of your booking dates then you have to confirm this with the hotel in charge before 6 pm, otherwise, one-night charges will be implemented in your hotel price. If the hotel can no longer available rooms for you then they will notify you by 6 pm the day before departure is required.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>The Responsibilities of the Hotel and your Personal Needs</h4>
                        <p>Should the hotel be unable to provide the reserved accommodation, you have the right, at no additional expense, to a better or equivalent room inside the hotel or at a similar caliber hotel. When making your reservation, let the hotel know what you need so they can make the necessary arrangements. Every room at each of our hotels is smoke-free. The hotel has the right to bill visitors for any expenses incurred if they violate the smoking restriction. When making your reservation, you first have to inform us if you are also carrying a pet with you.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Payments </h4>
                        <p>Payment should be kept in advance for some room sets, the amount paid will be deducted in your final payment. if you are trying to cancel
                            the booking of hotels after the deadlines. Then the amount will be charged to you for the hotel booking fee, advance in general. The hotel
                            bill is must be paid through a receipt usually after arrival at the hotel.  In our hotels, we will accept credit cards and debit cards.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Your Safety</h4>
                        <p>Important points to be kept in mind are that the emergency exit, fire extinguisher, and alarm button are located. You can check the other details on the back of your door. </p>
                    </div>
                    <div className='mb-4'>
                        <h4>Processing of Personal Data </h4>
                        <p>The personal data that you should provide to us is kept safely and privately. We will not disclose your data anywhere so don’t worry about that. Your data is only and mostly used to make the profile for you. If you are booking the hotel before also with our site. Then the next time we will provide you with a more experienced booking process through our site, and provide an affordable price for hotels.</p>
                    </div>
                    <div className='mb-4'>
                        <h2>Events  </h2>
                        <p>These are the basic guidelines that  <Link to="#">Wagnistrip</Link> has and all the services that  <Link to="#">Wagnistrip</Link> provides will be followed by the terms and conditions which is written in this document. The client should read and accept all the terms and conditions before booking any services with our company.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Payment Reservation</h4>
                        <p>The payment has to be made seven days before the event and you can make the payment through the card, cheque, and various online methods.do make sure to make the payment fully not partially before the event. the company had full right to cancel your booking in case of not receiving the payment fully before the event.</p>
                    </div>
                    <div className='mb-4'>
                        <h3>Inclusion</h3>
                        <p> <Link to="#">Wagnistrip</Link> will provide all; the necessary props and equipment required for the event as per the invoice that will be provided.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Replacement of Equipment</h4>
                        <p> <Link to="#">Wagnistrip</Link> has a full right to replace equipment due to failure of any service or any reason.</p>
                    </div>
                    <div className='mb-3'>
                        <h4 className='mb-2'>Drugs</h4>
                        <h5> <Link to="#">Wagnistrip</Link> will refuse to take part in any event in case of a service related to drugs.it is highly against our guidelines.</h5>
                        <p>The client acknowledges the power of the company's event management and skippers, knowing that they have the right to make any decisions they deem necessary to protect the participants' health, welfare, and safety.</p>
                    </div>
                    <div className='my-4'>
                        <h4>Dates Changing</h4>
                        <p> <Link to="#">Wagnistrip</Link> has the full right to take extra charges up to 10% in case of any date change in the event. the company can charge more in case it's nearly impossible to change. No changes can be made within 30 days of the event.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Regarding the Cancelation of any Event </h4>
                        <p>The customer gets 100% of the cancelation fee in case of cancelation of an event in the 4th week, in case of a period between 4 to 8 weeks the customer can get up to 50% cancelation amount if the timespan has been passed to more than 8 weeks then you can get up to 15% of cancelation frees.</p>
                    </div>
                    <div className="mb-4">
                        <h4>Variation in the Attendance Count</h4>
                        <p>Refunds are rarely granted for reduced attendance and never happen within 30 days before the event. Every attempt will be taken to reduce variable costs, such as food, etc., if the number of attendees is lowered more than 30 days before the event. </p>
                    </div>
                    <div className='mb-4'>
                        <h4>In Case of any Natural Disaster, or any red zone event </h4>
                        <p> <Link to="#">Wagnistrip</Link> may postpone any event or service due to extremely bad weather conditions, any terror attack, or any extreme situation. In case of any bad conditions,  <Link to="#">Wagnistrip</Link> is not liable for any kind of charges.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Bad Weather Conditions</h4>
                        <p>In case of very bad conditions of weather,  <Link to="#">Wagnistrip</Link> will try to arrange more indoor activities to make the event more good and if it is extremely unsafe then we will exchange the date of that particular event. company will not take any responsibility for any hotels, or any flight cancelation charges due to these conditions.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Liability of Damage to of any our Properties or Goods</h4>
                        <p>If we find any damage in our equipment or in anything which is caused by the bad driving then the customer or the driver is liable for that.</p>
                    </div>
                    <div className='mb-4'>
                        <h4>Copyright</h4>
                        <p>The company gives the customer full right to use the images taken by us during the event which the customer paid for and we expect the same from the customer itself.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default TermsCondition