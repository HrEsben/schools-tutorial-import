/**
 * Function to calculate the distance between two coordinates using the Haversine formula.
 *
 * @param {array} coord1 - Array containing the latitude and longitude of the first coordinate.
 * @param {array} coord2 - Array containing the latitude and longitude of the second coordinate.
 * @returns {number} - The distance between the two coordinates in meters.
 */
export function getDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1[1] * Math.PI) / 180;
  const φ2 = (coord2[1] * Math.PI) / 180;
  const Δφ = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const Δλ = ((coord2[0] - coord1[0]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
