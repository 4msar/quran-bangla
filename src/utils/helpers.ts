import hizbs from "src/data/meta/hizbs.json";
import juz from "src/data/meta/juz.json";
import manzil from "src/data/meta/manzil.json";
import surah from "src/data/meta/surah.json";
import ruku from "src/data/meta/ruku.json";
import page from "src/data/meta/page.json";
import sajdah from "src/data/meta/sajdah.json";
import type { Surah } from "src/types";
import type { UiLang } from "./constants";

export const bismillah = {
    bn: "বিসমিল্লাহির রাহমানির রাহীম",
    en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
};

export const metadata = {
    hizbs,
    juz,
    manzil,
    surah,
    ruku,
    page,
    sajdah,
};

export const getSurahName = (s: Surah, lang: UiLang) =>
    lang === "en" ? s.ename : s.bname;

export const getJuzInfo = (surah: number) => {
    const juzs = juz.filter((juz) => juz.sura === surah).map((juz) => juz.id);

    return [...new Set(juzs)];
};

export const getSurahInfo = (surahNumber: number) => {
    return surah.find((surah) => surah.id === surahNumber);
};

export const hasSajdah = (surahNumber: number, ayahNumber: number) => {
    return sajdah.find(
        (sajdah) => sajdah.sura === surahNumber && sajdah.aya === ayahNumber
    );
};

export const getRukuBySurah = (surahNumber: number) => {
    return ruku.filter((ruku) => ruku.sura === surahNumber);
};

/**
 * Resolves a header search to a route.
 * Accepts a surah number ("2"), a surah name ("baqarah", "The Cow"),
 * or a verse reference ("2:255").
 */
export const resolveSearch = (query: string): string | null => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const verse = q.match(/^(\d{1,3})\s*[:.]\s*(\d{1,3})$/);
    if (verse) {
        const sura = Number(verse[1]);
        const aya = Number(verse[2]);
        const info = getSurahInfo(sura);
        if (!info || aya < 1 || aya > info.ayas) return null;
        return `/${sura}#ayah-${sura}-${aya}`;
    }

    if (/^\d+$/.test(q)) {
        const info = getSurahInfo(Number(q));
        return info ? `/${info.id}` : null;
    }

    const match = surah.find((s) =>
        [s.tname, s.ename, s.bname].some((name) =>
            name.toLowerCase().includes(q)
        )
    );
    return match ? `/${match.id}` : null;
};
