import mapboxgl from "mapbox-gl";
import { getDistance } from "./utils.js";

export function searchNearbySchools(map, coordinates, schoolType, radius) {
  console.log("Searching nearby schools...");
  console.log("Coordinates:", coordinates);

  map.flyTo({ center: coordinates, zoom: 12 });

  fetch("/.netlify/functions/serveGeojson")
    .then((response) => response.json())
    .then((data) => {
      console.log("GeoJSON data loaded:", data);
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

      const listings = document.getElementById("listings");
      listings.innerHTML = "";
      features.forEach((feature) => {
        const listing = document.createElement("div");
        listing.className = "listing";
        listing.innerHTML = `
          <h3>${feature.properties.navn}</h3>
          <p>${feature.properties.adr}</p>
        `;
        listings.appendChild(listing);
      });

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
