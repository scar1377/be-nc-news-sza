const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles.controller.js");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller.js");

articlesRouter.get("/", getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
