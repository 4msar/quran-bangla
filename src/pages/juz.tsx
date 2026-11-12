import { useParams } from "react-router-dom";
import {
    AyahList,
    JuzList,
    Layouts,
    NavTabs,
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
            <NavTabs />
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
                <NavTabs />
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
            <NavTabs />

            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getJuzPrefix(ui)} {range.id}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {fromSurah ? getSurahName(fromSurah, ui) : ""}{" "}
                        {range.from.sura}:{range.from.aya} —{" "}
                        {toSurah ? getSurahName(toSurah, ui) : ""}{" "}
                        {range.to.sura}:{range.to.aya}
                    </p>
                </div>
                <TranslationPicker loading={translationLoading} />
            </header>

            {loading ? (
                <p className="text-center text-gray-400">Loading…</p>
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
