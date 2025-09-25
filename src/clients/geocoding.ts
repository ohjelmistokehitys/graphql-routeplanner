import type { AddressSearchResponse } from "../types/GeocodingApi";

export async function addressSearch(query: string): Promise<AddressSearchResponse | null> {
    console.log(`Address search not implemented. Returning null for ${query}.`);
    return null;
}
