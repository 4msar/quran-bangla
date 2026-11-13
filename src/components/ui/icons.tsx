import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}

export const HomeIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </Icon>
);

export const BookOpenIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </Icon>
);

export const ListIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </Icon>
);

export const GridIcon = (p: IconProps) => (
    <Icon {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Icon>
);

export const BookmarkIcon = ({
    filled,
    ...p
}: IconProps & { filled?: boolean }) => (
    <Icon {...p} fill={filled ? "currentColor" : "none"}>
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Icon>
);

export const SettingsIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="17" r="2" />
    </Icon>
);

export const SearchIcon = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Icon>
);

export const MenuIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
);

export const CloseIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
);

export const SunIcon = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Icon>
);

export const MoonIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
    </Icon>
);

export const CopyIcon = (p: IconProps) => (
    <Icon {...p}>
        <rect x="8" y="8" width="13" height="13" rx="2" />
        <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
    </Icon>
);

export const CheckIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M20 6 9 17l-5-5" />
    </Icon>
);

export const MoreIcon = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
    </Icon>
);

export const LinkIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Icon>
);

export const ShareIcon = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="m15 18-6-6 6-6" />
    </Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="m9 18 6-6-6-6" />
    </Icon>
);

export const MinusIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M5 12h14" />
    </Icon>
);

export const PlusIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M12 5v14M5 12h14" />
    </Icon>
);

export const TrashIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </Icon>
);

export const LibraryIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 4v16M9 4v16" />
        <path d="m13.5 4.5 5 15" />
    </Icon>
);

export const ImageIcon = (p: IconProps) => (
    <Icon {...p}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </Icon>
);

export const PlayIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </Icon>
);

export const PauseIcon = (p: IconProps) => (
    <Icon {...p}>
        <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </Icon>
);

export const SkipBackIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M19 5v14l-10-7z" fill="currentColor" />
        <path d="M5 5v14" />
    </Icon>
);

export const SkipForwardIcon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M5 5v14l10-7z" fill="currentColor" />
        <path d="M19 5v14" />
    </Icon>
);
