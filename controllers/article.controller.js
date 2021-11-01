const {
  selectArticleById,
  selectArticles,
} = require("../models/article.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectSingleArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
