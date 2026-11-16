import { useEffect, useState } from "react";
import { backgroundPhotoUrl, canvasToBlob, loadBackgroundPhoto, renderAyahImage } from "./render-ayah-image";
import type { AyahImageInput, ImageOrientation } from "./render-ayah-image";

export type BackgroundKind = "theme" | "photo";

export type PhotoStatus = "idle" | "loading" | "ready" | "error";

/** Loads the background photo when `enabled`; a new `sig` fetches a different one. */
export function useBackgroundPhoto(enabled: boolean, orientation: ImageOrientation, sig: number) {
    const url = enabled ? backgroundPhotoUrl(orientation, sig) : null;
    const [state, setState] = useState<{ url: string; img: HTMLImageElement | null; error: boolean } | null>(null);

    useEffect(() => {
        if (!url) return;
        let active = true;
        loadBackgroundPhoto(url)
            .then((img) => active && setState({ url, img, error: false }))
            .catch(() => active && setState({ url, img: null, error: true }));
        return () => {
            active = false;
        };
    }, [url]);

    if (!url) return { photo: null, status: "idle" as PhotoStatus };
    if (state?.url !== url) return { photo: null, status: "loading" as PhotoStatus };
    return { photo: state.img, status: (state.error ? "error" : "ready") as PhotoStatus };
}

export type RenderedImage = { url: string; blob: Blob; for: string };

/**
 * Renders `input` to a PNG object URL. `renderKey` must change whenever the
 * input does; pass a null input to wait (e.g. while text or photo loads).
 */
export function useAyahImage(input: AyahImageInput | null, renderKey: string) {
    const [image, setImage] = useState<RenderedImage | null>(null);
    const [failed, setFailed] = useState<string | null>(null);

    useEffect(() => {
        if (!input) return;
        let active = true;
        let url: string | null = null;
        renderAyahImage(input)
            .then(canvasToBlob)
            .then((blob) => {
                if (!active) return;
                url = URL.createObjectURL(blob);
                setImage({ url, blob, for: renderKey });
                setFailed(null);
            })
            .catch(() => active && setFailed(renderKey));
        return () => {
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
        // renderKey captures everything that matters in `input`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderKey, input === null]);

    return {
        current: image?.for === renderKey ? image : null,
        failed: failed === renderKey,
    };
}

export function downloadBlobUrl(url: string, fileName: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.append(a);
    a.click();
    a.remove();
}
