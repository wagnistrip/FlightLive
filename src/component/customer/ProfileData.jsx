
import React, { useState, useEffect } from 'react';
import { FaAddressBook, FaChevronRight, FaGifts } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import "./ProfileData.scss";
import { FormControl, InputLabel, Select, MenuItem, TextField, ListSubheader, Button, useMediaQuery, } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImUser } from 'react-icons/im';
import { BsEyeFill } from "react-icons/bs";
import { customerProfile, customerProfileUpdate, fetchOffersData, galileoApi, porfileImgeupload } from '../../Api/apiService';
import Offer from '../Offer';
import { useDispatch, useSelector } from 'react-redux';
import { loadSession, logout } from '../../redux/actions/authActions';
const tabs = [
  { id: 'account', label: 'Account Information', icon: <ImUser className="text-primary mr-2" size={20} /> },
  { id: 'booking', label: 'Your Booking', icon: <FaAddressBook className="text-primary mr-2" size={20} /> },
  // { id: 'coTravels', label: 'Co-Travels', icon: <IoBag className="text-primary mr-2" size={20} /> },
  // { id: 'promo', label: 'Promo Codes', icon: <BiSolidOffer className="text-primary mr-2" size={20} /> },
  // { id: 'gifts', label: 'Gift Cards/ Coupons', icon: <FaGifts className="text-primary mr-2" size={20} /> },
  // { id: 'settings', label: 'Settings', icon: <IoSettingsOutline className="text-primary mr-2" size={20} /> },
]

const ProfileData = () => {
  const navigate = useNavigate();  // Initialize navigate
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(loadSession()); // Load session on mount
  }, [dispatch]);

  // console.log('user data', user);

  const handleLogout = () => {
    dispatch(logout())  // Call your logout function
    navigate('/');  // Redirect to home page after logout
  };

  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState(null);
  const [activeSection, setActiveSection] = useState('account');
  const [userImage, setUserImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    dob: null,
    maritalStatus: '',
    country: '',
    state: '',
    pinCode: '',
    image: ''
  });
  const [errors, setErrors] = useState({
    title: false,
    firstName: false,
    lastName: false,
    dob: false,
    maritalStatus: false,
    country: false,
    state: false,
    pinCode: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isDataSectionVisible, setIsDataSectionVisible] = useState(false); // For toggling on small devices
  const [isSmallDevice, setIsSmallDevice] = useState(false); // To detect small devices
  const [flightdata, setFlightData] = useState([]);


  useEffect(() => {
    const token = user?.token;

    if (user && user?.users?.role === 1 && user && user?.users.status === 1) {
      navigate("/");
    }
    if (token) {
      fetchCustomerProfile(token);
    }

    if (token && flightdata.length === 0) {
      getbookingData(token)
    }

    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 768); // Detect small device
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, [user]);

  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) return; // Prevent API call if data already exists

      try {
        const response = await fetchOffersData("/get-country");
        console.log("response =>", response?.countries);
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
          setStates(response?.states || []);
          setFormData(prevFormData => ({
            ...prevFormData,
            state: "",
          }));
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [formData?.country]);
  const handleTabClick = (tabId) => {
    setActiveSection(tabId);
    if (isSmallDevice) {
      setIsDataSectionVisible(true); // Show data-section on small devices when tab is clicked
    }
  };

  const fetchCustomerProfile = async (token) => {
    setLoading(true);
    try {
      const response = await customerProfile("/customer/profile", token)
      const data = response;
      if (data.status === 200) {
        setUserdata(data.users);
        if (!data.users || !data.users.name) {
          setUserImage(data?.users?.image);
          setFormData({
            image: data?.users.image
          })
          setLoading(false);
          setIsNewUser(true);
        } else {
          setIsNewUser(false);
          setFormData({
            title: data.users.title || '',
            firstName: data.users.name || '',
            lastName: data.users.lastName || '',
            dob: dayjs(data.users.dob) || null,
            maritalStatus: data.users.maritalStatus || '',
            country: data.users.country || '',
            state: data.users.state || '',
            pinCode: data.users.pinCode || '',
            image: data?.users.image
          });
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customer profile:", error);
    }
  };
  const getbookingData = async (token) => {
    setLoading(true);
    try {
      const response = await customerProfile("/customer/bookings", token)
      console.log("booking data ==>", response);
      if (response.status === 200) {
        setFlightData(response?.users?.bookings);
        //  toast.success(response?.message);
      } else {
        setFlightData([]);

      }
    } catch (error) {
      setFlightData([]);
      setLoading(false);
      console.error("Error fetching customer profile:", error);
    }
  };


  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, country: event.target.value });
  };

  const handleChangeBusiness = (event) => {
    setFormData({ ...formData, title: event.target.value });
  };

  const handleChangeMaritalStatus = (event) => {
    setFormData({ ...formData, maritalStatus: event.target.value });
  };


  const groupedCountries = countries.reduce((acc, country) => {
    const firstLetter = country.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {});
  // Create an array of MenuItems with ListSubheader
  const menuItems = Object.keys(groupedCountries).sort().flatMap((letter) => [
    <ListSubheader key={`header-${letter}`}>{letter}</ListSubheader>,
    ...groupedCountries[letter].map((country) => (
      <MenuItem key={country.id} value={country.id}>
        {country?.name}
      </MenuItem>
    )),
  ]);

  const validateForm = () => {
    const newErrors = {
      title: !formData.title,
      firstName: formData.firstName.length < 3,
      lastName: formData.lastName.length < 3,
      dob: !formData.dob,
      maritalStatus: !formData.maritalStatus,
      // country: !formData.country,
      state: !formData.state,
      pinCode: !/^\d{6}$/.test(formData.pinCode)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const customerUpdate = async (data) => {
    setLoading(true);
    const token = user.token;
    const res = await customerProfileUpdate('/Profile/Update', data, token);
    try {
      if (res.status === 200) {
        fetchCustomerProfile(token);
        toast.success('You have been successfully submitted');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error updating customer profile:");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedDateOfBirth = dayjs(formData.dob).format('YYYY-MM-DD');
      const updatedFormData = {
        ...formData,
        dob: formattedDateOfBirth
      };
      customerUpdate(updatedFormData);

      // Reset form fields and switch back to view mode
      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        dob: null,
        maritalStatus: '',
        country: 'India',
        state: '',
        pinCode: ''
      });
      setIsEditing(false);
    }
  };



  // *************************************************
  const [switches, setSwitches] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
  });

  const switchTexts = {
    switchHeading1: "Tips, offers and Newsletter",
    switchHeading2: "Wagnistrip updates and Latest News",
    switchHeading3: "WhatsApp Notification",
    switchHeading4: "Push Notifications",
    switch1: 'Switch 1 description',
    switch2: 'Switch 2 description',
    switch3: 'Switch 3 description',
    switch4: 'Switch 4 description',
  };
  const headings = {
    switch1: 'Tips, offers and Newsletter 1',
    switch2: 'wagnistrip updates and Latest News',
    switch3: 'WhatsApp Notification',
    switch4: 'Push Notifications',
  };

  const handleSwitchChange = (switchName) => {
    setSwitches({
      ...switches,
      [switchName]: !switches[switchName],
    });
  };

  const containerStyle = {
    // minHeight: '100vh',
    // padding: '20px',
    // display: 'flex',
    // flexDirection: 'column',


  };




  const sidebarStyle = {
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    padding: '20px',
    // marginBottom: '20px',
    border: "1px solid #ccc",
    height: "750px"

  };

  const profileInfoStyle = {
    textAlign: 'center',
    marginBottom: '20px'
  };

  const profileNameStyle = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#343a40'
  };

  const profileJoinedStyle = {
    fontSize: '1.1rem',
    color: '#6c757d'
  };

  const listGroupItemStyle = {
    fontSize: '1rem',
    border: 'none',
    padding: '15px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    color: '#343a40',
    transition: 'all 0.3s ease',
  };

  const listGroupItemHoverStyle = {
    backgroundColor: '#e9ecef'
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  // Calculate the indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage + 1; // Adding 1 for the human-readable start index
  const endIndex = Math.min(currentPage * itemsPerPage, flightdata.length); // Ensure end index doesn't exceed total data

  // Get the data for the current page
  const currentData = flightdata.slice(startIndex - 1, endIndex); // Adjust for zero-based array indexing

  // Calculate total pages
  const totalPages = Math.ceil(flightdata.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const contentStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: "1.4px solid #ccc"
  };
  const profileImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    cursor: 'pointer',
  };

  const uploadPlaceholderStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#f1f1f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    cursor: 'pointer',
    border: '2px dashed #ccc',
  };

  const uploadTextStyle = {
    textAlign: 'center',
    color: '#777',
    fontSize: '14px',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = listGroupItemHoverStyle.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '';
  };

  const handleImageChange = async (e) => {
    const token = user?.token;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      setLoading(true); // Start loading indicator

      try {
        const response = await porfileImgeupload('/profileImg', formData, token);
        // Update the state with the returned image URL
        if (response && response.status === '200') {
          // toast.success(response?.message);
          setFormData({
            image: response?.image
          });
        } else {
          // setError("Failed to retrieve image URL from server.");
        }
      } catch (err) {
        // setError("Image upload failed. Please try again.");
      } finally {
        setLoading(false); // End loading indicator
      }
    }
  };

  
  if (loading) {
    return (
      <div className="container text-center py-5">
        <h3>Loading, please wait...</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const userPhoneEmail = userdata && (userdata.email || userdata.phone);

  const handleBackClick = () => {
    setIsDataSectionVisible(false);
  };
  return (

    <>
    {
      isMobile ? null : 
      <Offer title="profile" />
    }
      <div className="outerContainerStyle" >
        <div className="container-fluid" style={containerStyle}>
          <div className="row">


            <div className={`col-md-3 col-sm-12 me-3 tab-section ${isSmallDevice && isDataSectionVisible ? 'd-none ' : ''}`} style={sidebarStyle}>
              <div style={profileInfoStyle}>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {formData?.image ? (
                    <img
                      src={formData?.image}
                      alt="User"
                      style={profileImageStyle}
                      onClick={() => document.getElementById('fileInput').click()}
                    />
                  ) : (
                    <div
                      style={uploadPlaceholderStyle}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <span style={uploadTextStyle}>PERSONAL PROFILE</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <div className='text-muted' style={profileNameStyle}>Hii {userdata && userdata.email}</div>
              </div>

              <div style={{ fontSize: '12px' }} className="">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="list-group-item list-group-item-action"
                    style={listGroupItemStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => { handleTabClick(tab.id); setActiveSection(tab.id) }}
                  >
                    {tab.icon} {tab.label}
                  </div>
                ))}
                <Link
                  className="list-group-item list-group-item-action"
                  style={{ ...listGroupItemStyle, color: '#dc3545' }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default link behavior
                    handleLogout();
                  }}
                >
                  <IoIosLogOut className="text-primary mr-2" size={20} /> Log out
                </Link>
              </div>
            </div>

            <div className={`col-md-8 col-sm-12 data-section   ${isSmallDevice && isDataSectionVisible ? '' : 'd-none'}`} style={{
              padding: '20px',
              backgroundColor: '#fff',

              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: "1.4px solid #ccc", height: `calc(100vh - 76px)`,
            }}>
              <>
                <div className="back-icon" onClick={handleBackClick}>
                  <FaAngleLeft size={24} /> Back
                </div>
                {activeSection === 'account' && (

                  <>
                    {isNewUser ? (
                      <div className='user-form-section' style={{ padding: '30px' }}>
                        <h4 style={{ marginBottom: '25px', fontWeight: '600', color: '#212529', textAlign: 'center' }}>
                          Complete Your Profile Information
                        </h4>
                        <form className="row g-3" onSubmit={handleSubmit}>
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.title}>
                              <InputLabel id="title-label" style={{ fontWeight: '500' }}>Title</InputLabel>
                              <Select
                                labelId="title-label"
                                id="title"
                                value={formData.title || ''}
                                label="Title *"
                                onChange={handleChangeBusiness}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                                <MenuItem value="Miss">Miss</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                              </Select>
                              <FormHelperText>{errors.title ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="First Name *"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              error={errors.firstName}
                              helperText={errors.firstName ? 'Enter First Name' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="Last Name *"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              error={errors.lastName}
                              helperText={errors.lastName ? 'Enter Last Name' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            />
                          </div>

                          <div className="col-md-6">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                className='outline-none'
                                label="Date Of Birth"
                                value={formData.dob}
                                onChange={(newValue) => setFormData({ ...formData, dob: newValue })}
                                renderInput={(params) => <TextField {...params} />}
                                slotProps={{ textField: { fullWidth: true, style: { backgroundColor: '#f8f9fa' } } }}
                                error={errors.dob}
                              />
                            </LocalizationProvider>
                            {errors.dob && <FormHelperText style={{ color: 'red' }}>Date Of Birth is required</FormHelperText>}
                          </div>
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.maritalStatus}>
                              <InputLabel id="marital-status-label" style={{ fontWeight: '500' }}>Marital Status</InputLabel>
                              <Select
                                labelId="marital-status-label"
                                id="marital-status"
                                value={formData.maritalStatus || ''}
                                label="Marital Status *"
                                onChange={handleChangeMaritalStatus}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="Married">Married</MenuItem>
                                <MenuItem value="Divorced">Divorced</MenuItem>
                                <MenuItem value="Widowed">Widowed</MenuItem>
                              </Select>
                              <FormHelperText>{errors.maritalStatus ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.country}>
                              <InputLabel id="country-label" style={{ fontWeight: '500' }}>Country</InputLabel>
                              <Select
                                labelId="country-label"
                                id="country"
                                value={formData.country || ''}
                                label="Country *"
                                // onChange={handleChange}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '' })}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                {menuItems}
                              </Select>
                              <FormHelperText>{errors.country ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            {/* <TextField
                              label="State"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              error={errors.state}
                              helperText={errors.state ? 'Enter State' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            /> */}

                            <FormControl variant="outlined" fullWidth disabled={!formData.country}>
                              <InputLabel>State *</InputLabel>
                              <Select
                                value={formData.state || ''}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })} // Reset city when state changes
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

                          <div className="col-12 text-end">
                            <Button type="submit" variant="contained" color="warning" >
                              Complete Profile
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : isEditing ? (
                      <div className='user-form-section' style={{ padding: '30px' }}>
                        <h4 style={{ marginBottom: '25px', fontWeight: '600', color: '#212529', textAlign: 'center' }}>
                          Edit Your Profile Information
                        </h4>
                        <form className="row g-3" onSubmit={handleSubmit}>
                          {/* Same form fields as above */}
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.title}>
                              <InputLabel id="title-label" style={{ fontWeight: '500' }}>Title</InputLabel>
                              <Select
                                labelId="title-label"
                                id="title"
                                value={formData.title || ''}
                                label="Title *"
                                onChange={handleChangeBusiness}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                                <MenuItem value="Miss">Miss</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                              </Select>
                              <FormHelperText>{errors.title ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="First Name *"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              error={errors.firstName}
                              helperText={errors.firstName ? 'Enter First Name' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="Last Name *"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              error={errors.lastName}
                              helperText={errors.lastName ? 'Enter Last Name' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            />
                          </div>
                          <div className="col-md-6">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Date Of Birth *"
                                value={formData.dob}
                                onChange={(newValue) => setFormData({ ...formData, dob: newValue })}
                                renderInput={(params) => <TextField {...params} />}
                                slotProps={{ textField: { fullWidth: true, style: { backgroundColor: '#f8f9fa' } } }} />
                            </LocalizationProvider>
                          </div>
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.maritalStatus}>
                              <InputLabel id="marital-status-label" style={{ fontWeight: '500' }}>Marital Status</InputLabel>
                              <Select
                                labelId="marital-status-label"
                                id="marital-status"
                                value={formData.maritalStatus || ''}
                                label="Marital Status *"
                                onChange={handleChangeMaritalStatus}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="Married">Married</MenuItem>
                                <MenuItem value="Divorced">Divorced</MenuItem>
                                <MenuItem value="Widowed">Widowed</MenuItem>
                              </Select>
                              <FormHelperText>{errors.maritalStatus ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <FormControl required style={{ width: '100%' }} error={errors.country}>
                              <InputLabel id="country-label" style={{ fontWeight: '500' }}>Country</InputLabel>
                              <Select
                                labelId="country-label"
                                id="country"
                                value={formData.country || ''}
                                label="Country *"
                                onChange={handleChange}
                                variant="outlined"
                                style={{ backgroundColor: '#f8f9fa' }}
                              >
                                {menuItems}
                              </Select>
                              <FormHelperText>{errors.country ? 'Required' : ''}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-6">

                            <FormControl variant="outlined" fullWidth disabled={!formData.country}>
                              <InputLabel>State *</InputLabel>
                              <Select
                                value={formData.state || ''}
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
                          <div className="col-md-6">
                            <TextField
                              label="Pin Code *"
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={formData.pinCode}
                              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                              error={errors.pinCode}
                              helperText={errors.pinCode ? 'Enter a valid Pin Code' : ''}
                              InputLabelProps={{ style: { fontWeight: '500' } }}
                              InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                            />
                          </div>
                          <div className="col-12 text-end ">
                            <Button type="submit" variant="contained" color="warning"  >
                              Save Changes
                            </Button>
                          </div>
                        </form>
                        <div className='text-end mt-3'>
                          <Button onClick={handleEditClick} variant="outlined" className='text-end' >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="my-profile border border-1 p-4 bg-white" style={{ borderBottomRightRadius: "8px", borderBottomLeftRadius: "8px" }}>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                          <h1 className='fw-bold text-muted fs-4 m-0'>WELCOME, {userdata && userdata.title} {userdata && userdata.name}</h1>
                          <div className='text-info fw-bold' style={{ fontSize: "14px", cursor: "pointer" }} onClick={handleEditClick}>
                            Edit Profile
                          </div>
                        </div>

                        <div className='d-flex justify-content-between mb-3'>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Title</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.title}</div>
                          </div>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>First Name</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.name}</div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between mb-3'>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Last Name</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.lastName}</div>
                          </div>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Date of Birth</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.dob}</div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between mb-3'>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Marital Status</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.maritalStatus}</div>
                          </div>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Pin Code</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.pinCode}</div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between mb-3'>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>Country</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.country}</div>
                          </div>
                          <div style={{ width: "48%" }}>
                            <div className='text-secondary' style={{ fontSize: "14px" }}>State</div>
                            <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.state}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {activeSection === 'booking' && (
                  <div className='Your-Booking'>
                    <div className='container' style={{ padding: "0" }}>


                      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Upcoming</button>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                      <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Cancelled</button>
                    </li> */}
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Completed</button>
                        </li>
                      </ul>
                      <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">

                          <div className="row  mb-0 " style={{
                            backgroundColor: "#ffffff",
                            // borderRadius: "8px", 
                            lineHeight: "1.6",
                            position: "relative",
                            zIndex: 1,
                            marginTop: "-40px",
                            // border: "1px solid red", 
                            // boxShadow: "0 3px 30px 0 rgba(0,0,0,.1)",
                            width: "100%", // Ensure sec-2 matches the width of sec-1
                            margin: "0 auto" // Center align sec-2
                          }}>


                            <div className="container my-3">
                              <div className=" table-responsive w-100 rounded">
                                <table className="table text-center mb-0">
                                  <thead className="table-secondary text-light fs-6">
                                    <tr style={{ fontSize: '14px', fontWeight: 400 }}>
                                      <th className="p-2">Date</th>
                                      <th className="p-2">Departs</th>
                                      <th className="p-2">Arrives</th>
                                      <th className="p-2">Pnr</th>
                                      <th className="p-2">Name</th>
                                      <th className="p-2">Time to Leave</th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    {
                                      currentData && currentData.length > 0 ? currentData?.map((data, index) => (
                                        <tr key={index} className="t">
                                          <td className="p-3">{"12-01-2024"}</td>
                                          <td className="p-3">{"DEL"}</td>
                                          <td className="p-3">{"BOM"}</td>
                                          <td className="p-3">{"Png"}</td>
                                          <td className="p-3">{"8823"}</td>
                                          <td className="p-3">{"2 hour left"}</td>
                                        </tr>
                                      )) : (
                                        <tr className=''>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>Booking data is not available</td>
                                          <td></td>
                                          <td></td>
                                        </tr>
                                      )
                                    }


                                  </tbody>
                                </table>


                                {
                                  flightdata.length > 5 && (
                                    <div className="d-flex shadow-sm mt-4 align-content-center justify-content-end">
                                      <div>
                                        {startIndex}-{endIndex} of {flightdata.length}{' '}
                                        <span>
                                          <FaAngleLeft
                                            onClick={handlePrev}
                                            style={{
                                              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                              pointerEvents: currentPage === 1 ? 'none' : 'auto',
                                              color: currentPage === 1 ? '#ccc' : '#000',
                                            }}
                                            size={18}
                                          />{' '}
                                          <FaChevronRight
                                            onClick={handleNext}
                                            style={{
                                              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                              pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                                              color: currentPage === totalPages ? '#ccc' : '#000',
                                            }}
                                            size={18}
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  )
                                }




                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade text-center" id="pills-contact" role="tabpanel" aria-labelledby="pills-profile-tab">comming soon</div>
                      </div>


                    </div>




                  </div>

                )}

              </>


            </div>


            <div className={`col-md-8 col-sm-12 data-section ${!isSmallDevice ? '' : 'd-none'}`} style={contentStyle}>


              {activeSection === 'account' && (

                <>
                  {isNewUser ? (
                    <div className='user-form-section' style={{ padding: '30px' }}>
                      <h4 style={{ marginBottom: '25px', fontWeight: '600', color: '#212529', textAlign: 'center' }}>
                        Complete Your Profile Information
                      </h4>
                      <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.title}>
                            <InputLabel id="title-label" style={{ fontWeight: '500' }}>Title</InputLabel>
                            <Select
                              labelId="title-label"
                              id="title"
                              value={formData.title || ''}
                              label="Title *"
                              onChange={handleChangeBusiness}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              <MenuItem value="Mr">Mr</MenuItem>
                              <MenuItem value="Mrs">Mrs</MenuItem>
                              <MenuItem value="Miss">Miss</MenuItem>
                              <MenuItem value="Ms">Ms</MenuItem>
                            </Select>
                            <FormHelperText>{errors.title ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="First Name *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            error={errors.firstName}
                            helperText={errors.firstName ? 'Enter First Name' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="Last Name *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            error={errors.lastName}
                            helperText={errors.lastName ? 'Enter Last Name' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>

                        <div className="col-md-6">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              className='outline-none'
                              label="Date Of Birth"
                              value={formData.dob}
                              onChange={(newValue) => setFormData({ ...formData, dob: newValue })}
                              renderInput={(params) => <TextField {...params} />}
                              slotProps={{ textField: { fullWidth: true, style: { backgroundColor: '#f8f9fa' } } }}
                              error={errors.dob}
                            />
                          </LocalizationProvider>
                          {errors.dob && <FormHelperText style={{ color: 'red' }}>Date Of Birth is required</FormHelperText>}
                        </div>
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.maritalStatus}>
                            <InputLabel id="marital-status-label" style={{ fontWeight: '500' }}>Marital Status</InputLabel>
                            <Select
                              labelId="marital-status-label"
                              id="marital-status"
                              value={formData.maritalStatus || ''}
                              label="Marital Status *"
                              onChange={handleChangeMaritalStatus}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              <MenuItem value="Single">Single</MenuItem>
                              <MenuItem value="Married">Married</MenuItem>
                              <MenuItem value="Divorced">Divorced</MenuItem>
                              <MenuItem value="Widowed">Widowed</MenuItem>
                            </Select>
                            <FormHelperText>{errors.maritalStatus ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.country}>
                            <InputLabel id="country-label" style={{ fontWeight: '500' }}>Country</InputLabel>
                            <Select
                              labelId="country-label"
                              id="country"
                              value={formData.country || ''}
                              label="Country *"
                              onChange={handleChange}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              {menuItems}
                            </Select>
                            <FormHelperText>{errors.country ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">


                          <FormControl required style={{ width: '100%' }} error={errors.country}>
                            <InputLabel id="country-label" style={{ fontWeight: '500' }}>State</InputLabel>
                            <Select
                              value={formData.state || ''}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })} // Reset city when state changes
                              label="State *"
                              disabled={!formData.country}
                              variant="outlined"
                              className='w-100'
                            >
                              {states.map((state) => (
                                <MenuItem key={state.id} value={state.id}>
                                  {state.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{errors.state ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="Pin Code *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.pinCode}
                            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            error={errors.pinCode}
                            helperText={errors.pinCode ? 'Enter a valid Pin Code' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>
                        <div className="col-12 text-end">
                          <Button type="submit" variant="contained" color="warning" >
                            Complete Profile
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : isEditing ? (
                    <div className='user-form-section' style={{ padding: '30px' }}>
                      <h4 style={{ marginBottom: '25px', fontWeight: '600', color: '#212529', textAlign: 'center' }}>
                        Edit Your Profile Information
                      </h4>
                      <form className="row g-3" onSubmit={handleSubmit}>
                        {/* Same form fields as above */}
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.title}>
                            <InputLabel id="title-label" style={{ fontWeight: '500' }}>Title</InputLabel>
                            <Select
                              labelId="title-label"
                              id="title"
                              value={formData.title || ''}
                              label="Title *"
                              onChange={handleChangeBusiness}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              <MenuItem value="Mr">Mr</MenuItem>
                              <MenuItem value="Mrs">Mrs</MenuItem>
                              <MenuItem value="Miss">Miss</MenuItem>
                              <MenuItem value="Ms">Ms</MenuItem>
                            </Select>
                            <FormHelperText>{errors.title ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="First Name *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            error={errors.firstName}
                            helperText={errors.firstName ? 'Enter First Name' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="Last Name *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            error={errors.lastName}
                            helperText={errors.lastName ? 'Enter Last Name' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>
                        <div className="col-md-6">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date Of Birth *"
                              value={formData.dob}
                              onChange={(newValue) => setFormData({ ...formData, dob: newValue })}
                              renderInput={(params) => <TextField {...params} />}
                              slotProps={{ textField: { fullWidth: true, style: { backgroundColor: '#f8f9fa' } } }} />
                          </LocalizationProvider>
                        </div>
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.maritalStatus}>
                            <InputLabel id="marital-status-label" style={{ fontWeight: '500' }}>Marital Status</InputLabel>
                            <Select
                              labelId="marital-status-label"
                              id="marital-status"
                              value={formData.maritalStatus || ''}
                              label="Marital Status *"
                              onChange={handleChangeMaritalStatus}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              <MenuItem value="Single">Single</MenuItem>
                              <MenuItem value="Married">Married</MenuItem>
                              <MenuItem value="Divorced">Divorced</MenuItem>
                              <MenuItem value="Widowed">Widowed</MenuItem>
                            </Select>
                            <FormHelperText>{errors.maritalStatus ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <FormControl required style={{ width: '100%' }} error={errors.country}>
                            <InputLabel id="country-label" style={{ fontWeight: '500' }}>Country</InputLabel>
                            <Select
                              labelId="country-label"
                              id="country"
                              value={formData.country || ''}
                              label="Country *"
                              onChange={handleChange}
                              variant="outlined"
                              style={{ backgroundColor: '#f8f9fa' }}
                            >
                              {menuItems}
                            </Select>
                            <FormHelperText>{errors.country ? 'Required' : ''}</FormHelperText>
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <FormControl variant="outlined" fullWidth disabled={!formData.country}>
                            <InputLabel>State *</InputLabel>
                            <Select
                              value={formData.state || ''}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })} // Reset city when state changes
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
                        <div className="col-md-6">
                          <TextField
                            label="Pin Code *"
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={formData.pinCode}
                            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            error={errors.pinCode}
                            helperText={errors.pinCode ? 'Enter a valid Pin Code' : ''}
                            InputLabelProps={{ style: { fontWeight: '500' } }}
                            InputProps={{ style: { backgroundColor: '#f8f9fa' } }}
                          />
                        </div>
                        <div className="col-12 text-end ">
                          <Button type="submit" variant="contained" color="warning"  >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                      <div className='text-end mt-3'>
                        <Button onClick={handleEditClick} variant="outlined" className='text-end' >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="my-profile border border-1 p-4 bg-white" style={{ borderBottomRightRadius: "8px", borderBottomLeftRadius: "8px" }}>
                      <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h1 className='fw-bold text-muted fs-4 m-0'>WELCOME, {userdata && userdata.title} {userdata && userdata.name}</h1>
                        <div className='text-info fw-bold' style={{ fontSize: "14px", cursor: "pointer" }} onClick={handleEditClick}>
                          Edit Profile
                        </div>
                      </div>

                      <div className='d-flex justify-content-between mb-3'>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Title</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.title}</div>
                        </div>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>First Name</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.name}</div>
                        </div>
                      </div>

                      <div className='d-flex justify-content-between mb-3'>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Last Name</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.lastName}</div>
                        </div>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Date of Birth</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.dob}</div>
                        </div>
                      </div>

                      <div className='d-flex justify-content-between mb-3'>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Marital Status</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.maritalStatus}</div>
                        </div>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Pin Code</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.pinCode}</div>
                        </div>
                      </div>

                      <div className='d-flex justify-content-between mb-3'>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>Country</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.country}</div>
                        </div>
                        <div style={{ width: "48%" }}>
                          <div className='text-secondary' style={{ fontSize: "14px" }}>State</div>
                          <div className='fw-bold' style={{ fontSize: "16px" }}>{userdata && userdata.state}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}


              {activeSection === 'booking' && (
                <div className='Your-Booking'>
                  <div className='container' style={{ padding: "0" }}>
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="pills-home-tabs" data-bs-toggle="pill" data-bs-target="#pills-homes" type="button" role="tab" aria-controls="pills-homes" aria-selected="true">Upcoming</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-contact-tabs" data-bs-toggle="pill" data-bs-target="#pills-contacts" type="button" role="tab" aria-controls="pills-contacts" aria-selected="false">Completed</button>
                      </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                      <div className="tab-pane fade show active" id="pills-homes" role="tabpanel" aria-labelledby="pills-home-tabs">
                        {renderTable(
                          currentData.filter(data => {
                            const departureDateRaw = data?.flight?.info?.onward[0]?.["@attributes"]?.DepartureTime || null;
                            if (!departureDateRaw) return false;
                            const departureDate = new Date(departureDateRaw);
                            const futureDate = new Date();
                            futureDate.setDate(futureDate.getDate());

                            return departureDate >= futureDate;
                          }
                          ), "currentflight"
                        )
                        }
                      </div>
                      <div className="tab-pane fade" id="pills-contacts" role="tabpanel" aria-labelledby="pills-contact-tabs">
                        {renderTable(currentData.filter(data => {
                          const departureDateRaw = data?.flight?.info?.onward[0]?.["@attributes"]?.DepartureTime || null;
                          if (!departureDateRaw) return false;
                          const departureDate = new Date(departureDateRaw);
                          const futureDate = new Date();
                          futureDate.setDate(futureDate.getDate());
                          return departureDate < futureDate;
                        }), "pastflight")}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default ProfileData;


function renderTable(filteredData, flightstatus) {
  return (
    <div className="row mb-0" style={{
      backgroundColor: "#ffffff",
      lineHeight: "1.6",
      position: "relative",
      zIndex: 1,
      marginTop: "-40px",
      width: "100%",
      margin: "0 auto"
    }}>
      <div className="container my-3">
        <div className="table-responsive w-100 rounded">
          <table className="table text-center mb-0">
            <thead className="table-secondary text-light fs-6">
              <tr style={{ fontSize: '14px', fontWeight: 400 }}>
                <th className="p-2">Id</th>
                <th className="p-2">Date</th>
                <th className="p-2">Departs</th>
                <th className="p-2">Arrives</th>
                <th className="p-2">Pnr</th>
                <th className="p-2">Name</th>
                <th className="p-2">Time to Leave</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((data, index) => {
                const departureDateRaw = data?.flight?.info?.onward[0]["@attributes"].DepartureTime || null;
                // [0]["@attributes"].DepartureTime
                let formattedDepartureDate = "N/A";
                if (departureDateRaw) {
                  const departureDate = new Date(departureDateRaw);
                  const day = departureDate.getDate().toString().padStart(2, "0");
                  const month = departureDate.toLocaleString("en-US", { month: "short" }); // e.g., 'Jun'
                  const year = departureDate.getFullYear();
                  formattedDepartureDate = `${day}-${month}-${year}`;
                }

                // Extract origin and destination
                const origin = data?.flight?.info?.onward?.[0]?.["@attributes"]?.Origin || "N/A";
                const lastSegmentIndex = data?.flight?.info?.onward?.length - 1;
                const destination =
                  data?.flight?.info?.onward?.[lastSegmentIndex]?.["@attributes"]?.Destination || "N/A";

                // Extract PNR
                const pnr = data?.passangerPNR || "N/A";

                // Get passenger names
                const passengerName = data?.passengers?.[0]
                  ? `${data.passengers[0].first_name} ${data.passengers[0].last_name}`
                  : "N/A";

                const convertToIST = (utcDateTime) => {
                  // Parse the UTC datetime string
                  const date = new Date(utcDateTime);

                  // Convert to IST using time zone offset
                  const options = {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, // 24-hour format
                  };
                  // Return the formatted IST date and time
                  return new Date(
                    date.toLocaleString('en-US', options, { timeZone: 'Asia/Kolkata' })
                  );
                };

                // Convert the `created_at` to IST
                const createdAtUTC = data?.created_at; // Assume this is the UTC timestamp
                const createdAtIST = convertToIST(createdAtUTC);

                // Get the current time in IST
                const currentTime = convertToIST(new Date().toISOString());

                // Calculate the time difference in milliseconds
                const timeDifferenceMs = currentTime - createdAtIST;
                const totalSeconds = Math.floor(timeDifferenceMs / 1000);
                const totalMinutes = Math.floor(totalSeconds / 60);
                const totalHours = Math.floor(totalMinutes / 60);

                // Calculate the remaining minutes after extracting hours
                const remainingMinutes = totalMinutes % 60;

                // Generate the human-readable difference
                let timeToLeave;
                if (totalHours < 24) {
                  // timeToLeave = `${totalHours} hour(s)`;
                  timeToLeave = `${totalHours} hour(s) ${remainingMinutes} minute(s) ago`;
                } else {
                  const totalDays = Math.floor(totalHours / 24);
                  const remainingHours = totalHours % 24;
                  timeToLeave = `${totalDays} day(s) ${remainingHours} hour(s) ${remainingMinutes} minute(s) ago`;
                }

                const transactionId = data?.Transaction_id;

                return (
                  <tr key={index} className="t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{formattedDepartureDate}</td>
                    <td className="p-3">{origin}</td>
                    <td className="p-3">{destination}</td>
                    <td className="p-3">{pnr}</td>
                    <td className="p-3">{passengerName}</td>
                    <td className="p-3">{flightstatus === 'currentflight' ? timeToLeave : '-'}</td>
                    {/* <td className="p-3">{flightstatus === 'currentflight' ?
                      <span className={`${data.status === 'Confirmed' ? 'bg-success text-white' : 'bg-warning text-black'} p-1 rounded-pill px-2 fw-normal`}>
                        {data?.status || '-'}
                      </span> : '-'}
                    </td> */}
                    <td className="p-3">{flightstatus === 'currentflight' ?
                      <span className={`bg-success text-white p-1 rounded-pill px-2 fw-normal`}>
                        {data?.status === 'Hold' ? 'Confirm':'Confirm' || '-'}
                      </span> : '-'}
                    </td>

                    <td className="p-3">
                      <Link
                        to={`/api/payment/success?status=200&transaction_id=${transactionId}`}
                        target="_blank"
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                      >
                        <BsEyeFill size={20} />
                      </Link>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="9">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}