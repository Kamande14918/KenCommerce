const express = require('express');
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getReviewsByUser,
  markReviewHelpful,
  reportReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/product/:productId', getReviewsByProduct);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);
router.post('/:id/report', protect, reportReview);
router.get('/user/:userId', protect, getReviewsByUser);

// Admin routes
router.get('/', protect, admin, getReviews);

module.exports = router;
