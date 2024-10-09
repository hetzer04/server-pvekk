// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Маршрут регистрации
router.post('/register', register);

// Маршрут входа
router.post('/login', login);

module.exports = router;
