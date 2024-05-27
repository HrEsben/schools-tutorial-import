import mapboxgl from "mapbox-gl";
import { getDistance } from "./utils.js";
import { calculateSafetyScore } from "./algorithm.js";

/**
 * Function to search for nearby schools based on coordinates, school type, and radius.
 *
 * @param {object} map - The Mapbox map instance.
 * @param {array} coordinates - Array containing the latitude and longitude.
 * @param {string} schoolType - Type of school to filter by ('all', 'folkeskoler', etc.).
 * @param {number} radius - The radius to search within, in kilometers.
 */
export async function searchNearbySchools(
  map,
  coordinates,
  schoolType,
  radius
) {
  console.log("Searching nearby schools...");
  console.log("Coordinates:", coordinates);

  // Move the map to the given coordinates and set zoom level to 12
  map.flyTo({ center: coordinates, zoom: 12 });

  try {
    const response = await fetch("/locations.geojson");
    const data = await response.json();
    console.log("GeoJSON data loaded:", data);

    // Filter and sort the features based on distance and school type
    const features = data.features
      .filter((feature) => {
        const distance = getDistance(coordinates, feature.geometry.coordinates);
        feature.properties.distance = distance / 1000; // Distance in kilometers
        return (
          distance <= radius * 1000 &&
          (schoolType === "all" || feature.properties.type === schoolType)
        );
      })
      .sort((a, b) => {
        return a.properties.distance - b.properties.distance;
      });

    console.log("Filtered features:", features);

    // Clear previous listings
    const listings = document.getElementById("listings");
    listings.innerHTML = "";

    for (const feature of features) {
      // Calculate safety score for the route
      console.log("Calculating safety score for feature:", feature);
      const safetyData = await calculateSafetyScore(
        coordinates,
        feature.geometry.coordinates
      );
      console.log("Safety data for feature:", safetyData);

      feature.properties.safetyScore = safetyData.safetyScore;
      feature.properties.roadCrossings = safetyData.roadCrossings;
      feature.properties.sidewalk = safetyData.sidewalk;
      feature.properties.bikePath = safetyData.bikePath;
      feature.properties.trafficLights = safetyData.trafficLights;
      feature.properties.trafficLevel = safetyData.trafficLevel;

      const listing = document.createElement("div");
      listing.className = "listing";
      listing.innerHTML = `
        <h3>${feature.properties.navn}</h3>
        <p>${feature.properties.adr}</p>
        <p>Afstand: ${feature.properties.distance.toFixed(2)} km</p>
        <p>Sikkerhedsscore: ${feature.properties.safetyScore}</p>
        <p>Vejovergange: ${feature.properties.roadCrossings}</p>
        <p>Fortov: ${feature.properties.sidewalk ? "Ja" : "Nej"}</p>
        <p>Cykelsti: ${feature.properties.bikePath ? "Ja" : "Nej"}</p>
        <p>Trafiklys: ${feature.properties.trafficLights}</p>
        <p>Trafikniveau: ${feature.properties.trafficLevel}</p>
      `;
      listings.appendChild(listing);
    }

    // Add markers to the map for each filtered feature
    features.forEach((feature) => {
      new mapboxgl.Marker()
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${feature.properties.navn}</h3><p>${
              feature.properties.adr
            }</p><p>Afstand: ${feature.properties.distance.toFixed(
              2
            )} km</p><p>Sikkerhedsscore: ${
              feature.properties.safetyScore
            }</p><p>Vejovergange: ${
              feature.properties.roadCrossings
            }</p><p>Fortov: ${
              feature.properties.sidewalk ? "Ja" : "Nej"
            }</p><p>Cykelsti: ${
              feature.properties.bikePath ? "Ja" : "Nej"
            }</p><p>Trafiklys: ${
              feature.properties.trafficLights
            }</p><p>Trafikniveau: ${feature.properties.trafficLevel}</p>`
          )
        )
        .addTo(map);
    });
  } catch (error) {
    console.error("Error loading the geoJSON data:", error);
  }
}
