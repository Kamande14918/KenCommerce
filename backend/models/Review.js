const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  pros: [String],
  cons: [String],
  recommendedUse: String,
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  replies: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Reply cannot be more than 500 characters']
    },
    isVendor: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNote: String,
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  reportReasons: [{
    reason: String,
    reportedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ verifiedPurchase: 1 });

// Check if user purchased the product before saving
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Order = mongoose.model('Order');
    const order = await Order.findOne({
      user: this.user,
      'items.product': this.product,
      status: { $in: ['delivered', 'completed'] }
    });
    
    if (order) {
      this.verifiedPurchase = true;
      this.order = order._id;
    }
  }
  next();
});

// Update product ratings after review save/update/delete
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRatings();
  }
});

reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRatings();
  }
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark review as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add reply
reviewSchema.methods.addReply = function(userId, message, isVendor = false) {
  this.replies.push({
    user: userId,
    message: message,
    isVendor: isVendor
  });
  return this.save();
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  // Check if user already reported this review
  const existingReport = this.reportReasons.find(
    report => report.reportedBy.toString() === userId.toString()
  );
  
  if (!existingReport) {
    this.reportReasons.push({
      reason: reason,
      reportedBy: userId
    });
    this.reportCount = this.reportReasons.length;
    
    // Mark as reported if multiple reports
    if (this.reportCount >= 3) {
      this.isReported = true;
      this.status = 'pending'; // Re-review the content
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Virtual for average rating display
reviewSchema.virtual('ratingStars').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Virtual to check if review can be edited
reviewSchema.virtual('canEdit').get(function() {
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return daysSinceCreation <= 7; // Can edit within 7 days
});

reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);
