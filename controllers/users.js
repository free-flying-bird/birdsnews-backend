const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');
const AuthError = require('../errors/AuthError');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictingRequestError('Указанный email уже занят');
      } else next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 2,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Успешная авторизация' })
        .end();
    })
    .catch(() => {
      throw new AuthError('Неверная почта или пароль');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с данным ID не найден'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    maxAge: 0,
    sameSite: true,
  });
  res.status(200).send({ message: 'Выход выполнен успешно' });
};
