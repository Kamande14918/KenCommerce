const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    let category;
    
    // Check if the parameter is a valid ObjectId or a slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id);
    } else {
      category = await Category.findOne({ slug: req.params.id });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count for this category
    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productCount
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, description, slug } = req.body;

    // Check if category with this name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists'
      });
    }

    const categoryData = {
      name,
      description,
      slug
    };

    // Handle image upload
    if (req.file) {
      categoryData.image = {
        url: req.file.path,
        alt: name
      };
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, description, slug } = req.body;

    // Check if another category with this name or slug exists
    if (name || slug) {
      const existingCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(name ? [{ name }] : []),
          ...(slug ? [{ slug }] : [])
        ]
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name or slug already exists'
        });
      }
    }

    // Handle image upload
    if (req.file) {
      req.body.image = {
        url: req.file.path,
        alt: name || category.name
      };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      category: category._id
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} product(s) associated with it.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const categories = await Category.find({ 
      isActive: true,
      isFeatured: true 
    })
      .limit(limit)
      .sort({ name: 1 });

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Get featured categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured categories'
    });
  }
};

// @desc    Toggle category active status
// @route   PATCH /api/categories/:id/toggle-status
// @access  Private (Admin only)
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: category
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating category status'
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/categories/:id/stats
// @access  Private (Admin only)
const getCategoryStats = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get comprehensive stats for the category
    const stats = await Product.aggregate([
      {
        $match: {
          category: require('mongoose').Types.ObjectId(req.params.id)
        }
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalSales: { $sum: '$totalSales' },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          averageRating: { $avg: '$averageRating' },
          totalReviews: { $sum: '$numReviews' }
        }
      }
    ]);

    const categoryStats = stats[0] || {
      totalProducts: 0,
      activeProducts: 0,
      totalSales: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      averageRating: 0,
      totalReviews: 0
    };

    res.json({
      success: true,
      data: {
        category,
        stats: categoryStats
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category statistics'
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  toggleCategoryStatus,
  getCategoryStats
};
