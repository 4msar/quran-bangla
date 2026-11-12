import type { Ayah, TranslationId } from "src/types";

/** Arabic is always loaded; translations are loaded only when selected. */
export type AyahSource = TranslationId | "ar";

// Each JSON file becomes its own chunk, so unused translations are never downloaded.
const loaders = import.meta.glob<Ayah[]>("./ayats_*.json", {
    import: "default",
});

const cache = new Map<AyahSource, Ayah[]>();
const inflight = new Map<AyahSource, Promise<Ayah[]>>();

export function getCachedAyats(source: AyahSource): Ayah[] | undefined {
    return cache.get(source);
}

export function loadAyats(source: AyahSource): Promise<Ayah[]> {
    const done = cache.get(source);
    if (done) return Promise.resolve(done);

    const pending = inflight.get(source);
    if (pending) return pending;

    const loader = loaders[`./ayats_${source}.json`];
    if (!loader) {
        return Promise.reject(new Error(`Unknown ayah source: ${source}`));
    }

    const request = loader()
        .then((data) => {
            cache.set(source, data);
            inflight.delete(source);
            return data;
        })
        .catch((error: unknown) => {
            inflight.delete(source);
            throw error;
        });

    inflight.set(source, request);
    return request;
}
