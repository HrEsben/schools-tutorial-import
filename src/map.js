import mapboxgl from "mapbox-gl";
import { searchNearbySchools } from "./search.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHJlc2JlbiIsImEiOiJjbHdjNWp0N2swdzhzMmpwbGpqdXJxcjd6In0.RHcI7DpfwU7KebVqHsZJKA";

const mapContainer = document.getElementById("map");
let map;

if (mapContainer) {
  console.log("Initializing map...");
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [12.568337, 55.676098],
    zoom: 12,
  });

  map.on("load", () => {
    console.log("Map loaded");
    const address = JSON.parse(localStorage.getItem("searchAddress"));
    const schoolType = localStorage.getItem("searchSchoolType");
    const radius = localStorage.getItem("searchRadius");

    console.log("Address:", address);
    console.log("School type:", schoolType);
    console.log("Radius:", radius);

    if (address && schoolType && radius) {
      const coordinates = address.coordinates;
      console.log("Coordinates:", coordinates);
      searchNearbySchools(map, coordinates, schoolType, radius);
    }
  });
}

export { map };
