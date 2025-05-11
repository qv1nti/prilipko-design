import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import "./Profile.scss";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Отримання даних профілю
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUserData(res.data);
        setFormData(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      }
    };
    fetchData();
  }, []);

  // Обробка змін у формі
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Відправка змін профілю
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await axios.put("/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setSuccess(true);
      setEditing(false);
      setUserData(formData);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <h2>MY ACCOUNT</h2>

        <div className="section">
          <h3>PROFILE <span onClick={() => setEditing(!editing)} className="edit-link">Edit</span></h3>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <label>First Name:</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required />

              <label>Last Name:</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required />

              <label>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />

              <label>Phone:</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />

              <button type="submit">Save</button>
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

        <div className="section">
          <h3>PASSWORD <span className="edit-link">Edit</span></h3>
          <p><strong>Password:</strong> ********</p>
        </div>

        {success && <p className="success">Profile updated!</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </Layout>
  );
};

export default Profile;
