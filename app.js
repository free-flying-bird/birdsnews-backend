const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const referrerPolicy = require('referrer-policy');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();

const cors = require('cors');
const usersRouter = require('./routes/users');
const articlesRouters = require('./routes/articles');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const { MONGO_DB = 'mongodb://localhost:27017/birdsnewsdb' } = process.env;
const app = express();

const corsOptions = {
  origin: ['https://birdsnews.tk'
    || 'http://birdsnews.tk'
    || 'http://localhost:8080'
    || 'http://sokolik90.github.io'
    || 'https://www.sokolik90.github.io'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type',
    'origin',
    'Authorization',
    'x-access-token',
    'accept'],
  credentials: true,
};

// const whitelist = ['https://birdsnews.tk', 'http://localhost:8080', 'http://birdsnews.tk'];
// const corsOptions = {
//   origin(origin, callback) {
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Запрос не разрешен CORS'));
//     }
//   },
//   credentials: true,
// };

// app.use(referrerPolicy());

app.use(helmet());
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', usersRouter, articlesRouters);
app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
