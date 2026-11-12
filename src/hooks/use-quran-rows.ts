import { useMemo } from "react";
import { useAyats } from "./use-ayats";
import { useQuranStore } from "src/store";
import { buildRows, indexAyats, Position, toOrdinal } from "src/utils";
import type { Ayah } from "src/types";

export type RowScope = {
    /** Show only this surah. */
    surah?: number;
    /** Or show the range from..to (inclusive). */
    from?: Position;
    to?: Position;
};

/**
 * Arabic rows for a scope, joined with every selected translation.
 * Translations load on demand only in the translation view;
 * `translationLoading` is true while any of them is in flight.
 */
export function useQuranRows(scope: RowScope) {
    const translations = useQuranStore((s) => s.translations);
    const viewMode = useQuranStore((s) => s.viewMode);
    const showArabicSetting = useQuranStore((s) => s.showArabic);
    const wantTranslations = viewMode === "translation";

    const wantBn = wantTranslations && translations.includes("bn");
    const wantEn = wantTranslations && translations.includes("en");

    const arabic = useAyats("ar");
    const bn = useAyats(wantBn ? "bn" : null);
    const en = useAyats(wantEn ? "en" : null);

    const bnIndex = useMemo(() => (bn ? indexAyats(bn) : null), [bn]);
    const enIndex = useMemo(() => (en ? indexAyats(en) : null), [en]);

    const { surah, from, to } = scope;
    const fromSura = from?.sura;
    const fromAya = from?.aya;
    const toSura = to?.sura;
    const toAya = to?.aya;

    const rows = useMemo(() => {
        if (!arabic) return [];

        const inScope = (a: Ayah) => {
            if (surah !== undefined) return a.sura === surah;
            if (
                fromSura === undefined ||
                fromAya === undefined ||
                toSura === undefined ||
                toAya === undefined
            ) {
                return true;
            }
            const o = toOrdinal({ sura: a.sura, aya: a.aya });
            return (
                o >= toOrdinal({ sura: fromSura, aya: fromAya }) &&
                o <= toOrdinal({ sura: toSura, aya: toAya })
            );
        };

        return buildRows(arabic.filter(inScope), {
            ...(bnIndex ? { bn: bnIndex } : {}),
            ...(enIndex ? { en: enIndex } : {}),
        });
    }, [arabic, bnIndex, enIndex, surah, fromSura, fromAya, toSura, toAya]);

    return {
        rows,
        viewMode,
        /** Translations to show, in order (empty in the Quran view). */
        shown: wantTranslations ? translations : [],
        /** The Quran view is Arabic by definition; the setting applies to the translation view. */
        showArabic:
            !wantTranslations || showArabicSetting || translations.length === 0,
        loading: arabic === null,
        translationLoading: (wantBn && bn === null) || (wantEn && en === null),
    };
}
