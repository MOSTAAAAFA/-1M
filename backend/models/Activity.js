const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  type: {
    type: String,
    enum: ['view', 'cart', 'wishlist', 'order'],
    required: true,
    index: true,
  },
  carId: String,
  carName: String,
  brand: String,
  price: Number,
}, {
  timestamps: true,
});

activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);