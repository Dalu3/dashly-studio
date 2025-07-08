import { useEffect } from "react";
import "./MouseFollower.css";

export function MouseFollower() {
    useEffect(() => {
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

        const animate = () => {
            posX = lerp(posX, mouseX, 0.3);
            posY = lerp(posY, mouseY, 0.3);

            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", updateMouse);
        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", updateMouse);
            cursor.remove();
        };
    }, []);

    return null;
}
