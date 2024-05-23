const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  try {
    // Korrekt sti til locations.geojson
    const filePath = path.resolve(__dirname, "../../locations.geojson");
    console.log("Reading file from:", filePath); // Tilføjet logging

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
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
