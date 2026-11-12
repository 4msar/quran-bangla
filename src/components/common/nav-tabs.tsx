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
            className="mb-4 flex w-fit gap-1 rounded-xl bg-white p-1 shadow-sm"
        >
            {TABS.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                        `rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            isActive
                                ? "bg-green-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </nav>
    );
}
