const https = require("https");
const fs = require("fs");
const path = require("path");

const url = "https://optus.dk/locations.geojson";
const targetPath = path.resolve(__dirname, "src/locations.geojson");

https
  .get(url, (response) => {
    const file = fs.createWriteStream(targetPath);
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log("Downloaded locations.geojson");
    });
  })
  .on("error", (err) => {
    console.error(`Error fetching locations.geojson: ${err.message}`);
  });
