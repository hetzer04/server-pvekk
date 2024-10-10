// models/studentGroup.js
module.exports = (sequelize, DataTypes) => {
    const StudentGroup = sequelize.define('StudentGroup', {
      studentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
    });
  
    return StudentGroup;
  };
  