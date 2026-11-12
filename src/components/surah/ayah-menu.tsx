import { useEffect, useRef, useState } from "react";
import { useAudioStore, useIsAyahActive, useUiStore } from "src/store";
import { CopyIcon, LinkIcon, MoreIcon, PauseIcon, PlayIcon, ShareIcon } from "src/components/ui/icons";

type Item = { label: string; icon: React.ReactNode; run: () => void };

type AyahMenuProps = {
    sura: number;
    aya: number;
    arabic: string;
    shareText: string;
    ui: "bn" | "en";
};

const copy = (text: string) => navigator.clipboard?.writeText(text);

/** "⋯" menu per ayah: play, copy link, share, copy Arabic only. */
export function AyahMenu({ sura, aya, arabic, shareText, ui }: AyahMenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const showToast = useUiStore((s) => s.showToast);

    const active = useIsAyahActive(sura, aya);
    const playingThis = useAudioStore((s) => s.playing) && active;
    const play = useAudioStore((s) => s.play);
    const toggle = useAudioStore((s) => s.toggle);

    const url = `${window.location.origin}/${sura}/${aya}`;
    const items: Item[] = [
        playingThis
            ? {
                  label: ui === "en" ? "Pause" : "বিরতি",
                  icon: <PauseIcon size={16} />,
                  run: toggle,
              }
            : {
                  label: ui === "en" ? "Play" : "শুনুন",
                  icon: <PlayIcon size={16} />,
                  run: () => (active ? toggle() : play({ sura, aya })),
              },
        {
            label: ui === "en" ? "Copy link" : "লিংক কপি",
            icon: <LinkIcon size={16} />,
            run: () => {
                copy(url);
                showToast(ui === "en" ? "Link copied" : "লিংক কপি হয়েছে");
            },
        },
        {
            label: ui === "en" ? "Copy Arabic only" : "শুধু আরবি কপি",
            icon: <CopyIcon size={16} />,
            run: () => {
                copy(arabic);
                showToast(ui === "en" ? "Arabic copied" : "আরবি কপি হয়েছে");
            },
        },
    ];
    if (typeof navigator !== "undefined" && "share" in navigator) {
        items.push({
            label: ui === "en" ? "Share" : "শেয়ার",
            icon: <ShareIcon size={16} />,
            run: () => {
                navigator.share({ text: shareText, url }).catch(() => {});
            },
        });
    }

    useEffect(() => {
        if (!open) return;
        menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

        const onPointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("pointerdown", onPointer);
        return () => document.removeEventListener("pointerdown", onPointer);
    }, [open]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        const buttons = Array.from(
            menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []
        );
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            buttons[(index + 1) % buttons.length]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
        } else if (e.key === "Tab") {
            setOpen(false);
        }
    };

    return (
        <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
            <button
                ref={triggerRef}
                type="button"
                aria-label={ui === "en" ? `More actions for ${sura}:${aya}` : `${sura}:${aya} আরও`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="press flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink"
            >
                <MoreIcon size={18} />
            </button>

            {open && (
                <ul
                    ref={menuRef}
                    role="menu"
                    className="menu-pop absolute right-0 top-full z-20 mt-1 w-48 rounded-xl bg-surface p-1 shadow-float"
                >
                    {items.map((item) => (
                        <li key={item.label} role="none">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    item.run();
                                    setOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-panel focus:bg-panel focus:outline-none"
                            >
                                <span className="text-muted">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
