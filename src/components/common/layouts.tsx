import { Header } from "./header";

export function Layouts({
    children,
    className,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="main-app app-full">
            <Header />

            <main className={`mt-20 app-full content-container ${className}`}>
                {children}
            </main>
        </div>
    );
}
