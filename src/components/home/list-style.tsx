import { useQuranStore } from "src/store";
import { GridIcon, ListIcon } from "src/components/ui/icons";

export function ListTypeToggle() {
    const type = useQuranStore((s) => s.listType);
    const setType = useQuranStore((s) => s.setListType);

    const button = (active: boolean) =>
        `press flex h-9 w-9 items-center justify-center rounded-full ${
            active ? "bg-surface text-brand-700 shadow-card" : "text-muted hover:text-ink"
        }`;

    return (
        <div role="group" aria-label="Layout" className="flex gap-1 rounded-full bg-panel p-1 ring-1 ring-line">
            <button
                type="button"
                className={button(type === "grid")}
                aria-pressed={type === "grid"}
                aria-label="Grid"
                onClick={() => setType("grid")}
            >
                <GridIcon size={16} />
            </button>
            <button
                type="button"
                className={button(type === "list")}
                aria-pressed={type === "list"}
                aria-label="List"
                onClick={() => setType("list")}
            >
                <ListIcon size={16} />
            </button>
        </div>
    );
}
