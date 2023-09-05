import { Link } from "react-router-dom";
import { Surah } from "src/types";

export function ListItem({ surah }: { surah: Surah }) {
    return (
        <Link to={`/${surah.id}`} className="p-2 min-w-[220px] w-full">
            <div className="flex flex-col w-full p-4 bg-white rounded-md">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="w-6 h-6 mb-2 text-sm font-bold text-green-600">
                            {surah.id.toString().padStart(3, "0")}
                        </span>
                        <div className="text-sm font-bold text-left text-gray-600">
                            {surah.bname}
                        </div>
                        <div className="text-sm font-bold text-left text-gray-300">
                            {surah.ename}
                        </div>
                    </div>

                    <div className="text-xs font-medium text-right text-gray-400">
                        <span>{surah.type}</span> <br />
                        <span>Ayah: {surah.ayas}</span> <br />
                        {/* <span>Start: {surah.start}</span> */}
                    </div>
                </div>
            </div>
        </Link>
    );
}
