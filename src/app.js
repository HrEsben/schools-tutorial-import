import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { searchNearbySchools } from "./search";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHJlc2JlbiIsImEiOiJjbHdjNWp0N2swdzhzMmpwbGpqdXJxcjd6In0.RHcI7DpfwU7KebVqHsZJKA";

document.addEventListener("DOMContentLoaded", () => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Indtast din adresse",
    mapboxgl: mapboxgl,
  });

  geocoder.addTo("#geocoder");

  const slider = document.getElementById("radius-slider");
  const radiusValue = document.getElementById("radius-value");

  if (slider && radiusValue) {
    slider.addEventListener("input", (e) => {
      radiusValue.textContent = e.target.value;
    });
  }

  const searchButton = document.getElementById("search-button");

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const address = geocoder.lastSelected;
      const schoolType = document.getElementById("school-type").value;
      const radius = slider.value;

      localStorage.setItem("searchAddress", JSON.stringify(address));
      localStorage.setItem("searchSchoolType", schoolType);
      localStorage.setItem("searchRadius", radius);

      window.location.href = "map.html";
    });
  } else {
    const address = JSON.parse(localStorage.getItem("searchAddress"));
    const schoolType = localStorage.getItem("searchSchoolType");
    const radius = localStorage.getItem("searchRadius");

    if (address && schoolType && radius) {
      searchNearbySchools(address, schoolType, radius);
    }
  }
});
