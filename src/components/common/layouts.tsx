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

    return (
        <div className="min-h-screen bg-page">
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
                <div
                    className={`mx-auto px-4 py-6 md:px-8 md:py-8 ${
                        wide ? "max-w-6xl" : "max-w-3xl"
                    }`}
                >
                    {children}
                </div>
            </main>

            <BottomBar />
        </div>
    );
}
