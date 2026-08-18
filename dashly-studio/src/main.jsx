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

// The build inserts semantic no-JS content before the React root. Hide it as
// soon as JavaScript starts, so it cannot flash beneath the application loader.
// It remains available when JavaScript is disabled because this code never runs.
const staticPageContent = document.getElementById("static-page-content");
staticPageContent?.setAttribute("aria-hidden", "true");
staticPageContent?.setAttribute("hidden", "");

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);

staticPageContent?.remove();
