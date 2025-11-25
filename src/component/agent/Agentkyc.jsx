
import React, { useState, useEffect, useRef } from 'react';
import { GoArrowLeft } from "react-icons/go";
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem, ListSubheader, Button, IconButton, InputAdornment, Box, Stepper, Step, StepLabel } from '@mui/material';
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadSession, logout } from '../../redux/actions/authActions';
import { fetchOffersData, galileoApi, porfileImgeupload } from '../../Api/apiService';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/airlineUtils';
import LoadingPage from '../../LoadingPage';
import { Grid } from '@mui/joy';
const AgentLogin = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  const panCardRef = useRef(null);
  const aadharCardRef = useRef(null);
  const gstCertificateRef = useRef(null);
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    dob: '',
    mobile: '',
    email: '',
    password: '',
    rePassword: '',
    userType: 'Agent',
    agencyName: '',
    designation: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    websiteAddress: '',
    registeredAddress: '',
    currency: 'INR',
    panCardNumber: '',
    aadharCardNumber: '',
    gstNumber: '',
    panholderName: '',
    pan_card_file: null,
    aadhar_card_file: null,
    gst_certificate_file: null,
    iataStatus: "approved",
    natureOFbusiness: '',
    businessType: '',
    Annualbusiness: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loadingcompon, setloadingcompon] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState(true);
  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.mobile) newErrors.mobile = "Mobile No is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.rePassword) newErrors.rePassword = "Re-enter Password is required";
    if (!formData.userType) newErrors.userType = "User Type is required";
    if (formData.password !== formData.rePassword) newErrors.rePassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const requiredStringFields = [
      "agencyName",
      "designation",
      "postalCode",
      "websiteAddress",
      "registeredAddress",
    ];

    const requiredNumberFields = ["country", "state", "city"];

    let newErrors = {};
    let isValid = true;

    // Validate string fields
    requiredStringFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    // Validate number fields
    requiredNumberFields.forEach((field) => {
      if (!formData[field] || isNaN(formData[field])) {
        newErrors[field] = "This field is required and must be a number";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = () => {
    let newErrors = {};

    if (!formData.panCardNumber.trim()) {
      newErrors.panCardNumber = 'Pan Card Number is required';
    }
    if (!formData.aadharCardNumber.trim()) {
      newErrors.aadharCardNumber = 'Aadhar Card Number is required';
    }
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is required';
    }
    if (!formData.pan_card_file) {
      newErrors.pan_card_file = 'Pan Card file is required';
    }
    if (!formData.panholderName) {
      newErrors.panholderName = 'Pan Card holder is required';
    }
    if (!formData.aadhar_card_file) {
      newErrors.aadhar_card_file = 'Aadhar Card file is required';
    }
    if (!formData.gst_certificate_file) {
      newErrors.gst_certificate_file = 'GST Certificate file is required';
    }
    if (!formData.iataStatus) {
      newErrors.iataStatus = 'IATA status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep4 = () => {
    let newErrors = {};

    if (!formData.natureOFbusiness) {
      newErrors.natureOFbusiness = "Nature of Business is required.";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Business Type is required.";
    }

    if (!formData.Annualbusiness) {
      newErrors.Annualbusiness = "Annual Travel Spend is required.";
    }

    setErrors(newErrors);
    // setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword((prev) => !prev);
  };


  useEffect(() => {
    if (user && user.users) {
      setFormData((prevData) => {
        const updatedData = { ...prevData };

        if (user.users.email) {
          updatedData.email = user.users.email;
        }

        if (user.users.phone) {
          updatedData.mobile = user.users.phone;
        }

        return updatedData;
      });
    }
  }, [user]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) return; // Prevent API call if data already exists

      try {
        const response = await fetchOffersData("/get-country");
        setCountries(response?.countries || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [countries]);

  useEffect(() => {
    if (formData?.country) {
      const fetchStates = async () => {
        try {
          const response = await galileoApi("/get-state", { id: formData?.country });
          if (response && response.status === 200) {
            setStates(response?.states || []);
            setCities([]);
          }

        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [formData?.country]);
  // Fetch cities when a state is selected
  useEffect(() => {
    if (formData?.state) {
      const fetchCities = async () => {
        try {
          const response = await galileoApi("/get-city", { id: formData?.state });
          setCities(response?.cities || []);
          // setFormData(prevFormData => ({
          //   ...prevFormData,
          //   city: ""    // Reset city selection
          // }));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [formData?.state]);
  // Handle input change
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Ensure PAN & GST numbers are stored in uppercase
    if (name === "panCardNumber" || name === "gstNumber") {
      value = value.toUpperCase();
    }
    // Ensure only numbers for mobile field
    if ((name === "mobile" || name === "postalCode" || name === "aadharCardNumber") && !/^\d*$/.test(value)) {
      return; // Prevent invalid input (only numbers allowed)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      let newErrors = { ...prev };

      // Remove error when field is correctly filled
      if (value.trim()) {
        delete newErrors[name];
      }

      if (name === "email") {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = "Enter a valid email address";
        } else {
          delete newErrors.email; // Remove error if valid
        }
      }

      if (name === "mobile") {
        if (value.length < 10) {
          newErrors.mobile = "Mobile number must be at least 10 digits";
        } else {
          delete newErrors.mobile; // Remove error if valid
        }
      }
      if (name === "postalCode") {
        if (value.length < 6) {
          newErrors.postalCode = "postalCode number must be at least 6 digits";
        } else {
          delete newErrors.postalCode;
        }
      }

      // Aadhar Card Number validation (must be exactly 12 digits)
      if (name === "aadharCardNumber") {
        if (!/^\d{12}$/.test(value)) {
          newErrors.aadharCardNumber = "Aadhar Card Number must be exactly 12 digits";
        } else {
          delete newErrors.aadharCardNumber;
        }
      }

      // PAN Card Number validation (Format: 5 letters, 4 numbers, 1 letter)
      if (name === "panCardNumber") {
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          newErrors.panCardNumber = "Invalid PAN Card format (e.g., ABCDE1234F)";
        } else {
          delete newErrors.panCardNumber;
        }
      }

      // GST Number validation (15 characters, format: 2 digits + PAN + suffix)
      // if (name === "gstNumber") {
      //   if (!/^\d{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z\d]{3}$/.test(value)) {
      //     newErrors.gstNumber = "Invalid GST Number format (e.g., 22ABCDE1234F1Z5)";
      //   } else {
      //     delete newErrors.gstNumber;
      //   }
      // }

      // Password validation (at least 8 characters, first capital, number, special char)
      if (name === "password") {
        if (!/^[A-Z][a-zA-Z0-9@#$%^&*!?]{7,}$/.test(value) || !/\d/.test(value) || !/[@#$%^&*!?]/.test(value)) {
          newErrors.password = "Password must be at least 8 characters, start with a capital letter, and include a number & special character.";
        } else {
          delete newErrors.password;
        }
      }

      return newErrors;
    });

    // if (step === 4) {
    //   validateStep4();
    // }
  };
  const handleIataStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      iataStatus: e.target.value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Allowed file types
      const allowedTypes = ["image/png", "application/pdf"];
      // Max file size (500KB)
      const maxSize = 500 * 1024; // 500KB in bytes

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: "Only PNG or PDF files are allowed",
        }));
        setFormData(prev => ({ ...prev, [fieldName]: null }));
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: "File size must be less than 500KB",
        }));
        setFormData(prev => ({ ...prev, [fieldName]: null }));
        return;
      }

      // If file is valid, store it in state
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Clear previous errors
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };
  // // Group countries by their first letter
  const groupedCountries = countries.reduce((acc, country) => {
    const firstLetter = country.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {});
  // Create an array of MenuItems with ListSubheader
  const countryMenuItems = Object.keys(groupedCountries).sort().flatMap((letter) => [
    <ListSubheader key={`header-${letter}`}>{letter}</ListSubheader>,
    ...groupedCountries[letter].map((country) => (
      <MenuItem key={country.id} value={country.id}>
        {country?.name}
      </MenuItem>
    )),
  ]);

  const handleNext = () => {
    if (step < 4) {
      if (step === 1 && !validateStep1()) {
        // alert("Please fill all required fields correctly.");


        return;
      }
      if (step === 2 && !validateStep2()) {
        // alert("Please fill all required fields correctly.");
        return;
      }
      if (step === 3 && !validateStep3()) return;

      setloadingcompon(true); // Show loading modal
      setTimeout(() => {
        setloadingcompon(false);
        setStep(prevStep => prevStep + 1);
      }, 3000);


    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep1() && !validateStep2() && !validateStep3() && !validateStep4()) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }


    const token = user?.token;
    if (!token) {
      toast.error("Authentication token is missing. Please login again.");
      return;
    }


    try {
      const formDataToSend = new FormData();
      // Append text fields (Only if they exist and are not files)
      Object.keys(formData).forEach((key) => {
        if (formData[key] && !(formData[key] instanceof File)) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append file fields (Check if they are valid File objects)
      if (formData.pan_card_file instanceof File) {
        formDataToSend.append("pan_card_file", formData.pan_card_file);
      }
      if (formData.aadhar_card_file instanceof File) {
        formDataToSend.append("aadhar_card_file", formData.aadhar_card_file);
      }
      if (formData.gst_certificate_file instanceof File) {
        formDataToSend.append("gst_certificate_file", formData.gst_certificate_file);
      }

      // Debugging: Check what is actually being sent
      for (let pair of formDataToSend.entries()) {
        // console.log(pair[0], pair[1]);
      }

      await toast.promise(
        porfileImgeupload("/agents/store", formDataToSend, token),
        {
          loading: "Submitting KYC details...",
          success: "User KYC submitted successfully!",
        }
      ).then((response) => {
        console.log("Agent KYC Response:", response);

        if (response?.status === 201) {
          setFormStatus(false);
          setStep(4);
        } else if (response?.status === 409) {
          toast.error(response?.message || "Error saving data.");
        } else {
          toast.error(response?.data?.message || "Error saving data.");
        }
      });
    } catch (error) {
      toast.error("An error occurred while saving the data. Please try again.");
    } finally {
    }
  };

  const handleLogout = () => {
    dispatch(logout())  // Call your logout function
    navigate('/');  // Redirect to home page after logout
  };

  const steps = [
    'Personal Details',
    'Agent Details',
    'KYC Details',
    'Bussiness Details',
  ];
  return (
    <>
      {loadingcompon && (
        <LoadingPage />
      )}
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: 'background.default' }}>
        <Grid container sx={{ height: "100vh" }}>
          <Grid
            item
            lg={2}
            sx={{
              display: { xs: "none", lg: "flex" },
              flexDirection: "column",
              alignItems: "flex-start",
              bgcolor: "#f9fafb",
              p: 4,
              height: "100vh",
            }}
          >
            <div className="text-start p-4">
              <Link to="/" >
                <img style={{ width: '150px' }} src={getImageUrl("logo.png")} alt="logo" />
              </Link>
              <p className='ml-2'>Login to continue</p>
            </div>
          </Grid>
          <Grid item xs={12} lg={10} sx={{ p: { xs: 1, md: 4 }, height: '100vh' }}>


            {
              formStatus ? (

                <>
                  <div className=" py-5">
                    <Box sx={{ width: '100%' }}>
                      <Stepper activeStep={step - 1} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </div>
                  <div className="container">
                    {step === 1 && (
                      <div className='persional-details-section'>
                        <div className="row">
                          <div className="col-12 mb-5">
                            <div className="agent-login-box">
                              <GoArrowLeft className="agent-login-box-icon" size={30} />
                              <span className="agent-login-box-text">Personal Details</span>
                            </div>
                          </div>
                        </div>
                        <form className="row g-3">
                          <div className="col-md-2">

                            <label
                              htmlFor="nature-of-business-select"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Title
                            </label>
                            <FormControl style={{ width: "100%" }} error={!formData.title}>
                              <Select name="title" value={formData.title} onChange={handleChange}>
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                                <MenuItem value="Miss">Miss</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                              </Select>
                              {!formData.title && <FormHelperText>Select title is required</FormHelperText>}
                            </FormControl>
                          </div>
                          <div className="col-md-5">

                            <label
                              htmlFor="first_name"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              First Name
                            </label>

                            <TextField label="Enter first Name *" name="firstName" value={formData.firstName} onChange={handleChange} variant="outlined" style={{ width: '100%' }} error={!!errors.firstName} helperText={errors.firstName || ""} />
                          </div>
                          <div className="col-md-5">
                            <label
                              htmlFor="last_name"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Last Name
                            </label>

                            <TextField label="Enter Last Name *" type='text' name="lastName" value={formData.lastName} onChange={handleChange} variant="outlined" style={{ width: '100%' }} error={!!errors.lastName} helperText={errors.lastName || ""} />
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="inputDob"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Date of Birth
                            </label>
                            <TextField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} error={!!errors.dob} helperText={errors.dob || ""} />
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="mobile"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Enter Your Mobile No
                            </label>
                            <TextField label="Mobile No" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} fullWidth required error={!!errors.mobile} helperText={errors.mobile || ""} disabled={!!user?.users?.phone} />
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="email"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Enter Your Email id
                            </label>
                            <TextField label="Email Id" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth error={!!errors.email} helperText={errors.email || ""} disabled={!!user?.users?.email} />

                          </div>

                          <div className="col-md-4">
                            <label
                              htmlFor="password"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Enter Password
                            </label>
                            <TextField label="Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} fullWidth error={!!errors.password} helperText={errors.password || ""} InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }} />
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="password"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Re-Enter Password
                            </label>
                            <TextField label="RePassword" type={showRePassword ? "text" : "password"} name="rePassword" value={formData.rePassword} onChange={handleChange} fullWidth error={!!errors.rePassword} helperText={errors.rePassword || ""} InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={toggleRePasswordVisibility} edge="end">
                                    {showRePassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }} />

                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="usertype"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              User Type
                            </label>



                            <FormControl required style={{ width: '100%' }}>

                              <Select name="userType" value={formData.userType} onChange={handleChange}>
                                <MenuItem value="Agent">Agent</MenuItem>
                                <MenuItem value="Distributor">Distributor</MenuItem>
                                <MenuItem value="Franchise">Franchise</MenuItem>
                              </Select>
                              {!formData.userType && <FormHelperText>Select userType is required</FormHelperText>}
                            </FormControl>
                          </div>
                          <div className="col-12 text-end mb-4">
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"


                              onClick={handleNext}  >
                              Next
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {step === 2 && (
                      <div className='Agent-details-section'>
                        <div className="row">
                          <div className="col-12 mb-5">
                            <div className="agent-login-box">
                              <GoArrowLeft onClick={handleBack} className="agent-login-box-icon" size={30} />
                              <span className="agent-login-box-text">Agent Details</span>
                            </div>
                          </div>
                        </div>
                        <form className="row g-4">
                          <div className="col-md-4">
                            <label
                              htmlFor="agency_name"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Enter Agency Name *
                            </label>
                            <TextField label="Enter Agency Name *" variant="outlined" style={{ width: '100%' }} name="agencyName"
                              value={formData.agencyName}
                              onChange={handleChange}
                              error={!!errors.agencyName}
                              helperText={errors.agencyName} />

                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="designation"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Designation *
                            </label>
                            <TextField label="Designation *" variant="outlined" style={{ width: '100%' }} name="designation"
                              value={formData.designation}
                              onChange={handleChange}
                              error={!!errors.designation}
                              helperText={errors.designation} />

                          </div>

                          {/* Country Select */}
                          <div className="col-md-4">
                            <label htmlFor="country" className="form-label">Country *</label>
                            <FormControl variant="outlined" fullWidth>
                              <InputLabel>Country *</InputLabel>
                              <Select
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', city: '' })} // Reset state & city when country changes
                                label="Country *"
                              >
                                {countryMenuItems}
                              </Select>
                              {!formData.country && <FormHelperText className='text-danger'>{errors.country}</FormHelperText>}
                            </FormControl>
                          </div>

                          {/* State Select */}
                          <div className="col-md-4">
                            <label htmlFor="state" className="form-label">State *</label>
                            <FormControl variant="outlined" fullWidth disabled={!formData.country}>
                              <InputLabel>State *</InputLabel>
                              <Select
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })} // Reset city when state changes
                                label="State *"
                                disabled={!formData.country} // Disable if no country selected
                              >
                                {states.map((state) => (
                                  <MenuItem key={state.id} value={state.id}>
                                    {state.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {!formData.state && <FormHelperText className='text-danger'>{errors.state}</FormHelperText>}
                            </FormControl>
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="city" className="form-label">City *</label>
                            <FormControl variant="outlined" fullWidth disabled={!formData.state}>
                              <InputLabel>City *</InputLabel>
                              <Select
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                label="City *"
                                disabled={!formData.state}
                              >
                                {cities.map((city) => (
                                  <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {!formData.city && <FormHelperText className='text-danger'>{errors.city}</FormHelperText>}

                            </FormControl>
                          </div>

                          <div className="col-md-4">
                            <label
                              htmlFor="postal_code"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Postal Code *
                            </label>
                            <TextField label="Postal Code*" variant="outlined" style={{ width: '100%' }} name="postalCode"
                              value={formData.postalCode}
                              onChange={handleChange}
                              error={!!errors.postalCode}
                              helperText={errors.postalCode} />

                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="website_address"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Website Address
                            </label>
                            <TextField label="Website Address " variant="outlined" style={{ width: '100%' }} name="websiteAddress"
                              value={formData.websiteAddress}
                              onChange={handleChange}
                              error={!!errors.websiteAddress}
                              helperText={errors.websiteAddress}
                            />

                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="registered_address"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Registered Address
                            </label>
                            <TextField label="Registered Address " variant="outlined" style={{ width: '100%' }}
                              name="registeredAddress"
                              value={formData.registeredAddress}
                              onChange={handleChange}
                              error={!!errors.registeredAddress}
                              helperText={errors.registeredAddress}
                            />

                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="nature-of-business-select"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Currency
                            </label>
                            <FormControl style={{ width: "100%" }} error={!formData.currency}>
                              <Select name="currency" value={formData.currency} onChange={handleChange}>
                                <MenuItem value="INR">INR</MenuItem>
                                <MenuItem value="AFD">AFD</MenuItem>
                                <MenuItem value="GBP">GBP</MenuItem>
                                <MenuItem value="CAD">CAD</MenuItem>
                              </Select>
                              {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
                            </FormControl>

                          </div>

                          <div className="col-12 text-end mb-4 d-flex gap-3 justify-content-end">

                            <button
                              type="submit"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"


                              onClick={handleBack} >
                              Back
                            </button>
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"


                              onClick={handleNext} >
                              Next
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {step === 3 && (
                      <div className='Agent-details-section'>
                        <div className="row">
                          <div className="col-12 mb-5">
                            <div className="agent-login-box">
                              <GoArrowLeft onClick={handleBack} className="agent-login-box-icon" size={30} />
                              <span className="agent-login-box-text">KYC Details</span>
                            </div>
                          </div>
                        </div>
                        <form className="row g-4">


                          <div className="col-md-3">

                            <label
                              htmlFor="pancard_no"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Pan Card Number *
                            </label>
                            <TextField label="Pan Card Number*" variant="outlined" style={{ width: '100%' }}
                              name="panCardNumber"
                              value={formData.panCardNumber}
                              onChange={handleChange}
                              error={!!errors.panCardNumber}
                              helperText={errors.panCardNumber}
                            />

                          </div>
                          <div className="col-md-3">
                            <label
                              htmlFor="panholder_name"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Aadhar Holder Name
                            </label>
                            <TextField label="Aadhar Holder name*" variant="outlined" style={{ width: '100%' }}
                              name="panholderName"
                              value={formData.panholderName}
                              onChange={handleChange}
                              error={!!errors.panholderName}
                              helperText={errors.panholderName}
                            />

                          </div>
                          <div className="col-md-3">
                            <label
                              htmlFor="aadhar_number"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Aadhar Card Number *
                            </label>
                            <TextField label="Aadhar Card Number*" variant="outlined" style={{ width: '100%' }}
                              name="aadharCardNumber"
                              value={formData.aadharCardNumber}
                              onChange={handleChange}
                              error={!!errors.aadharCardNumber}
                              helperText={errors.aadharCardNumber}
                            />

                          </div>
                          <div className="col-md-3">
                            <label
                              htmlFor="agency_name"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              GST Number *
                            </label>
                            <TextField label="GST Number*" variant="outlined" style={{ width: '100%' }}
                              name="gstNumber"
                              value={formData.gstNumber}
                              onChange={handleChange}
                              error={!!errors.gstNumber}
                              helperText={errors.gstNumber}
                            />

                          </div>
                          {/* Pan Card Upload */}
                          <div className="col-md-4">
                            <label htmlFor="pan-card-upload" className="d-block mb-2">Pan Card Upload</label>
                            <input
                              id="pan-card-upload"
                              type="file"
                              ref={panCardRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, 'pan_card_file')}
                            />
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => panCardRef.current.click()}
                              style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {formData.pan_card_file ? formData.pan_card_file.name : 'Choose File'}
                            </Button>
                            {errors.pan_card_file && <p className="text-danger mt-1">{errors.pan_card_file}</p>}
                          </div>
                          {/* Aadhar Card Upload */}
                          <div className="col-md-4">
                            <label htmlFor="aadhar-card-upload" className="d-block mb-2">Aadhar Card Upload</label>
                            <input
                              id="aadhar-card-upload"
                              type="file"
                              ref={aadharCardRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, 'aadhar_card_file')}
                            />
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => aadharCardRef.current.click()}
                              style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {formData.aadhar_card_file ? formData.aadhar_card_file.name : 'Choose File'}
                            </Button>
                            {errors.aadhar_card_file && <p className="text-danger mt-1">{errors.aadhar_card_file}</p>}
                          </div>

                          {/* GST Certificate Upload */}
                          <div className="col-md-4">
                            <label htmlFor="gst-certificate-upload" className="d-block mb-2">GST Certificate Upload</label>
                            <input
                              id="gst-certificate-upload"
                              type="file"
                              ref={gstCertificateRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, 'gst_certificate_file')}
                            />
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => gstCertificateRef.current.click()}
                              style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {formData.gst_certificate_file ? formData.gst_certificate_file.name : 'Choose File'}
                            </Button>
                            {errors.gst_certificate_file && <p className="text-danger mt-1">{errors.gst_certificate_file}</p>}
                          </div>
                          <div className=" d-flex align-items-center">
                            <div className="">
                              <h1 className='text-muted fw-bold fs-6'>IATA STATUS : -</h1>
                            </div>
                            <div>
                              <FormControlLabel
                                control={<Radio checked={formData.iataStatus === "approved"} onChange={handleIataStatusChange} value="approved" />}
                                label="Approved"
                                labelPlacement="start"
                                className='text-muted'
                              />
                            </div>
                            <div>
                              <FormControlLabel
                                control={<Radio checked={formData.iataStatus === "notApproved"} onChange={handleIataStatusChange} value="notApproved" />}
                                label="Not Approved"
                                labelPlacement="start"
                                className='text-muted'
                              />
                            </div>
                          </div>


                          <div className="col-12 text-end mb-4 d-flex gap-3 justify-content-end">

                            <button
                              type="button"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"


                              onClick={handleBack} >
                              Back
                            </button>
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"


                              onClick={handleNext}  >
                              Next
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {step === 4 && (
                      <div className='Agent-details-section'>
                        <div className="row">
                          <div className="col-12 mb-5">
                            <div className="agent-login-box">
                              <GoArrowLeft onClick={handleBack} className="agent-login-box-icon" size={30} />
                              <span className="agent-login-box-text">Bussiness Details</span>
                            </div>
                          </div>
                        </div>

                        <form className="row g-3">
                          <div className="col-md-6">
                            <label
                              htmlFor="nature-of-business-select"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Nature of Business
                            </label>
                            <FormControl required style={{ width: '100%' }}>
                              <InputLabel id="nature-of-business-label">
                                Nature of Business
                              </InputLabel>
                              <Select
                                labelId="nature-of-business-label"
                                id="nature-of-business-select"
                                label="Nature of Business *"
                                name="natureOFbusiness"
                                value={formData.natureOFbusiness}
                                onChange={handleChange}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>

                                <MenuItem value="Destination Management Company">
                                  Destination Management Company
                                </MenuItem>
                                <MenuItem value="Tour Operator">Tour Operator</MenuItem>
                                <MenuItem value="Travel Agent">Travel Agent</MenuItem>
                                <MenuItem value="WholeSale Travel Company">
                                  WholeSale Travel Company
                                </MenuItem>
                              </Select>
                              {errors.natureOFbusiness && <FormHelperText className='text-danger'>{errors.natureOFbusiness}</FormHelperText>}
                            </FormControl>
                          </div>

                          <div className="col-md-6">
                            <label
                              htmlFor="business-type-select"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Business Type
                            </label>
                            <FormControl required style={{ width: '100%' }}>
                              <InputLabel id="business-type-label">Business Type</InputLabel>
                              <Select
                                labelId="business-type-label"
                                id="business-type-select"
                                label="Business Type *"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Business to Business">
                                  Business to Business
                                </MenuItem>
                                <MenuItem value="Business to Consumer">
                                  Business to Consumer
                                </MenuItem>
                                <MenuItem value="Both">Both</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                              </Select>
                              {errors.businessType && <FormHelperText className='text-danger'>{errors.businessType}</FormHelperText>}
                            </FormControl>
                          </div>

                          <div className="col-md-6">
                            <label
                              htmlFor="annual-travel-spend-select"
                              style={{
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              Annual Travel Spend
                            </label>
                            <FormControl required style={{ width: '100%' }}>
                              <InputLabel id="annual-travel-spend-label">
                                Annual Travel Spend
                              </InputLabel>
                              <Select
                                labelId="annual-travel-spend-label"
                                id="annual-travel-spend-select"
                                label="Annual Travel Spend *"
                                name="Annualbusiness"
                                value={formData.Annualbusiness}
                                onChange={handleChange}

                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Less than INR 10 lakh">
                                  Less than INR 10 lakh
                                </MenuItem>
                                <MenuItem value="INR 10 lakh - INR 25 lakh">
                                  INR 10 lakh - INR 25 lakh
                                </MenuItem>
                                <MenuItem value="INR 25 lakh - INR 1 crore">
                                  INR 25 lakh - INR 1 crore
                                </MenuItem>
                                <MenuItem value="INR 1 crore - INR 2 crore">
                                  INR 1 crore - INR 2 crore
                                </MenuItem>
                                <MenuItem value="More than INR 5 crore">
                                  More than INR 5 crore
                                </MenuItem>
                              </Select>
                              {errors.Annualbusiness && <FormHelperText className='text-danger'>{errors.Annualbusiness}</FormHelperText>}
                            </FormControl>
                          </div>

                          <div className="col-12 text-end mb-4 d-flex gap-3 justify-content-end">
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#343a40',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition:
                                  'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"
                              onClick={handleBack}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              style={{
                                // backgroundColor: isFormValid ? '#343a40' : '#6c757d', // Disabled state color
                                backgroundColor: '#343a40', // Disabled state color
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                // cursor: isFormValid ? 'pointer' : 'not-allowed', // Disable pointer when not valid
                                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                              }}
                              className="btn btn-dark"
                              onClick={handleSubmit}
                            // disabled={!isFormValid}
                            >
                              Submit
                            </button>

                          </div>
                        </form>

                      </div>
                    )}
                  </div>
                </>

              ) : (


                <div className="container h-100 d-flex align-items-center justify-content-center">
                  <div className='text-center p-5 news_details_right_item'>
                    <h2>Thanks for registration with Wagnistrip</h2>
                    <p className='my-2'>The Registration Procedure has been completed
                      Please be patient during the next 24 hours as the account activation is in progress.
                    </p>
                    <Link
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default link behavior
                        handleLogout();
                      }}>Go to Home</Link>
                  </div>
                </div>
              )
            }

          </Grid>
        </Grid >
      </Box>


    </>
  );
}

export default AgentLogin;
