const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controller.js");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
