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
    /** Google Fonts css2 family query. Omit when the face is declared in index.css. */
    google?: string;
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
        id: "uthman-hafs",
        name: "KFGQPC Uthmanic Hafs",
        family: "'Uthman Hafs', 'Amiri Quran', serif",
        note: "King Fahd Complex, Madinah Mushaf",
    },
    {
        id: "uthman-naskh",
        name: "KFGQPC Uthman Taha Naskh",
        family: "'Uthman Naskh', 'Amiri', serif",
        note: "King Fahd Complex, Naskh",
    },
    {
        id: "amiri",
        name: "Amiri",
        family: "'Amiri', serif",
        google: "Amiri:wght@400;700",
        note: "Elegant, Bulaq-press Naskh",
    },
    {
        id: "harmattan",
        name: "Harmattan",
        family: "'Harmattan', serif",
        google: "Harmattan:wght@400;600",
        note: "Compact, light Naskh",
    },
    {
        id: "markazi",
        name: "Markazi Text",
        family: "'Markazi Text', serif",
        google: "Markazi+Text:wght@400;600",
        note: "Calligraphic, tall strokes",
    },
    {
        id: "lateef",
        name: "Lateef",
        family: "'Lateef', serif",
        google: "Lateef:wght@400;600",
        note: "IndoPak-leaning style",
    },
];

export type TextFont = {
    id: string;
    name: string;
    /** CSS font-family value. */
    family: string;
    /** Google Fonts css2 family query. Omit for fonts loaded in index.html or the system. */
    google?: string;
    note: string;
};

export const BANGLA_FONTS: TextFont[] = [
    { id: "kalpurush", name: "Kalpurush", family: "'Kalpurush', sans-serif", note: "Default, familiar print style" },
    { id: "noto-sans-bengali", name: "Noto Sans Bengali", family: "'Noto Sans Bengali', sans-serif", google: "Noto+Sans+Bengali:wght@400;600", note: "Clean, modern sans" },
    { id: "hind-siliguri", name: "Hind Siliguri", family: "'Hind Siliguri', sans-serif", google: "Hind+Siliguri:wght@400;600", note: "Light, UI-friendly sans" },
    { id: "mukta", name: "Mukta", family: "'Mukta', sans-serif", google: "Mukta:wght@400;600", note: "Open, rounded sans" },
    { id: "anek-bangla", name: "Anek Bangla", family: "'Anek Bangla', sans-serif", google: "Anek+Bangla:wght@400;600", note: "Contemporary, wide" },
    { id: "noto-serif-bengali", name: "Noto Serif Bengali", family: "'Noto Serif Bengali', serif", google: "Noto+Serif+Bengali:wght@400;600", note: "Book-style serif" },
    { id: "tiro-bangla", name: "Tiro Bangla", family: "'Tiro Bangla', serif", google: "Tiro+Bangla", note: "Classic text serif" },
];

export const ENGLISH_FONTS: TextFont[] = [
    { id: "inter", name: "Inter", family: "Inter, ui-sans-serif, system-ui, sans-serif", note: "Default sans" },
    { id: "source-serif", name: "Source Serif 4", family: "'Source Serif 4', serif", google: "Source+Serif+4:wght@400;600", note: "Readable book serif" },
    { id: "lora", name: "Lora", family: "'Lora', serif", google: "Lora:wght@400;600", note: "Warm, calligraphic serif" },
    { id: "merriweather", name: "Merriweather", family: "'Merriweather', serif", google: "Merriweather:wght@400;700", note: "Sturdy, screen-friendly serif" },
    { id: "atkinson", name: "Atkinson Hyperlegible", family: "'Atkinson Hyperlegible', sans-serif", google: "Atkinson+Hyperlegible:wght@400;700", note: "Maximum legibility" },
];

export const DEFAULT_BANGLA_FONT = BANGLA_FONTS[0].id;
export const DEFAULT_ENGLISH_FONT = ENGLISH_FONTS[0].id;
export const getBanglaFont = (id: string) => BANGLA_FONTS.find((f) => f.id === id) ?? BANGLA_FONTS[0];
export const getEnglishFont = (id: string) => ENGLISH_FONTS.find((f) => f.id === id) ?? ENGLISH_FONTS[0];

/** Load a Google font once (no-op for fonts without a `google` query). */
export function loadGoogleFont(kind: string, font: { id: string; google?: string }) {
    if (!font.google) return;
    const id = `${kind}-font-${font.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    document.head.appendChild(link);
}

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

/** Verse-by-verse reciters; `id` is the folder name on everyayah.com. */
export const RECITERS: { id: string; name: string; bn: string }[] = [
    { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy", bn: "মিশারি রাশিদ আল-আফাসি" },
    { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit Abdus Samad", bn: "আব্দুল বাসিত আব্দুস সামাদ" },
    { id: "Abdurrahmaan_As-Sudais_192kbps", name: "Abdur-Rahman As-Sudais", bn: "আব্দুর রহমান আস-সুদাইস" },
    { id: "Saood_ash-Shuraym_128kbps", name: "Saud Ash-Shuraim", bn: "সৌদ আশ-শুরাইম" },
    { id: "MaherAlMuaiqly128kbps", name: "Maher Al-Muaiqly", bn: "মাহের আল-মুয়াইকলি" },
    { id: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary", bn: "মাহমুদ খলিল আল-হুসারি" },
    { id: "Minshawy_Murattal_128kbps", name: "Mohamed Siddiq Al-Minshawi", bn: "মুহাম্মাদ সিদ্দিক আল-মিনশাবি" },
    { id: "Hudhaify_128kbps", name: "Ali Al-Hudhaify", bn: "আলী আল-হুযাইফি" },
    { id: "Ghamadi_40kbps", name: "Saad Al-Ghamdi", bn: "সাদ আল-গামিদি" },
];

export const DEFAULT_RECITER = RECITERS[0].id;

export const getReciter = (id: string) =>
    RECITERS.find((r) => r.id === id) ?? RECITERS[0];

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];
