import { Surah } from "src/types";

export function SurahView({ surah }: { surah: Surah }) {
    return (
        <div className="h-full fixed right-0 top-24 hidden sm:flex flex-col w-60 bg-white p-4 -m-4">
            <h1>{surah.name}</h1>
            <p>{surah.bname}</p>
            <p>Ayah: {surah.ayas}</p>
            <p>Revolution: {surah.type}</p>
        </div>
    );
}
