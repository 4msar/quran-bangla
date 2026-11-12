import juzMeta from "src/data/meta/juz.json";
import rukuMeta from "src/data/meta/ruku.json";
import surahMeta from "src/data/meta/surah.json";
import type { Ayah, Surah } from "src/types";

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

export type AyahRow = { arabic: Ayah; translation?: Ayah };

export const indexAyats = (list: Ayah[]) =>
    new Map<string, Ayah>(list.map((a) => [posKey(a.sura, a.aya), a]));

export const buildRows = (
    arabic: Ayah[],
    translation: Map<string, Ayah> | null
): AyahRow[] =>
    arabic.map((a) => ({
        arabic: a,
        translation: translation?.get(posKey(a.sura, a.aya)),
    }));
