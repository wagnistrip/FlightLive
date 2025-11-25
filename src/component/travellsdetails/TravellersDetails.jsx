import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import CustomizedDialogs from '../termandcondition/CustomizedDialogs';
import toast from 'react-hot-toast';
import { formatDataForAmadeus, formatDataForGalileo, initialPersonState } from '../../utils/airlineUtils';

const TravellersDetails = ({ noOfAdults = 1, noOfChildren = 0, noOfInfants = 0, onContinue, existingData, ReferenceNo, triptype, trips, apiType, apiType1 }) => {
  // console.log('trip: ', triptype,trips,existingData);
  const [adults, setAdults] = useState(Array(Math.min(noOfAdults, 1)).fill(initialPersonState));
  const [warningMessage, setWarningMessage] = useState('');
  const [children, setChildren] = useState(Array(Math.min(noOfChildren, 1)).fill(initialPersonState));
  const [childWarningMessage, setChildWarningMessage] = useState('');
  const [infants, setInfants] = useState(Array(Math.min(noOfInfants, 1)).fill(initialPersonState));
  const [infantWarningMessage, setInfantWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [flightstatus, setFlightFareStatus] = useState(trips);//this state is only used when flight is international
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [gstData, setGstData] = useState({
    companyName: "",
    gstNumber: "",
  });
  const [dobWarning, setDobWarning] = useState({});
  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const expiryYearOptions = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + i);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [countryCodevl, setCountryCodevl] = useState('IN');
  const [showGSTDetails, setShowGSTDetails] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const [expandedForms, setExpandedForms] = useState({
    adult: {},
    child: {},
    infant: {},
  });

  const handleToggle = (type, index) => {
    setExpandedForms(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: !prev[type][index]
      }
    }));
  };
  // console.log(phoneValue,"dkkldkldkld")

  const handleClickOpen = (title) => {
    setModalTitle(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFrequent = (type, index) => {
    setExpandedForms(prevState => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        [`frequent${index}`]: !prevState[type][`frequent${index}`],
      },
    }));
  };

  const handleAdultForm = () => {
    if (adults.length < noOfAdults) {
      setAdults([...adults, initialPersonState]);
      setWarningMessage('');
    } else {
      setWarningMessage(`You have already selected ${noOfAdults} ADULT. Remove before adding a new one.`);
    }
  };

  // Handle adding new child form
  const handleChildForm = () => {
    if (children.length < noOfChildren) {
      setChildren([...children, initialPersonState]);
      setChildWarningMessage('');
    } else {
      setChildWarningMessage(`You have already selected ${noOfChildren} CHILD. Remove before adding a new one.`);
    }
  };
  // console.log("gst number =>",gstData)
  // Handle adding new infant form
  const handleInfantForm = () => {
    if (infants.length < noOfInfants) {
      setInfants([...infants, initialPersonState]);
      setInfantWarningMessage('');
    } else {
      setInfantWarningMessage(`You have already selected ${noOfInfants} INFANT. Remove before adding a new one.`);
    }
  };

  const handleTitleChange = (e, index, type) => {
    if (type === 'adult') {
      const updatedAdults = adults.map((adult, i) => i === index ? { ...adult, title: e.target.value } : adult);
      setAdults(updatedAdults);
    } else if (type === 'child') {
      const updatedChilds = children.map((child, i) => i === index ? { ...child, title: e.target.value } : child);
      setChildren(updatedChilds);
    } else if (type === 'infant') {
      const updatedInfants = infants.map((infant, i) => i === index ? { ...infant, title: e.target.value } : infant);
      setInfants(updatedInfants);
    }
  };


  const handleFormChange = (e, index, type, field) => {
    let value = e.target.value;

    // Validation and formatting
    if (field === 'firstName' || field === 'lastName') {
      // Allow only letters and spaces
      value = value.replace(/[^a-zA-Z\s]/g, '');
      // Capitalize the first letter and lowercase the rest
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    // Function to update the list based on the type (adult, child, infant)
    const updateField = (list, setList) => {
      const updatedList = list.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setList(updatedList);
    };

    // Determine the type and update the corresponding state
    if (type === 'adult') updateField(adults, setAdults);
    else if (type === 'child') updateField(children, setChildren);
    else if (type === 'infant') updateField(infants, setInfants);
  };

  const handleFirstNameChange = (e, index, type) => {
    handleFormChange(e, index, type, 'firstName');
  };

  const handleLastNameChange = (e, index, type) => {
    handleFormChange(e, index, type, 'lastName');
  };

  const handleMealPreferenceChange = (e, index, type) => {
    handleFormChange(e, index, type, 'MealType');
  };

  const handleFrequentFlyerChange = (e, index, type) => {
    handleFormChange(e, index, type, 'FrequentFlyerAirline');
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);

    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        // console.log(phoneNumber.countryCallingCode, phoneNumber.nationalNumber)
        // console.log(phoneNumber.countryCallingCode, phoneNumber.nationalNumber, phoneNumber.country);
        setCountryCode(phoneNumber.countryCallingCode); // Country dialing code
        setLocalNumber(phoneNumber.nationalNumber); // Phone number without country code
        setCountryCodevl(phoneNumber.country)
      }
    } else {
      setCountryCode('');
      setLocalNumber('');
      setCountryCodevl('')
    }
  };

  const handleEmailChange = (e) => {
    // const inputValue = e.target.value;
    // setEmail(inputValue);
    // // Basic email validation using a regular expression
    // setIsValidEmail(/^\S+@\S+\.\S+$/.test(inputValue));

    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      setIsValidEmail(/^\S+@\S+\.\S+$/.test(value)); // Email validation
    } else {
      setGstData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(), // Convert GST data to uppercase
      }));
    }
  };


  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);


  const handleDayChange = (e) => {
    const selectedDay = e.target.value;
    setDay(selectedDay);
    updateInfantDOB(selectedDay, month, year, apiType);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    updateInfantDOB(day, selectedMonth, year, apiType);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    updateInfantDOB(day, month, selectedYear, apiType);
  };

  const isAllFieldsValid = (list, type) => {
    return list.every(item =>
      item.title &&
      item.firstName && item.firstName.length >= 1 &&
      item.lastName && item.lastName.length >= 1 &&
      ((type === 'adult') ? true : !!item.dateOfBirth )
    );

  }

  const updateInfantDOB = (day, month, year, apiType) => {
    if (day && month && year) {
      const dob = new Date(year, month - 1, day);
      const today = new Date();
      const ageInMilliseconds = today - dob;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if (ageInYears > 2) {
        setErrorMessage('Infant\'s date of birth must be under 2 years.');
      } else {
        setErrorMessage('');
        let dobFormatted = "";

        if (apiType === 'Amadeus') {
          dobFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (apiType === "Galileo") {
          dobFormatted = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }

        const updatedInfants = infants.map((infant, index) => {
          if (index === infants.length - 1) {
            return { ...infant, dateOfBirth: dobFormatted };
          }
          return infant;
        });
        setInfants(updatedInfants);
      }
    }
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Toggle checkbox state
  };

  const handleDOBChange = (e, index, type, field) => {
    const { value } = e.target;
    let updatedPersons;
    let setFunction;

    switch (type) {
      case 'adult':
        updatedPersons = [...adults];
        setFunction = setAdults;
        break;
      case 'child':
        updatedPersons = [...children];
        setFunction = setChildren;
        break;
      case 'infant':
        updatedPersons = [...infants];
        setFunction = setInfants;
        break;
      default:
        return;
    }

    updatedPersons[index] = { ...updatedPersons[index], [field]: value };

    const dobDay = field === 'dobDay' ? value : updatedPersons[index].dobDay;
    const dobMonth = field === 'dobMonth' ? value : updatedPersons[index].dobMonth;
    const dobYear = field === 'dobYear' ? value : updatedPersons[index].dobYear;

    if (dobDay && dobMonth && dobYear) {
      const formattedDay = String(dobDay).padStart(2, '0');
      const formattedMonth = String(dobMonth).padStart(2, '0');
      const formattedYear = String(dobYear).padStart(4, '0'); // Ensures full year

      // Format date for the appropriate API
      if (apiType === 'Galileo') {
        updatedPersons[index].dateOfBirth = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      } else if (apiType === 'Amadeus') {
        updatedPersons[index].dateOfBirth = `${formattedYear}-${formattedMonth}-${formattedDay}`;
      }

      // Calculate age
      const dob = new Date(dobYear, dobMonth - 1, dobDay);
      let age = new Date().getFullYear() - dob.getFullYear();  // Change "const" to "let"
      const monthDiff = new Date().getMonth() - dob.getMonth();
      const dayDiff = new Date().getDate() - dob.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;  // Modify the "let" variable
      }

      // Set warning for adults if age is less than 12
      if (type === 'adult' && age < 12) {
        setDobWarning((prev) => ({
          ...prev,
          [index]: "For an adult, age must be at least 12 years.",
        }));
      } else if (type === 'child' && age >= 12) {
        // Set warning for children if age is 12 or above
        setDobWarning((prev) => ({
          ...prev,
          [index]: "For a child, age must be less than 12 years.",
        }));
      } else {
        // Clear warning if age meets the criteria
        setDobWarning((prev) => ({
          ...prev,
          [index]: "",
        }));
      }
    }

    setFunction(updatedPersons);
  };

  const validatePassport = (passportNumber) => {
    const passportRegex = /^[A-Za-z0-9]{6,9}$/; // Example regex for passport number validation
    return passportRegex.test(passportNumber);
  };

  const handlePassportChange = (e, index, type, field) => {
    let { value } = e.target;
    value = value.toUpperCase();
    const updateField = (list, setList) => {
      const updatedList = list.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value, passportError: '' };

          if (field === 'passportNumber' && !validatePassport(value)) {
            updatedItem.passportError = 'Invalid passport number format';
          }

          const passportExpiryDay = field === 'passportExpiryDay' ? value : updatedItem.passportExpiryDay;
          const passportExpiryMonth = field === 'passportExpiryMonth' ? value : updatedItem.passportExpiryMonth;
          const passportExpiryYear = field === 'passportExpiryYear' ? value : updatedItem.passportExpiryYear;

          if (passportExpiryDay && passportExpiryMonth && passportExpiryYear) {
            updatedItem.expirydate = `${String(passportExpiryDay).padStart(2, '0')}/${String(passportExpiryMonth).padStart(2, '0')}/${passportExpiryYear}`;
          }

          return updatedItem;
        }
        return item;
      });
      // console.log(updatedList);
      setList(updatedList);
    };

    if (type === 'adult') updateField(adults, setAdults);
    else if (type === 'child') updateField(children, setChildren);
    else if (type === 'infant') updateField(infants, setInfants);
  };

  const handleContinueClick = () => {
    let valid = true;

    if (adults.length !== parseInt(noOfAdults) || !isAllFieldsValid(adults, 'adult')) {
      // console.log(adults.length);
      toast.error('Please ensure all adult fields are filled correctly and match the required number.');
      valid = false;
    } else {
      setWarningMessage('');
    }

    if (children.length !== parseInt(noOfChildren) || !isAllFieldsValid(children, 'child')) {
      toast.error('Please ensure all child fields are filled correctly and match the required number.');
      valid = false;
    } else {
      setChildWarningMessage('');
    }

    if (infants.length !== parseInt(noOfInfants) || !isAllFieldsValid(infants, 'infant')) {
      toast.error('Please ensure all infant fields are filled correctly and match the required number.');
      valid = false;
    } else {
      setInfantWarningMessage('');
    }
    // Validate checkbox
    if (!checkboxChecked) {
      valid = false;
    }

    // Validate email
    if (!isValidEmail || !email) {
      setIsValidEmail(false);
      valid = false;
    }

    // Validate phone number
    if (!phoneValue) {
      valid = false;
    }

    if (flightstatus === 'I') {
      // Check each passenger's passport details
      for (let i = 0; i < adults.length; i++) {
        const adult = adults[i];
        if (flightstatus === 'I' && (!adult.passportNumber || !adult.dateOfBirth || !adult.passportExpiryDay || !adult.passportExpiryMonth || !adult.passportExpiryYear)) {
          // setWarningMessage(`Passport details missing for adult ${i + 1}.`);
          toast.error(`Passport details missing for adult ${i + 1}.`);
          valid = false;
          break;
        } else {
          setWarningMessage('');
        }
      }

      // Validate children
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (flightstatus === 'I' && (!child.passportNumber || !child.passportExpiryDay || !child.passportExpiryMonth || !child.passportExpiryYear)) {
          toast.error(`Passport details missing for child ${i + 1}.`);
          valid = false;
          break;
        } else {
          setChildWarningMessage('');
        }
      }

      // Validate infants
      for (let i = 0; i < infants.length; i++) {
        const infant = infants[i];
        if (flightstatus === 'I' && (!infant.passportNumber || !infant.passportExpiryDay || !infant.passportExpiryMonth || !infant.passportExpiryYear)) {
          toast.error(`Passport details missing for infant ${i + 1}.`);
          valid = false;
          break;
        } else {
          setInfantWarningMessage('');
        }
      }
    }

    // If any validation fails, prevent form submission
    if (!valid) {
      return;
    }


    const getGenderFromTitle = (title) => {
      if (title === 'Mr' || title === 'Master') {
        return 'M';
      } else if (title === 'Ms' || title === 'Mrs' || title === 'Miss') {
        return 'F';
      } else {
        return '';
      }
    };

    let passengers
    let passengers1;

    if (apiType && apiType1) {
      if (apiType === 'Galileo' && apiType1 === 'Amadeus') {
        passengers = formatDataForGalileo(adults, children, infants, getGenderFromTitle);
        passengers1 = formatDataForAmadeus(adults, children, infants, getGenderFromTitle, email, phoneValue, countryCode, localNumber);
      }
      else if (apiType === 'Amadeus' && apiType1 === 'Galileo') {
        passengers = formatDataForAmadeus(adults, children, infants, getGenderFromTitle, email, phoneValue, countryCode, localNumber);
        passengers1 = formatDataForGalileo(adults, children, infants, getGenderFromTitle);
      }
      else if (apiType === 'Galileo' && apiType === 'Galileo') {
        passengers = formatDataForGalileo(adults, children, infants, getGenderFromTitle, countryCode, countryCodevl);
        passengers1 = formatDataForGalileo(adults, children, infants, getGenderFromTitle, countryCode, countryCodevl);
      }
      else if (apiType === 'Amadeus' && apiType === 'Amadeus') {
        passengers = formatDataForAmadeus(adults, children, infants, getGenderFromTitle, email, phoneValue, countryCode, localNumber);
        passengers1 = formatDataForAmadeus(adults, children, infants, getGenderFromTitle, email, phoneValue, countryCode, localNumber);
      }
    }
    else {
      if (apiType === 'Galileo') {
        passengers = formatDataForGalileo(adults, children, infants, getGenderFromTitle, countryCode, countryCodevl);
      } else if (apiType === 'Amadeus') {
        passengers = formatDataForAmadeus(adults, children, infants, getGenderFromTitle, email, countryCode, localNumber, countryCodevl);
      }
    }

    // onContinue(email, localNumber, passengers, sessionID, KeyId, ReferenceNo, triptype, noOfAdults, noOfChildren, noOfInfants,apiType);

    // console.log("passanger details test : ", passengers);
    onContinue(email, localNumber, passengers, trips, triptype, noOfAdults, noOfChildren, noOfInfants, apiType, countryCodevl, gstData);
    // onContinue1(email, localNumber, passengers1, triptype, noOfAdults, noOfChildren, noOfInfants, apiType1);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the current date is before the birth date in the year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleData = (data) => {
    const adults = [];
    const children = [];
    const infants = [];

    data.forEach(traveler => {
      const age = calculateAge(traveler.dateOfBirth);

      const travelerData = {
        title: traveler.gender === "M" ? (age < 12 ? "Master" : "Mr") : (age < 12 ? "Miss" : "Mrs"),
        firstName: traveler.name.firstName,
        lastName: traveler.name.lastName,
        gender: traveler.gender,
        dateOfBirth: traveler.dateOfBirth,
        MealType: '', // Adjust based on your application
        FrequentFlyerAirline: '', // Adjust based on your application
        nameFieldVisible: true,
        icon: true,
        seatListDetails: [], // Adjust based on your application
        confirmSeat: [], // Adjust based on your application
        passportNumber: traveler.documents[0].number || '',
        passportExpiryDay: traveler.documents[0].issuanceDate ? new Date(traveler.documents[0].issuanceDate).getDate().toString().padStart(2, '0') : '',
        passportExpiryMonth: traveler.documents[0].issuanceDate ? (new Date(traveler.documents[0].issuanceDate).getMonth() + 1).toString().padStart(2, '0') : '',
        passportExpiryYear: traveler.documents[0].issuanceDate ? new Date(traveler.documents[0].issuanceDate).getFullYear().toString() : ''
      };

      if (age < 2) {
        infants.push(travelerData);
      } else if (age >= 2 && age < 12) {
        children.push(travelerData);
      } else {
        adults.push(travelerData);
      }
    });

    setAdults(adults);
    setChildren(children);
    setInfants(infants);
  };

  const setFormData = (data, apiType) => {
    if (apiType === 'Galileo') {
      setEmail(data.CustomerInfo.Email || '');
      const phoneWithCountryCode = `+${data.CustomerInfo.PassengerDetails[0].IssuingCountry || ''}${data.CustomerInfo.Mobile || ''}`;
      setPhoneValue(phoneWithCountryCode || '');
      setCountryCode(data.CustomerInfo.PassengerDetails[0].IssuingCountry || '')
      setLocalNumber(data.CustomerInfo.Mobile || '');
      setCountryCodevl(data.CustomerInfo.CountryName || '');
      if (data?.GstDetails) {
        setGstData({
          companyName: data.GstDetails.companyName || '',
          gstNumber: data.GstDetails.gstNumber || '',
        });
      }
      const adultsData = data.CustomerInfo.PassengerDetails.filter(pax => pax.PaxType === 'ADT');
      const childrenData = data.CustomerInfo.PassengerDetails.filter(pax => pax.PaxType === 'CHD');
      const infantsData = data.CustomerInfo.PassengerDetails.filter(pax => pax.PaxType === 'INF');
      const [expiryMonth, expiryDay, expiryYear] = new Date(data.CustomerInfo.ExpiryDate).toLocaleDateString("en-GB").split('/');

      setAdults(adultsData.map(adult => ({
        title: adult.Title,
        firstName: adult.FirstName,
        lastName: adult.LastName,
        gender: adult.Gender,
        dateOfBirth: adult.DateOfBirth || '',
        MealType: adult.MealType,
        FrequentFlyerAirline: adult.FrequentFlyerAirline,
        nameFieldVisible: true,
        icon: true,
        seatListDetails: adult.SeatListDetails || [],
        confirmSeat: adult.ConfirmSeat || [],
        passportNumber: adult.PassportNumber || '',
        IssuingCountry: adult.IssuingCountry || '',
        passportExpiryDay: expiryDay || '',
        passportExpiryMonth: expiryMonth || '',
        passportExpiryYear: expiryYear || ''
      })));

      setChildren(childrenData.map(child => ({
        title: child.Title,
        firstName: child.FirstName,
        lastName: child.LastName,
        gender: child.Gender,
        dateOfBirth: child.DateOfBirth || '',
        MealType: child.MealType,
        FrequentFlyerAirline: child.FrequentFlyerAirline,
        nameFieldVisible: true,
        icon: true,
        seatListDetails: child.SeatListDetails || [],
        confirmSeat: child.ConfirmSeat || [],
        passportNumber: child.PassportNumber,
        IssuingCountry: child.IssuingCountry || '',
        passportExpiryDay: new Date(child.PassportExpiry).getDate().toString().padStart(2, '0'),
        passportExpiryMonth: (new Date(child.PassportExpiry).getMonth() + 1).toString().padStart(2, '0'),
        passportExpiryYear: new Date(child.PassportExpiry).getFullYear().toString()
      })));

      setInfants(infantsData.map(infant => ({
        title: infant.Title,
        firstName: infant.FirstName,
        lastName: infant.LastName,
        gender: infant.Gender,
        dateOfBirth: infant.DateOfBirth || '',
        MealType: infant.MealType,
        FrequentFlyerAirline: infant.FrequentFlyerAirline,
        nameFieldVisible: true,
        icon: true,
        seatListDetails: infant.SeatListDetails || [],
        confirmSeat: infant.ConfirmSeat || [],
        passportNumber: infant.PassportNumber || '',
        IssuingCountry: infant.IssuingCountry || '',
        passportExpiryDay: new Date(infant.PassportExpiry).getDate().toString().padStart(2, '0'),
        passportExpiryMonth: (new Date(infant.PassportExpiry).getMonth() + 1).toString().padStart(2, '0'),
        passportExpiryYear: new Date(infant.PassportExpiry).getFullYear().toString()
      })));
    } else if (apiType === 'Amadeus') {

      console.log("edit ==> ", data);
      const traveler = data[0];
      setEmail(data.CustomerInfo.Email || '');
      const phoneValue = `+${data?.CustomerInfo?.PassengerDetails[0]?.contact?.phones[0]?.countryCallingCode || ''}${data.CustomerInfo.Mobile || ''}`;
      handlePhoneChange(phoneValue);
      handleData(data.CustomerInfo.PassengerDetails);
    }
  };

  useEffect(() => {
    if (existingData) {
      // console.log("edit data =>", existingData);
      setFormData(existingData, apiType);
    }
  }, [existingData]);

  return (
    <>
      <div className="col-lg-12 p-0 bg-white">
        <div className=" rounded mb-4" style={{ padding: 0 }}>
          <div className='p-3 text-light' style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", background: '#9b4bfd3d', color: '#1e1e1e' }}>
            <div className="row text-black fw-medium">
              <div className="col-12 col-md-6 col-lg-5 mb-2 mb-md-0 d-flex gap-2">
                <i className="fa-solid fa-user-group mt-1"></i> <span className='d-none d-lg-flex'>Travellers Details</span> <span className='d-flex d-lg-none' style={{ fontSize: "10px" }}>Travellers Details</span>
              </div>
              <div className="col-12 col-md-6 col-lg-7 d-flex gap-2">
                <i className="fa-solid fa-id-card mt-1"></i> <span className='d-none d-lg-block'> Name should be same as in Government ID proof</span> <span className='d-block d-lg-none ' style={{ fontSize: "10px" }}> Name should be same as in Government ID proof</span>
              </div>
            </div>
          </div>
          <div className='fw-bold mb-2 fs-5 p-2'>ADULT</div>
          <div> {warningMessage && <div className=" text-danger warning-message pl-4">{warningMessage}</div>} </div>
          {adults.map((adult, index) => (
            <div key={index} className="mb-3">

              <div className="accordion" id="accordionExample">

                <div className="accordion-item" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                  <h2 className="accordion-header" id={`heading-adult-${index}`}>
                    <div
                      className={`accordion-button collapsed`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-adult-${index}`}
                      aria-expanded="true"
                      aria-controls={`collapse-adult-${index}`}
                    >
                      <div className="form-check">
                        <input style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          width: '16px',
                          height: '16px',
                          border: '2px solid #000',
                          borderRadius: '2px',
                          position: 'relative',
                          cursor: 'pointer',
                          marginTop: '11px'
                        }} className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-adult-${index}`} />
                        <label className="form-check-label fw-bold fs-4" htmlFor="flexCheckDefault">
                          {adult.title || adult.firstName || adult.lastName ? `${adult.title} ${adult.firstName} ${adult.lastName}` : `Adult${index + 1}`}
                        </label>
                      </div>
                    </div>
                  </h2>
                  <div id={`collapse-adult-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-adult-${index}`} data-bs-parent="#accordionExample1">
                    <div className="accordion-body">


                      {adult.nameFieldVisible && (
                        <form>
                          <div className="row mb-3">
                            <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                              <label style={{ fontSize: '14px', color: 'black' }} htmlFor="selectMenu" className="form-label fw-bold">Title <span className="text-danger">*</span> </label>
                              <select htmlFor="selectMenu" className="form-control form-select " aria-label="Default select example" value={adult.title} onChange={(e) => { handleTitleChange(e, index, 'adult'); }}>
                                <option value="">Title</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            </div>
                            <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                              <label style={{ fontSize: '14px', color: 'black' }} className="form-label fw-bold" htmlFor={`firstName-${index}`}>(First Name & (Middle name, if any))<span className="text-danger">*</span></label>
                              <input type="text"
                                placeholder="Enter First Name"
                                id={`firstName-${index}`}
                                value={adult.firstName}
                                onChange={(e) => { handleFirstNameChange(e, index, 'adult'); }} className="form-control" />
                            </div>
                            <div className="col-lg-4 col-12">
                              <label style={{ fontSize: '14px', color: 'black' }} htmlFor="lastName" className="form-label fw-bold">Last Name <span className="text-danger">*</span> </label>
                              <input type="text"
                                placeholder="Enter Last Name"
                                id={`lastName-${index}`}
                                value={adult.lastName}
                                onChange={(e) => { handleLastNameChange(e, index, 'adult'); }} className="form-control" />
                            </div>
                          </div>





                          {flightstatus === 'I' && (
                            <div className="row mb-3">
                              <div className="d-flex align-items-center mb-3 text-primary fw-light">
                                <i className={`fa-solid ${expandedForms.adult[index] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                                <div style={{ cursor: 'pointer' }} onClick={() => handleToggle('adult', index)} className='fs-6 fw-medium'> Passport Information <span className='text-danger'>*</span></div>
                              </div>

                              {expandedForms.adult[index] && (
                                <>
                                  <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                    <label style={{ fontSize: '14px', color: 'black' }} htmlFor="dob" className="form-label fw-bold">Date of Birth <span className="text-danger">*</span></label>
                                    <div className="d-flex align-items-center">
                                      <select id="day" className="form-control form-select" onChange={(e) => handleDOBChange(e, index, 'adult', 'dobDay')} value={adult.dobDay}>
                                        <option>Day</option>
                                        {[...Array(31).keys()].map(day => (
                                          <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                                        ))}
                                      </select>
                                      <select id="month" className="form-control form-select" onChange={(e) => handleDOBChange(e, index, 'adult', 'dobMonth')} value={adult.dobMonth}>
                                        <option>Month</option>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                          <option key={index + 1} value={index + 1}>{month}</option>
                                        ))}
                                      </select>
                                      <select id="year" className="form-control form-select" onChange={(e) => handleDOBChange(e, index, 'adult', 'dobYear')} value={adult.dobYear}>
                                        <option>Year</option>
                                        {birthYearOptions.map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                    <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportNumber" className="form-label fw-bold">Passport Number <span className="text-danger">*</span> </label>
                                    <input type="text" id="passportNumber" className="form-control" placeholder="Your Passport No:" value={adult.passportNumber}
                                      onChange={(e) => handlePassportChange(e, index, 'adult', 'passportNumber')} />
                                    {adult.passportError && <small className="text-danger">{adult.passportError}</small>}
                                  </div>
                                  <div className="col-lg-4 col-12">
                                    <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportExpiry" className="form-label fw-bold">Passport Expiry <span className="text-danger">*</span> </label>
                                    <div className="d-flex align-items-center">
                                      <select id="expiryDay" value={adult.passportExpiryDay}
                                        onChange={(e) => handlePassportChange(e, index, 'adult', 'passportExpiryDay')} className="form-control form-select">
                                        <option>Day</option>
                                        {[...Array(31).keys()].map(day => (
                                          <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                                        ))}
                                      </select>
                                      <select id="expiryMonth" value={adult.passportExpiryMonth}
                                        onChange={(e) => handlePassportChange(e, index, 'adult', 'passportExpiryMonth')} className="form-control form-select">
                                        <option>Month</option>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                          <option key={index + 1} value={index + 1}>{String(index + 1).padStart(2, '0')} - {month}</option>
                                        ))}
                                      </select>
                                      <select id="expiryYear" value={adult.passportExpiryYear}
                                        onChange={(e) => handlePassportChange(e, index, 'adult', 'passportExpiryYear')} className="form-control form-select">
                                        <option>Year</option>
                                        {expiryYearOptions.map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                </>
                              )}
                            </div>
                          )}

                          <div className="row mb-3">
                            <div className="d-flex align-items-center mb-3 text-primary fw-light" style={{ cursor: 'pointer' }}>
                              <i className={`fa-solid ${expandedForms.adult[`frequent${index}`] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                              <div onClick={() => handleFrequent('adult', index)} className='fw-semibold text-muted fs-6'>Frequent flyer number and Meal preference <span className='text-danger'>(optional)</span></div>
                            </div>
                            {/* {expandedForms.adult[`frequent${index}`] && ( */}
                            <div className={`gst-details ${expandedForms.adult[`frequent${index}`] ? 'show' : ''}`}>
                              <div className="row">
                                <div className="col-lg-4 col-12">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor={`frequentFlyer-${index}`} className="form-label fw-bold">Frequent flyer no.</label>
                                  <input type="text" id={`frequentFlyer-${index}`} value={adult.FrequentFlyerAirline} onChange={(e) => handleFrequentFlyerChange(e, index, 'adult')} className="form-control" />
                                </div>
                                <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor="airline" className="form-label fw-bold">Airline</label>
                                  <input type="text" id="airline" className="form-control" placeholder="Enter Airline Name" />
                                </div>
                                <div className="col-lg-4 d-none col-12">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor={`mealPreference-${index}`} className="form-label fw-bold">Meal Preference</label>
                                  <select id={`mealPreference-${index}`} className="form-control form-select" value={adult.MealType} onChange={(e) => handleMealPreferenceChange(e, index, 'adult')}>
                                    <option value="">Select Meal Preference</option>
                                    <option value="Vegetarian Hindu Meal">Vegetarian Hindu Meal</option>
                                    <option value="Baby Meal">Baby Meal</option>
                                    <option value="Hindu Non Vegetarian Meal">Hindu Non Vegetarian Meal</option>
                                    <option value="Kosher Meal">Kosher Meal</option>
                                    <option value="Moslem Meal">Moslem Meal</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            {/* )} */}
                          </div>



                        </form>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="info-box p-3 border bg-light text-dark" style={{ borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
                <div className='fw-bold fs-8'>Add-ons (Optional)</div>
                <div className='fw-normal fs-7 text-muted'>Pre-booked meals, Seats and Baggage are 30% cheaper than on-board price.</div>
              </div>

            </div>

          ))}
          <button onClick={handleAdultForm} type="button" className={`btn ${adults.length >= noOfAdults ? 'disabled' : ''} text-primary fw-bold fs-5 btn-light`}>+ Add Adult</button>
        </div>

        {noOfChildren > 0 && (

          <div>
            <div className='children-div'>
              <div className="adult">
                <div className='fw-bold mb-2 fs-5 p-2'>CHILD</div>
              </div>
              {childWarningMessage && <div className="text-danger warning-message pl-4">{childWarningMessage}</div>}
              {children.map((child, index) => (
                <div key={index} className="mb-3">

                  <div className="accordion" id="accordionExample">

                    <div className="accordion-item" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>

                      <h2 className="accordion-header" id={`heading-child-${index}`}>
                        <div
                          className={`accordion-button py-3 collapsed`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-child-${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse-child-${index}`}
                        >
                          <div className="form-check">
                            <input style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              width: '16px',
                              height: '16px',
                              border: '2px solid #000',
                              borderRadius: '2px',
                              position: 'relative',
                              cursor: 'pointer',
                              marginTop: '11px'
                            }} className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-child-${index}`} />
                            <label className="form-check-label fs-4 fw-bold" htmlFor="flexCheckDefault">
                              {child.title || child.firstName || child.lastName ? `${child.title} ${child.firstName} ${child.lastName}` : `Child${index + 1}`}
                              <div style={{ fontSize: '10px' }} className='fw-bold text-black' htmlFor="">Dob: <span style={{ fontSize: '10px' }} className='text-muted'>{child.dateOfBirth ? child.dateOfBirth : ''}</span></div>

                            </label>
                          </div>
                        </div>
                      </h2>

                      <div id={`collapse-child-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-child-${index}`} data-bs-parent="#accordionExample">
                        <div className="accordion-body">


                          {child.nameFieldVisible && (
                            <form>
                              <div className="row mb-3">
                                <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor="selectMenu" className="form-label fw-bold">Title <span className="text-danger">*</span> </label>

                                  <select htmlFor="selectMenu" className="form-control form-select" aria-label="Default select example" value={child.title} onChange={(e) => handleTitleChange(e, index, 'child')}>
                                    <option value="">Title</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Master">Master</option>
                                  </select>
                                </div>
                                <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                  <label style={{ fontSize: '14px', color: 'black' }} className="form-label fw-bold" htmlFor={`firstName-${index}`}>(First Name & (Middle name, if any))<span className="text-danger">*</span></label>
                                  <input type="text"
                                    placeholder="Enter First Name"
                                    id={`firstName-${index}`}
                                    value={child.firstName}
                                    onChange={(e) => { handleFirstNameChange(e, index, 'child'); }} className="form-control" />
                                </div>
                                <div className="col-lg-4 col-12">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor="lastName" className="form-label fw-bold">Last Name <span className="text-danger">*</span> </label>
                                  <input type="text"
                                    placeholder="Enter Last Name"
                                    id={`lastName-${index}`}
                                    value={child.lastName}
                                    onChange={(e) => { handleLastNameChange(e, index, 'child'); }} className="form-control" />
                                </div>
                              </div>


                              <div className="col-lg-12 col-12 p-0 mb-3 mb-lg-4">
                                <label style={{ fontSize: '14px', color: 'black' }} htmlFor="dob" className="form-label fw-bold">Date of Birth <span className="text-danger">*</span></label>
                                <div className="d-flex align-items-center gap-2 rounded">
                                  <select id="day" onChange={(e) => handleDOBChange(e, index, 'child', 'dobDay')} value={child.dobDay || ''} className="form-control form-select" >
                                    <option value="" disabled>Day</option>
                                    {[...Array(31).keys()].map(day => (
                                      <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                                    ))}
                                  </select>
                                  <select id="month" onChange={(e) => handleDOBChange(e, index, 'child', 'dobMonth')} value={child.dobMonth || ''} className="form-control form-select">
                                    <option value="" disabled>Month</option>
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                      <option key={index + 1} value={index + 1}>{month}</option>
                                    ))}
                                  </select>
                                  <select id="year" onChange={(e) => handleDOBChange(e, index, 'child', 'dobYear')} value={child.dobYear || ''} className="form-control form-select">
                                    <option value="" disabled>Year</option>
                                    {birthYearOptions.map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>


                                {dobWarning[index] && <p className="text-danger" style={{ fontSize: '14px', color: 'black' }}>{dobWarning[index]}</p>}
                              </div>




                              {
                                flightstatus === 'I' && <div className="row mb-3">
                                  <div className="d-flex align-items-center mb-3 text-primary fw-light" style={{ cursor: 'pointer' }}>
                                    <i className={`fa-solid ${expandedForms.child[index] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                                    <div onClick={() => handleToggle('child', index)} className='fs-6 fw-medium'> Passport Information</div>
                                  </div>

                                  {expandedForms.child[index] && (
                                    <>

                                      <div className="col-lg-6 col-12 mb-3 mb-lg-0">
                                        <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportNumber" className="form-label fw-bold">Passport Number <span className="text-danger">*</span> </label>
                                        <input type="text" id="passportNumber" onChange={(e) => handlePassportChange(e, index, 'child', 'passportNumber')} className="form-control" value={children[index].passportNumber} placeholder="Your Passport No:" />
                                        {child.passportError && <small className="text-danger">{child.passportError}</small>}
                                      </div>
                                      <div className="col-lg-6 col-12">
                                        <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportExpiry" className="form-label fw-bold">Passport Expiry <span className="text-danger">*</span> </label>
                                        <div className="d-flex align-items-center">
                                          <select id="expiryDay" value={children[index].passportExpiryDay} className="form-control form-select" onChange={(e) => handlePassportChange(e, index, 'child', 'passportExpiryDay')}>
                                            <option selected>Day</option>
                                            {[...Array(31).keys()].map(day => (
                                              <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                                            ))}
                                          </select>
                                          <select id="expiryMonth" value={children[index].passportExpiryMonth} className="form-control form-select" onChange={(e) => handlePassportChange(e, index, 'child', 'passportExpiryMonth')}>
                                            <option selected>Month</option>
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                              <option key={index + 1} value={index + 1}>{month}</option>
                                            ))}
                                          </select>
                                          <select id="expiryYear" value={children[index].passportExpiryYear} className="form-control form-select" onChange={(e) => handlePassportChange(e, index, 'child', 'passportExpiryYear')}>
                                            <option selected>Year</option>
                                            {expiryYearOptions.map(year => (
                                              <option key={year} value={year}>{year}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              }

                              <div className="row mb-3">
                                <div className="d-flex align-items-center mb-3 text-primary fw-light" style={{ cursor: 'pointer' }}>

                                  <i className={`fa-solid ${expandedForms.child[`frequent${index}`] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                                  <div onClick={() => handleFrequent('child', index)} className='fw-semibold text-muted fs-6'>Frequent flyer number and Meal preference <span className='text-danger'>(optional)</span></div>
                                </div>
                                {/* {expandedForms.child[`frequent${index}`] && ( */}
                                <div className={`gst-details ${expandedForms.child[`frequent${index}`] ? 'show' : ''}`}>
                                  <div className="row">
                                    <div className="col-lg-4 col-12">
                                      <label style={{ fontSize: '14px', color: 'black' }} htmlFor={`frequentFlyer-${index}`} className="form-label fw-bold">Frequent flyer no.</label>
                                      <input type="text" id={`frequentFlyer-${index}`} value={child.FrequentFlyerAirline} onChange={(e) => handleFrequentFlyerChange(e, index, 'child')} className="form-control" />
                                    </div>
                                    <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                      <label style={{ fontSize: '14px', color: 'black' }} htmlFor="airline" className="form-label fw-bold">Airline</label>
                                      <input type="text" id="airline" className="form-control" placeholder="Enter Airline Name" />
                                    </div>
                                    <div className="col-lg-4 d-none col-12">
                                      <label style={{ fontSize: '14px', color: 'black' }} htmlFor={`mealPreference-${index}`} className="form-label fw-bold">Meal Preference</label>
                                      <select id={`mealPreference-${index}`} className="form-control form-select" value={child.MealType} onChange={(e) => handleMealPreferenceChange(e, index, 'child')}>
                                        <option value="">Select Meal Preference</option>
                                        <option value="Vegetarian Hindu Meal">Vegetarian Hindu Meal</option>
                                        <option value="Baby Meal">Baby Meal</option>
                                        <option value="Hindu Non Vegetarian Meal">Hindu Non Vegetarian Meal</option>
                                        <option value="Kosher Meal">Kosher Meal</option>
                                        <option value="Moslem Meal">Moslem Meal</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                {/* // )} */}
                              </div>



                            </form>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="info-box p-3 border bg-light text-dark" style={{ borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
                    <div className='fw-bold fs-8'>Add-ons (Optional)</div>
                    <div className='fw-normal fs-7 text-muted'>Pre-booked meals, Seats and Baggage are 30% cheaper than on-board price.</div>
                  </div>

                </div>

              ))}
            </div>
            <div className='bottom-icon'>
              <button onClick={handleChildForm} type="button" className={`btn ${children.length >= noOfChildren ? 'disabled' : ''} text-primary btn-light fw-bold fs-5`}>+ Add Child</button>
            </div>
          </div>
        )}
        {noOfInfants > 0 && (

          <div>
            <div className='infant-div'>
              <div className="adult">
                <div className='fw-bold mb-2 fs-5 p-2'>INFANT</div>
              </div>
              {infantWarningMessage && <div className="text-danger warning-message pl-4">{infantWarningMessage}</div>}
              {infants.map((infant, index) => (
                <div key={index} className="mb-3">

                  <div className="accordion" id="accordionExample">

                    <div className="accordion-item" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                      <h2 className="accordion-header p-0" id={`heading-infant-${index}`}>
                        <div
                          className={`accordion-button p-3 collapsed`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-infant-${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse-infant-${index}`}
                        >
                          <div className="form-check">
                            <input style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              width: '16px',
                              height: '16px',
                              border: '2px solid #000',
                              borderRadius: '2px',
                              position: 'relative',
                              cursor: 'pointer',
                              marginTop: '11px'
                            }} className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-infant-${index}`} />
                            <label className="form-check-label fs-4 fw-bold" htmlFor="flexCheckDefault">
                              {infant.title || infant.firstName || infant.lastName ? `${infant.title} ${infant.firstName} ${infant.lastName}` : `Infant${index + 1}`}
                            </label>
                            <div style={{ fontSize: '10px' }} className='fw-bold text-black' htmlFor="">Dob: <span style={{ fontSize: '10px' }} className='text-muted'>{infant.dateOfBirth ? infant.dateOfBirth : ''}</span></div>
                          </div>
                        </div>
                      </h2>
                      <div id={`collapse-infant-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-infant-${index}`} data-bs-parent="#accordionExample">
                        <div className="accordion-body">


                          {infant.nameFieldVisible && (
                            <form>
                              <div className="row mb-1">
                                <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor="selectMenu" className="form-label fw-bold">Title <span className="text-danger">*</span> </label>

                                  <select htmlFor="selectMenu" className="form-control form-select" aria-label="Default select example" value={infant.title} onChange={(e) => handleTitleChange(e, index, 'infant')}>
                                    <option value="">Title</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Master">Master</option>
                                  </select>
                                </div>
                                <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                  <label style={{ fontSize: '14px', color: 'black' }} className="form-label fw-bold" htmlFor={`firstName-${index}`}>(First Name & (Middle name, if any))<span className="text-danger">*</span></label>
                                  <input type="text"
                                    placeholder="Enter First Name"
                                    id={`firstName-${index}`}
                                    value={infant.firstName}
                                    onChange={(e) => { handleFirstNameChange(e, index, 'infant'); }} className="form-control" />
                                </div>
                                <div className="col-lg-4 col-12">
                                  <label style={{ fontSize: '14px', color: 'black' }} htmlFor="lastName" className="form-label fw-bold">Last Name <span className="text-danger">*</span> </label>
                                  <input type="text"
                                    placeholder="Enter Last Name"
                                    id={`lastName-${index}`}
                                    value={infant.lastName}
                                    onChange={(e) => { handleLastNameChange(e, index, 'infant'); }} className="form-control" />
                                </div>
                              </div>
                              <Form className='mb-4'>
                                <Form.Group controlId="infantDetail">
                                  <div className='row '>
                                    <div className='col-lg-12 '>
                                      <Form.Label style={{ fontSize: '14px', color: 'black' }} className='fw-bold'>Infant's Date of Birth<span className="text-danger">*</span></Form.Label>
                                    </div>
                                  </div>
                                  <div className='row p-0 col-lg-12'>
                                    <div className='col-12 col-lg-4'>
                                      <Form.Select className='form-control form-select' onChange={handleDayChange} value={day}>
                                        <option value="">Day</option>
                                        {days.map((d) => (
                                          <option key={d} value={d}>
                                            {d}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </div>
                                    <div className='col-12 col-lg-4'>
                                      <Form.Select className='form-control form-select' onChange={handleMonthChange} value={month}>
                                        <option value="">Month</option>
                                        {months.map((m) => (
                                          <option key={m} value={m}>
                                            {m}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </div>
                                    <div className='col-12 col-lg-4'>
                                      <Form.Select className='form-control form-select' onChange={handleYearChange} value={year}>
                                        <option value="">Year</option>
                                        {years.map((y) => (
                                          <option key={y} value={y}>
                                            {y}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </div>
                                    <div className='col-lg-2'></div>
                                  </div>
                                  {errorMessage && (
                                    <div className="row mt-2">
                                      <div className="col-lg-12">
                                        <div className="alert alert-danger" role="alert">
                                          {errorMessage}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Form.Group>
                              </Form>
                              {
                                flightstatus === 'I' && <div className="row mb-3">
                                  <div className="d-flex align-items-center mb-3 text-primary fw-light" style={{ cursor: 'pointer' }}>
                                    <i className={`fa-solid ${expandedForms.infant[index] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                                    <div onClick={() => handleToggle('infant', index)} className='fs-6 fw-medium'> Passport Information</div>
                                  </div>

                                  {expandedForms.infant[index] && (
                                    <>

                                      <div className="col-lg-6 col-12 mb-3 mb-lg-0">
                                        <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportNumber" className="form-label fw-bold">Passport Number <span className="text-danger">*</span> </label>
                                        <input type="text" id="passportNumber" onChange={(e) => handlePassportChange(e, index, 'infant', 'passportNumber')} value={infants[index].passportNumber} className="form-control" placeholder="Your Passport No:" />
                                        {infant.passportError && <small className="text-danger">{infant.passportError}</small>}
                                      </div>
                                      <div className="col-lg-6 col-12">
                                        <label style={{ fontSize: '14px', color: 'black' }} htmlFor="passportExpiry" className="form-label fw-bold">Passport Expiry <span className="text-danger">*</span> </label>
                                        <div className="d-flex align-items-center">
                                          <select id="expiryDay" value={infants[index].passportExpiryDay} onChange={(e) => handlePassportChange(e, index, 'infant', 'passportExpiryDay')} className="form-control form-select">
                                            <option selected>Day</option>
                                            {[...Array(31).keys()].map(day => (
                                              <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                                            ))}
                                          </select>
                                          <select id="expiryMonth" value={infants[index].passportExpiryMonth} className="form-control form-select" onChange={(e) => handlePassportChange(e, index, 'infant', 'passportExpiryMonth')}>
                                            <option selected>Month</option>
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                              <option key={index + 1} value={index + 1}>{month}</option>
                                            ))}
                                          </select>
                                          <select id="expiryYear" value={infants[index].passportExpiryYear} className="form-control form-select" onChange={(e) => handlePassportChange(e, index, 'infant', 'passportExpiryYear')}>
                                            <option selected>Year</option>
                                            {expiryYearOptions.map(year => (
                                              <option key={year} value={year}>{year}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              }




                              <div className="row mb-3">
                                <div className="d-flex align-items-center mb-3 text-primary fw-light" style={{ cursor: 'pointer' }}>
                                  <i className={`fa-solid ${expandedForms.infant[`frequent${index}`] ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                                  <div onClick={() => handleFrequent('infant', index)} className='fw-semibold text-muted fs-6'>Frequent flyer number and Meal preference <span className='text-danger'>(optional)</span></div>

                                </div>
                                {/* {expandedForms.infant[`frequent${index}`] && ( */}
                                <div className={`gst-details ${expandedForms.infant[`frequent${index}`] ? 'show' : ''}`}>
                                  <div className="row">
                                    <div className="col-lg-4 col-12">
                                      <label style={{ fontSize: '12px' }} htmlFor={`frequentFlyer-${index}`} className="form-label fw-bold">Frequent flyer no.</label>
                                      <input type="text" id={`frequentFlyer-${index}`} value={infant.FrequentFlyerAirline} onChange={(e) => handleFrequentFlyerChange(e, index, 'infant')} className="form-control" />
                                    </div>
                                    <div className="col-lg-4 col-12 mb-3 mb-lg-0">
                                      <label style={{ fontSize: '12px' }} htmlFor="airline" className="form-label fw-bold">Airline</label>
                                      <input type="text" id="airline" className="form-control" placeholder="Enter Airline Name" />
                                    </div>
                                    <div className="col-lg-4 d-none col-12">
                                      <label style={{ fontSize: '12px' }} htmlFor={`mealPreference-${index}`} className="form-label fw-bold">Meal Preference</label>
                                      <select id={`mealPreference-${index}`} className="form-control form-select" value={infant.MealType} onChange={(e) => handleMealPreferenceChange(e, index, 'infant')}>
                                        <option value="">Select Meal Preference</option>
                                        <option value="Vegetarian Hindu Meal">Vegetarian Hindu Meal</option>
                                        <option value="Baby Meal">Baby Meal</option>
                                        <option value="Hindu Non Vegetarian Meal">Hindu Non Vegetarian Meal</option>
                                        <option value="Kosher Meal">Kosher Meal</option>
                                        <option value="Moslem Meal">Moslem Meal</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                {/* )} */}
                              </div>



                            </form>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="info-box p-3 border bg-light text-dark" style={{ borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
                    <div className='fw-bold fs-8'>Add-ons (Optional)</div>
                    <div className='fw-normal fs-7 text-muted'>Pre-booked meals, Seats and Baggage are 30% cheaper than on-board price.</div>
                  </div>

                </div>

              ))}
            </div>
            <div className='bottom-icon'>
              <button onClick={handleInfantForm} type="button" className={`btn ${infants.length >= noOfInfants ? 'disabled' : ''} text-primary btn-light fw-bold fs-5`}>+ Add Infant</button>
            </div>
          </div>
        )}


        <div className="row mt-5">
          <div className="col-lg-12 col-md-12">
            <div className="row mb-2">
              <div className="col-lg-12">
                <div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="ml-4 mb-3">
                        <input
                          type="checkbox"
                          id="gstCheckbox"
                          className="form-check-input"
                          onChange={(e) => setShowGSTDetails(e.target.checked)}
                        />
                        <label htmlFor="gstCheckbox" className="form-check-label fw-bold ms-2">
                          I have a GST number <span className="text-danger">(Optional)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Animated GST Details Section */}
                  <div className={`gst-details ${showGSTDetails ? 'show' : ''}`}>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <label className="form-label">Company Name</label>
                        <input type="text"
                          className="form-control"
                          placeholder="Company Name"
                          name="companyName"
                          value={gstData.companyName || ''}
                          onChange={handleEmailChange} />
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <label className="form-label">Registration No</label>
                        <input type="text"
                          className={`form-control`}
                          placeholder="Registration No"
                          name="gstNumber"
                          value={gstData.gstNumber || ''}
                          onChange={handleEmailChange} />

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row mt-2'>
          <div className='col-lg-12 col-md-12'>
            <div className='row mb-2'>
              <div className='col-lg-12'>
                <div >
                  <div className='row'>
                    <div className='col-lg-12'>
                      <div className='h4'>Contact Details</div>
                    </div>
                  </div>
                  <div className='row mb-3'>
                    <div className='col-lg-12'>
                      <div className='text-muted h5'>Your Mobile number will be used only for sending flight related communication</div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        className="form-control form-select PhoneInput PhoneInput--focus form-control-lg p-2"
                        value={phoneValue}
                        onChange={handlePhoneChange}
                        defaultCountry={countryCodevl}

                      />
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6'>

                      <input style={{ height: '50px' }}
                        type="email"
                        className={`form-control form-control-lg text-muted  ${isValidEmail ? '' : 'is-invalid'}`}
                        placeholder="Email"
                        value={email}
                        name='email'
                        onChange={handleEmailChange}
                      />
                      {!isValidEmail && <div className="invalid-feedback">Please enter a valid email address.</div>}


                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>
        </div>
        <div className='mt-2'>
          <div className='col-lg-12 col-md-12 col-sm-12'>
            <div id='terms-outer-section'>
              <div className='terms-inner-section d-flex column-gap-2 align-items-start align-items-lg-start'>
                <label className='custom-checkbox'>
                  <input style={{ border: '2px solid #838383' }} className='form-check-input' type="checkbox" onChange={handleCheckboxChange} checked={checkboxChecked} />
                  <span className='checkmark'></span>
                </label>


                <div className='h6 d-none d-lg-block '>
                  I have read and agree to Wagnistrip's Rules,
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('Privacy Policy')}
                  >
                    Privacy Policy
                  </span>
                  , { }
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('User Agreement')}
                  >
                    User Agreement
                  </span>
                  , { }
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('Terms & Condition')}
                  >
                    Terms & Condition.
                  </span>
                </div>

                <div className=' d-block d-lg-none ' style={{ fontSize: "12px", marginTop: '2px' }}>
                  I have read and agree to Wagnistrip's Rules,
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('Privacy Policy')}
                  >
                    Privacy Policy
                  </span>
                  , { }
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('User Agreement')}
                  >
                    User Agreement
                  </span>
                  , { }
                  <span
                    style={{ cursor: 'pointer' }}
                    className='text-primary'
                    onClick={() => handleClickOpen('Terms & Condition')}
                  >
                    Terms & Condition.
                  </span>
                </div>
                <CustomizedDialogs open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}
                  title={modalTitle} />
              </div>
            </div>

          </div>
        </div>

        <div className="top_form_search_button d-flex align-items-center justify-content-center mt-4"><button style={{ border: !email || !phoneValue || !checkboxChecked ? '2px solid #cfcfcf' : '' }} disabled={!email || !phoneValue || !checkboxChecked} onClick={handleContinueClick} type='button' className="btn btn_theme btn_md">Continue</button></div>

        {/* some  changing */}
      </div>
    </>

  );
};


export default TravellersDetails;

