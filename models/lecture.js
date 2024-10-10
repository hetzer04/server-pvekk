// models/lecture.js
module.exports = (sequelize, DataTypes) => {
    const Lecture = sequelize.define('Lecture', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
        },
      },
    });
  
    return Lecture;
  };
  