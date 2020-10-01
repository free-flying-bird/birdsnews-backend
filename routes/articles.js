const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^http[s]?:\/{2}(w{3}\.)?(([a-z0-9]+[a-z0-9-_]*(\.[a-z0-9]+[a-z0-9-_]*)*(\.[a-z]+))|(\d+(\.\d+){1,4}))(:\d+)?(\/[a-z0-9_-]+)*\/?#?/),
    image: Joi.string().required().regex(/^http[s]?:\/{2}(w{3}\.)?(([a-z0-9]+[a-z0-9-_]*(\.[a-z0-9]+[a-z0-9-_]*)*(\.[a-z]+))|(\d+(\.\d+){1,4}))(:\d+)?(\/[a-z0-9_-]+)*\/?#?/),
  }),
}), createArticle);

articlesRouter.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    ArticleId: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = articlesRouter;
