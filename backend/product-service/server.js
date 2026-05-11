const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ---------------------------------------------------------------------------
// Load environment variables
// ---------------------------------------------------------------------------
dotenv.config();

// ---------------------------------------------------------------------------
// Connect to MongoDB Atlas
// ---------------------------------------------------------------------------
connectDB();

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
app.use('/api/products', require('./routes/productRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ service: 'Artisanashop Product Service', status: 'running' });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`📦 Product Service running on http://localhost:${PORT}`);
});
