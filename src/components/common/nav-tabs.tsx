import { NavLink } from "react-router-dom";

const TABS = [
    { to: "/", label: "Surah", end: true },
    { to: "/juz", label: "Juz", end: false },
    { to: "/ruku", label: "Ruku", end: false },
];

export function NavTabs() {
    return (
        <nav
            aria-label="Browse the Quran"
            className="flex w-full gap-1 rounded-lg bg-white p-1 ring-1 ring-black/5"
        >
            {TABS.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                        `press flex-1 rounded-md px-3 py-1.5 text-center text-sm font-semibold ${
                            isActive
                                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20"
                                : "text-muted hover:text-ink"
                        }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </nav>
    );
}
