import { useLayoutEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AyahList, Layouts, ReaderBar, SurahPrevNext } from "src/components";
import { useHashTarget } from "src/hooks/use-hash-target";
import { usePageMeta } from "src/hooks/use-page-meta";
import { useQuranRows } from "src/hooks/use-quran-rows";
import { useUiLang } from "src/store";
import type { Surah as SurahInfo } from "src/types";
import {
    bismillah,
    getSurahInfo,
    getSurahName,
    getSurahPrefix,
    revelationLabel,
    toLocaleDigits,
} from "src/utils";
import { NotFound } from "./not-found";

export function Surah() {
    const { surah: surahParam } = useParams();
    const surah = getSurahInfo(Number(surahParam));

    if (!surah) return <NotFound />;

    // Keyed so switching surah resets scroll-tracking and menus.
    return <SurahView key={surah.id} surah={surah} />;
}

function SurahView({ surah }: { surah: SurahInfo }) {
    const ui = useUiLang();
    const { rows, shown, viewMode, showArabic, loading, translationLoading } = useQuranRows({
        surah: surah.id,
    });

    // A new surah opens at the top unless the link targets an ayah/ruku (#hash).
    const { hash } = useLocation();
    useLayoutEffect(() => {
        if (!hash) window.scrollTo(0, 0);
        // Mount only: SurahView is keyed by surah id, so this runs once per surah.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useHashTarget(!loading && !translationLoading, viewMode);
    usePageMeta({
        title: `${getSurahPrefix(ui)} ${getSurahName(surah, ui)} (${surah.tname})`,
        description: `সূরাহ ${surah.bname} (${surah.name}) — কুরআনের ${toLocaleDigits(surah.id, "bn")} নম্বর সূরা, ${toLocaleDigits(surah.ayas, "bn")} আয়াত, ${revelationLabel(surah.type, "bn")}। আরবি ও বাংলা অনুবাদসহ পড়ুন। Surah ${surah.tname} (${surah.ename}), ${surah.ayas} ayahs, with Bangla and English translation.`,
    });

    // Bismillah is not recited at the start of Al-Fatihah (it is verse 1) or Al-Tawbah.
    const showBismillah = surah.id !== 1 && surah.id !== 9;
    const d = (n: number) => toLocaleDigits(n, ui);

    return (
        <Layouts withPanel>
            <header className="relative mb-2 overflow-hidden rounded-3xl bg-brand-50 px-6 py-8 text-center ring-1 ring-brand-600/15">
                <span
                    aria-hidden="true"
                    className="diamond absolute left-5 top-5 h-12 w-12 text-sm font-semibold text-brand-700"
                    style={{ "--diamond-bg": "var(--surface)", "--diamond-line": "var(--brand-100)" } as React.CSSProperties}
                >
                    <span>{d(surah.id)}</span>
                </span>
                <p lang="ar" className="font-arabic text-4xl leading-relaxed text-ink md:text-5xl">
                    {surah.name}
                </p>
                <h1 className={`mt-2 text-2xl font-semibold text-ink ${ui === "bn" ? "font-bangla text-3xl" : ""}`}>
                    {getSurahName(surah, ui)}
                </h1>
                <p className="mt-1 text-sm text-muted">
                    {surah.tname} · {surah.ename}
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-brand-700">
                    <li className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">
                        {revelationLabel(surah.type, ui)}
                    </li>
                    <li className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">
                        {d(surah.ayas)} {ui === "en" ? "ayahs" : "আয়াত"}
                    </li>
                    <li className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">
                        {d(surah.rukus)} {ui === "en" ? "rukus" : "রুকু"}
                    </li>
                </ul>
            </header>

            <ReaderBar
                title={`${d(surah.id)}. ${getSurahName(surah, ui)}`}
                ui={ui}
                from={{ sura: surah.id, aya: 1 }}
                to={{ sura: surah.id, aya: surah.ayas }}
                loading={translationLoading}
            />

            {showBismillah && (
                <div className="py-4 text-center">
                    {showArabic && (
                        <p dir="rtl" lang="ar" className="font-arabic text-3xl leading-loose text-ink">
                            {bismillah.ar}
                        </p>
                    )}
                    {viewMode === "translation" &&
                        shown.map((id) => (
                            <p
                                key={id}
                                className={`mt-1 ${
                                    showArabic ? "text-sm text-muted" : "text-lg font-medium text-ink"
                                } ${id === "bn" ? "font-bangla" : ""} ${id === "bn" && showArabic ? "text-base" : ""}`}
                            >
                                {bismillah[id]}
                            </p>
                        ))}
                </div>
            )}

            {loading ? (
                <ReaderSkeleton />
            ) : (
                <AyahList rows={rows} shown={shown} viewMode={viewMode} showArabic={showArabic} ui={ui} />
            )}

            <SurahPrevNext surah={surah.id} ui={ui} />
        </Layouts>
    );
}

/** Static placeholder while the Arabic text chunk loads. */
export function ReaderSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading" className="space-y-8 py-6">
            {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-3 border-b border-line pb-8">
                    <div className="h-6 w-14 rounded-full bg-panel" />
                    <div className="ml-auto h-8 w-4/5 rounded-lg bg-panel" />
                    <div className="h-4 w-3/5 rounded bg-panel" />
                </div>
            ))}
        </div>
    );
}
