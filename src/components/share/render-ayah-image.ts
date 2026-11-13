/**
 * Draws an ayah card on a <canvas>: green background, thin double border,
 * Arabic in the middle, a separator, the translation(s), then surah · ayah.
 */
export type ImageOrientation = "portrait" | "landscape";

export type AyahImageInput = {
    arabic: string | null;
    translations: { lang: "bn" | "en"; text: string }[];
    /** e.g. "সূরাহ আল ফাতিহা" */
    surahName: string;
    /** e.g. "আয়াত ১:২" */
    reference: string;
    /** CSS font-family for Arabic (the reader's chosen font). */
    arabicFamily: string;
    orientation: ImageOrientation;
};

export const IMAGE_SIZES: Record<ImageOrientation, { w: number; h: number }> = {
    landscape: { w: 1200, h: 630 },
    portrait: { w: 1080, h: 1350 },
};

const BANGLA_FAMILY = '"Kalpurush", "Noto Sans Bengali", sans-serif';
const LATIN_FAMILY = 'Inter, ui-sans-serif, system-ui, sans-serif';

const WHITE = "#ffffff";
const SOFT = "rgba(255,255,255,0.88)";
const GOLD = "#e6c675";
const GOLD_SOFT = "rgba(230,198,117,0.55)";

const familyFor = (lang: "bn" | "en") => (lang === "bn" ? BANGLA_FAMILY : LATIN_FAMILY);

/** Make sure the web fonts are ready; canvas silently falls back otherwise. */
export async function loadImageFonts(input: AyahImageInput) {
    if (!("fonts" in document)) return;
    const jobs: Promise<unknown>[] = [document.fonts.load(`600 24px ${LATIN_FAMILY}`)];
    if (input.arabic) jobs.push(document.fonts.load(`48px ${input.arabicFamily}`, input.arabic));
    if (input.translations.some((t) => t.lang === "bn") || /[ঀ-৿]/.test(input.surahName)) {
        jobs.push(document.fonts.load(`32px ${BANGLA_FAMILY}`, "অআ"));
    }
    await Promise.allSettled(jobs);
}

/** Greedy word wrap. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.trim().split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > maxWidth) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    }
    if (line) lines.push(line);
    return lines;
}

type Block = {
    font: (size: number) => string;
    text: string;
    size: number;
    lineHeight: number;
    color: string;
    dir: CanvasDirection;
    lines: string[];
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/** Eight-point star (two overlapping squares). */
function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    for (const rot of [0, Math.PI / 4]) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
        ctx.restore();
    }
}

function background(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, "#1f7a55");
    g.addColorStop(0.55, "#145c3f");
    g.addColorStop(1, "#0b3a28");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Faint star lattice.
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    const step = 72;
    for (let y = step / 2; y < h; y += step) {
        for (let x = (Math.round(y / step) % 2 ? step : step / 2); x < w; x += step) {
            star(ctx, x, y, 9);
        }
    }

    // Border: an outer gold line and a thin inner one.
    const m = Math.round(Math.min(w, h) * 0.035);
    ctx.strokeStyle = GOLD_SOFT;
    ctx.lineWidth = 2;
    roundRect(ctx, m, m, w - m * 2, h - m * 2, 22);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    roundRect(ctx, m + 9, m + 9, w - (m + 9) * 2, h - (m + 9) * 2, 16);
    ctx.stroke();

    // Corner stars.
    ctx.fillStyle = GOLD;
    for (const [x, y] of [[m, m], [w - m, m], [m, h - m], [w - m, h - m]]) star(ctx, x, y, 8);
    return m;
}

function separator(ctx: CanvasRenderingContext2D, cx: number, y: number, half: number) {
    ctx.strokeStyle = GOLD_SOFT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx - 18, y);
    ctx.moveTo(cx + 18, y);
    ctx.lineTo(cx + half, y);
    ctx.stroke();
    ctx.fillStyle = GOLD;
    star(ctx, cx, y, 7);
}

export async function renderAyahImage(input: AyahImageInput): Promise<HTMLCanvasElement> {
    await loadImageFonts(input);

    const { w, h } = IMAGE_SIZES[input.orientation];
    const portrait = input.orientation === "portrait";
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported");

    const m = background(ctx, w, h);

    // Footer: surah name · ayah, then the site.
    const footerH = portrait ? 150 : 104;
    const top = m + (portrait ? 70 : 44);
    const bottom = h - m - footerH;
    const maxWidth = w - (m + (portrait ? 70 : 64)) * 2;
    const gap = portrait ? 56 : 36; // around the separator

    // Base sizes, shrunk together until everything fits.
    const base = portrait ? { ar: 64, tr: 36 } : { ar: 50, tr: 28 };
    const blocks: Block[] = [];
    if (input.arabic) {
        blocks.push({
            font: (s) => `${s}px ${input.arabicFamily}`,
            text: input.arabic,
            size: base.ar,
            lineHeight: 1.85,
            color: WHITE,
            dir: "rtl",
            lines: [],
        });
    }
    for (const t of input.translations) {
        blocks.push({
            font: (s) => `${s}px ${familyFor(t.lang)}`,
            text: t.text,
            size: input.arabic ? base.tr : base.tr * 1.25,
            lineHeight: t.lang === "bn" ? 1.65 : 1.55,
            color: input.arabic ? SOFT : WHITE,
            dir: "ltr",
            lines: [],
        });
    }

    const measure = (scale: number) => {
        let total = 0;
        blocks.forEach((b, i) => {
            const size = b.size * scale;
            ctx.font = b.font(size);
            ctx.direction = b.dir;
            b.lines = wrap(ctx, b.text, maxWidth);
            total += b.lines.length * size * b.lineHeight;
            if (i > 0) total += i === 1 && input.arabic ? gap * 2 : gap * 0.6;
        });
        return total;
    };

    let scale = 1;
    let total = measure(scale);
    // Grow short ayahs a little, shrink long ones until they fit.
    while (total < (bottom - top) * 0.78 && scale < 1.8) total = measure((scale += 0.04));
    while (total > bottom - top && scale > 0.3) total = measure((scale -= 0.04));

    let y = top + Math.max(0, (bottom - top - total) / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 6;

    blocks.forEach((b, i) => {
        if (i > 0) {
            if (i === 1 && input.arabic) {
                ctx.shadowBlur = 0;
                separator(ctx, w / 2, y + gap, Math.min(160, maxWidth / 4));
                ctx.shadowBlur = 6;
                y += gap * 2;
            } else {
                y += gap * 0.6;
            }
        }
        const size = b.size * scale;
        const lh = size * b.lineHeight;
        ctx.font = b.font(size);
        ctx.direction = b.dir;
        ctx.fillStyle = b.color;
        for (const line of b.lines) {
            ctx.fillText(line, w / 2, y + lh / 2);
            y += lh;
        }
    });
    ctx.shadowBlur = 0;
    ctx.direction = "ltr";

    // Footer
    const fy = h - m - footerH;
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - maxWidth * 0.3, fy + 6);
    ctx.lineTo(w / 2 + maxWidth * 0.3, fy + 6);
    ctx.stroke();

    const nameSize = portrait ? 34 : 26;
    const bnName = /[ঀ-৿]/.test(input.surahName + input.reference);
    ctx.font = `600 ${nameSize}px ${bnName ? BANGLA_FAMILY : LATIN_FAMILY}`;
    ctx.fillStyle = GOLD;
    ctx.fillText(`${input.surahName}  ·  ${input.reference}`, w / 2, fy + footerH * 0.42);

    ctx.font = `500 ${portrait ? 22 : 17}px ${LATIN_FAMILY}`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("quran.msar.me", w / 2, fy + footerH * 0.75);

    return canvas;
}

export const canvasToBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png")
    );
