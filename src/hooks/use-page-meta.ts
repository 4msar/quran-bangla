import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://quran.msar.me";
export const SITE_NAME = "আল কুরআন";
export const DEFAULT_TITLE = "আল কুরআন · বাংলা অনুবাদ | Al Quran with Bangla Translation";
export const DEFAULT_DESCRIPTION =
    "বাংলা ও ইংরেজি অনুবাদসহ পবিত্র কুরআন পড়ুন — সূরা, পারা ও রুকু অনুযায়ী। Read the Holy Quran in Arabic with Bangla and English translation, by surah, juz and ruku.";

type PageMeta = {
    /** Page title without the site name; omit for the home page. */
    title?: string;
    description?: string;
    /** Keep the page out of search results (personal or error pages). */
    noIndex?: boolean;
};

const setContent = (selector: string, content: string) => {
    document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
};

/** Keeps <title>, description, canonical and the social tags in sync with the current page. */
export function usePageMeta({ title, description = DEFAULT_DESCRIPTION, noIndex = false }: PageMeta = {}) {
    const { pathname } = useLocation();

    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
        const url = SITE_URL + (pathname === "/" ? "/" : pathname.replace(/\/+$/, ""));

        document.title = fullTitle;
        setContent('meta[name="description"]', description);
        setContent('meta[name="robots"]', noIndex ? "noindex, follow" : "index, follow");
        setContent('meta[property="og:title"]', fullTitle);
        setContent('meta[property="og:description"]', description);
        setContent('meta[property="og:url"]', url);
        setContent('meta[name="twitter:title"]', fullTitle);
        setContent('meta[name="twitter:description"]', description);
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", url);
    }, [title, description, noIndex, pathname]);
}
