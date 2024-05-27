async function searchNearbySchools(coords, schoolType, radius) {
  try {
    const response = await fetch("/locations.geojson");
    const data = await response.json();

    const filteredSchools = data.features.filter((feature) => {
      // Tilføj din filtreringslogik her
      // Eksempelvis kan du filtrere baseret på skoletype og afstand fra koordinaterne
      return true; // Placeholder
    });

    // Resten af din kode til at behandle og vise de filtrerede skoler
  } catch (error) {
    console.error("Error loading the geoJSON data:", error);
  }
}

// Eksempel på kald til funktionen
const coords = [12.568337, 55.676098]; // Eksempel koordinater
searchNearbySchools(coords, "all", 10);
