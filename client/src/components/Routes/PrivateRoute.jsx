import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isGuest = useSelector((state) => state.guest?.isGuest);

  if (!token && !isGuest) return <Navigate to="/checkout/login" />;

  return children;
};

export default PrivateRoute;
