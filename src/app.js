// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const initDB = require('./models/initDB'); // Убедитесь, что путь правильный

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация базы данных
initDB();

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Маршрут по умолчанию
app.get('/', (req, res) => {
  res.send('Добро пожаловать на платформу дистанционного обучения!');
});

// Обработка 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ресурс не найден.' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
});

module.exports = app; // Экспортируйте приложение без вызова app.listen()
