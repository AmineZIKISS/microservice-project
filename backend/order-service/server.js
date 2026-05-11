const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');

// ---------------------------------------------------------------------------
// Load environment variables
// ---------------------------------------------------------------------------
dotenv.config();

// ---------------------------------------------------------------------------
// Connect to MongoDB
// ---------------------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------------------
// Connect to RabbitMQ (with retry logic for Docker startup)
// ---------------------------------------------------------------------------
connectRabbitMQ();

// ---------------------------------------------------------------------------
// Initialize Express
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Parse JSON request bodies
app.use(express.json());

// Enable CORS for the React frontend
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Artisanashop Order Service',
    status: 'running',
    patterns: ['synchronous (Axios → Product Service)', 'asynchronous (RabbitMQ publisher)'],
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🛒 Order Service running on http://localhost:${PORT}`);
  console.log(`   ① Sync calls → Product Service at ${process.env.PRODUCT_SERVICE_URL}`);
  console.log(`   ② Async events → RabbitMQ at ${process.env.RABBITMQ_URL}`);
});
