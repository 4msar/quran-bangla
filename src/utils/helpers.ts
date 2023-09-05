import hizbs from "src/data/meta/hizbs.json";
import juz from "src/data/meta/juz.json";
import manzil from "src/data/meta/manzil.json";
import surah from "src/data/meta/surah.json";
import ruku from "src/data/meta/ruku.json";
import page from "src/data/meta/page.json";
import sajdah from "src/data/meta/sajdah.json";

export const getSurahInfo = (surahNumber: number) => {
    return surah.find((sura) => sura.id === surahNumber);
};

export const getHizbInfo = (hizbNumber: number) => {
    return hizbs.find((hizb) => hizb.id === hizbNumber);
};

export const getJuzInfo = (juzNumber: number) => {
    return juz.find((juz) => juz.id === juzNumber);
};

export const getManzilInfo = (manzilNumber: number) => {
    return manzil.find((manzil) => manzil.id === manzilNumber);
};

export const getRukuInfo = (rukuNumber: number) => {
    return ruku.find((ruku) => ruku.id === rukuNumber);
};

export const getPageInfo = (pageNumber: number) => {
    return page.find((page) => page.id === pageNumber);
};

export const getSajdahInfo = (sajdahNumber: number) => {
    return sajdah.find((sajdah) => sajdah.id === sajdahNumber);
};

export const hasSajdah = (surahNumber: number, ayahNumber: number) => {
    return sajdah.find(
        (sajdah) => sajdah.sura === surahNumber && sajdah.aya === ayahNumber
    );
};
