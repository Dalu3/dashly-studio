import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// The build inserts semantic no-JS content before the React root. Keep it in
// place if the application fails to load, but remove it immediately before a
// successful client render so React owns the visible page without hydration.
document.getElementById("static-page-content")?.remove();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
