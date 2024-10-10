// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация запрещена' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });
    if (!req.user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Токен недействителен' });
  }
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
