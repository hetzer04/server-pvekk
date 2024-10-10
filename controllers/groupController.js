// controllers/groupController.js
const { Group, User, StudentGroup } = require('../models');

exports.createGroup = async (req, res) => {
  try {
    const { name, curatorId } = req.body;

    // Проверка, существует ли куратор
    const curator = await User.findByPk(curatorId);
    if (!curator || curator.role !== 'Куратор') {
      return res.status(400).json({ message: 'Неверный ID куратора' });
    }

    const group = await Group.create({ name, curatorId });
    res.status(201).json({ message: 'Группа создана', group });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{ model: User, as: 'Curator', attributes: ['id', 'name'] }],
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id, {
      include: [{ model: User, as: 'Curator', attributes: ['id', 'name'] }],
    });
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, curatorId } = req.body;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    if (curatorId) {
      const curator = await User.findByPk(curatorId);
      if (!curator || curator.role !== 'Куратор') {
        return res.status(400).json({ message: 'Неверный ID куратора' });
      }
      group.curatorId = curatorId;
    }

    if (name) group.name = name;

    await group.save();

    res.json({ message: 'Группа обновлена', group });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    await group.destroy();

    res.json({ message: 'Группа удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.assignStudentToGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;

    // Проверка существования группы и студента
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'Студент') {
      return res.status(400).json({ message: 'Неверный ID студента' });
    }

    // Создание связи в StudentGroup
    const existingAssignment = await StudentGroup.findOne({ where: { groupId, studentId } });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Студент уже назначен в эту группу' });
    }

    const studentGroup = await StudentGroup.create({ groupId, studentId });

    res.status(201).json({ message: 'Студент назначен в группу', studentGroup });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

exports.removeStudentFromGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;

    const studentGroup = await StudentGroup.findOne({ where: { groupId, studentId } });
    if (!studentGroup) {
      return res.status(404).json({ message: 'Связь между студентом и группой не найдена' });
    }

    await studentGroup.destroy();

    res.json({ message: 'Студент удалён из группы' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
