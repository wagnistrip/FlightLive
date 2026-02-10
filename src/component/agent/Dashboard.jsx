
import React, { useState, useEffect } from "react";
import {
  AppProvider,
  DashboardLayout,
  PageContainer,
} from "@toolpad/core";
import {
  Grid,
} from "@mui/material";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { LibraryBooks, Key } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashProfile from "./DashProfile";
import { IoSettingsSharp } from "react-icons/io5";
import LogoutIcon from '@mui/icons-material/Logout';
import Dashhome from "./Dashhome";
import Wallet from "./Wallet";
import DashBooking from "./dashboardBooking";
import {
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  InputAdornment,
  IconButton,
  Alert,
  List,
  ListItem,
  Stack,
  Modal
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { logout } from "../../redux/actions/authActions";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { galileoApi } from "../../Api/apiService";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import toast from "react-hot-toast";
import Coinstranctions from "./Coinstranctions";
import SpecialBooking from "./SpecialBooking";
const passwordRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "At least 1 number", test: (v) => /[0-9]/.test(v) },
  { label: "At least 1 lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "At least 1 uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "No username or name part", test: (v) => !/name|user/i.test(v) },
];

import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";

const getPasswordStrength = (password) => {
  let score = passwordRules.filter((rule) => rule.test(password)).length;
  if (score <= 2) return { label: "Weak", color: "error", value: 33 };
  if (score === 3 || score === 4) return { label: "Moderate", color: "warning", value: 66 };
  return { label: "Strong", color: "success", value: 100 };
};
// Navigation configuration
const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "profile", title: "Profile", icon: <AccountCircleIcon /> },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "reports", title: "Reports", icon: <BarChartIcon />,
    children: [
      { segment: "booking", title: "Booking", icon: <DescriptionIcon /> },
      { segment: "special-flight-booking", title: "special flight booking", icon: <FlightTakeoffIcon /> },
      { segment: "hold_booking", title: "Hold Booking", icon: <PendingActionsIcon /> },
      { segment: "package_booking", title: "Package Booking", icon: <CardGiftcardIcon /> },
      { segment: "wallet", title: "Wallet", icon: <AccountBalanceWalletIcon /> },
      { segment: "coins", title: "Target Price", icon: <MonetizationOnIcon /> },
    ],


  },
  { kind: "divider" },
  { kind: "header", title: "Settings" },
  {
    segment: "settings", title: "Settings", icon: <IoSettingsSharp />,
    children: [
      { segment: "password", title: "Password", icon: <Key /> },
    ],

  },
  { kind: "divider" },
  { segment: "logout", title: "Logout", icon: <LogoutIcon /> },
];


// Theme
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: false },
  colorSchemeSelector: "class",
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});


// Skeleton loader


const SkeletonBox = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
}));


const LoaderSkeleton = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <SkeletonBox height={50} />
    </Grid>
    <Grid item xs={6}>
      <SkeletonBox height={120} />
    </Grid>
    <Grid item xs={6}>
      <SkeletonBox height={120} />
    </Grid>
    <Grid item xs={12}>
      <SkeletonBox height={200} />
    </Grid>
  </Grid>
);
// Simulate routing
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);


  return {
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  };
}


// Chart data
const monthlyData = [
  { total: 80 },
  { total: 90 },
  { total: 70 },
  { total: 100 },
  { total: 89 },
  { total: 95 },
  { total: 85 },
];



// const data1 = [
//   {
//     name: "Jan",
//     Domestic: 40000,
//     International: 100000,
//   },
//   {
//     name: "Feb",
//     Domestic: 20000,
//     International: 80000,
//   },
//   {
//     name: "Mar",
//     Domestic: 30000,
//     International: 120000,
//   },
//   {
//     name: "Apr",
//     Domestic: 40000,
//     International: 60000,
//   },
//   {
//     name: "May",
//     Domestic: 40000,
//     International: 10000,
//   },
//   {
//     name: "Jun",
//     Domestic: 20000,
//     International: 70000,
//   },
//   {
//     name: "Jul",
//     Domestic: 40000,
//     International: 100000,
//   },
//   {
//     name: "Aug",
//     Domestic: 40000,
//     International: 100000,
//   },
//   {
//     name: "Sep",
//     Domestic: 40000,
//     International: 100000,
//   },
//   {
//     name: "Oct",
//     Domestic: 40000,
//     International: 700000,
//   },
//   {
//     name: "Nov",
//     Domestic: 40000,
//     International: 100000,
//   },
//   {
//     name: "Dec",
//     Domestic: 40000,
//     International: 200000,
//   },
// ];

const data1 = {
  2025: [
    { name: "Jan", Domestic: 40000, International: 100000 },
    { name: "Feb", Domestic: 20000, International: 80000 },
    { name: "Mar", Domestic: 30000, International: 120000 },
    { name: "Apr", Domestic: 40000, International: 60000 },
    { name: "May", Domestic: 40000, International: 10000 },
    { name: "Jun", Domestic: 20000, International: 70000 },
    { name: "Jul", Domestic: 40000, International: 100000 },
    { name: "Aug", Domestic: 40000, International: 100000 },
    { name: "Sep", Domestic: 40000, International: 100000 },
    { name: "Oct", Domestic: 40000, International: 700000 },
    { name: "Nov", Domestic: 40000, International: 100000 },
    { name: "Dec", Domestic: 40000, International: 200000 },
  ],

  2026: [
    { name: "Jan", Domestic: 50000, International: 110000 },
    { name: "Feb", Domestic: 25000, International: 90000 },
    { name: "Mar", Domestic: 35000, International: 130000 },
    // ...
  ],

  2027: [
    { name: "Jan", Domestic: 60000, International: 120000 },
    // ...
  ],
};

const weeklySalesData = [{ pv: 100 }, { pv: 300 }, { pv: 500 }, { pv: 400 }, { pv: 700 }, { pv: 600 }];
const newUsersData = [{ pv: 800 }, { pv: 500 }, { pv: 600 }, { pv: 300 }, { pv: 700 }];
const purchaseOrdersData = [{ pv: 400 }, { pv: 800 }, { pv: 300 }, { pv: 600 }];
const messagesData = [{ pv: 200 }, { pv: 300 }, { pv: 500 }, { pv: 450 }, { pv: 700 }];



// Main Dashboard Component
const Dashboard = () => {
  const router = useDemoRouter("/dashboard");
  const [data, setData] = useState(monthlyData);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

const [bookingStats, setBookingStats] = useState({
  daily: 0,
  weekly: 0,
  monthly: 0,
  yearly: 0,
  totalBooking:0,
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("user data =>", user);
    // Check if user is an agent and status is 0
    if (user && user?.users?.role === 2 && user && user?.users.status === 0) {
      navigate("/agent/registration");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [router.pathname]);

const cards = [
  {
    title: 'Daily booking',
    value: bookingStats?.daily,
    icon: <TodayIcon sx={{ fontSize: 40, color: '#2979ff' }} />,
    bgColor: '#e3f2fd',
    change: '+2.6%',
    chartColor: '#0d47a1',
    data: weeklySalesData,
  },
  {
    title: 'Weekly booking',
    value: bookingStats?.weekly,
    icon: <DateRangeIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
    bgColor: '#f3e5f5',
    change: '-0.1%',
    chartColor: '#4a148c',
    data: newUsersData,
  },
  {
    title: 'Monthly booking',
    value: bookingStats?.monthly,
    icon: <CalendarMonthIcon sx={{ fontSize: 40, color: '#ff6f00' }} />,
    bgColor: '#fff3e0',
    change: '+2.8%',
    chartColor: '#e65100',
    data: purchaseOrdersData,
  },
  {
    title: 'Yearly booking',
    value: bookingStats?.yearly,
    icon: <EventIcon sx={{ fontSize: 40, color: '#d84315' }} />,
    bgColor: '#ffebee',
    change: '+3.6%',
    chartColor: '#b71c1c',
    data: messagesData,
  },
];
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({ new: false, confirm: false, current: false });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMatch, setSuccessMatch] = useState(false);
  const [strength, setStrength] = useState({ label: "", value: 0, color: "" });

  useEffect(() => {
    setStrength(getPasswordStrength(newPassword));
    setSuccessMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    const token = user?.token
    e.preventDefault();
    const failedRules = passwordRules.filter((rule) => !rule.test(newPassword));
    if (failedRules.length > 0) {
      setErrorMsg(`New password does not meet all requirements.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const bodyreq = {
      'current_password': currentPassword || '',
      'new_password': newPassword || '',
    }

    try {
      setErrorMsg("");
      const response = await galileoApi("/agent/change-password", bodyreq, token);
      console.log('logo => ', response);
      if (response.status === 200) {
        setErrorMsg("");
        toast.success(response?.message || 'current password does not match')
        dispatch(logout());
      } else {
        toast.error(response.message || 'current password does not match')
      }
    } catch (error) {
      console.log("password change error ", error);
    }
    // Trigger your API call here
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const [openModal] = useState(true);
  const handleClose = () => {
    router.navigate('/dashboard'); // or wherever you want
  };

  const fetchWallet = async () => {
    const token = user?.token;

    try {
      const response = await galileoApi("/agent/wallet-amount", {}, token);
      if (response.status === 200) {
        const { booking } = response;
        setBookingStats(booking);
      }
      // setBlog(blogDatad); 
    } catch (err) {
      console.error("fetch blog error", err);
    }
  };
  useEffect(() => {
    fetchWallet();
  }, [])

  return (
    // <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
    <AppProvider branding={{
      logo: (
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://admin.wagnistrip.com/public/homepageimg/logo.png"
            alt="wagnistrip logo"
            style={{ cursor: 'pointer' }}
          />
        </Link>
      ),
      title: '',
      homeUrl: '',
    }} navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>
        <UserDropdown router={router} user={user} handleLogout={handleLogout} />
        <PageContainer>

          {router.pathname === "/dashboard" && (
            loading ? (
              <LoaderSkeleton />
            ) : (
              <Dashhome data={data} cards={cards} data1={data1} totalbooking={bookingStats?.totalBooking} />
            )
          )}
          {router.pathname === "/profile" && (
            <>
              {router.pathname === "/profile" && (
                loading ? <LoaderSkeleton /> : <DashProfile />
              )}
            </>
          )}
          {router.pathname === "/reports/wallet" && (
            <>
              {router.pathname === "/reports/wallet" && (
                loading ? <LoaderSkeleton /> : <Wallet />
              )}
            </>
          )}
          {router.pathname === "/reports/coins" && (
            <>
              {router.pathname === "/reports/coins" && (
                loading ? <LoaderSkeleton /> : <Coinstranctions />
              )}
            </>
          )}
          {router.pathname === "/reports/booking" && (
            <>
              {router.pathname === "/reports/booking" && (
                loading ? <LoaderSkeleton /> : <DashBooking type="booking" handleClose={handleClose} />
              )}
            </>
          )}
          {router.pathname === "/reports/hold_booking" && (
            <>
              {router.pathname === "/reports/hold_booking" && (
                loading ? <LoaderSkeleton /> : <DashBooking type="hold" handleClose={handleClose} />
              )}
            </>
          )}
          {router.pathname === "/reports/package_booking" && (
            <>
              {router.pathname === "/reports/package_booking" && (
                loading ? <LoaderSkeleton /> : <SpecialBooking type="package"/>
              )}
            </>
          )}
           {router.pathname === "/reports/special-flight-booking" && (
            <>
              {router.pathname === "/reports/special-flight-booking" && (
                loading ? <LoaderSkeleton /> :   <SpecialBooking type="specialflight" />
              )}
            </>
          )}
          {router.pathname === "/settings/password" && (
            <>
              {router.pathname === "/settings/password" && (
                loading ? <LoaderSkeleton /> : <>
                  <Box sx={{ width: '100%', mx: "auto", mt: 4 }}>
                    <Box sx={{
                      display: 'block',
                      width: '100%',
                      '@media (min-width: 992px)': {
                        width: '100%',
                      },
                    }}>
                      <Typography sx={{
                        fontSize: '15px',
                        color: 'black'
                      }} variant="body1" paragraph >
                        Email : <span className="fw-bold">{user && user?.users?.email || 'demo@wagnistrip.com'}</span>

                      </Typography>
                      <Typography sx={{
                        fontSize: '15px',
                        color: 'black'
                      }} variant="body1" paragraph >
                        Kindly change your password and make it secure with a new, strong password. After you have changed the password, kindly click on the change password button, which is displayed on the screen. The new password you have made must meet the following requirements, which are given below for your reference:

                      </Typography>

                      <List sx={{ pl: 2, fontSize: '11px' }}>
                        {[
                          "The password must be case sensitive",
                          "Make sure the password is 8 characters long.",
                          "The password must have 1 number in it.",
                          "The password must contain 1 lowercase number.",
                          "The password must contain 1 uppercase number.",
                          "The password does not include your name or the username.",
                          "Make sure you are not using the previous password which is already been used.",
                        ].map((text, i) => (
                          <ListItem
                            key={i}
                            sx={{
                              display: "list-item",
                              pl: 2,
                              lineHeight: 1.4,
                              pb: 0.3, // reduce vertical padding
                            }}
                          >
                            » {text}
                          </ListItem>
                        ))}
                      </List>

                      <Typography sx={{ mt: 1 }}>

                        » Change Password help

                      </Typography>

                      <Typography variant="body2" sx={{ color: "red", fontWeight: 600, mt: 2 }}>
                        The new password will not expire now, and make sure you create a strong password following the above guidelines.

                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'block',
                        width: '100%',
                        '@media (min-width: 992px)': {
                          width: '50%',
                        },
                      }}
                    >
                      <TextField
                        label="Current Password"
                        type={show.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShow({ ...show, current: !show.current })}>
                                {show.current ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="New Password"
                        type={show.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShow({ ...show, new: !show.new })}>
                                {show.new ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={strength.value}
                            color={strength.color}
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" color={strength.color}>
                          {strength.label}
                        </Typography>
                      </Box>

                      <TextField
                        label="Confirm Password"
                        type={show.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShow({ ...show, confirm: !show.confirm })}>
                                {show.confirm ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />

                      {errorMsg && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {errorMsg}
                        </Alert>
                      )}
                      {successMatch && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          Passwords match.
                        </Alert>
                      )}

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button type="submit" variant="contained" fullWidth onClick={handleSubmit}>
                          Change Password
                        </Button>
                        <Button variant="outlined" fullWidth onClick={() => window.history.back()}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </>
          )}
          {router.pathname === "/logout" && (
            <>
              {router.pathname === "/logout" && (
                <LogoutModal
                  open={openModal}
                  handleClose={handleClose}
                  handleLogout={handleLogout}
                />
              )}
            </>
          )}
        
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;

const UserDropdown = ({ router, user, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNavigate = (path) => {
    handleClose();
    router.navigate(path); // ✅ Use AppProvider router here
  };

  return (
    <Box sx={{ position: "absolute", top: 16, right: 24, zIndex: 1201 }}>
      <IconButton onClick={handleOpen} size="small">
        <Avatar
          sx={{ width: 32, height: 32 }}
          src="/static/images/avatar/1.jpg" // Replace with your user image
          alt="User"
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 150,
            zIndex: 2000,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem sx={{ fontSize: '14px' }}>
          {user?.users?.email || "user@example.com"}
          <br />
          {user?.users?.name || "First"} {user?.users?.lastName || "Last"}
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/profile")}>Profile</MenuItem>

        <MenuItem onClick={() => handleNavigate("/reports/wallet")}>Wallet</MenuItem>
        <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};



const LogoutModal = ({ open, handleClose, handleLogout }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton disabled sx={{ bgcolor: '#e6f0ff', mb: 1 }}>
          <LogoutRoundedIcon sx={{ fontSize: 40, color: '#007FFF' }} />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          Logout
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          Are you sure you want to logout?
        </Typography>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button
            variant="text"
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};