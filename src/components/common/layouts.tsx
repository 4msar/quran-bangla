import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAudioStore } from "src/store";
import { Header } from "./header";
import { BottomBar, IconRail } from "./nav-items";
import { ListPanel } from "./list-panel";

type LayoutsProps = {
    children: React.ReactNode;
    /** Show the Surah/Juz/Ruku side panel on wide screens (reader pages). */
    withPanel?: boolean;
    /** Wider content column (home grids). */
    wide?: boolean;
    className?: string;
};

/**
 * Desktop: header, icon rail, optional list panel, centred reading column.
 * Mobile: header, content, bottom tab bar.
 */
export function Layouts({ children, withPanel = false, wide = false, className }: LayoutsProps) {
    const playerOpen = useAudioStore((s) => s.current !== null);
    const [hideChrome, setHideChrome] = useState(false);

    // Reading pages on mobile: hide header and tab bar on scroll down, show on scroll up.
    useEffect(() => {
        if (!withPanel) return;
        const mq = window.matchMedia("(max-width: 767px)");
        let last = window.scrollY;
        let ticking = false;
        const update = () => {
            ticking = false;
            const y = window.scrollY;
            const delta = y - last;
            if (!mq.matches || y < 80) setHideChrome(false);
            else if (delta > 8) setHideChrome(true);
            else if (delta < -8) setHideChrome(false);
            if (Math.abs(delta) > 8 || y < 80) last = y;
        };
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            setHideChrome(false);
        };
    }, [withPanel]);

    return (
        <div className="group/chrome min-h-screen bg-page" data-hide-chrome={hideChrome}>
            <Header />
            <IconRail />
            {withPanel && <ListPanel />}

            <main
                className={`min-h-screen pt-[var(--header-h)] md:pl-20 ${
                    playerOpen
                        ? "pb-[calc(10rem+var(--safe-bottom))] md:pb-[calc(6.5rem+var(--safe-bottom))]"
                        : "pb-[calc(6rem+var(--safe-bottom))] md:pb-[calc(2.5rem+var(--safe-bottom))]"
                } ${
                    withPanel ? "lg:pl-[25rem]" : ""
                } ${className ?? ""}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className={`mx-auto px-4 py-6 md:px-8 md:py-8 ${
                        wide ? "max-w-6xl" : "max-w-3xl"
                    }`}
                >
                    {children}
                </motion.div>
            </main>

            <BottomBar />
        </div>
    );
}
