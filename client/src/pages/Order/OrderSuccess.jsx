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
        <h1>✅ Замовлення успішно створено</h1>
        <p>Номер замовлення: <strong>{orderId}</strong></p>
        <Link to="/" className="back-btn">Повернутись на головну</Link>
      </div>
    </div>
    </Layout>
  );
};

export default OrderSuccess;
