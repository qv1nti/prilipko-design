import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const CheckoutEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    if (user) {
      navigate("/checkout/form");
    } else {
      navigate("/checkout/login");
    }
  }, [user, navigate]);

  return null; 
};

export default CheckoutEntry;
