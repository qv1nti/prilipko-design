import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await axios.post(url, formData);
      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Сталася помилка");
    }
  };

  return (
    <div className="login">
      <div className="login__form">
        <h2>{isRegister ? "Реєстрація" : "Вхід"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Ім'я"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <div className="login__error">{error}</div>}
          <button type="submit">
            {isRegister ? "Зареєструватися" : "Увійти"}
          </button>
        </form>
        <p className="login__toggle" onClick={toggleMode}>
          {isRegister ? "Уже маєте акаунт? Увійти" : "Немає акаунту? Зареєструватися"}
        </p>
      </div>
    </div>
  );
};

export default Login;
