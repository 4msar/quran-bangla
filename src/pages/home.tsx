import { motion } from "motion/react";
import { Link, NavLink } from "react-router-dom";
import { JuzList, Layouts, ListTypeToggle, RukuList, SearchBox, SurahList } from "src/components";
import { ChevronRightIcon } from "src/components/ui/icons";
import { usePageMeta } from "src/hooks/use-page-meta";
import { useQuranStore, useUiLang } from "src/store";
import { getJuzPrefix, getRukuPrefix, getSurah, getSurahName, QUICK_LINKS, toLocaleDigits } from "src/utils";

type Tab = "surah" | "juz" | "ruku";

const MotionLink = motion.create(Link);

const hero = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
} as const;

function ContinueReading() {
    const lastRead = useQuranStore((s) => s.lastRead);
    const ui = useUiLang();
    if (!lastRead) return null;
    const surah = getSurah(lastRead.sura);
    if (!surah) return null;

    return (
        <section aria-labelledby="continue" className="mb-10">
            <h2 id="continue" className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {ui === "en" ? "Continue reading" : "যেখানে ছিলেন"}
            </h2>
            <MotionLink
                to={`/${lastRead.sura}#ayah-${lastRead.sura}-${lastRead.aya}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="group flex items-center gap-4 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-600/20 hover:ring-brand-600/40"
            >
                <span className="font-arabic text-3xl text-brand-700">{surah.name}</span>
                <span className="min-w-0 flex-1">
                    <span className={`block font-semibold text-ink ${ui === "bn" ? "font-bangla text-lg" : ""}`}>
                        {toLocaleDigits(surah.id, ui)}. {getSurahName(surah, ui)}
                    </span>
                    <span className="block text-sm text-muted">
                        {ui === "en" ? "Ayah" : "আয়াত"} {toLocaleDigits(lastRead.aya, ui)} /{" "}
                        {toLocaleDigits(surah.ayas, ui)}
                    </span>
                </span>
                <ChevronRightIcon className="text-brand-700 transition-transform group-hover:translate-x-1" />
            </MotionLink>
        </section>
    );
}

export function Home({ tab }: { tab: Tab }) {
    const ui = useUiLang();
    usePageMeta({
        title:
            tab === "juz"
                ? "পারা তালিকা · Juz List"
                : tab === "ruku"
                  ? "রুকু তালিকা · Ruku List"
                  : undefined,
    });
    const tabs: { id: Tab; to: string; label: string }[] = [
        { id: "surah", to: "/", label: ui === "en" ? "Surah" : "সূরা" },
        { id: "juz", to: "/juz", label: getJuzPrefix(ui) },
        { id: "ruku", to: "/ruku", label: getRukuPrefix(ui) },
    ];

    return (
        <Layouts wide>
            <motion.section
                variants={hero}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-2xl pb-10 pt-4 text-center md:pt-10"
            >
                <motion.div variants={heroItem} className="flex flex-col gap-4">
                    <p lang="ar" className="font-arabic text-5xl leading-relaxed text-brand-700 md:text-6xl mb-4">
                        القرآن الكريم
                    </p>
                    <h1 className="mt-2 font-bangla text-2xl font-semibold text-ink md:text-3xl my-2">
                        আল কুরআন · বাংলা অনুবাদ
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        {ui === "en"
                            ? "Read the Quran with Bangla and English translation"
                            : "আরবি, বাংলা ও ইংরেজি অনুবাদসহ কুরআন পড়ুন"}
                    </p>
                </motion.div>

                <motion.div variants={heroItem} className="mt-8">
                    <SearchBox />
                </motion.div>

                <motion.ul variants={heroItem} className="mt-4 flex flex-wrap justify-center gap-2">
                    {QUICK_LINKS.map((link) => (
                        <li key={link.to}>
                            <MotionLink
                                to={link.to}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`inline-block rounded-full bg-panel px-4 py-1.5 text-sm text-ink/80 ring-1 ring-line hover:bg-brand-50 hover:text-brand-700 ${
                                    ui === "bn" ? "font-bangla text-base" : ""
                                }`}
                            >
                                {ui === "en" ? link.label : link.bn}
                            </MotionLink>
                        </li>
                    ))}
                </motion.ul>
            </motion.section>

            <ContinueReading />

            <div className="mb-5 flex items-center justify-between gap-3">
                <nav aria-label="Browse the Quran" className="flex gap-1 rounded-full bg-panel p-1 ring-1 ring-line">
                    {tabs.map((t) => (
                        <NavLink
                            key={t.id}
                            to={t.to}
                            end
                            className={({ isActive }) =>
                                `press relative rounded-full px-5 py-1.5 text-sm font-medium ${
                                    isActive ? "text-brand-700" : "text-muted hover:text-ink"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="home-tab"
                                            className="absolute inset-0 rounded-full bg-surface shadow-card"
                                            transition={{ type: "spring", stiffness: 480, damping: 36 }}
                                        />
                                    )}
                                    <span className="relative">{t.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                {tab === "surah" && <ListTypeToggle />}
            </div>

            {tab === "surah" && <SurahList />}
            {tab === "juz" && <JuzList />}
            {tab === "ruku" && <RukuList />}
        </Layouts>
    );
}
