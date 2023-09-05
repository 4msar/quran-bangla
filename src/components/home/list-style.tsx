import grid from "src/assets/icons/grid.svg";
import list from "src/assets/icons/list.svg";
import { useQuranStore } from "src/store";

export function ListTypeToggle() {
    const type = useQuranStore((state) => state.listType);
    const setType = useQuranStore((state) => state.setListType);

    return (
        <div className="flex space-x-2">
            <button
                className={`list-style-toggle ${
                    type === "grid" ? "active" : ""
                }`}
                disabled={type === "grid"}
                onClick={() => setType("grid")}
            >
                <img src={grid} alt="grid" />
            </button>

            <button
                className={`list-style-toggle ${
                    type === "list" ? "active" : ""
                }`}
                disabled={type === "list"}
                onClick={() => setType("list")}
            >
                <img src={list} alt="list" />
            </button>
        </div>
    );
}
