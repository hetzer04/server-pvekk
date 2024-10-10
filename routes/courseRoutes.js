// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignCourseToGroup,
} = require('../controllers/courseController');

// Все маршруты защищены аутентификацией
router.use(authMiddleware);

// Получение всех курсов доступно для всех авторизованных пользователей
router.get('/', getAllCourses);

// Получение курса по ID
router.get('/:id', getCourseById);

// Маршруты, доступные только Преподавателям и Куратору
router.use(roleMiddleware(['Администратор', 'Куратор', 'Преподаватель']));

// Создание нового курса
router.post('/', createCourse);

// Обновление курса
router.put('/:id', updateCourse);

// Удаление курса
router.delete('/:id', deleteCourse);

// Назначение курса группе
router.post('/assign', assignCourseToGroup);

module.exports = router;
