import type { Ayah } from "src/types";

// Harakat, superscript alef, Quranic marks and tatweel.
const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;

/** Lowercase and fold Arabic spelling variants so plain typing matches the text. */
export const normalizeText = (text: string) =>
    text
        .normalize("NFC")
        .replace(ARABIC_MARKS, "")
        .replace(/[إأآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .toLowerCase();

export const tokenize = (query: string) =>
    normalizeText(query).split(/[\s,;.!?()"'“”‘’]+/).filter(Boolean);

export type SearchHit = { sura: number; aya: number };

export type SearchIndex = {
    ayah: Ayah;
    ar: string;
    bn: string;
    en: string;
};

export const buildSearchIndex = (ar: Ayah[], bn: Ayah[], en: Ayah[]): SearchIndex[] => {
    const bnMap = new Map(bn.map((a) => [a.id, a.text]));
    const enMap = new Map(en.map((a) => [a.id, a.text]));
    return ar.map((ayah) => ({
        ayah,
        ar: normalizeText(ayah.text),
        bn: normalizeText(bnMap.get(ayah.id) ?? ""),
        en: normalizeText(enMap.get(ayah.id) ?? ""),
    }));
};

/** Every word must appear (in any one of the three texts); ranked by how many words hit. */
export const searchIndex = (index: SearchIndex[], query: string): Ayah[] => {
    const tokens = tokenize(query);
    if (!tokens.length) return [];
    const scored: { ayah: Ayah; score: number }[] = [];
    for (const row of index) {
        let score = 0;
        let ok = true;
        for (const t of tokens) {
            const inAr = row.ar.includes(t);
            const inBn = row.bn.includes(t);
            const inEn = row.en.includes(t);
            if (!inAr && !inBn && !inEn) {
                ok = false;
                break;
            }
            score += Number(inAr) + Number(inBn) + Number(inEn);
        }
        if (ok) scored.push({ ayah: row.ayah, score });
    }
    return scored.sort((a, b) => b.score - a.score || a.ayah.id - b.ayah.id).map((s) => s.ayah);
};
