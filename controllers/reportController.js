// controllers/reportController.js
const { Grade, User, Test, Course, Group, StudentGroup } = require('../models');
const { generateGradeReport } = require('../utils/generateExcel');

/**
 * Экспорт оценок в Excel.
 * Доступно для ролей: Администратор, Куратор, Преподаватель.
 */
const exportGrades = async (req, res) => {
  try {
    const { groupId, courseId } = req.query;

    // Проверка наличия groupId и courseId
    if (!groupId || !courseId) {
      return res.status(400).json({ message: 'Необходимы параметры groupId и courseId' });
    }

    // Получение информации о группе и курсе
    const group = await Group.findByPk(groupId);
    const course = await Course.findByPk(courseId);

    if (!group || !course) {
      return res.status(404).json({ message: 'Группа или курс не найдены' });
    }

    // Получение студентов в группе
    const studentGroups = await StudentGroup.findAll({
      where: { groupId },
      include: [{ model: User, as: 'Student', attributes: ['id', 'name'] }],
    });

    const studentIds = studentGroups.map(sg => sg.studentId);

    // Получение оценок по курсу и группе
    const grades = await Grade.findAll({
      include: [
        {
          model: User,
          as: 'Student',
          attributes: ['name'],
          where: { id: studentIds },
        },
        {
          model: Test,
          include: [
            {
              model: Course,
              where: { id: courseId },
              attributes: ['title'],
            },
          ],
          attributes: ['title'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    // Подготовка данных для отчета
    const gradeData = grades.map(grade => ({
      studentName: grade.Student.name,
      testTitle: grade.Test.title,
      score: grade.score,
      createdAt: grade.createdAt.toISOString().split('T')[0],
    }));

    // Генерация Excel-файла
    const buffer = await generateGradeReport(gradeData, group.name, course.title);

    // Установка заголовков для скачивания файла
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=отчет_${group.name}_${course.title}.xlsx`
    );

    // Отправка файла
    res.send(buffer);
  } catch (error) {
    console.error('Ошибка при экспорте отчета:', error);
    res.status(500).json({ message: 'Ошибка при экспорте отчета' });
  }
};

module.exports = {
  exportGrades,
};
