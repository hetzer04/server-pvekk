// models/grade.js
module.exports = (sequelize, DataTypes) => {
    const Grade = sequelize.define('Grade', {
      studentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      testId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tests',
          key: 'id',
        },
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return Grade;
  };
  