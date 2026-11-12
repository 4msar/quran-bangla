import { useParams } from "react-router-dom";
import { AyahList, Layouts, PrevNext, ReaderBar } from "src/components";
import { useHashTarget } from "src/hooks/use-hash-target";
import { useQuranRows } from "src/hooks/use-quran-rows";
import { useUiLang } from "src/store";
import {
    getJuzPrefix,
    getSurah,
    getSurahName,
    JUZ_RANGES,
    toLocaleDigits,
} from "src/utils";
import { NotFound } from "./not-found";
import { ReaderSkeleton } from "./surah";

export function JuzPage() {
    const { juz } = useParams();
    const range = JUZ_RANGES.find((j) => j.id === Number(juz));

    if (!range) return <NotFound />;

    return <JuzContent key={range.id} range={range} />;
}

function JuzContent({ range }: { range: (typeof JUZ_RANGES)[number] }) {
    const ui = useUiLang();
    const { rows, shown, viewMode, showArabic, loading, translationLoading } = useQuranRows({
        from: range.from,
        to: range.to,
    });
    useHashTarget(!loading && !translationLoading, viewMode);

    const d = (n: number) => toLocaleDigits(n, ui);
    const fromSurah = getSurah(range.from.sura);
    const toSurah = getSurah(range.to.sura);
    const title = `${getJuzPrefix(ui)} ${d(range.id)}`;

    return (
        <Layouts withPanel>
            <header className="mb-2 rounded-3xl bg-brand-50 px-6 py-8 text-center ring-1 ring-brand-600/15">
                <h1 className={`text-3xl font-semibold text-ink ${ui === "bn" ? "font-bangla" : ""}`}>
                    {title}
                </h1>
                <p className="mt-2 text-sm text-muted">
                    {fromSurah ? getSurahName(fromSurah, ui) : ""} {range.from.sura}:{range.from.aya}
                    {" — "}
                    {toSurah ? getSurahName(toSurah, ui) : ""} {range.to.sura}:{range.to.aya}
                </p>
            </header>

            <ReaderBar
                title={title}
                ui={ui}
                from={range.from}
                to={range.to}
                loading={translationLoading}
            />

            {loading ? (
                <ReaderSkeleton />
            ) : (
                <AyahList
                    rows={rows}
                    shown={shown}
                    viewMode={viewMode}
                    showArabic={showArabic}
                    ui={ui}
                    showSurahHeaders
                />
            )}

            <PrevNext
                prev={
                    range.id > 1
                        ? { to: `/juz/${range.id - 1}`, label: `${getJuzPrefix(ui)} ${d(range.id - 1)}`, sub: ui === "en" ? "Previous" : "আগের পারা" }
                        : undefined
                }
                next={
                    range.id < 30
                        ? { to: `/juz/${range.id + 1}`, label: `${getJuzPrefix(ui)} ${d(range.id + 1)}`, sub: ui === "en" ? "Next" : "পরের পারা" }
                        : undefined
                }
            />
        </Layouts>
    );
}
