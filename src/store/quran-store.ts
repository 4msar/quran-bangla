import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuranStore = {
    listType: "list" | "grid";
    setListType: (listType: "list" | "grid") => void;
};

export const useQuranStore = create<QuranStore>()(
    persist(
        (set) => ({
            listType: "grid",

            setListType: (listType) => set({ listType }),
        }),
        {
            name: "quran-store",
        }
    )
);
