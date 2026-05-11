const Product = require('../models/Product');

// ---------------------------------------------------------------------------
// @route   GET /api/products
// @desc    Get all products (with optional category filter)
// @access  Public
// ---------------------------------------------------------------------------
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error.message);
    res.status(500).json({ message: 'Erreur lors du chargement des produits' });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/products/categories
// @desc    Get all distinct category names
// @access  Public
// ---------------------------------------------------------------------------
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error.message);
    res
      .status(500)
      .json({ message: 'Erreur lors du chargement des catégories' });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
// ---------------------------------------------------------------------------
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    console.error('Get product error:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getAllProducts, getCategories, getProductById };
