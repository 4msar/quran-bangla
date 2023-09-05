import { Surah } from "src/types";
import { create } from "zustand";

import surah from "src/data/meta/surah.json";

export type QuranStore = {
    surah: Surah[];
    setSurah: (surah: Surah[]) => void;
    getSurahById: (id: number) => Surah | undefined;
};

export const useQuranStore = create<QuranStore>((set, get) => ({
    surah: [],

    setSurah: (surah) => set({ surah }),
    getSurahById: (id) => get().surah.find((item) => item.id === id),
}));

useQuranStore.setState({
    surah,
});
