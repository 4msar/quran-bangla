import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveSearch } from "src/utils";
import { SearchIcon } from "src/components/ui/icons";

/** Surah name/number or verse reference jumps straight there; anything else runs a full-text search. */
export function SearchBox({ compact = false, initial = "" }: { compact?: boolean; initial?: string }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState(initial);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = resolveSearch(query);
        if (target) {
            navigate(target);
            if (!initial) setQuery("");
        } else if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form role="search" onSubmit={onSubmit} className="relative w-full">
            <SearchIcon
                size={compact ? 16 : 20}
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
                    compact ? "left-3.5" : "left-5"
                }`}
            />
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                    compact
                        ? "সূরা বা শব্দ খুঁজুন"
                        : "সূরা, 2:255 বা যেকোনো শব্দ খুঁজুন"
                }
                aria-label="Search the Quran"
                className={`w-full rounded-full border border-line bg-panel text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-600 focus:bg-surface ${
                    compact
                        ? "py-2 pl-10 pr-4 text-sm"
                        : "py-4 pl-14 pr-5 text-base shadow-card"
                }`}
            />
        </form>
    );
}
