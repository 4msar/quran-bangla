import juzMeta from "src/data/meta/juz.json";
import rukuMeta from "src/data/meta/ruku.json";
import surahMeta from "src/data/meta/surah.json";
import type { Ayah, Surah, TranslationId } from "src/types";

export type Position = { sura: number; aya: number };

export const SURAHS: Surah[] = surahMeta;
const surahById = new Map<number, Surah>(SURAHS.map((s) => [s.id, s]));

export const getSurah = (id: number) => surahById.get(id);

export const posKey = (sura: number, aya: number) => `${sura}:${aya}`;

/** Position in the whole Quran, 0-based (Al-Fatihah 1:1 = 0). */
export const toOrdinal = ({ sura, aya }: Position) =>
    (surahById.get(sura)?.start ?? 0) + aya - 1;

export const fromOrdinal = (ordinal: number): Position => {
    const surah =
        SURAHS.find(
            (s) => ordinal >= s.start && ordinal < s.start + s.ayas
        ) ?? SURAHS[SURAHS.length - 1];
    return { sura: surah.id, aya: ordinal - surah.start + 1 };
};

export const inRange = (p: Position, from: Position, to: Position) => {
    const o = toOrdinal(p);
    return o >= toOrdinal(from) && o <= toOrdinal(to);
};

// ---- Juz ----------------------------------------------------------------

export type JuzRange = { id: number; from: Position; to: Position };

const LAST_AYAH_ORDINAL = SURAHS.reduce((sum, s) => sum + s.ayas, 0) - 1;

export const JUZ_RANGES: JuzRange[] = [...juzMeta]
    .sort((a, b) => a.id - b.id)
    .map((juz, index, all) => {
        const next = all[index + 1];
        return {
            id: juz.id,
            from: { sura: juz.sura, aya: juz.aya },
            to: next
                ? fromOrdinal(
                      toOrdinal({ sura: next.sura, aya: next.aya }) - 1
                  )
                : fromOrdinal(LAST_AYAH_ORDINAL),
        };
    });

// ---- Ruku ---------------------------------------------------------------

/** `id` is the global ruku number (1..556); `ruku` restarts in each surah. */
export type RukuRange = {
    id: number;
    sura: number;
    ruku: number;
    from: Position;
    to: Position;
};

const sortedRuku = [...rukuMeta].sort(
    (a, b) => toOrdinal(a) - toOrdinal(b)
);

export const RUKU_RANGES: RukuRange[] = sortedRuku.map((ruku, index) => {
    const next = sortedRuku[index + 1];
    const sameSurah = next !== undefined && next.sura === ruku.sura;
    const surahEnd = surahById.get(ruku.sura)?.ayas ?? ruku.aya;

    return {
        id: index + 1,
        sura: ruku.sura,
        ruku: ruku.ruku,
        from: { sura: ruku.sura, aya: ruku.aya },
        to: {
            sura: ruku.sura,
            aya: sameSurah ? next.aya - 1 : surahEnd,
        },
    };
});

/** Lookup for the ruku that starts at a given ayah. */
export const RUKU_BY_START = new Map<string, RukuRange>(
    RUKU_RANGES.map((r) => [posKey(r.sura, r.from.aya), r])
);

// ---- Rows ---------------------------------------------------------------

export type AyahRow = {
    arabic: Ayah;
    translations: Partial<Record<TranslationId, Ayah>>;
};

export const indexAyats = (list: Ayah[]) =>
    new Map<string, Ayah>(list.map((a) => [posKey(a.sura, a.aya), a]));

// Harakat, superscript alef, Quranic marks and tatweel.
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const BISMILLAH_BARE = "بسم الله الرحمن الرحيم";

/**
 * The source text prefixes ayah 1 of every surah (except 1 and 9) with the
 * Bismillah. The reader shows it once as a heading, so drop it from the verse.
 */
export const stripBismillah = (a: Ayah): Ayah => {
    if (a.aya !== 1 || a.sura === 1) return a;
    const words = a.text.split(/\s+/);
    if (words.length <= 4) return a;
    const head = words.slice(0, 4).join(" ").replace(DIACRITICS, "");
    return head === BISMILLAH_BARE ? { ...a, text: words.slice(4).join(" ") } : a;
};

export const buildRows = (
    arabic: Ayah[],
    translations: Partial<Record<TranslationId, Map<string, Ayah>>>
): AyahRow[] =>
    arabic.map((a) => {
        const key = posKey(a.sura, a.aya);
        const row: AyahRow = { arabic: stripBismillah(a), translations: {} };
        for (const [id, index] of Object.entries(translations)) {
            const t = index?.get(key);
            if (t) row.translations[id as TranslationId] = t;
        }
        return row;
    });

export const getJuzAt = (p: Position) =>
    JUZ_RANGES.find((j) => inRange(p, j.from, j.to));

export const getRukuAt = (p: Position) =>
    RUKU_RANGES.find((r) => r.sura === p.sura && p.aya >= r.from.aya && p.aya <= r.to.aya);
