const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: {
      name: String,
      value: String
    },
    sku: String
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'mpesa', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    failureReason: String
  },
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedDelivery: Date,
    trackingNumber: String,
    carrier: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  notes: {
    customer: String,
    admin: String
  },
  customerInfo: {
    email: String,
    phone: String,
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  refund: {
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed']
    },
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  cancelledAt: Date,
  cancelReason: String,
  returnRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed']
    },
    requestedAt: Date,
    approvedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the count of orders for today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const todayOrdersCount = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    
    const orderSequence = (todayOrdersCount + 1).toString().padStart(4, '0');
    this.orderNumber = `KC${year}${month}${day}${orderSequence}`;
  }
  next();
});

// Add status to history before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Calculate totals virtual
orderSchema.virtual('itemsTotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for current status info
orderSchema.virtual('currentStatus').get(function() {
  return this.statusHistory[this.statusHistory.length - 1];
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy,
    timestamp: new Date()
  });
  
  // Update specific timestamps
  switch (newStatus) {
    case 'shipped':
      this.shipping.shippedAt = new Date();
      break;
    case 'delivered':
      this.shipping.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
  }
  
  return this.save();
};

// Method to calculate refund amount
orderSchema.methods.calculateRefundAmount = function(items = null) {
  if (!items) {
    // Full refund
    return this.pricing.total;
  }
  
  // Partial refund for specific items
  let refundAmount = 0;
  items.forEach(refundItem => {
    const orderItem = this.items.find(item => 
      item.product.toString() === refundItem.productId.toString()
    );
    if (orderItem) {
      refundAmount += orderItem.price * refundItem.quantity;
    }
  });
  
  return refundAmount;
};

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
