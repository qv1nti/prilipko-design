const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// GET всі товари
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST новий товар
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, category, image, inStock } = req.body;

  try {
    const product = new Product({ name, description, price, category, image, inStock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Помилка створення товару", error: err.message });
  }
});

// PUT редагування
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення", error: err.message });
  }
});

// DELETE товар
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Товар видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка видалення", error: err.message });
  }
});

module.exports = router;
