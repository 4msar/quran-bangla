import { Header } from "./header";

export function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="main-app h-screen">
            <Header />

            <main className="mt-20">
                <section className="flex-1 content-container">
                    {children}
                </section>
            </main>
        </div>
    );
}
