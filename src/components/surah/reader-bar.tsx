import { motion } from "motion/react";
import { useAudioStore, useQuranStore, useUiStore } from "src/store";
import {
    getAyahLabel,
    getJuzAt,
    getJuzPrefix,
    getRukuAt,
    getRukuPrefix,
    inRange,
    Position,
    toLocaleDigits,
    UiLang,
} from "src/utils";
import { BookOpenIcon, PauseIcon, PlayIcon } from "src/components/ui/icons";
import { Segmented } from "src/components/ui/segmented";

type ReaderBarProps = {
    title: string;
    ui: UiLang;
    /** The scope on screen, so "last read" elsewhere is ignored. */
    from: Position;
    to: Position;
    loading?: boolean;
};

/** Sticky bar under the header: where you are, and the Translation / Quran switch. */
export function ReaderBar({ title, ui, from, to, loading }: ReaderBarProps) {
    const lastRead = useQuranStore((s) => s.lastRead);
    const viewMode = useQuranStore((s) => s.viewMode);
    const setViewMode = useQuranStore((s) => s.setViewMode);

    const current = useAudioStore((s) => s.current);
    const playing = useAudioStore((s) => s.playing);
    const play = useAudioStore((s) => s.play);
    const toggle = useAudioStore((s) => s.toggle);
    const openTafseer = useUiStore((s) => s.openTafseer);
    // The player belongs to this page when its ayah is within the scope on screen.
    const playingHere = current !== null && inRange(current, from, to);

    const here = lastRead && inRange(lastRead, from, to) ? lastRead : from;
    const juz = getJuzAt(here);
    const ruku = getRukuAt(here);
    const d = (n: number) => toLocaleDigits(n, ui);

    return (
        <div className="sticky top-[var(--header-h)] transition-[top] duration-300 max-md:group-data-[hide-chrome=true]/chrome:top-0 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-line bg-page/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8">
            <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold text-ink ${ui === "bn" ? "font-bangla text-base" : ""}`}>
                    {title}
                </p>
                <p className="truncate text-[11px] text-muted" aria-live="off">
                    {getAyahLabel(ui)} {d(here.sura)}:{d(here.aya)}
                    {ruku && ` · ${getRukuPrefix(ui)} ${d(ruku.ruku)}`}
                    {juz && ` · ${getJuzPrefix(ui)} ${d(juz.id)}`}
                    {loading && (ui === "en" ? " · loading translation…" : " · অনুবাদ লোড হচ্ছে…")}
                </p>
            </div>
            <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => openTafseer(here)}
                aria-label={ui === "en" ? "Open tafsir" : "তাফসীর দেখুন"}
                aria-haspopup="dialog"
                title={ui === "en" ? "Tafsir" : "তাফসীর"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink/80 ring-1 ring-line transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
                <BookOpenIcon size={17} />
            </motion.button>
            <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => (playingHere ? toggle() : play(here, { bismillah: true }))}
                aria-label={
                    playingHere && playing
                        ? ui === "en" ? "Pause recitation" : "তিলাওয়াত থামান"
                        : ui === "en" ? "Play recitation" : "তিলাওয়াত শুনুন"
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
            >
                {playingHere && playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </motion.button>
            <Segmented
                size="sm"
                label={ui === "en" ? "View" : "পড়ার ধরন"}
                value={viewMode}
                onChange={setViewMode}
                options={[
                    { id: "translation", label: ui === "en" ? "Translation" : "অনুবাদ" },
                    { id: "quran", label: ui === "en" ? "Quran" : "কুরআন" },
                ]}
            />
        </div>
    );
}
