import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import Layout from "../../layout/Layout";
import "./Login.scss";

const isValidPhone = (phone) => /^\+380\d{9}$/.test(phone);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!isValidPhone(formData.phoneNumber)) {
        setError("Телефон має бути у форматі +380XXXXXXXXX");
        return;
      }
    }

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phoneNumber,
          };

      const res = await axios.post(url, payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token); //  тільки токен
      dispatch(setUser(user));               //  зберігаємо user у Redux

      // Перенаправлення за роллю
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Layout>
      <div className="login_container">
        <div className="switcher">
          <a onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>
            Login
          </a>
          <a onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>
            Create account
          </a>
        </div>

        <form className="login_form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Log in" : "Register"}</h2>

          {error && (
            <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <div className="input_group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input_group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input_group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="input_group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="input_group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button className="submit_button" type="submit">
            {isLogin ? "Log in" : "Register"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
