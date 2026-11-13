import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            {/* Honour the OS "reduce motion" setting for every motion component. */}
            <MotionConfig reducedMotion="user">
                <App />
            </MotionConfig>
        </BrowserRouter>
    </React.StrictMode>
);
