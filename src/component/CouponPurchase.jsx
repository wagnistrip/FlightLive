import React, { useState } from 'react'
import { Typography, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { encryptPayload, galileoApi } from '../Api/apiService';
import { setCommonChips, setCommonWallet } from '../redux/actions/bookingActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
const CouponPurchase = ({ selectedOffer, openModal, setOpenModal }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);


    const handleConfirmBooking = async () => {
        setLoading(true);
        const token = user?.token;
        const reqbody = {
            amount: selectedOffer?.price,
            earnCoin: selectedOffer?.chips
        }
        try {
            const encryptedPayload = encryptPayload(reqbody || '');
            const response = await galileoApi("/agent/credit-coins", { payload: encryptedPayload }, token);
            if (response?.status === true) {
                toast.success(response?.message || 'Ticket is confirm successfully');
                dispatch(setCommonChips(response?.earn_coins || 0));
                dispatch(setCommonWallet(response?.balance || 0));
                await new Promise((res) => setTimeout(res, 1500));
                setOpenModal(false);
            } else {
                toast.error(response?.message || 'technical issues contact to company');
                setLoading(false);
                setOpenModal(false);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
            {
                loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <DialogTitle sx={{ textAlign: 'center' }}>
                            Wagnistrip Offer
                        </DialogTitle>
                        <DialogContent>
                            {selectedOffer && (
                                <>
                                    <Typography variant="h6" color="black" sx={{ mb: 2, textAlign: "center" }}>
                                        Purchase Discount Coupon
                                    </Typography>

                                    <Typography color="black" variant="body1" sx={{ mb: 1 }}>
                                        <strong>Price:</strong> ₹{selectedOffer.price}
                                    </Typography>
                                    <Typography color="black" variant="body1" sx={{ mb: 1 }}>
                                        <strong>Earn Commission Points:</strong> {selectedOffer.chips}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="error"
                                        sx={{ marginTop: 2, textAlign: "center", fontWeight: 500 }}
                                    >
                                        Enjoy the Purchased Discount Coupens to all the bookings.
                                    </Typography>
                                </>
                            )}
                        </DialogContent>
                    </>
                )
            }

            <DialogActions>
                <Button color="error" onClick={() => setOpenModal(false)} disabled={loading}>
                    Close
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirmBooking} disabled={loading}>
                    {loading ? "Loading..." : "Pay with wallet"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CouponPurchase