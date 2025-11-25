import React, { useEffect, useState } from "react";
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box, Card, TablePagination, IconButton, CircularProgress, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Link as MUILink,
} from "@mui/material";
import { Email, LibraryBooks } from '@mui/icons-material';
import { useDispatch, useSelector } from "react-redux";
// import DownloadIcon from '@mui/icons-material/Download';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import toast from 'react-hot-toast';
import { galileoApi } from "../../Api/apiService";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from "react-router-dom";
import { getAirportDataByCountry } from "../../utils/airlineUtils";
import { setCommonWallet } from "../../redux/actions/bookingActions";

const DashBooking = ({ type, handleClose }) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [bookingstatus, setBookingstatus] = useState({
        'Oneway Booking': 0,
        'Roundtrip Booking': 0,
        'Total Booking': 0
    })
    const [loadingcompon, setloadingcompon] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalAction, setModalAction] = useState(null); // "confirm" or "cancel"
    const [loading, setLoading] = useState(false);

    // Open modal with action type
    const handleOpenModal = (booking, action) => {
        setSelectedBooking(booking);
        setModalAction(action);
        setOpenModal(true);
    };

    // Confirm booking
    const handleConfirmBooking = async () => {
        setLoading(true);
        const token = user?.token;
        const reqbody = {
            booking_id: selectedBooking?.id,
            earnCoin: selectedBooking?.earnCoins,
            amount: selectedBooking?.payment?.amount
        }
        console.log("Confirm booking for", reqbody);


        const apiType = "/agent/debit-payment"
        try {
            const response = await galileoApi(apiType, reqbody, token);
            if (response?.status === true) {
                toast.success('Ticket is confirm successfully');
                dispatch(setCommonWallet(response?.balance));
                await new Promise((res) => setTimeout(res, 1500));
                handleClose()
                setOpenModal(false);
            } else {
                toast.success(response?.message || 'technical issues contact to company');
                setLoading(false);
                setOpenModal(false);
                handleClose()
            }

        } finally {
            setLoading(false);
        }
    };

    // Cancel booking
    const handleCancelBooking = async () => {
        setLoading(true);
        const token = user?.token;
        const reqbody = {
            booking_id: selectedBooking?.id,
        }
        console.log("Confirm booking for", reqbody);


        const apiType = "/agent/booking-Cancel "
        try {
            const response = await galileoApi(apiType, reqbody, token);
            if (response?.status === true) {
                toast.success('Ticket is confirm successfully');
                dispatch(setCommonWallet(response?.balance));
                await new Promise((res) => setTimeout(res, 1500));
                handleClose()
                setOpenModal(false);
            } else {
                toast.success(response?.message || 'technical issues contact to company');
                setLoading(false);
                setOpenModal(false);
                handleClose()
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchWallet = async (pageNumber = 1) => {
        const token = user?.token;
        const reqbody = {
            page: pageNumber
        }

        const apiType = type === 'booking' ? "/agent/bookings" : "agent/Hold-bookings"
        try {
            const response = await galileoApi(apiType, reqbody, token);
            if (response.status === 200) {
                const blogData = response?.bookings;
                setBlogs(blogData.data);
                setTotal(blogData.total);
                setBookingstatus({
                    'Oneway Booking': response?.onewayCount || 0,
                    'Roundtrip Booking': response?.roundtripCount || 0,
                    'Total Booking': response?.totalBookings || 0,
                });
                const lastpage = blogData?.last_page
                setLastPage(lastpage);
                setPerPage(blogData.per_page);
            } else {
                setBlogs([]);
            }
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

    const downloadTicket = async (id) => {
        const token = user?.token;
        const reqbody = {
            booking_id: id
        }

        try {
            const response = await galileoApi("/agent/genrate-invoice", reqbody, token);
            console.log("respnse => ", response);
            if (response.status === true && response?.invoice_url) {
                // const pdfUrl = response.invoice_url;

                // // Create a hidden <a> element and click it
                // const link = document.createElement("a");
                // link.href = pdfUrl;
                // link.setAttribute("download", `invoice_${id}.pdf`); // filename
                // document.body.appendChild(link);
                // link.click();
                // link.remove();
                const pdfUrl = response.invoice_url;

                // Open the invoice in a new browser tab
                window.open(pdfUrl, "_blank", "noopener,noreferrer");
            } else if (response.status === 400) {
                toast.error(response?.message || 'Invoice not generated');
            } else {
                toast.error(response?.message || 'Invoice not generated');
            }
        } catch (err) {
            console.error("fetch blog error", err);
        }
    };

    return (
        <div>
            {
                type === 'booking' && (
                    <Grid container spacing={2}>

                        {
                            Object.entries(bookingstatus).map(([label, total], index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            minHeight: 160,
                                            p: 1.5,
                                            borderRadius: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <LibraryBooks sx={{ fontSize: 40, color: '#d84315' }} />
                                            <Typography>📈 +3.6%</Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                            {label}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {total || 0}
                                        </Typography>
                                    </Card>

                                </Grid>
                            ))
                        }
                    </Grid>

                )
            }


            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 1, boxShadow: 4 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        p: 2,
                        color: "#ffffff",
                        background: "linear-gradient(to right, rgb(142 164 189), rgb(184 188 193))",
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                    }}
                >
                    Booking Details
                </Typography>
                {loadingcompon ? (
                    // <LoadingPage />
                    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) :

                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                {[
                                    "Date",
                                    "Departure",
                                    "Arrival",
                                    "Pnr",
                                    "Name",
                                    "Time To Leave",
                                    "Status",
                                    "Action",
                                    "Invoice",
                                ].map((head, index) => (
                                    <TableCell key={index} sx={{ fontWeight: "bold", color: "#0d47a1" }}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {blogs && blogs.length > 0 && blogs
                                .map((item, index) => {
                                    // Get the departure date from the first onward segment
                                    const departureDateRaw = item?.flight?.info?.onward?.[0]?.["@attributes"]?.DepartureTime;
                                    let formattedDepartureDate = "N/A";
                                    if (departureDateRaw) {
                                        const departureDate = new Date(departureDateRaw);
                                        const day = departureDate.getDate().toString().padStart(2, "0");
                                        const month = departureDate.toLocaleString("en-US", { month: "short" });
                                        const year = departureDate.getFullYear();
                                        formattedDepartureDate = `${day}-${month}-${year}`;
                                    }

                                    // Extract origin and final destination
                                    const origin = item?.flight?.info?.onward?.[0]?.["@attributes"]?.Origin || "N/A";
                                    const lastSegmentIndex = item?.flight?.info?.onward?.length - 1;
                                    const destination = item?.flight?.info?.onward?.[lastSegmentIndex]?.["@attributes"]?.Destination || "N/A";

                                    // PNR
                                    const pnr = item?.passangerPNR || "N/A";

                                    // Passenger name
                                    const passengerName = item?.passengers?.[0]
                                        ? `${item.passengers[0].first_name} ${item.passengers[0].last_name}`
                                        : "N/A";

                                    // Convert created_at to IST and compute time difference
                                    const convertToIST = (utcDateTime) => {
                                        const date = new Date(utcDateTime);
                                        return new Date(
                                            date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                                        );
                                    };

                                    const createdAtUTC = item?.created_at;
                                    const createdAtIST = convertToIST(createdAtUTC);
                                    const currentTime = convertToIST(new Date().toISOString());

                                    const timeDifferenceMs = currentTime - createdAtIST;
                                    const totalSeconds = Math.floor(timeDifferenceMs / 1000);
                                    const totalMinutes = Math.floor(totalSeconds / 60);
                                    const totalHours = Math.floor(totalMinutes / 60);
                                    const remainingMinutes = totalMinutes % 60;

                                    let timeToLeave;
                                    if (totalHours < 24) {
                                        timeToLeave = `${totalHours} h(s) ${remainingMinutes} m(s) ago`;
                                    } else {
                                        const totalDays = Math.floor(totalHours / 24);
                                        const remainingHours = totalHours % 24;
                                        timeToLeave = `${totalDays} d(s) ${remainingHours} h(s) ${remainingMinutes} m(s) ago`;
                                    }

                                    // const docUrl = item?.document ? `${FILE_BASE}${item.document}` : "#";

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                                                "&:hover": {
                                                    backgroundColor: "#e3f2fd",
                                                },
                                                transition: "background-color 0.3s ease",
                                            }}
                                        >
                                            <TableCell>{formattedDepartureDate}</TableCell>
                                            <TableCell>{getAirportDataByCountry(origin, 'city')}</TableCell>
                                            <TableCell>{getAirportDataByCountry(destination, 'city')}</TableCell>
                                            <TableCell>{pnr}</TableCell>
                                            <TableCell>{passengerName}</TableCell>
                                            <TableCell>{timeToLeave}</TableCell>



                                            {
                                                type === 'booking' ? (
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                                color: "#fff",
                                                                display: "inline-block",
                                                                backgroundColor:
                                                                    (item?.status === 'Hold' && item?.booking_status === 'Cancel' || item?.status === 'Cancelled' && item?.booking_status === 'Cancel' || item?.status === 'Cancelled' && item?.booking_status === 'Hold' || item?.status === 'Cancelled' && item?.booking_status === 'Unknown')
                                                                        ? "#d32f2f" : (item?.status === 'Hold' && item?.booking_status === 'Unknown' || item?.status === 'Hold' && item?.booking_status === 'Hold' || item?.status === 'Confirmed' && item?.booking_status === 'Confirm' || item?.status === 'Confirmed' && item?.booking_status === 'Unknown') ? '#2e7d32'
                                                                            : item.status === "Failed"
                                                                                ? "#d32f2f"
                                                                                : "#ffb300",
                                                            }}
                                                        >
                                                            {(item?.status === 'Hold' && item?.booking_status === 'Cancel' || item?.status === 'Cancelled' && item?.booking_status === 'Cancel' || item?.status === 'Cancelled' && item?.booking_status === 'Hold' || item?.status === 'Cancelled' && item?.booking_status === 'Unknown') ? 'Cancel' : (item?.status === 'Hold' && item?.booking_status === 'Unknown' || item?.status === 'Hold' && item?.booking_status === 'Hold' || item?.status === 'Confirmed' && item?.booking_status === 'Confirm' || item?.status === 'Confirmed' && item?.booking_status === 'Unknown') ? 'Confirm' : item.status}
                                                        </Typography>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                                color: "#fff",
                                                                display: "inline-block",
                                                                backgroundColor:
                                                                    item.status === "Hold"
                                                                        ? "#ffb300"
                                                                        : "#d32f2f",
                                                            }}
                                                        >
                                                            {item.status}
                                                        </Typography>
                                                    </TableCell>
                                                )
                                            }

                                            {
                                                type === 'booking' ? (
                                                    <TableCell>
                                                        <Link
                                                            to={`/api/payment/success?status=200&transaction_id=${item?.Transaction_id}`}
                                                            target="_blank"
                                                            underline="hover"
                                                        >
                                                            <Typography component="span">view</Typography>
                                                        </Link>
                                                    </TableCell>
                                                ) : item.status === 'Hold' ? (
                                                    <TableCell>
                                                        <div style={{ display: "flex", width: "100%" }}>
                                                            {/* Confirm Half */}
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                onClick={() => handleOpenModal(item, "confirm")}
                                                                style={{
                                                                    flex: 1,
                                                                    borderRadius: "4px 0 0 4px", // round only left side
                                                                }}
                                                            >
                                                                Confirm
                                                            </Button>

                                                            {/* Cancel Half */}
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleOpenModal(item, "cancel")}
                                                                style={{
                                                                    flex: 1,
                                                                    borderRadius: "0 4px 4px 0", // round only right side
                                                                    borderLeft: "none", // remove double border between buttons
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </TableCell>


                                                ) : (
                                                    <TableCell>
                                                        <Typography component="span">
                                                            Not Applicable
                                                        </Typography>
                                                    </TableCell>
                                                )
                                            }
                                            <TableCell>
                                                {(type === 'booking') ? (
                                                    <MUILink
                                                        // href={docUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        underline="hover"
                                                        sx={{ cursor: "pointer" }}
                                                    >
                                                        {
                                                            (item?.status === 'Hold' && item?.booking_status === 'Unknown' || item?.status === 'Hold' && item?.booking_status === 'Hold' || item?.status === 'Confirmed' && item?.booking_status === 'Confirm' || item?.status === 'Confirmed' && item?.booking_status === 'Unknown') ? <DownloadIcon onClick={() => downloadTicket(item.id)} /> : 'N/A'
                                                        }
                                                        {/* <DownloadIcon onClick={() => downloadTicket(item.id)} /> */}
                                                    </MUILink>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                        </TableBody>
                    </Table>

                }
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
            </TableContainer>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                {
                    loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <DialogTitle>
                                {modalAction === "confirm" ? "Confirm Ticket" : "Cancel Ticket"}
                            </DialogTitle>
                            <DialogContent>
                                {selectedBooking && (
                                    <div style={{ display: "flex", alignItems: "stretch" }}>
                                        {/* Left side: Ticket Details */}
                                        <div style={{ flex: 1, paddingRight: "16px", borderRight: "1px solid #ccc" }}>
                                            <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: 600 }} color="black">
                                                Ticket Details
                                            </Typography>
                                            <Typography color="black" variant="body2">
                                                <strong>PNR:</strong> {selectedBooking.passangerPNR}
                                            </Typography>
                                            <Typography color="black" variant="body2">
                                                <strong>Passenger:</strong> {selectedBooking.passengers?.[0]?.first_name}{" "}
                                                {selectedBooking.passengers?.[0]?.last_name}
                                            </Typography>
                                            <Typography color="black" variant="body2">
                                                <strong>Route:</strong>{" "}
                                                {getAirportDataByCountry(
                                                    selectedBooking?.flight?.info?.onward?.[0]?.["@attributes"]?.Origin,
                                                    "city"
                                                )}{" "}
                                                →{" "}
                                                {getAirportDataByCountry(
                                                    selectedBooking?.flight?.info?.onward?.slice(-1)?.[0]?.["@attributes"]?.Destination,
                                                    "city"
                                                )}
                                            </Typography>
                                            <Typography color="black" variant="body2">
                                                <strong>Status:</strong> {selectedBooking.status}
                                            </Typography>
                                        </div>

                                        {/* Right side: Payment Details */}
                                        <div style={{ flex: 1, paddingLeft: "16px" }}>
                                            <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: 600 }} color="black">
                                                Payment Details
                                            </Typography>

                                            <Typography color="black" variant="body2">
                                                <strong>Amount:</strong> {selectedBooking?.payment?.amount || "N/A"}
                                            </Typography>
                                            <Typography color="black" variant="body2">
                                                <strong>Commission Earn :</strong> {selectedBooking.earnCoins || "N/A"}
                                            </Typography>

                                        </div>
                                    </div>
                                )}
                                {modalAction === "confirm" && (
                                    <Typography
                                        variant="body2"
                                        color="error"
                                        sx={{ marginTop: 2, textAlign: "center", fontWeight: 500 }}
                                    >
                                        You can hold this ticket only for 1 hour 30 minutes. Please pay and confirm before time runs out.
                                    </Typography>
                                )}
                            </DialogContent>
                        </>
                    )
                }

                <DialogActions>
                    <Button color="error" onClick={() => setOpenModal(false)} disabled={loading}>
                        Close
                    </Button>
                    {modalAction === "confirm" ? (
                        <Button variant="contained" color="success" onClick={handleConfirmBooking} disabled={loading}>
                            {loading ? "Loading..." : "Pay with wallet"}
                        </Button>
                    ) : (
                        <Button variant="contained" color="error" onClick={handleCancelBooking} disabled={loading}>
                            {loading ? "Loading..." : "Cancel this ticket"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DashBooking