const { selectCommentsByArticleId } = require("../models/comment.model.js");

exports.getCommentsByArticleId = (req, res, next) => {
  console.log("<<<<<<<<<<<,in controller");
  const { article_id } = req.params;
  console.log(article_id, "<<<<<<<<<<<<<<<<<<<controller");
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
