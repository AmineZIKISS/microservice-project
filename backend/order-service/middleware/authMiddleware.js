const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------------
// protect — JWT verification middleware for the Order Service
// ---------------------------------------------------------------------------
// This middleware verifies JWT tokens using the SAME secret as auth-service.
// In a Docker environment, both services receive the same JWT_SECRET via
// docker-compose environment variables, enabling token verification without
// needing to call auth-service (stateless authentication).
// ---------------------------------------------------------------------------

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify using the shared JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user info to request
      req.user = { 
        id: decoded.id,
        email: decoded.email
      };
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
