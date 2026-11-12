import { useEffect, useState } from "react";
import {
    AyahSource,
    getCachedAyats,
    loadAyats,
} from "src/data/translations";
import type { Ayah } from "src/types";

/**
 * Returns the ayahs for `source` once loaded, or null while loading.
 * Passing null (e.g. translation turned off) returns null without loading.
 */
export function useAyats(source: AyahSource | null): Ayah[] | null {
    const [loaded, setLoaded] = useState<{
        source: AyahSource;
        data: Ayah[];
    } | null>(null);

    useEffect(() => {
        if (!source) return;

        let active = true;
        loadAyats(source)
            .then((data) => {
                if (active) setLoaded({ source, data });
            })
            .catch((error: unknown) => {
                console.error(`Failed to load ${source} translation`, error);
            });

        return () => {
            active = false;
        };
    }, [source]);

    if (!source) return null;

    const cached = getCachedAyats(source);
    if (cached) return cached;

    return loaded?.source === source ? loaded.data : null;
}
