const {
  selectCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/comment.model.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  addCommentByArticleId(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
