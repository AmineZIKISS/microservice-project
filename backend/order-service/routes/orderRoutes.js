const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes require authentication (JWT)
router.use(protect);

// POST /api/orders — Create a new order
//   → Triggers SYNC call to product-service (Axios)
//   → Triggers ASYNC event to RabbitMQ (order.created)
router.post('/', createOrder);

// GET /api/orders — Get current user's orders
router.get('/', getUserOrders);

// GET /api/orders/:id — Get a specific order
router.get('/:id', getOrderById);

module.exports = router;
