import type { Surah } from "src/types";
import { getSurah, SURAHS } from "./quran";

/**
 * URL slug: lower-case, apostrophes dropped, everything else non-alphanumeric
 * becomes a hyphen. "Al-An'aam" -> "al-anaam", "Ash-Shu'araa" -> "ash-shuaraa".
 */
export const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/['’`]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export const surahSlug = (surah: Surah) => slugify(surah.tname);

/** Path of a surah's page, e.g. 2 -> "/al-baqara". */
export const surahPath = (sura: number) => {
    const surah = getSurah(sura);
    return `/${surah ? surahSlug(surah) : sura}`;
};

/** Finds a surah from a route param: a slug ("al-baqara") or a number ("2"). */
export const findSurah = (param: string | undefined): Surah | undefined => {
    if (!param) return undefined;
    if (/^\d+$/.test(param)) return getSurah(Number(param));
    const slug = param.toLowerCase();
    return SURAHS.find((s) => surahSlug(s) === slug);
};
