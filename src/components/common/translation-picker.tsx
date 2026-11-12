import { useQuranStore } from "src/store";
import { TRANSLATION_OPTIONS } from "src/utils";
import type { TranslationChoice } from "src/types";

export function TranslationPicker({ loading = false }: { loading?: boolean }) {
    const translation = useQuranStore((state) => state.translation);
    const setTranslation = useQuranStore((state) => state.setTranslation);

    return (
        <label className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">Translation</span>
            <select
                value={translation}
                onChange={(e) =>
                    setTranslation(e.target.value as TranslationChoice)
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-500"
            >
                {TRANSLATION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {loading && (
                <span className="text-xs text-gray-400" role="status">
                    Loading…
                </span>
            )}
        </label>
    );
}
