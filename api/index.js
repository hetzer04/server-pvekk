// api/index.js
const serverless = require('serverless-http');
const expressApp = require('../src/app'); // Импортируйте ваше Express-приложение

module.exports = serverless(expressApp);
