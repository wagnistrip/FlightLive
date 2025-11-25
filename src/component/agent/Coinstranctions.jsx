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
                                Total Commission Earn
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