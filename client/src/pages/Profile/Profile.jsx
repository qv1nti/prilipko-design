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

  // Завантажуємо профіль
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUserData(res.data);
        setFormData(res.data);
      } catch {
        setProfileError("Не вдалося завантажити профіль");
      }
    })();
  }, []);

  // загальні зміни полів профілю
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setProfileError("");
  };

  // оновлення профілю
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await axios.put(
        "/api/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setProfileSuccess(true);
      setEditingProfile(false);
      setUserData(res.data);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // зміни полів пароля
  const handlePassChange = e => {
    const { name, value } = e.target;
    setPassData(prev => ({ ...prev, [name]: value }));
    setPassError("");
  };

  // оновлення пароля
  const handlePassSubmit = async e => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    try {
      await axios.put(
        "/api/user/password",
        passData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPassSuccess(true);
      setEditingPass(false);
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Failed to update password.");
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
              />

              <button type="submit">Save</button>
              {profileError && <p className="error">{profileError}</p>}
              {profileSuccess && <p className="success">Profile updated!</p>}
            </form>
          ) : (
            <div className="profile-info">
              <p>
                <strong>First Name:</strong> {userData?.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {userData?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userData?.email}
              </p>
              <p>
                <strong>Phone:</strong> {userData?.phone}
              </p>
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
              {passSuccess && <p className="success">Password updated!</p>}
            </form>
          ) : (
            <p>
              <strong>Password:</strong> ********
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
