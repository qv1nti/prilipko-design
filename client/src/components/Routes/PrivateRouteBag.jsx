import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouteBag = ({ children }) => {
  const token = localStorage.getItem("token");
  const isGuest = useSelector((state) => state.guest?.isGuest);
  const items = useSelector((state) => state.bag.items);

  if (items.length === 0) return <Navigate to="/bag" />;

  if (!token && !isGuest) return <Navigate to="/checkout/login" />;

  return children;
};

export default PrivateRouteBag;
