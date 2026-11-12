import { Link } from "react-router-dom";
import { useUiLang } from "src/store";
import {
    getJuzPrefix,
    getSurah,
    getSurahName,
    JUZ_RANGES,
    toLocaleDigits,
    UiLang,
} from "src/utils";

const label = (sura: number, aya: number, ui: UiLang) => {
    const surah = getSurah(sura);
    return surah ? `${getSurahName(surah, ui)} ${sura}:${aya}` : `${sura}:${aya}`;
};

export function JuzList() {
    const ui = useUiLang();

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JUZ_RANGES.map((juz) => (
                <Link
                    key={juz.id}
                    to={`/juz/${juz.id}`}
                    className="press group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card hover:bg-brand-50"
                >
                    <span className="diamond h-11 w-11 shrink-0 text-sm font-semibold text-ink/80 group-hover:text-brand-700">
                        <span>{toLocaleDigits(juz.id, ui)}</span>
                    </span>
                    <span className="min-w-0">
                        <span className={`block font-semibold text-ink ${ui === "bn" ? "font-bangla text-base" : "text-sm"}`}>
                            {getJuzPrefix(ui)} {toLocaleDigits(juz.id, ui)}
                        </span>
                        <span className="block truncate text-xs text-muted">
                            {label(juz.from.sura, juz.from.aya, ui)} — {label(juz.to.sura, juz.to.aya, ui)}
                        </span>
                    </span>
                </Link>
            ))}
        </div>
    );
}
