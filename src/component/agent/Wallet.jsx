import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import { galileoApi } from "../../Api/apiService";
import { setCommonWallet } from "../../redux/actions/bookingActions";
import AddFundModal from "./AddFundModal";

const Wallet = () => {
    const walletAmout = useSelector((state) => state.booking.walletAmount);
    const user = useSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(9);
    const [loadingcompon, setloadingcompon] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const dispatch = useDispatch();
    const fetchWallet = async (pageNumber = 1) => {
        const token = user?.token;
        const reqbody = {
            page: pageNumber
        }
        try {
            const response = await galileoApi("/agent/transactions", reqbody, token);
            console.log("respon = > ", response);

            if (response.status === true) {
                const blogData = response?.transactions;
                dispatch(setCommonWallet(response?.total_balance || 0));
                setBlogs(blogData.data);
                setTotal(blogData.total);
                const lastpage = blogData?.last_page
                setLastPage(lastpage);
                setPerPage(blogData.per_page);
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
                {/* Wallet Balance Section */}

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
                                <AccountBalanceWalletIcon fontSize="large" />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                Current Balance
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                ₹{walletAmout || 0.00}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={handleClickOpen}
                                variant="contained"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 8,
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                                    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                                    "&:hover": {
                                        background: "linear-gradient(to right, #00b09b, #a1d43e)",
                                    },
                                }}
                            >
                                Add Fund
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

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
                                                        bgcolor: tx?.status === 'Credit' ? '#4caf5020' : '#f4433620',
                                                        color: tx?.status === 'Credit' ? '#4caf50' : '#f44336',
                                                    }}
                                                >
                                                    {tx?.status === 'Credit' ? <AddCircleIcon /> : <RemoveCircleIcon />}
                                                </Avatar>
                                            </ListItemAvatar>
                                        </Grid>

                                        {/* Transaction ID & Date */}
                                        <Grid item xs={4}>
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={600}>{tx?.Transaction_id}</Typography>
                                                }
                                                secondary={
                                                    <Typography fontSize={13} color="#777">
                                                        {dayjs(tx?.created_at).format('MMM DD, YYYY')}
                                                    </Typography>
                                                }
                                            />
                                        </Grid>

                                        {/* Status */}
                                        <Grid item xs={3}>
                                            <Typography
                                                color={tx?.status === 'Credit' ? '#4caf50' : '#f44336'}
                                                fontWeight={600}
                                                textAlign="center"
                                            >
                                                {tx?.status}
                                            </Typography>
                                        </Grid>

                                        {/* Amount */}
                                        <Grid item xs={4}>
                                            <Typography
                                                fontWeight="bold"
                                                color={tx?.status === 'Credit' ? '#4caf50' : '#f44336'}
                                                textAlign="right"
                                            >
                                                {tx?.status === 'Credit' ? '+' : ''} {parseFloat(tx.amount).toFixed(2)}
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
            <AddFundModal open={open} onClose={() => setOpen(false)}/>
        </>

    );
};

export default Wallet;