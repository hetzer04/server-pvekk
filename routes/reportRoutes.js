// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Маршрут для экспорта оценок в Excel
router.get(
  '/grades/export',
  authenticateToken,
  authorizeRoles(['Администратор', 'Куратор', 'Преподаватель']),
  reportController.exportGrades
);

module.exports = router;
