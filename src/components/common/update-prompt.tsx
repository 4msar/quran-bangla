import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useUiLang } from "src/store";
import { isInstalledApp } from "src/utils";

const CHECK_EVERY_MS = 60 * 60 * 1000;

/** "New version available" banner. Only shown in the installed PWA. */
export function UpdatePrompt() {
    const ui = useUiLang();
    const en = ui === "en";
    const [installed] = useState(isInstalledApp);
    const [dismissed, setDismissed] = useState(false);
    const [updating, setUpdating] = useState(false);

    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(_url, registration) {
            if (!registration) return;
            // An installed app is rarely reloaded, so look for updates ourselves.
            const check = () => {
                if (navigator.onLine) registration.update().catch(() => {});
            };
            window.setInterval(check, CHECK_EVERY_MS);
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") check();
            });
        },
    });

    useEffect(() => {
        if (needRefresh) setDismissed(false);
    }, [needRefresh]);

    const show = installed && needRefresh && !dismissed;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="fixed inset-x-0 top-[calc(0.75rem+var(--safe-top))] z-[60] flex justify-center px-4"
                >
                    <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-page shadow-float">
                        <p className={`min-w-0 flex-1 text-sm ${en ? "" : "font-bangla"}`}>
                            {en ? "A new version is available." : "নতুন সংস্করণ পাওয়া যাচ্ছে।"}
                        </p>
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            className={`press rounded-full px-3 py-1.5 text-sm text-page/70 hover:text-page ${en ? "" : "font-bangla"}`}
                        >
                            {en ? "Later" : "পরে"}
                        </button>
                        <button
                            type="button"
                            disabled={updating}
                            onClick={() => {
                                setUpdating(true);
                                updateServiceWorker(true);
                            }}
                            className={`press rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-on-brand hover:bg-brand-700 disabled:opacity-60 ${en ? "" : "font-bangla"}`}
                        >
                            {en ? "Update" : "আপডেট"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
