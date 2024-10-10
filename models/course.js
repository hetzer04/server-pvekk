// models/course.js
module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    });
  
    return Course;
  };
  