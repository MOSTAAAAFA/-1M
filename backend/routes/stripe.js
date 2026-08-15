const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendEmail, templates } = require("../utils/emailService");
const logger = require("../utils/logger");

// 🔐 CREATE Payment Intent
router.post("/create-payment-intent", authMiddleware, asyncHandler(async (req, res) => {
  const { amount, carId, buyer } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount"
    });
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      userId: req.user.id,
      carId: carId.toString(),
      buyerName: buyer.name,
      buyerEmail: buyer.email
    },
    receipt_email: buyer.email
  });

  // Create pending order
  const order = await Order.create({
    user: req.user.id,
    items: [{ carId, price: amount }],
    total: amount,
    status: 'pending',
    paymentIntentId: paymentIntent.id,
    buyerInfo: buyer
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    orderId: order._id
  });
}));

// 🔓 Stripe Webhook Handler
router.post("/webhook", express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;

    case 'charge.refunded':
      const refund = event.data.object;
      await handleRefund(refund);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}));

// Helper: Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
      .populate('user');

    if (!order) {
      logger.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    order.status = 'confirmed';
    order.paidAt = new Date();
    await order.save();

    // Send confirmation email
    await sendEmail({
      to: order.user.email,
      subject: '🎉 Order Confirmation - 1M Motors',
      html: templates.orderConfirmation(order, order.user)
    });

    logger.info(`Payment succeeded for order: ${order._id}`);
  } catch (error) {
    logger.error('Error handling payment success:', error);
  }
}

// Helper: Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

    if (order) {
      order.status = 'failed';
      await order.save();
      logger.warn(`Payment failed for order: ${order._id}`);
    }
  } catch (error) {
    logger.error('Error handling payment failure:', error);
  }
}

// Helper: Handle refund
async function handleRefund(charge) {
  try {
    const order = await Order.findOne({ paymentIntentId: charge.payment_intent });

    if (order) {
      order.status = 'refunded';
      order.refundedAt = new Date();
      await order.save();
      logger.info(`Refund processed for order: ${order._id}`);
    }
  } catch (error) {
    logger.error('Error handling refund:', error);
  }
}

// 🔐 Request Refund
router.post("/refund", authMiddleware, asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  if (order.status === 'refunded') {
    return res.status(400).json({
      success: false,
      message: "Order already refunded"
    });
  }

  // Create refund
  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    reason: reason || 'requested_by_customer'
  });

  order.status = 'refunded';
  order.refundedAt = new Date();
  await order.save();

  res.json({
    success: true,
    message: "Refund processed successfully",
    refund
  });
}));

// 🔐 GET Payment History
router.get("/payment-history", authMiddleware, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select('items total status paidAt createdAt paymentIntentId');

  res.json({
    success: true,
    orders
  });
}));

module.exports = router;
