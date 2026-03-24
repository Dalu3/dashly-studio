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

        const updateMouse = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const lerp = (start, end, factor) => start + (end - start) * factor;
        let frameId = 0;

        const animate = () => {
            posX = lerp(posX, mouseX, 0.9);
            posY = lerp(posY, mouseY, 0.9);

            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;

            frameId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", updateMouse);
        frameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", updateMouse);
            window.cancelAnimationFrame(frameId);
            cursor.remove();
        };
    }, []);

    return null;
}
