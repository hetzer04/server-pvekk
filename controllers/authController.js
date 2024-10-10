// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { login, password, name, role } = req.body;

    // Проверка, существует ли пользователь с таким логином
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
    }

    // Создание нового пользователя
    const user = await User.create({ login, password, name, role });

    res.status(201).json({ message: 'Пользователь создан', user: { id: user.id, login: user.login, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Поиск пользователя по логину
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Проверка пароля
    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Генерация JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Успешный вход', token });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
