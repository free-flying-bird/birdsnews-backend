const usersRouter = require('express').Router();
const { getUser, logout } = require('../controllers/users');

usersRouter.get('/users/me', getUser);

usersRouter.post('/logout', logout);

module.exports = usersRouter;
