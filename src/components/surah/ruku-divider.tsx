import type { RukuRange, UiLang } from "src/utils";
import { getRukuPrefix, toLocaleDigits } from "src/utils";

/**
 * Separator at the start of each ruku. Its id is the anchor that ruku
 * links (`/2#ruku-3`) scroll to. Static: it never animates.
 */
export function RukuDivider({ ruku, ui }: { ruku: RukuRange; ui: UiLang }) {
    const range =
        ruku.from.aya === ruku.to.aya
            ? toLocaleDigits(ruku.from.aya, ui)
            : `${toLocaleDigits(ruku.from.aya, ui)}–${toLocaleDigits(ruku.to.aya, ui)}`;

    return (
        <div
            id={`ruku-${ruku.id}`}
            role="separator"
            aria-label={`${getRukuPrefix(ui)} ${ruku.ruku}`}
            className="flex scroll-mt-32 items-center gap-3 py-6"
        >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-100" />
            <span className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 ring-1 ring-brand-600/20">
                <span aria-hidden="true" className="text-[10px] text-brand-600">
                    ◆
                </span>
                <span className="text-xs font-semibold tracking-wide text-brand-700">
                    {getRukuPrefix(ui)} {toLocaleDigits(ruku.ruku, ui)}
                </span>
                <span className="text-[11px] text-muted">
                    · {ui === "en" ? "Ayah" : "আয়াত"} {range}
                </span>
                <span aria-hidden="true" className="text-[10px] text-brand-600">
                    ◆
                </span>
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-100" />
        </div>
    );
}
