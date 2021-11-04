const { readFile } = require("fs").promises;

exports.getJsonDescriptions = async () => {
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<in api model");
  const rows = await readFile("./endpoints.json", "utf-8");

  const parsedInfo = JSON.parse(rows);

  return parsedInfo;
};
