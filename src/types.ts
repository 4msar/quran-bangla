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
    name: string;
    englishName: string;
    meta: SurahMetaData;
};

export type Ayah = {
    id: number;
    surah: number;
    number: number;
    text: string;
    sajda: boolean;
};
