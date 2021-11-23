const topicsRouter = require("express").Router();
const {
  getTopics,
  getTopicById,
} = require("../controllers/topics.controller.js");

topicsRouter.get("/", getTopics);
topicsRouter.get("/:slug", getTopicById);

module.exports = topicsRouter;
