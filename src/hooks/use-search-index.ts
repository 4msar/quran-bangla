import { useEffect, useState } from "react";
import { loadAyats } from "src/data/translations";
import { buildSearchIndex, type SearchIndex } from "src/utils";

let cached: SearchIndex[] | null = null;
let pending: Promise<SearchIndex[]> | null = null;

const load = () =>
    (pending ??= Promise.all([loadAyats("ar"), loadAyats("bn"), loadAyats("en")])
        .then(([ar, bn, en]) => (cached = buildSearchIndex(ar, bn, en)))
        .catch((error: unknown) => {
            pending = null;
            throw error;
        }));

/** Full-text index over Arabic, Bangla and English. Null while loading. */
export function useSearchIndex() {
    const [index, setIndex] = useState<SearchIndex[] | null>(cached);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (cached) return;
        let active = true;
        load()
            .then((i) => active && setIndex(i))
            .catch(() => active && setFailed(true));
        return () => {
            active = false;
        };
    }, []);

    return { index, failed };
}
