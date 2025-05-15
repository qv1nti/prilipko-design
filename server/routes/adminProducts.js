const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { requiredAdmin } = require("../middleware/authMiddleware");

// GET всі товари (тільки для адміна)
router.get("/", requiredAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні товарів", error: err.message });
  }
});

// POST — створення нового товару (адмін)
router.post("/", requiredAdmin, async (req, res) => {
  const { name, description, price, category, image, inStock, gender } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      inStock,
      gender,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Помилка створення товару", error: err.message });
  }
});

// PUT — редагування товару (адмін)
router.put("/:id", requiredAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення товару", error: err.message });
  }
});

// DELETE — видалення товару (адмін)
router.delete("/:id", requiredAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Товар успішно видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка видалення товару", error: err.message });
  }
});

module.exports = router;
