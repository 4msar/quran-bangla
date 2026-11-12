import type { Theme, TranslationId, ViewMode } from "src/types";

/** UI labels follow the translation: English stays English, everything else is Bangla. */
export type UiLang = "bn" | "en";

export const getSurahPrefix = (lang: string) =>
    lang === "en" ? "Surah" : "সূরাহ";

export const getRukuPrefix = (lang: string) => (lang === "en" ? "Ruku" : "রুকু");

export const getJuzPrefix = (lang: string) => (lang === "en" ? "Juz" : "পারা");

export const getAyahLabel = (lang: string) => (lang === "en" ? "Ayah" : "আয়াত");

export const revelationLabel = (type: string, lang: string) => {
    const meccan = type.toLowerCase().startsWith("mec");
    if (lang === "en") return meccan ? "Makki" : "Madani";
    return meccan ? "মাক্কী" : "মাদানী";
};

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
/** Bangla numerals when the UI is Bangla. */
export const toLocaleDigits = (value: number | string, lang: string) =>
    lang === "en"
        ? String(value)
        : String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const toArabicDigits = (value: number) =>
    String(value).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

export const TRANSLATIONS: { id: TranslationId; name: string; label: string }[] =
    [
        { id: "bn", name: "বাংলা", label: "Bangla" },
        { id: "en", name: "English", label: "English" },
    ];

export const THEMES: { id: Theme; label: string; bn: string }[] = [
    { id: "system", label: "System", bn: "সিস্টেম" },
    { id: "light", label: "Light", bn: "লাইট" },
    { id: "dark", label: "Dark", bn: "ডার্ক" },
    { id: "sepia", label: "Sepia", bn: "সেপিয়া" },
];

export const VIEW_MODES: {
    id: ViewMode;
    label: string;
    bn: string;
    hint: string;
    bnHint: string;
}[] = [
    {
        id: "translation",
        label: "Translation",
        bn: "অনুবাদ",
        hint: "Verse by verse with translation",
        bnHint: "প্রতিটি আয়াত অনুবাদসহ",
    },
    {
        id: "quran",
        label: "Quran",
        bn: "কুরআন",
        hint: "Arabic only, continuous like a mushaf",
        bnHint: "শুধু আরবি, মুসহাফের মতো টানা",
    },
];

export type ArabicFont = {
    id: string;
    name: string;
    /** CSS font-family value. */
    family: string;
    /** Google Fonts css2 family query. */
    google: string;
    note: string;
};

export const ARABIC_FONTS: ArabicFont[] = [
    {
        id: "amiri-quran",
        name: "Amiri Quran",
        family: "'Amiri Quran', 'Amiri', serif",
        google: "Amiri+Quran",
        note: "Classic Naskh, Uthmani style",
    },
    {
        id: "scheherazade",
        name: "Scheherazade New",
        family: "'Scheherazade New', serif",
        google: "Scheherazade+New:wght@400;700",
        note: "Large, clear Naskh",
    },
    {
        id: "noto-naskh",
        name: "Noto Naskh Arabic",
        family: "'Noto Naskh Arabic', serif",
        google: "Noto+Naskh+Arabic:wght@400;600",
        note: "Modern, even strokes",
    },
    {
        id: "lateef",
        name: "Lateef",
        family: "'Lateef', serif",
        google: "Lateef:wght@400;600",
        note: "IndoPak-leaning style",
    },
];

export const DEFAULT_ARABIC_FONT = ARABIC_FONTS[0].id;

export const getArabicFont = (id: string) =>
    ARABIC_FONTS.find((f) => f.id === id) ?? ARABIC_FONTS[0];

/** Size steps 1..10 mapped to rem. */
export const arabicSizeRem = (step: number) => 1.25 + step * 0.25;
export const translationSizeRem = (step: number) => 0.75 + step * 0.0625;

/** Popular quick links for the home page. */
export const QUICK_LINKS: { label: string; bn: string; to: string }[] = [
    { label: "Yasin", bn: "ইয়াসীন", to: "/36" },
    { label: "Al-Kahf", bn: "আল কাহফ", to: "/18" },
    { label: "Al-Mulk", bn: "আল মুলক", to: "/67" },
    { label: "Ar-Rahman", bn: "আর রাহমান", to: "/55" },
    { label: "Al-Waqi'ah", bn: "আল ওয়াকিয়া", to: "/56" },
    { label: "Ayatul Kursi", bn: "আয়াতুল কুরসী", to: "/2/255" },
];
