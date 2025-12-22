import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box,
  Stack,
  Paper,
  TextField,
  Snackbar,
  CircularProgress,
  Alert as MuiAlert,
  Checkbox,
} from "@mui/material";

// ✅ Import images
import scannercode from "../../image/Scannercode.png";
import gpay from "../../image/gpay.png";
import phonepay from "../../image/phonepay.png";
import bhim from "../../image/bhim.png";
import paytm from "../../image/paytm.png";
import amazon from "../../image/amazon.png";
import { decryptPayload, encryptPayload, galileoApi, porfileImgeupload } from "../../Api/apiService";
import { useSelector } from "react-redux";
import { getDeductedAmount, getDeductionPercent, paymentModes } from "../../utils/airlineUtils";
import toast from "react-hot-toast";

const AddFundModal = ({ open, onClose }) => {
  const [option, setOption] = useState("neft");
  const [fileUploaded, setFileUploaded] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [agree, setAgree] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const user = useSelector((state) => state.auth.user);

  const BankDetails = [
    {
      id: 1,
      bankname: "ICICI BANK Ltd",
      accountname: "WAGNISTRIP OPC PRIVATE LIMITED",
      accountnumber: "235605000908",
      ifccode: "ICIC0002356",
      branch: "Moti Nagar",
    },
    {
      id: 2,
      bankname: "HDFC BANK Ltd",
      accountname: "WAGNISTRIP OPC PRIVATE LIMITED",
      accountnumber: "50200057959381",
      ifccode: "HDFC0001443",
      branch: "Tilak Nagar",
    },
  ];

  const handleOptionChange = (_, newOption) => {
    if (newOption) setOption(newOption);
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) setFileUploaded(e.target.files[0]);
  };

  const handleSubmit = async () => {

    if(user?.users?.email === "kanishka@wagnistrip.com"){
      toast.error('You have no permission for fund upload. Please contact administration.')
      setFileUploaded(null)
      return
    }

    if (!fileUploaded) {
      setSnackbar({
        open: true,
        message: "Please upload an image",
        severity: "error",
      });
      return;
    }

    const token = user?.token;
    const formData = new FormData();
    formData.append("payment_image", fileUploaded);

    setSubmitting(true);

    try {
      const response = await porfileImgeupload(
        "/wallent/image-upload",
        formData,
        token,
      );

      if (response?.status === 201) {
        setSnackbar({
          open: true,
          message: "Payment uploaded successfully!",
          severity: "success",
        });
        setFileUploaded(null);
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Failed to upload image",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Image upload failed. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEasebuzzPayment = async () => {
    
    if(user?.users?.email === "kanishka@wagnistrip.com"){
        toast.error('You have no permission for fund upload. Please contact administration.')
        return
    }

    const token = user?.token || ''
    const payload = {
      amount: Number(amount) || 0,
      apitype: 'fundUpload' || '',
    };

    try {

      // console.log("Sending Easebuzz Payload:", payload);
      const encryptedPayload = encryptPayload(payload || '');
      // return;
      const response = await galileoApi("/payment/initiate", { payload: encryptedPayload }, token);
      const decryptedResponse1 = decryptPayload(response?.data || "");
      const parsed = JSON.parse(decryptedResponse1);
      if (parsed?.status === 200 && parsed?.redirect_url) {
        // alert("Raushan");
        const redirectUrl = parsed?.redirect_url;

        if (redirectUrl) {
          window.location.href = redirectUrl;

        } else {
          console.error("No redirect URL received in the response");
        }
      }

    } catch (error) {
      console.error("Error calling Easebuzz API:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">Add Fund</DialogTitle>
        <DialogContent dividers>
          <ToggleButtonGroup
            value={option}
            exclusive
            onChange={handleOptionChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="neft" sx={{ fontWeight: "bold", py: 1.5 }}>
              IMPS / NEFT
            </ToggleButton>
            <ToggleButton value="upi" sx={{ fontWeight: "bold", py: 1.5 }}>
              UPI
            </ToggleButton>
            <ToggleButton value="easebuzz" sx={{ fontWeight: "bold", py: 1.5 }}>
              EASEBUZZ
            </ToggleButton>
          </ToggleButtonGroup>

          {option === "neft" && (
            <>
              <Typography fontWeight="bold" mb={1}>
                Bank Details
              </Typography>
              <Stack spacing={3}>
                {BankDetails.map((bank) => (
                  <Paper
                    key={bank.id}
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      borderLeft: "5px solid #1976d2",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {bank.bankname}
                    </Typography>
                    <Typography>
                      <strong>Account Name:</strong> {bank.accountname}
                    </Typography>
                    <Typography>
                      <strong>Account Number:</strong> {bank.accountnumber}
                    </Typography>
                    <Typography>
                      <strong>IFSC Code:</strong> {bank.ifccode}
                    </Typography>
                    <Typography>
                      <strong>Branch:</strong> {bank.branch}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </>
          )}

          {option === "upi" && (
            <Box textAlign="center">
              <Typography fontWeight="bold" mb={1}>
                Scan & Pay using any UPI App
              </Typography>
              <img
                src={scannercode}
                alt="UPI QR"
                style={{ maxWidth: 200, borderRadius: 8 }}
              />
              <Box
                mt={2}
                display="flex"
                justifyContent="center"
                gap={2}
                flexWrap="wrap"
              >
                <img src={gpay} alt="Gpay" width={60} />
                <img src={phonepay} alt="PhonePe" width={60} />
                <img src={bhim} alt="BHIM" width={60} />
                <img src={paytm} alt="Paytm" width={60} />
                <img src={amazon} alt="Amazon Pay" width={60} />
              </Box>
            </Box>
          )}
          {option === 'easebuzz' && (
            <>
              <Box
                sx={{
                  maxWidth: 800,
                  mx: "auto",
                  mt: 0,
                  p: 3,
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Fund Upload
                </Typography>

                <Typography variant="body1" mb={2}>
                  Dear Travel Partner,
                </Typography>

                <Typography variant="body2" mb={2}>
                  Welcome to Wagnistrip Online Fund Upload System.
                </Typography>

                <Typography variant="body2" mb={2}>
                  Please be aware that after registration, all transactions will be administered according to Wagnistrip’s Disclaimer and
                  Terms of Use and the Payment Partner’s Terms of Use as detailed on their website.
                </Typography>
                <Typography variant="body2" mb={2} fontWeight={600} color="green">
                  Once you upload the fund, the amount will be instantly reflected in your Wagnistrip wallet.
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  label="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{
                    mt: 2,
                    mb: 1,
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />

                {/* WARNING MESSAGE */}
                {amount && Number(amount) < 100 && (
                  <Typography color="error" fontSize="14px" mt={0.5}>
                    Minimum amount for fund upload is ₹100.
                  </Typography>
                )}

                {amount && Number(amount) >= 100 && (
                  <Box mt={2}>
                    {paymentModes.map((item) => {
                      const percent = getDeductionPercent(item.key);
                      const finalAmount = getDeductedAmount(amount, item.key);

                      return (
                        <Box
                          key={item.key}
                          mt={2}
                          p={2}
                          sx={{ backgroundColor: "#fff", borderRadius: 2, border: "1px solid #eee" }}
                        >
                          <Typography fontSize="12px" fontWeight={700}>
                            Payment Mode: <span color="green" >{item.label}</span>
                          </Typography>

                          <Typography fontSize="12px">Entered Amount: ₹{amount}</Typography>

                          <Typography fontSize="12px">Deduction: {item?.label === 'NET BANKING' ? '₹50' : `${percent}%`} </Typography>

                          <Typography fontSize="14px" fontWeight={500} color="error">
                            Amount credited to Wagnistrip Wallet: ₹{finalAmount}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* TERMS CHECKBOX */}
                <Box display="flex" alignItems="center" mt={2}>
                  <Checkbox checked={agree} onChange={() => setAgree(!agree)} />
                  <Typography variant="body2">
                    I agree to the{" "}
                    <span style={{ color: "#1976d2", cursor: "pointer" }}>Terms of Use</span>
                  </Typography>
                </Box>

                {/* BUTTON */}
                <Box textAlign="right" mt={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    disabled={
                      !agree || !amount || Number(amount) < 100
                    }
                    onClick={handleEasebuzzPayment}
                    sx={{
                      px: 4,
                      py: 1.2,
                      textTransform: "none",
                      fontSize: "16px",
                      borderRadius: 2,
                    }}
                  >
                    Fund Upload
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {
            (option === 'neft' || option === 'upi') && (
              <>
                <Typography mt={2}>Upload screenshot for confirmation.</Typography>
                <TextField
                  type="file"
                  fullWidth
                  sx={{ mt: 2 }}
                  inputProps={{ accept: "image/*" }}
                  onChange={handleFileUpload}
                />
              </>
            )
          }

          {fileUploaded && (
            <Box mt={3} textAlign="center">
              {submitting ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
                >
                  Submit
                </Button>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddFundModal;
