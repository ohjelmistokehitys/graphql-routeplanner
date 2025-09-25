import type { AddressSearchResponse } from "../types/GeocodingApi";

export async function addressSearch(query: string): Promise<AddressSearchResponse | null> {
    const response = await fetch(`/geocoding/v1/search?text=${encodeURIComponent(query)}&size=1`, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Could not fetch address, got ' + response.status);
    }

    return await response.json();
}
