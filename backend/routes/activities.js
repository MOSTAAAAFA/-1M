const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");
const { awardPointsForActivity } = require("../services/loyaltyService");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied. Admin only." });
  }
  next();
};

// Optional auth: populate req.user if a valid token exists, never block guests.
const softAuth = (req, res, next) => {
  let token = req.cookies?.auth_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) req.user = decoded;
    } catch (err) {
      /* ignore invalid token */
    }
  }
  next();
};

// 🟢 RECORD ACTIVITY (view / cart / wishlist)
// Optional auth: logged-in users are tracked by user + awarded real points.
router.post("/", softAuth, asyncHandler(async (req, res) => {
  const { type, carId, carName, brand, price } = req.body || {};

  if (!type || !["view", "cart", "wishlist"].includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid activity type" });
  }

  const activity = await Activity.create({
    user: req.user?.id || undefined,
    type,
    carId,
    carName,
    brand,
    price,
  });

  let loyalty = null;
  if (activity.user) {
    loyalty = await awardPointsForActivity(activity.user, type);
  }

  res.status(201).json({
    success: true,
    activity,
    loyalty: loyalty
      ? { points: loyalty.points, tier: loyalty.tier, totalEarned: loyalty.totalEarned }
      : null,
  });
}));

// 🔐 ADMIN: recent activity feed with engagement counts
router.get("/", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { limit = 50, type } = req.query;

  const query = type ? { type } : {};
  const activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .populate("user", "name email");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, byType, todayCount] = await Promise.all([
    Activity.countDocuments(),
    Activity.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    Activity.countDocuments({ createdAt: { $gte: today } }),
  ]);

  res.json({
    success: true,
    total,
    today: todayCount,
    byType: byType.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
    activities,
  });
}));

module.exports = router;