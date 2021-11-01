const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const { handleCustomsError } = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});
app.use(handleCustomsError);

module.exports = app;
