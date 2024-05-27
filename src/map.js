import mapboxgl from "mapbox-gl";
import { searchNearbySchools } from "./search.js";

// Sæt din Mapbox adgangstoken
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHJlc2JlbiIsImEiOiJjbHdjNWp0N2swdzhzMmpwbGpqdXJxcjd6In0.RHcI7DpfwU7KebVqHsZJKA";

// Find HTML-elementet hvor kortet skal placeres
const mapContainer = document.getElementById("map");
let map;

// Tjek om mapContainer elementet findes
if (mapContainer) {
  console.log("Initializing map...");

  // Initialiser et nyt Mapbox kort
  map = new mapboxgl.Map({
    container: "map", // ID på HTML-elementet til kortet
    style: "mapbox://styles/mapbox/standard", // Kort stil
    center: [12.568337, 55.676098], // Initiale koordinater (København)
    zoom: 12, // Initialt zoomniveau
  });

  // Håndter "load" eventen når kortet er fuldt indlæst
  map.on("load", () => {
    console.log("Map loaded");

    // Hent søgeparametre fra lokal lagring
    const address = JSON.parse(localStorage.getItem("searchAddress"));
    const schoolType = localStorage.getItem("searchSchoolType");
    const radius = localStorage.getItem("searchRadius");

    console.log("Address:", address);
    console.log("School type:", schoolType);
    console.log("Radius:", radius);

    // Hvis søgeparametrene findes, fortsæt med at søge efter skoler
    if (address && schoolType && radius) {
      const coordinates = address.coordinates;
      console.log("Coordinates:", coordinates);

      // Kald funktionen til at søge efter nærliggende skoler
      searchNearbySchools(map, coordinates, schoolType, radius);
    }
  });
}

// Eksporter kortet, så det kan bruges andre steder i applikationen
export { map };
