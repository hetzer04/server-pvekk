// controllers/courseController.js
const { Course, Group, GroupCourse, Lecture, Test, User } = require('../models');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.user.id; // Получено из middleware аутентификации

    const course = await Course.create({ title, description, createdBy });

    res.status(201).json({ message: 'Курс создан', course });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'Creator', attributes: ['id', 'name'] }],
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'name'] },
        { model: Group, through: { attributes: [] } },
        { model: Lecture },
        { model: Test },
      ],
    });
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (title) course.title = title;
    if (description) course.description = description;

    await course.save();

    res.json({ message: 'Курс обновлён', course });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    await course.destroy();

    res.json({ message: 'Курс удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.assignCourseToGroup = async (req, res) => {
  try {
    const { courseId, groupId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    const existingAssignment = await GroupCourse.findOne({ where: { courseId, groupId } });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Курс уже назначен этой группе' });
    }

    const groupCourse = await GroupCourse.create({ courseId, groupId });

    res.status(201).json({ message: 'Курс назначен группе', groupCourse });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.removeCourseFromGroup = async (req, res) => {
  try {
    const { courseId, groupId } = req.body;

    const groupCourse = await GroupCourse.findOne({ where: { courseId, groupId } });
    if (!groupCourse) {
      return res.status(404).json({ message: 'Назначение курса группе не найдено' });
    }

    await groupCourse.destroy();

    res.json({ message: 'Курс удалён из группы' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
