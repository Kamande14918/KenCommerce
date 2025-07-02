const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    let query = Product.find({});
    // Sorting
    if (req.query.sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    }
    // Limit
    if (req.query.limit) {
      query = query.limit(Number(req.query.limit));
    }
    const products = await query.populate('category', 'name slug');
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
    let product;
    // Try to find by ObjectId first
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      product = await Product.findById(req.params.id)
        .populate('category', 'name slug');
    }
    // If not found, or not a valid ObjectId, try by slug
    if (!product) {
      product = await Product.findOne({ slug: req.params.id })
        .populate('category', 'name slug');
    }
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
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        public_id: file.filename || file.public_id,
        url: file.path || file.url,
        alt: file.originalname || '',
      }));
    }
    const product = new Product({
      ...req.body,
      images,
    });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
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
    // If new images are uploaded, replace images array
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => ({
        public_id: file.filename || file.public_id,
        url: file.path || file.url,
        alt: file.originalname || '',
      }));
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
    let products = [];
    let total = 0;
    if (q) {
      filter.$text = { $search: q };
      products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      total = await Product.countDocuments(filter);
      // If no results, fallback to regex search
      if (products.length === 0) {
        delete filter.$text;
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } }
        ];
        products = await Product.find(filter)
          .populate('category', 'name slug')
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit));
        total = await Product.countDocuments(filter);
      }
    } else {
      if (category) {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
      }
      if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
      products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      total = await Product.countDocuments(filter);
    }
    // Sorting
    if (sort) {
      if (sort === 'price_asc') products = products.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') products = products.sort((a, b) => b.price - a.price);
      else if (sort === 'newest') products = products.sort((a, b) => b.createdAt - a.createdAt);
      else if (sort === 'rating') products = products.sort((a, b) => b.ratings.average - a.ratings.average);
    }
    res.status(200).json({ products, total });
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
    const { limit = 8, sort = 'newest' } = req.query;
    let query = Product.find({ featured: true, status: 'active' })
      .populate('category', 'name slug');
    // Sorting
    if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    }
    // Limit
    query = query.limit(Number(limit));
    const products = await query;
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
    let category = await Category.findOne({ slug: categorySlug });
    if (!category && categorySlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(categorySlug);
    }
    if (!category) {
      category = await Category.findOne({ name: new RegExp('^' + categorySlug + '$', 'i') });
    }
    if (!category) {
      // Fallback: find products whose populated category has a matching slug or id
      const products = await Product.find({ status: 'active' }).populate('category', 'name slug');
      const filtered = products.filter(
        p => p.category && (p.category.slug === categorySlug || p.category._id.toString() === categorySlug)
      );
      if (filtered.length > 0) {
        return res.status(200).json(filtered);
      }
      return res.status(404).json({ message: 'Category not found' });
    }
    const products = await Product.find({ category: category._id, status: 'active' }).populate('category', 'name slug');
    res.status(200).json(products);
  } catch (error) {
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
