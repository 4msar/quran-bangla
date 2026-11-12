import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAudioStore, useQuranStore, useUiLang } from "src/store";
import { getReciter, getSurah, getSurahName, PLAYBACK_RATES, RECITERS, toLocaleDigits } from "src/utils";
import type { UiLang } from "src/utils";
import { Segmented } from "src/components/ui/segmented";
import { CloseIcon, PauseIcon, PlayIcon, SettingsIcon, SkipBackIcon, SkipForwardIcon } from "src/components/ui/icons";

const control =
    "press flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink";

/** Keeps the ayah being recited on screen as playback moves on. */
function useFollowAyah() {
    const current = useAudioStore((s) => s.current);
    const sura = current?.sura;
    const aya = current?.aya;

    useEffect(() => {
        if (sura === undefined || aya === undefined) return;
        const el = document.getElementById(`ayah-${sura}-${aya}`);
        if (!el) return;
        const { top, bottom } = el.getBoundingClientRect();
        // Clear of the sticky bars on top and the player at the bottom.
        if (top >= 140 && bottom <= window.innerHeight - 180) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }, [sura, aya]);
}

const fieldLabel = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted";

/** Reciter, volume, speed and repeat; opens above the player. */
function PlayerSettings({ ui }: { ui: UiLang }) {
    const en = ui === "en";
    const reciter = useQuranStore((s) => s.reciter);
    const volume = useQuranStore((s) => s.volume);
    const playbackRate = useQuranStore((s) => s.playbackRate);
    const repeatAyah = useQuranStore((s) => s.repeatAyah);
    const setReciter = useQuranStore((s) => s.setReciter);
    const setVolume = useQuranStore((s) => s.setVolume);
    const setPlaybackRate = useQuranStore((s) => s.setPlaybackRate);
    const setRepeatAyah = useQuranStore((s) => s.setRepeatAyah);
    const percent = Math.round(volume * 100);

    return (
        <div
            role="dialog"
            aria-label={en ? "Audio settings" : "অডিও সেটিংস"}
            className="fade-rise absolute bottom-full right-0 mb-4 w-72 max-w-full space-y-4 rounded-2xl bg-surface p-4 shadow-float"
        >
            <label className="block">
                <span className={fieldLabel}>{en ? "Reciter" : "ক্বারী"}</span>
                <select
                    value={reciter}
                    onChange={(e) => setReciter(e.target.value)}
                    className={`w-full rounded-xl bg-panel px-3 py-2 text-sm text-ink ring-1 ring-line ${en ? "" : "font-bangla"}`}
                >
                    {RECITERS.map((r) => (
                        <option key={r.id} value={r.id}>
                            {en ? r.name : r.bn}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block">
                <span className={`${fieldLabel} flex justify-between`}>
                    {en ? "Volume" : "ভলিউম"}
                    <span className="tabular-nums">{toLocaleDigits(percent, ui)}%</span>
                </span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={percent}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    className="w-full accent-[var(--color-brand-600)]"
                />
            </label>

            <div>
                <span className={fieldLabel}>{en ? "Speed" : "গতি"}</span>
                <Segmented
                    size="sm"
                    label={en ? "Speed" : "গতি"}
                    value={String(playbackRate)}
                    onChange={(id) => setPlaybackRate(Number(id))}
                    options={PLAYBACK_RATES.map((rate) => ({
                        id: String(rate),
                        label: `${toLocaleDigits(rate, ui)}×`,
                    }))}
                />
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-ink">
                <span className={en ? "" : "font-bangla"}>{en ? "Repeat this ayah" : "একই আয়াত বারবার"}</span>
                <input
                    type="checkbox"
                    checked={repeatAyah}
                    onChange={(e) => setRepeatAyah(e.target.checked)}
                    className="h-4 w-4 accent-[var(--color-brand-600)]"
                />
            </label>
        </div>
    );
}

/** Floating player, shown while a recitation is loaded. */
export function AudioPlayer() {
    const ui = useUiLang();
    const current = useAudioStore((s) => s.current);
    const playing = useAudioStore((s) => s.playing);
    const loading = useAudioStore((s) => s.loading);
    const error = useAudioStore((s) => s.error);
    const toggle = useAudioStore((s) => s.toggle);
    const next = useAudioStore((s) => s.next);
    const prev = useAudioStore((s) => s.prev);
    const stop = useAudioStore((s) => s.stop);

    const reciter = useQuranStore((s) => s.reciter);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const rootRef = useRef<HTMLElement>(null);
    const open = settingsOpen && current !== null;

    useFollowAyah();

    useEffect(() => {
        if (!open) return;
        const onPointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setSettingsOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSettingsOpen(false);
        };
        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!current) return null;

    const en = ui === "en";
    const surah = getSurah(current.sura);
    const d = (n: number) => toLocaleDigits(n, ui);
    const status = error
        ? en
            ? "Could not load audio"
            : "অডিও লোড করা যায়নি"
        : en
          ? getReciter(reciter).name
          : getReciter(reciter).bn;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+var(--safe-bottom))] z-40 flex justify-center px-3 md:bottom-[calc(1.25rem+var(--safe-bottom))] md:pl-20">
            <section
                ref={rootRef}
                aria-label={en ? "Audio player" : "অডিও প্লেয়ার"}
                className="fade-rise pointer-events-auto relative flex w-full max-w-md items-center gap-1 rounded-full bg-surface py-1.5 pl-2 pr-1.5 shadow-float mb-2"
            >
                <button
                    type="button"
                    onClick={prev}
                    aria-label={en ? "Previous ayah" : "আগের আয়াত"}
                    className={control}
                >
                    <SkipBackIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? (en ? "Pause" : "বিরতি") : en ? "Play" : "চালু করুন"}
                    className={`press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-on-brand ${
                        loading ? "animate-pulse" : ""
                    }`}
                >
                    {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                </button>
                <button type="button" onClick={next} aria-label={en ? "Next ayah" : "পরের আয়াত"} className={control}>
                    <SkipForwardIcon size={18} />
                </button>

                <Link to={`/${current.sura}#ayah-${current.sura}-${current.aya}`} className="min-w-0 flex-1 px-2">
                    <span className={`block truncate text-sm font-semibold text-ink ${en ? "" : "font-bangla"}`}>
                        {surah ? getSurahName(surah, ui) : ""} {d(current.sura)}:{d(current.aya)}
                    </span>
                    <span
                        className={`block truncate text-[11px] ${error ? "text-red-600" : "text-muted"}`}
                        aria-live="polite"
                    >
                        {status}
                    </span>
                </Link>

                {open && <PlayerSettings ui={ui} />}
                <button
                    type="button"
                    onClick={() => setSettingsOpen((v) => !v)}
                    aria-label={en ? "Audio settings" : "অডিও সেটিংস"}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    className={`${control} ${open ? "bg-panel text-ink" : ""}`}
                >
                    <SettingsIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={stop}
                    aria-label={en ? "Close player" : "প্লেয়ার বন্ধ করুন"}
                    className={control}
                >
                    <CloseIcon size={18} />
                </button>
            </section>
        </div>
    );
}
