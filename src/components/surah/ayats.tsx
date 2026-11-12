import { Fragment, useEffect, useRef } from "react";
import type { TranslationId, ViewMode } from "src/types";
import { useQuranStore } from "src/store";
import {
    bismillah,
    getSurah,
    getSurahName,
    posKey,
    revelationLabel,
    RUKU_BY_END,
    RUKU_BY_START,
    toArabicDigits,
    toLocaleDigits,
    toOrdinal,
    UiLang,
} from "src/utils";
import type { AyahRow } from "src/utils/quran";
import { AyahItem } from "./ayah";
import { RukuDivider } from "./ruku-divider";
import { RukuEndMark } from "./ruku-end-mark";

type AyahListProps = {
    rows: AyahRow[];
    shown: TranslationId[];
    viewMode: ViewMode;
    showArabic: boolean;
    ui: UiLang;
    /** Show a heading whenever a new surah starts (used for Juz pages). */
    showSurahHeaders?: boolean;
};

/**
 * Records the top-most visible ayah as "last read".
 * Debounced so fast scrolling writes once, when the reader settles.
 */
function useTrackReading(containerRef: React.RefObject<HTMLElement | null>, deps: unknown[]) {
    const setLastRead = useQuranStore((s) => s.setLastRead);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const visible = new Set<string>();
        let timer: number | undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const key = (entry.target as HTMLElement).dataset.ayah;
                    if (!key) continue;
                    if (entry.isIntersecting) visible.add(key);
                    else visible.delete(key);
                }
                window.clearTimeout(timer);
                timer = window.setTimeout(() => {
                    let best: { sura: number; aya: number } | null = null;
                    for (const key of visible) {
                        const [sura, aya] = key.split(":").map(Number);
                        if (!best || toOrdinal({ sura, aya }) < toOrdinal(best)) {
                            best = { sura, aya };
                        }
                    }
                    if (best) setLastRead(best);
                }, 700);
            },
            // Ignore the area under the sticky header and the lower half of the screen.
            { rootMargin: "-128px 0px -55% 0px" }
        );

        container
            .querySelectorAll<HTMLElement>("[data-ayah]")
            .forEach((el) => observer.observe(el));

        return () => {
            window.clearTimeout(timer);
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

/** Compact surah heading inside a juz. */
function SurahStart({
    sura,
    ui,
    showArabic = true,
    shown = [],
}: {
    sura: number;
    ui: UiLang;
    showArabic?: boolean;
    shown?: TranslationId[];
}) {
    const surah = getSurah(sura);
    if (!surah) return null;
    return (
        <div className="mt-10 mb-2 rounded-2xl bg-panel px-5 py-4 text-center ring-1 ring-line">
            <p className="font-arabic text-2xl text-ink">{surah.name}</p>
            <h3 className={`mt-1 text-base font-semibold text-ink ${ui === "bn" ? "font-bangla text-lg" : ""}`}>
                {toLocaleDigits(surah.id, ui)}. {getSurahName(surah, ui)}
            </h3>
            <p className="text-xs text-muted">
                {revelationLabel(surah.type, ui)} · {toLocaleDigits(surah.ayas, ui)}{" "}
                {ui === "en" ? "ayahs" : "আয়াত"}
            </p>
            {sura !== 1 && sura !== 9 &&
                (showArabic ? (
                    <p dir="rtl" lang="ar" className="font-arabic mt-3 text-xl text-ink/90">
                        {bismillah.ar}
                    </p>
                ) : (
                    shown.map((id) => (
                        <p key={id} className={`mt-2 text-sm text-ink/80 ${id === "bn" ? "font-bangla text-base" : ""}`}>
                            {bismillah[id]}
                        </p>
                    ))
                ))}
        </div>
    );
}

export function AyahList({
    rows,
    shown,
    viewMode,
    showArabic,
    ui,
    showSurahHeaders = false,
}: AyahListProps) {
    const ref = useRef<HTMLDivElement>(null);
    useTrackReading(ref, [rows, viewMode]);

    if (viewMode === "quran") {
        return (
            <div ref={ref}>
                <QuranView rows={rows} ui={ui} showSurahHeaders={showSurahHeaders} />
            </div>
        );
    }

    return (
        <div ref={ref} className="flex flex-col">
            {rows.map((row) => {
                const { sura, aya } = row.arabic;
                const ruku = RUKU_BY_START.get(posKey(sura, aya));

                return (
                    <Fragment key={`${sura}-${aya}`}>
                        {showSurahHeaders && aya === 1 && (
                            <SurahStart sura={sura} ui={ui} showArabic={showArabic} shown={shown} />
                        )}
                        {ruku && <RukuDivider ruku={ruku} ui={ui} />}
                        <AyahItem row={row} shown={shown} ui={ui} showArabic={showArabic} />
                    </Fragment>
                );
            })}
        </div>
    );
}

type Group = { ruku?: ReturnType<typeof RUKU_BY_START.get>; startsSurah?: number; rows: AyahRow[] };

/**
 * Arabic only, as continuous text like a printed mushaf, broken into one
 * block per ruku. Each ayah stays addressable (#ayah-S-A) for links.
 */
function QuranView({
    rows,
    ui,
    showSurahHeaders,
}: {
    rows: AyahRow[];
    ui: UiLang;
    showSurahHeaders: boolean;
}) {
    const groups: Group[] = [];
    for (const row of rows) {
        const { sura, aya } = row.arabic;
        const ruku = RUKU_BY_START.get(posKey(sura, aya));
        const startsSurah = showSurahHeaders && aya === 1 ? sura : undefined;
        if (ruku || startsSurah || groups.length === 0) {
            groups.push({ ruku, startsSurah, rows: [] });
        }
        groups[groups.length - 1].rows.push(row);
    }

    return (
        <div className="flex flex-col">
            {groups.map((group) => {
                const first = group.rows[0].arabic;
                return (
                    <Fragment key={`${first.sura}-${first.aya}`}>
                        {group.startsSurah && <SurahStart sura={group.startsSurah} ui={ui} />}
                        {group.ruku && <RukuDivider ruku={group.ruku} ui={ui} />}
                        <p
                            dir="rtl"
                            lang="ar"
                            className="ayah-arabic px-1 text-justify text-ink [text-align-last:center] md:px-3"
                        >
                            {group.rows.map(({ arabic }) => {
                                const key = posKey(arabic.sura, arabic.aya);
                                const rukuEnd = RUKU_BY_END.get(key);
                                return (
                                    <span
                                        key={arabic.aya}
                                        id={`ayah-${arabic.sura}-${arabic.aya}`}
                                        data-ayah={key}
                                        className="scroll-mt-[calc(8rem+var(--safe-top))] rounded-md"
                                    >
                                        {arabic.text}
                                        <span className="ayah-marker" aria-label={`Ayah ${arabic.aya}`}>
                                            {toArabicDigits(arabic.aya)}
                                        </span>
                                        {rukuEnd && <RukuEndMark ruku={rukuEnd} ui={ui} />}{" "}
                                    </span>
                                );
                            })}
                        </p>
                    </Fragment>
                );
            })}
        </div>
    );
}
