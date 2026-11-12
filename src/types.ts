/** Translation sources available as bundled JSON files (loaded on demand). */
export type TranslationId = "bn" | "en";

export type Theme = "system" | "light" | "dark" | "sepia";

/** "translation" = verse by verse with translations; "quran" = Arabic only, continuous. */
export type ViewMode = "translation" | "quran";

export type SurahMetaData = {
    ayahs: number;
    order: number;
    rukus: number;
    revelation: string;
    sajda: boolean;
    type: string;
};

export type Surah = {
    id: number;
    ayas: number;
    start: number;
    name: string;
    tname: string;
    bname: string;
    ename: string;
    type: string;
    order: number;
    rukus: number;
};

export type Ayah = {
    id: number;
    sura: number;
    aya: number;
    text: string;
    sajda?: boolean;
};

export type MetaData = {
    id: number;
    sura: number;
    aya: number;
    type?: string;
};
