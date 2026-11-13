import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layouts, SearchBox } from "src/components";
import { useSearchIndex } from "src/hooks/use-search-index";
import { usePageMeta } from "src/hooks/use-page-meta";
import { useAyats } from "src/hooks/use-ayats";
import { useUiLang } from "src/store";
import {
    getSurah,
    getSurahName,
    indexAyats,
    searchIndex,
    stripBismillah,
    tokenize,
    toLocaleDigits,
} from "src/utils";
import type { Ayah } from "src/types";

const PAGE_SIZE = 20;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
    if (!tokens.length) return <>{text}</>;
    const re = new RegExp(`(${tokens.map(escapeRe).join("|")})`, "gi");
    return (
        <>
            {text.split(re).map((part, i) =>
                i % 2 ? (
                    <mark key={i} className="rounded bg-brand-100 px-0.5 text-ink">
                        {part}
                    </mark>
                ) : (
                    part
                ),
            )}
        </>
    );
}

export function Search() {
    const ui = useUiLang();
    const [params] = useSearchParams();
    const query = (params.get("q") ?? "").trim();
    usePageMeta({
        title: ui === "en" ? "Search" : "অনুসন্ধান",
        noIndex: true,
    });

    const { index, failed } = useSearchIndex();
    const bn = useAyats("bn");
    const en = useAyats("en");
    const bnIndex = useMemo(() => (bn ? indexAyats(bn) : null), [bn]);
    const enIndex = useMemo(() => (en ? indexAyats(en) : null), [en]);

    const results = useMemo(() => (index ? searchIndex(index, query) : []), [index, query]);
    const tokens = useMemo(() => tokenize(query), [query]);

    // Reset pagination whenever the query changes.
    const [limit, setLimit] = useState({ query, count: PAGE_SIZE });
    const count = limit.query === query ? limit.count : PAGE_SIZE;
    const shown = results.slice(0, count);

    const t = (en: string, bn: string) => (ui === "en" ? en : bn);

    return (
        <Layouts>
            <div className="mb-6">
                <SearchBox key={query} initial={query} />
            </div>

            {!query ? (
                <p className="text-muted">
                    {t("Type a word in Arabic, Bangla or English.", "আরবি, বাংলা বা ইংরেজি যেকোনো শব্দ লিখুন।")}
                </p>
            ) : failed ? (
                <p className="text-muted">{t("Could not load the text.", "টেক্সট লোড করা যায়নি।")}</p>
            ) : !index ? (
                <p className="text-muted" role="status">
                    {t("Searching…", "খোঁজা হচ্ছে…")}
                </p>
            ) : (
                <>
                    <h1 className={`mb-4 text-lg font-semibold text-ink ${ui === "bn" ? "font-bangla" : ""}`}>
                        {results.length === 0
                            ? t(`No results for “${query}”`, `“${query}” এর জন্য কিছু পাওয়া যায়নি`)
                            : t(
                                  `${results.length} results for “${query}”`,
                                  `“${query}” এর জন্য ${toLocaleDigits(results.length, ui)}টি ফলাফল`,
                              )}
                    </h1>
                    <ul className="flex flex-col gap-3">
                        {shown.map((a: Ayah) => {
                            const surah = getSurah(a.sura);
                            const key = `${a.sura}:${a.aya}`;
                            const bnText = bnIndex?.get(key)?.text;
                            const enText = enIndex?.get(key)?.text;
                            return (
                                <li key={a.id}>
                                    <Link
                                        to={`/${a.sura}#ayah-${a.sura}-${a.aya}`}
                                        className="block rounded-2xl bg-surface p-4 shadow-card ring-1 ring-transparent hover:ring-brand-600/30"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold text-ink ${ui === "bn" ? "font-bangla text-lg" : ""}`}>
                                                {surah ? getSurahName(surah, ui) : a.sura}
                                            </span>
                                            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                                                {a.sura}:{a.aya}
                                            </span>
                                        </div>
                                        <p dir="rtl" lang="ar" className="font-arabic mt-2 line-clamp-3 text-right text-2xl leading-loose text-ink">
                                            {stripBismillah(a).text}
                                        </p>
                                        {bnText && (
                                            <p className="font-bangla mt-1 line-clamp-3 text-base text-ink/85">
                                                <Highlight text={bnText} tokens={tokens} />
                                            </p>
                                        )}
                                        {enText && (
                                            <p className="mt-1 line-clamp-3 text-sm text-muted">
                                                <Highlight text={enText} tokens={tokens} />
                                            </p>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    {results.length > count && (
                        <button
                            type="button"
                            onClick={() => setLimit({ query, count: count + PAGE_SIZE })}
                            className="press mx-auto mt-6 block rounded-full bg-panel px-6 py-2 text-sm font-semibold text-ink ring-1 ring-line hover:bg-brand-50"
                        >
                            {t("Show more", "আরও দেখুন")}
                        </button>
                    )}
                </>
            )}
        </Layouts>
    );
}
