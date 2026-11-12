import { Link } from "react-router-dom";
import { Layouts } from "src/components";

export function NotFound() {
    return (
        <Layouts>
            <div className="py-24 text-center">
                <p className="text-6xl font-semibold text-brand-700">৪০৪</p>
                <p className="mt-3 font-bangla text-xl text-ink">পাতাটি পাওয়া যায়নি</p>
                <p className="text-sm text-muted">Page not found</p>
                <Link
                    to="/"
                    className="press mt-6 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-on-brand hover:bg-brand-700"
                >
                    হোমে ফিরুন
                </Link>
            </div>
        </Layouts>
    );
}
