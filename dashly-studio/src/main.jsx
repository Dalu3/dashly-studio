import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Prevent the browser from restoring the previous scroll position before the
// React loader and route effects are ready. Hash navigation is restored later
// by App once the target section has mounted.
if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

// The build inserts semantic no-JS content before the React root. Keep it in
// place if the application fails to load, and remove it only after React has
// successfully accepted the root so the fallback remains a real resilience
// path rather than a temporary placeholder that can disappear too early.
const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);

document.getElementById("static-page-content")?.remove();
