import React, { useEffect, useMemo, useState } from "react";
import {
  TableContainer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  IconButton,
  CircularProgress,
  Link as MUILink,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import { galileoApi } from "../../Api/apiService";
import DownloadIcon from '@mui/icons-material/Download';
import { FaEye } from "react-icons/fa";
import { getAirportDataByCountry } from "../../utils/airlineUtils";
import { Link } from "react-router-dom";
const FILE_BASE = "https://admin.wagnistrip.com/api";

const getPrimaryPassengerName = (item) => {
  // console.log("passenter item => ",item);
  let pd = "";
  if (item?.passengers) {
    pd =
      item?.passengers?.[0]?.passenger_data?.[0]?.CustomerInfo?.PassengerDetails?.[0];
  } else {
    pd = item?.guests[0]
  }
  console.log("geusest => ", pd);
  if (!pd) return "N/A";
  const first = pd.FirstName ? pd.FirstName : pd?.first_name ?? "";
  const last = pd.LastName ? pd.LastName : pd.last_name ?? "";
  const title = pd.Title ? `${pd.Title}. ` : `${pd?.title}.` ?? "";
  const full = `${title}${first} ${last}`.trim();
  return full || "N/A";
};

const fmt = (iso) => {
  try {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return "N/A";
  }
};

const SpecialBooking = ({ type }) => {
  const user = useSelector((s) => s.auth.user);
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log('package data => ', type);

  const fetchWallet = async (pageNumber = 1) => {
    const token = user?.token;
    const reqbody = {
      page: pageNumber
    }
    const apitype = type === 'package' ? "/package/bookings" : "/booking/list"
    try {
      const response = await galileoApi(apitype, reqbody, token);
      console.log("dkldl=> ", response);
      // return
      if (response.status === 200) {
        const blogData = response?.bookings;
        setBlogs(blogData?.data);
        setTotal(blogData.total);
        const lastpage = blogData?.last_page
        setLastPage(lastpage);
        setPerPage(blogData?.per_page);
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
      setLoading(true); // Show loading modal
      setPage(prev => prev + 1);
      setTimeout(() => {
        setLoading(false); // Hide loading modal after 1 second
      }, 500);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setLoading(true); // Show loading modal
      setPage(prev => prev - 1);
      setTimeout(() => {
        setLoading(false); // Hide loading modal after 1 second
      }, 500);
    }
  };

  const downloadTicket = async (id) => {
    const reqbody = {
      id: id
    }
    setLoading(true);
    const apitype = type === 'package' ? "/genrate/pkgPdf" : "/agent/specialFlight-ticket"
    try {
      const response = await galileoApi(apitype, reqbody, {});
      console.log("respnse => ", response);
      if (response.status === true && response?.ticket_url) {
        const pdfUrl = response?.ticket_url;
        setTimeout(() => {
          window.open(pdfUrl, "_blank", "noopener,noreferrer");
          setLoading(false);
        }, 2000);
      } else if (response.status === 400) {
        toast.error(response?.message || 'Invoice not generated');
        setLoading(false);
      } else {
        toast.error(response?.message || 'Invoice not generated');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("fetch blog error", err);
    }
  };

  const disableNext = page >= lastPage;
  return (
    <>
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

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : blogs.length === 0 ? (
          <Typography p={2}>No bookings found on this page.</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  {["id", "Booked At", "Departure", "Arrival", "eTicket", "Passenger", "Status", "Action"].map(
                    (head) => (
                      <TableCell key={head} sx={{ fontWeight: "bold", color: "#0d47a1" }}>
                        {head === "Booked At" && type === "package"
                          ? "Package Title"
                          : head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs && blogs.length > 0 && blogs.map((item, index) => {
                  const sf = item?.special_flight || {};
                  const passenger = getPrimaryPassengerName(item);
                  const status = item?.booking_status ? item?.booking_status : item?.status ? item?.status : '' ?? "N/A";
                  const statusBg =
                    status === "Success" ? "#2e7d32" : status === "confirmed" ? "#2e7d32" : status === "Failed" ? "#d32f2f" : "#ffb300";

                  const docUrl = item?.document ? `${FILE_BASE}${item.document}` : "#";

                  return (
                    <TableRow
                      key={item?.id ?? `${page}-${index}`}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      <TableCell>
                        {type === "package" ? (
                          <Tooltip title={item?.package?.title || ""}>
                          <Link to={`https://www.package.wagnistrip.com/api/payment/success?status=200&transaction_id=${item?.booking_number}`} target="_blank" >  <span>
                              {item?.package?.title?.length > 20
                                ? item.package.title.substring(0, 20) + "..."
                                : item?.package?.title}
                            </span></Link>
                          </Tooltip>
                        ) : (
                          fmt(item?.created_at)
                        )}
                      </TableCell>
                      {
                        type === 'package' ? (
                          <TableCell>{item?.package?.origin ?? ""}</TableCell>
                        ) : (
                          <TableCell>
                            {sf?.legs ? sf?.origin : sf?.ticket_id ? getAirportDataByCountry(sf?.origin, 'city') : sf?.dep_city_name || "N/A"} <br />
                          </TableCell>

                        )
                      }

                      {
                        type === 'package' ? (
                          <TableCell>{item?.package?.destination ?? ""}</TableCell>
                        ) : (
                          <TableCell>
                            {sf?.legs ? sf?.destination : sf?.ticket_id ? getAirportDataByCountry(sf?.destination, 'city') : sf?.arr_city_name || "N/A"} <br />
                          </TableCell>

                        )
                      }
                      <TableCell>{item?.refrence_id ? item?.refrence_id : item?.booking_number ? item?.booking_number : item?.eticket_id || "-"}</TableCell>
                      <TableCell>{passenger}</TableCell>
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
                            backgroundColor: statusBg,
                          }}
                        >
                          {status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {item?.document ? (
                          <MUILink
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                          >
                            download
                          </MUILink>
                        ) : sf?.ticket_id ? (
                          <MUILink
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                          >
                            <DownloadIcon onClick={() => downloadTicket(item.id)} />
                          </MUILink>
                        ) : item?.booking_number ? (
                           <MUILink
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{ cursor: "pointer" }}
                              >
                                <DownloadIcon onClick={() => downloadTicket(item.booking_number)} />
                              </MUILink>
                        ) : (
                          <Typography variant="body2" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
              <Typography variant="body2" mr={2}>
                {(page - 1) * perPage + 1} -{' '}
                {Math.min(page * perPage, total)} of {total}
              </Typography>
              <IconButton onClick={handlePrev} disabled={page === 1}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNext} disabled={disableNext}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </>
        )}
      </TableContainer>

    </>
  );
};

export default SpecialBooking;
