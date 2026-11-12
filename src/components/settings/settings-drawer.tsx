import { useEffect } from "react";
import { SIZE_MAX, SIZE_MIN, useQuranStore, useUiLang, useUiStore } from "src/store";
import {
    ARABIC_FONTS,
    bismillah,
    THEMES,
    toLocaleDigits,
    TRANSLATIONS,
    VIEW_MODES,
} from "src/utils";
import { Drawer } from "src/components/common/drawer";
import { Segmented } from "src/components/ui/segmented";
import { CheckIcon, MinusIcon, PlusIcon } from "src/components/ui/icons";

const T = {
    bn: {
        title: "সেটিংস",
        preview: "প্রিভিউ",
        theme: "থিম",
        view: "পড়ার ধরন",
        translations: "অনুবাদ",
        translationsHint: "একাধিক বেছে নিতে পারেন। কোনোটি না বাছলে শুধু আরবি।",
        font: "আরবি ফন্ট",
        arabicSize: "আরবি লেখার আকার",
        translationSize: "অনুবাদের লেখার আকার",
        reset: "রিসেট",
        done: "সম্পন্ন",
    },
    en: {
        title: "Settings",
        preview: "Preview",
        theme: "Theme",
        view: "View",
        translations: "Translations",
        translationsHint: "Pick one or more. None shows Arabic only.",
        font: "Arabic font",
        arabicSize: "Arabic font size",
        translationSize: "Translation font size",
        reset: "Reset",
        done: "Done",
    },
};

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
    onChange,
    ui,
}: {
    label: string;
    value: number;
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
                    onClick={() => onChange(value - 1)}
                    disabled={value <= SIZE_MIN}
                    aria-label={`${label} −`}
                >
                    <MinusIcon size={16} />
                </button>
                <output
                    aria-live="polite"
                    className="w-8 text-center text-sm font-semibold tabular-nums text-ink"
                >
                    {toLocaleDigits(value, ui)}
                </output>
                <button
                    type="button"
                    className={button}
                    onClick={() => onChange(value + 1)}
                    disabled={value >= SIZE_MAX}
                    aria-label={`${label} +`}
                >
                    <PlusIcon size={16} />
                </button>
            </div>
        </div>
    );
}

/** Loads every Arabic font once the drawer opens, so the picker can show real samples. */
function usePreloadFonts(open: boolean) {
    useEffect(() => {
        if (!open) return;
        for (const font of ARABIC_FONTS) {
            const id = `arabic-font-${font.id}`;
            if (document.getElementById(id)) continue;
            const link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
            document.head.appendChild(link);
        }
    }, [open]);
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
        arabicFont: useQuranStore((st) => st.arabicFont),
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
                    <p dir="rtl" lang="ar" className="ayah-arabic mt-1 text-right text-ink">
                        {bismillah.ar}
                    </p>
                    {s.viewMode === "translation" &&
                        s.translations.map((id) => (
                            <p
                                key={id}
                                lang={id}
                                className={`ayah-translation mt-1 text-ink/85 ${
                                    id === "bn" ? "font-bangla" : ""
                                }`}
                            >
                                {bismillah[id]}
                            </p>
                        ))}
                </div>
            </div>

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

            {s.viewMode === "translation" && (
                <Section title={t.translations} hint={t.translationsHint}>
                    <div className="space-y-2">
                        {TRANSLATIONS.map((tr) => {
                            const on = s.translations.includes(tr.id);
                            return (
                                <label
                                    key={tr.id}
                                    className={`press flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ${
                                        on ? "bg-brand-50 ring-brand-600/30" : "ring-line hover:bg-panel"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={on}
                                        onChange={() => s.toggleTranslation(tr.id)}
                                        className="sr-only"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-5 w-5 items-center justify-center rounded-md ring-1 ${
                                            on ? "bg-brand-600 text-on-brand ring-brand-600" : "bg-surface ring-line"
                                        }`}
                                    >
                                        {on && <CheckIcon size={14} strokeWidth={2.5} />}
                                    </span>
                                    <span className={`text-sm font-medium text-ink ${tr.id === "bn" ? "font-bangla text-base" : ""}`}>
                                        {tr.name}
                                    </span>
                                    <span className="ml-auto text-xs text-muted">{tr.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </Section>
            )}

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

            <Section title={ui === "en" ? "Font size" : "লেখার আকার"}>
                <div className="space-y-3">
                    <Stepper label={t.arabicSize} value={s.arabicSize} onChange={s.setArabicSize} ui={ui} />
                    {s.viewMode === "translation" && (
                        <Stepper
                            label={t.translationSize}
                            value={s.translationSize}
                            onChange={s.setTranslationSize}
                            ui={ui}
                        />
                    )}
                </div>
            </Section>
        </Drawer>
    );
}
