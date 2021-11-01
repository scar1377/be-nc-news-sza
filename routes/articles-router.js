const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
} = require("../controllers/article.controller.js");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id"",)
articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
