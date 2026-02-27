import { useState } from 'react';

import { planItinerary } from './clients/routing';
import { AddressInput } from './components/AddressInput';
import { ItineraryView } from './components/ItineraryView';
import type { GeoJsonFeature } from './types/GeocodingApi';
import type { Itinerary } from './types/RoutingApi';

function App() {

    const [loading, setLoading] = useState(false);
    const [from, setFrom] = useState<GeoJsonFeature | null>(null);
    const [to, setTo] = useState<GeoJsonFeature | null>(null);
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);

    const planRoute = async () => {
        setLoading(true);
        setItineraries([]);

        try {
            if (!from || !to) {
                return;
            }

            const results = await planItinerary(from, to);
            setItineraries(results);
        } catch (e) {
            console.error(e);
            alert('Could not plan itinerary. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container">
            <header>
                <h1>Route planner</h1>
            </header>

            <article>
                <h2>Plan a route</h2>
                <fieldset>
                    <AddressInput callback={setFrom} label="From" />
                    <AddressInput callback={setTo} label="To" />
                </fieldset>

                <input
                    type="submit"
                    value="Plan route!"
                    disabled={loading || !from || !to}
                    onClick={planRoute}
                />
            </article>
            <article>
                <h2>Routes</h2>

                {loading ? <progress /> : null}

                {!loading && itineraries.length === 0 ? <p>No routes</p> : null}

                {itineraries.map((itinerary, idx) => (
                    <ItineraryView key={idx} itinerary={itinerary} />
                ))}
            </article>
            <footer>
                <License />
            </footer>
        </main>
    );
}

function License() {
    return <em>
        Digitransit makes the data available based on JHS-189 (permission to use the open data) and <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons name 4.0 (CC BY)</a> licensing.
        See <a href="https://digitransit.fi/en/developers/apis/7-terms-of-use/">Digitransit terms of use</a> for more details.
    </em>;
}

export default App;
