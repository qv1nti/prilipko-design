import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import Layout from "../../layout/Layout";
import { setGuest } from "../../store/guestSlice";
import "./CheckoutLogin.scss";

const CheckoutLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);

      // Отримуємо профіль
      const profileRes = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setUser(profileRes.data)); // зберігаємо user у Redux

      navigate("/checkout/form");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Layout>
      <div className="checkout-login">
        <h2>Guest Checkout</h2>
        <button
          className="full-btn"
          onClick={() => {
            dispatch(setGuest(true)); 
            navigate("/checkout/form");
          }}
        >
          Checkout as Guest
        </button>

        <h2>Returning Customer</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="border-btn">Login</button>
        </form>

        <h2>Create Account</h2>
        <button className="border-btn" onClick={() => navigate("/login")}>
          Create Account
        </button>
      </div>
    </Layout>
  );
};

export default CheckoutLogin;
