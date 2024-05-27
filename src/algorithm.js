import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHJlc2JlbiIsImEiOiJjbHdjNWp0N2swdzhzMmpwbGpqdXJxcjd6In0.RHcI7DpfwU7KebVqHsZJKA";

const directionsService = mbxDirections({ accessToken: mapboxgl.accessToken });

// Funktion til at udregne antal vejovergange
export async function countRoadCrossings(start, end) {
  const response = await directionsService
    .getDirections({
      profile: "walking",
      waypoints: [{ coordinates: start }, { coordinates: end }],
      steps: true, // Inkluderer detaljerede trin i svar
    })
    .send();

  console.log("Directions response (countRoadCrossings):", response);
  if (!response.body.routes || response.body.routes.length === 0) {
    console.error("No routes found in the directions response.");
    return 0;
  }

  const steps = response.body.routes[0].legs[0].steps;
  let roadCrossings = 0;

  console.log("Steps:", steps);

  for (const step of steps) {
    console.log(
      "Step maneuver type:",
      step.maneuver.type,
      "modifier:",
      step.maneuver.modifier
    );
    if (step.maneuver.type === "turn" || step.maneuver.type === "new name") {
      roadCrossings++;
    }
  }

  console.log("Calculated road crossings:", roadCrossings);
  return roadCrossings;
}

// Funktion til at beregne sikkerhedsscore for en rute
export async function calculateSafetyScore(start, end) {
  console.log("Calculating safety score from:", start, "to:", end);
  const roadCrossings = await countRoadCrossings(start, end);

  const safetyData = {
    roadCrossings,
  };

  console.log("Safety data:", safetyData);
  return safetyData;
}
