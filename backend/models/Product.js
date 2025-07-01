const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  brand: {
    type: String,
    trim: true
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    price: Number,
    sku: String,
    stock: Number,
    image: {
      public_id: String,
      url: String
    }
  }],
  attributes: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }],
  inventory: {
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackStock: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'low_stock', 'backorder'],
      default: 'in_stock'
    }
  },
  shipping: {
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'express', 'free', 'heavy'],
      default: 'standard'
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  sales: {
    totalSold: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'out_of_stock'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  relatedProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  publishedAt: Date,
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

// Update stock status based on stock quantity
productSchema.pre('save', function(next) {
  if (this.inventory.trackStock) {
    if (this.inventory.stock <= 0) {
      this.inventory.stockStatus = this.inventory.allowBackorder ? 'backorder' : 'out_of_stock';
      this.status = 'out_of_stock';
    } else if (this.inventory.stock <= this.inventory.lowStockThreshold) {
      this.inventory.stockStatus = 'low_stock';
    } else {
      this.inventory.stockStatus = 'in_stock';
    }
  }
  next();
});

// Ensure only one primary image
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach(image => {
      if (image.isPrimary) primaryCount++;
    });
    
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryCount > 1) {
      let firstPrimary = true;
      this.images.forEach(image => {
        if (image.isPrimary && firstPrimary) {
          firstPrimary = false;
        } else {
          image.isPrimary = false;
        }
      });
    }
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  return this.images.find(image => image.isPrimary) || this.images[0];
});

// Virtual for in stock check
productSchema.virtual('inStock').get(function() {
  if (!this.inventory.trackStock) return true;
  return this.inventory.stock > 0 || this.inventory.allowBackorder;
});

// Method to update ratings
productSchema.methods.updateRatings = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ product: this._id });
  
  if (reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    this.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = parseFloat((totalRating / reviews.length).toFixed(1));
    this.ratings.count = reviews.length;
    
    // Reset distribution
    this.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    // Calculate distribution
    reviews.forEach(review => {
      this.ratings.distribution[review.rating]++;
    });
  }
  
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);
