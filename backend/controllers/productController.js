const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };

    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        filter.category = category._id;
      }
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = { $in: req.query.brand.split(',') };
    }

    // Rating filter
    if (req.query.rating) {
      filter.averageRating = { $gte: parseFloat(req.query.rating) };
    }

    // In stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Build sort object
    let sortBy = {};
    switch (req.query.sort) {
      case 'price_asc':
        sortBy = { price: 1 };
        break;
      case 'price_desc':
        sortBy = { price: -1 };
        break;
      case 'rating':
        sortBy = { averageRating: -1 };
        break;
      case 'newest':
        sortBy = { createdAt: -1 };
        break;
      case 'popularity':
        sortBy = { totalSales: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Get price range for filters
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // Get available brands
    const brands = await Product.distinct('brand', { isActive: true });

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        brands: brands.filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName avatar')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count if user is not the seller
    if (!req.user || req.user.id !== product.seller._id.toString()) {
      product.views += 1;
      await product.save();
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin/Seller)
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.id, // Assuming the seller is identified from the logged-in user
    };

    // Handle image uploads
    if (req.files) {
      productData.images = req.files.map((file) => ({
        url: file.path,
        alt: req.body.name,
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Seller - own products)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership (sellers can only update their own products)
    if (req.user.role === 'seller' && product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Seller - own products)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership (sellers can only delete their own products)
    if (req.user.role === 'seller' && product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categorySlug
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category: category._id, 
      isActive: true 
    })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ 
      category: category._id, 
      isActive: true 
    });

    res.json({
      success: true,
      data: products,
      category: category,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category products'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Create text search query
    const searchQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    };

    const products = await Product.find(searchQuery)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ totalSales: -1, averageRating: -1 });

    const total = await Product.countDocuments(searchQuery);

    res.json({
      success: true,
      data: products,
      searchQuery: q,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ 
      isActive: true,
      isFeatured: true 
    })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName')
      .limit(limit)
      .sort({ totalSales: -1, averageRating: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const limit = parseInt(req.query.limit) || 4;

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName')
      .limit(limit)
      .sort({ averageRating: -1, totalSales: -1 });

    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching related products'
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: req.params.id,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const { rating, comment } = req.body;

    const review = await Review.create({
      product: req.params.id,
      user: req.user.id,
      rating,
      comment
    });

    await review.populate('user', 'firstName lastName avatar');

    // Update product rating statistics
    const reviews = await Review.find({ product: req.params.id });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    
    product.averageRating = totalRating / reviews.length;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Add product review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'firstName lastName avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ product: req.params.id });

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Fetch a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  addProductReview,
  getProductReviews,
};
