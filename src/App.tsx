import { Route, Routes } from "react-router-dom";
import { Ayah, Home, NotFound, Surah } from "src/pages";

function App() {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/:surah" element={<Surah />} />
            <Route path="/:surah/:ayah" element={<Ayah />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
