const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardAnalytics,
  manageProducts,
  manageOrders,
  manageUsers,
} = require('../controllers/adminController');

const router = express.Router();

// Admin dashboard
router.get('/dashboard', protect, admin, getDashboardAnalytics);

// Manage products
router.get('/products', protect, admin, manageProducts);

// Manage orders
router.get('/orders', protect, admin, manageOrders);

// Manage users
router.get('/users', protect, admin, manageUsers);

module.exports = router;
