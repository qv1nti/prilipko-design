export default function useAuth() {
  const token = localStorage.getItem('token');

  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch (err) {
    user = null;
  }

  const isAuthenticated = !!token && !!user;

  return { token, user, isAuthenticated };
}
