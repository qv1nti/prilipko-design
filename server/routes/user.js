const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// @desc    Отримати дані користувача
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    console.log("AUTH USER:", req.user); // для дебагу

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error loading profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Оновити дані користувача
// @route   PUT /api/user/profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
