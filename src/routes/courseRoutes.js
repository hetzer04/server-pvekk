// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Получение всех курсов
router.get('/', getCourses);

// Получение курса по ID
router.get('/:id', getCourseById);

// Создание курса (только для аутентифицированных пользователей)
router.post('/', authenticateJWT, createCourse);

// Обновление курса (только для аутентифицированных пользователей)
router.put('/:id', authenticateJWT, updateCourse);

// Удаление курса (только для аутентифицированных пользователей)
router.delete('/:id', authenticateJWT, deleteCourse);

module.exports = router;
