import { useEffect, useState } from "react";
import { addressSearch } from "../clients/geocoding";
import type { AddressSearchResponse, GeoJsonFeature } from "../types/GeocodingApi";


type AddressInputProps = {
    callback: (geo: GeoJsonFeature | null) => void,
    label: string
}

export function AddressInput({ callback, label }: AddressInputProps) {

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<AddressSearchResponse | null>(null);


    const search = async () => {
        try {
            setLoading(true);
            setSearchResult(null);

            const result = await addressSearch(text);
            setSearchResult(result);
        } catch (e) {
            console.error(e);
            alert('Could not search address. See console for details.');
        } finally {
            setLoading(false);
        }
    }

    const properties = searchResult?.features[0]?.properties;

    useEffect(() => {
        callback(searchResult?.features[0] ?? null);
    }, [searchResult, callback]);


    return <form onSubmit={e => { e.preventDefault(); search(); }}>
        <fieldset role="group">
            <input
                required
                placeholder={label}
                value={text}
                onChange={e => setText(e.target.value)}
                onSubmit={e => { e.preventDefault(); }}
            />
            <button onClick={search} disabled={loading || !text}>Search</button>
        </fieldset>
        <p>{loading ? 'Searching...' : properties?.label || 'No results found'}</p>
    </form>;
}
