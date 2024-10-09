// src/controllers/courseController.js
const db = require('../models/db');

const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const instructor_id = req.user.id;

  try {
    const newCourse = await db.query(
      'INSERT INTO courses (title, description, instructor_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, instructor_id]
    );

    res.status(201).json(newCourse.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await db.query(
      `SELECT courses.*, users.name as instructor_name 
       FROM courses 
       JOIN users ON courses.instructor_id = users.id`
    );

    res.status(200).json(courses.rows);
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await db.query(
      `SELECT courses.*, users.name as instructor_name 
       FROM courses 
       JOIN users ON courses.instructor_id = users.id 
       WHERE courses.id = $1`,
      [id]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Курс не найден.' });
    }

    res.status(200).json(course.rows[0]);
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Проверка, что пользователь является инструктором курса или администратором
    const course = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Курс не найден.' });
    }

    if (course.rows[0].instructor_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен.' });
    }

    const updatedCourse = await db.query(
      'UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );

    res.status(200).json(updatedCourse.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении курса:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Проверка, что пользователь является инструктором курса или администратором
    const course = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Курс не найден.' });
    }

    if (course.rows[0].instructor_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен.' });
    }

    await db.query('DELETE FROM courses WHERE id = $1', [id]);

    res.status(200).json({ message: 'Курс успешно удален.' });
  } catch (error) {
    console.error('Ошибка при удалении курса:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
