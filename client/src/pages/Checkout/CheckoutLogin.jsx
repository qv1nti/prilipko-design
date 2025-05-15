import React from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutLogin.scss";

const CheckoutLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-login">
      <h2>Guest Checkout</h2>
      <button className="full-btn" onClick={() => navigate("/checkout/form")}>
        Checkout as Guest
      </button>

      <h2>Returning Customers</h2>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button className="border-btn">Login</button>

      <h2>Create Account</h2>
      <button className="border-btn">Create Account</button>
    </div>
  );
};

export default CheckoutLogin;
