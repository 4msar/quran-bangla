import { AyahItem } from "./ayah";
import type { AyahRow } from "src/utils/quran";
import { getSurahName, getSurah, UiLang } from "src/utils";
import type { TranslationChoice } from "src/types";

type AyahListProps = {
    rows: AyahRow[];
    ui: UiLang;
    translation: TranslationChoice;
    /** Show a heading whenever a new surah starts (used for Juz pages). */
    showSurahHeaders?: boolean;
};

export function AyahList({
    rows,
    ui,
    translation,
    showSurahHeaders = false,
}: AyahListProps) {
    return (
        <div className="flex flex-col gap-3">
            {rows.map((row) => {
                const { sura, aya } = row.arabic;
                const surah = aya === 1 ? getSurah(sura) : undefined;

                return (
                    <div key={`${sura}-${aya}`} className="flex flex-col gap-3">
                        {showSurahHeaders && surah && (
                            <h3 className="mt-4 text-center text-lg font-bold text-gray-800">
                                {getSurahName(surah, ui)} · {surah.name}
                            </h3>
                        )}
                        <AyahItem row={row} ui={ui} translation={translation} />
                    </div>
                );
            })}
        </div>
    );
}
