const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "1M" },
    siteSuffix: { type: String, default: "MOTORS" },
    tagline: { type: String, default: "LUXURY · PERFORMANCE · EST. 2026" },
    heroEyebrowTop: { type: String, default: "Luxury · Performance" },
    heroEyebrowBottom: { type: String, default: "Est. 2026" },
    currency: { type: String, default: "USD" },
    copyright: { type: String, default: "© 2026 1M Motors. All rights reserved." },
    footerDescription: { type: String, default: "The world's most exclusive automotive experience." },

    phone: { type: String, default: "+2 010 5093 3078" },
    whatsapp: { type: String, default: "201050933078" },
    email: { type: String, default: "info@1mmotors.com" },
    address: { type: String, default: "Cairo, Egypt" },
    instagram: { type: String, default: "1m_motors" },
    facebook: { type: String, default: "1mmotors" },
    tiktok: { type: String, default: "1mmotors" },

    announcementEnabled: { type: Boolean, default: true },
    announcementText: { type: String, default: "" },

    loyaltyEnabled: { type: Boolean, default: true },
    checkoutEnabled: { type: Boolean, default: true },
    flashSaleEnabled: { type: Boolean, default: false },
    testDriveEnabled: { type: Boolean, default: true },
    reviewEnabled: { type: Boolean, default: true },
    aiAssistantEnabled: { type: Boolean, default: true },
    carsPerPage: { type: Number, default: 12 },

    pointsView: { type: Number, default: 250 },
    pointsCart: { type: Number, default: 500 },
    pointsWishlist: { type: Number, default: 300 },
    pointsPerOrder: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Single-document settings store. Returns the merged document, creating defaults on first call.
siteSettingsSchema.statics.load = async function () {
  let doc = await this.findOne().sort({ createdAt: -1 });
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);