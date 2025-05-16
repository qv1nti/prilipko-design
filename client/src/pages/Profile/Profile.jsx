import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import "./Profile.scss";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [editingPass, setEditingPass] = useState(false);
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  const [orders, setOrders] = useState([]);


  // Завантаження профілю
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setProfileError("Користувач не авторизований");
        return;
      }

      try {
        setProfileError("");

        // Завантаження профілю
        const resProfile = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(resProfile.data);
        setFormData(resProfile.data);
      } catch (err) {
        console.error("Помилка завантаження профілю:", err);
        setProfileError("Не вдалося завантажити профіль");
      }

      try {
        // Завантаження замовлень
        const resOrders = await axios.get("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(resOrders.data);
      } catch (err) {
        console.error("Помилка завантаження замовлень:", err);
      }
    };

    fetchData();
  }, []);
  
  // Обробка змін у формі профілю
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setProfileError("");
  };

  // Відправка оновленого профілю
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);

    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setProfileError("Введіть коректний номер телефону у форматі +380XXXXXXXXX");
      return;
    }

    try {
      const res = await axios.put("/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProfileSuccess(true);
      setEditingProfile(false);
      setUserData(res.data);

      // Ховаємо повідомлення через 3 секунди
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Не вдалося оновити профіль.");
    }
  };

  // Обробка зміни пароля
  const handlePassChange = e => {
    const { name, value } = e.target;
    setPassData(prev => ({ ...prev, [name]: value }));
    setPassError("");
  };

  // Відправка зміни пароля
  const handlePassSubmit = async e => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    try {
      await axios.put("/api/user/password", passData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setPassSuccess(true);
      setEditingPass(false);
      setPassData({ currentPassword: "", newPassword: "" });

      // Ховаємо повідомлення через 3 секунди
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err) {
      setPassError(err.response?.data?.message || "Не вдалося оновити пароль.");
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <h2>MY ACCOUNT</h2>

        {/* ==== PROFILE ==== */}
        <div className="section">
          <h3>
            PROFILE{" "}
            <span
              className="edit-link"
              onClick={() => {
                setEditingProfile(!editingProfile);
                setProfileSuccess(false);
                setProfileError("");
              }}
            >
              {editingProfile ? "Cancel" : "Edit"}
            </span>
          </h3>

          {editingProfile ? (
            <form onSubmit={handleProfileSubmit}>
              <label>First Name:</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleProfileChange}
                required
              />

              <label>Last Name:</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleProfileChange}
                required
              />

              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                required
              />

              <label>Phone:</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleProfileChange}
                required
              />

              <button type="submit">Save</button>
              {profileError && <p className="error">{profileError}</p>}
              {profileSuccess && <p className="success">Профіль оновлено!</p>}
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>First Name:</strong> {userData?.firstName}</p>
              <p><strong>Last Name:</strong> {userData?.lastName}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Phone:</strong> {userData?.phone}</p>
            </div>
          )}
        </div>

        {/* ==== PASSWORD ==== */}
        <div className="section">
          <h3>
            PASSWORD{" "}
            <span
              className="edit-link"
              onClick={() => {
                setEditingPass(!editingPass);
                setPassSuccess(false);
                setPassError("");
              }}
            >
              {editingPass ? "Cancel" : "Change"}
            </span>
          </h3>

          {editingPass ? (
            <form onSubmit={handlePassSubmit}>
              <label>Current Password:</label>
              <input
                name="currentPassword"
                type="password"
                value={passData.currentPassword}
                onChange={handlePassChange}
                required
              />

              <label>New Password:</label>
              <input
                name="newPassword"
                type="password"
                value={passData.newPassword}
                onChange={handlePassChange}
                required
              />

              <button type="submit">Update Password</button>
              {passError && <p className="error">{passError}</p>}
            </form >
          ) : (
            <>
              <p><strong>Password:</strong> ********</p>
              {passSuccess && <p className="success">Password updated!</p>}
            </>
          )}

          <div className="profile-orders">
            <h3>My orders</h3>
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order._id}</div>
                  <div className={`order-status ${order.status}`}>{order.status}</div>
                </div>
                <div className="order-info">Total: {order.total} грн</div>
                <div className="order-info">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                <ul className="order-items">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.name} × {item.quantity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div >
    </Layout>
  );
};

export default Profile;
