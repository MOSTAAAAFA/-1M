const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

// 🔐 GET user's wishlist
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate({
      path: 'products.product',
      select: 'make model year price image specs'
    });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json({
    success: true,
    wishlist
  });
}));

// 🔐 ADD product to wishlist
router.post("/", authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: [{ product: productId }]
    });
  } else {
    // Check if product already in wishlist
    const exists = wishlist.products.some(
      item => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
  }

  await wishlist.populate({
    path: 'products.product',
    select: 'make model year price image specs'
  });

  res.json({
    success: true,
    wishlist
  });
}));

// 🔐 REMOVE product from wishlist
router.delete("/:productId", authMiddleware, asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found"
    });
  }

  wishlist.products = wishlist.products.filter(
    item => item.product.toString() !== req.params.productId
  );

  await wishlist.save();

  await wishlist.populate({
    path: 'products.product',
    select: 'make model year price image specs'
  });

  res.json({
    success: true,
    wishlist
  });
}));

// 🔐 CLEAR wishlist
router.delete("/", authMiddleware, asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate(
    { user: req.user.id },
    { products: [] }
  );

  res.json({
    success: true,
    message: "Wishlist cleared"
  });
}));

module.exports = router;
