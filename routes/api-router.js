const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const { getEndpoints } = require("../controllers/api.controller.js");

apiRouter.get("/", getEndpoints);
// (req, res) => {
//   res.status(200).send({ msg: "Welcome to NC-News!" });
// });

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);
//apiRouter.use("/articles/:article_id/comments", commentsRouter);
// console.log("<<<<<<<<<<<<<<<<<<<<in apiRouter");

module.exports = apiRouter;
