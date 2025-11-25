import React, { useEffect, useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { galileoApi } from '../../Api/apiService';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import { Box, TextField, Button, Typography, useMediaQuery, Paper, InputAdornment, IconButton } from "@mui/material";
import { IoEyeOffSharp, IoEyeSharp } from 'react-icons/io5';
import { getImageUrl } from '../../utils/airlineUtils';
const theme = createTheme({
    palette: {
        primary: {
            main: '#007bff',
        },
    },
});
const Userlogin = () => {
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [inputValue, setInputValue] = useState('');
    const [inputType, setInputType] = useState(''); // 'email' or 'phone'
    const [isInputValid, setIsInputValid] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(300); // Timer in seconds (5 minutes)
    const [isOtpValid, setIsOtpValid] = useState(false); // To check if OTP is valid (6 digits)
    const [canResend, setCanResend] = useState(false); // To track if resend is allowed
    const [role, setRole] = useState(null);
    const [showOtpField, setShowOtpField] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');
    const [loginstatus, setLoginStatus] = useState('signIn');
    const navigate = useNavigate();

    // here is testing function to temporty start -----
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // end===========
    useEffect(() => {
        let timerInterval = null;

        if (showOtpSection && timer > 0) {
            timerInterval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerInterval);
                        setCanResend(true); // Allow resend after timer ends
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        // Cleanup the interval on component unmount or timer reset
        return () => clearInterval(timerInterval);
    }, [showOtpSection, timer]);

    useEffect(() => {
        if (location.pathname.includes("/login/agent-login")) {
            setRole(2);
        } else if (location.pathname.includes("/login/user-login")) {
            setLoginStatus('signUp')
            setRole(1);
        }
    }, [location.pathname]);


    const handleChangeInput = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Determine if the input is an email or phone number
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const phonePattern = /^[0-9]{10}$/;

        if (value.match(/[a-zA-Z]/)) {
            setInputType('email');
            setIsInputValid(emailPattern.test(value));
        }
        // else if (value.match(/^[0-9]*$/)) {
        //     setInputType('phone');
        //     setIsInputValid(phonePattern.test(value));
        // } 
        else {
            setIsInputValid(false);
        }
    };

    const handleLoginClick = async () => {
        if (!isInputValid) {
            alert('Please enter a valid Email ID or Phone Number');
            return;
        }

        const requestBody = {
            "emailOrPhone": inputValue,
            "role": role
            // "role": '1',
        };

        try {
            console.log("Request data:", requestBody);
            setLoading(true);
            const response = await galileoApi("/login",requestBody,{});
            console.log("Response:", response);
            if (response.status === 200) {
                toast.success(response?.message || 'OTP verification successful!');
                setShowOtpSection(true);
                setTimer(300)
                setErrorMessage(null);

            } else {
                toast.error(response?.message || 'Failed to login. Please try again.');
                setErrorMessage(response?.message || 'Failed to login. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            console.error('API Error:', error);
        }
    };


    const handleChangeOtp = (newValue) => {
        setOtp(newValue);
        setIsOtpValid(newValue.length === 6);
    };

    const handleButtonClickOtp = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        const requestBody = {
            "emailOrPhone": inputValue,
            "otp": otp,
            "role": role
        };

        try {
            const response = await galileoApi("/verify-otp",requestBody,{});
            console.log("Response:", response);
            if (response.status === 200) {
                toast.success(response?.message || 'OTP verification successful!');
                // console.log("check my login data : ", response);
                setErrorMessage(null);
                dispatch(login(response))
                if (response && response?.users?.role === 1) {
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        navigate('/agent/Registration');
                    }, 2000);
                }

            } else if (response.status === 400) {
                toast.warn(response?.message || 'OTP verification failed!');
            } else {
                setErrorMessage('An error occurred during OTP verification. Please try again.');
            }
        } catch (error) {
            console.error('API otp varification:', error);

        }
    };

    // here is testing function to temporty start -----
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpVerification = async() => {
        setIsLoggedIn(true);
        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            setIsLoggedIn(false);
            return;
        }


        // if (otp === generatedOtp) { // correct comparison
            // const response = {
            //     "status": 200,
            //     "users": {
            //         "id": 37,
            //         "name": null,
            //         "lastName": null,
            //         "email": "admin@gmail.com",
            //         "phone": null,
            //         "image": null,
            //         "title": null,
            //         "dob": null,
            //         "maritalStatus": null,
            //         "country": null,
            //         "state": null,
            //         "pinCode": null,
            //         "status": 1,
            //         "role": 2,
            //         "created_at": "2025-03-08T10:23:20.000000Z",
            //         "updated_at": "2025-03-08T10:23:20.000000Z"
            //     },
            //     "token": "3|ShwUCiM5R2KFJsSGbJ8V4woDr3LS10j9W96Z7pwg11bf7905",
            //     "message": "Agent Login Successfully!"
            // }

        //     setTimeout(() => {
        //         dispatch(login(response));
        //         toast.success(response && response?.message);
        //         setIsLoggedIn(false);
        //         navigate('/');
        //     }, 1500);
        // } else {
        //     setIsLoggedIn(false);
        //     toast.error("Invalid OTP");
        // }

        // here start agent verifcation code
         const requestBody = {
            "email": formData.email,
            "otp": otp,
            "role": role
        };

        console.log("request body for otp verfiy => ",requestBody);

        try {
            const response = await galileoApi("/agent/verify-otp",requestBody,{});
            console.log("Response:", response);
            if (response.status === 200) {
                toast.success(response?.message || 'OTP verification successful!');
                setErrorMessage(null);
                dispatch(login(response))
                if (response && response?.users?.role === 2 && response?.users.status === 1) {
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }

            } else if (response.status === 400) {
                toast.warn(response?.message || 'OTP verification failed!');
            } else {
                setErrorMessage('An error occurred during OTP verification. Please try again.');
            }
        } catch (error) {
            console.error('API otp varification:', error);

        }
            // here end agent verifcation code
        
    };



    const handleLogin = async () => {

        // setIsLoggedIn(true);

        // if (formData.email === "admin@wagnistrip.com" && formData.password === "Admin@123") {
        //     // Simulate OTP sending
        //     const simulatedOtp = "123456"; // you can randomize this if you want
        //     setGeneratedOtp(simulatedOtp);
        //     setTimeout(() => {
        //         toast.success(`OTP sent to registered mobile/email number.`);
        //         setIsLoggedIn(false);
        //         setTimer(300)
        //         setShowOtpField(true);
        //     }, 1500);
        // } else {
        //     setIsLoggedIn(false);
        //     toast.error("Invalid email or password");
        // }

        // login start here for agent .............code

        if (!formData.email && !formData.password) {
            toast.success('Please enter a valid Email ID or Phone Number');
            return;
        } 

        setIsLoggedIn(true);

        const requestBody = {
            "email": formData.email,
            "role": role,
            "password":formData.password
        };

        try {
            console.log("Request data:", requestBody);
            // return
            setLoading(true);
            const response = await galileoApi("/agent/login",requestBody,{});
            console.log("Response:", response);

            // here otp validation logic
            // if (response.status === 201) {
            //     toast.success(response?.message || 'OTP sent successful!');
            //     setIsLoggedIn(false);
            //     setTimer(300)
            //     setShowOtpField(true);

            // } else if (response?.status === 200){
            //     setIsLoggedIn(false);
            //     toast.error(response?.message || 'Account is not approved wait for some time');
            // } else {
            //     setIsLoggedIn(false);
            //     toast.error(response?.message || 'Failed to login. Please try again.');
            // }
            
            // here start without otp validtion logic

             if (response.status === 200) {
                toast.success(response?.message || 'OTP verification successful!');
                setErrorMessage(null);
                dispatch(login(response))
                if (response && response?.users?.role === 2 && response?.users.status === 1) {
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }

            } else if (response.status === 401) {
                toast.error(response?.message || 'OTP verification failed!');
            } else {
                setErrorMessage('An error occurred during OTP verification. Please try again.');
            }

        } catch (error) {
            setIsLoggedIn(false);
            setLoading(false);
            console.error('API Error:', error);
        }

        // login end here for agent .............code
    };

    //   end-------------
    return (
        <>

            <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>

                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        overflow: "hidden",
                        height: "100%",
                        position: "relative",
                    }}
                >
                    <Link to="/" style={{ position: "absolute", top: "20px", left: "20px" }}>
                        <img
                            src={getImageUrl("logo.png")}
                            alt="Logo"
                            style={{ width: "100px" }}
                        />
                    </Link>
                    {!isMobile && (
                        <Box
                            sx={{
                                flex: "0 0 25%", // 25% width
                                bgcolor: "#F9FAFB",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2,

                            }}
                            className="shadow-sm"
                        >

                            {/* Welcome Text & Illustration */}
                            <Typography variant="h4" fontWeight="bold" sx={{ mt: 8 }}>Hi, Welcome Back</Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1, textAlign: "center" }}>
                                We come up with an Optimised and Effectual workflow.
                            </Typography>
                            <img
                                src={getImageUrl("loginbg.png")}
                                alt="Welcome"
                                style={{ width: "100%", marginTop: "20px" }}
                            />
                        </Box>
                    )}

                    <Box
                        sx={{
                            flex: isMobile ? "1" : "0 0 75%", // 75% width on desktop
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMobile ? "flex-start" : "center", // Left align on mobile, center on larger screens
                            justifyContent: isMobile ? "start" : "center", // Start at the top on mobile
                            p: 1,
                            height: "100%",
                        }}
                    >
                        <Box sx={{ width: "100%", maxWidth: 493, marginTop: isMobile ? "150px" : "0px", }}> {/* Restrict form width */}
                            <Typography variant="h5" fontWeight="bold" mb={2} textAlign="start">
                                Sign in to your account
                            </Typography>
                            {/* This component will be used for user signup or agent signup */}

                            {
                                (role === 1 || role === 2 && loginstatus === 'signUp') && (

                                    <div className='d-block'>

                                        <ThemeProvider theme={theme}>
                                            <div className="">
                                                {
                                                    showOtpSection ? (
                                                        <>
                                                            <div className='fs-3 fw-medium text-black'>OTP VERIFICATION</div>
                                                            <div style={{ fontSize: '14px', fontWeight: '400' }} className='mb-4 text-muted'>we have sent OTP on your register Email or Mobile Number</div>
                                                        </>

                                                    ) : null
                                                }
                                                {!showOtpSection ? (
                                                    <>
                                                        <TextField
                                                            // label={
                                                            //     inputType === 'email'
                                                            //         ? 'Email ID *'
                                                            //         : inputType === 'phone'
                                                            //             ? 'Phone Number *'
                                                            //             : 'Email ID or Phone Number *'
                                                            // }
                                                            label={
                                                                inputType === 'email'
                                                                    ? 'Email ID *'
                                                                    : 'Email ID *'
                                                            }
                                                            variant="outlined"
                                                            value={inputValue}
                                                            onChange={handleChangeInput}
                                                            style={{ width: '100%' }}
                                                            error={inputValue && !isInputValid}

                                                        />
                                                        <p className="text-start px-1 fw-bold" style={{ fontSize: "14px" }}>
                                                            By logging in, I understand & agree to Wagnistrip{' '}
                                                            <span style={{ color: "var(--main-color)" }}>terms of use</span> and{" "}
                                                            <span style={{ color: "var(--main-color)" }}>privacy policy</span>.
                                                        </p>
                                                        {errorMessage && (
                                                            <div className="text-danger text-center mb-3">
                                                                {errorMessage}
                                                            </div>
                                                        )}
                                                        {/* <Button
                                        disabled={!isInputValid}
                                        // variant="contained"
                                        // color="primary"
                                        // style={{
                                        //     borderRadius: '8px',
                                        //     padding: '12px 30px',
                                        //     width: '100%',
                                        //     fontWeight: 'bold'
                                        // }}
                                        onClick={handleLoginClick}
                                        className={isInputValid ? ' btn btn_theme btn_md' : 'not-allowed'}
                                    >
                                        Login
                                    </Button> */}
                                                        <div className='mt-4' ><button type="button" disabled={!isInputValid} onClick={handleLoginClick} className={isInputValid ? ' btn btn_theme btn_md w-100' : 'not-allowed w-100 btn bg-secondary btn_md text-white'}>

                                                            {loading ? (
                                                                <span className="gap-2 d-flex align-items-center justify-content-center">
                                                                    <i className="fa fa-spinner fa-spin"></i> Loading...
                                                                </span>
                                                            ) : (
                                                                role === 1 ? 'Login' : 'Signup'
                                                            )}

                                                        </button></div>

                                                    </>
                                                ) : (
                                                    <>
                                                        <MuiOtpInput
                                                            length={6}
                                                            value={otp}
                                                            onChange={handleChangeOtp}
                                                            TextFieldsProps={{ size: 'small' }}
                                                            sx={{ width: '100%', marginBottom: '15px' }}
                                                        />
                                                        {errorMessage && (
                                                            <div className="text-danger text-center mb-3">
                                                                {errorMessage}
                                                            </div>
                                                        )}

                                                        <div className='w-100 d-flex justify-content-between align-items-center'>
                                                            <div style={{ fontSize: '14px', fontWeight: '400' }} className='mb-2 text-black'>
                                                                Resend OTP in
                                                                <span className='text-success mx-1 fw-bold'>
                                                                    {String(Math.floor(timer / 60)).padStart(2, '0')}:
                                                                    {String(timer % 60).padStart(2, '0')}
                                                                </span>
                                                                sec.
                                                            </div>

                                                            {
                                                                timer === 0 && (
                                                                    <button onClick={handleLoginClick} style={{ fontSize: '14px', fontWeight: '400' }} className='mb-2 btn btn-link  text-danger'>Resend</button>

                                                                )
                                                            }

                                                        </div>

                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleButtonClickOtp}
                                                            disabled={!isOtpValid}
                                                            sx={{ width: '100%' }}
                                                        >
                                                            Submit OTP
                                                        </Button>

                                                    </>
                                                )}

                                            </div>
                                        </ThemeProvider>

                                    </div>
                                )
                            }
                            {/* this sign in component will be used only Agent if agent have id and password then sign in used and when signip then otp sent agent and verification opt implment here  */}

                            {
                                (role === 2 && loginstatus === 'signIn') && (


                                    <Box sx={{ mt: 5, p: 2, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
                                        <Typography variant="h5" gutterBottom>
                                            Login
                                        </Typography>


                                        {!showOtpField ? (
                                            <>
                                                <TextField
                                                    label="Email"
                                                    variant="outlined"
                                                    fullWidth
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    label="Password"
                                                    variant="outlined"
                                                    fullWidth
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    sx={{ mb: 2 }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                                    {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <Button variant="contained" fullWidth onClick={handleLogin}>
                                                    {isLoggedIn
                                                        ? <span className='gap-2 d-flex align-items-center justify-content-center'> <i className="fa fa-spinner fa-spin"></i>Loading</span>
                                                        : 'Sign In'}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <>
                                                    <div className='fs-3 fw-medium text-black'>OTP VERIFICATION</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '400' }} className='mb-4 text-muted'>we have sent OTP on your register Email or Mobile Number</div>
                                                </>
                                                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                                                    <MuiOtpInput
                                                        length={6}
                                                        value={otp}
                                                        onChange={handleChangeOtp}
                                                        TextFieldsProps={{ size: 'small' }}
                                                        sx={{ width: '100%', marginBottom: '15px' }}
                                                    />
                                                </Box>

                                                <Button disabled={!isOtpValid} variant="contained" fullWidth onClick={handleOtpVerification}>
                                                    {isLoggedIn
                                                        ? <span className='gap-2 d-flex align-items-center justify-content-center'> <i className="fa fa-spinner fa-spin"></i>Verifying</span>
                                                        : 'Verify OTP & Login'}
                                                </Button>
                                            </>
                                        )}
                                    </Box>

                                )
                            }

                            {role === 2 && (
                                <Typography sx={{ fontSize: '14px' }} fontWeight="medium" my={2} textAlign="start">
                                    {loginstatus === 'signUp' ? "Already have an account?" : "Don't have an account?"}
                                    <span
                                        onClick={() => setLoginStatus(prevStatus => prevStatus === 'signUp' ? 'signIn' : 'signUp')}
                                        className="b"

                                        style={{ cursor: 'pointer', color: 'inherit', margin: '0 4px' }}
                                        onMouseEnter={(e) => e.target.style.color = 'red'}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                    >
                                        {loginstatus === 'signUp' ? "Sign In" : "Sign Up"}
                                    </span>
                                </Typography>

                            )}
                        </Box>
                    </Box>

                </Paper>
            </Box>

        </>

    );
};

export default Userlogin;





