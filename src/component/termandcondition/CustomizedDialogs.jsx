

import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
      margin: theme.spacing(1),
    },
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    maxHeight: '350px',
    overflowY: 'auto',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = styled(DialogTitle)(({ theme }) => ({
  m: 0,
  p: 2,
  backgroundColor: 'white',
  boxShadow: theme.shadows[5],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export default function CustomizedDialogs({ open, handleClickOpen, handleClose, title }) {


  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title">
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </BootstrapDialogTitle>
        {
          title === 'Terms & Condition' && (
            <DialogContent dividers>
              <h3 className='fw-semibold text-black mb-4 fs-4' gutterBottom>
                Wagnistrip terms and conditions for means of payment
              </h3>
              <h3 className='fw-semibold text-black fs-6' gutterBottom>
                Relevance of this agreement
              </h3>
              <Typography gutterBottom>
                <div className='fs-6 text-muted'>
                  This agreement is based on all the terms and conditions of our website Wagnisitrip and this agreement is related to all the services that the user is booking with us or through any third-party, or any other available medium.
                </div>
                <br />
              </Typography>
              <h2 className='fw-bold fs-5 text-black'>The user is aware of this contract
              </h2>
              <Typography gutterBottom className=''>
                The user is already aware of the terms and conditions of wagnistrip and the other party service, it includes all the transactions, and services availed by our website for various purposes and all the services that are going to be provided by wagnistrip shall be limited to this contract only.
                Our website has the command and the control to delete the access of any other third-party website without any notice.
                <br />
                From outside this agreement, users have to accept all the types of terms and conditions that are offered to them while booking any flight, tour package, or event management, they are also part of this agreement, and if the user does not agree with the terms and condition offer in any above-mentioned details then the user will not able to take any benefit and service avail by wagnistrip.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Other parties involved account information
              </h2>
              <Typography gutterBottom className=''>
                When the user uses this access service they are permitted wagnistrip to use the other party's information or any getaway for their knowledge.
                While registering the account the user is responsible for their password and privacy and in case of any unauthorized login/ activity that happens in your account make sure to connect with us wagnistrip is not responsible for any unauthorised activity or usage of the account.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Payments
              </h2>
              <Typography gutterBottom className=''>
                Wagnistrip takes some fee for some of the listening and on every flight booking there is some fee taken from our side and wagnistrip can change the fee before the interval without any notice.
                <br />
                If somehow the booking did not get confirmed we give the customer the refund or if they want another flight we will provide them the next booking.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Privacy
              </h2>
              <Typography gutterBottom className=''>
                Any confidentiality news announced by us will remain between us and the user only. We assure you of the confidentiality of your information
              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Methods of contact with the customer

              </h2>
              <Typography gutterBottom className=''>
                There are many ways where we can contact the customer, it can be because of any flight booking, tour plan, event management, or any other regarding the booking. contact can be done by calls, emails through chat, we need this information for future upcoming news also and any offers, therefore, our customers can benefit from it.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>User Responsibility

              </h2>
              <Typography gutterBottom className=''>
                Wagnistrip is responsible for that transaction which is done by us only, not for any other outside or third-party transaction, kindly follow the basic guidelines for all the users, and to be in this contract the user must be legally aged and the user must not be a minor.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Linked website with wagnistrip

              </h2>
              <Typography gutterBottom className=''>
                Wagnistrip does not link or advertise any other website on our native website thus be, attentive before entering and sharing your details with any of the websites then we are not responsible for your leaked information
              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Feedback

              </h2>

              <Typography gutterBottom className=''>
                Feedback is important for customer relations users with the company, we ask for feedback so we can improve ourselves and add better policies for customers to give them the finest experience of their lives.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>How to book from our website wagnistrip

              </h2>

              <Typography gutterBottom className=''>
                It is quite straightforward to book a flight via Wagonistrip; GST is included in the flight booking fee as well as the cancellation and rescheduling fees and service charge at the end. Wagnistrip does not take any additional fees for any personal purpose
                Before booking an infant flight ticket make sure you have valid ID proof documents and while traveling make sure the infant is carried by a legal age ( 18 years old )person.
                If the child age is older than 2 years then the child will not be considered an infant anymore you have to book an extra flight for the child
                Wagnistrip is not in the beeline to any of the airlines and in the event of cancelation by any airline you have to reach wagnistrip itself then you can apply for the refund process and wagnistrip is not responsible for the delay and cancelation from the airway company.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>The cancelation policy of wagnistrip

              </h2>

              <Typography gutterBottom className=''>
                According to the cancellation policy of the Wagnistrip, there will be no refund for the tickets whose range comes under 5k, and you are eligible for the refund when the ticket price is above 5kand it also depends on the sector and date of the flight, cancelation can be done through online and offline through both processes you just have to contact Wagnistriip through emails, calls, chat or in some cases you have to contact the airline directly.
                In case of cancellation of a flight after the departure, if it's showing a show in the area then wagnistrip is not responsible for any kind of cancelation charges, for that you have to reach out to the airline.<br />
                For cancellation regarding the holiday package if you are canceling before 30 days then a 25% cancelation amount will be deducted from your holiday package amount or from the advance you have paid.

              </Typography>
              <Typography gutterBottom className=''>
                <ul style={{ listStyle:'square' }} className='ml-4 my-3'>
                  <li>
                    Secondly, if you cancel between 29 to 15 days then 50% of your tour package amount will be deducted.
                  </li>
                  <li>
                    If you cancel the holiday tour package between 14 to 8 days then 75% will be deducted as cancelation charges amount.
                  </li>
                  <li>
                    And the last case if you cancel your journey within the 8-day then 100% of the charges will be deducted from your tour package and no refund will be given to the customer.
                  </li>
                </ul>
              </Typography>


              <h2 className='fw-bold mt-5 fs-5 text-black'>The refund policy of wagnistrip

              </h2>

              <Typography gutterBottom className=''>
                The refund policy of wagnistrip is only applicable to those customers who raise the cancelation request and then only they are going to be considered, a refund will be done through the same process as the customer has made the payment and the refund will be given to the customer by the concern we get from the particular airline/traveling agency or any other mode.
              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Refund in situations like bankruptcy/ Insolvency

              </h2>

              <Typography gutterBottom className=''>
                Wagniastrip is not responsible for any of the situations that happen like bankruptcy or insolvency and in this case, there will be no responsibility for our agency in some cases, wagnistrip will give the refund but when the airline is giving assurity only.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Refund in situations like bankruptcy/ Insolvency

              </h2>

              <Typography gutterBottom className=''>
                Wagniastrip is not responsible for any of the situations that happen like bankruptcy or insolvency and in this case, there will be no responsibility for our agency in some cases, wagnistrip will give the refund but when the airline is giving assurity only.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Visa requirements
              </h2>

              <Typography gutterBottom className=''>
                Visa is the basic requirement for most of the country therefore, you need to carry a visa with you while traveling to various destinations.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Right to deny
              </h2>

              <Typography gutterBottom className=''>
                Wagnistrip had a right to deny all the offers of the customers if they found something irrelevant or something wrong with the user and any agreement made by the customer with us would be incomplete without our approval after their payment.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Right of cancellation in case of  any wrong information
              </h2>

              <Typography gutterBottom className=''>
                If wagnistrip finds out that the customer is lying to us in any way and try to misrepresent any required information then wagnistrip has a strict right to take action against that customer and in the future also not give any type of service to him.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Clarification of all types of gender
              </h2>

              <Typography gutterBottom className=''>
                Clarification of all the types of genders is defined.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Severability of wagnistrip
              </h2>

              <Typography gutterBottom className=''>
                This scenario will come when only some unacceptable conditions come then only it applies to them otherwise the normal agreement is valid.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>The relationship of wagnistrip with the user
              </h2>

              <Typography gutterBottom className=''>
                Users have the full right to use the website as the all terms and conditions but it does not create any partnership with them.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>User donation refund
              </h2>

              <Typography gutterBottom className=''>
                There is no policy regarding the refund of the donation which is made by the user during the booking of the flight by Wagnsitrip.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Upgrading of information
              </h2>

              <Typography gutterBottom className=''>
                For the smooth running of the website, wagnistrip keeps doing updates and adding information that is needed for the customer on their wagnistrip website so that the customer will not face any trouble while using the website. some technical glitches can be seen on the website and to get rid of these glitches we often do this procedure


              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Upgrading of terms and conditions of wagnistrip

              </h2>

              <Typography gutterBottom className=''>
                Wagnistrip has a full right to change the terms and conditions as per the agreement conditions without giving any notice to the customer in advance.

              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Authority and control

              </h2>

              <Typography gutterBottom className=''>
                Wagnistrip declines all the types of implied warranties, they prefer more representation in the court itself.
              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>User Agreement for the customers

              </h2>

              <Typography gutterBottom className=''>
                Any user who is using our website or a user who uses any facility, or service of wagnistrip will be responsible for all the service done by us and the user agrees to all the terms and conditions by themselves only,wagnistrip is not responsible for any kind of delaying and cancelation of flight which is done by the airline.
                <br />
                If something happens like cancelation of a flight or delay of the flight the customer has to inform wagnistrip as wagnistrip does not get notified by the flight.

              </Typography>



            </DialogContent>
          )
        }
        {
          title === 'User Agreement' && (
            <DialogContent dividers>
              <h3 className='fw-semibold text-black fs-5' gutterBottom>
                User contract of wagnistrip for payment method
              </h3>
              <Typography gutterBottom>
                <div className='fs-6 text-muted'>
                  The terms and services of a user contract indicate all the guidelines of our company wagnistrip which are compulsory for the user to follow and it shows the relation between the user with us and the other alliance company the user who is looking to buy the products using our website or using the email marketing transfer.

                </div>
                <br />
              </Typography>
              <h2 className='fw-bold fs-5 text-black'>User accountability for this recognition of this contract
              </h2>
              <Typography gutterBottom className=''>
                By accepting all the terms and conditions of our website you are agreeing with all the conditions that are offered by us and if any modifications happen in the future or any conditions are removed then there will be no notice given to you in advance.  Wt has all the rights on this as the website and they can also make changes in the future or by removing some guidelines and the intervention of the third party can also occur in the future for providing any service and the user has to agree with the terms and conditions of that third party. Users have to read all the Tos and wt will also update the Tos with that service and then it will be provided to the user, if the user refuses to accept all the conditions then wt service will not be available for them.


              </Typography>
              <h2 className='fw-bold mt-5 fs-5 text-black'>Other party account information
              </h2>
              <Typography gutterBottom className=''>
                By registering with wt users allow the intervention of the other party and while registering the user should choose a secure and safe password because the user is completely responsible for the account password and all the activities that are held by him and if any unauthorized account activity happens then the user must contact wt urgently. Wt will not be responsible for any loss that happens due to the unauthorized activity happening in the account or because of the password.

              </Typography>
            </DialogContent>
          )
        }
        {
          title === 'Privacy Policy' && (
            <DialogContent dividers>
              <h3 className='fw-semibold fs-5' gutterBottom>
                Privacy policy page of wagnistrip.com for the payment process
              </h3>
              <Typography gutterBottom>
                <div className='fs-6 text-muted'>
                  Wagnistrip understands your concern regarding the privacy of your details and we protect our customers' identity information which you share with our website while booking any flights or in the middle of any search for any flight, being a trustworthy agency we protect all your details with us only.
                </div>
                <br />
              </Typography>
              <h2 className='fw-bold fs-5 text-black'>Cookies</h2>
              <Typography gutterBottom className=''>
                Some of our web pages use the term cookies which is for your betterment search only, they ask for your data information so that they can give you the top priority result that will match your search history, and the next time you visit our website the whole procedure can be done smoothly.

              </Typography>
              <Typography gutterBottom>
                Wagnistrip collects the basic data of information if you are logging your account booking a flight or searching then these are the mentioned details that are saved by us :

              </Typography>
              <ul style={{ listStyle:'square' }} className='ml-4 my-3'>
                <li>Name
                </li>
                <li>Phone  number</li>
                <li>Email id</li>
                <li>Address</li>
                <li>Bank account details</li>
                <li>Age</li>
              </ul>
              <Typography gutterBottom>
                Our website remains your confidential information to us only and all the procedures have been done by us to provide you the best results so that you can do your journey with peace and without any trouble.

              </Typography>
              <h2 className='fw-bold fs-5 text-black mt-4'>For reserving a facility with us :</h2>
              <Typography gutterBottom>
                You have to provide some personal details to us for any booking or traveling journey which are your primary details like your name, contact details, etc, and also for any hotel booking, flight booking, holiday packages, and any event management.

              </Typography>
              <h2 className='fw-bold text-black fs-5 mt-5'>To send special monthly offers:</h2>
              <Typography gutterBottom>
                The whole procedure of sending mail on your registered mails to get you to know about the special offers and discounts are which in the month right now so you can take benefit of those deals which can also save you some amount of money like the luck of the game or any contest


              </Typography>
              <h2 className='fw-bold text-black fs-5 mt-5'>Process of registration</h2>
              <Typography gutterBottom>
                This operation has been done by us so that when you re-visit our website you do not have to go through the whole procedure everything will be saved by us and it will be an easy process for you to do your research



              </Typography>
              <h2 className='fw-bold text-black fs-5 mt-5'>Why we need this whole procedure:
              </h2>
              <Typography gutterBottom>
                <ul style={{ listStyle:'square' }} className='ml-4 my-3'>
                  <li>To contact you for any good deals going in the month/year
                  </li>
                  <li>To improve our customer relations and services
                  </li>
                  <li>To complete the reservation procedure

                  </li>
                </ul>

              </Typography>
              <h2 className='fw-bold text-black fs-5 mt-5'>Why does wagnistrip conduct surveys?
              </h2>
              <Typography gutterBottom>
                Surveys are one of the things that tell us about the customer reviews for our platform, they tell us if we need to improve any of our facilities so that our customers will be satisfied with our platform, feedback plays a very important role here,  that is the reason behind of conduction of surveys very frequently and more often by us, it will let us know what are the imperfection we had and what are the qualities we had to work on and all the information or any details we get from survey kept to us only they are not shared to anyone.
              </Typography>
              <h2 className='fw-bold text-black fs-5 mt-5 '>Wagnistrip does not save any kind of credit card or any net banking details of you.

              </h2>
              <h2 className='fw-bold text-black fs-5 mt-3 '>Logging of your session data automatically


              </h2>
              <Typography>
                The data is saved with us for identification and problems that are faced by our users, we do this to get to know about the most researched problem thus we can change, and work on ourselves thus in the future you will not face any issues and also it never mentioned any particular user name.
                It comprises IP address, os, and many other things like that.
                <br />
                <br />

                Wagnistrip assures you the privacy of the confidential details that you have shared with us at any step, they are fully secure by us, and we are using new strategies to save your data which decreases the revealing the data of the customer

                Due to the changing technology, in the market for securing data, we may update this procedure also but for that, you have to visit our website occasionally.
                <br />
                <br />
                Thank you for visiting and using our platform wagnistrip.

              </Typography>
            </DialogContent>
          )
        }

      </BootstrapDialog>
    </React.Fragment>
  );
}
