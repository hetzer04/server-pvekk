// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
  config.url,
  {
    dialect: config.dialect,
  }
);

// Проверка подключения
sequelize.authenticate()
  .then(() => console.log('Подключение к базе данных успешно!'))
  .catch(err => console.error('Не удалось подключиться к базе данных:', err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт моделей
db.User = require('./user')(sequelize, Sequelize);
db.Group = require('./group')(sequelize, Sequelize);
db.StudentGroup = require('./studentGroup')(sequelize, Sequelize);
db.Course = require('./course')(sequelize, Sequelize);
db.GroupCourse = require('./groupCourse')(sequelize, Sequelize);
db.Lecture = require('./lecture')(sequelize, Sequelize);
db.Test = require('./test')(sequelize, Sequelize);
db.Grade = require('./grade')(sequelize, Sequelize);

// Определение связей
db.User.hasMany(db.Group, { foreignKey: 'curatorId' });
db.Group.belongsTo(db.User, { foreignKey: 'curatorId', as: 'curator' });

db.Group.belongsToMany(db.User, { through: db.StudentGroup, as: 'students', foreignKey: 'groupId' });
db.User.belongsToMany(db.Group, { through: db.StudentGroup, as: 'groups', foreignKey: 'studentId' });

db.User.hasMany(db.Course, { foreignKey: 'createdBy' });
db.Course.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });

db.Course.hasMany(db.Lecture, { foreignKey: 'courseId' });
db.Lecture.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Course.hasMany(db.Test, { foreignKey: 'courseId' });
db.Test.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Group.belongsToMany(db.Course, { through: db.GroupCourse, as: 'courses', foreignKey: 'groupId' });
db.Course.belongsToMany(db.Group, { through: db.GroupCourse, as: 'groups', foreignKey: 'courseId' });

db.User.hasMany(db.Grade, { foreignKey: 'studentId' });
db.Grade.belongsTo(db.User, { foreignKey: 'studentId', as: 'student' });

db.Test.hasMany(db.Grade, { foreignKey: 'testId' });
db.Grade.belongsTo(db.Test, { foreignKey: 'testId' });

module.exports = db;
