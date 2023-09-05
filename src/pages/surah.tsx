import { useParams } from "react-router-dom";
import { Layouts, SurahView } from "src/components";
import { getSurahInfo } from "src/utils/helpers";

export function Surah() {
    const { surah: surahId } = useParams();

    const surah = getSurahInfo(Number(surahId));

    if (!surah) {
        throw new Response("Not Found", { status: 404 });
    }

    return (
        <Layouts>
            <SurahView surah={surah} />
        </Layouts>
    );
}
