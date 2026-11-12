import { create } from "zustand";
import { fromOrdinal, getSurah, SURAHS, toOrdinal } from "src/utils/quran";
import type { Position } from "src/utils/quran";
import { getReciter } from "src/utils/constants";
import { useQuranStore } from "./quran-store";

const pad = (n: number) => String(n).padStart(3, "0");

/** Verse-by-verse recitation files from everyayah.com, for the chosen reciter. */
export const ayahAudioUrl = ({ sura, aya }: Position) =>
    `https://everyayah.com/data/${getReciter(useQuranStore.getState().reciter).id}/${pad(sura)}${pad(aya)}.mp3`;

const LAST_ORDINAL = SURAHS.reduce((sum, s) => sum + s.ayas, 0) - 1;

/** The ayah `delta` steps away, or null past either end of the Quran. */
const step = (position: Position, delta: number): Position | null => {
    const ordinal = toOrdinal(position) + delta;
    return ordinal < 0 || ordinal > LAST_ORDINAL ? null : fromOrdinal(ordinal);
};

type AudioStore = {
    /** The ayah loaded in the player; null when the player is closed. */
    current: Position | null;
    playing: boolean;
    loading: boolean;
    error: boolean;

    play: (position: Position) => void;
    toggle: () => void;
    next: () => void;
    prev: () => void;
    stop: () => void;
};

// One element for the whole session: reusing it keeps mobile browsers'
// "user started playback" permission when advancing to the next ayah.
let audio: HTMLAudioElement | null = null;
let preloader: HTMLAudioElement | null = null;

export const useAudioStore = create<AudioStore>()((set, get) => {
    const getAudio = () => {
        if (audio) return audio;
        const el = new Audio();
        el.preload = "auto";

        const applySettings = () => {
            const { volume, playbackRate } = useQuranStore.getState();
            el.volume = volume;
            // The default survives loading the next ayah; the live rate does not.
            el.defaultPlaybackRate = playbackRate;
            el.playbackRate = playbackRate;
        };
        applySettings();
        useQuranStore.subscribe((state, previous) => {
            applySettings();
            // A new reciter takes over from the start of the current ayah.
            const { current, playing } = get();
            if (state.reciter !== previous.reciter && current) {
                if (playing) get().play(current);
                else el.src = ayahAudioUrl(current);
            }
        });

        el.addEventListener("ended", () => {
            const { current } = get();
            if (useQuranStore.getState().repeatAyah && current) get().play(current);
            else get().next();
        });
        el.addEventListener("playing", () => set({ playing: true, loading: false }));
        el.addEventListener("waiting", () => set({ loading: true }));
        el.addEventListener("pause", () => {
            // "ended" hands over to the next ayah; only a real pause stops the UI.
            if (!el.ended) set({ playing: false, loading: false });
        });
        el.addEventListener("error", () => {
            if (get().current) set({ playing: false, loading: false, error: true });
        });

        if ("mediaSession" in navigator) {
            const ms = navigator.mediaSession;
            ms.setActionHandler("play", () => get().toggle());
            ms.setActionHandler("pause", () => get().toggle());
            ms.setActionHandler("nexttrack", () => get().next());
            ms.setActionHandler("previoustrack", () => get().prev());
        }

        audio = el;
        return el;
    };

    const start = (el: HTMLAudioElement) => {
        const src = el.src;
        el.play().catch(() => {
            // A newer ayah replacing this one also rejects; ignore that case.
            if (el.src === src) set({ playing: false, loading: false });
        });
    };

    return {
        current: null,
        playing: false,
        loading: false,
        error: false,

        play: (position) => {
            const el = getAudio();
            el.src = ayahAudioUrl(position);
            set({ current: position, playing: true, loading: true, error: false });
            start(el);

            if ("mediaSession" in navigator && "MediaMetadata" in window) {
                const surah = getSurah(position.sura);
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: `${surah?.tname ?? ""} ${position.sura}:${position.aya}`,
                    artist: getReciter(useQuranStore.getState().reciter).name,
                    album: "Al-Quran",
                });
            }

            // Warm the cache so the next ayah starts without a gap.
            const upcoming = step(position, 1);
            if (upcoming) {
                preloader ??= new Audio();
                preloader.preload = "auto";
                preloader.src = ayahAudioUrl(upcoming);
            }
        },

        toggle: () => {
            const { current, error } = get();
            if (!current) return;
            if (error) return get().play(current);
            const el = getAudio();
            if (el.paused) {
                set({ playing: true });
                start(el);
            } else {
                el.pause();
            }
        },

        next: () => {
            const { current } = get();
            const upcoming = current && step(current, 1);
            if (upcoming) get().play(upcoming);
            else get().stop();
        },

        prev: () => {
            const { current } = get();
            const previous = current && step(current, -1);
            if (previous) get().play(previous);
        },

        stop: () => {
            if (audio) {
                audio.pause();
                audio.removeAttribute("src");
                audio.load();
            }
            set({ current: null, playing: false, loading: false, error: false });
        },
    };
});

/** True while this ayah is the one loaded in the player. */
export const useIsAyahActive = (sura: number, aya: number) =>
    useAudioStore((s) => s.current?.sura === sura && s.current.aya === aya);
