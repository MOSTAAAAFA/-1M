const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }
  next();
};

// 🔐 VERIFY Admin Token
router.get("/verify", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.isAdmin ? 'admin' : 'user'
    }
  });
}));

// 🔐 GET Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalReviews = await Review.countDocuments();

  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');

  const topProducts = await Product.find()
    .sort({ totalReviews: -1, averageRating: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalReviews,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      topProducts
    }
  });
}));

// 🔐 GET All Users
router.get("/users", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;

  const query = search
    ? { $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]}
    : {};

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await User.countDocuments(query);

  res.json({
    success: true,
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
}));

// 🔐 UPDATE User Role
router.patch("/users/:id/role", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { isAdmin } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({
    success: true,
    user
  });
}));

// 🔐 DELETE User
router.delete("/users/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({
    success: true,
    message: "User deleted successfully"
  });
}));

// 🔐 GET All Orders with filters
router.get("/orders", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;

  const query = {};
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Order.countDocuments(query);

  res.json({
    success: true,
    orders,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
}));

// 🔐 UPDATE Order Status
router.patch("/orders/:id/status", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  res.json({
    success: true,
    order
  });
}));

// 🔐 CREATE Product
router.post("/products", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
}));

// 🔐 UPDATE Product
router.put("/products/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  res.json({
    success: true,
    product
  });
}));

// 🔐 DELETE Product
router.delete("/products/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
}));

// 🔐 DELETE Review (moderation)
router.delete("/reviews/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found"
    });
  }

  res.json({
    success: true,
    message: "Review deleted successfully"
  });
}));

module.exports = router;
