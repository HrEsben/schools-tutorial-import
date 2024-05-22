import mapboxgl from "mapbox-gl";
import { map } from "./map";

export function searchNearbySchools(address, schoolType, radius) {
  const coordinates = address.center;

  map.flyTo({ center: coordinates, zoom: 12 });

  // Fetch schools data and filter by schoolType and radius
  fetch("locations.geojson")
    .then((response) => response.json())
    .then((data) => {
      const features = data.features
        .filter((feature) => {
          const distance = calculateDistance(
            coordinates,
            feature.geometry.coordinates
          );
          return (
            distance <= radius &&
            (schoolType === "all" || feature.properties.type === schoolType)
          );
        })
        .sort((a, b) => {
          return (
            calculateDistance(coordinates, a.geometry.coordinates) -
            calculateDistance(coordinates, b.geometry.coordinates)
          );
        });

      // Update listings
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

      // Add markers to map
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
    });
}

function calculateDistance(coord1, coord2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[1] * Math.PI) / 180) *
      Math.cos((coord2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
