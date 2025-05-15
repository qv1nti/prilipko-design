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

// PUT /api/orders/:id — редагування замовлення (тільки для адміна)
router.put("/:id", requiredAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        phone: req.body.phone,
        items: req.body.items,
        total: req.body.total,
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення замовлення", error: err.message });
  }
});

// DELETE /api/orders/:id — видалення замовлення (тільки для адміна)
router.delete("/:id", requiredAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    res.json({ message: "Замовлення видалено успішно" });
  } catch (err) {
    res.status(500).json({ message: "Помилка видалення замовлення", error: err.message });
  }
});

module.exports = router;
