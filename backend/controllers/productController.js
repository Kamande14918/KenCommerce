const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName');
    res.status(200).json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName avatar')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar',
        },
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user.id,
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const filter = { status: 'active' };
    if (q) {
      filter.$text = { $search: q };
    }
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    let query = Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName');

    // Sorting
    if (sort) {
      if (sort === 'price_asc') query = query.sort({ price: 1 });
      else if (sort === 'price_desc') query = query.sort({ price: -1 });
      else if (sort === 'newest') query = query.sort({ createdAt: -1 });
      else if (sort === 'rating') query = query.sort({ 'ratings.average': -1 });
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Failed to search products', error: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, status: 'active' })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName');
    res.status(200).json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categorySlug
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const products = await Product.find({ category: category._id, status: 'active' })
      .populate('category', 'name slug')
      .populate('seller', 'firstName lastName businessName');
    res.status(200).json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Failed to fetch products by category', error: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let related = [];
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      related = await Product.find({ _id: { $in: product.relatedProducts }, status: 'active' })
        .populate('category', 'name slug')
        .populate('seller', 'firstName lastName businessName');
    } else {
      // Fallback: find products in the same category
      related = await Product.find({ category: product.category, _id: { $ne: product._id }, status: 'active' })
        .limit(8)
        .populate('category', 'name slug')
        .populate('seller', 'firstName lastName businessName');
    }
    res.status(200).json(related);
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ message: 'Failed to fetch related products', error: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment, pros, cons, recommendedUse, images } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
      pros,
      cons,
      recommendedUse,
      images
    });
    await review.save();

    // Update product ratings
    await product.updateRatings();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Add product review error:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
