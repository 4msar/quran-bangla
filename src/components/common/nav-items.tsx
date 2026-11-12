import { NavLink, useLocation } from "react-router-dom";
import { useQuranStore, useUiLang, useUiStore } from "src/store";
import {
    BookmarkIcon,
    BookOpenIcon,
    HomeIcon,
    ListIcon,
    SettingsIcon,
} from "src/components/ui/icons";

const LABELS = {
    bn: { home: "হোম", read: "পড়ুন", surahs: "সূরা", bookmarks: "বুকমার্ক", settings: "সেটিংস" },
    en: { home: "Home", read: "Read", surahs: "Surahs", bookmarks: "Bookmarks", settings: "Settings" },
};

type Variant = "rail" | "bar";

const itemClass = (variant: Variant, active: boolean) =>
    variant === "rail"
        ? `press group flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium ${
              active ? "text-brand-700" : "text-muted hover:text-ink"
          }`
        : `press flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${
              active ? "text-brand-700" : "text-muted"
          }`;

const iconWrap = (variant: Variant, active: boolean) =>
    `flex items-center justify-center rounded-full transition-colors ${
        variant === "rail" ? "h-10 w-10" : "h-8 w-12"
    } ${active ? "bg-brand-50 text-brand-700" : "group-hover:bg-panel"}`;

/** Home · Read · Surahs · Bookmarks · Settings, shared by the rail and the bottom bar. */
export function NavItems({ variant }: { variant: Variant }) {
    const ui = useUiLang();
    const t = LABELS[ui];
    const lastRead = useQuranStore((s) => s.lastRead);
    const setListOpen = useUiStore((s) => s.setListOpen);
    const settingsOpen = useUiStore((s) => s.settingsOpen);
    const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);
    const { pathname } = useLocation();

    const readTo = lastRead
        ? `/${lastRead.sura}#ayah-${lastRead.sura}-${lastRead.aya}`
        : "/1";
    const reading = /^\/(\d+|juz\/\d+)/.test(pathname);

    return (
        <>
            <NavLink to="/" end className={({ isActive }) => itemClass(variant, isActive)}>
                {({ isActive }) => (
                    <>
                        <span className={iconWrap(variant, isActive)}>
                            <HomeIcon />
                        </span>
                        {t.home}
                    </>
                )}
            </NavLink>

            <NavLink to={readTo} className={() => itemClass(variant, reading)}>
                <span className={iconWrap(variant, reading)}>
                    <BookOpenIcon />
                </span>
                {t.read}
            </NavLink>

            {/* The rail sits next to the list panel on wide screens, so it only needs this below lg. */}
            <button
                type="button"
                onClick={() => setListOpen(true)}
                className={`${itemClass(variant, false)} ${variant === "rail" ? "lg:hidden" : ""}`}
            >
                <span className={iconWrap(variant, false)}>
                    <ListIcon />
                </span>
                {t.surahs}
            </button>

            <NavLink
                to="/bookmarks"
                className={({ isActive }) => itemClass(variant, isActive)}
            >
                {({ isActive }) => (
                    <>
                        <span className={iconWrap(variant, isActive)}>
                            <BookmarkIcon />
                        </span>
                        {t.bookmarks}
                    </>
                )}
            </NavLink>

            <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                className={itemClass(variant, settingsOpen)}
            >
                <span className={iconWrap(variant, settingsOpen)}>
                    <SettingsIcon />
                </span>
                {t.settings}
            </button>
        </>
    );
}

export function IconRail() {
    return (
        <nav
            aria-label="Main"
            className="fixed bottom-0 left-0 top-[var(--header-h)] z-20 hidden w-20 flex-col items-center gap-1 border-r border-line bg-page px-2 py-4 md:flex"
        >
            <NavItems variant="rail" />
        </nav>
    );
}

export function BottomBar() {
    return (
        <nav
            aria-label="Main"
            className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-page/95 px-2 pb-[max(0.25rem,var(--safe-bottom))] pt-1 backdrop-blur md:hidden"
        >
            <NavItems variant="bar" />
        </nav>
    );
}
