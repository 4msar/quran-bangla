import { Surah } from "src/types";
import { ListItem } from "./list-item";
import { GridItem } from "./grid-item";

type SurahListProps = {
    type: "list" | "grid";
    surahs: Surah[];
};

export function SurahList({ type, surahs }: SurahListProps) {
    return (
        <section className="surah-list">
            <h1>Surah List</h1>

            {type === "list" && (
                <div className="list-style">
                    {surahs.map((surah) => (
                        <ListItem key={`surah-${surah.id}`} surah={surah} />
                    ))}
                </div>
            )}
            {type === "grid" && (
                <div className="grid-style">
                    {surahs.map((surah) => (
                        <GridItem key={`surah-${surah.id}`} surah={surah} />
                    ))}
                </div>
            )}
        </section>
    );
}
