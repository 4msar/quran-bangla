/** True when running as an installed app (Android/desktop standalone, iOS home-screen). */
export const isInstalledApp = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
