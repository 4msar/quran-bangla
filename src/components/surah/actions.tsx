import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

export function Actions() {
    const { surah: surahId } = useParams();

    const routes = useMemo(() => {
        if (surahId === "1")
            return {
                previous: "/",
                next: `/${Number(surahId) + 1}`,
            };

        if (surahId === "114")
            return {
                previous: `/${Number(surahId) - 1}`,
                next: "/",
            };

        return {
            previous: `/${Number(surahId) - 1}`,
            next: `/${Number(surahId) + 1}`,
        };
    }, [surahId]);

    return (
        <div className="flex  items-center justify-between">
            <Link
                className="bg-white m-2 px-6 py-3 rounded-md"
                to={routes.previous}
            >
                Previous
            </Link>
            <Link
                className="bg-white m-2 px-6 py-3 rounded-md"
                to={routes.next}
            >
                Next
            </Link>
        </div>
    );
}
