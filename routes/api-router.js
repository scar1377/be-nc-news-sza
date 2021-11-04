const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const { getEndpoints } = require("../controllers/api.controller.js");

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
