/**
 * Draws an ayah card on a <canvas>: themed (or photo) background with a motif and frame,
 * Arabic in the middle, a separator, the translation(s), then surah · ayah.
 */
export type ImageOrientation = "portrait" | "landscape";

export type ImageThemeId =
    | "emerald"
    | "midnight"
    | "turquoise"
    | "maroon"
    | "royal"
    | "ocean"
    | "olive"
    | "rose"
    | "charcoal"
    | "parchment"
    | "ivory"
    | "dawn";

/** Background ornament drawn behind the text. */
type Motif = "stars" | "girih" | "dots" | "waves" | "rays" | "lattice";
/** Border style. */
export type ImageFrameId =
    | "double"
    | "single"
    | "corners"
    | "arch"
    | "band"
    | "dotted"
    | "scallop"
    | "diamonds"
    | "rounded"
    | "ornate"
    | "floral"
    | "vine"
    | "filigree"
    | "medallion"
    | "none";
/** A frame choice; "auto" uses the theme's own border. */
export type ImageFrameChoice = ImageFrameId | "auto";

type Palette = {
    /** Radial gradient stops, centre → edge. */
    bg: [string, string, string];
    /** Colour of the background motif. */
    pattern: string;
    text: string;
    soft: string;
    accent: string;
    accentSoft: string;
    innerBorder: string;
    muted: string;
    rule: string;
    shadow: string;
    motif: Motif;
    /** The theme's default border, used when the frame is "auto". */
    frame: ImageFrameId;
};

export const IMAGE_THEMES: { id: ImageThemeId; label: string; bn: string; palette: Palette }[] = [
    {
        id: "emerald",
        label: "Emerald",
        bn: "সবুজ",
        palette: {
            bg: ["#1f7a55", "#145c3f", "#0b3a28"],
            pattern: "rgba(255,255,255,0.035)",
            text: "#ffffff",
            soft: "rgba(255,255,255,0.88)",
            accent: "#e6c675",
            accentSoft: "rgba(230,198,117,0.55)",
            innerBorder: "rgba(255,255,255,0.18)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.25)",
            motif: "stars",
            frame: "double",
        },
    },
    {
        id: "midnight",
        label: "Midnight",
        bn: "রাত",
        palette: {
            bg: ["#24365f", "#152342", "#0a1226"],
            pattern: "rgba(255,255,255,0.5)",
            text: "#ffffff",
            soft: "rgba(232,238,255,0.86)",
            accent: "#e9c46a",
            accentSoft: "rgba(233,196,106,0.5)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "dots",
            frame: "arch",
        },
    },
    {
        id: "turquoise",
        label: "Turquoise",
        bn: "ফিরোজা",
        palette: {
            bg: ["#1b8a8f", "#0f6468", "#073c40"],
            pattern: "rgba(255,255,255,0.045)",
            text: "#ffffff",
            soft: "rgba(255,255,255,0.88)",
            accent: "#f2d58a",
            accentSoft: "rgba(242,213,138,0.55)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "girih",
            frame: "arch",
        },
    },
    {
        id: "maroon",
        label: "Maroon",
        bn: "মেরুন",
        palette: {
            bg: ["#7a2335", "#5a1626", "#350b15"],
            pattern: "rgba(255,255,255,0.045)",
            text: "#ffffff",
            soft: "rgba(255,240,240,0.88)",
            accent: "#f0cf86",
            accentSoft: "rgba(240,207,134,0.5)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "girih",
            frame: "corners",
        },
    },
    {
        id: "royal",
        label: "Royal",
        bn: "বেগুনি",
        palette: {
            bg: ["#5b3a8c", "#3f2566", "#23123d"],
            pattern: "rgba(255,255,255,0.035)",
            text: "#ffffff",
            soft: "rgba(255,255,255,0.88)",
            accent: "#e8c56f",
            accentSoft: "rgba(232,197,111,0.5)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "rays",
            frame: "corners",
        },
    },
    {
        id: "ocean",
        label: "Ocean",
        bn: "সমুদ্র",
        palette: {
            bg: ["#1d5f99", "#134473", "#0a2747"],
            pattern: "rgba(255,255,255,0.045)",
            text: "#ffffff",
            soft: "rgba(232,244,255,0.88)",
            accent: "#f0d38a",
            accentSoft: "rgba(240,211,138,0.5)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "waves",
            frame: "band",
        },
    },
    {
        id: "olive",
        label: "Olive",
        bn: "জলপাই",
        palette: {
            bg: ["#6b7a3a", "#4f5c28", "#2f3815"],
            pattern: "rgba(255,255,255,0.04)",
            text: "#ffffff",
            soft: "rgba(255,255,255,0.88)",
            accent: "#f0d58c",
            accentSoft: "rgba(240,213,140,0.55)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "stars",
            frame: "band",
        },
    },
    {
        id: "rose",
        label: "Rose",
        bn: "গোলাপি",
        palette: {
            bg: ["#b56576", "#8c4a5a", "#5a2a37"],
            pattern: "rgba(255,255,255,0.045)",
            text: "#ffffff",
            soft: "rgba(255,244,240,0.9)",
            accent: "#ffe0b5",
            accentSoft: "rgba(255,224,181,0.55)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "lattice",
            frame: "arch",
        },
    },
    {
        id: "charcoal",
        label: "Charcoal",
        bn: "কালো",
        palette: {
            bg: ["#2e2e30", "#1e1e20", "#111112"],
            pattern: "rgba(255,255,255,0.04)",
            text: "#ffffff",
            soft: "rgba(255,255,255,0.84)",
            accent: "#d9b56a",
            accentSoft: "rgba(217,181,106,0.5)",
            innerBorder: "rgba(255,255,255,0.16)",
            muted: "rgba(255,255,255,0.55)",
            rule: "rgba(255,255,255,0.14)",
            shadow: "rgba(0,0,0,0.3)",
            motif: "waves",
            frame: "single",
        },
    },
    {
        id: "parchment",
        label: "Parchment",
        bn: "কাগজ",
        palette: {
            bg: ["#fbf3df", "#f3e6c6", "#e6d3a6"],
            pattern: "rgba(120,80,20,0.07)",
            text: "#2b1d0e",
            soft: "rgba(60,40,18,0.85)",
            accent: "#9a6a1f",
            accentSoft: "rgba(154,106,31,0.5)",
            innerBorder: "rgba(120,80,20,0.22)",
            muted: "rgba(60,40,18,0.55)",
            rule: "rgba(120,80,20,0.2)",
            shadow: "rgba(0,0,0,0)",
            motif: "lattice",
            frame: "band",
        },
    },
    {
        id: "ivory",
        label: "Ivory",
        bn: "সাদা",
        palette: {
            bg: ["#ffffff", "#f6f3ec", "#e9e3d4"],
            pattern: "rgba(47,122,88,0.08)",
            text: "#1f2a24",
            soft: "rgba(31,42,36,0.82)",
            accent: "#2f7a58",
            accentSoft: "rgba(47,122,88,0.45)",
            innerBorder: "rgba(47,122,88,0.22)",
            muted: "rgba(31,42,36,0.5)",
            rule: "rgba(47,122,88,0.2)",
            shadow: "rgba(0,0,0,0)",
            motif: "girih",
            frame: "single",
        },
    },
    {
        id: "dawn",
        label: "Dawn",
        bn: "ভোর",
        palette: {
            bg: ["#f3f9fd", "#dcebf6", "#bcd6ea"],
            pattern: "rgba(255,255,255,0.45)",
            text: "#0f2a40",
            soft: "rgba(15,42,64,0.82)",
            accent: "#a8741f",
            accentSoft: "rgba(168,116,31,0.5)",
            innerBorder: "rgba(15,42,64,0.18)",
            muted: "rgba(15,42,64,0.5)",
            rule: "rgba(15,42,64,0.16)",
            shadow: "rgba(0,0,0,0)",
            motif: "rays",
            frame: "double",
        },
    },
];

export const DEFAULT_IMAGE_THEME: ImageThemeId = "emerald";

export const IMAGE_FRAMES: { id: ImageFrameChoice; label: string; bn: string }[] = [
    { id: "auto", label: "Theme default", bn: "থিম অনুযায়ী" },
    { id: "double", label: "Double", bn: "দ্বিগুণ" },
    { id: "single", label: "Single", bn: "একক" },
    { id: "corners", label: "Corners", bn: "কোণা" },
    { id: "arch", label: "Arch", bn: "খিলান" },
    { id: "band", label: "Band", bn: "পাড়" },
    { id: "dotted", label: "Dotted", bn: "বিন্দু" },
    { id: "scallop", label: "Scallop", bn: "ঢেউ" },
    { id: "diamonds", label: "Diamonds", bn: "হীরা" },
    { id: "rounded", label: "Rounded", bn: "গোলাকার" },
    { id: "ornate", label: "Ornate", bn: "নকশা" },
    { id: "floral", label: "Floral", bn: "ফুল" },
    { id: "vine", label: "Vine", bn: "লতা" },
    { id: "filigree", label: "Filigree", bn: "জালি" },
    { id: "medallion", label: "Medallion", bn: "মেডেলিয়ন" },
    { id: "none", label: "None", bn: "নেই" },
];

export const DEFAULT_IMAGE_FRAME: ImageFrameChoice = "auto";

export const getImageFrame = (id: string) => IMAGE_FRAMES.find((f) => f.id === id) ?? IMAGE_FRAMES[0];

export const getImageTheme = (id: string) => IMAGE_THEMES.find((t) => t.id === id) ?? IMAGE_THEMES[0];

const searchQueries = [
    "islam",
    "quran",
    "mosque",
    "islamic",
    "islamic architecture",
    "islamic pattern",
    "islamic art",
    "islamic calligraphy",
    "islamic geometric pattern",
    "islamic design",
    "islamic ornament",
    "islamic tilework",
    "islamic arabesque",
    "islamic minaret",
    "islamic dome",
    "islamic mosque interior",
    "islamic mosque exterior",
    "islamic mosque courtyard",
    "islamic mosque prayer hall",
    "islamic mosque minbar",
    "islamic mosque mihrab",
    "islamic mosque minaret silhouette",
];

/** Query picked from `sig` so the URL stays stable across renders (a random pick refetched every render). */
const queryFor = (sig: number) => encodeURIComponent(searchQueries[Math.abs(sig) % searchQueries.length]);

/** Random mosque photo for the background; `sig` picks a different one. */
export const backgroundPhotoUrl = (orientation: ImageOrientation, sig: number) =>
    `https://image.msar.me/unsplash/random?query=${queryFor(sig)}&orientation=${orientation}&size=regular&sig=${sig}`;

/**
 * Loads a background photo with CORS so the canvas can still be exported.
 * Rejects if the host does not allow cross-origin use.
 */
export function loadBackgroundPhoto(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not load the background image"));
        img.src = url;
    });
}

export type AyahImageInput = {
    arabic: string | null;
    translations: { lang: "bn" | "en"; text: string }[];
    /** e.g. "সূরাহ আল ফাতিহা" */
    surahName: string;
    /** e.g. "আয়াত ১:২" */
    reference: string;
    /** CSS font-family for Arabic (the reader's chosen font). */
    arabicFamily: string;
    /** CSS font-family for Bangla translation text (the reader's chosen font). */
    banglaFamily?: string;
    /** CSS font-family for English translation text (the reader's chosen font). */
    englishFamily?: string;
    orientation: ImageOrientation;
    theme?: ImageThemeId;
    /** Border style; "auto" (default) uses the theme's own. */
    frame?: ImageFrameChoice;
    /** Photo drawn under a dark veil; text then uses light colours with the theme accent. */
    photo?: HTMLImageElement | null;
    /** How dark the veil over the photo is, 0 (none) to 0.9. Defaults to 0.5. */
    photoOverlay?: number;
    /** Print the site address under the surah reference. Defaults to true. */
    showSiteHost?: boolean;
};

export const DEFAULT_PHOTO_OVERLAY = 0.5;

export const IMAGE_SIZES: Record<ImageOrientation, { w: number; h: number }> = {
    landscape: { w: 1200, h: 630 },
    portrait: { w: 1080, h: 1350 },
};

const BANGLA_FAMILY = '"Kalpurush", "Noto Sans Bengali", sans-serif';
const LATIN_FAMILY = "Inter, ui-sans-serif, system-ui, sans-serif";

/** Light-on-dark palette used over a photo, keeping the theme's accent. */
function photoPalette(base: Palette): Palette {
    const darkTheme = base.text === "#ffffff";
    return {
        ...base,
        text: "#ffffff",
        soft: "rgba(255,255,255,0.9)",
        accent: darkTheme ? base.accent : "#ecd08a",
        accentSoft: darkTheme ? base.accentSoft : "rgba(236,208,138,0.6)",
        innerBorder: "rgba(255,255,255,0.22)",
        muted: "rgba(255,255,255,0.7)",
        rule: "rgba(255,255,255,0.2)",
        shadow: "rgba(0,0,0,0.55)",
    };
}

const familyFor = (input: AyahImageInput, lang: "bn" | "en") =>
    lang === "bn" ? (input.banglaFamily ?? BANGLA_FAMILY) : (input.englishFamily ?? LATIN_FAMILY);

/** Make sure the web fonts are ready; canvas silently falls back otherwise. */
export async function loadImageFonts(input: AyahImageInput) {
    if (!("fonts" in document)) return;
    const jobs: Promise<unknown>[] = [document.fonts.load(`600 24px ${LATIN_FAMILY}`)];
    if (input.arabic) jobs.push(document.fonts.load(`48px ${input.arabicFamily}`, input.arabic));
    if (input.translations.some((t) => t.lang === "bn") || /[ঀ-৿]/.test(input.surahName)) {
        jobs.push(document.fonts.load(`32px ${BANGLA_FAMILY}`, "অআ"));
    }
    for (const t of input.translations) {
        const family = familyFor(input, t.lang);
        jobs.push(document.fonts.load(`32px ${family}`, t.text.slice(0, 40)));
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

function drawPhoto(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
    tint: string,
    overlay: number,
) {
    // object-fit: cover
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);

    // Darken (tinted toward the theme) so text stays readable.
    ctx.fillStyle = `rgba(0,0,0,${overlay})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = overlay * 0.5;
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${overlay * 0.9})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
}

/** Eight-point star outline (16 vertices). */
function octagram(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.moveTo(cx + r, cy);
    for (let i = 1; i <= 16; i++) {
        const rr = i % 2 ? r * 0.72 : r;
        const a = (i * Math.PI) / 8;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
}

/** Small deterministic PRNG so the "dots" sky looks the same every render. */
function seeded(seed: number) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

function drawMotif(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
    ctx.save();
    ctx.fillStyle = p.pattern;
    ctx.strokeStyle = p.pattern;
    ctx.lineWidth = 1.5;
    switch (p.motif) {
        case "stars": {
            const step = 72;
            for (let y = step / 2; y < h; y += step) {
                for (let x = Math.round(y / step) % 2 ? step : step / 2; x < w; x += step) star(ctx, x, y, 9);
            }
            break;
        }
        case "girih": {
            // Octagram tiling joined by small squares.
            const step = 96;
            ctx.beginPath();
            for (let y = 0; y <= h + step; y += step) {
                for (let x = 0; x <= w + step; x += step) {
                    octagram(ctx, x, y, step * 0.36);
                    const cx = x + step / 2;
                    const cy = y + step / 2;
                    const q = step * 0.14;
                    ctx.moveTo(cx, cy - q);
                    ctx.lineTo(cx + q, cy);
                    ctx.lineTo(cx, cy + q);
                    ctx.lineTo(cx - q, cy);
                    ctx.closePath();
                }
            }
            ctx.stroke();
            break;
        }
        case "dots": {
            // A quiet starry sky, denser toward the top.
            const rand = seeded(7);
            const count = Math.round((w * h) / 2600);
            for (let i = 0; i < count; i++) {
                const x = rand() * w;
                const y = Math.pow(rand(), 1.6) * h;
                const r = rand() < 0.08 ? 2.2 : rand() * 1.2 + 0.4;
                ctx.globalAlpha = 0.25 + rand() * 0.6 * (1 - y / h);
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            break;
        }
        case "waves": {
            // Overlapping scales.
            const r = 34;
            ctx.beginPath();
            for (let row = 0, y = 0; y < h + r; row++, y += r * 0.75) {
                for (let x = row % 2 ? r : 0; x < w + r * 2; x += r * 2) {
                    ctx.moveTo(x + r, y);
                    ctx.arc(x, y, r, 0, Math.PI);
                }
            }
            ctx.stroke();
            break;
        }
        case "rays": {
            // Sunburst from just above the centre.
            const cx = w / 2;
            const cy = h * 0.42;
            const len = Math.hypot(w, h);
            const n = 36;
            for (let i = 0; i < n; i++) {
                const a0 = (i / n) * Math.PI * 2;
                const a1 = a0 + Math.PI / n;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(a0) * len, cy + Math.sin(a0) * len);
                ctx.lineTo(cx + Math.cos(a1) * len, cy + Math.sin(a1) * len);
                ctx.closePath();
                ctx.fill();
            }
            // Fade the rays out at the centre so the text stays clean.
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
            g.addColorStop(0, p.bg[0]);
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            break;
        }
        case "lattice": {
            // Diamond trellis with a dot at each crossing.
            const step = 56;
            ctx.beginPath();
            for (let d = -h; d < w + h; d += step) {
                ctx.moveTo(d, 0);
                ctx.lineTo(d + h, h);
                ctx.moveTo(d, h);
                ctx.lineTo(d + h, 0);
            }
            ctx.stroke();
            for (let y = 0; y <= h; y += step) {
                for (let x = (y / step) % 2 ? step / 2 : 0; x <= w; x += step) {
                    ctx.beginPath();
                    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        }
    }
    ctx.restore();
}

/** Pointed (mihrab) arch outline inside the margin; returns the shoulder height. */
function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const rise = Math.min(w * 0.32, h * 0.22);
    const shoulder = y + rise;
    const cx = x + w / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, shoulder);
    ctx.bezierCurveTo(x, y + rise * 0.35, cx - w * 0.18, y + rise * 0.12, cx, y);
    ctx.bezierCurveTo(cx + w * 0.18, y + rise * 0.12, x + w, y + rise * 0.35, x + w, shoulder);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    return rise;
}

/** Pointed leaf / petal from the origin along +x, `len` long and `wid` wide. */
function petal(ctx: CanvasRenderingContext2D, len: number, wid: number) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -wid, len, 0);
    ctx.quadraticCurveTo(len * 0.5, wid, 0, 0);
    ctx.closePath();
}

/** Runs `draw` at each corner with the axes turned so +x and +y point into the card. */
function atCorners(
    ctx: CanvasRenderingContext2D,
    corners: [number, number][],
    m: number,
    draw: () => void,
) {
    for (const [x, y] of corners) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(x === m ? 1 : -1, y === m ? 1 : -1);
        draw();
        ctx.restore();
    }
}

/** Draws the background and frame; returns the margin and extra top space the frame needs. */
function background(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    p: Palette,
    photo: HTMLImageElement | null | undefined,
    overlay: number,
    frame: ImageFrameId,
) {
    if (photo) {
        drawPhoto(ctx, photo, w, h, p.bg[2], overlay);
    } else {
        const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
        g.addColorStop(0, p.bg[0]);
        g.addColorStop(0.55, p.bg[1]);
        g.addColorStop(1, p.bg[2]);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        drawMotif(ctx, w, h, p);
    }

    const m = Math.round(Math.min(w, h) * 0.035);
    let topExtra = 0;
    const corners: [number, number][] = [
        [m, m],
        [w - m, m],
        [m, h - m],
        [w - m, h - m],
    ];

    switch (frame) {
        case "double": {
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 2;
            roundRect(ctx, m, m, w - m * 2, h - m * 2, 22);
            ctx.stroke();
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            roundRect(ctx, m + 9, m + 9, w - (m + 9) * 2, h - (m + 9) * 2, 16);
            ctx.stroke();
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x, y, 8);
            break;
        }
        case "single": {
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            // Small diamonds at the middle of each edge.
            ctx.fillStyle = p.accent;
            for (const [x, y] of [
                [w / 2, m],
                [w / 2, h - m],
                [m, h / 2],
                [w - m, h / 2],
            ]) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-5, -5, 10, 10);
                ctx.restore();
            }
            break;
        }
        case "corners": {
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2);
            // L-shaped brackets with a star at each corner.
            const len = Math.min(w, h) * 0.12;
            ctx.strokeStyle = p.accent;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            for (const [x, y] of corners) {
                const sx = x === m ? 1 : -1;
                const sy = y === m ? 1 : -1;
                ctx.beginPath();
                ctx.moveTo(x + sx * len, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y + sy * len);
                ctx.stroke();
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x + sx * len * 0.6, y + sy * 8);
                ctx.lineTo(x + sx * 8, y + sy * 8);
                ctx.lineTo(x + sx * 8, y + sy * len * 0.6);
                ctx.stroke();
                ctx.lineWidth = 3;
            }
            ctx.lineCap = "butt";
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x, y, 6);
            break;
        }
        case "arch": {
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            const inset = m + 14;
            const rise = archPath(ctx, inset, inset, w - inset * 2, h - inset * 2);
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 2;
            ctx.stroke();
            archPath(ctx, inset + 8, inset + 8, w - (inset + 8) * 2, h - (inset + 8) * 2);
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = p.accent;
            star(ctx, w / 2, inset, 8);
            for (const [x, y] of corners) star(ctx, x, y, 5);
            topExtra = rise * 0.55;
            break;
        }
        case "band": {
            // Wide translucent band with a fine line either side and stars along it.
            const bw = 12;
            ctx.strokeStyle = p.accentSoft;
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = bw;
            ctx.strokeRect(m + bw / 2, m + bw / 2, w - m * 2 - bw, h - m * 2 - bw);
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = p.accent;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            ctx.strokeRect(m + bw, m + bw, w - (m + bw) * 2, h - (m + bw) * 2);
            ctx.fillStyle = p.accent;
            const c = m + bw / 2;
            const gap = 64;
            for (let x = c + gap; x < w - c - gap / 2; x += gap) {
                star(ctx, x, c, 3.5);
                star(ctx, x, h - c, 3.5);
            }
            for (let y = c + gap; y < h - c - gap / 2; y += gap) {
                star(ctx, c, y, 3.5);
                star(ctx, w - c, y, 3.5);
            }
            for (const [x, y] of [
                [c, c],
                [w - c, c],
                [c, h - c],
                [w - c, h - c],
            ])
                star(ctx, x, y, 7);
            break;
        }
        case "dotted": {
            // Evenly spaced dots along the edge, a thin line inside, stars at the corners.
            ctx.fillStyle = p.accentSoft;
            const step = 16;
            const edges: [number, number, number, number][] = [
                [m, m, w - m, m],
                [w - m, m, w - m, h - m],
                [w - m, h - m, m, h - m],
                [m, h - m, m, m],
            ];
            for (const [x1, y1, x2, y2] of edges) {
                const len = Math.hypot(x2 - x1, y2 - y1);
                const n = Math.round(len / step);
                for (let i = 1; i < n; i++) {
                    ctx.beginPath();
                    ctx.arc(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, 2.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m + 12, m + 12, w - (m + 12) * 2, h - (m + 12) * 2);
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x, y, 7);
            break;
        }
        case "scallop": {
            // Row of half-circles facing outward, like a scalloped edge.
            const r = 10;
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const nx = Math.max(1, Math.round((w - m * 2) / (r * 2)));
            const ny = Math.max(1, Math.round((h - m * 2) / (r * 2)));
            const sx = (w - m * 2) / nx;
            const sy = (h - m * 2) / ny;
            for (let i = 0; i < nx; i++) {
                const cx = m + sx * (i + 0.5);
                ctx.moveTo(cx - sx / 2, m);
                ctx.arc(cx, m, sx / 2, Math.PI, 0);
                ctx.moveTo(cx + sx / 2, h - m);
                ctx.arc(cx, h - m, sx / 2, 0, Math.PI);
            }
            for (let i = 0; i < ny; i++) {
                const cy = m + sy * (i + 0.5);
                ctx.moveTo(m, cy + sy / 2);
                ctx.arc(m, cy, sy / 2, Math.PI / 2, (Math.PI * 3) / 2);
                ctx.moveTo(w - m, cy - sy / 2);
                ctx.arc(w - m, cy, sy / 2, -Math.PI / 2, Math.PI / 2);
            }
            ctx.stroke();
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            ctx.strokeRect(m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2);
            break;
        }
        case "diamonds": {
            // Chain of small diamonds between two fine lines.
            const bw = 14;
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            ctx.strokeRect(m + bw, m + bw, w - (m + bw) * 2, h - (m + bw) * 2);
            const c = m + bw / 2;
            const step = 22;
            const d = 4.5;
            const diamond = (x: number, y: number, on: boolean) => {
                ctx.beginPath();
                ctx.moveTo(x, y - d);
                ctx.lineTo(x + d, y);
                ctx.lineTo(x, y + d);
                ctx.lineTo(x - d, y);
                ctx.closePath();
                if (on) ctx.fill();
                else ctx.stroke();
            };
            ctx.fillStyle = p.accent;
            ctx.strokeStyle = p.accentSoft;
            const nx = Math.round((w - c * 2) / step);
            const ny = Math.round((h - c * 2) / step);
            for (let i = 0; i <= nx; i++) {
                const x = c + ((w - c * 2) * i) / nx;
                diamond(x, c, i % 2 === 0);
                diamond(x, h - c, i % 2 === 0);
            }
            for (let i = 1; i < ny; i++) {
                const y = c + ((h - c * 2) * i) / ny;
                diamond(c, y, i % 2 === 0);
                diamond(w - c, y, i % 2 === 0);
            }
            break;
        }
        case "rounded": {
            // Soft, generously rounded double line with a star centred on top and bottom.
            const r = Math.min(w, h) * 0.06;
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 3;
            roundRect(ctx, m, m, w - m * 2, h - m * 2, r);
            ctx.stroke();
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            roundRect(ctx, m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2, r - 8);
            ctx.stroke();
            ctx.fillStyle = p.accent;
            star(ctx, w / 2, m, 8);
            star(ctx, w / 2, h - m, 8);
            break;
        }
        case "ornate": {
            // Thin frame with curling flourishes in each corner.
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m + 6, m + 6, w - (m + 6) * 2, h - (m + 6) * 2);
            const s = Math.min(w, h) * 0.09;
            ctx.strokeStyle = p.accent;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            for (const [x, y] of corners) {
                const dx = x === m ? 1 : -1;
                const dy = y === m ? 1 : -1;
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(dx, dy);
                // Two mirrored S-curls meeting at the corner, ending in small spirals.
                for (const flip of [false, true]) {
                    ctx.save();
                    if (flip) {
                        ctx.rotate(Math.PI / 2);
                        ctx.scale(1, -1);
                    }
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(s * 0.35, s * 0.05, s * 0.55, s * 0.35, s * 0.9, s * 0.12);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(s * 0.96, s * 0.18, s * 0.065, Math.PI * 1.1, Math.PI * 2.7);
                    ctx.stroke();
                    ctx.restore();
                }
                // Small leaf on the diagonal between the curls.
                ctx.fillStyle = p.accentSoft;
                ctx.beginPath();
                ctx.ellipse(s * 0.26, s * 0.26, s * 0.09, s * 0.035, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            ctx.lineCap = "butt";
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x, y, 6);
            break;
        }
        case "floral": {
            // Lotus fan of petals blooming out of each corner, on a thin double line.
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            ctx.strokeRect(m + 8, m + 8, w - (m + 8) * 2, h - (m + 8) * 2);
            const s = Math.min(w, h) * 0.1;
            atCorners(ctx, corners, m, () => {
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = p.accentSoft;
                for (const a of [-0.62, 0.62]) {
                    ctx.save();
                    ctx.rotate(a);
                    petal(ctx, s * 0.85, s * 0.16);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.fillStyle = p.accent;
                for (const a of [-0.3, 0.3]) {
                    ctx.save();
                    ctx.rotate(a);
                    petal(ctx, s * 1.05, s * 0.18);
                    ctx.fill();
                    ctx.restore();
                }
                petal(ctx, s * 1.3, s * 0.2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
                ctx.fill();
            });
            break;
        }
        case "vine": {
            // A wavy vine running round the frame with leaves at each crest.
            const inset = m + 8;
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            const amp = 6;
            const wave = 44;
            const edge = (x1: number, y1: number, x2: number, y2: number) => {
                const len = Math.hypot(x2 - x1, y2 - y1);
                const ux = (x2 - x1) / len;
                const uy = (y2 - y1) / len;
                const n = Math.max(1, Math.round(len / wave));
                const step = len / n;
                ctx.strokeStyle = p.accentSoft;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                for (let t = 0; t <= len; t += 2) {
                    const o = Math.sin((t / step) * Math.PI * 2) * amp;
                    const px = x1 + ux * t - uy * o;
                    const py = y1 + uy * t + ux * o;
                    if (t === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
                ctx.fillStyle = p.accent;
                for (let i = 0; i < n; i++) {
                    for (const [f, side] of [
                        [0.25, 1],
                        [0.75, -1],
                    ] as const) {
                        const t = step * (i + f);
                        ctx.save();
                        ctx.translate(x1 + ux * t - uy * amp * side, y1 + uy * t + ux * amp * side);
                        // Point away from the vine on the crest's side, leaning forward.
                        ctx.rotate(Math.atan2(uy, ux) + side * (Math.PI / 2 - 0.6));
                        petal(ctx, 13, 5.5);
                        ctx.fill();
                        ctx.restore();
                    }
                }
            };
            edge(inset, inset, w - inset, inset);
            edge(w - inset, inset, w - inset, h - inset);
            edge(w - inset, h - inset, inset, h - inset);
            edge(inset, h - inset, inset, inset);
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x + (x === m ? 8 : -8), y + (y === m ? 8 : -8), 7);
            break;
        }
        case "filigree": {
            // Layered lace arcs fanning from each corner with beads along the outer arc.
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m + 4, m + 4, w - (m + 4) * 2, h - (m + 4) * 2);
            const s = Math.min(w, h) * 0.1;
            atCorners(ctx, corners, m, () => {
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = p.accentSoft;
                for (const k of [0.45, 0.7]) {
                    ctx.beginPath();
                    ctx.arc(0, 0, s * k, 0, Math.PI / 2);
                    ctx.stroke();
                }
                ctx.strokeStyle = p.accent;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, s, 0, Math.PI / 2);
                ctx.stroke();
                // Small scallops hanging off the outer arc.
                ctx.lineWidth = 1.2;
                const n = 6;
                for (let i = 0; i < n; i++) {
                    const a = ((i + 0.5) / n) * (Math.PI / 2);
                    ctx.beginPath();
                    ctx.arc(Math.cos(a) * s, Math.sin(a) * s, s * 0.13, a - Math.PI / 2, a + Math.PI / 2);
                    ctx.stroke();
                }
                ctx.fillStyle = p.accent;
                for (let i = 0; i <= n; i++) {
                    const a = (i / n) * (Math.PI / 2);
                    ctx.beginPath();
                    ctx.arc(Math.cos(a) * s * 0.7, Math.sin(a) * s * 0.7, 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Spokes between the inner arcs.
                ctx.strokeStyle = p.accentSoft;
                ctx.lineWidth = 1;
                for (let i = 1; i < 4; i++) {
                    const a = (i / 4) * (Math.PI / 2);
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * s * 0.2, Math.sin(a) * s * 0.2);
                    ctx.lineTo(Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45);
                    ctx.stroke();
                }
            });
            ctx.fillStyle = p.accent;
            for (const [x, y] of corners) star(ctx, x, y, 6);
            break;
        }
        case "medallion": {
            // Quarter rosettes in the corners and a small medallion centred on each edge.
            ctx.strokeStyle = p.accentSoft;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            ctx.strokeStyle = p.innerBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(m + 8, m + 8, w - (m + 8) * 2, h - (m + 8) * 2);
            const rosette = (r: number, from: number, to: number) => {
                const n = Math.round(((to - from) / (Math.PI * 2)) * 16);
                ctx.fillStyle = p.accentSoft;
                for (let i = 0; i <= n; i++) {
                    ctx.save();
                    ctx.rotate(from + ((to - from) * i) / n);
                    petal(ctx, r, r * 0.22);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.strokeStyle = p.accent;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, r * 0.45, from, to);
                ctx.stroke();
                ctx.fillStyle = p.accent;
                ctx.beginPath();
                ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
                ctx.fill();
            };
            const s = Math.min(w, h) * 0.08;
            atCorners(ctx, corners, m, () => rosette(s, 0, Math.PI / 2));
            for (const [x, y, a] of [
                [w / 2, m, 0],
                [w / 2, h - m, Math.PI],
                [m, h / 2, -Math.PI / 2],
                [w - m, h / 2, Math.PI / 2],
            ]) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(a);
                rosette(s * 0.6, 0, Math.PI);
                ctx.restore();
            }
            break;
        }
    }
    return { m, topExtra };
}

function separator(ctx: CanvasRenderingContext2D, cx: number, y: number, half: number, p: Palette) {
    ctx.strokeStyle = p.accentSoft;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx - 18, y);
    ctx.moveTo(cx + 18, y);
    ctx.lineTo(cx + half, y);
    ctx.stroke();
    ctx.fillStyle = p.accent;
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

    const base = getImageTheme(input.theme ?? DEFAULT_IMAGE_THEME).palette;
    const p = input.photo ? photoPalette(base) : base;
    const overlay = Math.min(0.9, Math.max(0, input.photoOverlay ?? DEFAULT_PHOTO_OVERLAY));
    const choice = input.frame ?? DEFAULT_IMAGE_FRAME;
    const frame = choice === "auto" ? base.frame : choice;
    const { m, topExtra } = background(ctx, w, h, p, input.photo, overlay, frame);

    // Footer: surah name · ayah, then the site.
    const footerH = portrait ? 150 : 104;
    const top = m + (portrait ? 70 : 44) + topExtra;
    const bottom = h - m - footerH;
    const maxWidth = w - (m + (portrait ? 70 : 64)) * 2;
    const gap = portrait ? 56 : 36; // around the separator

    // Base sizes, shrunk together until everything fits.
    const sizes = portrait ? { ar: 64, tr: 36 } : { ar: 50, tr: 28 };
    const blocks: Block[] = [];
    if (input.arabic) {
        blocks.push({
            font: (s) => `${s}px ${input.arabicFamily}`,
            text: input.arabic,
            size: sizes.ar,
            lineHeight: 1.85,
            color: p.text,
            dir: "rtl",
            lines: [],
        });
    }
    for (const t of input.translations) {
        blocks.push({
            font: (s) => `${s}px ${familyFor(input, t.lang)}`,
            text: t.text,
            size: input.arabic ? sizes.tr : sizes.tr * 1.25,
            lineHeight: t.lang === "bn" ? 1.65 : 1.55,
            color: input.arabic ? p.soft : p.text,
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
    ctx.shadowColor = p.shadow;
    ctx.shadowBlur = input.photo ? 10 : 6;
    const blur = ctx.shadowBlur;

    blocks.forEach((b, i) => {
        if (i > 0) {
            if (i === 1 && input.arabic) {
                ctx.shadowBlur = 0;
                separator(ctx, w / 2, y + gap, Math.min(160, maxWidth / 4), p);
                ctx.shadowBlur = blur;
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
    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - maxWidth * 0.3, fy + 6);
    ctx.lineTo(w / 2 + maxWidth * 0.3, fy + 6);
    ctx.stroke();

    const nameSize = portrait ? 34 : 26;
    const bnName = /[ঀ-৿]/.test(input.surahName + input.reference);
    ctx.font = `600 ${nameSize}px ${bnName ? BANGLA_FAMILY : LATIN_FAMILY}`;
    if (input.photo) {
        ctx.shadowColor = p.shadow;
        ctx.shadowBlur = 8;
    }
    ctx.fillStyle = p.accent;
    ctx.fillText(`${input.surahName}  ·  ${input.reference}`, w / 2, fy + footerH * 0.42);

    ctx.font = `500 ${portrait ? 22 : 17}px ${LATIN_FAMILY}`;
    ctx.fillStyle = p.muted;
    if (input.showSiteHost ?? true) ctx.fillText("quran.msar.me", w / 2, fy + footerH * 0.75);
    ctx.shadowBlur = 0;

    return canvas;
}

export const canvasToBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png"),
    );
