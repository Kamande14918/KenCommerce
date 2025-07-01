const express = require('express');
const {
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
} = require('../controllers/productController');
const { protect, adminOrSeller, optionalAuth } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/:id', optionalAuth, getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/reviews', protect, addProductReview);

// Admin/Seller routes
router.post('/', protect, adminOrSeller, upload.productImages, createProduct);
router.put('/:id', protect, adminOrSeller, upload.productImages, updateProduct);
router.delete('/:id', protect, adminOrSeller, deleteProduct);

module.exports = router;
