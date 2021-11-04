const fs = require("fs").promises;
//const { getJsonDescriptions } = require("../models/api.model.js");

exports.getEndpoints = (req, res, next) => {
  console.log("<<<<<<<<<<<<<<<<<in api controller");
  const jsonFilePromise = fs.readFile("./endpoints.json", "utf-8");
  jsonFilePromise
    .then((descriptions) => {
      const parsedDescriptions = JSON.parse(descriptions);
      console.log(
        parsedDescriptions,
        "<<<<<<<<<<<<<<<<<<<<descriptions in controller"
      );
      res.status(200).send({ descriptions: parsedDescriptions });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
