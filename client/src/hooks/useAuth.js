// src/components/useAuth.js
export default function useAuth() {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Помилка при читанні користувача з localStorage:", err.message);
    user = null;
  }

  const isAuthenticated = Boolean(token && user && user.id);
  const isAdmin = user?.role === "admin";

  return {
    token,
    user,
    isAuthenticated,
    isAdmin
  };
}
