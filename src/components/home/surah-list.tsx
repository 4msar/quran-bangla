import { Surah } from "src/types";
import { ListItem } from "./list-item";
import { GridItem } from "./grid-item";
import { useQuranStore } from "src/store/quran-store";

type SurahListProps = {
    surah: Surah[];
};

export function SurahList({ surah: surahList }: SurahListProps) {
    const type = useQuranStore((state) => state.listType);

    return (
        <div className="surah-list">
            {type === "list" && (
                <div className="list-style flex flex-col">
                    {surahList.map((surah) => (
                        <ListItem key={`surah-${surah.id}`} surah={surah} />
                    ))}
                </div>
            )}
            {type === "grid" && (
                <div className="grid-style flex justify-center flex-wrap">
                    {surahList.map((surah) => (
                        <GridItem key={`surah-${surah.id}`} surah={surah} />
                    ))}
                </div>
            )}
        </div>
    );
}
