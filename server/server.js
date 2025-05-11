require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user"); // 🔽 новий маршрут профілю

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до бази даних
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Роутинги
app.use("/api/auth", authRoutes);     // логін / реєстрація
app.use("/api/user", userRoutes);     // профіль користувача (GET/PUT /profile)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
