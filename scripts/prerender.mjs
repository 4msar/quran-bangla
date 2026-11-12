// Writes one static HTML file per indexable route into dist/ after `vite build`,
// so GitHub Pages answers /36 or /juz/30 with a 200 and that page's own
// title, description, canonical and social tags (instead of the 404.html fallback).
// The app still boots and renders as usual; only the <head> differs.
//
// Titles and descriptions mirror the usePageMeta() calls in src/pages — keep them in sync.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), "utf8"));

const SITE_URL = "https://quran.msar.me";
const SITE_NAME = "আল কুরআন";

const surahs = readJson("src/data/meta/surah.json");
const juzList = readJson("src/data/meta/juz.json").sort((a, b) => a.id - b.id);
const surahById = new Map(surahs.map((s) => [s.id, s]));

const bn = (value) => String(value).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
const revelation = (type) => (type.toLowerCase().startsWith("mec") ? "মাক্কী" : "মাদানী");

/** The ayah just before `pos`, i.e. where the previous juz ends. */
const before = ({ sura, aya }) =>
    aya > 1 ? { sura, aya: aya - 1 } : { sura: sura - 1, aya: surahById.get(sura - 1).ayas };

const pages = [
    { path: "/juz", title: "পারা তালিকা · Juz List" },
    { path: "/ruku", title: "রুকু তালিকা · Ruku List" },
    ...surahs.map((s) => ({
        path: `/${s.id}`,
        title: `সূরাহ ${s.bname} (${s.tname})`,
        description: `সূরাহ ${s.bname} (${s.name}) — কুরআনের ${bn(s.id)} নম্বর সূরা, ${bn(s.ayas)} আয়াত, ${revelation(s.type)}। আরবি ও বাংলা অনুবাদসহ পড়ুন। Surah ${s.tname} (${s.ename}), ${s.ayas} ayahs, with Bangla and English translation.`,
    })),
    ...juzList.map((juz, index) => {
        const next = juzList[index + 1];
        const last = surahs[surahs.length - 1];
        const to = next ? before(next) : { sura: last.id, aya: last.ayas };
        return {
            path: `/juz/${juz.id}`,
            title: `পারা ${bn(juz.id)} (Juz ${juz.id})`,
            description: `কুরআনের পারা ${bn(juz.id)} — ${surahById.get(juz.sura).bname} ${juz.sura}:${juz.aya} থেকে ${surahById.get(to.sura).bname} ${to.sura}:${to.aya}। আরবি ও বাংলা অনুবাদসহ পড়ুন। Juz ${juz.id} of the Quran with Bangla and English translation.`,
        };
    }),
];

const escapeHtml = (text) =>
    text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const template = readFileSync(resolve(dist, "index.html"), "utf8");

/** Replaces exactly one match, failing loudly if index.html no longer has the tag. */
const swap = (html, pattern, value) => {
    if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern}`);
    return html.replace(pattern, (_, open, close) => open + escapeHtml(value) + close);
};

const attr = (tag, key, name, target) =>
    new RegExp(`(<${tag}\\s+${key}="${name}"\\s+${target}=")[^"]*(")`);

for (const page of pages) {
    const title = `${page.title} | ${SITE_NAME}`;
    const url = SITE_URL + page.path;

    let html = swap(template, /(<title>)[^<]*(<\/title>)/, title);
    html = swap(html, attr("meta", "property", "og:title", "content"), title);
    html = swap(html, attr("meta", "name", "twitter:title", "content"), title);
    html = swap(html, attr("meta", "property", "og:url", "content"), url);
    html = swap(html, attr("link", "rel", "canonical", "href"), url);
    if (page.description) {
        html = swap(html, attr("meta", "name", "description", "content"), page.description);
        html = swap(html, attr("meta", "property", "og:description", "content"), page.description);
        html = swap(html, attr("meta", "name", "twitter:description", "content"), page.description);
    }

    // `36.html` (not `36/index.html`) so GitHub Pages serves /36 without a trailing-slash redirect.
    const file = resolve(dist, `.${page.path}.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
}

console.log(`prerender: wrote ${pages.length} pages`);
