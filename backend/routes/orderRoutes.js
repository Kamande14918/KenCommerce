const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin, adminOrSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Define routes
router.get('/', protect, admin, getOrders); // Fetch all orders
router.get('/:id', protect, getOrderById); // Fetch a single order by ID
router.post('/', protect, createOrder); // Create a new order
router.put('/:id', protect, admin, updateOrderStatus); // Update order status
router.delete('/:id', protect, admin, deleteOrder); // Delete an order

module.exports = router;
