const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/article.controller.js");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
