import { useQuranStore } from "src/store";
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

    const here = lastRead && inRange(lastRead, from, to) ? lastRead : from;
    const juz = getJuzAt(here);
    const ruku = getRukuAt(here);
    const d = (n: number) => toLocaleDigits(n, ui);

    return (
        <div className="sticky top-16 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-line bg-page/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8">
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
