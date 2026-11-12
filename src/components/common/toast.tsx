import { useEffect } from "react";
import { useAudioStore, useUiStore } from "src/store";

/** Short confirmation ("Link copied") above the bottom bar. */
export function Toast() {
    const toast = useUiStore((s) => s.toast);
    const clear = useUiStore((s) => s.clearToast);
    const playerOpen = useAudioStore((s) => s.current !== null);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(clear, 1800);
        return () => window.clearTimeout(timer);
    }, [toast, clear]);

    return (
        <div
            role="status"
            aria-live="polite"
            className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center ${
                playerOpen
                    ? "bottom-[calc(9.5rem+var(--safe-bottom))] md:bottom-[calc(6rem+var(--safe-bottom))]"
                    : "bottom-[calc(6rem+var(--safe-bottom))] md:bottom-[calc(2rem+var(--safe-bottom))]"
            }`}
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
