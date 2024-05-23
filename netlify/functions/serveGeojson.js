const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  const filePath = path.resolve(__dirname, "../../locations.geojson");
  const fileContent = fs.readFileSync(filePath, "utf8");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: fileContent,
  };
};
