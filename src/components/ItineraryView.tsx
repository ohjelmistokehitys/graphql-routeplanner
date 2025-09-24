import type { Itinerary, Mode } from "../types/RoutingApi";


export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
    const duration = (itinerary.end - itinerary.start) / 60 / 1_000;

    return <article>
        <div>
            {new Date(itinerary.start).toISOString()} - {new Date(itinerary.end).toISOString()}
        </div>
        <div><strong>Duration:</strong> {Math.round(duration)} min</div>
        <div><strong>Walking distance:</strong> {Math.round(itinerary.walkDistance)} m</div>

        <table>
            <thead>
                <tr>
                    <th scope="col">Mode</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Line</th>
                    <th scope="col">Route</th>
                </tr>
            </thead>
            <tbody>
                {itinerary.legs.map((leg, legIdx) => (
                    <tr key={legIdx}>
                        <td>{icons[leg.mode]}</td>
                        <td>{leg.from?.name}</td>
                        <td>{leg.to?.name}</td>
                        <td>{Math.round(leg.distance)} m</td>
                        <td>{leg.route?.shortName}</td>
                        <td>{leg.route?.longName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </article>
};


const icons: Record<Mode, string> = {
    WALK: '🚶‍',
    BUS: '🚍',
    RAIL: '🚆',
    TRAM: '🚋',
    FERRY: '🚢',
    AIRPLANE: '🛫',
    BICYCLE: '🚲',
    CABLE_CAR: '🚠',
    CAR: '🚘',
    FUNICULAR: '🚟',
    GONDOLA: '🚡',
    LEG_SWITCH: '🔀',
    SUBWAY: '🚇',
    TRANSIT: '🏇'
};
