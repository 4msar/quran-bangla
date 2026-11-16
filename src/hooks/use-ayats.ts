import { useEffect, useMemo, useState } from "react";
import {
    AyahSource,
    getCachedAyats,
    loadAyats,
} from "src/data/translations";
import type { Ayah, TranslationId } from "src/types";

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

/**
 * Ayahs for several translations at once, keyed by id. Ids not loaded yet are
 * absent; the result is stable until the set of ids or the loaded data changes.
 */
export function useAyatsMap(ids: TranslationId[]): Partial<Record<TranslationId, Ayah[]>> {
    const key = ids.join(",");
    const [loaded, setLoaded] = useState<Partial<Record<TranslationId, Ayah[]>>>({});

    useEffect(() => {
        let active = true;
        for (const id of key ? (key.split(",") as TranslationId[]) : []) {
            if (getCachedAyats(id)) continue;
            loadAyats(id)
                .then((data) => active && setLoaded((cur) => ({ ...cur, [id]: data })))
                .catch((error: unknown) => console.error(`Failed to load ${id} translation`, error));
        }
        return () => {
            active = false;
        };
    }, [key]);

    return useMemo(() => {
        const out: Partial<Record<TranslationId, Ayah[]>> = {};
        for (const id of key ? (key.split(",") as TranslationId[]) : []) {
            const list = getCachedAyats(id) ?? loaded[id];
            if (list) out[id] = list;
        }
        return out;
    }, [key, loaded]);
}
