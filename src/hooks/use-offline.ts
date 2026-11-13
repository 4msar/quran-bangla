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

/** Every file a Google font stylesheet refers to. */
async function googleFontFiles(google: string): Promise<string[]> {
    const res = await fetch(`https://fonts.googleapis.com/css2?family=${google}&display=swap`);
    const css = await res.text();
    return [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, ""));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Run `task` over `items`, a few at a time. */
async function pool<T>(items: T[], limit: number, task: (item: T) => Promise<void>) {
    let next = 0;
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (next < items.length) await task(items[next++]);
        })
    );
}

/** Offline state plus actions: (re)download everything, or wipe it and start over. */
export function useOffline() {
    const [status, setStatus] = useState<OfflineStatus>(EMPTY);
    const [busy, setBusy] = useState<"download" | "reset" | null>(null);
    const [error, setError] = useState(false);
    const [done, setDone] = useState(false);
    const [progress, setProgress] = useState({ done: 0, total: 1 });
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
        setDone(false);
        setProgress({ done: 0, total: 1 });
        try {
            const reg = await navigator.serviceWorker.getRegistration();
            if (!reg) throw new Error("no service worker");
            await reg.update().catch(() => {});

            // The app files the service worker precaches. Right after a reset it may still be installing.
            let precache: Cache | undefined;
            let requests: readonly Request[] = [];
            for (let i = 0; i < 40 && requests.length === 0; i++) {
                const name = (await caches.keys()).find((k) => k.includes("precache"));
                if (name) {
                    precache = await caches.open(name);
                    requests = await precache.keys();
                }
                if (requests.length === 0) await sleep(500);
            }
            if (!precache || requests.length === 0) throw new Error("precache empty");

            // Files of the fonts currently in use.
            const fonts = [getArabicFont(arabicFont), getBanglaFont(banglaFont), getEnglishFont(englishFont)];
            const fontFiles = (
                await Promise.all(fonts.map((f) => (f.google ? googleFontFiles(f.google).catch(() => []) : [])))
            ).flat();
            const local = fonts.filter((f) => !f.google);

            const total = requests.length + fontFiles.length + local.length;
            let finished = 0;
            let failed = 0;
            const tick = () => setProgress({ done: ++finished, total });
            setProgress({ done: 0, total });

            const cache = precache;
            await pool(requests as Request[], 6, async (req) => {
                try {
                    const res = await fetch(new Request(req.url, { cache: "reload" }));
                    if (res.ok) await cache.put(req, res);
                    else failed++;
                } catch {
                    failed++;
                }
                tick();
            });
            await pool(fontFiles, 6, async (url) => {
                try {
                    const res = await fetch(url, { mode: "cors" });
                    if (!res.ok) failed++;
                } catch {
                    failed++;
                }
                tick();
            });
            for (const f of local) {
                await document.fonts.load(`1em ${f.family}`, "بِسْمِ ক a").catch(() => failed++);
                tick();
            }
            if (failed > 0) throw new Error("some files failed");
            setDone(true);
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

    return { status, busy, error, done, progress, download, reset };
}
