const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overall statistics
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalRevenue,
      newUsersCount,
      newOrdersCount,
      newProductsCount
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Product.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Revenue by period
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topProducts = await Product.aggregate([
      { $match: { totalSales: { $gt: 0 } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          name: 1,
          price: 1,
          totalSales: 1,
          revenue: { $multiply: ['$price', '$totalSales'] },
          'category.name': 1,
          images: { $arrayElemAt: ['$images', 0] }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$totalPrice', 0] } }
        }
      }
    ]);

    // User growth by month
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } // This year
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          totalSales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Recent activities
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find()
      .populate('category', 'name')
      .populate('seller', 'firstName lastName businessName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          totalRevenue: totalRevenue[0]?.total || 0,
          newUsers: newUsersCount,
          newOrders: newOrdersCount,
          newProducts: newProductsCount
        },
        charts: {
          revenueByDay,
          userGrowth,
          orderStatusStats,
          categoryPerformance
        },
        topProducts,
        recentActivity: {
          orders: recentOrders,
          users: recentUsers,
          products: recentProducts
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard analytics'
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private (Admin)
const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Determine grouping format
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00';
        break;
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%U';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    // Sales over time
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products in period
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          averagePrice: { $avg: '$orderItems.price' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.name',
          totalQuantity: 1,
          totalRevenue: 1,
          averagePrice: 1,
          productImage: { $arrayElemAt: ['$product.images', 0] }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 20 }
    ]);

    // Payment method distribution
    const paymentMethodStats = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Geographic distribution (if shipping address available)
    const geographicStats = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter })
        }
      },
      {
        $group: {
          _id: '$shippingAddress.country',
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        salesOverTime,
        topSellingProducts,
        paymentMethodStats,
        geographicStats
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales analytics'
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private (Admin)
const getUserAnalytics = async (req, res) => {
  try {
    // User registration over time
    const userRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User role distribution
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // User activity (orders per user)
    const userActivityStats = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          orderCount: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: { $cond: [{ $eq: ['$$order.isPaid', true] }, '$$order.totalPrice', 0] }
              }
            }
          }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 50 }
    ]);

    // Email verification stats
    const emailVerificationStats = await User.aggregate([
      {
        $group: {
          _id: '$isEmailVerified',
          count: { $sum: 1 }
        }
      }
    ]);

    // Active vs inactive users
    const userStatusStats = await User.aggregate([
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userRegistrations,
        userRoleStats,
        userActivityStats,
        emailVerificationStats,
        userStatusStats
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    });
  }
};

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private (Admin)
const getProductAnalytics = async (req, res) => {
  try {
    // Product performance
    const productPerformance = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          name: 1,
          price: 1,
          stock: 1,
          totalSales: 1,
          averageRating: 1,
          numReviews: 1,
          views: 1,
          isActive: 1,
          categoryName: '$category.name',
          revenue: { $multiply: ['$price', '$totalSales'] },
          conversionRate: {
            $cond: [
              { $gt: ['$views', 0] },
              { $divide: ['$totalSales', '$views'] },
              0
            ]
          }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Category performance
    const categoryPerformance = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalSales: { $sum: '$totalSales' },
          averagePrice: { $avg: '$price' },
          totalRevenue: { $sum: { $multiply: ['$price', '$totalSales'] } },
          averageRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Stock alerts (low stock products)
    const lowStockProducts = await Product.find({
      stock: { $lt: 10, $gt: 0 },
      isActive: true
    })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .limit(20);

    // Out of stock products
    const outOfStockProducts = await Product.find({
      stock: 0,
      isActive: true
    })
      .populate('category', 'name')
      .sort({ updatedAt: -1 })
      .limit(20);

    // Price distribution
    const priceDistribution = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 25, 50, 100, 250, 500, 1000, 2000],
          default: '2000+',
          output: {
            count: { $sum: 1 },
            products: { $push: { name: '$name', price: '$price' } }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        productPerformance,
        categoryPerformance,
        inventory: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        },
        priceDistribution
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product analytics'
    });
  }
};

// @desc    Export data to CSV
// @route   GET /api/admin/export/:type
// @access  Private (Admin)
const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let data;
    let filename;

    switch (type) {
      case 'orders':
        data = await Order.find(
          Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
        )
          .populate('user', 'firstName lastName email')
          .populate('orderItems.product', 'name')
          .lean();
        filename = `orders_${Date.now()}.csv`;
        break;

      case 'users':
        data = await User.find(
          Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
        )
          .select('-password')
          .lean();
        filename = `users_${Date.now()}.csv`;
        break;

      case 'products':
        data = await Product.find(
          Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
        )
          .populate('category', 'name')
          .populate('seller', 'firstName lastName businessName')
          .lean();
        filename = `products_${Date.now()}.csv`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    // In a real implementation, you would convert data to CSV format
    // For now, return JSON data with proper headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    res.json({
      success: true,
      data,
      metadata: {
        type,
        count: data.length,
        exportedAt: new Date().toISOString(),
        filename
      }
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data'
    });
  }
};

// @desc    Get system health metrics
// @route   GET /api/admin/system/health
// @access  Private (Admin)
const getSystemHealth = async (req, res) => {
  try {
    // Database health
    const dbHealth = {
      connected: true, // You can check actual connection status
      collections: {
        users: await User.countDocuments(),
        products: await Product.countDocuments(),
        orders: await Order.countDocuments(),
        categories: await Category.countDocuments(),
        reviews: await Review.countDocuments()
      }
    };

    // Server metrics (simplified)
    const serverMetrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV
    };

    // Recent errors (you could implement error tracking)
    const recentErrors = [];

    res.json({
      success: true,
      data: {
        database: dbHealth,
        server: serverMetrics,
        errors: recentErrors,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system health'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  exportData,
  getSystemHealth
};
