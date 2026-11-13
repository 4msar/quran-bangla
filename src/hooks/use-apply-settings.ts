import { useEffect, useState } from "react";
import { useQuranStore, useUiStore } from "src/store";
import {
    arabicSizeRem,
    getArabicFont,
    getBanglaFont,
    getEnglishFont,
    loadGoogleFont,
    translationSizeRem,
} from "src/utils/constants";

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

/** Mirrors the reading settings onto <html>: theme, Arabic font, text sizes. */
export function useApplySettings() {
    const theme = useQuranStore((s) => s.theme);
    const arabicFont = useQuranStore((s) => s.arabicFont);
    const banglaFont = useQuranStore((s) => s.banglaFont);
    const englishFont = useQuranStore((s) => s.englishFont);
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
        // Browser / installed-app chrome follows the page colour.
        const page = getComputedStyle(document.documentElement).getPropertyValue("--page").trim();
        if (page) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", page);
        setResolvedTheme(resolved);
    }, [theme, systemDark, setResolvedTheme]);

    useEffect(() => {
        const font = getArabicFont(arabicFont);
        loadGoogleFont("arabic", font);
        document.documentElement.style.setProperty("--arabic-font", font.family);
    }, [arabicFont]);

    useEffect(() => {
        const font = getBanglaFont(banglaFont);
        loadGoogleFont("bangla", font);
        document.documentElement.style.setProperty("--bangla-font", font.family);
    }, [banglaFont]);

    useEffect(() => {
        const font = getEnglishFont(englishFont);
        loadGoogleFont("english", font);
        document.documentElement.style.setProperty("--english-font", font.family);
    }, [englishFont]);

    useEffect(() => {
        const root = document.documentElement.style;
        root.setProperty("--arabic-size", `${arabicSizeRem(arabicSize)}rem`);
        root.setProperty(
            "--translation-size",
            `${translationSizeRem(translationSize)}rem`
        );
    }, [arabicSize, translationSize]);
}
