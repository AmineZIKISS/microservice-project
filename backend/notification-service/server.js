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
// Connect to RabbitMQ & start consuming events
// ---------------------------------------------------------------------------
// The connectRabbitMQ function in this service acts as a CONSUMER:
// it binds to the "notification_queue" and listens for events
// published by auth-service (user.registered) and order-service (order.created).
// ---------------------------------------------------------------------------
connectRabbitMQ();

// ---------------------------------------------------------------------------
// Initialize Express
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Artisanashop Notification Service',
    status: 'running',
    pattern: 'asynchronous consumer (RabbitMQ)',
    listening: ['user.registered', 'order.created'],
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`🔔 Notification Service running on http://localhost:${PORT}`);
  console.log(`   ② Async consumer → RabbitMQ at ${process.env.RABBITMQ_URL}`);
});
