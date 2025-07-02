const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardAnalytics,
  manageProducts,
  manageOrders,
  manageUsers,
} = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Admin dashboard
router.get('/dashboard', protect, admin, getDashboardAnalytics);

// Manage products
router.get('/products', protect, admin, manageProducts);

// Manage orders
router.get('/orders', protect, admin, manageOrders);

// Manage users
router.get('/users', protect, admin, manageUsers);

// Admin categories
router.get('/categories', protect, admin, categoryController.getCategories);

// Admin reviews
router.get('/reviews', protect, admin, reviewController.getAllReviews);

module.exports = router;
