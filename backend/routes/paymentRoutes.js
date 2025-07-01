const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  createPayPalOrder,
  capturePayPalPayment,
  initiateMpesaPayment,
  mpesaCallback,
  checkMpesaPaymentStatus,
  getPaymentMethods
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment methods
router.get('/methods', getPaymentMethods);

// Stripe routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);

// PayPal routes
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture', protect, capturePayPalPayment);

// M-Pesa routes
router.post('/mpesa/stk-push', protect, initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.get('/mpesa/status/:orderId', protect, checkMpesaPaymentStatus);

module.exports = router;
