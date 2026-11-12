import { Ayah, TranslationChoice } from "src/types";
import { getRukuPrefix, hasSajdah, RUKU_BY_START, posKey } from "src/utils";
import type { UiLang } from "src/utils";
import type { AyahRow } from "src/utils/quran";

type AyahItemProps = {
    row: AyahRow;
    ui: UiLang;
    translation: TranslationChoice;
};

export function AyahItem({ row, ui, translation }: AyahItemProps) {
    const { arabic, translation: translated } = row;
    const ruku = RUKU_BY_START.get(posKey(arabic.sura, arabic.aya));
    const sajdah = hasSajdah(arabic.sura, arabic.aya);

    return (
        <>
            {ruku && (
                <div
                    id={`ruku-${ruku.id}`}
                    className="my-4 flex scroll-mt-24 items-center gap-3 text-sm font-bold text-green-700"
                >
                    <span className="h-px flex-1 bg-green-200" />
                    <span>
                        {getRukuPrefix(ui)} {ruku.ruku}
                    </span>
                    <span className="h-px flex-1 bg-green-200" />
                </div>
            )}

            <article
                id={`ayah-${arabic.sura}-${arabic.aya}`}
                className="scroll-mt-24 rounded-xl bg-white p-4 shadow-sm"
            >
                <div className="flex items-center justify-between">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-green-50 px-2 text-xs font-bold text-green-700">
                        {arabic.aya}
                    </span>
                    {sajdah && (
                        <span className="text-xs font-bold text-green-700">
                            ۩ Sajdah
                        </span>
                    )}
                </div>

                <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic mt-3 text-right text-2xl leading-[2.4] text-gray-900"
                >
                    {arabic.text}
                </p>

                {translated && translation !== "off" && (
                    <TranslationText ayah={translated} translation={translation} />
                )}
            </article>
        </>
    );
}

function TranslationText({
    ayah,
    translation,
}: {
    ayah: Ayah;
    translation: TranslationChoice;
}) {
    return (
        <p
            lang={translation}
            className={`mt-3 border-t border-gray-100 pt-3 text-base leading-7 text-gray-700 ${
                translation === "bn" ? "font-bangla" : ""
            }`}
        >
            {ayah.text}
        </p>
    );
}
