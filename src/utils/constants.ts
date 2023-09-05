import { Language } from "src/types";

export const getLanguageName = (lang: string) => {
    switch (lang) {
        case "bn":
            return "বাংলা";
        case "en":
            return "English";
        case "ar":
            return "العربية";
        default:
            return "বাংলা";
    }
};

export const getSurahPrefix = (lang: string) => {
    switch (lang) {
        case "bn":
            return "সূরাহ";
        case "en":
            return "Surah";
        case "ar":
            return "سورة";
        default:
            return "সূরাহ";
    }
};

export const getRukuPrefix = (lang: string) => {
    switch (lang) {
        case "bn":
            return "রুকু";
        case "en":
            return "Ruku";
        case "ar":
            return "ركوع";
        default:
            return "রুকু";
    }
};

export const getJuzPrefix = (lang: string) => {
    switch (lang) {
        case "bn":
            return "পারা";
        case "en":
            return "Juz";
        case "ar":
            return "جزء";
        default:
            return "পারা";
    }
};

type LanguageData = {
    id: Language;
    name: string;
};

export const LANGS: LanguageData[] = [
    {
        id: "bn",
        name: "বাংলা",
    },

    {
        id: "en",
        name: "English",
    },

    {
        id: "ar",
        name: "العربية",
    },
];
