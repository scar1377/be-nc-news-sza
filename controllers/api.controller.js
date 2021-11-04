const fs = require("fs").promises;
const { getJsonDescriptions } = require("../models/api.model.js");

exports.getEndpoints = (req, res, next) => {
  console.log("<<<<<<<<<<<<<<<<<<in api controller");
  getJsonDescriptions()
    .then((descriptions) => {
      res.status(200).send({ descriptions });
    })
    .catch(next);
};
