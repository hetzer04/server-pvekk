// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Регистрация
router.post('/register', register);

// Вход в систему
router.post('/login', login);

module.exports = router;
