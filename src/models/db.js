// src/models/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Глобальная переменная для пула соединений
let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 20, // Максимальное количество соединений
    idleTimeoutMillis: 30000, // Время ожидания неактивного соединения
    connectionTimeoutMillis: 2000, // Время ожидания соединения
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
  });
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
