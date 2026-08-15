const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

// Calculate average rating for product
reviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      averageRating: obj[0]?.averageRating || 0,
      totalReviews: obj[0]?.totalReviews || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Update average rating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.product);
});

// Update average rating after remove
reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
