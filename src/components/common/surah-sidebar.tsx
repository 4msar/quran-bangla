import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuranStore } from "src/store";
import { getSurahName, SURAHS, uiLang } from "src/utils";
import { NavTabs } from "./nav-tabs";

export function SurahSidebar() {
    const ui = uiLang(useQuranStore((state) => state.translation));
    const [query, setQuery] = useState("");

    const surahs = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SURAHS;
        return SURAHS.filter(
            (s) =>
                String(s.id) === q ||
                [s.tname, s.ename, s.bname].some((name) =>
                    name.toLowerCase().includes(q)
                )
        );
    }, [query]);

    return (
        <aside className="fixed inset-y-0 left-0 top-16 z-10 hidden w-80 flex-col border-r border-[var(--line)] bg-[var(--panel-bg)] md:flex">
            <div className="space-y-3 p-4">
                <NavTabs />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search surah"
                    aria-label="Filter surahs"
                    className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-600"
                />
            </div>

            <nav aria-label="Surah list" className="flex-1 overflow-y-auto px-2 pb-6">
                <ul className="flex flex-col gap-1">
                    {surahs.map((s) => (
                        <li key={s.id}>
                            <NavLink
                                to={`/${s.id}`}
                                className="press flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/70"
                            >
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                                                isActive
                                                    ? "bg-brand-600 text-white"
                                                    : "bg-white text-muted ring-1 ring-black/5"
                                            }`}
                                        >
                                            {s.id}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={`block truncate text-sm font-semibold ${
                                                    isActive
                                                        ? "text-brand-700"
                                                        : "text-ink"
                                                }`}
                                            >
                                                {getSurahName(s, ui)}
                                            </span>
                                            <span className="block truncate text-xs text-muted">
                                                {s.ename}
                                            </span>
                                        </span>
                                        <span className="font-arabic text-lg text-muted">
                                            {s.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
