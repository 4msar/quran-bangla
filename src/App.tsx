import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Drawer } from "src/components/common/drawer";
import { ListPanelBody } from "src/components/common/list-panel";
import { AudioPlayer } from "src/components/common/audio-player";
import { Toast } from "src/components/common/toast";
import { UpdatePrompt } from "src/components/common/update-prompt";
import { SettingsDrawer } from "src/components/settings/settings-drawer";
import { ShareImageDialog } from "src/components/share/share-image-dialog";
import { TafseerDrawer } from "src/components/tafseer/tafseer-drawer";
import { useApplySettings } from "src/hooks/use-apply-settings";
import { useUiLang, useUiStore } from "src/store";
import {
    Ayah,
    Bookmarks,
    Home,
    JuzPage,
    NotFound,
    Search,
    Surah,
} from "src/pages";

function ListDrawer() {
    const open = useUiStore((s) => s.listOpen);
    const setOpen = useUiStore((s) => s.setListOpen);
    const ui = useUiLang();
    const { pathname, hash } = useLocation();

    // Close after picking a surah / juz / ruku.
    useEffect(() => {
        setOpen(false);
    }, [pathname, hash, setOpen]);

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            side="left"
            title={ui === "en" ? "Browse" : "সূরা ও পারা"}
        >
            {open && <ListPanelBody />}
        </Drawer>
    );
}

function App() {
    useApplySettings();

    return (
        <>
            <Routes>
                <Route index path="/" element={<Home tab="surah" />} />
                <Route path="/juz" element={<Home tab="juz" />} />
                <Route path="/juz/:juz" element={<JuzPage />} />
                <Route path="/ruku" element={<Home tab="ruku" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/:surah" element={<Surah />} />
                <Route path="/:surah/:ayah" element={<Ayah />} />

                <Route path="*" element={<NotFound />} />
            </Routes>

            <ListDrawer />
            <SettingsDrawer />
            <TafseerDrawer />
            <ShareImageDialog />
            <AudioPlayer />
            <Toast />
            <UpdatePrompt />
        </>
    );
}

export default App;
