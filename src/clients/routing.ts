import type { GeoJsonFeature } from "../types/GeocodingApi";
import type { Itinerary, RoutingResponse } from "../types/RoutingApi";


export async function planItinerary(from: GeoJsonFeature, to: GeoJsonFeature, count = 3): Promise<Itinerary[]> {
    console.log(`Itinerary planning not implemented. Returning empty array.`);
    return [];
}
