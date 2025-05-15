const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Імпортуємо middleware правильно
const {
  required,
  requiredAdmin,
  optional
} = require("../middleware/authMiddleware");

// POST /api/orders — створення замовлення (авторизовані або гості)
router.post("/", optional, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.userId || null,
    });
    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// GET /api/orders — всі замовлення (тільки для адміна)
router.get("/", requiredAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// GET /api/orders/my — замовлення конкретного користувача
router.get("/my", required, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your orders", error: err.message });
  }
});

// PATCH /api/orders/:id/confirm — підтвердити замовлення
router.patch("/:id/confirm", requiredAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { confirmed: true },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error confirming order", error: err.message });
  }
});

module.exports = router;
