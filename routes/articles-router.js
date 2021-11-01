const articlesRouter = require("express").Router();
const {
  getSingleArticle,
  getArticles,
} = require("../controllers/article.controller.js");

articlesRouter.get("/:article_id", getSingleArticle);
articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
