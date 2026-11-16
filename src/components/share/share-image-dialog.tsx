import type { Ayah, TranslationId } from "src/types";
import { translationLang } from "src/utils/constants";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { Drawer } from "src/components/common/drawer";
import { Segmented } from "src/components/ui/segmented";
import { useAyats, useAyatsMap } from "src/hooks/use-ayats";
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
import { DEFAULT_PHOTO_OVERLAY, getImageTheme, IMAGE_SIZES } from "./render-ayah-image";
import type { ImageOrientation } from "./render-ayah-image";
import { BackgroundPicker, SiteHostSwitch, ThemePicker } from "./image-options";
import { downloadBlobUrl, useAyahImage, useBackgroundPhoto } from "./image-tools";
import type { BackgroundKind } from "./image-tools";

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
    const theme = useQuranStore((s) => s.imageTheme);
    const setTheme = useQuranStore((s) => s.setImageTheme);
    const closeDialog = useUiStore((s) => s.closeShareImage);
    const [bgKind, setBgKind] = useState<BackgroundKind>("theme");
    const [sig, setSig] = useState(() => Math.floor(Math.random() * 1000));
    const [overlay, setOverlay] = useState(DEFAULT_PHOTO_OVERLAY);
    const [showHost, setShowHost] = useState(true);
    const { photo, status: photoStatus } = useBackgroundPhoto(bgKind === "photo", orientation, sig);

    // Same content the reader shows for this ayah.
    const shown = viewMode === "quran" ? [] : translations;
    const showArabic = viewMode === "quran" || showArabicSetting || shown.length === 0;

    const ar = useAyats(showArabic ? "ar" : null);
    const lists = useAyatsMap(shown);
    const indexes = useMemo(() => {
        const out: Partial<Record<TranslationId, Map<string, Ayah>>> = {};
        for (const [id, list] of Object.entries(lists) as [TranslationId, Ayah[]][]) out[id] = indexAyats(list);
        return out;
    }, [lists]);
    const key = posKey(pos.sura, pos.aya);
    const arText = useMemo(() => {
        const a = ar ? indexAyats(ar).get(key) : undefined;
        return a ? stripBismillah(a).text : null;
    }, [ar, key]);
    const trTexts = shown.flatMap((id) => {
        const text = indexes[id]?.get(key)?.text;
        return text ? [{ lang: translationLang(id), text }] : [];
    });
    const trKey = trTexts.map((t) => `${t.lang}:${t.text}`).join("|");

    const ready = (!showArabic || arText !== null) && shown.every((id) => lists[id] !== undefined);

    const surah = getSurah(pos.sura);
    const surahName = surah ? `${getSurahPrefix(ui)} ${getSurahName(surah, ui)}` : "";
    const reference = `${getAyahLabel(ui)} ${toLocaleDigits(pos.sura, ui)}:${toLocaleDigits(pos.aya, ui)}`;
    const fileName = `quran-${pos.sura}-${pos.aya}-${orientation}.png`;

    const bgKey = bgKind === "photo" ? `photo-${sig}-${photoStatus}-${overlay}` : "theme";
    const renderKey = `${key}:${orientation}:${theme}:${bgKey}:${arabicFont}:${showHost}`;
    const photoPending = bgKind === "photo" && photoStatus === "loading";

    const input = useMemo(() => {
        if (!ready || photoPending) return null;
        return {
            arabic: showArabic ? arText : null,
            translations: trTexts,
            surahName,
            reference,
            arabicFamily: getArabicFont(arabicFont).family,
            orientation,
            theme: getImageTheme(theme).id,
            photo: bgKind === "photo" ? photo : null,
            photoOverlay: overlay,
            showSiteHost: showHost,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, photoPending, renderKey, arText, trKey]);

    const { current, failed } = useAyahImage(input, renderKey);

    const download = () => {
        if (!current) return;
        downloadBlobUrl(current.url, fileName);
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

            <ThemePicker value={theme} onChange={setTheme} en={en} />

            <BackgroundPicker
                value={bgKind}
                onChange={setBgKind}
                onShuffle={() => setSig((n) => n + 1)}
                photoStatus={photoStatus}
                overlay={overlay}
                onOverlayChange={setOverlay}
                en={en}
            />

            <SiteHostSwitch checked={showHost} onChange={setShowHost} en={en} />

            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="relative mx-auto overflow-hidden rounded-xl shadow-float"
                style={{
                    background: getImageTheme(theme).palette.bg[1],
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
                            className="absolute inset-0 flex items-center justify-center text-sm"
                            style={{ color: getImageTheme(theme).palette.muted }}
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

            <Link
                to={`/image-generator?surah=${pos.sura}&from=${pos.aya}`}
                onClick={closeDialog}
                className={`block text-center text-sm font-medium text-brand-700 hover:underline ${en ? "" : "font-bangla text-base"}`}
            >
                {en ? "Make an image with more ayahs →" : "একাধিক আয়াত দিয়ে ছবি বানান →"}
            </Link>
        </div>
    );
}
