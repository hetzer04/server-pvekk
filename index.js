// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Пример маршрута
app.get('/', (req, res) => {
  res.send('API работает!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
