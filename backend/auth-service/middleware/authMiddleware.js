const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---------------------------------------------------------------------------
// protect — verifies JWT and attaches user to req.user
// ---------------------------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Non autorisé — aucun token fourni' });
  }
};

module.exports = { protect };
