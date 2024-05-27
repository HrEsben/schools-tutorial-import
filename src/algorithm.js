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
    })
    .send();

  const steps = response.body.routes[0].legs[0].steps;
  let roadCrossings = 0;

  for (const step of steps) {
    if (step.maneuver.type === "cross") {
      roadCrossings++;
    }
  }

  return roadCrossings;
}

// Funktion til at kontrollere om der er fortov eller cykelsti
export async function checkSidewalkAndBikePath(start, end) {
  const response = await directionsService
    .getDirections({
      profile: "walking",
      waypoints: [{ coordinates: start }, { coordinates: end }],
    })
    .send();

  const steps = response.body.routes[0].legs[0].steps;
  let sidewalk = false;
  let bikePath = false;

  for (const step of steps) {
    if (step.intersections && step.intersections.length > 0) {
      for (const intersection of step.intersections) {
        if (intersection.sidewalk) {
          sidewalk = true;
        }
        if (intersection.bike_lane) {
          bikePath = true;
        }
      }
    }
  }

  return { sidewalk, bikePath };
}

// Funktion til at kontrollere om der er lyskryds
export async function checkTrafficLights(start, end) {
  const response = await directionsService
    .getDirections({
      profile: "walking",
      waypoints: [{ coordinates: start }, { coordinates: end }],
    })
    .send();

  const steps = response.body.routes[0].legs[0].steps;
  let trafficLights = 0;

  for (const step of steps) {
    if (step.maneuver.modifier === "traffic_light") {
      trafficLights++;
    }
  }

  return trafficLights;
}

// Funktion til at kontrollere om vejen er meget trafikkeret
export async function checkTrafficLevel(start, end) {
  // For simple demonstration, we assume all roads are equally trafficked
  // Replace with actual traffic data API call for better accuracy
  const trafficLevel = "medium"; // Options: 'low', 'medium', 'high'
  return trafficLevel;
}

// Funktion til at beregne sikkerhedsscore for en rute
export async function calculateSafetyScore(start, end) {
  const roadCrossings = await countRoadCrossings(start, end);
  const { sidewalk, bikePath } = await checkSidewalkAndBikePath(start, end);
  const trafficLights = await checkTrafficLights(start, end);
  const trafficLevel = await checkTrafficLevel(start, end);

  let safetyScore = 100;

  // Juster sikkerhedsscore baseret på vejovergange
  safetyScore -= roadCrossings * 5;

  // Juster sikkerhedsscore baseret på tilstedeværelse af fortov og cykelsti
  if (!sidewalk) safetyScore -= 20;
  if (!bikePath) safetyScore -= 20;

  // Juster sikkerhedsscore baseret på trafiklys
  safetyScore += trafficLights * 5;

  // Juster sikkerhedsscore baseret på trafikniveau
  if (trafficLevel === "low") safetyScore += 10;
  else if (trafficLevel === "high") safetyScore -= 10;

  return {
    safetyScore,
    roadCrossings,
    sidewalk,
    bikePath,
    trafficLights,
    trafficLevel,
  };
}
