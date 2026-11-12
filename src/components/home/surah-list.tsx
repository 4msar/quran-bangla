import { Link } from "react-router-dom";
import { useQuranStore, useUiLang } from "src/store";
import type { Surah } from "src/types";
import {
    getJuzInfo,
    getSurahName,
    revelationLabel,
    SURAHS,
    toLocaleDigits,
    UiLang,
} from "src/utils";

function Badge({ n, ui }: { n: number; ui: UiLang }) {
    return (
        <span className="diamond h-11 w-11 shrink-0 text-sm font-semibold text-ink/80 group-hover:text-brand-700">
            <span>{toLocaleDigits(n, ui)}</span>
        </span>
    );
}

function SurahCard({ surah, ui }: { surah: Surah; ui: UiLang }) {
    return (
        <Link
            to={`/${surah.id}`}
            className="press group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card hover:bg-brand-50"
        >
            <Badge n={surah.id} ui={ui} />
            <span className="min-w-0 flex-1">
                <span className={`block truncate font-semibold text-ink ${ui === "bn" ? "font-bangla text-base" : "text-sm"}`}>
                    {getSurahName(surah, ui)}
                </span>
                <span className="block truncate text-xs text-muted">{surah.ename}</span>
            </span>
            <span className="text-right">
                <span className="font-arabic block text-xl leading-tight text-ink/85">{surah.name}</span>
                <span className="block text-[11px] text-muted">
                    {toLocaleDigits(surah.ayas, ui)} {ui === "en" ? "ayahs" : "আয়াত"}
                </span>
            </span>
        </Link>
    );
}

function SurahRow({ surah, ui }: { surah: Surah; ui: UiLang }) {
    const juz = getJuzInfo(surah.id);
    return (
        <Link
            to={`/${surah.id}`}
            className="press group flex items-center gap-4 border-b border-line px-2 py-3 hover:bg-panel"
        >
            <Badge n={surah.id} ui={ui} />
            <span className="min-w-0 flex-1">
                <span className={`block font-semibold text-ink ${ui === "bn" ? "font-bangla text-base" : "text-sm"}`}>
                    {getSurahName(surah, ui)}
                    <span className="ml-2 text-xs font-normal text-muted">{surah.tname}</span>
                </span>
                <span className="block text-xs text-muted">
                    {surah.ename} · {revelationLabel(surah.type, ui)} · {toLocaleDigits(surah.ayas, ui)}{" "}
                    {ui === "en" ? "ayahs" : "আয়াত"} · {toLocaleDigits(surah.rukus, ui)}{" "}
                    {ui === "en" ? "rukus" : "রুকু"}
                    {juz.length > 0 && ` · ${ui === "en" ? "Juz" : "পারা"} ${juz.map((j) => toLocaleDigits(j, ui)).join(", ")}`}
                </span>
            </span>
            <span className="font-arabic text-2xl text-ink/85">{surah.name}</span>
        </Link>
    );
}

export function SurahList({ surahs = SURAHS }: { surahs?: Surah[] }) {
    const type = useQuranStore((s) => s.listType);
    const ui = useUiLang();

    if (type === "list") {
        return (
            <div className="flex flex-col">
                {surahs.map((s) => (
                    <SurahRow key={s.id} surah={s} ui={ui} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {surahs.map((s) => (
                <SurahCard key={s.id} surah={s} ui={ui} />
            ))}
        </div>
    );
}
