const https = require("https");
const fs = require("fs");
const path = require("path");

const url = "https://optus.dk/locations.geojson";
const targetPath = path.resolve(__dirname, "src/locations.geojson");
const distPath = path.resolve(__dirname, "dist/locations.geojson");

// Ensure the dist directory exists
const distDir = path.resolve(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

https
  .get(url, (response) => {
    const file = fs.createWriteStream(targetPath);
    response.pipe(file);

    file.on("close", () => {
      console.log("Downloaded locations.geojson to", targetPath);
      fs.copyFileSync(targetPath, distPath);
      console.log("Copied locations.geojson to", distPath);
    });
  })
  .on("error", (err) => {
    console.error(`Error fetching locations.geojson: ${err.message}`);
  });
