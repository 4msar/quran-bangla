import { Footer } from "./footer";
import { Header } from "./header";

export function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="main-app h-screen">
            <Header />

            <main className="">{children}</main>

            <Footer />
        </div>
    );
}
