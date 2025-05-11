import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

export default function Profile() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    axios.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserData(res.data))
    .catch(err => {
      console.error(err);
      navigate('/login');
    });
  }, []);

  if (!userData) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Привіт, {userData.name}</h2>
      <p>Email: {userData.email}</p>
    </div>
  );
}
