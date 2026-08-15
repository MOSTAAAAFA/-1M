const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalRedeemed: {
    type: Number,
    default: 0
  },
  history: [{
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  expiringPoints: [{
    points: Number,
    expiryDate: Date
  }]
}, {
  timestamps: true
});

// Calculate tier based on total earned points
loyaltySchema.methods.updateTier = function() {
  if (this.totalEarned >= 100000) {
    this.tier = 'Platinum';
  } else if (this.totalEarned >= 50000) {
    this.tier = 'Gold';
  } else if (this.totalEarned >= 20000) {
    this.tier = 'Silver';
  } else {
    this.tier = 'Bronze';
  }
};

// Add points
loyaltySchema.methods.addPoints = function(points, reason, orderId = null) {
  this.points += points;
  this.totalEarned += points;
  this.history.push({
    type: 'earned',
    points,
    reason,
    orderId
  });
  this.updateTier();

  // Set expiry for points (1 year from now)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  this.expiringPoints.push({
    points,
    expiryDate
  });
};

// Redeem points
loyaltySchema.methods.redeemPoints = function(points, reason) {
  if (this.points < points) {
    throw new Error('Insufficient points');
  }

  this.points -= points;
  this.totalRedeemed += points;
  this.history.push({
    type: 'redeemed',
    points,
    reason
  });
};

// Get tier benefits
loyaltySchema.methods.getTierBenefits = function() {
  const benefits = {
    Bronze: {
      pointsMultiplier: 1,
      discountPercentage: 0,
      freeShipping: false,
      prioritySupport: false
    },
    Silver: {
      pointsMultiplier: 1.25,
      discountPercentage: 5,
      freeShipping: true,
      prioritySupport: false
    },
    Gold: {
      pointsMultiplier: 1.5,
      discountPercentage: 10,
      freeShipping: true,
      prioritySupport: true
    },
    Platinum: {
      pointsMultiplier: 2,
      discountPercentage: 15,
      freeShipping: true,
      prioritySupport: true
    }
  };

  return benefits[this.tier];
};

// Check and expire old points
loyaltySchema.methods.checkExpiredPoints = function() {
  const now = new Date();
  let expiredTotal = 0;

  this.expiringPoints = this.expiringPoints.filter(ep => {
    if (ep.expiryDate <= now) {
      expiredTotal += ep.points;
      this.history.push({
        type: 'expired',
        points: ep.points,
        reason: 'Points expired after 1 year'
      });
      return false;
    }
    return true;
  });

  if (expiredTotal > 0) {
    this.points = Math.max(0, this.points - expiredTotal);
  }
};

module.exports = mongoose.model('Loyalty', loyaltySchema);
