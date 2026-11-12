import { create } from "zustand";

/** Transient UI state (not persisted): which overlay is open, toast text. */
type UiStore = {
    /** The theme actually showing ("system" resolved). */
    resolvedTheme: "light" | "dark" | "sepia";
    settingsOpen: boolean;
    listOpen: boolean;
    toast: { id: number; message: string } | null;

    setResolvedTheme: (theme: "light" | "dark" | "sepia") => void;
    setSettingsOpen: (open: boolean) => void;
    setListOpen: (open: boolean) => void;
    showToast: (message: string) => void;
    clearToast: () => void;
};

export const useUiStore = create<UiStore>()((set) => ({
    resolvedTheme: "light",
    setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    settingsOpen: false,
    listOpen: false,
    toast: null,

    setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
    setListOpen: (listOpen) => set({ listOpen }),
    showToast: (message) => set({ toast: { id: Date.now(), message } }),
    clearToast: () => set({ toast: null }),
}));
