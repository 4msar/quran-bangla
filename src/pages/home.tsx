import { Layouts, ListTypeToggle, SurahList } from "src/components";
import surah from "src/data/meta/surah.json";

export function Home() {
    return (
        <Layouts>
            <ListTypeToggle />
            <SurahList surah={surah} />
        </Layouts>
    );
}
