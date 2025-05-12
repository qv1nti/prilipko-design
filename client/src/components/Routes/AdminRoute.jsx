// src/components/Routes/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
