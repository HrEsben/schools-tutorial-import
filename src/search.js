import mapboxgl from "mapbox-gl";
import { getDistance } from "./utils.js";

/**
 * Function to search for nearby schools based on coordinates, school type, and radius.
 *
 * @param {object} map - The Mapbox map instance.
 * @param {array} coordinates - Array containing the latitude and longitude.
 * @param {string} schoolType - Type of school to filter by ('all', 'folkeskoler', etc.).
 * @param {number} radius - The radius to search within, in kilometers.
 */
export function searchNearbySchools(map, coordinates, schoolType, radius) {
  console.log("Searching nearby schools...");
  console.log("Coordinates:", coordinates);

  // Move the map to the given coordinates and set zoom level to 12
  map.flyTo({ center: coordinates, zoom: 12 });

  // Fetch the GeoJSON data from the server
  fetch("/locations.geojson")
    .then((response) => response.json())
    .then((data) => {
      console.log("GeoJSON data loaded:", data);

      // Filter and sort the features based on distance and school type
      const features = data.features
        .filter((feature) => {
          const distance = getDistance(
            coordinates,
            feature.geometry.coordinates
          );
          return (
            distance <= radius * 1000 &&
            (schoolType === "all" || feature.properties.type === schoolType)
          );
        })
        .sort((a, b) => {
          return (
            getDistance(coordinates, a.geometry.coordinates) -
            getDistance(coordinates, b.geometry.coordinates)
          );
        });

      console.log("Filtered features:", features);

      // Clear previous listings
      const listings = document.getElementById("listings");
      listings.innerHTML = "";

      // Create and append listings for each filtered feature
      features.forEach((feature) => {
        const listing = document.createElement("div");
        listing.className = "listing";
        listing.innerHTML = `
          <h3>${feature.properties.navn}</h3>
          <p>${feature.properties.adr}</p>
        `;
        listings.appendChild(listing);
        console.log(listing);
      });

      // Add markers to the map for each filtered feature
      features.forEach((feature) => {
        new mapboxgl.Marker()
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${feature.properties.navn}</h3><p>${feature.properties.adr}</p>`
            )
          )
          .addTo(map);
      });
    })
    .catch((error) => console.error("Error loading the geoJSON data:", error));
}
