import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useIsAyahActive, useQuranStore, useUiStore } from "src/store";
import type { TranslationId } from "src/types";
import {
    getSurah,
    getSurahName,
    hasSajdah,
    posKey,
    RUKU_BY_END,
    toLocaleDigits,
    TRANSLATIONS,
} from "src/utils";
import type { UiLang } from "src/utils";
import type { AyahRow } from "src/utils/quran";
import { BookmarkIcon, CheckIcon, CopyIcon } from "src/components/ui/icons";
import { AyahMenu } from "./ayah-menu";
import { RukuEndMark } from "./ruku-end-mark";

type AyahItemProps = {
    row: AyahRow;
    shown: TranslationId[];
    ui: UiLang;
    /** False in translation-only reading. */
    showArabic: boolean;
};

const actionButton =
    "flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-panel hover:text-ink";

const tap = { scale: 0.86 };
const iconSwap = {
    initial: { opacity: 0, scale: 0.6, filter: "blur(2px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.6, filter: "blur(2px)" },
    transition: { type: "spring", stiffness: 600, damping: 30 },
} as const;

/** One verse in the translation view: key + actions, Arabic, translations. */
export const AyahItem = memo(function AyahItem({ row, shown, ui, showArabic }: AyahItemProps) {
    const { arabic, translations } = row;
    const key = posKey(arabic.sura, arabic.aya);
    const sajdah = hasSajdah(arabic.sura, arabic.aya);
    const rukuEnd = RUKU_BY_END.get(key);

    const bookmarked = useQuranStore((s) => s.bookmarks.includes(key));
    const toggleBookmark = useQuranStore((s) => s.toggleBookmark);
    const showToast = useUiStore((s) => s.showToast);
    const active = useIsAyahActive(arabic.sura, arabic.aya);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = window.setTimeout(() => setCopied(false), 1500);
        return () => window.clearTimeout(timer);
    }, [copied]);

    const surah = getSurah(arabic.sura);
    const reference = `${surah ? getSurahName(surah, ui) : ""} ${arabic.sura}:${arabic.aya}`;
    const fullText = [
        arabic.text,
        ...shown.map((id) => translations[id]?.text).filter(Boolean),
        `— ${reference}`,
    ].join("\n\n");

    const onCopy = () => {
        navigator.clipboard?.writeText(fullText);
        setCopied(true);
        showToast(ui === "en" ? "Ayah copied" : "আয়াত কপি হয়েছে");
    };

    return (
        <article
            id={`ayah-${arabic.sura}-${arabic.aya}`}
            data-ayah={key}
            aria-current={active || undefined}
            className={`scroll-mt-[calc(8rem+var(--safe-top))] rounded-2xl border-b border-line px-1 py-6 transition-colors md:px-3 ${
                active ? "bg-brand-50" : ""
            }`}
        >
            <div className="mb-3 flex items-center gap-2">
                <Link
                    to={`/${arabic.sura}/${arabic.aya}`}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold tabular-nums text-brand-700 hover:bg-brand-100"
                    aria-label={`Ayah ${arabic.sura}:${arabic.aya}`}
                >
                    {arabic.sura}:{arabic.aya}
                </Link>
                {sajdah && (
                    <span
                        className="rounded-full bg-panel px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-line"
                        title="Sajdah"
                    >
                        ۩ {ui === "en" ? "Sajdah" : "সিজদা"}
                    </span>
                )}

                <div className="ml-auto flex items-center">
                    <motion.button
                        type="button"
                        whileTap={tap}
                        onClick={() => toggleBookmark(key)}
                        aria-pressed={bookmarked}
                        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
                        className={`${actionButton} ${bookmarked ? "text-brand-600" : ""}`}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span key={String(bookmarked)} className="flex" {...iconSwap}>
                                <BookmarkIcon size={18} filled={bookmarked} />
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>
                    <motion.button type="button" whileTap={tap} onClick={onCopy} aria-label="Copy ayah" className={actionButton}>
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span key={copied ? "check" : "copy"} className="flex" {...iconSwap}>
                                {copied ? <CheckIcon size={18} className="text-brand-600" /> : <CopyIcon size={18} />}
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>
                    <AyahMenu
                        sura={arabic.sura}
                        aya={arabic.aya}
                        arabic={arabic.text}
                        shareText={fullText}
                        ui={ui}
                    />
                </div>
            </div>

            {showArabic && (
                <p dir="rtl" lang="ar" className="ayah-arabic mb-4 text-right text-ink">
                    {arabic.text}
                    {rukuEnd && <RukuEndMark ruku={rukuEnd} ui={ui} />}
                </p>
            )}

            {shown.map((id, index) => {
                const t = translations[id];
                if (!t) return null;
                const meta = TRANSLATIONS.find((x) => x.id === id);
                return (
                    <div key={id} className={`fade-rise ${index > 0 ? "mt-4" : ""}`}>
                        {shown.length > 1 && (
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                                {meta?.label}
                            </p>
                        )}
                        <p
                            lang={id}
                            className={`ayah-translation mt-1 text-ink/85 ${
                                id === "bn" ? "font-bangla" : ""
                            }`}
                        >
                            {id === "bn" && (
                                <span className="mr-1 text-brand-700">
                                    {toLocaleDigits(arabic.aya, "bn")}.
                                </span>
                            )}
                            {t.text}
                        </p>
                    </div>
                );
            })}
        </article>
    );
});
