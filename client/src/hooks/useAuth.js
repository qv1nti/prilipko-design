import { useSelector } from "react-redux";

export default function useAuth() {
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === "admin";

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
  };
}
