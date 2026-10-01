const express = require('express');
const router = express.Router();
const Loyalty = require('../models/Loyalty');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/v1/loyalty
// @desc    Get user's loyalty points
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let loyalty = await Loyalty.findOne({ user: req.user.id });

    if (!loyalty) {
      loyalty = await Loyalty.create({ user: req.user.id });
    }

    // Check for expired points
    loyalty.checkExpiredPoints();
    await loyalty.save();

    const benefits = loyalty.getTierBenefits();

    res.json({
      success: true,
      data: {
        points: loyalty.points,
        tier: loyalty.tier,
        totalEarned: loyalty.totalEarned,
        totalRedeemed: loyalty.totalRedeemed,
        benefits,
        history: loyalty.history.slice(-20).reverse() // Last 20 transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/v1/loyalty/history
// @desc    Get full loyalty history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const loyalty = await Loyalty.findOne({ user: req.user.id }).populate('history.orderId');

    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty account not found'
      });
    }

    res.json({
      success: true,
      data: loyalty.history.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/v1/loyalty/redeem
// @desc    Redeem loyalty points
// @access  Private
router.post('/redeem', protect, async (req, res) => {
  try {
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid points amount'
      });
    }

    const loyalty = await Loyalty.findOne({ user: req.user.id });

    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty account not found'
      });
    }

    if (loyalty.points < points) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points'
      });
    }

    loyalty.redeemPoints(points, reason || 'Points redemption');
    await loyalty.save();

    res.json({
      success: true,
      message: 'Points redeemed successfully',
      data: {
        remainingPoints: loyalty.points,
        redeemedPoints: points
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/v1/loyalty/tiers
// @desc    Get all tier information
// @access  Public
router.get('/tiers', (req, res) => {
  res.json({
    success: true,
    data: {
      tiers: [
        {
          name: 'Bronze',
          minPoints: 0,
          benefits: {
            pointsMultiplier: 1,
            discountPercentage: 0,
            freeShipping: false,
            prioritySupport: false
          }
        },
        {
          name: 'Silver',
          minPoints: 20000,
          benefits: {
            pointsMultiplier: 1.25,
            discountPercentage: 5,
            freeShipping: true,
            prioritySupport: false
          }
        },
        {
          name: 'Gold',
          minPoints: 50000,
          benefits: {
            pointsMultiplier: 1.5,
            discountPercentage: 10,
            freeShipping: true,
            prioritySupport: true
          }
        },
        {
          name: 'Platinum',
          minPoints: 100000,
          benefits: {
            pointsMultiplier: 2,
            discountPercentage: 15,
            freeShipping: true,
            prioritySupport: true
          }
        }
      ],
      pointsConversion: {
        earningRate: '1 point per $1 spent',
        redemptionRate: '100 points = $1 discount'
      }
    }
  });
});

module.exports = router;
