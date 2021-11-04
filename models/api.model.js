const { readFile } = require("fs");

exports.getJsonDescriptions = () => {
  const jsonFilePromise = readFile("../endpoints.json", "utf-8");
};
