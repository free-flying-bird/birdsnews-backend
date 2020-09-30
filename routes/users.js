const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsersById } = require('../controllers/users');

usersRouter.get('/users/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUsersById);

module.exports = usersRouter;
