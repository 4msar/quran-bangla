import { Navigate, useParams } from "react-router-dom";

/** Verse links open the surah and scroll to the verse. */
export function Ayah() {
    const { surah, ayah } = useParams();
    return <Navigate replace to={`/${surah}#ayah-${surah}-${ayah}`} />;
}
