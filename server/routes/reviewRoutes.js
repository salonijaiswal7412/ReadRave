const express = require("express");
const Review = require("../models/reviewModel"); 
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.id }).populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch reviews" });
  }
});

router.post("/", protect, async (req, res) => {
  const { bookId, rating, review: reviewText } = req.body; 
  
  if (!bookId || !rating || !reviewText) {
    return res.status(400).json({ error: "All fields are required" }); 
  }
  
  try {
    const newReview = new Review({ 
      userId: req.user._id, 
      bookId,
      rating,
      review: reviewText,
    });
    
    await newReview.save();
    res.status(201).json({ message: 'review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add review" });
  }
});

module.exports = router;