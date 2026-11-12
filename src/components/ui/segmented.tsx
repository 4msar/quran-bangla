type Option<T extends string> = { id: T; label: string };

type SegmentedProps<T extends string> = {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    label: string;
    size?: "sm" | "md";
    className?: string;
};

/** Pill-style segmented control; the thumb slides to the selected option. */
export function Segmented<T extends string>({
    options,
    value,
    onChange,
    label,
    size = "md",
    className = "",
}: SegmentedProps<T>) {
    const index = Math.max(
        0,
        options.findIndex((o) => o.id === value)
    );

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={`relative grid rounded-full bg-panel p-1 ring-1 ring-line ${className}`}
            style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
        >
            <span
                aria-hidden="true"
                className="segment-thumb absolute inset-y-1 left-1 rounded-full bg-surface shadow-card"
                style={{
                    width: `calc((100% - 0.5rem) / ${options.length})`,
                    transform: `translateX(${index * 100}%)`,
                }}
            />
            {options.map((option) => {
                const active = option.id === value;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(option.id)}
                        className={`relative z-10 rounded-full font-medium transition-colors ${
                            size === "sm"
                                ? "px-2.5 py-1 text-xs"
                                : "px-3 py-1.5 text-sm"
                        } ${active ? "text-brand-700" : "text-muted hover:text-ink"}`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
