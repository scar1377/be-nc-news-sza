const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome to NC-News!" });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
