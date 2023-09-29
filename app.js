import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import path from 'path';
import routes from './routes/';

const app = express();

// Используем middleware Helmet для добавления заголовков безопасности
app.use(helmet());

// Устанавливаем настройки для движка представлений
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

// Упрощение middleware Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

// Обработчик ошибки 404 (после всех маршрутов)
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Обработчики ошибок
// Обработчик ошибок в режиме разработки
// Отправляем стек ошибки на клиентский интерфейс
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Обработчик ошибок в продакшн режиме
// Не раскрываем стек ошибки клиенту
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

export default app;