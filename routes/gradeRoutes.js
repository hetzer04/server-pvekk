// routes/gradeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  createGrade,
  getGradesForStudent,
  getGradesByGroup,
  getGradesByCourse,
} = require('../controllers/gradeController');

// Все маршруты защищены аутентификацией
router.use(authMiddleware);

// Создание оценки доступно для Преподавателей и Кураторов
router.post('/', roleMiddleware(['Преподаватель', 'Куратор']), createGrade);

// Получение оценок для студента (доступно студенту самому и преподавателям/кураторам)
router.get('/student/:studentId', getGradesForStudent);

// Получение оценок по группе (доступно кураторам и администраторам)
router.get('/group/:groupId', roleMiddleware(['Куратор', 'Администратор']), getGradesByGroup);

// Получение оценок по курсу (доступно преподавателям, кураторам и администраторам)
router.get('/course/:courseId', roleMiddleware(['Преподаватель', 'Куратор', 'Администратор']), getGradesByCourse);

module.exports = router;
