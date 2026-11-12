import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Layouts } from "src/components";
import { BookmarkIcon, TrashIcon } from "src/components/ui/icons";
import { useAyats } from "src/hooks/use-ayats";
import { useQuranStore, useUiLang } from "src/store";
import {
    getSurah,
    getSurahName,
    indexAyats,
    stripBismillah,
} from "src/utils";

export function Bookmarks() {
    const ui = useUiLang();
    const bookmarks = useQuranStore((s) => s.bookmarks);
    const toggleBookmark = useQuranStore((s) => s.toggleBookmark);
    const firstTranslation = useQuranStore((s) => s.translations[0] ?? null);
    // Translation-only readers see translation snippets (Arabic needs a translation to hide behind).
    const showArabic = useQuranStore((s) => s.showArabic) || !firstTranslation;

    const arabic = useAyats(bookmarks.length && showArabic ? "ar" : null);
    const translated = useAyats(bookmarks.length ? firstTranslation : null);
    const arIndex = useMemo(() => (arabic ? indexAyats(arabic) : null), [arabic]);
    const trIndex = useMemo(() => (translated ? indexAyats(translated) : null), [translated]);

    return (
        <Layouts>
            <h1 className={`mb-6 text-2xl font-semibold text-ink ${ui === "bn" ? "font-bangla text-3xl" : ""}`}>
                {ui === "en" ? "Bookmarks" : "বুকমার্ক"}
            </h1>

            {bookmarks.length === 0 ? (
                <div className="rounded-3xl bg-panel px-6 py-14 text-center ring-1 ring-line">
                    <BookmarkIcon size={32} className="mx-auto text-muted" />
                    <p className="mt-4 font-semibold text-ink">
                        {ui === "en" ? "No bookmarks yet" : "এখনো কোনো বুকমার্ক নেই"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                        {ui === "en"
                            ? "Tap the bookmark icon on any ayah to save it here."
                            : "যেকোনো আয়াতের বুকমার্ক আইকনে চাপ দিয়ে এখানে সংরক্ষণ করুন।"}
                    </p>
                    <Link
                        to="/1"
                        className="press mt-6 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-on-brand hover:bg-brand-700"
                    >
                        {ui === "en" ? "Start reading" : "পড়া শুরু করুন"}
                    </Link>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {bookmarks.map((key) => {
                        const [sura, aya] = key.split(":").map(Number);
                        const surah = getSurah(sura);
                        const ar = arIndex?.get(key);
                        const tr = trIndex?.get(key);
                        return (
                            <li key={key} className="rounded-2xl bg-surface p-4 shadow-card">
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/${sura}#ayah-${sura}-${aya}`}
                                        className={`font-semibold text-ink hover:text-brand-700 ${ui === "bn" ? "font-bangla text-lg" : ""}`}
                                    >
                                        {surah ? getSurahName(surah, ui) : sura}
                                    </Link>
                                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                                        {sura}:{aya}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleBookmark(key)}
                                        aria-label={`Remove bookmark ${key}`}
                                        className="press ml-auto flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </div>
                                <Link to={`/${sura}#ayah-${sura}-${aya}`} className="mt-2 block">
                                    {showArabic && (
                                        <p dir="rtl" lang="ar" className="font-arabic line-clamp-2 text-right text-2xl leading-loose text-ink">
                                            {ar ? stripBismillah(ar).text : "…"}
                                        </p>
                                    )}
                                    {tr && (
                                        <p
                                            className={`line-clamp-2 ${
                                                showArabic ? "mt-1 text-sm text-muted" : "text-base text-ink/85"
                                            } ${firstTranslation === "bn" ? "font-bangla text-base" : ""}`}
                                        >
                                            {tr.text}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Layouts>
    );
}
