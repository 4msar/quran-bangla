import { useState } from "react";
import { motion } from "motion/react";
import { Segmented } from "src/components/ui/segmented";
import { getImageTheme, IMAGE_THEMES } from "./render-ayah-image";
import type { ImageThemeId } from "./render-ayah-image";
import type { BackgroundKind, PhotoStatus } from "./image-tools";

/** Row of round swatches, one per image theme. */
export function ThemePicker({
    value,
    onChange,
    en,
}: {
    value: string;
    onChange: (id: ImageThemeId) => void;
    en: boolean;
}) {
    const active = getImageTheme(value).id;
    return (
        <div role="radiogroup" aria-label={en ? "Image theme" : "ছবির থিম"} className="flex flex-wrap gap-3">
            {IMAGE_THEMES.map((t) => {
                const on = t.id === active;
                return (
                    <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => onChange(t.id)}
                        className="press group flex flex-col items-center gap-1"
                    >
                        <span
                            className={`relative block h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${
                                on ? "ring-brand-600" : "ring-transparent group-hover:ring-line"
                            }`}
                            style={{
                                background: `radial-gradient(circle at 50% 40%, ${t.palette.bg[0]}, ${t.palette.bg[2]})`,
                            }}
                        >
                            <span
                                className="absolute inset-[30%] rotate-45 rounded-[2px]"
                                style={{ background: t.palette.accent }}
                            />
                        </span>
                        <span className={`text-[11px] ${on ? "font-semibold text-brand-700" : "text-muted"} ${en ? "" : "font-bangla text-xs"}`}>
                            {en ? t.label : t.bn}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/** Theme colour vs. a random mosque photo, with a button for another photo. */
export function BackgroundPicker({
    value,
    onChange,
    onShuffle,
    photoStatus,
    overlay,
    onOverlayChange,
    en,
}: {
    value: BackgroundKind;
    onChange: (kind: BackgroundKind) => void;
    onShuffle: () => void;
    photoStatus: PhotoStatus;
    /** Darkness of the veil over the photo, 0..0.9. */
    overlay: number;
    onOverlayChange: (overlay: number) => void;
    en: boolean;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Segmented
                    label={en ? "Background" : "ব্যাকগ্রাউন্ড"}
                    value={value}
                    onChange={onChange}
                    className="flex-1"
                    options={[
                        { id: "theme", label: en ? "Theme colour" : "থিমের রং" },
                        { id: "photo", label: en ? "Photo" : "ছবি" },
                    ]}
                />
                {value === "photo" && (
                    <motion.button
                        type="button"
                        onClick={onShuffle}
                        disabled={photoStatus === "loading"}
                        whileTap={{ scale: 0.94 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`shrink-0 rounded-full bg-panel px-3 py-2 text-sm font-medium text-ink ring-1 ring-line hover:bg-brand-50 disabled:opacity-50 ${en ? "" : "font-bangla"}`}
                    >
                        {en ? "Another photo" : "অন্য ছবি"}
                    </motion.button>
                )}
            </div>
            {value === "photo" && (
                <OverlaySlider value={overlay} onCommit={onOverlayChange} en={en} />
            )}
            {value === "photo" && photoStatus === "error" && (
                <p className={`text-xs text-red-600 ${en ? "" : "font-bangla text-sm"}`}>
                    {en
                        ? "Couldn't load a background photo, using the theme colour instead."
                        : "ব্যাকগ্রাউন্ড ছবি আনা যায়নি, থিমের রং ব্যবহার করা হচ্ছে।"}
                </p>
            )}
        </div>
    );
}

/** Range input that shows its value live but only re-renders the image on release. */
function OverlaySlider({ value, onCommit, en }: { value: number; onCommit: (v: number) => void; en: boolean }) {
    const [draft, setDraft] = useState<number | null>(null);
    const shown = draft ?? value;
    const commit = () => {
        if (draft !== null && draft !== value) onCommit(draft);
        setDraft(null);
    };
    const label = en ? "Overlay opacity" : "ওভারলে অস্বচ্ছতা";
    return (
        <label className="flex items-center gap-3 pt-1">
            <span className={`shrink-0 text-sm text-muted ${en ? "" : "font-bangla"}`}>{label}</span>
            <input
                type="range"
                aria-label={label}
                min={0}
                max={90}
                step={5}
                value={Math.round(shown * 100)}
                onChange={(e) => setDraft(Number(e.target.value) / 100)}
                onPointerUp={commit}
                onKeyUp={commit}
                onBlur={commit}
                className="h-1.5 flex-1 cursor-pointer accent-brand-600"
            />
            <span className="w-10 shrink-0 text-right text-sm tabular-nums text-ink">
                {en ? Math.round(shown * 100) : Math.round(shown * 100).toLocaleString("bn-BD")}%
            </span>
        </label>
    );
}

/** On/off switch for printing the site address on the image. */
export function SiteHostSwitch({ checked, onChange, en }: { checked: boolean; onChange: (v: boolean) => void; en: boolean }) {
    const label = en ? "Show site address" : "সাইটের ঠিকানা দেখান";
    return (
        <div className="flex items-center justify-between gap-3">
            <span className={`text-sm text-ink ${en ? "" : "font-bangla text-base"}`}>{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    checked ? "bg-brand-600" : "bg-panel ring-1 ring-line"
                }`}
            >
                <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
}
