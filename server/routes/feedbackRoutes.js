const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /api/feedback — зберегти фідбек
router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving feedback", error: error.message });
  }
});

// (опціонально) GET — всі фідбеки (для адміна)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks", error: error.message });
  }
});

// DELETE /api/feedback/:id — видалити фідбек
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feedback not found" });

    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error: error.message });
  }
});

module.exports = router;
