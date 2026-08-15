const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

// 🟢 GET reviews for a product
router.get("/product/:productId", asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Review.countDocuments({ product: req.params.productId });

  res.json({
    success: true,
    reviews,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
}));

// 🔐 CREATE review (Protected)
router.post("/", authMiddleware, asyncHandler(async (req, res) => {
  const { product, rating, title, comment } = req.body;

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product,
    user: req.user.id
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this product"
    });
  }

  const review = await Review.create({
    product,
    user: req.user.id,
    rating,
    title,
    comment
  });

  await review.populate('user', 'name');

  res.status(201).json({
    success: true,
    review
  });
}));

// 🔐 UPDATE review (Protected)
router.put("/:id", authMiddleware, asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found"
    });
  }

  // Make sure user owns the review
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this review"
    });
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user', 'name');

  res.json({
    success: true,
    review
  });
}));

// 🔐 DELETE review (Protected)
router.delete("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found"
    });
  }

  // Make sure user owns the review
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this review"
    });
  }

  await review.remove();

  res.json({
    success: true,
    message: "Review deleted"
  });
}));

// 🔐 Mark review as helpful (Protected)
router.post("/:id/helpful", authMiddleware, asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpful: 1 } },
    { new: true }
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found"
    });
  }

  res.json({
    success: true,
    review
  });
}));

module.exports = router;
