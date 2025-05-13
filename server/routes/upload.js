const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Налаштування сховища
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  res.json({ imagePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
