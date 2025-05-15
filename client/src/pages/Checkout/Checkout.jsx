import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearBag } from "../../store/bagSlice";
import Layout from "../../layout/Layout";
import "./Checkout.scss";

const Checkout = () => {
  const items = useSelector((state) => state.bag.items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...form,
        items,
        total,
      };

      const response = await axios.post("/api/orders", orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const orderId = response.data.order?._id || response.data._id;

      navigate("/order/success", {
        state: { orderId },
      });

      setTimeout(() => {
        dispatch(clearBag());
      }, 100);

    } catch (err) {
      alert("Помилка при оформленні замовлення");
      console.error("Order error:", err.response?.data || err.message);
    }
  };

  return (
    <Layout>
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Shipping Details</h2>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <button type="submit">Place Order</button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <ul>
              {items.map((item) => (
                <li key={item._id}>
                  {item.name} × {item.quantity} — ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <hr />
            <p>
              <strong>Total: ${total.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;