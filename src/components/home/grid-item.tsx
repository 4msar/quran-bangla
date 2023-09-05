import { Surah } from "src/types";
import { Link } from "react-router-dom";
import { HeartIcon } from "src/assets/icons";
import { useQuranStore } from "src/store";
import { getSurahPrefix } from "src/utils";

export function GridItem({ surah }: { surah: Surah }) {
    const lang = useQuranStore((state) => state.lang);
    return (
        <Link to={`/${surah.id}`} className="p-2 md:w-72 w-full">
            <div className="flex flex-col w-full p-4 bg-white rounded-md">
                <div className="flex items-center justify-between">
                    <span className="flex-center w-6 h-6 mb-2 text-sm font-bold text-green-600">
                        {surah.id.toString().padStart(3, "0")}
                    </span>

                    <button className="flex-center">
                        <HeartIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex mt-4 flex-col">
                        <div className="text-sm font-bold text-left text-gray-600">
                            {getSurahPrefix(lang)} {surah.bname}
                        </div>
                        <div className="text-sm mt-2 font-bold text-left text-gray-300">
                            {surah.ename}
                        </div>
                    </div>

                    <div className="text-xs font-medium text-right text-gray-400">
                        <span>{surah.type}</span> <br />
                        <span>Ayah: {surah.ayas}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
