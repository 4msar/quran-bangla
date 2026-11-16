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
    en,
}: {
    value: BackgroundKind;
    onChange: (kind: BackgroundKind) => void;
    onShuffle: () => void;
    photoStatus: PhotoStatus;
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
