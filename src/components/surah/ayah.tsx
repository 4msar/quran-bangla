import { Ayah, Language } from "src/types";
import { getRukuPrefix, hasSajdah } from "src/utils";

type AyahProps = {
    ayah: Ayah;
    lang: Language;
    isRukuStart: boolean;
    rukuNumber: number;
    totalRuku: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SingleAyah({
    isRukuStart,
    ayah,
    rukuNumber,
    totalRuku,
    lang,
}: AyahProps) {
    if (isRukuStart) console.log({ ayah, rukuNumber, isRukuStart });

    return (
        <>
            {totalRuku > 1 && isRukuStart && (
                <p className="text-center py-2 border-t border-b border-slate-500 my-2">
                    <span className="text-2xl">
                        {getRukuPrefix(lang)} {rukuNumber}
                    </span>
                </p>
            )}
            <p
                className={`flex text-md mb-2 ${
                    lang === "ar" ? "text-right flex-row-reverse" : "text-left"
                }`}
            >
                <span className="mr-2">({ayah.aya})</span>

                <span>{ayah.text}</span>

                {hasSajdah(ayah.sura, ayah.aya) && (
                    <span className="sajdah-icon">۩</span>
                )}
            </p>
        </>
    );
}
