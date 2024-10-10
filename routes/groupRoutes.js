// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  assignStudentToGroup,
} = require('../controllers/groupController');

// Все маршруты защищены аутентификацией
router.use(authMiddleware);

// Получение всех групп доступно для всех авторизованных пользователей
router.get('/', getAllGroups);

// Получение группы по ID
router.get('/:id', getGroupById);

// Маршруты, доступные только Администратору и Куратору
router.use(roleMiddleware(['Администратор', 'Куратор']));

// Создание новой группы
router.post('/', createGroup);

// Обновление группы
router.put('/:id', updateGroup);

// Удаление группы
router.delete('/:id', deleteGroup);

// Назначение студента в группу (Администратор)
router.post('/assign', roleMiddleware(['Администратор']), assignStudentToGroup);

module.exports = router;
