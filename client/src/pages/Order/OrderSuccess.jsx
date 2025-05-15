import React from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./OrderSuccess.scss";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    // Якщо зайшов вручну без замовлення — редирект
    return <Navigate to="/" />;
  }

  return (
    <Layout>
    <div className="order-success">
      <div className="order-box">
        <h1>Order successfully created</h1>
        <p>Order number: <strong>{orderId}</strong></p>
        <Link to="/" className="back-btn">Return to home page</Link>
      </div>
    </div>
    </Layout>
  );
};

export default OrderSuccess;
