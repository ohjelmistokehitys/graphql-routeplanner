import type { GeoJsonFeature } from "../types/GeocodingApi";
import type { Itinerary, RoutingResponse } from "../types/RoutingApi";


export async function planItinerary(from: GeoJsonFeature, to: GeoJsonFeature, count = 3): Promise<Itinerary[]> {
    return [];
}

/**
 * Formats a GeoJsonFeature coordinate into a string, that is accepted
 * by the digitransit GraphQL API.
 *
 * @param p The GeoJsonFeature to format.
 * @returns The formatted coordinate string.
 */
function formatCoord(p: GeoJsonFeature) {
    return `{ lat: ${p.geometry.coordinates[1]}, lon: ${p.geometry.coordinates[0]} }`;
}
