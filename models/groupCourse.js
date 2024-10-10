// models/groupCourse.js
module.exports = (sequelize, DataTypes) => {
    const GroupCourse = sequelize.define('GroupCourse', {
      groupId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
        },
      },
    });
  
    return GroupCourse;
  };
  