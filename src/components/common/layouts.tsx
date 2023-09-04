import { Footer } from "./footer";
import { Header } from "./header";

export function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="main">
            <Header />

            <main>{children}</main>

            <Footer />
        </div>
    );
}
