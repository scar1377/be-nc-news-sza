const commentsRouter = require("express").Router();
const {
  getCommentsByArticleId,
} = require("../controllers/comments.controller.js");

commentsRouter.get("/", getCommentsByArticleId);
console.log("<<<<<<<<<<<<in comments-router");

module.exports = commentsRouter;
