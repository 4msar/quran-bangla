/**
 * Tafsir Ibn Kathir, fetched per ayah from the Quran.com API (too large to bundle).
 * A response may cover several ayahs at once (e.g. 2:8–9); `verses` lists them.
 */
export type TafseerLang = "bn" | "en";

export type Tafseer = {
    /** Sanitised HTML. */
    html: string;
    /** "sura:aya" keys this tafsir passage covers, in order. */
    verses: string[];
};

const API = "https://api.quran.com/api/v4/tafsirs";

/** Quran.com resource ids. */
export const TAFSEER_SOURCES: Record<TafseerLang, { id: number; name: string; bn: string }> = {
    bn: { id: 164, name: "Tafsir Ibn Kathir (Bangla)", bn: "তাফসীর ইবনে কাসীর" },
    en: { id: 169, name: "Tafsir Ibn Kathir (Abridged)", bn: "তাফসীর ইবনে কাসীর (ইংরেজি)" },
};

const cache = new Map<string, Tafseer>();
const inflight = new Map<string, Promise<Tafseer>>();

const cacheKey = (lang: TafseerLang, sura: number, aya: number) => `${lang}:${sura}:${aya}`;

// Third-party HTML: keep a small set of text tags and drop every attribute.
const ALLOWED = new Set([
    "P", "BR", "H1", "H2", "H3", "H4", "B", "STRONG", "I", "EM", "U",
    "SPAN", "BLOCKQUOTE", "UL", "OL", "LI", "SUP", "SUB", "DIV",
]);
const HEADINGS = new Set(["H1", "H2"]);

export function sanitizeTafseer(raw: string): string {
    const doc = new DOMParser().parseFromString(`<div>${raw}</div>`, "text/html");
    const root = doc.body.firstElementChild;
    if (!root) return "";

    const clean = (node: Element) => {
        for (const child of Array.from(node.children)) {
            if (!ALLOWED.has(child.tagName)) {
                if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|LINK|META)$/.test(child.tagName)) {
                    child.remove();
                    continue;
                }
                // Unknown tag: keep its text, lose the element.
                clean(child);
                child.replaceWith(...Array.from(child.childNodes));
                continue;
            }
            for (const attr of Array.from(child.attributes)) child.removeAttribute(attr.name);
            // Demote big headings so they sit under the drawer's own title.
            if (HEADINGS.has(child.tagName)) {
                const h3 = doc.createElement("h3");
                h3.append(...Array.from(child.childNodes));
                child.replaceWith(h3);
                clean(h3);
                continue;
            }
            clean(child);
        }
    };
    clean(root);
    return root.innerHTML;
}

export function getCachedTafseer(lang: TafseerLang, sura: number, aya: number) {
    return cache.get(cacheKey(lang, sura, aya));
}

export function loadTafseer(lang: TafseerLang, sura: number, aya: number): Promise<Tafseer> {
    const key = cacheKey(lang, sura, aya);
    const done = cache.get(key);
    if (done) return Promise.resolve(done);
    const pending = inflight.get(key);
    if (pending) return pending;

    const url = `${API}/${TAFSEER_SOURCES[lang].id}/by_ayah/${sura}:${aya}`;
    const request = fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`Tafseer request failed (${res.status})`);
            return res.json() as Promise<{
                tafsir: { text: string; verses: Record<string, unknown> };
            }>;
        })
        .then(({ tafsir }) => {
            const result: Tafseer = {
                html: sanitizeTafseer(tafsir.text ?? ""),
                verses: Object.keys(tafsir.verses ?? {}),
            };
            // One passage covers every ayah in its group: cache it for all of them.
            for (const v of result.verses.length ? result.verses : [`${sura}:${aya}`]) {
                const [s, a] = v.split(":").map(Number);
                cache.set(cacheKey(lang, s, a), result);
            }
            inflight.delete(key);
            return result;
        })
        .catch((error: unknown) => {
            inflight.delete(key);
            throw error;
        });

    inflight.set(key, request);
    return request;
}
