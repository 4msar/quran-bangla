// Downloads extra translations from the Quran.com API into src/data/ayats_<file>.json.
// Same shape as the bundled files: [{ id, sura, aya, text }], one row per ayah, in order.
//
// Run from the project root:  node scripts/fetch-translations.mjs
// Re-run only when a translation changes; the JSON files are committed.
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.quran.com/api/v4/quran/translations";

/** Quran.com resource id → file suffix (src/data/ayats_<suffix>.json). */
const SOURCES = {
    taisir: 161, // Taisirul Quran (Bangla)
    mujib: 163, // Sheikh Mujibur Rahman (Bangla)
    rawai: 162, // Rawai Al-Bayan (Bangla)
    saheeh: 20, // Saheeh International (English)
    translit: 57, // English transliteration
};

const ENTITIES = { "&quot;": '"', "&amp;": "&", "&#39;": "'", "&#039;": "'", "&lt;": "<", "&gt;": ">", "&nbsp;": " " };

/** Removes footnote markers and any other markup, then decodes common entities. */
const clean = (html) =>
    html
        .replace(/<sup[^>]*>.*?<\/sup>/gs, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
        .replace(/\s+/g, " ")
        .trim();

for (const [suffix, resourceId] of Object.entries(SOURCES)) {
    const res = await fetch(`${API}/${resourceId}?fields=verse_key`);
    if (!res.ok) throw new Error(`resource ${resourceId}: HTTP ${res.status}`);
    const { translations } = await res.json();

    const rows = translations
        .map((t) => {
            const [sura, aya] = t.verse_key.split(":").map(Number);
            return { sura, aya, text: clean(t.text) };
        })
        .sort((a, b) => a.sura - b.sura || a.aya - b.aya)
        .map((r, i) => ({ id: i + 1, ...r }));

    const empty = rows.filter((r) => !r.text).length;
    if (rows.length !== 6236 || empty) {
        throw new Error(`${suffix}: expected 6236 non-empty ayahs, got ${rows.length} (${empty} empty)`);
    }

    writeFileSync(resolve(root, `src/data/ayats_${suffix}.json`), JSON.stringify(rows, null, 4) + "\n");
    console.log(`${suffix}: ${rows.length} ayahs`);
}
