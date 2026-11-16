import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, TranslationId, ViewMode } from "src/types";
import {
    DEFAULT_ARABIC_FONT,
    DEFAULT_BANGLA_FONT,
    DEFAULT_ENGLISH_FONT,
    DEFAULT_RECITER,
    TRANSLATIONS,
    translationLang,
} from "src/utils/constants";

export type Position = { sura: number; aya: number };

export const STORE_KEY = "quran-store-v2";

/** Reading text sizes in px: allowed range and how much one +/− press changes it. */
export const ARABIC_SIZE = { min: 20, max: 64, step: 2 } as const;
export const TRANSLATION_SIZE = { min: 12, max: 28, step: 1 } as const;
export type SizeRange = { min: number; max: number; step: number };

type Settings = {
    theme: Theme;
    viewMode: ViewMode;
    /** Selected translations in display order; empty means Arabic only. */
    translations: TranslationId[];
    /** Translation view only: false hides the Arabic text (translation-only reading). */
    showArabic: boolean;
    arabicFont: string;
    banglaFont: string;
    englishFont: string;
    arabicSize: number;
    translationSize: number;
    /** Recitation: reciter id, volume 0..1, speed multiplier, repeat the current ayah. */
    reciter: string;
    volume: number;
    playbackRate: number;
    repeatAyah: boolean;
    /** Tafsir Ibn Kathir language. */
    tafseerLang: "bn" | "en";
    /** Share-as-image theme id (see IMAGE_THEMES). */
    imageTheme: string;
    /** Share-as-image border id (see IMAGE_FRAMES); "auto" follows the theme. */
    imageFrame: string;
};

export const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    viewMode: "translation",
    translations: ["mujib"],
    showArabic: true,
    arabicFont: DEFAULT_ARABIC_FONT,
    banglaFont: DEFAULT_BANGLA_FONT,
    englishFont: DEFAULT_ENGLISH_FONT,
    arabicSize: 24,
    translationSize: 18,
    reciter: DEFAULT_RECITER,
    volume: 1,
    playbackRate: 1,
    repeatAyah: false,
    tafseerLang: "bn",
    imageTheme: "emerald",
    imageFrame: "auto",
};

export type QuranStore = Settings & {
    listType: "list" | "grid";
    /** "sura:aya" keys. */
    bookmarks: string[];
    lastRead: Position | null;

    setTheme: (theme: Theme) => void;
    setViewMode: (viewMode: ViewMode) => void;
    toggleTranslation: (id: TranslationId) => void;
    setShowArabic: (show: boolean) => void;
    setArabicFont: (id: string) => void;
    setBanglaFont: (id: string) => void;
    setEnglishFont: (id: string) => void;
    setArabicSize: (size: number) => void;
    setTranslationSize: (size: number) => void;
    setReciter: (id: string) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
    setRepeatAyah: (repeat: boolean) => void;
    setTafseerLang: (lang: "bn" | "en") => void;
    setImageTheme: (id: string) => void;
    setImageFrame: (id: string) => void;
    resetSettings: () => void;

    setListType: (listType: "list" | "grid") => void;
    toggleBookmark: (key: string) => void;
    setLastRead: (position: Position) => void;
};

const clampSize = (size: number, { min, max }: SizeRange) => Math.min(max, Math.max(min, Math.round(size)));

/** Keep Bangla before English, in the settings order, regardless of the order they were ticked. */
const ORDER: TranslationId[] = TRANSLATIONS.map((t) => t.id);

export const useQuranStore = create<QuranStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            listType: "grid",
            bookmarks: [],
            lastRead: null,

            setTheme: (theme) => set({ theme }),
            setViewMode: (viewMode) => set({ viewMode }),
            toggleTranslation: (id) =>
                set((state) => {
                    const on = state.translations.includes(id);
                    const next = on ? state.translations.filter((t) => t !== id) : [...state.translations, id];
                    // With Arabic hidden, keep at least one translation so the page is never empty.
                    if (next.length === 0 && !state.showArabic) return state;
                    return {
                        translations: ORDER.filter((t) => next.includes(t)),
                    };
                }),
            setShowArabic: (showArabic) =>
                set((state) =>
                    // Hiding Arabic needs a translation to show instead.
                    !showArabic && state.translations.length === 0 ? state : { showArabic },
                ),
            setArabicFont: (arabicFont) => set({ arabicFont }),
            setBanglaFont: (banglaFont) => set({ banglaFont }),
            setEnglishFont: (englishFont) => set({ englishFont }),
            setArabicSize: (size) => set({ arabicSize: clampSize(size, ARABIC_SIZE) }),
            setTranslationSize: (size) => set({ translationSize: clampSize(size, TRANSLATION_SIZE) }),
            setReciter: (reciter) => set({ reciter }),
            setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
            setPlaybackRate: (playbackRate) => set({ playbackRate }),
            setRepeatAyah: (repeatAyah) => set({ repeatAyah }),
            setTafseerLang: (tafseerLang) => set({ tafseerLang }),
            setImageTheme: (imageTheme) => set({ imageTheme }),
            setImageFrame: (imageFrame) => set({ imageFrame }),
            resetSettings: () => set({ ...DEFAULT_SETTINGS }),

            setListType: (listType) => set({ listType }),
            toggleBookmark: (key) =>
                set((state) => ({
                    bookmarks: state.bookmarks.includes(key)
                        ? state.bookmarks.filter((b) => b !== key)
                        : [key, ...state.bookmarks],
                })),
            setLastRead: (lastRead) => set({ lastRead }),
        }),
        {
            name: STORE_KEY,
            version: 2,
            // v0 stored a single `translation: "bn" | "en" | "off"`.
            // v1 stored text sizes as steps 1..10 instead of px.
            migrate: (persisted, version) => {
                const state = (persisted ?? {}) as Record<string, unknown>;
                if (version < 1) {
                    const old = state.translation;
                    state.translations = old === "en" ? ["en"] : old === "off" ? [] : ["bn"];
                    delete state.translation;
                }
                if (version < 2) {
                    if (typeof state.arabicSize === "number") state.arabicSize = 20 + state.arabicSize * 4;
                    if (typeof state.translationSize === "number") state.translationSize = 12 + state.translationSize;
                }
                return state as unknown as QuranStore;
            },
            partialize: (state) => ({
                theme: state.theme,
                viewMode: state.viewMode,
                translations: state.translations,
                showArabic: state.showArabic,
                arabicFont: state.arabicFont,
                banglaFont: state.banglaFont,
                englishFont: state.englishFont,
                arabicSize: state.arabicSize,
                translationSize: state.translationSize,
                reciter: state.reciter,
                volume: state.volume,
                playbackRate: state.playbackRate,
                repeatAyah: state.repeatAyah,
                tafseerLang: state.tafseerLang,
                imageTheme: state.imageTheme,
                imageFrame: state.imageFrame,
                listType: state.listType,
                bookmarks: state.bookmarks,
                lastRead: state.lastRead,
            }),
        },
    ),
);

/** UI labels follow the first selected translation (Bangla when none). */
export const useUiLang = () =>
    useQuranStore((state) => {
        const first = state.translations[0];
        return first ? translationLang(first) : "bn";
    });
