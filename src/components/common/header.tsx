import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useQuranStore, useUiStore } from "src/store";
import { MenuIcon, MoonIcon, SettingsIcon, SunIcon } from "src/components/ui/icons";
import { SearchBox } from "./search-box";

const iconButton =
    "press flex h-10 w-10 items-center justify-center rounded-full bg-panel text-ink/80 hover:text-ink hover:bg-brand-50";

export function Header() {
    const setTheme = useQuranStore((s) => s.setTheme);
    const resolvedTheme = useUiStore((s) => s.resolvedTheme);
    const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);
    const setListOpen = useUiStore((s) => s.setListOpen);

    // The one-tap toggle flips between light and dark based on what is showing now.
    const isDark = resolvedTheme === "dark";
    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    return (
        <header className="fixed inset-x-0 top-0 z-30 flex h-[var(--header-h)] items-center pt-[var(--safe-top)] gap-3 border-b border-line bg-page/90 px-3 backdrop-blur md:px-5">
            <button
                type="button"
                onClick={() => setListOpen(true)}
                aria-label="Open surah list"
                className={`${iconButton} md:hidden`}
            >
                <MenuIcon size={18} />
            </button>

            <Link to="/" className="flex shrink-0 items-center gap-2.5">
                <img src="/logo.svg" alt="" className="h-9 w-9" />
                <span className="leading-tight">
                    <span className="block text-base font-semibold text-ink">
                        Quran Bangla
                    </span>
                    <span className="hidden text-[11px] text-muted sm:block">
                        পড়ুন, বুঝুন, আমল করুন
                    </span>
                </span>
            </Link>

            <div className="ml-auto hidden w-full max-w-sm md:block">
                <SearchBox compact />
            </div>

            <div className="ml-auto flex items-center gap-2 md:ml-2">
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                    className={iconButton}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={isDark ? "sun" : "moon"}
                            className="flex"
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        >
                            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                        </motion.span>
                    </AnimatePresence>
                </button>
                <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    aria-label="Settings"
                    aria-haspopup="dialog"
                    className={iconButton}
                >
                    <motion.span className="flex" whileHover={{ rotate: 60 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                        <SettingsIcon size={18} />
                    </motion.span>
                </button>
            </div>
        </header>
    );
}
