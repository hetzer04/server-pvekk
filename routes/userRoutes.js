// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

console.log('userController.getAllUsers:', userController.getAllUsers);
console.log('userController.createUser:', userController.createUser);
console.log('userController.getUserById:', userController.getUserById);
console.log('userController.updateUser:', userController.updateUser);
console.log('userController.deleteUser:', userController.deleteUser);


// Маршрут для получения всех пользователей - только для Администраторов
router.get(
  '/',
  authenticateToken,
  authorizeRoles(['Администратор']),
  userController.getAllUsers
);

// Маршрут для создания нового пользователя - только для Администраторов
router.post(
  '/',
  authenticateToken,
  authorizeRoles(['Администратор']),
  userController.createUser
);

// Маршрут для получения пользователя по ID - доступен Администратору, Куратору, Преподавателю и самому Студенту
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles(['Администратор', 'Куратор', 'Преподаватель', 'Студент']),
  userController.getUserById
);

// Маршрут для обновления пользователя - только для Администраторов
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(['Администратор']),
  userController.updateUser
);

// Маршрут для удаления пользователя - только для Администраторов
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(['Администратор']),
  userController.deleteUser
);

module.exports = router;
