const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard analytics' });
  }
};

// @desc    Manage products
// @route   GET /api/admin/products
// @access  Private (Admin)
const manageProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Manage products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Manage orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
const manageOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Manage orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Manage users
// @route   GET /api/admin/users
// @access  Private (Admin)
const manageUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Manage users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  getDashboardAnalytics,
  manageProducts,
  manageOrders,
  manageUsers,
};
