const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

// @desc    Отримати дані користувача
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      phone:     user.phone,
    });
  } catch (err) {
    console.error("Error loading profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// @desc    Оновити дані користувача
// @route   PUT /api/user/profile
// @access  Private
router.put("/profile", authMiddleware, async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Валідація формату номера телефону
    const phoneRegex = /^\+380\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Введіть коректний номер телефону у форматі +380XXXXXXXXX"
      });
    }

    // Перевірка унікальності email
    if (email && email !== user.email) {
      const emailTaken = await User.exists({ email, _id: { $ne: user._id } });
      if (emailTaken) {
        return res
          .status(400)
          .json({ message: "Цей email вже використовується іншим користувачем" });
      }
    }

    // Перевірка унікальності телефону
    if (phone && phone !== user.phone) {
      const phoneTaken = await User.exists({ phone, _id: { $ne: user._id } });
      if (phoneTaken) {
        return res
          .status(400)
          .json({ message: "Цей номер телефону вже використовується іншим користувачем" });
      }
    }

    // Оновлюємо поля
    user.firstName = firstName?.trim() || user.firstName;
    user.lastName  = lastName?.trim()  || user.lastName;
    user.email     = email?.trim()     || user.email;
    user.phone     = phone?.trim()     || user.phone;

    await user.save();

    return res.json({
      message:   "Profile updated successfully",
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      phone:     user.phone,
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    if (err.code === 11000 && err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      const msg =
        field === "email"
          ? "Цей email вже використовується іншим користувачем"
          : "Цей номер телефону вже використовується іншим користувачем";
      return res.status(400).json({ message: msg });
    }
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

// @desc    Змінити пароль користувача
// @route   PUT /api/user/password
// @access  Private
router.put("/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Будь ласка, заповніть обидва поля" });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Новий пароль має бути не менше 6 символів" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний поточний пароль" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Пароль успішно оновлено" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ message: "Помилка при зміні пароля" });
  }
});

module.exports = router;