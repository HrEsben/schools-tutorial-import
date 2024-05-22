import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "your_mapbox_access_token";

const mapContainer = document.getElementById("map");
let map;

if (mapContainer) {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [12.568337, 55.676098],
    zoom: 12,
  });
}

export { map };
