const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  try {
    const filePath = path.resolve(__dirname, "../../locations.geojson");
    console.log("Trying to read file from:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
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
    console.error("Error reading locations.geojson:", error.message);
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
