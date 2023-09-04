import { Layouts, Sidebar } from "src/components";
import { SurahList } from "src/components/home/surah-list";

export function Home() {
    return (
        <Layouts>
            <Sidebar />

            <SurahList type="grid" surahs={[]} />
        </Layouts>
    );
}
