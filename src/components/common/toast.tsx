import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
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
            <AnimatePresence mode="popLayout">
                {toast && (
                    <motion.span
                        key={toast.id}
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-page shadow-float"
                    >
                        {toast.message}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}
