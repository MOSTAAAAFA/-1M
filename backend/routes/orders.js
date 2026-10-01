const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Activity = require("../models/Activity");
const { awardOrderPoints } = require("../services/loyaltyService");

// Soft auth: populate req.user if a valid token exists, never block guests.
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

// 🟢 CREATE ORDER (Checkout)
router.post("/checkout", softAuth, async (req, res) => {
  try {
    const { items, total, customer, status } = req.body;

    // validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or invalid"
      });
    }

    if (!total && total !== 0) {
      return res.status(400).json({
        success: false,
        message: "Total is required"
      });
    }

    const normalizedItems = items.map(item => ({
      product: item.id || item._id || item.product || undefined,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity || item.qty || 1,
      image: item.image,
    }));

    const order = await Order.create({
      user: req.user?.id || undefined,
      items: normalizedItems,
      total,
      status: status || "pending",
      customer: customer || {},
    });

    if (order.user) {
      await Activity.create({
        user: order.user,
        type: "order",
        carName: normalizedItems[0]?.name,
        brand: normalizedItems[0]?.brand,
        price: total,
      });
      await awardOrderPoints(order.user, order, total);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// 🟢 GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;