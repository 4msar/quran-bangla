import { useParams } from "react-router-dom";
import { Actions, Layouts, SurahAyah, SurahView } from "src/components";
import { getSurahInfo } from "src/utils/helpers";

export function Surah() {
    const { surah: surahId } = useParams();

    const surah = getSurahInfo(Number(surahId));

    if (!surah) {
        return <div>Surah not found</div>;
    }

    return (
        <Layouts className="sm:mr-60">
            <div className="flex">
                <SurahAyah surah={surah} />
                <SurahView surah={surah} />
            </div>
            <Actions />
        </Layouts>
    );
}
