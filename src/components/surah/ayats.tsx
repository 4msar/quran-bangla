import { useQuranStore } from "src/store";
import { Surah } from "src/types";
import {
    bismillah,
    getAyahBySurah,
    getLanguageName,
    getRukuBySurah,
    getSurahPrefix,
} from "src/utils";
import { SingleAyah } from "./ayah";
import { LANGS } from "src/utils";
import { useCallback, useMemo, useState } from "react";

export function SurahAyah({ surah }: { surah: Surah }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const lang = useQuranStore((state) => state.lang);
    const setLang = useQuranStore((state) => state.setLang);
    const ayahs = useMemo(() => {
        return getAyahBySurah(surah.id, lang);
    }, [surah.id, lang]);

    const subName = useMemo(() => {
        switch (lang) {
            case "bn":
                return surah.bname;

            case "en":
                return surah.ename;

            default:
                return surah.tname;
        }
    }, [lang, surah]);

    const rukus = useMemo(() => {
        return getRukuBySurah(surah.id);
    }, [surah]);

    const getRukuNumber = useCallback(
        (ayah: number) => {
            const ruku = rukus.find(
                (item) => item.aya === ayah && item.sura === surah.id
            );
            return ruku ? ruku.ruku : 0;
        },
        [rukus, surah]
    );

    const isRukuStart = useCallback(
        (ayah: number) => {
            return (
                rukus.find(
                    (item) => item.aya === ayah && item.sura === surah.id
                ) !== undefined
            );
        },
        [rukus, surah]
    );

    console.log({ rukus });

    const isRtl = lang === "ar";

    return (
        <article
            className={`flex-auto prose px-4 py-2 ${
                isRtl ? "font-arabic" : "font-bangla"
            }`}
        >
            <div
                className={`flex justify-between ${
                    isRtl ? "flex-row-reverse" : ""
                }`}
            >
                <div className="meta">
                    <h1 className="text-3xl">{surah.name}</h1>
                    <h2 className="text-2xl">
                        {getSurahPrefix(lang)} {subName}
                    </h2>
                </div>

                <div className="lang relative">
                    <button
                        onClick={() => setShowDropDown(!showDropDown)}
                        className="border px-3 py-1 bg-gray-200 rounded"
                    >
                        {getLanguageName(lang)}
                    </button>

                    <ul
                        className={`dropdown absolute top-10 bg-white rounded ${
                            isRtl ? "left-6" : "right-6"
                        } w-36 h-auto ${showDropDown ? "block" : "hidden"}`}
                    >
                        {LANGS.map((item) => (
                            <li key={item.id} className="border-b w-full px-2">
                                <button
                                    onClick={() => {
                                        setLang(item.id);
                                        setShowDropDown(false);
                                    }}
                                    className="w-full pl-4 text-left py-2"
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <h5 className={`text-md ${isRtl ? "text-right" : ""}`}>
                {bismillah[lang]}
            </h5>

            <hr className="py-2" />

            {ayahs.map((ayah) => (
                <SingleAyah
                    ayah={ayah}
                    lang={lang}
                    key={ayah.id}
                    totalRuku={rukus.length}
                    rukuNumber={getRukuNumber(ayah.aya)}
                    isRukuStart={isRukuStart(ayah.aya)}
                />
            ))}
        </article>
    );
}
