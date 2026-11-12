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
        <header className="flex fixed left-0 top-0 z-10 w-full h-20 items-center justify-between bg-white px-4 shadow-sm">
            <div className="flex items-center">
                <Link to="/" className="logo pr-4">
                    <img src="/logo.svg" alt="logo" className="p-2 w-12 h-12" />
                </Link>
                <h4 className="text-xl hidden md:block pr-4 text-slate-800 font-bold">
                    Quran Bangla
                </h4>
            </div>

            <form
                role="search"
                onSubmit={onSubmit}
                className="flex flex-1 items-center justify-end max-w-md"
            >
                <input
                    className="bg-white border border-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Surah name, number or 2:255"
                    aria-label="Search the Quran"
                />
            </form>
        </header>
    );
}
