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
// Connect to MongoDB Atlas
// ---------------------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------------------
// Connect to RabbitMQ (with retry logic for Docker startup)
// ---------------------------------------------------------------------------
// Auth service acts as a PUBLISHER: it sends "user.registered" events
// that are consumed asynchronously by the notification-service.
// ---------------------------------------------------------------------------
connectRabbitMQ();

// ---------------------------------------------------------------------------
// Initialize Express
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Parse JSON bodies
app.use(express.json());

// Enable CORS for the React frontend (Vite default port)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'Artisanashop Auth Service',
    status: 'running',
    pattern: 'asynchronous publisher (RabbitMQ)',
    publishes: ['user.registered'],
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
  console.log(`   ② Async events → RabbitMQ at ${process.env.RABBITMQ_URL}`);
});
