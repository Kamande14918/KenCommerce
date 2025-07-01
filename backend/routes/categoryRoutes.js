const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  toggleCategoryStatus,
  getCategoryStats
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, admin, upload.categoryImage, createCategory);
router.put('/:id', protect, admin, upload.categoryImage, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);
router.patch('/:id/toggle-status', protect, admin, toggleCategoryStatus);
router.get('/:id/stats', protect, admin, getCategoryStats);

module.exports = router;
