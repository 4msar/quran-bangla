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
                    className="flex scroll-mt-24 items-center gap-3 pt-6 text-xs font-semibold uppercase tracking-wider text-brand-700"
                >
                    <span className="h-px flex-1 bg-brand-100" />
                    <span>
                        {getRukuPrefix(ui)} {ruku.ruku}
                    </span>
                    <span className="h-px flex-1 bg-brand-100" />
                </div>
            )}

            <article
                id={`ayah-${arabic.sura}-${arabic.aya}`}
                className="grid scroll-mt-24 grid-cols-[3.25rem_1fr] gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[4rem_1fr] md:gap-6"
            >
                <div className="pt-1">
                    <p className="text-sm font-semibold text-brand-700">
                        {arabic.sura}:{arabic.aya}
                    </p>
                    {sajdah && (
                        <p className="mt-1 text-xs text-brand-700" title="Sajdah">
                            ۩
                        </p>
                    )}
                </div>

                <div className="min-w-0">
                    <p
                        dir="rtl"
                        lang="ar"
                        className="font-arabic text-right text-2xl leading-[2.2] text-ink md:text-3xl"
                    >
                        {arabic.text}
                    </p>

                    {translated && translation !== "off" && (
                        <TranslationText
                            ayah={translated}
                            translation={translation}
                        />
                    )}
                </div>
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
        <div className="fade-rise mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {translation === "bn" ? "Bangla" : "English"}
            </p>
            <p
                lang={translation}
                className={`mt-1 leading-7 text-ink/90 ${
                    translation === "bn" ? "font-bangla text-base" : "text-[15px]"
                }`}
            >
                {ayah.text}
            </p>
        </div>
    );
}
