import type { TranslationChoice } from "src/types";

/** UI labels follow the translation: English stays English, everything else is Bangla. */
export type UiLang = "bn" | "en";

export const uiLang = (translation: TranslationChoice): UiLang =>
    translation === "en" ? "en" : "bn";

export const getSurahPrefix = (lang: string) => {
    switch (lang) {
        case "en":
            return "Surah";
        default:
            return "সূরাহ";
    }
};

export const getRukuPrefix = (lang: string) => {
    switch (lang) {
        case "en":
            return "Ruku";
        default:
            return "রুকু";
    }
};

export const getJuzPrefix = (lang: string) => {
    switch (lang) {
        case "en":
            return "Juz";
        default:
            return "পারা";
    }
};

export const TRANSLATION_OPTIONS: { id: TranslationChoice; name: string }[] = [
    { id: "bn", name: "বাংলা অনুবাদ" },
    { id: "en", name: "English" },
    { id: "off", name: "Arabic only" },
];
