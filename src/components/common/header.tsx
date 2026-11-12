import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolveSearch } from "src/utils";

export function Header() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = resolveSearch(query);
        if (target) {
            navigate(target);
            setQuery("");
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-4 border-b border-[var(--line)] bg-white/95 px-4 backdrop-blur md:px-6">
            <Link to="/" className="flex shrink-0 items-center gap-3">
                <img src="/logo.svg" alt="" className="h-9 w-9" />
                <span className="hidden text-base font-semibold text-ink sm:block">
                    Quran Bangla
                </span>
            </Link>

            <form
                role="search"
                onSubmit={onSubmit}
                className="ml-auto w-full max-w-sm"
            >
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search surah, number or 2:255"
                    aria-label="Search the Quran"
                    className="w-full rounded-full border border-transparent bg-[var(--panel-bg)] px-4 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-600 focus:bg-white"
                />
            </form>
        </header>
    );
}
