import { useEffect } from "react";
import "./MouseFollower.css";

const DISABLE_CURSOR_MEDIA_QUERY =
    "(hover: none), (pointer: coarse), (max-width: 1023px)";

export function MouseFollower() {
    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        if (window.matchMedia(DISABLE_CURSOR_MEDIA_QUERY).matches) {
            return undefined;
        }

        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let posX = 0;
        let posY = 0;
        let frameId = 0;
        let looping = false;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        // Runs only while the dot still has visible distance to close, then
        // stops — a motionless mouse used to keep this rAF loop spinning
        // forever (every frame, forever, for the entire time the page was
        // open), which is wasted work competing with everything else on the
        // page for frame budget.
        const animate = () => {
            posX = lerp(posX, mouseX, 0.9);
            posY = lerp(posY, mouseY, 0.9);

            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;

            const atRest =
                Math.abs(mouseX - posX) < 0.5 && Math.abs(mouseY - posY) < 0.5;

            if (atRest) {
                looping = false;
                return;
            }

            frameId = requestAnimationFrame(animate);
        };

        const startLoop = () => {
            if (!looping) {
                looping = true;
                frameId = requestAnimationFrame(animate);
            }
        };

        const updateMouse = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            startLoop();
        };

        // A settling loop left running in a backgrounded tab is wasted work
        // the same way it would be for an idle mouse — stop it outright and
        // let the next real mousemove (or tab refocus) restart it.
        const handleVisibilityChange = () => {
            if (document.hidden) {
                looping = false;
                cancelAnimationFrame(frameId);
            }
        };

        window.addEventListener("mousemove", updateMouse, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("mousemove", updateMouse);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.cancelAnimationFrame(frameId);
            cursor.remove();
        };
    }, []);

    return null;
}
