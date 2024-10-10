// models/group.js
module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      curatorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    });
  
    return Group;
  };
  