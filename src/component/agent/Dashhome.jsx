
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { Menu, MenuItem, } from "@mui/material";
import { useSelector } from "react-redux";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
const Dashhome = ({ data, cards, data1, totalbooking }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const walletAmout = useSelector((state) => state.booking.walletAmount);
  const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
  const years = Object.keys(data1).map(Number); // [2025, 2026, 2027]
  const defaultYear = years[0];
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [chartData, setChartData] = useState(data1[defaultYear]);

  const user = useSelector((state) => state.auth.user);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const totalGrowth = chartData.reduce(
    (sum, item) => sum + item.Domestic + item.International,
    0
  );

  useEffect(() => {
    if (data1[selectedYear]) {
      setChartData(data1[selectedYear]);
    }
  }, [selectedYear]);


  return (
    <>
      <CardContent sx={{ padding: "8px 0" }}>
        <Box
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            backgroundColor: "#fff", // optional
            padding: "8px 0",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              animation: "marquee 15s linear infinite",
              "@keyframes marquee": {
                "0%": { transform: "translateX(100%)" },
                "100%": { transform: "translateX(-100%)" },
              },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            <AddIcCallIcon sx={{ marginRight: "4px" }} />
            <Typography
              variant="h5"
              sx={{ marginRight: "8px" }}
              fontWeight={600}
            >
              +91 9654519719
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.8, color: "red" }}
            >
              24×7 Helpline ( Account's & Support )
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Grid sx={{ mb: 4 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)',
            borderRadius: 3,
            p: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  color: '#1565c0',
                  mb: 1,
                }}
              >
                Hi, Welcome back 👋
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: '1.25rem',
                  color: '#424242',
                  fontWeight: 500,
                }}
              >
                {user && user?.users && user?.users?.name
                  ? `${user?.users?.name} ${user?.users?.lastName}`
                  : 'Sunil Narine'}
              </Typography>
              <Box mt={1}>
                {user && user?.users?.agent_type === "A" ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    🆓 Free Portal
                  </Box>
                ) : user?.users?.agent_type === "B" ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      backgroundColor: "#fff3e0",
                      color: "#ef6c00",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    ⭐ Paid Portal
                  </Box>
                ) : user?.users?.agent_type === "C" ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      backgroundColor: "#fff3e0",
                      color: "#ef6c00",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    ⭐ Paid Expert Portal
                  </Box>
                ) : null}
              </Box>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  px: 2,
                  py: 1,
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {greenChipsPrice || 0} Target Price
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>



      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: card.bgColor,
                borderRadius: 3,
                p: 2.5,
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <Box display="flex" justifyContent="space-between">
                {card?.icon}
                <Typography fontWeight="bold" fontSize={14}>
                  📈 {card?.change}
                </Typography>
              </Box>


              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {card?.title}
              </Typography>


              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {card?.value}
              </Typography>


              <LineChart width={100} height={30} data={card?.data}>
                <Line type="monotone" dataKey="pv" stroke={card?.chartColor} strokeWidth={2} dot={false} />
              </LineChart>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {/* Earnings Card */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1, height: '250px' }}>
            <Card
              sx={{
                backgroundColor: "#5B2C91",
                color: "white",
                borderRadius: "12px",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                height: "100%",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ backgroundColor: "#6A3DBF", borderRadius: "8px", padding: "8px" }}>
                  <AccountBalanceWalletIcon sx={{ color: "white" }} />
                </Box>
                <IconButton sx={{ color: "white" }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <CardContent sx={{ padding: "8px 0" }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h5" fontWeight={600}>₹{walletAmout || 0.00}</Typography>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: "16px",
                      marginLeft: "4px",
                      backgroundColor: "#9164CC",
                      borderRadius: "50%",
                      padding: "4px",
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8, color: 'white' }}>Total Wallet Amount</Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} /> {/* Space filler to match height */}
            </Card>
          </Box>
        </Grid>


        {/* Orders Card */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Card
              sx={{
                backgroundColor: "#2196F3",
                color: "white",
                borderRadius: "12px",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                height: "100%",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ backgroundColor: "#1976D2", borderRadius: "8px", padding: "8px" }}>
                  <AssignmentTurnedInIcon sx={{ color: "white" }} />
                </Box>
                <IconButton sx={{ color: "white" }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>


              <CardContent sx={{ padding: "8px 0" }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h5" fontWeight={600}>{totalbooking || 0}</Typography>
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: "16px",
                      marginLeft: "4px",
                      backgroundColor: "#64B5F6",
                      borderRadius: "50%",
                      padding: "4px",
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8, color: 'white' }}>Total Booking</Typography>
              </CardContent>

            </Card>
          </Box>
        </Grid>
      </Grid>


      <Card sx={{ p: 2, borderRadius: 2, bgcolor: '#f9fbfd', mt: 4, mb: 2, }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" sx={{ color: "#999" }}>Total Growth / Years</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>₹{totalGrowth.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              sx={{ borderRadius: 2 }}
            >
              {selectedYear}
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {years && years?.map((year) => (
                <MenuItem
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    handleClose();
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Menu>

          </Box>
        </Box>


        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Domestic" stackId="a" fill="#90CAF9" />
              <Bar dataKey="International" stackId="a" fill="#7E57C2" />
              {/* <Bar dataKey="Profit" stackId="a" fill="#7E57C2" />
              <Bar dataKey="Maintenance" stackId="a" fill="#EDE7F6" /> */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>


    </>
  )
}

export default Dashhome