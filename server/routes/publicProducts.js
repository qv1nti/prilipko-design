const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

// GET /api/products — всі товари
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

// GET /api/products/:id — один товар
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Перевірка на валідний ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Невалідний ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

module.exports = router;
