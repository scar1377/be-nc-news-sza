const articlesRouter = require("express").Router();
// const commentsRouter = require("./comments-router.js");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles.controller.js");

const {
  getCommentsByArticleId,
} = require("../controllers/comments.controller.js");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

module.exports = articlesRouter;
