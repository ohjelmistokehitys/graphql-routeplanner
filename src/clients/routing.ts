import type { GeoJsonFeature } from "../types/GeocodingApi";
import type { Itinerary, RoutingResponse } from "../types/RoutingApi";


export async function planItinerary(from: GeoJsonFeature, to: GeoJsonFeature, count = 3): Promise<Itinerary[]> {
    const query = `{
        plan(
            from: ${formatCoord(from)}
            to: ${formatCoord(to)}
            numItineraries: ${count}
        ) {
            itineraries {
                start
                end
                walkTime
                walkDistance
                legs {
                    from {
                        name
                        lat
                        lon
                    }
                    to {
                        name
                        lat
                        lon
                    }
                    startTime
                    endTime
                    mode
                    duration
                    distance
                    route {
                        shortName
                        longName
                    }
                }
            }
        }
    }`;

    // this request goes to our local proxy, which adds the authentication headers
    // and forwards the request to the actual digitransit API:
    const response = await fetch('https://api.digitransit.fi/routing/v2/hsl/gtfs/v1', {
        headers: {
            'Content-Type': 'application/graphql',
            'digitransit-subscription-key': import.meta.env.VITE_DIGITRANSIT_SUBSCRIPTION_KEY
        },
        method: 'POST',
        body: query
    });

    if (!response.ok) {
        console.error(response);
        throw new Error('GraphQL query failed.');
    }

    const routingResponse: RoutingResponse = await response.json();
    return routingResponse.data.plan.itineraries;
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
