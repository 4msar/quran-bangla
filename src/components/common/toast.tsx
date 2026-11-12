import { useEffect } from "react";
import { useUiStore } from "src/store";

/** Short confirmation ("Link copied") above the bottom bar. */
export function Toast() {
    const toast = useUiStore((s) => s.toast);
    const clear = useUiStore((s) => s.clearToast);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(clear, 1800);
        return () => window.clearTimeout(timer);
    }, [toast, clear]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center md:bottom-8"
        >
            {toast && (
                <span
                    key={toast.id}
                    className="fade-rise rounded-full bg-ink px-4 py-2 text-sm font-medium text-page shadow-float"
                >
                    {toast.message}
                </span>
            )}
        </div>
    );
}
