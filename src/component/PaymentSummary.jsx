import React from "react";
import { Checkbox, Typography } from '@mui/material';
import { Card } from "react-bootstrap";
import { getAdditiondiscount, getServiceFee } from "../utils/airlineUtils";

const PaymentSummary = ({ noOfAdults, noOfChildren, noOfInfants, responseData, responseData1, activeStep, othercharges, othercharges1, adultPrice, adultPrice2, childPrice, childPrice2, totalTaxes, totalTaxes2, discountedPrice, grandTotal, grandTotal2, user, couponOption, selectedCoupon, typedCoupon, handleCouponChange, handleApplyCoupon, warningMessage, discountMessage, visibleCoupons, isCouponActive, handleClearCoupon, infantPrice, infantPrice2, convenienceFee, handleCouponSelect, setShowAll, showAll, isGreenChipsUsed, greenChipsPrice, handleRadioChange, walletAmout, greenchipsamt, tripType, trip, usechipsamt1, AdditionCharge, usechipsamt }) => {
    // console.log("dldlkd => ", usechipsamt1);
    return (
        <>
            <div className="tour_details_right_sidebar_wrapper">

                <Card className="tour_detail_right_sidebar">
                    <div className="tour_details_right_boxed">
                        <div className="tour_details_right_box_heading mb-2 d-flex justify-content-between align-content-center">
                            <h3>Price Summary</h3>
                            <div><i className="fas fa-male" aria-hidden="true"></i> {noOfAdults}
                                <i className="fas fa-child pl-2" aria-hidden="true"></i> {noOfChildren}
                                <i className="fas fa-baby pl-2" aria-hidden="true"></i> {noOfInfants}</div>
                        </div>

                        {
                            (!user || user?.users.role === 1) && (

                                <>
                                    <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                        <div className="valid_date_area_one">
                                            <h5> Adult x {noOfAdults}</h5>
                                        </div>
                                        <div className="text-end">
                                            <h5 className='fw-bold' >{responseData && responseData.currency && responseData.currency.currency_symbol}  {noOfAdults * adultPrice + noOfAdults * adultPrice2}
                                            </h5>
                                        </div>
                                    </div>
                                    {
                                        noOfChildren > 0 && (
                                            <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                                <div className="valid_date_area_one">
                                                    <h5> Childs x {noOfChildren}</h5>
                                                </div>
                                                <div className="text-end">
                                                    <h5 className='fw-bold' >{responseData && responseData.currency && responseData.currency.currency_symbol}  {noOfChildren * childPrice + noOfChildren * childPrice2}
                                                    </h5>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        noOfInfants > 0 && (
                                            <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                                <div className="valid_date_area_one">
                                                    <h5> Infants x {noOfInfants}</h5>
                                                </div>
                                                <div className="text-end">
                                                    <h5 className='fw-bold' >{responseData && responseData.currency && responseData.currency.currency_symbol} {noOfInfants * infantPrice + noOfInfants * infantPrice2}
                                                    </h5>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            )}

                        {
                            user && (user?.users.role === 2) && (
                                <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                    <div className="valid_date_area_one">
                                        <h5> Base Fare</h5>
                                    </div>
                                    <div className="text-end">
                                        <h5 className="fw-bold">
                                            {responseData?.currency?.currency_symbol}{" "}
                                            {
                                                (() => {
                                                    const serviceFee = getServiceFee(trip, user?.users?.agent_type);
                                                    const baseFareFee = (serviceFee * 3) / 4; // 75% in Base Fare
                                                    return (
                                                        (noOfAdults * (adultPrice + adultPrice2)) +
                                                        (noOfChildren * (childPrice + childPrice2)) +
                                                        (noOfInfants * (infantPrice + infantPrice2)) +
                                                        baseFareFee
                                                    );
                                                })()
                                            }
                                        </h5>
                                    </div>
                                </div>
                            )
                        }
                        <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                            <div className="valid_date_area_one">
                                <h5> Total Taxes</h5>
                            </div>
                            <div className="text-end">
                                <h5 className="fw-bold">
                                    {responseData?.currency?.currency_symbol}{" "}
                                    {
                                        (totalTaxes + totalTaxes2) +
                                        (
                                            user && user?.users?.role === 2
                                                ? getServiceFee(trip, user?.users?.agent_type) / 4  // 25% for logged-in Agent
                                                : 0  // 0 for others
                                        )
                                    }
                                </h5>
                            </div>
                        </div>

                        {
                            activeStep > 1 && (

                                <details className="collapse-container">

                                    <summary style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                        <div className="valid_date_area_one">
                                            <h5>Other +</h5>
                                        </div>
                                        <div className="text-end">
                                            <h5 className='fw-bold' >{responseData && responseData.currency && responseData.currency.currency_symbol} { }
                                                {(() => {
                                                    let baseTotal = othercharges + othercharges1;
                                                    let finalTotal = baseTotal;

                                                    const shouldApplyConvenienceFee = (activeStep > 2) && (!user || (user.users && user.users.role !== 2));


                                                    if (shouldApplyConvenienceFee) {
                                                        finalTotal += convenienceFee;
                                                        finalTotal += AdditionCharge;
                                                    }

                                                    return finalTotal.toFixed(2);
                                                })()}
                                            </h5>
                                        </div>
                                    </summary>
                                    <div className='d-block collapse-content gap-2 mt-1'>
                                        {
                                            (othercharges + othercharges1) > 0 && (
                                                <div style={{ borderBottom: '1px solid #e8e2e2' }} className='d-flex py-1 align-items-center  justify-content-between'>
                                                    <p style={{ fontSize: '12px' }}>Seat price</p>
                                                    <strong style={{ fontSize: '13px' }}>{responseData1 && responseData1?.currency && responseData1?.currency?.currency_symbol} {othercharges + othercharges1}</strong>
                                                </div>

                                            )
                                        }

                                        {
                                            activeStep > 2 && (
                                                <>


                                                    <div className='d-flex align-items-center justify-content-between py-1'>
                                                        <p style={{ fontSize: '12px' }}>Convenience Fee</p>
                                                        <strong style={{ fontSize: '13px' }}>

                                                            {/* {responseData1 && responseData1?.currency && responseData1?.currency?.currency_symbol} {platformFees} */}
                                                            {(() => {
                                                                let finalTotal = 0;

                                                                const shouldApplyConvenienceFee = (activeStep > 2) && (!user || (user.users && user.users.role !== 2));

                                                                if (shouldApplyConvenienceFee) {
                                                                    finalTotal += convenienceFee;
                                                                } else {
                                                                    finalTotal += 0;
                                                                }

                                                                return finalTotal;
                                                            })()}
                                                        </strong>
                                                    </div>

                                                    <div style={{ borderBottom: '1px solid #e8e2e2' }} className='d-flex py-1 align-items-center  justify-content-between'>
                                                        <p style={{ fontSize: '12px' }}>Additional Fee</p>
                                                        <strong style={{ fontSize: '13px' }}>{responseData1 && responseData1?.currency && responseData1?.currency?.currency_symbol} {AdditionCharge || 0}</strong>
                                                    </div>

                                                </>


                                            )}

                                    </div>



                                </details>

                            )
                        }
                        {discountedPrice > 0 && (
                            <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                <div className="valid_date_area_one">
                                    <h5> Discount</h5>
                                </div>
                                <div className="text-end">
                                    <div className='fw-bold text-success' >- {responseData && responseData.currency && responseData.currency.currency_symbol}  {discountedPrice}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                            <div className="valid_date_area_one">
                                <h5 className='text-danger fw-bold'> Grand </h5>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold">
                                    {(() => {
                                        let baseTotal = grandTotal + grandTotal2 - discountedPrice + othercharges + othercharges1;
                                        let finalTotal = baseTotal;

                                        // Add 175 or 595 if role === 2
                                        if (user?.users?.role === 2) {
                                            finalTotal += getServiceFee(trip, user?.users?.agent_type);
                                        }

                                        const shouldApplyConvenienceFee = (activeStep > 2) && (!user || (user.users && user.users.role !== 2));

                                        if (shouldApplyConvenienceFee) {
                                            finalTotal += AdditionCharge;
                                        }

                                        if (shouldApplyConvenienceFee) {
                                            finalTotal += convenienceFee;
                                        } else {
                                            finalTotal += 0;
                                        }

                                        return finalTotal;
                                    })()}

                                </div>
                            </div>
                        </div>
                        {
                            user && (user?.users.role === 2) && (


                                <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                    <div className="valid_date_area_one">
                                        <h5 className='text-danger fw-bold'> Payable Amount</h5>
                                    </div>

                                    <div className="text-end">
                                        <div className="fw-bold">
                                            <strike>{responseData && responseData.currency && responseData.currency.currency_symbol} {grandTotal + grandTotal2 - discountedPrice + othercharges + othercharges1 + getServiceFee(trip, user?.users?.agent_type)}</strike>
                                            <span className="text-danger fw-bold ml-1">
                                                {responseData?.currency?.currency_symbol}{" "}
                                                {grandTotal + grandTotal2 - discountedPrice + othercharges + othercharges1 + getServiceFee(trip, user?.users?.agent_type) - (isGreenChipsUsed ? usechipsamt : 0) - (user?.users?.role === 2 && user?.users?.agent_type === 'A' ? getAdditiondiscount(trip) : 0) -(user?.users?.role === 2 && user?.users?.agent_type === 'B' ? greenchipsamt : 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>


                            )}
                        {
                            user && (user?.users.role === 2) && user?.users?.agent_type === 'B' && activeStep > 2 && (
                                <div style={{ border: '#f5f5f5' }} className="valid_date_area d-none py-2.5 border-bottom  align-content-center justify-content-between">
                                    <div className="valid_date_area_one">
                                        <p style={{ fontSize: '20px' }} className='text-success fw-normal'>Commission Earn</p>
                                    </div>
                                    <div className="text-end">
                                        <div className='fw-bold' >
                                            <span className='text-primary fw-bold ml-1'> {responseData && responseData.currency && responseData.currency.currency_symbol} {(greenchipsamt ?? 0) - (isGreenChipsUsed ? (usechipsamt ?? 0) : 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        {
                            user && (user?.users.role === 2) && (
                                <div style={{ border: '#f5f5f5' }} className="valid_date_area d-flex py-2.5 border-bottom  align-content-center justify-content-between">
                                    <div className="valid_date_area_one">
                                        <p style={{ fontSize: '20px' }} className='text-primary fw-normal'>Net Fare</p>
                                    </div>
                                    <div className="text-end">
                                        <div className='fw-bold' >
                                            <span className='text-primary fw-bold ml-1'> <div className="fw-bold">
                                                {(() => {
                                                    let baseTotal = grandTotal + grandTotal2 - discountedPrice + othercharges + othercharges1;
                                                    let finalTotal = baseTotal;

                                                    // Add 175 or 595 if role === 2
                                                    if (user?.users?.role === 2) {
                                                        finalTotal += getServiceFee(trip, user?.users?.agent_type);
                                                    }

                                                    if (greenchipsamt > 0 && user?.users?.agent_type === 'B') {
                                                        finalTotal -= greenchipsamt;
                                                    }
                                                    // if (isGreenChipsUsed) {
                                                    //     finalTotal -= trip === 'I' ? 400 : trip === 'D' ? 100 : 0;
                                                    // }
                                                    // here for update this code for used green chips
                                                    if (user?.users?.agent_type === 'A') {
                                                        finalTotal -= getAdditiondiscount(trip);
                                                    }
                                                    return finalTotal;
                                                })()}

                                            </div></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </Card>

            </div>
            {usechipsamt1 && usechipsamt1.length > 0 && usechipsamt1.map((data, index) => {
                const isDisabled = greenChipsPrice < parseFloat(data?.Amount);
                const isSelected = isGreenChipsUsed && usechipsamt === parseFloat(data?.Amount);

                return (
                    <Card sx={{ p: 2 }} key={index} className="mb-2">
                        <div className="d-flex p-2 align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-start gap-1">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleRadioChange(parseFloat(data?.Amount))}
                                    disabled={isDisabled}
                                />
                                <Typography
                                    variant="body1"
                                    color={isDisabled ? "textSecondary" : "textPrimary"}
                                >
                                    Use existing Commission Earn
                                </Typography>
                            </div>
                            <Typography
                                variant="h6"
                                color={isDisabled ? "textSecondary" : "textPrimary"}
                            >
                                ₹ {data?.Amount}
                            </Typography>
                        </div>
                    </Card>
                );
            })}

            {
                user && (user?.users.role === 2 && walletAmout > 0) && (

                    // greenChipsPrice >0 then radio button is enamble and this text show not greater then text disble show this card disable show
                    <div className="tour_details_right_sidebar_wrapper">
                        <Card sx={{ p: 2 }}>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex align-items-center justify-content-start gap-1">
                                    {/* <Radio checked="checked" name='raushan' onChange="" /> */}
                                    <Typography variant="body1" fontWeight="semibold" color='#01196d'>WT wallet</Typography>
                                </div>
                                <Typography variant="h6" fontWeight="semibold">Rs {walletAmout || 0}</Typography>
                            </div>
                        </Card>
                    </div>
                )
            }
            {
                user && (user?.users.role === 2) && (

                    <div className="d-none p-2 align-items-center justify-content-between">
                        <div className="d-flex align-items-center justify-content-start gap-1">
                            <Typography fontSize="13px" variant="body1" fontWeight="normal" fontStyle="italic" color='red'>You must have 500 Commission Earn in your account to hold this ticket for domestic flight and 1000 Commission Earn in your account for an international flight.</Typography>
                        </div>

                    </div>
                )
            }

            {
                (couponOption && couponOption.length > 0) && (activeStep < 3) && (
                    (!user || user?.users.role === 1) && (
                        <Card className="tour_detail_right_sidebar">
                            <div className="tour_details_right_box_heading px-4 pt-4 mb-2 d-flex justify-content-between align-content-center">
                                <h3>Coupon & Promo Code</h3>
                            </div>
                            <div className="bg-white p-2">
                                <div className="input-group mb-3">
                                    <input
                                        className={`form-control border-0 rounded-0 fw-bold border-bottom ${selectedCoupon ? 'text-danger font-bold' : 'text-primary'}`}
                                        type="text"
                                        name="coupon"
                                        id="coupon"
                                        value={typedCoupon}
                                        onChange={handleCouponChange}
                                        // onKeyDown={handleKeyDown} 
                                        placeholder="Enter Coupon Code"
                                        aria-label="Enter Coupon Code"
                                        aria-describedby="button-addon2"
                                    />
                                    <button
                                        onClick={selectedCoupon ? handleClearCoupon : handleApplyCoupon}
                                        className={`btn ${selectedCoupon ? 'bg-danger' : 'bg-primary'} text-white`}
                                        type="button"
                                        id="button-addon2"
                                    >
                                        {selectedCoupon ? 'Clear' : 'Apply'}
                                    </button>
                                </div>
                                {warningMessage && <p style={{ fontSize: '12px', lineHeight: '14px' }} className="text-danger mb-2">{warningMessage}</p>}
                                {discountMessage && <p style={{ fontSize: '12px', lineHeight: '14px' }} className="text-success text-start mb-2">{discountMessage}</p>}

                                <div className=" pl-1">
                                    {visibleCoupons && visibleCoupons.map((coupon, index) => {
                                        const isActive = isCouponActive(coupon.code); // Check if coupon is valid for the amount
                                        return (
                                            <div key={index} className={`form-check rounded-0 mb-4 pb-2 border-bottom ${isActive ? 'bg-light-green' : 'bg-light-gray'}`}>

                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="coupon"
                                                    id={`coupon${index}`}
                                                    checked={selectedCoupon === coupon.code}
                                                    onChange={() => isActive && handleCouponSelect(coupon.code, othercharges, othercharges1)} // Allow selection only if active
                                                    disabled={!isActive} // Disable inactive coupons
                                                />

                                                <label
                                                    style={{ cursor: isActive ? 'pointer' : 'default' }}
                                                    className="form-check-label text-start"
                                                    htmlFor={`coupon${index}`}
                                                >
                                                    <div className="h6 fw-bold text-dark">{coupon.code}</div>
                                                    <div className="text-muted">{coupon.description}</div>
                                                    {coupon.terms && (
                                                        <Link
                                                            // target='_blank'
                                                            to="/offers/terms-and-conditionss"
                                                            // to={`/offers/terms-and-conditionss?${coupon.code}`}
                                                            state={{ coupon }} // ✅ Pass state here instead of inside `to`

                                                            className=""
                                                            style={{
                                                                color: 'var(--main-color)',
                                                                fontSize: '12px',
                                                                pointerEvents: isActive ? 'auto' : 'none',
                                                                opacity: isActive ? 1 : 0.5
                                                            }}
                                                        >
                                                            T&C Apply
                                                        </Link>
                                                    )}
                                                </label>
                                            </div>
                                        );
                                    })}



                                </div>
                            </div>
                            {couponOption.length > 6 && (
                                <div className="tour_select_offer_bar_bottom">
                                    <button onClick={() => setShowAll(!showAll)} className="btn btn_theme btn_md w-100">
                                        {showAll ? 'Close' : 'View All'}
                                    </button>
                                </div>
                            )}
                        </Card>
                    )
                )
            }

        </>
    )
}
export default PaymentSummary