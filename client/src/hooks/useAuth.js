export default function useAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!token;

  return { token, user, isAuthenticated };
}
