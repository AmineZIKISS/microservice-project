const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getCategories,
  getProductById,
} = require('../controllers/productController');

// GET all products (supports ?category= query)
router.get('/', getAllProducts);

// GET distinct categories (must be BEFORE /:id to avoid conflict)
router.get('/categories', getCategories);

// GET single product by ID
router.get('/:id', getProductById);

module.exports = router;
