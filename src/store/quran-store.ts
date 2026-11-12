import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, TranslationId, ViewMode } from "src/types";
import { DEFAULT_ARABIC_FONT, DEFAULT_RECITER } from "src/utils/constants";

export type Position = { sura: number; aya: number };

export const STORE_KEY = "quran-store-v2";

export const SIZE_MIN = 1;
export const SIZE_MAX = 10;

type Settings = {
    theme: Theme;
    viewMode: ViewMode;
    /** Selected translations in display order; empty means Arabic only. */
    translations: TranslationId[];
    /** Translation view only: false hides the Arabic text (translation-only reading). */
    showArabic: boolean;
    arabicFont: string;
    arabicSize: number;
    translationSize: number;
    /** Recitation: reciter id, volume 0..1, speed multiplier, repeat the current ayah. */
    reciter: string;
    volume: number;
    playbackRate: number;
    repeatAyah: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    viewMode: "translation",
    translations: ["bn"],
    showArabic: true,
    arabicFont: DEFAULT_ARABIC_FONT,
    arabicSize: 5,
    translationSize: 4,
    reciter: DEFAULT_RECITER,
    volume: 1,
    playbackRate: 1,
    repeatAyah: false,
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
    setArabicSize: (size: number) => void;
    setTranslationSize: (size: number) => void;
    setReciter: (id: string) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
    setRepeatAyah: (repeat: boolean) => void;
    resetSettings: () => void;

    setListType: (listType: "list" | "grid") => void;
    toggleBookmark: (key: string) => void;
    setLastRead: (position: Position) => void;
};

const clampSize = (size: number) =>
    Math.min(SIZE_MAX, Math.max(SIZE_MIN, Math.round(size)));

/** Keep Bangla before English regardless of the order they were ticked. */
const ORDER: TranslationId[] = ["bn", "en"];

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
                    const next = on
                        ? state.translations.filter((t) => t !== id)
                        : [...state.translations, id];
                    // With Arabic hidden, keep at least one translation so the page is never empty.
                    if (next.length === 0 && !state.showArabic) return state;
                    return {
                        translations: ORDER.filter((t) => next.includes(t)),
                    };
                }),
            setShowArabic: (showArabic) =>
                set((state) =>
                    // Hiding Arabic needs a translation to show instead.
                    !showArabic && state.translations.length === 0
                        ? state
                        : { showArabic }
                ),
            setArabicFont: (arabicFont) => set({ arabicFont }),
            setArabicSize: (size) => set({ arabicSize: clampSize(size) }),
            setTranslationSize: (size) =>
                set({ translationSize: clampSize(size) }),
            setReciter: (reciter) => set({ reciter }),
            setVolume: (volume) =>
                set({ volume: Math.min(1, Math.max(0, volume)) }),
            setPlaybackRate: (playbackRate) => set({ playbackRate }),
            setRepeatAyah: (repeatAyah) => set({ repeatAyah }),
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
            version: 1,
            // v0 stored a single `translation: "bn" | "en" | "off"`.
            migrate: (persisted, version) => {
                const state = (persisted ?? {}) as Record<string, unknown>;
                if (version < 1) {
                    const old = state.translation;
                    state.translations =
                        old === "en" ? ["en"] : old === "off" ? [] : ["bn"];
                    delete state.translation;
                }
                return state as unknown as QuranStore;
            },
            partialize: (state) => ({
                theme: state.theme,
                viewMode: state.viewMode,
                translations: state.translations,
                showArabic: state.showArabic,
                arabicFont: state.arabicFont,
                arabicSize: state.arabicSize,
                translationSize: state.translationSize,
                reciter: state.reciter,
                volume: state.volume,
                playbackRate: state.playbackRate,
                repeatAyah: state.repeatAyah,
                listType: state.listType,
                bookmarks: state.bookmarks,
                lastRead: state.lastRead,
            }),
        }
    )
);

/** UI labels follow the first selected translation (Bangla when none). */
export const useUiLang = () =>
    useQuranStore((state) => (state.translations[0] === "en" ? "en" : "bn"));
