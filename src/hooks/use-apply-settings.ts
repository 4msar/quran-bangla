import { useEffect, useState } from "react";
import { useQuranStore, useUiStore } from "src/store";
import {
    arabicSizeRem,
    getArabicFont,
    translationSizeRem,
} from "src/utils/constants";

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

/** Mirrors the reading settings onto <html>: theme, Arabic font, text sizes. */
export function useApplySettings() {
    const theme = useQuranStore((s) => s.theme);
    const arabicFont = useQuranStore((s) => s.arabicFont);
    const arabicSize = useQuranStore((s) => s.arabicSize);
    const translationSize = useQuranStore((s) => s.translationSize);
    const [systemDark, setSystemDark] = useState(() => darkQuery().matches);

    useEffect(() => {
        const query = darkQuery();
        const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    const setResolvedTheme = useUiStore((s) => s.setResolvedTheme);
    useEffect(() => {
        const resolved =
            theme === "system" ? (systemDark ? "dark" : "light") : theme;
        document.documentElement.dataset.theme = resolved;
        setResolvedTheme(resolved);
    }, [theme, systemDark, setResolvedTheme]);

    useEffect(() => {
        const font = getArabicFont(arabicFont);
        const id = `arabic-font-${font.id}`;
        if (!document.getElementById(id)) {
            const link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
            document.head.appendChild(link);
        }
        document.documentElement.style.setProperty("--arabic-font", font.family);
    }, [arabicFont]);

    useEffect(() => {
        const root = document.documentElement.style;
        root.setProperty("--arabic-size", `${arabicSizeRem(arabicSize)}rem`);
        root.setProperty(
            "--translation-size",
            `${translationSizeRem(translationSize)}rem`
        );
    }, [arabicSize, translationSize]);
}
