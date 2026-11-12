import { Link } from "react-router-dom";
import { useQuranStore } from "src/store";
import {
    getJuzPrefix,
    getSurah,
    getSurahName,
    JUZ_RANGES,
    uiLang,
} from "src/utils";

const label = (sura: number, aya: number, lang: "bn" | "en") => {
    const surah = getSurah(sura);
    return surah ? `${getSurahName(surah, lang)} ${sura}:${aya}` : `${sura}:${aya}`;
};

export function JuzList() {
    const ui = uiLang(useQuranStore((state) => state.translation));

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JUZ_RANGES.map((juz) => (
                <Link
                    key={juz.id}
                    to={`/juz/${juz.id}`}
                    className="flex flex-col rounded-md bg-white p-4 transition hover:shadow-md"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-green-600">
                            {juz.id.toString().padStart(2, "0")}
                        </span>
                        <span className="text-base font-bold text-gray-700">
                            {getJuzPrefix(ui)} {juz.id}
                        </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        {label(juz.from.sura, juz.from.aya, ui)}
                        {" — "}
                        {label(juz.to.sura, juz.to.aya, ui)}
                    </div>
                </Link>
            ))}
        </div>
    );
}
