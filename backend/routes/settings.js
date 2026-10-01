const express = require("express");
const router = express.Router();
const SiteSettings = require("../models/SiteSettings");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied. Admin only." });
  }
  next();
};

// 🟢 PUBLIC — merged settings for the site (no auth)
router.get("/public", asyncHandler(async (req, res) => {
  const doc = await SiteSettings.load();
  res.json({ success: true, settings: doc.toObject() });
}));

// 🔐 ADMIN — read settings
router.get("/", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const doc = await SiteSettings.load();
  res.json({ success: true, settings: doc.toObject() });
}));

// 🔐 ADMIN — update settings (upsert onto the singleton doc)
router.put("/", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const doc = await SiteSettings.load();
  const allowed = [
    "siteName", "siteSuffix", "tagline", "heroEyebrowTop", "heroEyebrowBottom",
    "currency", "copyright", "footerDescription",
    "phone", "whatsapp", "email", "address", "instagram", "facebook", "tiktok",
    "announcementEnabled", "announcementText",
    "loyaltyEnabled", "checkoutEnabled", "flashSaleEnabled", "testDriveEnabled",
    "reviewEnabled", "aiAssistantEnabled", "carsPerPage",
    "pointsView", "pointsCart", "pointsWishlist", "pointsPerOrder",
  ];

  const body = req.body?.settings || req.body || {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      doc[key] = body[key];
    }
  }
  await doc.save();
  res.json({ success: true, settings: doc.toObject() });
}));

module.exports = router;