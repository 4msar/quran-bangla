import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="main-app h-screen">
            <Header />

            <main className="mt-20">
                <Sidebar />
                <section className="flex-1 ml-20 content-container">
                    {children}
                </section>
            </main>
        </div>
    );
}
