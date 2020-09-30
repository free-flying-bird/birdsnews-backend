const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');
const ForbiddenError = require('../errors/ForbiddenError');

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
    .orFail()
    .then((article) => {
      const { owner } = article;
      if (req.user._id === owner.toString()) {
        Article.findByIdAndRemove(req.params.id)
          .then(() => res.send({ message: 'Карточка успешно удалена' }));
      } throw new ForbiddenError('Нет доступа');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new AuthError('Переданы некорректные данные');
      } else next(err);
    })
    .catch(next);
};
