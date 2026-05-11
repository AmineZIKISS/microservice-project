const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { publishEvent } = require('../config/rabbitmq');

// ---------------------------------------------------------------------------
// Helper — generate JWT
// ---------------------------------------------------------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// ---------------------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ---------------------------------------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Veuillez remplir tous les champs' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Create user (password is hashed by the pre-save hook)
    const user = await User.create({ name, email, password });

    // =================================================================
    //  ② ASYNCHRONOUS COMMUNICATION — Publish event to RabbitMQ
    // =================================================================
    // After successful registration, publish a "user.registered" event.
    // The notification-service will consume this event asynchronously
    // and create a notification record.
    // =================================================================
    console.log('──────────────────────────────────────────────────');
    console.log('② ASYNC COMMUNICATION: Publishing user.registered...');
    console.log('──────────────────────────────────────────────────');

    await publishEvent('user.registered', {
      userId: user._id,
      name: user.name,
      email: user.email,
      registeredAt: user.createdAt,
    });

    // Return user data + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

// ---------------------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Authenticate user & return token
// @access  Public
// ---------------------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Veuillez entrer email et mot de passe' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect' });
    }

    // Return user data + token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile
// @access  Private (JWT required)
// ---------------------------------------------------------------------------
const getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getProfile };
