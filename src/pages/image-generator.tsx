import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { Layouts } from "src/components";
import { Segmented } from "src/components/ui/segmented";
import { BackgroundPicker, ThemePicker } from "src/components/share/image-options";
import { downloadBlobUrl, useAyahImage, useBackgroundPhoto } from "src/components/share/image-tools";
import type { BackgroundKind } from "src/components/share/image-tools";
import { DEFAULT_PHOTO_OVERLAY, getImageTheme, IMAGE_SIZES } from "src/components/share/render-ayah-image";
import type { AyahImageInput, ImageOrientation } from "src/components/share/render-ayah-image";
import { useAyats } from "src/hooks/use-ayats";
import { usePageMeta } from "src/hooks/use-page-meta";
import { useQuranStore, useUiLang, useUiStore } from "src/store";
import type { Ayah } from "src/types";
import {
    getArabicFont,
    getAyahLabel,
    getSurah,
    getSurahName,
    getSurahPrefix,
    indexAyats,
    posKey,
    stripBismillah,
    SURAHS,
    toArabicDigits,
    toLocaleDigits,
} from "src/utils";

/** More than this and the text gets too small to read in one image. */
const MAX_AYAHS = 10;

type Lang = "ar" | "bn" | "en";
type Mode = "combined" | "separate";

const clampInt = (value: string | null, min: number, max: number, fallback: number) => {
    const n = Number(value);
    return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
};

const selectClass =
    "w-full appearance-none rounded-xl bg-panel px-3 py-2.5 text-sm text-ink ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand-600";

function Field({ label, en, children }: { label: string; en: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-wide text-muted ${en ? "" : "font-bangla text-sm normal-case tracking-normal"}`}>
                {label}
            </p>
            {children}
        </div>
    );
}

export function ImageGenerator() {
    const ui = useUiLang();
    const en = ui === "en";
    usePageMeta({
        title: en ? "Ayah Image Generator" : "আয়াতের ছবি তৈরি",
        description: en
            ? "Create shareable images of Quran ayahs with Arabic, Bangla and English translation, themes and photo backgrounds."
            : "আরবি, বাংলা ও ইংরেজি অনুবাদসহ কুরআনের আয়াতের সুন্দর ছবি তৈরি করুন — বিভিন্ন থিম ও ব্যাকগ্রাউন্ড ছবিসহ।",
    });
    const showToast = useUiStore((s) => s.showToast);
    const storeTranslations = useQuranStore((s) => s.translations);
    const arabicFont = useQuranStore((s) => s.arabicFont);
    const theme = useQuranStore((s) => s.imageTheme);
    const setTheme = useQuranStore((s) => s.setImageTheme);

    // Selection lives in the URL so a link can open a given passage.
    const [params, setParams] = useSearchParams();
    const sura = clampInt(params.get("surah"), 1, 114, 1);
    const surah = getSurah(sura)!;
    const from = clampInt(params.get("from"), 1, surah.ayas, 1);
    const to = clampInt(params.get("to"), from, Math.min(surah.ayas, from + MAX_AYAHS - 1), from);
    const setRange = (next: { surah?: number; from?: number; to?: number }) => {
        const p = new URLSearchParams();
        p.set("surah", String(next.surah ?? sura));
        p.set("from", String(next.from ?? from));
        p.set("to", String(next.to ?? to));
        setParams(p, { replace: true });
    };

    const [langs, setLangs] = useState<Lang[]>(() => ["ar", ...storeTranslations]);
    const toggleLang = (l: Lang) =>
        setLangs((cur) => {
            const next = cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l];
            return next.length ? (["ar", "bn", "en"] as Lang[]).filter((x) => next.includes(x)) : cur;
        });

    const [mode, setMode] = useState<Mode>("combined");
    const [orientation, setOrientation] = useState<ImageOrientation>("portrait");
    const [bgKind, setBgKind] = useState<BackgroundKind>("theme");
    const [sig, setSig] = useState(() => Math.floor(Math.random() * 1000));
    const [overlay, setOverlay] = useState(DEFAULT_PHOTO_OVERLAY);
    const { photo, status: photoStatus } = useBackgroundPhoto(bgKind === "photo", orientation, sig);

    const ar = useAyats(langs.includes("ar") ? "ar" : null);
    const bn = useAyats(langs.includes("bn") ? "bn" : null);
    const enTr = useAyats(langs.includes("en") ? "en" : null);
    const arIndex = useMemo(() => (ar ? indexAyats(ar) : null), [ar]);
    const bnIndex = useMemo(() => (bn ? indexAyats(bn) : null), [bn]);
    const enIndex = useMemo(() => (enTr ? indexAyats(enTr) : null), [enTr]);
    const ready =
        (!langs.includes("ar") || !!arIndex) &&
        (!langs.includes("bn") || !!bnIndex) &&
        (!langs.includes("en") || !!enIndex);

    const ayahNumbers = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const multiple = ayahNumbers.length > 1;
    const effectiveMode: Mode = multiple ? mode : "combined";

    const surahName = `${getSurahPrefix(ui)} ${getSurahName(surah, ui)}`;
    const refFor = (a: number, b = a) =>
        `${getAyahLabel(ui)} ${toLocaleDigits(sura, ui)}:${toLocaleDigits(a, ui)}${b > a ? `–${toLocaleDigits(b, ui)}` : ""}`;

    const photoPending = bgKind === "photo" && photoStatus === "loading";
    const bgKey = bgKind === "photo" ? `photo-${sig}-${photoStatus}-${overlay}` : "theme";
    const styleKey = `${orientation}:${getImageTheme(theme).id}:${bgKey}:${arabicFont}:${langs.join("")}`;

    /** Image input for ayahs `nums`; several are joined with ayah markers. */
    const buildInput = (nums: number[]): AyahImageInput | null => {
        if (!ready || photoPending) return null;
        const get = (index: Map<string, Ayah> | null, a: number) => index?.get(posKey(sura, a));
        const many = nums.length > 1;
        const arabic = langs.includes("ar")
            ? nums
                  .map((a) => {
                      const ayah = get(arIndex, a);
                      const text = ayah ? stripBismillah(ayah).text : "";
                      return many ? `${text} ﴿${toArabicDigits(a)}﴾` : text;
                  })
                  .join(" ")
            : null;
        const translations = (["bn", "en"] as const)
            .filter((l) => langs.includes(l))
            .map((l) => ({
                lang: l,
                text: nums
                    .map((a) => {
                        const text = get(l === "bn" ? bnIndex : enIndex, a)?.text ?? "";
                        return many ? `(${toLocaleDigits(a, l)}) ${text}` : text;
                    })
                    .join(" "),
            }));
        return {
            arabic,
            translations,
            surahName,
            reference: refFor(nums[0], nums[nums.length - 1]),
            arabicFamily: getArabicFont(arabicFont).family,
            orientation,
            theme: getImageTheme(theme).id,
            photo: bgKind === "photo" ? photo : null,
            photoOverlay: overlay,
        };
    };

    const cards =
        effectiveMode === "combined"
            ? [{ id: `${from}-${to}`, nums: ayahNumbers }]
            : ayahNumbers.map((a) => ({ id: String(a), nums: [a] }));

    const [rendered, setRendered] = useState<Record<string, { url: string; name: string } | undefined>>({});
    const downloadAll = () => {
        const list = cards.map((c) => rendered[`${c.id}:${styleKey}`]).filter(Boolean) as { url: string; name: string }[];
        list.forEach((r, i) => setTimeout(() => downloadBlobUrl(r.url, r.name), i * 300));
        if (list.length) showToast(en ? `${list.length} images downloaded` : `${toLocaleDigits(list.length, "bn")}টি ছবি ডাউনলোড হয়েছে`);
    };

    const ayahOptions = (min: number, max: number) =>
        Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
            <option key={n} value={n}>
                {toLocaleDigits(n, ui)}
            </option>
        ));

    const bnText = en ? "" : "font-bangla text-base";

    return (
        <Layouts wide>
            <h1 className={`mb-1 text-2xl font-semibold text-ink ${en ? "" : "font-bangla text-3xl"}`}>
                {en ? "Ayah image generator" : "আয়াতের ছবি তৈরি"}
            </h1>
            <p className={`mb-6 text-sm text-muted ${bnText}`}>
                {en
                    ? "Pick one or more ayahs, choose a theme or a photo background, and download."
                    : "এক বা একাধিক আয়াত বেছে নিন, থিম বা ব্যাকগ্রাউন্ড ছবি পছন্দ করুন, তারপর ডাউনলোড করুন।"}
            </p>

            <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
                {/* Controls */}
                <section className="space-y-5 rounded-3xl bg-surface p-5 shadow-card lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
                    <Field label={en ? "Surah" : "সূরা"} en={en}>
                        <select
                            aria-label={en ? "Surah" : "সূরা"}
                            value={sura}
                            onChange={(e) => setRange({ surah: Number(e.target.value), from: 1, to: 1 })}
                            className={`${selectClass} ${bnText}`}
                        >
                            {SURAHS.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {toLocaleDigits(s.id, ui)}. {getSurahName(s, ui)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label={en ? `Ayahs (up to ${MAX_AYAHS})` : `আয়াত (সর্বোচ্চ ${toLocaleDigits(MAX_AYAHS, "bn")}টি)`} en={en}>
                        <div className="flex items-center gap-2">
                            <select
                                aria-label={en ? "From ayah" : "শুরুর আয়াত"}
                                value={from}
                                onChange={(e) => {
                                    const f = Number(e.target.value);
                                    setRange({ from: f, to: Math.min(Math.max(to, f), f + MAX_AYAHS - 1) });
                                }}
                                className={`${selectClass} ${bnText}`}
                            >
                                {ayahOptions(1, surah.ayas)}
                            </select>
                            <span className={`text-sm text-muted ${bnText}`}>{en ? "to" : "থেকে"}</span>
                            <select
                                aria-label={en ? "To ayah" : "শেষ আয়াত"}
                                value={to}
                                onChange={(e) => setRange({ to: Number(e.target.value) })}
                                className={`${selectClass} ${bnText}`}
                            >
                                {ayahOptions(from, Math.min(surah.ayas, from + MAX_AYAHS - 1))}
                            </select>
                        </div>
                    </Field>

                    {multiple && (
                        <Field label={en ? "Output" : "ছবির সংখ্যা"} en={en}>
                            <Segmented
                                label={en ? "Output" : "ছবির সংখ্যা"}
                                value={mode}
                                onChange={setMode}
                                options={[
                                    { id: "combined", label: en ? "One image" : "একটি ছবি" },
                                    { id: "separate", label: en ? "One per ayah" : "প্রতি আয়াতে একটি" },
                                ]}
                            />
                        </Field>
                    )}

                    <Field label={en ? "Text" : "লেখা"} en={en}>
                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    ["ar", en ? "Arabic" : "আরবি"],
                                    ["bn", en ? "Bangla" : "বাংলা"],
                                    ["en", en ? "English" : "ইংরেজি"],
                                ] as [Lang, string][]
                            ).map(([id, label]) => {
                                const on = langs.includes(id);
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => toggleLang(id)}
                                        className={`press rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition-colors ${
                                            on ? "bg-brand-600 text-on-brand ring-brand-600" : "bg-panel text-ink ring-line hover:bg-brand-50"
                                        } ${bnText}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    <Field label={en ? "Layout" : "ছবির ধরন"} en={en}>
                        <Segmented
                            label={en ? "Image layout" : "ছবির ধরন"}
                            value={orientation}
                            onChange={setOrientation}
                            options={[
                                { id: "portrait", label: en ? "Portrait" : "লম্বা" },
                                { id: "landscape", label: en ? "Landscape" : "আড়াআড়ি" },
                            ]}
                        />
                    </Field>

                    <Field label={en ? "Theme" : "থিম"} en={en}>
                        <ThemePicker value={theme} onChange={setTheme} en={en} />
                    </Field>

                    <Field label={en ? "Background" : "ব্যাকগ্রাউন্ড"} en={en}>
                        <BackgroundPicker
                            value={bgKind}
                            onChange={setBgKind}
                            onShuffle={() => setSig((n) => n + 1)}
                            photoStatus={photoStatus}
                            overlay={overlay}
                            onOverlayChange={setOverlay}
                            en={en}
                        />
                    </Field>
                </section>

                {/* Previews */}
                <section className="space-y-4">
                    {cards.length > 1 && (
                        <div className="flex items-center justify-between gap-3">
                            <p className={`text-sm text-muted ${bnText}`}>
                                {en ? `${cards.length} images` : `${toLocaleDigits(cards.length, "bn")}টি ছবি`}
                            </p>
                            <motion.button
                                type="button"
                                onClick={downloadAll}
                                whileTap={{ scale: 0.97 }}
                                className={`rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-700 ${bnText}`}
                            >
                                {en ? "Download all" : "সব ডাউনলোড"}
                            </motion.button>
                        </div>
                    )}
                    <div
                        className={`grid gap-5 ${
                            cards.length > 1
                                ? orientation === "portrait"
                                    ? "sm:grid-cols-2 xl:grid-cols-3"
                                    : "xl:grid-cols-2"
                                : ""
                        }`}
                    >
                        <AnimatePresence initial={false} mode="popLayout">
                            {cards.map((c) => {
                                const renderKey = `${c.id}:${styleKey}`;
                                return (
                                    <PreviewCard
                                        key={c.id}
                                        renderKey={renderKey}
                                        input={buildInput(c.nums)}
                                        orientation={orientation}
                                        single={cards.length === 1}
                                        themeBg={getImageTheme(theme).palette.bg[1]}
                                        themeText={getImageTheme(theme).palette.muted}
                                        alt={`${surahName} ${refFor(c.nums[0], c.nums[c.nums.length - 1])}`}
                                        fileName={`quran-${sura}-${c.id}-${orientation}.png`}
                                        en={en}
                                        onReady={(url, name) =>
                                            setRendered((r) => (r[renderKey]?.url === url ? r : { ...r, [renderKey]: { url, name } }))
                                        }
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </Layouts>
    );
}

function PreviewCard({
    renderKey,
    input,
    orientation,
    single,
    themeBg,
    themeText,
    alt,
    fileName,
    en,
    onReady,
}: {
    renderKey: string;
    input: AyahImageInput | null;
    orientation: ImageOrientation;
    single: boolean;
    themeBg: string;
    themeText: string;
    alt: string;
    fileName: string;
    en: boolean;
    onReady: (url: string, name: string) => void;
}) {
    const showToast = useUiStore((s) => s.showToast);
    const { current, failed } = useAyahImage(input, renderKey);
    const { w, h } = IMAGE_SIZES[orientation];

    // Report the finished image so "Download all" can find it.
    const readyUrl = current?.url;
    useEffect(() => {
        if (readyUrl) onReady(readyUrl, fileName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readyUrl]);

    const download = () => {
        if (!current) return;
        downloadBlobUrl(current.url, fileName);
        showToast(en ? "Image downloaded" : "ছবি ডাউনলোড হয়েছে");
    };

    const file = current ? new File([current.blob], fileName, { type: "image/png" }) : null;
    const canShare = !!file && "canShare" in navigator && navigator.canShare({ files: [file] });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="space-y-3"
        >
            <div
                className="relative mx-auto overflow-hidden rounded-2xl shadow-float"
                style={{
                    background: themeBg,
                    aspectRatio: `${w} / ${h}`,
                    width: single && orientation === "portrait" ? "min(100%, 30rem)" : "100%",
                }}
            >
                <AnimatePresence initial={false}>
                    {current ? (
                        <motion.img
                            key={current.url}
                            src={current.url}
                            alt={alt}
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
                            style={{ color: themeText }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                        >
                            {failed
                                ? en ? "Could not create the image" : "ছবি তৈরি করা যায়নি"
                                : en ? "Creating image…" : "ছবি তৈরি হচ্ছে…"}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="mx-auto flex gap-2" style={{ maxWidth: single && orientation === "portrait" ? "30rem" : undefined }}>
                <motion.button
                    type="button"
                    onClick={download}
                    disabled={!current}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-brand hover:bg-brand-700 disabled:opacity-50 ${en ? "" : "font-bangla text-base"}`}
                >
                    {en ? "Download" : "ডাউনলোড"}
                </motion.button>
                {canShare && (
                    <motion.button
                        type="button"
                        onClick={() => navigator.share({ files: [file], title: alt }).catch(() => {})}
                        whileTap={{ scale: 0.97 }}
                        className={`flex-1 rounded-full bg-panel px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line hover:bg-brand-50 ${en ? "" : "font-bangla text-base"}`}
                    >
                        {en ? "Share" : "শেয়ার"}
                    </motion.button>
                )}
            </div>
            <p className="text-center text-[11px] text-muted tabular-nums">
                {w} × {h} PNG
            </p>
        </motion.div>
    );
}
