import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TranslationChoice } from "src/types";

export type QuranStore = {
    listType: "list" | "grid";
    translation: TranslationChoice;

    setTranslation: (translation: TranslationChoice) => void;
    setListType: (listType: "list" | "grid") => void;
};

export const useQuranStore = create<QuranStore>()(
    persist(
        (set) => ({
            listType: "grid",
            translation: "bn",

            setTranslation: (translation) => set({ translation }),
            setListType: (listType) => set({ listType }),
        }),
        {
            // v2: the old store held a `lang` key that no longer exists.
            name: "quran-store-v2",
        }
    )
);
