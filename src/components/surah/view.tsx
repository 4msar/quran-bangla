import { Surah } from "src/types";

export function SurahView({ surah }: { surah: Surah }) {
    return <div>Surah View {surah.ename}</div>;
}
