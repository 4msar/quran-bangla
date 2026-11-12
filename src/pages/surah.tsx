import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    Actions,
    AyahList,
    Layouts,
    TranslationPicker,
} from "src/components";
import { useQuranRows } from "src/hooks/use-quran-rows";
import type { Surah as SurahInfo } from "src/types";
import {
    bismillah,
    getSurahInfo,
    getSurahName,
    getSurahPrefix,
    uiLang,
} from "src/utils";

export function Surah() {
    const { surah: surahParam } = useParams();
    const surah = getSurahInfo(Number(surahParam));

    if (!surah) {
        return (
            <Layouts>
                <p className="text-center">Surah not found</p>
            </Layouts>
        );
    }

    return <SurahView surah={surah} />;
}

function SurahView({ surah }: { surah: SurahInfo }) {
    const { hash } = useLocation();
    const { rows, translation, loading, translationLoading } = useQuranRows({
        surah: surah.id,
    });
    const ui = uiLang(translation);

    // Scroll to #ayah-S-A or #ruku-N once the text has rendered.
    useEffect(() => {
        if (!hash || loading) return;
        document
            .getElementById(decodeURIComponent(hash.slice(1)))
            ?.scrollIntoView({ block: "start" });
    }, [hash, loading]);

    // Bismillah is not recited at the start of Al-Fatihah (it is verse 1) or Al-Tawbah.
    const showBismillah = surah.id !== 1 && surah.id !== 9;
    const bismillahTranslation =
        translation === "en"
            ? bismillah.en
            : translation === "bn"
              ? bismillah.bn
              : null;

    return (
        <Layouts>
            <header className="mb-6 rounded-2xl border border-[var(--line)] bg-brand-50/60 px-6 py-8 text-center">
                <p className="font-arabic text-4xl text-ink">{surah.name}</p>
                <h1 className="mt-3 text-2xl font-semibold text-ink">
                    {getSurahName(surah, ui)}
                </h1>
                <p className="mt-1 text-sm text-muted">
                    {getSurahPrefix(ui)} · {surah.type} · {surah.ayas} ayah ·{" "}
                    {surah.rukus} ruku
                </p>
                <div className="mt-5 flex justify-center">
                    <TranslationPicker loading={translationLoading} />
                </div>
            </header>

            {showBismillah && (
                <div className="mb-6 text-center">
                    <p className="font-arabic text-2xl text-ink">
                        {bismillah.ar}
                    </p>
                    {bismillahTranslation && (
                        <p
                            className={`mt-2 text-sm text-muted ${
                                translation === "bn" ? "font-bangla" : ""
                            }`}
                        >
                            {bismillahTranslation}
                        </p>
                    )}
                </div>
            )}

            {loading ? (
                <p className="text-center text-muted">Loading…</p>
            ) : (
                <AyahList rows={rows} ui={ui} translation={translation} />
            )}

            <Actions />
        </Layouts>
    );
}
