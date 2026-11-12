import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "src/store";
import { resolveSearch } from "src/utils";
import { SearchIcon } from "src/components/ui/icons";

/** Search by surah name, number, or a verse reference like 2:255. */
export function SearchBox({ compact = false }: { compact?: boolean }) {
    const navigate = useNavigate();
    const showToast = useUiStore((s) => s.showToast);
    const [query, setQuery] = useState("");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = resolveSearch(query);
        if (target) {
            navigate(target);
            setQuery("");
        } else if (query.trim()) {
            showToast("কিছু পাওয়া যায়নি · No match");
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
                        ? "সূরা খুঁজুন বা 2:255"
                        : "কী পড়তে চান? সূরার নাম, নম্বর বা 2:255"
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
