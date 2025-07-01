const express = require('express');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const {
  getDashboardAnalytics,
  getProducts,
  getOrders,
  getUsers,
  getCategories,
  getReviews,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardAnalytics);
router.get('/products', protect, admin, getProducts);
router.get('/orders', protect, admin, getOrders);
router.get('/users', protect, admin, getUsers);
router.get('/categories', protect, admin, getCategories);
router.get('/reviews', protect, admin, getReviews);

// Example route only accessible by super admin
router.post('/create-admin', protect, superAdmin, async (req, res) => {
  // Logic to create a new admin
});

module.exports = router;
