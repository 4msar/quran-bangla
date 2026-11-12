import { useMemo } from "react";
import { useAyats } from "./use-ayats";
import { useQuranStore } from "src/store";
import { buildRows, indexAyats, Position, toOrdinal } from "src/utils";
import type { Ayah, TranslationChoice } from "src/types";

export type RowScope = {
    /** Show only this surah. */
    surah?: number;
    /** Or show the range from..to (inclusive). */
    from?: Position;
    to?: Position;
};

/**
 * Arabic rows for a scope, joined with the selected translation.
 * Translation loads on demand; `loading` is true while it is in flight.
 */
export function useQuranRows(scope: RowScope) {
    const translation: TranslationChoice = useQuranStore(
        (state) => state.translation
    );
    const source = translation === "off" ? null : translation;

    const arabic = useAyats("ar");
    const translated = useAyats(source);
    const translationIndex = useMemo(
        () => (translated ? indexAyats(translated) : null),
        [translated]
    );

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

        return buildRows(arabic.filter(inScope), translationIndex);
    }, [arabic, translationIndex, surah, fromSura, fromAya, toSura, toAya]);

    return {
        rows,
        translation,
        loading: arabic === null,
        translationLoading: source !== null && translated === null,
    };
}
