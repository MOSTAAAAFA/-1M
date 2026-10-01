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
  if (!req.user || !req.user.isAdmin) {
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

// 🔐 GET Dashboard Stats - COMPREHENSIVE ANALYTICS
router.get("/stats", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  // Basic counts
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalReviews = await Review.countDocuments();

  // Total revenue
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  // Orders by status breakdown
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        revenue: { $sum: "$total" }
      }
    }
  ]);

  // Calculate order status counts
  const statusMap = ordersByStatus.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const pendingOrders = statusMap.pending || 0;
  const processingOrders = statusMap.processing || 0;
  const shippedOrders = statusMap.shipped || 0;
  const deliveredOrders = statusMap.delivered || 0;
  const cancelledOrders = statusMap.cancelled || 0;
  const completedOrders = deliveredOrders;

  // Revenue trends - Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // User growth - Last 30 days
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Today's metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  const todayRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
  const todayReviews = await Review.countDocuments({ createdAt: { $gte: today } });

  // Average order value
  const avgOrderValue = await Order.aggregate([
    { $group: { _id: null, avg: { $avg: "$total" } } }
  ]);

  // Top products by revenue (from orders)
  const topProductsByRevenue = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } }
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');

  // Top products by reviews
  const topProducts = await Product.find()
    .sort({ totalReviews: -1, averageRating: -1 })
    .limit(5);

  // Recent activity
  const recentActivity = [];

  // Get recent orders for activity
  const recentOrdersActivity = await Order.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('user', 'name email');

  recentOrdersActivity.forEach(order => {
    recentActivity.push({
      type: 'order',
      message: `New order #${order._id.toString().slice(-6)} received`,
      user: order.user?.name,
      time: order.createdAt,
      icon: 'box'
    });
  });

  // Get recent users
  const recentUsersActivity = await User.find()
    .sort({ createdAt: -1 })
    .limit(2)
    .select('name email createdAt');

  recentUsersActivity.forEach(user => {
    recentActivity.push({
      type: 'user',
      message: `New user registration: ${user.email}`,
      time: user.createdAt,
      icon: 'user'
    });
  });

  // Get recent reviews
  const recentReviewsActivity = await Review.find()
    .sort({ createdAt: -1 })
    .limit(2)
    .populate('product', 'name');

  recentReviewsActivity.forEach(review => {
    recentActivity.push({
      type: 'review',
      message: `New review on "${review.product?.name || 'Unknown Product'}"`,
      rating: review.rating,
      time: review.createdAt,
      icon: 'star'
    });
  });

  // Sort all activity by time
  recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Conversion rate (orders / users * 100)
  const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : 0;

  // Average rating across all products
  const avgRating = await Product.aggregate([
    { $group: { _id: null, avg: { $avg: "$averageRating" } } }
  ]);

  res.json({
    success: true,
    stats: {
      // Basic counts
      totalUsers,
      totalOrders,
      totalProducts,
      totalReviews,
      totalRevenue: totalRevenue[0]?.total || 0,

      // Order status breakdown
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      completedOrders,
      ordersByStatus,

      // Analytics
      avgOrderValue: avgOrderValue[0]?.avg || 0,
      conversionRate: parseFloat(conversionRate),
      avgRating: avgRating[0]?.avg || 0,

      // Today's metrics
      today: {
        orders: todayOrders,
        revenue: todayRevenue[0]?.total || 0,
        users: todayUsers,
        reviews: todayReviews
      },

      // Trends
      revenueTrends,
      userGrowth,

      // Lists
      recentOrders,
      topProducts,
      topProductsByRevenue,
      recentActivity: recentActivity.slice(0, 10)
    }
  });
}));

// 🔐 GET Revenue Trends (separate endpoint for charts)
router.get("/stats/revenue-trends", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    trends
  });
}));

// 🔐 GET Real-Time Stats (for live updates)
router.get("/stats/real-time", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  const todayRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
  const todayReviews = await Review.countDocuments({ createdAt: { $gte: today } });

  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const processingOrders = await Order.countDocuments({ status: 'processing' });

  res.json({
    success: true,
    realTime: {
      today: {
        orders: todayOrders,
        revenue: todayRevenue[0]?.total || 0,
        users: todayUsers,
        reviews: todayReviews
      },
      pending: pendingOrders,
      processing: processingOrders,
      timestamp: new Date()
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

  // Validate isAdmin input - must be a boolean
  if (typeof isAdmin !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: "Invalid input: isAdmin must be a boolean value (true or false)"
    });
  }

  // Prevent self-demotion
  if (req.params.id === req.user.id && isAdmin === false) {
    return res.status(403).json({
      success: false,
      message: "Cannot demote yourself from admin role"
    });
  }

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
