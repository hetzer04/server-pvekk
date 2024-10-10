// models/test.js
module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      questions: {
        type: DataTypes.JSONB, // Хранение вопросов в формате JSON
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
        },
      },
    });
  
    return Test;
  };
  