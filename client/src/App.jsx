import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromToken } from "./store/authSlice";

import PrivateRoute from "./components/Routes/PrivateRoute";
import AdminRoute from "./components/Routes/AdminRoute";

import AdminPanel from "./pages/Admin/Admin";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Shop from "./pages/Shop/Shop";
import ProductPage from "./pages/Shop/ProductPage";
import Bag from "./pages/Bag/Bag";
import Checkout from "./pages/Checkout/Checkout";
import CheckoutEntry from "./pages/Checkout/CheckoutEntry";
import CheckoutLogin from "./pages/Checkout/CheckoutLogin";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop/product/:id" element={<ProductPage />} />
        <Route path="/shop/:gender?" element={<Shop />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/checkout" element={<CheckoutEntry />} />
        <Route path="/checkout/login" element={<CheckoutLogin />} />
        <Route path="/checkout/form" element={<Checkout />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
