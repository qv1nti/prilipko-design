const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// GET /api/admin/dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Це адмін-панель!" });
});

// GET /api/admin/users — список користувачів
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

// PUT /api/admin/users/:id — редагування користувача
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const {
    role,
    isBlocked,
    firstName,
    lastName,
    phone,
    email
  } = req.body;

  try {
    const updateFields = {
      ...(role && { role }),
      ...(typeof isBlocked !== "undefined" && { isBlocked }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(email && { email }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Помилка при оновленні", error: err.message });
  }
});

module.exports = router;
