import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "src/components/common/drawer";
import { Segmented } from "src/components/ui/segmented";
import { useAyats } from "src/hooks/use-ayats";
import { useQuranStore, useUiLang, useUiStore } from "src/store";
import {
    getArabicFont,
    getAyahLabel,
    getSurah,
    getSurahName,
    getSurahPrefix,
    indexAyats,
    posKey,
    stripBismillah,
    toLocaleDigits,
} from "src/utils";
import type { Position } from "src/utils";
import { canvasToBlob, IMAGE_SIZES, renderAyahImage } from "./render-ayah-image";
import type { ImageOrientation } from "./render-ayah-image";

/** "Share as image": live preview, portrait / landscape, download or share. */
export function ShareImageDialog() {
    const pos = useUiStore((s) => s.shareImage);
    const close = useUiStore((s) => s.closeShareImage);
    const ui = useUiLang();

    return (
        <Drawer
            open={pos !== null}
            onClose={close}
            side="right"
            title={ui === "en" ? "Share as image" : "ছবি হিসেবে শেয়ার"}
        >
            {pos && <ShareImageBody key={posKey(pos.sura, pos.aya)} pos={pos} />}
        </Drawer>
    );
}

function ShareImageBody({ pos }: { pos: Position }) {
    const ui = useUiLang();
    const en = ui === "en";
    const showToast = useUiStore((s) => s.showToast);
    const viewMode = useQuranStore((s) => s.viewMode);
    const translations = useQuranStore((s) => s.translations);
    const showArabicSetting = useQuranStore((s) => s.showArabic);
    const arabicFont = useQuranStore((s) => s.arabicFont);
    const [orientation, setOrientation] = useState<ImageOrientation>("portrait");

    // Same content the reader shows for this ayah.
    const shown = viewMode === "quran" ? [] : translations;
    const showArabic = viewMode === "quran" || showArabicSetting || shown.length === 0;

    const ar = useAyats(showArabic ? "ar" : null);
    const bn = useAyats(shown.includes("bn") ? "bn" : null);
    const enTr = useAyats(shown.includes("en") ? "en" : null);
    const key = posKey(pos.sura, pos.aya);
    const arText = useMemo(() => {
        const a = ar ? indexAyats(ar).get(key) : undefined;
        return a ? stripBismillah(a).text : null;
    }, [ar, key]);
    const bnText = useMemo(() => (bn ? indexAyats(bn).get(key)?.text ?? null : null), [bn, key]);
    const enText = useMemo(() => (enTr ? indexAyats(enTr).get(key)?.text ?? null : null), [enTr, key]);

    const ready =
        (!showArabic || arText !== null) &&
        (!shown.includes("bn") || bnText !== null) &&
        (!shown.includes("en") || enText !== null);

    const surah = getSurah(pos.sura);
    const surahName = surah ? `${getSurahPrefix(ui)} ${getSurahName(surah, ui)}` : "";
    const reference = `${getAyahLabel(ui)} ${toLocaleDigits(pos.sura, ui)}:${toLocaleDigits(pos.aya, ui)}`;
    const fileName = `quran-${pos.sura}-${pos.aya}-${orientation}.png`;

    const [image, setImage] = useState<{ url: string; blob: Blob; for: string } | null>(null);
    const [failed, setFailed] = useState(false);
    const renderKey = `${key}:${orientation}`;

    useEffect(() => {
        if (!ready) return;
        let active = true;
        let url: string | null = null;
        const trs: { lang: "bn" | "en"; text: string }[] = [];
        if (bnText && shown.includes("bn")) trs.push({ lang: "bn", text: bnText });
        if (enText && shown.includes("en")) trs.push({ lang: "en", text: enText });

        renderAyahImage({
            arabic: showArabic ? arText : null,
            translations: trs,
            surahName,
            reference,
            arabicFamily: getArabicFont(arabicFont).family,
            orientation,
        })
            .then(canvasToBlob)
            .then((blob) => {
                if (!active) return;
                url = URL.createObjectURL(blob);
                setImage({ url, blob, for: renderKey });
                setFailed(false);
            })
            .catch(() => active && setFailed(true));

        return () => {
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
        // shown is derived from the store; its contents are captured by the texts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, arText, bnText, enText, orientation, arabicFont, surahName, reference]);

    const current = image?.for === renderKey ? image : null;

    const download = () => {
        if (!current) return;
        const a = document.createElement("a");
        a.href = current.url;
        a.download = fileName;
        document.body.append(a);
        a.click();
        a.remove();
        showToast(en ? "Image downloaded" : "ছবি ডাউনলোড হয়েছে");
    };

    const file = current ? new File([current.blob], fileName, { type: "image/png" }) : null;
    const canShareFile =
        !!file && typeof navigator !== "undefined" && "canShare" in navigator && navigator.canShare({ files: [file] });

    const share = () => {
        if (!file) return;
        navigator
            .share({ files: [file], title: `${surahName} ${reference}` })
            .catch(() => {});
    };

    const { w, h } = IMAGE_SIZES[orientation];

    return (
        <div className="space-y-4 px-5 py-4">
            <Segmented
                label={en ? "Image layout" : "ছবির ধরন"}
                value={orientation}
                onChange={setOrientation}
                options={[
                    { id: "portrait", label: en ? "Portrait" : "লম্বা" },
                    { id: "landscape", label: en ? "Landscape" : "আড়াআড়ি" },
                ]}
            />

            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="relative mx-auto overflow-hidden rounded-xl bg-[#145c3f] shadow-float"
                style={{
                    aspectRatio: `${w} / ${h}`,
                    width: orientation === "portrait" ? "min(100%, 22rem)" : "100%",
                }}
            >
                <AnimatePresence initial={false}>
                    {current ? (
                        <motion.img
                            key={current.url}
                            src={current.url}
                            alt={`${surahName} ${reference}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 h-full w-full"
                        />
                    ) : (
                        <motion.div
                            key="loading"
                            className="absolute inset-0 flex items-center justify-center text-sm text-white/70"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                        >
                            {failed
                                ? en ? "Could not create the image" : "ছবি তৈরি করা যায়নি"
                                : en ? "Creating image…" : "ছবি তৈরি হচ্ছে…"}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <p className="text-center text-[11px] text-muted tabular-nums">
                {w} × {h} PNG
            </p>

            <div className="flex gap-2">
                <motion.button
                    type="button"
                    onClick={download}
                    disabled={!current}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-brand hover:bg-brand-700 disabled:opacity-50 ${en ? "" : "font-bangla text-base"}`}
                >
                    {en ? "Download image" : "ছবি ডাউনলোড"}
                </motion.button>
                {canShareFile && (
                    <motion.button
                        type="button"
                        onClick={share}
                        whileTap={{ scale: 0.97 }}
                        className={`flex-1 rounded-full bg-panel px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line hover:bg-brand-50 ${en ? "" : "font-bangla text-base"}`}
                    >
                        {en ? "Share" : "শেয়ার"}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
