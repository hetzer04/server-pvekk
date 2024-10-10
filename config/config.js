// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: 'postgres',
  },
  // Вы можете добавить конфигурации для тестирования и продакшена
};
