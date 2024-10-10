// controllers/userController.js
const { User, Group, StudentGroup } = require('../models');
const bcrypt = require('bcrypt'); // Импортируем библиотеку bcrypt для хеширования паролей

exports.createUser = async (req, res) => {
  try {
    const { login, password, name, role } = req.body;

    // Проверка на наличие обязательных полей
    if (!login || !password || !name || !role) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль с солью

    // Создание нового пользователя
    const newUser = await User.create({
      login,
      password: hashedPassword,
      name,
      role,
    });

    res.status(201).json({
      message: 'Пользователь успешно создан',
      user: {
        id: newUser.id,
        login: newUser.login,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'login', 'name', 'role'],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'login', 'name', 'role'],
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { login, password, name, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновление полей
    if (login) user.login = login;
    if (password) user.password = password; // Хеширование происходит в хуках модели
    if (name) user.name = name;
    if (role) user.role = role;

    await user.save();

    res.json({ message: 'Пользователь обновлён', user: { id: user.id, login: user.login, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.destroy();

    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
