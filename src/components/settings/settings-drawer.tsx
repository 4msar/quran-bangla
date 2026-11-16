import { translationLang } from "src/utils/constants";
import { useEffect, useState } from "react";
import { ARABIC_SIZE, type SizeRange, TRANSLATION_SIZE, useQuranStore, useUiLang, useUiStore } from "src/store";
import {
    ARABIC_FONTS,
    BANGLA_FONTS,
    bismillah,
    ENGLISH_FONTS,
    isInstalledApp,
    loadGoogleFont,
    TextFont,
    THEMES,
    toLocaleDigits,
    TRANSLATIONS,
    VIEW_MODES,
} from "src/utils";
import { useOffline } from "src/hooks/use-offline";
import { Drawer } from "src/components/common/drawer";
import { Segmented } from "src/components/ui/segmented";
import { CheckIcon, MinusIcon, PlusIcon } from "src/components/ui/icons";

const T = {
    bn: {
        title: "সেটিংস",
        tabs: "সেটিংসের বিভাগ",
        tabGeneral: "সাধারণ",
        tabFonts: "ফন্ট",
        preview: "প্রিভিউ",
        theme: "থিম",
        view: "পড়ার ধরন",
        translations: "অনুবাদ",
        translationsHint: "একাধিক বেছে নিতে পারেন। কোনোটি না বাছলে শুধু আরবি।",
        translationsHintNoArabic: "আরবি বন্ধ থাকায় অন্তত একটি অনুবাদ চালু থাকবে।",
        translationsOffView: "অনুবাদ শুধু “অনুবাদ” পড়ার ধরনে দেখায়।",
        translationsTurnOn: "চালু করুন",
        arabicText: "আরবি লেখা",
        arabicTextHint: "বন্ধ করলে শুধু অনুবাদ দেখাবে।",
        showArabic: "আরবি দেখান",
        needTranslation: "আগে একটি অনুবাদ চালু করুন",
        font: "আরবি ফন্ট",
        banglaFont: "বাংলা ফন্ট",
        englishFont: "ইংরেজি ফন্ট",
        arabicSize: "আরবি লেখার আকার",
        translationSize: "অনুবাদের লেখার আকার",
        reset: "রিসেট",
        offline: "অফলাইন",
        offlineHint: "ইন্টারনেট ছাড়াও কুরআন পড়ুন। অ্যাপের ফাইল ও বেছে নেওয়া ফন্ট ডিভাইসে সংরক্ষিত থাকে।",
        offlineReady: "অফলাইনে ব্যবহারের জন্য প্রস্তুত",
        offlineNotReady: "ডাউনলোড চলছে বা এখনো শুরু হয়নি",
        offlineDownload: "ডাউনলোড / আপডেট",
        offlineDownloading: "ডাউনলোড হচ্ছে…",
        offlineReset: "মুছে নতুন করে ডাউনলোড",
        offlineResetting: "রিসেট হচ্ছে…",
        offlineDone: "ডাউনলোড সম্পন্ন হয়েছে।",
        offlineError: "সম্পূর্ণ হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।",
        done: "সম্পন্ন",
    },
    en: {
        title: "Settings",
        tabs: "Settings sections",
        tabGeneral: "General",
        tabFonts: "Fonts",
        preview: "Preview",
        theme: "Theme",
        view: "View",
        translations: "Translations",
        translationsHint: "Pick one or more. None shows Arabic only.",
        translationsHintNoArabic: "With Arabic hidden, at least one translation stays on.",
        translationsOffView: "Translations show only in the Translation view.",
        translationsTurnOn: "Turn on",
        arabicText: "Arabic text",
        arabicTextHint: "Turn off to read the translation only.",
        showArabic: "Show Arabic",
        needTranslation: "Turn on a translation first",
        font: "Arabic font",
        banglaFont: "Bangla font",
        englishFont: "English font",
        arabicSize: "Arabic font size",
        translationSize: "Translation font size",
        reset: "Reset",
        offline: "Offline",
        offlineHint: "Read without internet. App files and your chosen fonts are stored on this device.",
        offlineReady: "Ready for offline use",
        offlineNotReady: "Downloading, or not started yet",
        offlineDownload: "Download / update",
        offlineDownloading: "Downloading…",
        offlineReset: "Clear and re-download",
        offlineResetting: "Resetting…",
        offlineDone: "Download complete.",
        offlineError: "Not completed. Check your connection and try again.",
        done: "Done",
    },
};

const TRANSLATION_GROUPS = [
    { lang: "bn", label: "বাংলা" },
    { lang: "en", label: "English" },
] as const;

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3 px-5 py-4">
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {title}
                </h3>
                {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
            </div>
            {children}
        </section>
    );
}

function Stepper({
    label,
    value,
    range,
    onChange,
    ui,
}: {
    label: string;
    /** Size in px. */
    value: number;
    range: SizeRange;
    onChange: (v: number) => void;
    ui: "bn" | "en";
}) {
    const button =
        "press flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface disabled:opacity-35 disabled:hover:bg-transparent";
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-ink">{label}</span>
            <div className="flex items-center gap-1 rounded-full bg-panel p-1 ring-1 ring-line">
                <button
                    type="button"
                    className={button}
                    onClick={() => onChange(value - range.step)}
                    disabled={value <= range.min}
                    aria-label={`${label} −`}
                >
                    <MinusIcon size={16} />
                </button>
                <output
                    aria-live="polite"
                    className="w-14 text-center text-sm font-semibold tabular-nums text-ink"
                >
                    {toLocaleDigits(value, ui)}
                    <span className="ml-0.5 text-xs font-normal text-muted">px</span>
                </output>
                <button
                    type="button"
                    className={button}
                    onClick={() => onChange(value + range.step)}
                    disabled={value >= range.max}
                    aria-label={`${label} +`}
                >
                    <PlusIcon size={16} />
                </button>
            </div>
        </div>
    );
}

function Switch({
    label,
    checked,
    onChange,
    disabled,
    note,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
    note?: string;
}) {
    return (
        <label
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-line ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-panel"
            }`}
        >
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{label}</span>
                {note && <span className="block text-xs text-muted">{note}</span>}
            </span>
            <input
                type="checkbox"
                role="switch"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 ${
                    checked ? "bg-brand-600" : "bg-line"
                }`}
            >
                <span
                    className={`segment-thumb absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-card ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </span>
        </label>
    );
}

/** Loads every Arabic font once the drawer opens, so the picker can show real samples. */
function usePreloadFonts(open: boolean) {
    useEffect(() => {
        if (!open) return;
        for (const font of ARABIC_FONTS) loadGoogleFont("arabic", font);
        for (const font of BANGLA_FONTS) loadGoogleFont("bangla", font);
        for (const font of ENGLISH_FONTS) loadGoogleFont("english", font);
    }, [open]);
}

function OfflineSection({ t, ui }: { t: (typeof T)["bn"]; ui: "bn" | "en" }) {
    const { status, busy, error, done, progress, download, reset } = useOffline();
    const pct = Math.min(100, Math.round((progress.done / progress.total) * 100));
    if (!status.supported) return null;
    const mb = status.bytes != null ? ` · ${toLocaleDigits(Math.round(status.bytes / 1048576), ui)} MB` : "";
    const btn = "press flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 ring-line hover:bg-panel disabled:opacity-50";
    return (
        <Section title={t.offline} hint={t.offlineHint}>
            <p className="text-sm text-ink" role="status">
                <span
                    aria-hidden="true"
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${status.ready ? "bg-brand-600" : "bg-muted"}`}
                />
                {status.ready ? t.offlineReady : t.offlineNotReady}
                <span className="text-muted">{mb}</span>
            </p>
            {busy === "download" && (
                <div className="space-y-1">
                    <div
                        role="progressbar"
                        aria-label={t.offlineDownloading}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={pct}
                        className="h-2 overflow-hidden rounded-full bg-line"
                    >
                        <div
                            className="h-full rounded-full bg-brand-600 transition-[width] duration-200"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted">
                        {toLocaleDigits(pct, ui)}% · {toLocaleDigits(progress.done, ui)}/{toLocaleDigits(progress.total, ui)}
                    </p>
                </div>
            )}
            {done && busy === null && <p className="text-xs text-brand-700">{t.offlineDone}</p>}
            {error && <p className="text-xs text-red-600">{t.offlineError}</p>}
            <div className="flex gap-2">
                <button type="button" disabled={busy !== null} onClick={download} className={`${btn} bg-brand-50 text-brand-700`}>
                    {busy === "download" ? t.offlineDownloading : t.offlineDownload}
                </button>
                <button type="button" disabled={busy !== null} onClick={reset} className={`${btn} text-ink`}>
                    {busy === "reset" ? t.offlineResetting : t.offlineReset}
                </button>
            </div>
        </Section>
    );
}

function FontPicker({
    label,
    fonts,
    value,
    onChange,
    sample,
    lang,
}: {
    label: string;
    fonts: TextFont[];
    value: string;
    onChange: (id: string) => void;
    sample: string;
    lang: string;
}) {
    return (
        <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2">
            {fonts.map((font) => {
                const on = value === font.id;
                return (
                    <button
                        key={font.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => onChange(font.id)}
                        className={`press rounded-xl px-3 py-2.5 text-left ring-1 ${
                            on ? "bg-brand-50 ring-brand-600/40" : "ring-line hover:bg-panel"
                        }`}
                    >
                        <span
                            lang={lang}
                            className="block truncate text-base leading-[1.9] text-ink"
                            style={{ fontFamily: font.family }}
                        >
                            {sample}
                        </span>
                        <span className={`block text-xs font-semibold ${on ? "text-brand-700" : "text-ink"}`}>
                            {font.name}
                        </span>
                        <span className="block text-[11px] text-muted">{font.note}</span>
                    </button>
                );
            })}
        </div>
    );
}

export function SettingsDrawer() {
    const open = useUiStore((s) => s.settingsOpen);
    const setOpen = useUiStore((s) => s.setSettingsOpen);
    const ui = useUiLang();
    const t = T[ui];

    // One selector per field, so scrolling (which updates lastRead) does not re-render this.
    const s = {
        theme: useQuranStore((st) => st.theme),
        viewMode: useQuranStore((st) => st.viewMode),
        translations: useQuranStore((st) => st.translations),
        showArabic: useQuranStore((st) => st.showArabic),
        setShowArabic: useQuranStore((st) => st.setShowArabic),
        arabicFont: useQuranStore((st) => st.arabicFont),
        banglaFont: useQuranStore((st) => st.banglaFont),
        englishFont: useQuranStore((st) => st.englishFont),
        setBanglaFont: useQuranStore((st) => st.setBanglaFont),
        setEnglishFont: useQuranStore((st) => st.setEnglishFont),
        arabicSize: useQuranStore((st) => st.arabicSize),
        translationSize: useQuranStore((st) => st.translationSize),
        setTheme: useQuranStore((st) => st.setTheme),
        setViewMode: useQuranStore((st) => st.setViewMode),
        toggleTranslation: useQuranStore((st) => st.toggleTranslation),
        setArabicFont: useQuranStore((st) => st.setArabicFont),
        setArabicSize: useQuranStore((st) => st.setArabicSize),
        setTranslationSize: useQuranStore((st) => st.setTranslationSize),
        resetSettings: useQuranStore((st) => st.resetSettings),
    };
    usePreloadFonts(open);
    const [installed] = useState(isInstalledApp);
    const [tab, setTab] = useState<"general" | "translations" | "fonts">("general");

    const translationView = s.viewMode === "translation";
    const arabicVisible = !translationView || s.showArabic || s.translations.length === 0;
    // With Arabic hidden, the last selected translation cannot be turned off.
    const lockLastTranslation = translationView && !s.showArabic && s.translations.length === 1;

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            side="right"
            title={t.title}
            footer={
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={s.resetSettings}
                        className="press rounded-full px-4 py-2 text-sm font-medium text-muted hover:bg-panel hover:text-ink"
                    >
                        {t.reset}
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="press rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-on-brand hover:bg-brand-700"
                    >
                        {t.done}
                    </button>
                </div>
            }
        >
            {/* Live preview */}
            <div className="px-5 pt-4">
                <div className="rounded-2xl bg-panel p-4 ring-1 ring-line">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        {t.preview}
                    </p>
                    {arabicVisible && (
                        <p dir="rtl" lang="ar" className="ayah-arabic mt-1 text-right text-ink">
                            {bismillah.ar}
                        </p>
                    )}
                    {s.viewMode === "translation" &&
                        s.translations.map((id) => (
                            <p
                                key={id}
                                lang={translationLang(id)}
                                className={`ayah-translation mt-1 text-ink/85 ${
                                    translationLang(id) === "bn" ? "font-bangla" : ""
                                }`}
                            >
                                {bismillah[translationLang(id)]}
                            </p>
                        ))}
                </div>
            </div>

            <div className="px-5 pt-4">
                <Segmented
                    label={t.tabs}
                    value={tab}
                    onChange={setTab}
                    options={[
                        { id: "general", label: t.tabGeneral },
                        { id: "translations", label: t.translations },
                        { id: "fonts", label: t.tabFonts },
                    ]}
                />
            </div>

            {tab === "general" && (
                <>
                    <Section title={t.theme}>
                        <Segmented
                            label={t.theme}
                            value={s.theme}
                            onChange={s.setTheme}
                            options={THEMES.map((o) => ({ id: o.id, label: ui === "en" ? o.label : o.bn }))}
                        />
                    </Section>

                    <Section title={t.view}>
                        <Segmented
                            label={t.view}
                            value={s.viewMode}
                            onChange={s.setViewMode}
                            options={VIEW_MODES.map((o) => ({ id: o.id, label: ui === "en" ? o.label : o.bn }))}
                        />
                        <p className="text-xs text-muted">
                            {(() => {
                                const mode = VIEW_MODES.find((v) => v.id === s.viewMode);
                                return ui === "en" ? mode?.hint : mode?.bnHint;
                            })()}
                        </p>
                    </Section>

                    {translationView && (
                        <Section title={t.arabicText} hint={t.arabicTextHint}>
                            <Switch
                                label={t.showArabic}
                                checked={s.showArabic}
                                onChange={s.setShowArabic}
                                disabled={s.translations.length === 0}
                                note={s.translations.length === 0 ? t.needTranslation : undefined}
                            />
                        </Section>
                    )}

                    {open && installed && <OfflineSection t={t} ui={ui} />}
                </>
            )}

            {tab === "translations" && (
                <Section
                    title={t.translations}
                    hint={
                        !translationView
                            ? undefined
                            : s.showArabic
                              ? t.translationsHint
                              : t.translationsHintNoArabic
                    }
                >
                    {!translationView && (
                        <div className="flex items-center gap-3 rounded-xl bg-panel px-3 py-2.5 ring-1 ring-line">
                            <p className="flex-1 text-xs text-muted">{t.translationsOffView}</p>
                            <button
                                type="button"
                                onClick={() => s.setViewMode("translation")}
                                className="press shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-600/30"
                            >
                                {t.translationsTurnOn}
                            </button>
                        </div>
                    )}
                    <div
                        role="listbox"
                        aria-label={t.translations}
                        aria-multiselectable="true"
                        className="space-y-4"
                    >
                        {TRANSLATION_GROUPS.map((group) => (
                            <div
                                key={group.lang}
                                role="group"
                                aria-labelledby={`tr-group-${group.lang}`}
                                className="overflow-hidden rounded-xl ring-1 ring-line"
                            >
                                <div
                                    id={`tr-group-${group.lang}`}
                                    lang={group.lang}
                                    className={`bg-panel px-3 py-2 text-xs font-semibold text-muted ${
                                        group.lang === "bn" ? "font-bangla" : ""
                                    }`}
                                >
                                    {group.label}
                                </div>
                                {TRANSLATIONS.filter((tr) => tr.lang === group.lang).map((tr) => {
                                    const on = s.translations.includes(tr.id);
                                    const locked = on && lockLastTranslation;
                                    return (
                                        <button
                                            key={tr.id}
                                            type="button"
                                            role="option"
                                            aria-selected={on}
                                            aria-disabled={locked || undefined}
                                            onClick={() => !locked && s.toggleTranslation(tr.id)}
                                            className={`press flex w-full items-center gap-3 border-t border-line px-3 py-2.5 text-left ${
                                                locked ? "cursor-not-allowed" : "cursor-pointer"
                                            } ${on ? "bg-brand-50" : "hover:bg-panel"}`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 ${
                                                    on ? "bg-brand-600 text-on-brand ring-brand-600" : "bg-surface ring-line"
                                                }`}
                                            >
                                                {on && <CheckIcon size={14} strokeWidth={2.5} />}
                                            </span>
                                            <span
                                                lang={tr.lang}
                                                className={`text-sm font-medium ${on ? "text-brand-700" : "text-ink"} ${
                                                    tr.lang === "bn" ? "font-bangla text-base" : ""
                                                }`}
                                            >
                                                {tr.name}
                                            </span>
                                            <span className="ml-auto text-xs text-muted">{tr.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {tab === "fonts" && (
                <>
                    <Section title={t.font}>
                        <div role="radiogroup" aria-label={t.font} className="grid grid-cols-2 gap-2">
                            {ARABIC_FONTS.map((font) => {
                                const on = s.arabicFont === font.id;
                                return (
                                    <button
                                        key={font.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={on}
                                        onClick={() => s.setArabicFont(font.id)}
                                        className={`press rounded-xl px-3 py-2.5 text-left ring-1 ${
                                            on ? "bg-brand-50 ring-brand-600/40" : "ring-line hover:bg-panel"
                                        }`}
                                    >
                                        <span
                                            dir="rtl"
                                            lang="ar"
                                            className="block text-right text-2xl leading-[1.9] text-ink"
                                            style={{ fontFamily: font.family }}
                                        >
                                            بِسْمِ اللَّهِ
                                        </span>
                                        <span className={`block text-xs font-semibold ${on ? "text-brand-700" : "text-ink"}`}>
                                            {font.name}
                                        </span>
                                        <span className="block text-[11px] text-muted">{font.note}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    {translationView && s.translations.some((id) => translationLang(id) === "bn") && (
                        <Section title={t.banglaFont}>
                            <FontPicker
                                label={t.banglaFont}
                                fonts={BANGLA_FONTS}
                                value={s.banglaFont}
                                onChange={s.setBanglaFont}
                                sample="বিসমিল্লাহির রাহমানির রাহিম"
                                lang="bn"
                            />
                        </Section>
                    )}

                    {translationView && s.translations.some((id) => translationLang(id) === "en") && (
                        <Section title={t.englishFont}>
                            <FontPicker
                                label={t.englishFont}
                                fonts={ENGLISH_FONTS}
                                value={s.englishFont}
                                onChange={s.setEnglishFont}
                                sample="In the name of God"
                                lang="en"
                            />
                        </Section>
                    )}

                    <Section title={ui === "en" ? "Font size" : "লেখার আকার"}>
                        <div className="space-y-3">
                            <Stepper label={t.arabicSize} value={s.arabicSize} range={ARABIC_SIZE} onChange={s.setArabicSize} ui={ui} />
                            {s.viewMode === "translation" && (
                                <Stepper
                                    label={t.translationSize}
                                    value={s.translationSize}
                                    range={TRANSLATION_SIZE}
                                    onChange={s.setTranslationSize}
                                    ui={ui}
                                />
                            )}
                        </div>
                    </Section>
                </>
            )}
        </Drawer>
    );
}
