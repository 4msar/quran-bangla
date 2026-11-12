import { Link } from "react-router-dom";
import { useQuranStore } from "src/store";
import {
    getRukuPrefix,
    getSurah,
    getSurahName,
    RUKU_RANGES,
    uiLang,
} from "src/utils";

export function RukuList() {
    const ui = uiLang(useQuranStore((state) => state.translation));

    return (
        <ul className="flex flex-col gap-2">
            {RUKU_RANGES.map((ruku) => {
                const surah = getSurah(ruku.sura);
                const verses =
                    ruku.from.aya === ruku.to.aya
                        ? `${ruku.sura}:${ruku.from.aya}`
                        : `${ruku.sura}:${ruku.from.aya}–${ruku.to.aya}`;

                return (
                    <li key={ruku.id}>
                        <Link
                            to={`/${ruku.sura}#ruku-${ruku.id}`}
                            className="flex items-center justify-between rounded-md bg-white px-4 py-3 transition hover:shadow-md"
                        >
                            <span className="text-sm font-bold text-gray-700">
                                {surah ? getSurahName(surah, ui) : ruku.sura}{" "}
                                · {getRukuPrefix(ui)} {ruku.ruku}
                            </span>
                            <span className="text-xs text-gray-400">
                                {verses}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
