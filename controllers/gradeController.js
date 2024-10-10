// controllers/gradeController.js
const { Grade, Test, User, Group, StudentGroup } = require('../models');

exports.createGrade = async (req, res) => {
  try {
    const { testId, studentId, score } = req.body;

    // Проверка существования теста и студента
    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'Студент') {
      return res.status(400).json({ message: 'Неверный ID студента' });
    }

    // Проверка, принадлежит ли студент группе, к которой прикреплён тест
    // (предполагается, что тест привязан к курсу, который привязан к группе)

    // Получение курса
    const course = await test.getCourse();
    if (!course) {
      return res.status(400).json({ message: 'Тест не привязан к курсу' });
    }

    // Получение групп, к которым привязан курс
    const groups = await course.getGroups();
    const groupIds = groups.map(group => group.id);

    // Проверка, принадлежит ли студент к одной из этих групп
    const studentGroups = await StudentGroup.findAll({ where: { studentId, groupId: groupIds } });
    if (studentGroups.length === 0) {
      return res.status(400).json({ message: 'Студент не принадлежит к группе, связаной с этим тестом' });
    }

    // Создание оценки
    const grade = await Grade.create({ testId, studentId, score });

    res.status(201).json({ message: 'Оценка создана', grade });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getGradesForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Только сам студент или преподаватель/куратор может просматривать оценки
    if (req.user.role === 'Студент' && req.user.id != studentId) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const grades = await Grade.findAll({
      where: { studentId },
      include: [
        {
          model: Test,
          include: [{ model: require('../models').Course, as: 'Course' }],
        },
      ],
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getGradesForGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Проверка, что пользователь является куратором этой группы или администратором
    if (req.user.role === 'Куратор') {
      const group = await Group.findByPk(groupId);
      if (group.curatorId !== req.user.id) {
        return res.status(403).json({ message: 'Доступ запрещён' });
      }
    }

    const grades = await Grade.findAll({
      include: [
        {
          model: Test,
          include: [{ model: require('../models').Course, as: 'Course' }],
        },
        {
          model: User,
          as: 'Student',
          attributes: ['id', 'name'],
        },
      ],
      where: {
        '$Test.Course.id$': {
          [require('sequelize').Op.in]: 
            (await require('../models').Course.findAll({
              include: [{
                model: require('../models').Group,
                where: { id: groupId },
              }],
              attributes: ['id'],
            })).map(course => course.id)
        }
      },
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Дополнительные методы для получения оценок по курсам и другим критериям можно добавить аналогично
