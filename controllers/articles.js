const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .populate('owner')
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const userId = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner: userId,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail(new NotFoundError('Статья с данным ID не найдена'))
    .then((article) => {
      const { owner } = article;
      if (req.user._id === owner.toString()) {
        Article.deleteOne(article)
          .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }));
      } else {
        throw new ForbiddenError('Нет доступа');
      }
    })
    .catch(next);
};
