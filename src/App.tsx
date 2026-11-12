import { Route, Routes } from "react-router-dom";
import {
    Ayah,
    Home,
    JuzIndex,
    JuzPage,
    NotFound,
    RukuIndex,
    Surah,
} from "src/pages";

function App() {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/juz" element={<JuzIndex />} />
            <Route path="/juz/:juz" element={<JuzPage />} />
            <Route path="/ruku" element={<RukuIndex />} />
            <Route path="/:surah" element={<Surah />} />
            <Route path="/:surah/:ayah" element={<Ayah />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
