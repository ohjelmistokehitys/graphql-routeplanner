import type { AddressSearchResponse } from "../types/GeocodingApi";

export async function addressSearch(query: string): Promise<AddressSearchResponse | null> {
    const response = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${encodeURIComponent(query)}&size=1`, {
        headers: {
            'Accept': 'application/json',
            'digitransit-subscription-key': import.meta.env.VITE_DIGITRANSIT_SUBSCRIPTION_KEY
        },
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Could not fetch address, got ' + response.status);
    }

    return await response.json();
}
