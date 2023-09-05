import { Language } from "src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuranStore = {
    listType: "list" | "grid";
    lang: Language;

    setLang: (lang: Language) => void;
    setListType: (listType: "list" | "grid") => void;
};

export const useQuranStore = create<QuranStore>()(
    persist(
        (set) => ({
            listType: "grid",

            lang: "bn",

            setLang: (lang) => set({ lang }),
            setListType: (listType) => set({ listType }),
        }),
        {
            name: "quran-store",
        }
    )
);
