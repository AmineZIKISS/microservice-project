const axios = require('axios');
const Order = require('../models/Order');
const { publishEvent } = require('../config/rabbitmq');

// Base URL of the Product Service (set via environment variable)
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';

// =============================================================================
//  ① SYNCHRONOUS COMMUNICATION DEMO — Axios HTTP calls to Product Service
// =============================================================================
//
//  When creating an order, this controller calls the Product Service
//  synchronously via HTTP (Axios) to:
//    1. Validate that each product actually exists
//    2. Check that the product is in stock
//    3. Retrieve the current price (to prevent price manipulation)
//
//  This is a textbook example of synchronous inter-service communication.
// =============================================================================

// ---------------------------------------------------------------------------
// @route   POST /api/orders
// @desc    Create a new order (requires JWT auth)
// @access  Private
// ---------------------------------------------------------------------------
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // --- Validate request body ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Veuillez fournir au moins un article (items)',
      });
    }

    // --- SYNCHRONOUS CALLS: Validate each product via Product Service ---
    console.log('──────────────────────────────────────────────────');
    console.log('① SYNC COMMUNICATION: Calling Product Service...');
    console.log('──────────────────────────────────────────────────');

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: `Article invalide: productId et quantity sont obligatoires`,
        });
      }

      try {
        // ✅ SYNCHRONOUS HTTP CALL via Axios
        console.log(
          `   → GET ${PRODUCT_SERVICE}/api/products/${item.productId}`
        );
        const { data: product } = await axios.get(
          `${PRODUCT_SERVICE}/api/products/${item.productId}`
        );

        // Check stock availability
        if (product.inStock === false) {
          return res.status(400).json({
            message: `Le produit "${product.name}" est en rupture de stock`,
          });
        }

        // Use the REAL price from the Product Service (security measure)
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        console.log(
          `   ✅ Product validated: ${product.name} × ${item.quantity} = ${itemTotal} DH`
        );
      } catch (error) {
        // Product not found or Product Service unavailable
        if (error.response && error.response.status === 404) {
          return res.status(404).json({
            message: `Produit introuvable: ${item.productId}`,
          });
        }
        console.error(
          `   ❌ Failed to reach Product Service:`,
          error.message
        );
        return res.status(503).json({
          message: 'Le service produits est indisponible, réessayez plus tard',
        });
      }
    }

    console.log(`   💰 Total validated: ${totalAmount} DH`);
    console.log('──────────────────────────────────────────────────');

    // --- Create the order in MongoDB ---
    const order = await Order.create({
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      items: validatedItems,
      totalAmount,
      status: 'pending',
    });

    // =================================================================
    //  ② ASYNCHRONOUS COMMUNICATION — Publish event to RabbitMQ
    // =================================================================
    console.log('──────────────────────────────────────────────────');
    console.log('② ASYNC COMMUNICATION: Publishing order.created...');
    console.log('──────────────────────────────────────────────────');

    await publishEvent('order.created', {
      orderId: order._id,
      userId: order.userId,
      userEmail: order.userEmail,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error.message);
    res
      .status(500)
      .json({ message: 'Erreur serveur lors de la création de la commande' });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private
// ---------------------------------------------------------------------------
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res
      .status(500)
      .json({ message: 'Erreur lors du chargement des commandes' });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/orders/:id
// @desc    Get a single order by ID
// @access  Private
// ---------------------------------------------------------------------------
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    // Ensure the user can only see their own orders
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Commande introuvable' });
    }
    console.error('Get order error:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
