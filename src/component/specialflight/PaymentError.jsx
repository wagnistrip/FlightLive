

import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const PaymentError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error } = location.state || {};

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger">Payment Failed ❌</h2>
      <p>{error || "Something went wrong."}</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
};

export default PaymentError;
