import { useCallback, useEffect, useState } from "react";
import { useQuranStore } from "src/store";
import { getArabicFont, getBanglaFont, getEnglishFont } from "src/utils";

export type OfflineStatus = {
    supported: boolean;
    /** A service worker is active and has cached files. */
    ready: boolean;
    entries: number;
    bytes: number | null;
};

const EMPTY: OfflineStatus = { supported: false, ready: false, entries: 0, bytes: null };

async function readStatus(): Promise<OfflineStatus> {
    if (!("serviceWorker" in navigator) || !("caches" in window)) return EMPTY;
    const reg = await navigator.serviceWorker.getRegistration();
    let entries = 0;
    for (const name of await caches.keys()) entries += (await (await caches.open(name)).keys()).length;
    const bytes = (await navigator.storage?.estimate?.())?.usage ?? null;
    return { supported: true, ready: !!reg?.active && entries > 0, entries, bytes };
}

/** Fetch every file of a Google font stylesheet so the face works offline. */
async function cacheGoogleFont(google: string) {
    const css = await (
        await fetch(`https://fonts.googleapis.com/css2?family=${google}&display=swap`)
    ).text();
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, ""));
    await Promise.all(urls.map((u) => fetch(u, { mode: "cors" }).catch(() => {})));
}

/** Offline state plus actions: (re)download everything, or wipe it and start over. */
export function useOffline() {
    const [status, setStatus] = useState<OfflineStatus>(EMPTY);
    const [busy, setBusy] = useState<"download" | "reset" | null>(null);
    const [error, setError] = useState(false);
    const arabicFont = useQuranStore((s) => s.arabicFont);
    const banglaFont = useQuranStore((s) => s.banglaFont);
    const englishFont = useQuranStore((s) => s.englishFont);

    const refresh = useCallback(async () => setStatus(await readStatus()), []);

    useEffect(() => {
        refresh();
        // While the service worker is still installing after a reset, keep polling.
        const timer = window.setInterval(refresh, 3000);
        return () => window.clearInterval(timer);
    }, [refresh]);

    const download = useCallback(async () => {
        setBusy("download");
        setError(false);
        try {
            const reg = await navigator.serviceWorker.ready;
            await reg.update(); // pulls the latest app files into the precache
            const fonts = [getArabicFont(arabicFont), getBanglaFont(banglaFont), getEnglishFont(englishFont)];
            await Promise.all(
                fonts.map(async (f) => {
                    if (f.google) await cacheGoogleFont(f.google);
                    else await document.fonts.load(`1em ${f.family}`, "بِسْمِ ক a");
                })
            );
        } catch {
            setError(true);
        }
        await refresh();
        setBusy(null);
    }, [arabicFont, banglaFont, englishFont, refresh]);

    const reset = useCallback(async () => {
        setBusy("reset");
        setError(false);
        try {
            for (const reg of await navigator.serviceWorker.getRegistrations()) await reg.unregister();
            for (const name of await caches.keys()) await caches.delete(name);
            // A fresh load re-registers the service worker, which downloads the app again.
            window.location.reload();
        } catch {
            setError(true);
            setBusy(null);
        }
    }, []);

    return { status, busy, error, download, reset };
}
