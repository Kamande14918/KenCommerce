const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Create payment intent for Stripe
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { orderId } = req.body;

    // Get the order
    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment intent'
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm payment for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order to paid
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = 'stripe';
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email
      };

      await order.save();

      // Update product sales count
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { totalSales: item.quantity } }
        );
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming payment'
    });
  }
};

// @desc    Create PayPal order
// @route   POST /api/payments/paypal/create-order
// @access  Private
const createPayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create PayPal order using PayPal SDK
    // This is a simplified example - you'll need to implement actual PayPal SDK integration
    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: order.totalPrice.toString()
        },
        description: `KenCommerce Order #${order._id}`,
        custom_id: order._id.toString()
      }],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
      }
    };

    // In a real implementation, you would create the order with PayPal API
    // const response = await paypal.orders.create(paypalOrder);

    res.json({
      success: true,
      data: {
        orderID: 'PAYPAL_ORDER_ID', // This would be the actual PayPal order ID
        approvalUrl: 'PAYPAL_APPROVAL_URL' // This would be the actual approval URL
      }
    });
  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating PayPal order'
    });
  }
};

// @desc    Capture PayPal payment
// @route   POST /api/payments/paypal/capture
// @access  Private
const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID, orderId } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to capture payment for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Capture PayPal payment
    // In a real implementation, you would capture the payment with PayPal API
    // const response = await paypal.orders.capture(orderID);

    // Simulate successful capture
    const captureResponse = {
      id: orderID,
      status: 'COMPLETED',
      payer: {
        email_address: req.user.email
      }
    };

    if (captureResponse.status === 'COMPLETED') {
      // Update order to paid
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = 'paypal';
      order.paymentResult = {
        id: captureResponse.id,
        status: captureResponse.status,
        update_time: new Date().toISOString(),
        email_address: captureResponse.payer.email_address
      };

      await order.save();

      // Update product sales count
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { totalSales: item.quantity } }
        );
      }

      res.json({
        success: true,
        message: 'PayPal payment captured successfully',
        data: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'PayPal payment capture failed'
      });
    }
  } catch (error) {
    console.error('Capture PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while capturing PayPal payment'
    });
  }
};

// @desc    Initiate M-Pesa payment (Daraja API)
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Generate M-Pesa access token (simplified)
    const accessToken = await getMpesaAccessToken();

    // Generate password and timestamp for STK push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // STK Push request payload
    const stkPushPayload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(order.totalPrice * 100), // Convert to cents
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.SERVER_URL}/api/payments/mpesa/callback`,
      AccountReference: order._id.toString(),
      TransactionDesc: `Payment for KenCommerce Order #${order._id}`
    };

    // In a real implementation, you would make the STK push request to Safaricom
    // const response = await makeMpesaStkPush(stkPushPayload, accessToken);

    // Simulate successful STK push initiation
    const mockResponse = {
      MerchantRequestID: 'MERCHANT_REQUEST_ID',
      CheckoutRequestID: 'CHECKOUT_REQUEST_ID',
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing'
    };

    if (mockResponse.ResponseCode === '0') {
      // Store the checkout request ID for later verification
      order.mpesaCheckoutRequestId = mockResponse.CheckoutRequestID;
      await order.save();

      res.json({
        success: true,
        message: 'M-Pesa payment initiated. Please complete the payment on your phone.',
        data: {
          checkoutRequestId: mockResponse.CheckoutRequestID,
          merchantRequestId: mockResponse.MerchantRequestID
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initiate M-Pesa payment'
      });
    }
  } catch (error) {
    console.error('Initiate M-Pesa payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while initiating M-Pesa payment'
    });
  }
};

// @desc    M-Pesa payment callback
// @route   POST /api/payments/mpesa/callback
// @access  Public (Webhook)
const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    // Find the order by checkout request ID
    const order = await Order.findOne({ mpesaCheckoutRequestId: checkoutRequestId });

    if (!order) {
      console.error('Order not found for checkout request ID:', checkoutRequestId);
      return res.status(200).json({ message: 'Callback received' });
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = 'mpesa';
      order.paymentResult = {
        id: mpesaReceiptNumber,
        status: 'completed',
        update_time: new Date().toISOString(),
        phone_number: phoneNumber,
        transaction_date: transactionDate
      };

      await order.save();

      // Update product sales count
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { totalSales: item.quantity } }
        );
      }

      console.log('M-Pesa payment successful for order:', order._id);
    } else {
      // Payment failed
      console.log('M-Pesa payment failed for order:', order._id, 'Result code:', resultCode);
    }

    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(200).json({ message: 'Callback received' }); // Always return 200 to avoid retries
  }
};

// @desc    Check M-Pesa payment status
// @route   GET /api/payments/mpesa/status/:orderId
// @access  Private
const checkMpesaPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to check payment status for this order'
      });
    }

    res.json({
      success: true,
      data: {
        isPaid: order.isPaid,
        paymentMethod: order.paymentMethod,
        paymentResult: order.paymentResult,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    console.error('Check M-Pesa payment status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while checking payment status'
    });
  }
};

// Helper function to get M-Pesa access token
const getMpesaAccessToken = async () => {
  try {
    // In a real implementation, you would make a request to Safaricom's OAuth endpoint
    // const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    // const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    //   headers: { Authorization: `Basic ${auth}` }
    // });
    // const data = await response.json();
    // return data.access_token;

    // Return mock token for development
    return 'MOCK_ACCESS_TOKEN';
  } catch (error) {
    console.error('Get M-Pesa access token error:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your credit or debit card',
        enabled: !!process.env.STRIPE_SECRET_KEY,
        icon: 'credit-card'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        enabled: !!process.env.PAYPAL_CLIENT_ID,
        icon: 'paypal'
      },
      {
        id: 'mpesa',
        name: 'M-Pesa',
        description: 'Pay with M-Pesa mobile money',
        enabled: !!process.env.MPESA_CONSUMER_KEY,
        icon: 'mobile'
      }
    ];

    res.json({
      success: true,
      data: paymentMethods.filter(method => method.enabled)
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment methods'
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createPayPalOrder,
  capturePayPalPayment,
  initiateMpesaPayment,
  mpesaCallback,
  checkMpesaPaymentStatus,
  getPaymentMethods
};
