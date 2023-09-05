import { GridIcon, ListIcon } from "src/assets/icons";
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
                <GridIcon />
            </button>

            <button
                className={`list-style-toggle ${
                    type === "list" ? "active" : ""
                }`}
                disabled={type === "list"}
                onClick={() => setType("list")}
            >
                <ListIcon />
            </button>
        </div>
    );
}
