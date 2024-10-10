// utils/generateExcel.js
const ExcelJS = require('exceljs');

/**
 * Функция для генерации отчета об успеваемости студентов.
 * @param {Array} grades - Массив объектов с данными об оценках.
 * @param {String} groupName - Название группы.
 * @param {String} courseTitle - Название курса.
 * @returns {Buffer} - Буфер Excel-файла.
 */
const generateGradeReport = async (grades, groupName, courseTitle) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Отчет об успеваемости');

  // Добавление заголовков
  worksheet.columns = [
    { header: 'Имя Студента', key: 'studentName', width: 30 },
    { header: 'Название Теста', key: 'testTitle', width: 30 },
    { header: 'Оценка', key: 'score', width: 10 },
    { header: 'Дата', key: 'date', width: 15 },
  ];

  // Добавление строк с данными
  grades.forEach(grade => {
    worksheet.addRow({
      studentName: grade.studentName,
      testTitle: grade.testTitle,
      score: grade.score,
      date: grade.createdAt,
    });
  });

  // Форматирование заголовка
  worksheet.getRow(1).font = { bold: true };

  // Добавление информации о группе и курсе
  worksheet.addRow([]);
  worksheet.addRow([`Группа: ${groupName}`]);
  worksheet.addRow([`Курс: ${courseTitle}`]);
  worksheet.addRow([]);

  // Возвращаем буфер Excel-файла
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  generateGradeReport,
};
