// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err.message);
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  } else {
    console.warn('Authorization header missing');
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = {
  authenticateJWT,
};
