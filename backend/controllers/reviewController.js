const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    Get all reviews with filtering and pagination
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};

    // Product filter
    if (req.query.product) {
      filter.product = req.query.product;
    }

    // Rating filter
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    // User filter (for admin)
    if (req.query.user) {
      filter.user = req.query.user;
    }

    // Execute query
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name images price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name images price');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review'
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { product, rating, comment } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'orderItems.product': product,
      status: 'delivered'
    });

    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased and received'
      });
    }

    const review = await Review.create({
      product,
      user: req.user.id,
      rating,
      comment
    });

    await review.populate('user', 'firstName lastName avatar');
    await review.populate('product', 'name images price');

    // Update product rating statistics
    await updateProductRatingStats(product);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name images price');

    // Update product rating statistics
    await updateProductRatingStats(review.product);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(req.params.id);

    // Update product rating statistics
    await updateProductRatingStats(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

// @desc    Get reviews by product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getReviewsByProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build filter
    let filter = { product: req.params.productId };

    // Rating filter
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(req.params.productId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Get average rating
    const avgRating = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(req.params.productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
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
      stats: {
        ratingDistribution: ratingStats,
        summary: avgRating[0] || { averageRating: 0, totalReviews: 0 }
      }
    });
  } catch (error) {
    console.error('Get reviews by product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product reviews'
    });
  }
};

// @desc    Get reviews by user
// @route   GET /api/reviews/user/:userId
// @access  Private (Own reviews or Admin)
const getReviewsByUser = async (req, res) => {
  try {
    // Check if user is viewing their own reviews or is admin
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these reviews'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name images price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ user: req.params.userId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews by user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review as helpful
    if (review.helpfulVotes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked this review as helpful'
      });
    }

    review.helpfulVotes.push(req.user.id);
    await review.save();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpfulCount: review.helpfulVotes.length
      }
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while marking review as helpful'
    });
  }
};

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    const existingReport = review.reports.find(
      report => report.user.toString() === req.user.id
    );

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    review.reports.push({
      user: req.user.id,
      reason: reason || 'Inappropriate content'
    });

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while reporting review'
    });
  }
};

// Helper function to update product rating statistics
const updateProductRatingStats = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        numReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      numReviews: reviews.length
    });
  } catch (error) {
    console.error('Update product rating stats error:', error);
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getReviewsByUser,
  markReviewHelpful,
  reportReview
};
