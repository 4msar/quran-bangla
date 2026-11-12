import { Header } from "./header";
import { NavTabs } from "./nav-tabs";
import { SurahSidebar } from "./surah-sidebar";

export function Layouts({
    children,
    className,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <SurahSidebar />

            <main
                className={`min-h-screen pt-16 md:pl-80 ${className ?? ""}`}
            >
                <div className="mx-auto max-w-3xl px-4 py-6 md:px-10 md:py-8">
                    {/* The sidebar carries the tabs on desktop; show them inline on mobile. */}
                    <div className="mb-6 md:hidden">
                        <NavTabs />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
