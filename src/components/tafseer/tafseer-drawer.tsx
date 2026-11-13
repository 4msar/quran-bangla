import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import type { PanInfo } from "motion/react";
import { getCachedTafseer, loadTafseer, TAFSEER_SOURCES } from "src/data/tafseer";
import type { Tafseer, TafseerLang } from "src/data/tafseer";
import { useAyats } from "src/hooks/use-ayats";
import { useQuranStore, useUiLang, useUiStore } from "src/store";
import {
    fromOrdinal,
    getSurah,
    getSurahName,
    indexAyats,
    posKey,
    stripBismillah,
    SURAHS,
    toLocaleDigits,
    toOrdinal,
    TRANSLATIONS,
} from "src/utils";
import type { Position } from "src/utils";
import { Segmented } from "src/components/ui/segmented";
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "src/components/ui/icons";

const LAST_ORDINAL = SURAHS.reduce((sum, s) => sum + s.ayas, 0) - 1;
const SPRING = { type: "spring", stiffness: 380, damping: 36, mass: 0.9 } as const;

/** Loads the tafsir for one ayah; keeps the last result visible while the next loads. */
function useTafseer(lang: TafseerLang, pos: Position | null) {
    const sura = pos?.sura;
    const aya = pos?.aya;
    const [state, setState] = useState<{
        key: string;
        data: Tafseer | null;
        error: boolean;
    } | null>(null);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (sura === undefined || aya === undefined) return;
        const key = `${lang}:${sura}:${aya}`;
        let active = true;
        loadTafseer(lang, sura, aya)
            .then((data) => active && setState({ key, data, error: false }))
            .catch(() => active && setState({ key, data: null, error: true }));

        // Warm the neighbours so prev / next feel instant.
        const ord = toOrdinal({ sura, aya });
        for (const n of [ord + 1, ord - 1]) {
            if (n < 0 || n > LAST_ORDINAL) continue;
            const p = fromOrdinal(n);
            loadTafseer(lang, p.sura, p.aya).catch(() => {});
        }
        return () => {
            active = false;
        };
    }, [lang, sura, aya, retry]);

    if (sura === undefined || aya === undefined) return { data: null, loading: false, error: false, retry: () => {} };
    const key = `${lang}:${sura}:${aya}`;
    const cached = getCachedTafseer(lang, sura, aya);
    const current = state?.key === key ? state : null;
    return {
        data: cached ?? current?.data ?? null,
        loading: !cached && !current,
        error: !cached && !!current?.error,
        retry: () => setRetry((n) => n + 1),
    };
}

/** "2:8–9" for a passage covering several ayahs. */
function rangeLabel(verses: string[], ui: "bn" | "en") {
    if (verses.length < 2) return null;
    const [s1, a1] = verses[0].split(":");
    const [s2, a2] = verses[verses.length - 1].split(":");
    const d = (v: string) => toLocaleDigits(v, ui);
    return s1 === s2 ? `${d(s1)}:${d(a1)}–${d(a2)}` : `${d(s1)}:${d(a1)} – ${d(s2)}:${d(a2)}`;
}

const selectClass =
    "w-full appearance-none truncate rounded-xl bg-panel py-2 pl-3 pr-8 text-sm text-ink ring-1 ring-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";

function SelectChevron() {
    return (
        <ChevronRightIcon
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted"
        />
    );
}

/**
 * Bottom sheet with Tafsir Ibn Kathir for one ayah: surah / ayah pickers,
 * language switch, the ayah itself (as the reader shows it), then the tafsir.
 */
export function TafseerDrawer() {
    const pos = useUiStore((s) => s.tafseer);
    const close = useUiStore((s) => s.closeTafseer);

    // Lock the page behind the sheet and restore focus to the trigger afterwards.
    useEffect(() => {
        if (!pos) return;
        const trigger = document.activeElement as HTMLElement | null;
        const root = document.documentElement;
        const prev = root.style.overflow;
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = prev;
            trigger?.focus?.({ preventScroll: true });
        };
        // Only on open / close, not on every ayah change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pos === null]);

    return (
        <AnimatePresence>
            {pos && <Sheet key="tafseer" pos={pos} onClose={close} />}
        </AnimatePresence>
    );
}

function Sheet({ pos, onClose }: { pos: Position; onClose: () => void }) {
    const ui = useUiLang();
    const en = ui === "en";
    const open = useUiStore((s) => s.openTafseer);
    const lang = useQuranStore((s) => s.tafseerLang);
    const setLang = useQuranStore((s) => s.setTafseerLang);
    const viewMode = useQuranStore((s) => s.viewMode);
    const translations = useQuranStore((s) => s.translations);
    const showArabicSetting = useQuranStore((s) => s.showArabic);

    // Mirror the reader: Quran view is Arabic only; translation view follows settings.
    const shown = viewMode === "quran" ? [] : translations;
    const showArabic = viewMode === "quran" || showArabicSetting || shown.length === 0;

    const arabic = useAyats(showArabic ? "ar" : null);
    const bn = useAyats(shown.includes("bn") ? "bn" : null);
    const enTr = useAyats(shown.includes("en") ? "en" : null);
    const arIndex = useMemo(() => (arabic ? indexAyats(arabic) : null), [arabic]);
    const bnIndex = useMemo(() => (bn ? indexAyats(bn) : null), [bn]);
    const enIndex = useMemo(() => (enTr ? indexAyats(enTr) : null), [enTr]);
    const trIndex = { bn: bnIndex, en: enIndex };

    const tafseer = useTafseer(lang, pos);
    const surah = getSurah(pos.sura);
    const key = posKey(pos.sura, pos.aya);
    const ord = toOrdinal(pos);
    const prev = ord > 0 ? fromOrdinal(ord - 1) : null;
    const next = ord < LAST_ORDINAL ? fromOrdinal(ord + 1) : null;

    // Direction of the last move, so content slides the way the reader went.
    const [dir, setDir] = useState(0);
    const go = (target: Position | null) => {
        if (!target) return;
        setDir(toOrdinal(target) > ord ? 1 : -1);
        open(target);
    };

    const sheetRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const drag = useDragControls();

    useEffect(() => {
        sheetRef.current?.focus({ preventScroll: true });
    }, []);

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: 0 });
    }, [key, lang]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
            return;
        }
        const target = e.target as HTMLElement;
        const typing = target.tagName === "SELECT" || target.tagName === "INPUT";
        if (!typing && e.key === "ArrowRight") go(next);
        if (!typing && e.key === "ArrowLeft") go(prev);
        if (e.key === "Tab") {
            // Keep focus inside the sheet.
            const items = Array.from(
                sheetRef.current?.querySelectorAll<HTMLElement>(
                    "button:not([disabled]), select, a[href], [tabindex]:not([tabindex='-1'])"
                ) ?? []
            );
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.y > 120 || info.velocity.y > 600) onClose();
    };

    const d = (n: number) => toLocaleDigits(n, ui);
    const range = tafseer.data ? rangeLabel(tafseer.data.verses, ui) : null;
    const title = en ? "Tafsir Ibn Kathir" : "তাফসীর ইবনে কাসীর";
    const ar = arIndex?.get(key);

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:pl-20" onKeyDown={onKeyDown}>
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={onClose}
            />

            <motion.div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-t-3xl bg-surface pb-[var(--safe-bottom)] shadow-float outline-none md:max-h-[88dvh]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] } }}
                transition={SPRING}
                drag="y"
                dragListener={false}
                dragControls={drag}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={onDragEnd}
            >
                {/* Grab area: drag down to dismiss. */}
                <div
                    className="flex cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing"
                    onPointerDown={(e) => drag.start(e)}
                >
                    <span className="h-1.5 w-10 rounded-full bg-line" />
                </div>

                <div
                    className="flex touch-none items-center gap-3 px-5 pb-3"
                    onPointerDown={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        drag.start(e);
                    }}
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                        <BookOpenIcon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className={`truncate font-semibold text-ink ${en ? "text-base" : "font-bangla text-lg"}`}>
                            {title}
                        </h2>
                        <p className="truncate text-[11px] text-muted">
                            {en ? TAFSEER_SOURCES[lang].name : TAFSEER_SOURCES[lang].bn}
                        </p>
                    </div>
                    <motion.button
                        type="button"
                        onClick={onClose}
                        aria-label={en ? "Close" : "বন্ধ করুন"}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink"
                    >
                        <CloseIcon size={18} />
                    </motion.button>
                </div>

                {/* Pickers */}
                <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2 border-b border-line px-5 pb-3 sm:grid-cols-[minmax(0,1fr)_7rem_auto]">
                    <label className="relative">
                        <span className="sr-only">{en ? "Surah" : "সূরা"}</span>
                        <select
                            value={pos.sura}
                            onChange={(e) => {
                                const sura = Number(e.target.value);
                                setDir(sura > pos.sura ? 1 : -1);
                                open({ sura, aya: 1 });
                            }}
                            className={`${selectClass} ${en ? "" : "font-bangla"}`}
                        >
                            {SURAHS.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {toLocaleDigits(s.id, ui)}. {getSurahName(s, ui)}
                                </option>
                            ))}
                        </select>
                        <SelectChevron />
                    </label>
                    <label className="relative">
                        <span className="sr-only">{en ? "Ayah" : "আয়াত"}</span>
                        <select
                            value={pos.aya}
                            onChange={(e) => {
                                const aya = Number(e.target.value);
                                setDir(aya > pos.aya ? 1 : -1);
                                open({ sura: pos.sura, aya });
                            }}
                            className={selectClass}
                        >
                            {Array.from({ length: surah?.ayas ?? 0 }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>
                                    {en ? "Ayah" : "আয়াত"} {d(n)}
                                </option>
                            ))}
                        </select>
                        <SelectChevron />
                    </label>
                    <Segmented
                        size="sm"
                        className="col-span-2 sm:col-span-1"
                        label={en ? "Tafsir language" : "তাফসীরের ভাষা"}
                        value={lang}
                        onChange={setLang}
                        options={[
                            { id: "bn", label: "বাংলা" },
                            { id: "en", label: "English" },
                        ]}
                    />
                </div>

                {/* Ayah + tafsir */}
                <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                        <motion.div
                            key={`${key}:${lang}`}
                            custom={dir}
                            variants={{
                                enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
                                center: { opacity: 1, x: 0 },
                                exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold tabular-nums text-brand-700">
                                    {d(pos.sura)}:{d(pos.aya)}
                                </span>
                                <span className={`truncate text-sm text-muted ${en ? "" : "font-bangla"}`}>
                                    {surah ? getSurahName(surah, ui) : ""}
                                </span>
                            </div>

                            {showArabic && (
                                <p dir="rtl" lang="ar" className="ayah-arabic mt-3 text-right text-ink">
                                    {ar ? stripBismillah(ar).text : <span className="text-muted">…</span>}
                                </p>
                            )}
                            {shown.map((id, i) => {
                                const t = trIndex[id]?.get(key);
                                const meta = TRANSLATIONS.find((x) => x.id === id);
                                return (
                                    <div key={id} className={i > 0 ? "mt-4" : "mt-3"}>
                                        {shown.length > 1 && (
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                                                {meta?.label}
                                            </p>
                                        )}
                                        <p lang={id} className={`ayah-translation text-ink/85 ${id === "bn" ? "font-bangla" : ""}`}>
                                            {t?.text ?? "…"}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Separator between the ayah and its tafsir */}
                            <div className="my-6 flex items-center gap-3" role="separator">
                                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
                                <span className={`flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-700 ${en ? "uppercase" : "font-bangla text-sm"}`}>
                                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-brand-600" />
                                    {en ? "Tafsir" : "তাফসীর"}
                                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-brand-600" />
                                </span>
                                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
                            </div>

                            {range && (
                                <p className={`mb-4 rounded-xl bg-panel px-3 py-2 text-xs text-muted ring-1 ring-line ${en ? "" : "font-bangla text-sm"}`}>
                                    {en
                                        ? `This passage explains ayahs ${range} together.`
                                        : `এই তাফসীরে আয়াত ${range} একসাথে ব্যাখ্যা করা হয়েছে।`}
                                </p>
                            )}

                            {tafseer.loading ? (
                                <TafseerSkeleton />
                            ) : tafseer.error ? (
                                <div className="rounded-2xl bg-panel px-4 py-6 text-center ring-1 ring-line">
                                    <p className={`text-sm text-ink ${en ? "" : "font-bangla"}`}>
                                        {en ? "Could not load the tafsir. Check your connection." : "তাফসীর লোড করা যায়নি। ইন্টারনেট সংযোগ দেখুন।"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={tafseer.retry}
                                        className="press mt-3 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-on-brand hover:bg-brand-700"
                                    >
                                        {en ? "Try again" : "আবার চেষ্টা করুন"}
                                    </button>
                                </div>
                            ) : tafseer.data?.html ? (
                                <div
                                    lang={lang}
                                    className={`tafseer-body ${lang === "bn" ? "font-bangla" : ""}`}
                                    // Sanitised in src/data/tafseer.ts (tag whitelist, no attributes).
                                    dangerouslySetInnerHTML={{ __html: tafseer.data.html }}
                                />
                            ) : (
                                <p className={`text-sm text-muted ${en ? "" : "font-bangla"}`}>
                                    {en ? "No tafsir is available for this ayah." : "এই আয়াতের তাফসীর পাওয়া যায়নি।"}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Prev / next ayah */}
                <nav
                    aria-label={en ? "Ayah navigation" : "আয়াত পরিবর্তন"}
                    className="flex items-center gap-2 border-t border-line px-3 py-2.5"
                >
                    <NavButton
                        disabled={!prev}
                        onClick={() => go(prev)}
                        label={en ? "Previous" : "আগের আয়াত"}
                        sub={prev ? `${d(prev.sura)}:${d(prev.aya)}` : ""}
                        en={en}
                        side="prev"
                    />
                    <span className="text-xs tabular-nums text-muted">
                        {d(pos.aya)} / {d(surah?.ayas ?? 0)}
                    </span>
                    <NavButton
                        disabled={!next}
                        onClick={() => go(next)}
                        label={en ? "Next" : "পরের আয়াত"}
                        sub={next ? `${d(next.sura)}:${d(next.aya)}` : ""}
                        en={en}
                        side="next"
                    />
                </nav>
            </motion.div>
        </div>
    );
}

function NavButton({
    disabled,
    onClick,
    label,
    sub,
    en,
    side,
}: {
    disabled: boolean;
    onClick: () => void;
    label: string;
    sub: string;
    en: boolean;
    side: "prev" | "next";
}) {
    const isNext = side === "next";
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.96 }}
            whileHover={disabled ? undefined : { x: isNext ? 2 : -2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`group flex flex-1 items-center gap-2 rounded-2xl px-3 py-2 hover:bg-panel disabled:opacity-40 disabled:hover:bg-transparent ${
                isNext ? "flex-row-reverse text-right" : "text-left"
            }`}
        >
            {isNext ? (
                <ChevronRightIcon size={18} className="shrink-0 text-muted group-hover:text-brand-700" />
            ) : (
                <ChevronLeftIcon size={18} className="shrink-0 text-muted group-hover:text-brand-700" />
            )}
            <span className="min-w-0">
                <span className={`block truncate text-sm font-semibold text-ink ${en ? "" : "font-bangla"}`}>{label}</span>
                <span className="block text-[11px] tabular-nums text-muted">{sub}</span>
            </span>
        </motion.button>
    );
}

function TafseerSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading" className="space-y-3">
            {[92, 100, 84, 96, 60].map((w, i) => (
                <motion.div
                    key={i}
                    className="h-4 rounded bg-panel"
                    style={{ width: `${w}%` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}
                />
            ))}
        </div>
    );
}
