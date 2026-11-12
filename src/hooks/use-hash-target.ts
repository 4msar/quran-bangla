import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to #ayah-S-A / #ruku-N once the text is in place (after any
 * translation has loaded, so the target does not shift), then gives the
 * target a one-off highlight.
 */
export function useHashTarget(ready: boolean, layoutKey: unknown) {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash || !ready) return;
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!el) return;

        el.scrollIntoView({ block: "start" });
        if (!el.id.startsWith("ayah-")) return;

        el.classList.remove("is-target");
        // Restart the animation if the same ayah is targeted again.
        void el.offsetWidth;
        el.classList.add("is-target");
        const timer = window.setTimeout(() => el.classList.remove("is-target"), 1800);
        return () => window.clearTimeout(timer);
    }, [hash, ready, layoutKey]);
}
