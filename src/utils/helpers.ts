import hizbs from "src/data/meta/hizbs.json";
import juz from "src/data/meta/juz.json";
import manzil from "src/data/meta/manzil.json";
import surah from "src/data/meta/surah.json";
import ruku from "src/data/meta/ruku.json";
import page from "src/data/meta/page.json";
import sajdah from "src/data/meta/sajdah.json";

import ayats_ar from "src/data/ayats_ar.json";
import ayats_bn from "src/data/ayats_bn.json";
import ayats_en from "src/data/ayats_en.json";
import { Ayah } from "src/types";

export const ayats: Record<string, Ayah[]> = {
    bn: ayats_bn,
    en: ayats_en,
    ar: ayats_ar,
};

export const bismillah = {
    bn: "বিসমিল্লাহির রাহমানির রাহীম",
    en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
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

export const getSurahInfo = (surahNumber: number) => {
    return surah.find((surah) => surah.id === surahNumber);
};

export const hasSajdah = (surahNumber: number, ayahNumber: number) => {
    return sajdah.find(
        (sajdah) => sajdah.sura === surahNumber && sajdah.aya === ayahNumber
    );
};

export const isRukuStart = (surahNumber: number, ayahNumber: number) => {
    return ruku.find(
        (ruku) => ruku.sura === surahNumber && ruku.aya === ayahNumber
    );
};

export const getAyahBySurah = (surahNumber: number, lang = "bn") => {
    return ayats[lang].filter((ayah) => ayah.sura === surahNumber);
};

export const getRukuBySurah = (surahNumber: number) => {
    return ruku.filter((ruku) => ruku.sura === surahNumber);
};
