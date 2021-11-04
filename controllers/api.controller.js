const fs = require("fs").promises;
const { getJsonDescriptions } = require("../models/api.model.js");

exports.getEndpoints = (req, res, next) => {
  getJsonDescriptions()
    .then((descriptions) => {
      res.status(200).send({ descriptions });
    })
    .catch(next);
};
