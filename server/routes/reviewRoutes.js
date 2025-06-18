const express = require("express");
const Review = require("../models/reviewModel"); 
const protect = require("../middlewares/authMiddleware");
const router = express.Router();


// GET /api/reviews/user
router.get("/user", protect, async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id);
    const reviews = await Review.find({ userId: req.user._id.toString() });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ error: 'Server error while fetching user reviews' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.id }).populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch reviews" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Find the review and check if it belongs to the user
    const existingReview = await Review.findOne({ 
      _id: reviewId, 
      userId: req.user._id 
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const reviewId = req.params.id;

    // Find the review and check if it belongs to the user
    const existingReview = await Review.findOne({ 
      _id: reviewId, 
      userId: req.user._id 
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, review },
      { new: true }
    );

    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update review" });
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