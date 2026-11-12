import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useUiLang } from "src/store";
import {
    getRukuPrefix,
    getSurah,
    getSurahName,
    RUKU_RANGES,
    toLocaleDigits,
} from "src/utils";

/** All 556 rukus, grouped under their surah. */
export function RukuList() {
    const ui = useUiLang();

    return (
        <div className="flex flex-col">
            {RUKU_RANGES.map((ruku) => {
                const surah = getSurah(ruku.sura);
                const verses =
                    ruku.from.aya === ruku.to.aya
                        ? `${ruku.sura}:${ruku.from.aya}`
                        : `${ruku.sura}:${ruku.from.aya}–${ruku.to.aya}`;

                return (
                    <Fragment key={ruku.id}>
                        {ruku.ruku === 1 && surah && (
                            <h3 className={`mt-6 mb-2 flex items-baseline gap-2 px-2 font-semibold text-ink ${ui === "bn" ? "font-bangla text-lg" : ""}`}>
                                <span className="text-brand-700">{toLocaleDigits(surah.id, ui)}.</span>
                                {getSurahName(surah, ui)}
                                <span className="font-arabic ml-auto text-xl font-normal text-muted">{surah.name}</span>
                            </h3>
                        )}
                        <Link
                            to={`/${ruku.sura}#ruku-${ruku.id}`}
                            className="press flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-panel"
                        >
                            <span className="text-sm font-medium text-ink">
                                {getRukuPrefix(ui)} {toLocaleDigits(ruku.ruku, ui)}
                            </span>
                            <span className="text-xs tabular-nums text-muted">{verses}</span>
                        </Link>
                    </Fragment>
                );
            })}
        </div>
    );
}
