import { Navigate, useParams } from "react-router-dom";
import { findSurah, surahPath } from "src/utils";
import { NotFound } from "./not-found";

/** Verse links open the surah and scroll to the verse. */
export function Ayah() {
    const { surah, ayah } = useParams();
    const info = findSurah(surah);
    if (!info) return <NotFound />;
    return <Navigate replace to={`${surahPath(info.id)}#ayah-${info.id}-${ayah}`} />;
}
