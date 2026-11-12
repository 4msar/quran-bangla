import { Link } from "react-router-dom";
import { getSurah, getSurahName, toLocaleDigits, UiLang } from "src/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "src/components/ui/icons";

type Target = { to: string; label: string; sub: string };

/** Previous / next cards at the end of a surah or juz. */
export function PrevNext({ prev, next }: { prev?: Target; next?: Target }) {
    const card =
        "press group flex flex-1 items-center gap-3 rounded-2xl bg-surface p-4 shadow-card hover:bg-panel";
    return (
        <nav aria-label="Continue" className="mt-10 flex gap-3">
            {prev ? (
                <Link to={prev.to} className={card}>
                    <ChevronLeftIcon className="text-muted group-hover:text-brand-700" />
                    <span className="min-w-0">
                        <span className="block text-[11px] text-muted">{prev.sub}</span>
                        <span className="block truncate text-sm font-semibold text-ink">{prev.label}</span>
                    </span>
                </Link>
            ) : (
                <span className="flex-1" />
            )}
            {next ? (
                <Link to={next.to} className={`${card} justify-end text-right`}>
                    <span className="min-w-0">
                        <span className="block text-[11px] text-muted">{next.sub}</span>
                        <span className="block truncate text-sm font-semibold text-ink">{next.label}</span>
                    </span>
                    <ChevronRightIcon className="text-muted group-hover:text-brand-700" />
                </Link>
            ) : (
                <span className="flex-1" />
            )}
        </nav>
    );
}

export function SurahPrevNext({ surah, ui }: { surah: number; ui: UiLang }) {
    const target = (id: number, sub: string) => {
        const s = getSurah(id);
        return s
            ? { to: `/${id}`, label: `${toLocaleDigits(id, ui)}. ${getSurahName(s, ui)}`, sub }
            : undefined;
    };
    return (
        <PrevNext
            prev={target(surah - 1, ui === "en" ? "Previous surah" : "আগের সূরা")}
            next={target(surah + 1, ui === "en" ? "Next surah" : "পরের সূরা")}
        />
    );
}
