require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");  // логін / реєстрація / Профіль (GET /profile)
const userRoutes = require("./routes/user");        
const adminRoutes = require("./routes/admin");

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
app.use("/api/auth", authRoutes);   // /api/auth/profile (GET)
app.use("/api/user", userRoutes);   // /api/user/profile (PUT)
app.use("/api/admin", adminRoutes); // /api/admin

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
