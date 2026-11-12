import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    Actions,
    AyahList,
    Layouts,
    NavTabs,
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
                <NavTabs />
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
            <NavTabs />

            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
                <div>
                    <p className="text-xs font-bold text-green-600">
                        {surah.id.toString().padStart(3, "0")}
                    </p>
                    <h1 className="font-arabic text-3xl text-gray-900">
                        {surah.name}
                    </h1>
                    <h2 className="text-lg font-bold text-gray-700">
                        {getSurahPrefix(ui)} {getSurahName(surah, ui)}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {surah.type} · {surah.ayas} ayah · {surah.rukus} ruku
                    </p>
                </div>
                <TranslationPicker loading={translationLoading} />
            </header>

            {showBismillah && (
                <div className="mb-4 rounded-xl bg-white p-4 text-center shadow-sm">
                    <p className="font-arabic text-2xl text-gray-900">
                        {bismillah.ar}
                    </p>
                    {bismillahTranslation && (
                        <p
                            className={`mt-2 text-sm text-gray-600 ${
                                translation === "bn" ? "font-bangla" : ""
                            }`}
                        >
                            {bismillahTranslation}
                        </p>
                    )}
                </div>
            )}

            {loading ? (
                <p className="text-center text-gray-400">Loading…</p>
            ) : (
                <AyahList rows={rows} ui={ui} translation={translation} />
            )}

            <Actions />
        </Layouts>
    );
}
