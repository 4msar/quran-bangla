import { Layouts } from "src/components";
import { SurahList } from "src/components";
import { useQuranStore } from "src/store/quran-store";

export function Home() {
    const surah = useQuranStore((state) => state.surah);
    return (
        <Layouts>
            <SurahList type="grid" surahs={surah} />
        </Layouts>
    );
}
