const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const {
  handlePsqlError,
  handleCustomsError,
  handle500ServerError,
} = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);
app.use(handleCustomsError);
app.use(handle500ServerError);

module.exports = app;
