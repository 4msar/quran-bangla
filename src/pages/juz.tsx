import { useParams } from "react-router-dom";
import {
    AyahList,
    JuzList,
    Layouts,
    TranslationPicker,
} from "src/components";
import { useQuranRows } from "src/hooks/use-quran-rows";
import { useQuranStore } from "src/store";
import {
    getJuzPrefix,
    getSurah,
    getSurahName,
    JUZ_RANGES,
    uiLang,
} from "src/utils";

export function JuzIndex() {
    return (
        <Layouts>
            <JuzList />
        </Layouts>
    );
}

export function JuzPage() {
    const { juz } = useParams();
    const range = JUZ_RANGES.find((j) => j.id === Number(juz));

    if (!range) {
        return (
            <Layouts>
                <p className="text-center">Juz not found</p>
            </Layouts>
        );
    }

    return <JuzContent range={range} />;
}

function JuzContent({
    range,
}: {
    range: (typeof JUZ_RANGES)[number];
}) {
    const translation = useQuranStore((state) => state.translation);
    const ui = uiLang(translation);
    const { rows, loading, translationLoading } = useQuranRows({
        from: range.from,
        to: range.to,
    });

    const fromSurah = getSurah(range.from.sura);
    const toSurah = getSurah(range.to.sura);

    return (
        <Layouts>
            <header className="mb-6 rounded-2xl border border-[var(--line)] bg-brand-50/60 px-6 py-8 text-center">
                <h1 className="text-2xl font-semibold text-ink">
                    {getJuzPrefix(ui)} {range.id}
                </h1>
                <p className="mt-2 text-sm text-muted">
                    {fromSurah ? getSurahName(fromSurah, ui) : ""}{" "}
                    {range.from.sura}:{range.from.aya} —{" "}
                    {toSurah ? getSurahName(toSurah, ui) : ""}{" "}
                    {range.to.sura}:{range.to.aya}
                </p>
                <div className="mt-5 flex justify-center">
                    <TranslationPicker loading={translationLoading} />
                </div>
            </header>

            {loading ? (
                <p className="text-center text-muted">Loading…</p>
            ) : (
                <AyahList
                    rows={rows}
                    ui={ui}
                    translation={translation}
                    showSurahHeaders
                />
            )}
        </Layouts>
    );
}
