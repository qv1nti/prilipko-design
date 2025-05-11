const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// @desc    Отримати дані користувача
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    });
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
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
