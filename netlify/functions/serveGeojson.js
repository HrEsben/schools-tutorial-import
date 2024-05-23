const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  try {
    const filePath = path.resolve(__dirname, "../../src/locations.geojson");
    console.log("Reading file from:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    console.log("File content read successfully");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: fileContent,
    };
  } catch (error) {
    console.error("Error reading locations.geojson:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to read locations.geojson",
        details: error.message,
      }),
    };
  }
};
