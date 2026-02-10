import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton, CircularProgress } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import { galileoApi } from "../../Api/apiService";
import LoadingPage from "../../LoadingPage";
import { setCommonChips } from "../../redux/actions/bookingActions";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Coinstranctions = () => {
    const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
    const user = useSelector((state) => state.auth.user);
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(9);
    const [loadingcompon, setloadingcompon] = useState(false);
    const dispatch = useDispatch();



    const fetchWallet = async (pageNumber = 1) => {
        const token = user?.token;
        const reqbody = {
            page: pageNumber
        }
        try {
            const response = await galileoApi("/agent/chips-History", reqbody, token);
            console.log("respon = > ", response);
            if (response.status === 200) {
                const blogData = response?.History;
                dispatch(setCommonChips(response?.coin || 0));
                setBlogs(blogData?.data);
                setTotal(blogData?.total);
                const lastpage = blogData?.last_page
                setLastPage(lastpage);
                setPerPage(blogData?.per_page);
            }
            // setBlog(blogDatad); 
        } catch (err) {
            console.error("fetch blog error", err);
        }
    };
    useEffect(() => {
        fetchWallet(page);
    }, [page])

    const handleNext = () => {
        if (page < lastPage) {
            setloadingcompon(true); // Show loading modal
            setPage(prev => prev + 1);
            setTimeout(() => {
                setloadingcompon(false); // Hide loading modal after 1 second
            }, 500);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setloadingcompon(true); // Show loading modal
            setPage(prev => prev - 1);
            setTimeout(() => {
                setloadingcompon(false); // Hide loading modal after 1 second
            }, 500);
        }
    };

    return (
        <>
            <Box>


                <Paper
                    elevation={5}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                        background: "linear-gradient(135deg, #004d7a, #008793)",
                        color: "#fff",
                        mb: 4,
                    }}
                >
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item>
                            <Avatar
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    width: 60,
                                    height: 60,
                                }}
                            >
                                <MonetizationOnIcon fontSize="large" />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                Total Target Price
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                ₹{greenChipsPrice || 0.00}
                            </Typography>
                        </Grid>

                    </Grid>
                </Paper>

                {/* Modal: Add Fund */}


                {/* Transactions */}
                <Typography variant="h5" fontWeight="bold" gutterBottom mt={5}>
                    Recent Transactions
                </Typography>

                <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                    {loadingcompon ? (
                                        // <LoadingPage />
                                        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                                            <CircularProgress />
                                        </Box>
                                    ):
                    <List>
                        {blogs && blogs.length > 0 && blogs.map((tx, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <Grid container alignItems="center">
                                        {/* Avatar */}
                                        <Grid item xs={1}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: tx?.type
                                                            === 'Credit' ? '#4caf5020' : '#f4433620',
                                                        color: tx?.type
                                                            === 'Credit' ? '#4caf50' : '#f44336',
                                                    }}
                                                >
                                                    {tx?.type
                                                        === 'Credit' ? <AddCircleIcon /> : <RemoveCircleIcon />}
                                                </Avatar>
                                            </ListItemAvatar>
                                        </Grid>

                                        {/* Transaction ID & Date */}
                                        <Grid item xs={4}>
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={600}>{tx?.reason}</Typography>
                                                }
                                                secondary={
                                                    <Typography fontSize={13} color="#777">
                                                        {dayjs(tx?.created_at).format('MMM DD, YYYY')}
                                                    </Typography>
                                                }
                                            />
                                        </Grid>

                                        {/* type
 */}
                                        <Grid item xs={3}>
                                            <Typography
                                                color={tx?.type
                                                    === 'Credit' ? '#4caf50' : '#f44336'}
                                                fontWeight={600}
                                                textAlign="center"
                                            >
                                                {tx?.type
                                                }
                                            </Typography>
                                        </Grid>

                                        {/* Amount */}
                                        <Grid item xs={4}>
                                            <Typography
                                                fontWeight="bold"
                                                color={tx?.type
                                                    === 'Credit' ? '#4caf50' : '#f44336'}
                                                textAlign="right"
                                            >
                                                {tx?.type
                                                    === 'Credit' ? '+' : '-'} {parseFloat(tx.coins).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>

                                {index < blogs.length - 1 && <Divider />}
                            </React.Fragment>

                        ))}
                    </List>

}
                    {/* Pagination UI */}
                    <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
                        <Typography variant="body2" mr={2}>
                            {(page - 1) * perPage + 1} -{' '}
                            {Math.min(page * perPage, total)} of {total}
                        </Typography>
                        <IconButton onClick={handlePrev} disabled={page === 1}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={handleNext} disabled={page === lastPage}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Box>
        </>

    );
};

export default Coinstranctions

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { ListItemText } from '@mui/material';
// import { Grid } from '@mui/joy';
// const rows = [
//     {
//         "m_Name": "Jan",
//         "Domestic": 15,
//         "international": 18,
//         "total_amount": 4000,
//         "price": 3.99,
//         "history": [
//             {
//                 "date": "2020-01-05",
//                 "customerId": "11091700",
//                 "amount": 3
//             },
//             {
//                 "date": "2020-01-02",
//                 "customerId": "Anonymous",
//                 "amount": 1
//             }
//         ]
//     },
//     {
//         "m_Name": "Feb",
//         "Domestic": 7,
//         "international": 6,
//         "total_amount": 40003,
//         "price": 4.99,
//         "history": [
//             {
//                 "date": "2020-01-05",
//                 "customerId": "11091700",
//                 "amount": 3
//             },
//             {
//                 "date": "2020-01-02",
//                 "customerId": "Anonymous",
//                 "amount": 1
//             }
//         ]
//     }
// ];

// function Row({ row,id}) {
//     const [open, setOpen] = React.useState(false);

//     return (
//         <>
//             <TableRow sx={{
//                             backgroundColor: id % 2 === 0 ? "#f9f9f9" : "#ffffff",
//                             "&:hover": {
//                                 backgroundColor: "#e3f2fd",
//                             },
//                             transition: "background-color 0.3s ease",
//                         }}>
//                 <TableCell>
//                     <IconButton
//                         aria-label="expand row"
//                         size="small"
//                         onClick={() => setOpen(!open)}
//                     >
//                         {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                     </IconButton>
//                 </TableCell>
//                 <TableCell component="th" scope="row">
//                     {/* {row.name} dd */}
//                     <Grid item xs={4}>
//                         <ListItemText
//                             primary={
//                                 <Typography fontWeight={600}>{row?.m_Name ?? "N/A"}</Typography>
//                             }
//                             secondary={
//                                 <Typography fontSize={13} color="#777">
//                                     {/* {dayjs(tx?.created_at).format('MMM DD, YYYY')} */}
//                                     {/* 2020-01-05 */}
//                                 </Typography>
//                             }
//                         />
//                     </Grid>
//                 </TableCell>
//                 <TableCell>{row?.Domestic ?? "N/A"}</TableCell>
//                 <TableCell>{row?.international ?? "N/A"}</TableCell>
//                 <TableCell>{(row?.Domestic + row?.international)}</TableCell>
//                 <TableCell>{row.total_amount ?? "N/A"}</TableCell>
//             </TableRow>
//             <TableRow>
//                 <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                     <Collapse in={open} timeout="auto" unmountOnExit>
//                         <Box sx={{ margin: 1 }}>
//                             <Typography variant="h6" gutterBottom component="div">
//                                 History
//                             </Typography>
//                             <Table size="small" aria-label="purchases">
//                                 <TableHead>
                                    
//                                     <TableRow sx={{ backgroundColor: "#0e0e0e"}}>
//                                         <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Date</TableCell>
//                                         <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Domestic</TableCell>
//                                         <TableCell sx={{ fontWeight: "bold", color: "#fff" }} align="right">International</TableCell>
//                                         <TableCell sx={{ fontWeight: "bold", color: "#fff" }} align="right">Total price (₹)</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {row.history.map((historyRow) => (
//                                         <TableRow key={historyRow.date}>
//                                             <TableCell component="th" scope="row">
//                                                 {historyRow.date}
//                                             </TableCell>
//                                             <TableCell>{historyRow.customerId}</TableCell>
//                                             <TableCell align="right">{historyRow.amount}</TableCell>
//                                             <TableCell align="right">
//                                                 {Math.round(historyRow.amount * row.price * 100) / 100}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </Box>
//                     </Collapse>
//                 </TableCell>
//             </TableRow>
//         </>
//     );
// }


// export default function Coinstranctions() {
//     return (
//         <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 1, boxShadow: 4 }}>
//             <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 sx={{
//                     p: 2,
//                     color: "#ffffff",
//                     background: "linear-gradient(to right, rgb(142 164 189), rgb(184 188 193))",
//                     borderTopLeftRadius: 6,
//                     borderTopRightRadius: 6,
//                 }}
//             >
//                 Booking Details
//             </Typography>
//             <Table aria-label="collapsible table">
//                 <TableHead>
//                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
//                         {[
//                             "Id",
//                             "Months",
//                             "Domestic",
//                             "International",
//                             "Total Booking",
//                             "Total Amt",
//                         ].map((head, index) => (
//                             <TableCell align="start" key={index} sx={{ fontWeight: "bold", color: "#0d47a1" }}>
//                                 {head}
//                             </TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {rows.map((row,index) => (
//                         <Row key={index} row={row} id={index} />
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }
