const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments.controller.js");

// commentsRouter.get("/", getCommentsByArticleId);
// console.log("<<<<<<<<<<<<in comments-router");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
