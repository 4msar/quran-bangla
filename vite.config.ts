import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "logo.svg", "apple-touch-icon.png"],
            manifest: {
                id: "/",
                name: "আল কুরআন · বাংলা অনুবাদ",
                short_name: "আল কুরআন",
                description: "বাংলা ও ইংরেজি অনুবাদসহ পবিত্র কুরআন পড়ুন — সূরা, পারা ও রুকু অনুযায়ী, অফলাইনেও।",
                lang: "bn",
                dir: "ltr",
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "any",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                categories: ["books", "education", "lifestyle"],
                icons: [
                    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
                    {
                        src: "pwa-maskable-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                shortcuts: [
                    { name: "সূরা তালিকা", short_name: "সূরা", url: "/" },
                    { name: "পারা তালিকা", short_name: "পারা", url: "/juz" },
                    { name: "বুকমার্ক", short_name: "বুকমার্ক", url: "/bookmarks" },
                ],
            },
            workbox: {
                // Precache the app shell and the Quran text chunks so reading works offline.
                globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
                globIgnores: ["**/og-image.png"],
                maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
                navigateFallback: "index.html",
                cleanupOutdatedCaches: true,
                runtimeCaching: [
                    {
                        // Font stylesheets (Google Fonts + Kalpurush).
                        urlPattern: ({ url }) =>
                            url.origin === "https://fonts.googleapis.com" ||
                            (url.origin === "https://cdn.msar.me" && url.pathname.endsWith(".css")),
                        handler: "StaleWhileRevalidate",
                        options: { cacheName: "font-stylesheets" },
                    },
                    {
                        // Font files.
                        urlPattern: ({ url }) =>
                            url.origin === "https://fonts.gstatic.com" ||
                            (url.origin === "https://cdn.msar.me" && url.pathname.startsWith("/fonts/")),
                        handler: "CacheFirst",
                        options: {
                            cacheName: "font-files",
                            cacheableResponse: { statuses: [0, 200] },
                            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        allowedHosts: ["app.msar.dev"],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src"),
        },
    },
});
