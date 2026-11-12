import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUiLang } from "src/store";
import {
    getJuzPrefix,
    getRukuPrefix,
    getSurah,
    getSurahName,
    JUZ_RANGES,
    revelationLabel,
    RUKU_RANGES,
    SURAHS,
    toLocaleDigits,
} from "src/utils";
import { Segmented } from "src/components/ui/segmented";
import { SearchIcon } from "src/components/ui/icons";

type Tab = "surah" | "juz" | "ruku";

const TAB_LABELS = {
    bn: { surah: "সূরা", juz: "পারা", ruku: "রুকু" },
    en: { surah: "Surah", juz: "Juz", ruku: "Ruku" },
};

/** Where the reader currently is, from the URL. */
function useRoutePosition() {
    const { pathname } = useLocation();
    const juz = pathname.match(/^\/juz\/(\d+)/);
    const surah = pathname.match(/^\/(\d+)/);
    return {
        juz: juz ? Number(juz[1]) : undefined,
        surah: surah ? Number(surah[1]) : undefined,
    };
}

const rowClass = (active: boolean) =>
    `press flex items-center gap-3 rounded-xl px-3 py-2.5 ${
        active
            ? "bg-brand-50 ring-1 ring-brand-600/25"
            : "hover:bg-surface hover:shadow-card"
    }`;

function NumberBadge({ value, active }: { value: string; active: boolean }) {
    return (
        <span
            className={`diamond h-10 w-10 shrink-0 text-xs font-semibold ${
                active ? "text-on-brand" : "text-muted"
            }`}
            style={
                active
                    ? ({
                          "--diamond-bg": "var(--brand-600)",
                          "--diamond-line": "var(--brand-600)",
                      } as React.CSSProperties)
                    : undefined
            }
        >
            <span>{value}</span>
        </span>
    );
}

/** Surah / Juz / Ruku browser used as the desktop side panel and the mobile drawer. */
export function ListPanelBody() {
    const ui = useUiLang();
    const position = useRoutePosition();
    const [tab, setTab] = useState<Tab>(position.juz ? "juz" : "surah");
    const [query, setQuery] = useState("");
    const listRef = useRef<HTMLDivElement>(null);

    const q = query.trim().toLowerCase();

    const surahs = useMemo(() => {
        if (!q) return SURAHS;
        return SURAHS.filter(
            (s) =>
                String(s.id) === q ||
                [s.tname, s.ename, s.bname].some((name) =>
                    name.toLowerCase().includes(q)
                )
        );
    }, [q]);

    // In a surah, the ruku tab shows that surah's rukus; elsewhere all 556.
    const rukus = useMemo(() => {
        const list = position.surah
            ? RUKU_RANGES.filter((r) => r.sura === position.surah)
            : RUKU_RANGES;
        if (!q) return list;
        return list.filter((r) => {
            const s = getSurah(r.sura);
            return (
                String(r.sura) === q ||
                String(r.ruku) === q ||
                (s && [s.tname, s.ename, s.bname].some((n) => n.toLowerCase().includes(q)))
            );
        });
    }, [q, position.surah]);

    const juzs = useMemo(
        () => (q ? JUZ_RANGES.filter((j) => String(j.id) === q) : JUZ_RANGES),
        [q]
    );

    // Bring the active item into view inside the list (not the page).
    useEffect(() => {
        const list = listRef.current;
        const active = list?.querySelector<HTMLElement>("[data-active='true']");
        if (list && active) {
            list.scrollTop =
                active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2;
        }
    }, [tab, position.surah, position.juz]);

    const labels = TAB_LABELS[ui];

    return (
        <div className="flex h-full flex-col">
            <div className="space-y-3 p-4">
                <Segmented
                    label="Browse by"
                    value={tab}
                    onChange={setTab}
                    options={[
                        { id: "surah", label: labels.surah },
                        { id: "juz", label: labels.juz },
                        { id: "ruku", label: labels.ruku },
                    ]}
                />
                <div className="relative">
                    <SearchIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={ui === "en" ? "Filter" : "খুঁজুন"}
                        aria-label="Filter list"
                        className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-600"
                    />
                </div>
            </div>

            <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                {tab === "surah" && (
                    <ul className="flex flex-col gap-1">
                        {surahs.map((s) => {
                            const active = position.surah === s.id;
                            return (
                                <li key={s.id} data-active={active}>
                                    <NavLink to={`/${s.id}`} className={rowClass(active)}>
                                        <NumberBadge
                                            value={toLocaleDigits(s.id, ui)}
                                            active={active}
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={`block truncate text-sm font-semibold ${
                                                    active ? "text-brand-700" : "text-ink"
                                                } ${ui === "bn" ? "font-bangla text-[15px]" : ""}`}
                                            >
                                                {getSurahName(s, ui)}
                                            </span>
                                            <span className="block truncate text-xs text-muted">
                                                {s.ename} · {revelationLabel(s.type, ui)}
                                            </span>
                                        </span>
                                        <span className="text-right">
                                            <span className="font-arabic block text-lg leading-tight text-ink/80">
                                                {s.name}
                                            </span>
                                            <span className="block text-[11px] text-muted">
                                                {toLocaleDigits(s.ayas, ui)} {ui === "en" ? "ayahs" : "আয়াত"}
                                            </span>
                                        </span>
                                    </NavLink>
                                </li>
                            );
                        })}
                        {surahs.length === 0 && <Empty ui={ui} />}
                    </ul>
                )}

                {tab === "juz" && (
                    <ul className="flex flex-col gap-1">
                        {juzs.map((j) => {
                            const active = position.juz === j.id;
                            const from = getSurah(j.from.sura);
                            return (
                                <li key={j.id} data-active={active}>
                                    <NavLink to={`/juz/${j.id}`} className={rowClass(active)}>
                                        <NumberBadge value={toLocaleDigits(j.id, ui)} active={active} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-ink">
                                                {getJuzPrefix(ui)} {toLocaleDigits(j.id, ui)}
                                            </span>
                                            <span className="block truncate text-xs text-muted">
                                                {from ? getSurahName(from, ui) : ""} {j.from.sura}:{j.from.aya} – {j.to.sura}:{j.to.aya}
                                            </span>
                                        </span>
                                    </NavLink>
                                </li>
                            );
                        })}
                        {juzs.length === 0 && <Empty ui={ui} />}
                    </ul>
                )}

                {tab === "ruku" && (
                    <ul className="flex flex-col gap-1">
                        {rukus.map((r) => {
                            const s = getSurah(r.sura);
                            return (
                                <li key={r.id}>
                                    <NavLink
                                        to={`/${r.sura}#ruku-${r.id}`}
                                        className={rowClass(false)}
                                    >
                                        <NumberBadge value={toLocaleDigits(r.ruku, ui)} active={false} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-ink">
                                                {getRukuPrefix(ui)} {toLocaleDigits(r.ruku, ui)}
                                                {!position.surah && s ? ` · ${getSurahName(s, ui)}` : ""}
                                            </span>
                                            <span className="block text-xs text-muted">
                                                {r.sura}:{r.from.aya}
                                                {r.to.aya !== r.from.aya ? `–${r.to.aya}` : ""}
                                            </span>
                                        </span>
                                    </NavLink>
                                </li>
                            );
                        })}
                        {rukus.length === 0 && <Empty ui={ui} />}
                    </ul>
                )}
            </div>
        </div>
    );
}

function Empty({ ui }: { ui: "bn" | "en" }) {
    return (
        <li className="px-3 py-8 text-center text-sm text-muted">
            {ui === "en" ? "Nothing found" : "কিছু পাওয়া যায়নি"}
        </li>
    );
}

/** Fixed side panel next to the rail on wide screens. */
export function ListPanel() {
    return (
        <aside
            aria-label="Browse the Quran"
            className="fixed bottom-0 left-20 top-16 z-10 hidden w-80 border-r border-line bg-panel lg:block"
        >
            <ListPanelBody />
        </aside>
    );
}
