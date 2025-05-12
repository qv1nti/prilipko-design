const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");


router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Це адмін-панель!" });
});

module.exports = router;
