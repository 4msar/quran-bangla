import type { RukuRange, UiLang } from "src/utils";
import { getRukuPrefix, toArabicDigits, toLocaleDigits } from "src/utils";

/**
 * The ruku sign printed in mushafs where a ruku ends: ع with the ruku's
 * number in its surah above it and its ayah count below.
 */
export function RukuEndMark({ ruku, ui }: { ruku: RukuRange; ui: UiLang }) {
    const ayahs = ruku.to.aya - ruku.from.aya + 1;
    const label =
        ui === "en"
            ? `End of ${getRukuPrefix(ui)} ${ruku.ruku} (${ayahs} ayahs)`
            : `${getRukuPrefix(ui)} ${toLocaleDigits(ruku.ruku, ui)} শেষ (${toLocaleDigits(ayahs, ui)} আয়াত)`;

    return (
        <span className="ruku-mark" role="img" aria-label={label} title={label}>
            <span className="ruku-mark-num">{toArabicDigits(ruku.ruku)}</span>
            <span className="ruku-mark-ain">ع</span>
            <span className="ruku-mark-num">{toArabicDigits(ayahs)}</span>
        </span>
    );
}
