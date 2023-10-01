const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // Добавляем пакет helmet
const routes = require('./routes/');

const app = express();

// Используем helmet для установки соответствующих HTTP-заголовков безопасности
app.use(helmet());

// Устанавливаем движок для отображения представлений
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware для логгирования запросов
app.use(logger('dev'));

// Middleware для обработки JSON и URL-encoded данных в запросах
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware для обработки куки
app.use(cookieParser());

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем маршруты
app.use(routes);

// Обработка ошибки 404 и передача ее обработчику ошибок
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Обработчик ошибок в режиме разработки (выводит стек вызовов)
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Обработчик ошибок в продакшн (не выводит стек вызовов)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
