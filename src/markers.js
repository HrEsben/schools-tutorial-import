import map from "./map.js";
import * as mapboxgl from "mapbox-gl";

fetch("/locations.geojson")
  .then((response) => response.json())
  .then((data) => {
    map.on("load", () => {
      map.addSource("locations", {
        type: "geojson",
        data: data,
      });

      data.features.forEach((feature) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = "url(/skole.png)";
        el.style.width = "50px";
        el.style.height = "50px";
        el.style.backgroundSize = "100%";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${feature.properties.navn}</h3><p>${feature.properties.adr}</p>`
            )
          )
          .addTo(map);

        const userLocation = JSON.parse(
          localStorage.getItem("searchAddress")
        ).center;
        const schoolLocation = feature.geometry.coordinates;
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userLocation[0]},${userLocation[1]};${schoolLocation[0]},${schoolLocation[1]}?alternatives=true&annotations=distance,duration&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.routes.length > 0) {
              const distance = data.routes[0].distance;
              const duration = data.routes[0].duration;

              marker.getPopup().setHTML(
                `<h3>${feature.properties.navn}</h3>
                 <p>${feature.properties.adr}</p>
                 <p>Distance: ${(distance / 1000).toFixed(2)} km</p>
                 <p>Duration: ${(duration / 60).toFixed(2)} mins</p>`
              );
            }
          })
          .catch((error) =>
            console.error("Error calculating distance:", error)
          );
      });
    });
  })
  .catch((error) => console.error("Error loading the geoJSON data:", error));
