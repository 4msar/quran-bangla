import { useEffect, useRef } from "react";
import { CloseIcon } from "src/components/ui/icons";

type DrawerProps = {
    open: boolean;
    onClose: () => void;
    /** "right" turns into a bottom sheet on phones. */
    side: "left" | "right";
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

/**
 * Side panel on a native <dialog>: showModal() gives the focus trap,
 * Esc to close, an inert page behind it, and focus returns to the trigger.
 */
export function Drawer({
    open,
    onClose,
    side,
    title,
    children,
    footer,
}: DrawerProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            aria-label={title}
            className={`drawer drawer-${side}`}
            onClose={onClose}
            onClick={(e) => {
                // Clicks on the backdrop land on the dialog element itself.
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="flex h-full max-h-[inherit] flex-col">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <h2 className="text-base font-semibold text-ink">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="press flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink"
                    >
                        <CloseIcon size={18} />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
                {footer && (
                    <div className="border-t border-line px-5 py-3">{footer}</div>
                )}
            </div>
        </dialog>
    );
}
