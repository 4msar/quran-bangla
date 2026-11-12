# আল কুরআন · Quran Bangla

A fast, offline-capable web app for reading the Holy Quran in Arabic with Bangla and English translations.

**Live:** [quran.msar.me](https://quran.msar.me)

## Features

- **Browse by surah, juz (পারা) or ruku.** List or grid layout, plus quick links to commonly read surahs and Ayatul Kursi.
- **Search** by surah name, surah number or a verse reference such as `2:255`.
- **Two reading modes:**
  - *Translation*: verse by verse, with Bangla and/or English translation. Arabic can be hidden for translation-only reading.
  - *Quran*: Arabic only, laid out continuously like a mushaf.
- **Recitation** of each verse from [everyayah.com](https://everyayah.com), with nine reciters, volume, playback speed (0.75×–1.5×), repeat-ayah, and the Bismillah recited before ayah 1 of each surah except Al-Fatihah and At-Tawbah.
- **Bookmarks** and **last-read** position, saved in the browser.
- **Per-ayah menu:** play, copy link, copy the Arabic text, share.
- **Reading settings:** System, light, dark or sepia theme, four Arabic fonts (Amiri Quran, Scheherazade New, Noto Naskh Arabic, Lateef), and separate size controls for Arabic and translation text.
- **Bilingual UI:** labels and numerals switch to English when only the English translation is selected, and stay in Bangla otherwise.
- **Installable PWA:** the app shell and Quran text are precached, so reading works offline after the first visit. Recitation audio still needs a connection.
- **SEO:** every surah and juz page is prerendered with its own title, description and social tags.

## Routes

| Path | Page |
| --- | --- |
| `/` | Surah list |
| `/juz` | Juz list |
| `/juz/:juz` | Read a juz (1–30) |
| `/ruku` | Ruku list |
| `/bookmarks` | Saved bookmarks |
| `/:surah` | Read a surah (1–114) |
| `/:surah/:ayah` | Redirects to `/:surah#ayah-S-A` (shareable verse link) |

Surah pages accept the hash anchors `#ayah-S-A` and `#ruku-N` to scroll to a verse or ruku.

## Tech stack

- [React 19](https://react.dev) + TypeScript, built with [Vite 7](https://vitejs.dev) (SWC plugin)
- [React Router 7](https://reactrouter.com) for routing
- [Zustand](https://zustand.docs.pmnd.rs) for state. Settings, bookmarks and last-read position persist to `localStorage` under the `quran-store-v2` key.
- [Tailwind CSS 4](https://tailwindcss.com) with the typography plugin
- [Motion](https://motion.dev) for animation
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (Workbox) for offline support

## Getting started

Requires Node.js 24 (the version CI uses) and Yarn.

```bash
yarn install
```

```bash
yarn dev
```

The dev server runs at http://localhost:5173.

| Script | What it does |
| --- | --- |
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check, build to `dist/`, then prerender static HTML per route |
| `yarn preview` | Serve the production build locally |
| `yarn lint` | Run ESLint with zero warnings allowed |

Lock files (`yarn.lock`, `package-lock.json`) are git-ignored.

## Project structure

```
src/
  pages/        Route components (home, surah, ayah, juz, bookmarks, not-found)
  components/
    common/     Header, drawers, audio player, search box, toast
    home/       Surah, juz and ruku lists
    surah/      Ayah rendering, ayah menu, reader bar, ruku markers
    settings/   Settings drawer
    ui/         Shared icons and controls
  store/        Zustand stores: quran (persisted settings), audio, ui (transient)
  hooks/        Settings application, ayah loading, hash scrolling, page meta
  data/
    ayats_ar.json, ayats_bn.json, ayats_en.json   Verse text per language
    meta/       Surah, juz, ruku, hizb, manzil, page and sajdah metadata
    translations.ts   Lazy loader; each language is its own chunk
  utils/        Constants (reciters, fonts, themes), search and Quran helpers
scripts/
  prerender.mjs Writes per-route HTML with page-specific <head> tags after build
```

### Adding a translation

1. Add `src/data/ayats_<id>.json` in the same shape as the existing files: `{ id, sura, aya, text }[]`.
2. Add `<id>` to `TranslationId` in `src/types.ts`.
3. Add an entry to `TRANSLATIONS` in `src/utils/constants.ts`, and to `ORDER` in `src/store/quran-store.ts` to set its display position.

The loader in `src/data/translations.ts` picks up the new file automatically and only downloads it when the translation is selected.

### Adding a reciter

Add an entry to `RECITERS` in `src/utils/constants.ts`. The `id` must match the folder name on `https://everyayah.com/data/`.

## Deployment

Each push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It builds the site, copies `index.html` to `404.html` as the SPA fallback, and publishes `dist/` to GitHub Pages. The custom domain is set by `public/CNAME`.

If you change a page title or description in a `usePageMeta()` call under `src/pages`, update `scripts/prerender.mjs` to match, because the prerendered `<head>` tags are generated separately.

## Credits

- Recitation audio: [everyayah.com](https://everyayah.com)
- Fonts: Google Fonts (Inter and the Arabic fonts) and Kalpurush for Bangla
