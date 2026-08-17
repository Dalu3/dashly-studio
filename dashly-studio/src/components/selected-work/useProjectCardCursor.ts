import { useEffect, type RefObject } from "react";

/**
 * Desktop-only pointer follower for a project card. Position is smoothed in a
 * single requestAnimationFrame loop so it feels composed without falling far
 * behind the native cursor.
 */
const FOLLOW_RESPONSE = 24;
const SETTLE_DISTANCE = 0.1;

export function useProjectCardCursor(
    cardRef: RefObject<HTMLElement | null>,
    cursorRef: RefObject<HTMLElement | null>,
    enabled: boolean,
) {
    useEffect(() => {
        const card = cardRef.current;
        const cursor = cursorRef.current;

        if (!enabled || !card || !cursor) {
            return undefined;
        }

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let frame = 0;
        let lastTime = 0;
        let isHovering = false;

        const getCursorZone = () => {
            return card.closest('[role="region"]');
        };

        const isInsideCursorZone = (target: EventTarget | null) => {
            if (!(target instanceof Node)) {
                return false;
            }

            return getCursorZone()?.contains(target) ?? false;
        };

        const writePosition = () => {
            cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0)`;
        };

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - lastTime) / 1000 || 1 / 60);
            lastTime = now;

            const interpolation = 1 - Math.exp(-FOLLOW_RESPONSE * dt);
            currentX += (targetX - currentX) * interpolation;
            currentY += (targetY - currentY) * interpolation;
            writePosition();

            const isSettled =
                Math.abs(targetX - currentX) < SETTLE_DISTANCE &&
                Math.abs(targetY - currentY) < SETTLE_DISTANCE;

            frame = !isHovering || isSettled ? 0 : requestAnimationFrame(tick);
        };

        const ensureLoop = () => {
            if (!frame) {
                lastTime = performance.now();
                frame = requestAnimationFrame(tick);
            }
        };

        const moveTo = (event: PointerEvent) => {
            targetX = event.clientX;
            targetY = event.clientY;
        };

        const onPointerEnter = (event: PointerEvent) => {
            if (event.pointerType === "touch") {
                return;
            }

            /* Keep the already-visible cursor as the owner while travelling
               between cards. Its document-level move handler continues to
               follow the pointer, so no second cursor needs to fade in. */
            const activeCursor = document.querySelector<HTMLElement>(
                '[data-active="true"]',
            );

            if (activeCursor && activeCursor !== cursor) {
                return;
            }

            moveTo(event);
            currentX = targetX;
            currentY = targetY;
            isHovering = true;
            cursor.dataset.active = "true";
            writePosition();
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!isHovering || event.pointerType === "touch") {
                return;
            }

            moveTo(event);
            ensureLoop();
        };

        const deactivate = () => {
            isHovering = false;
            cursor.dataset.active = "false";

            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        };

        const onPointerLeave = (event: PointerEvent) => {
            if (!isInsideCursorZone(event.relatedTarget)) {
                deactivate();
            }
        };

        const onDocumentPointerMove = (event: PointerEvent) => {
            if (!isHovering || event.pointerType === "touch") {
                return;
            }

            if (!isInsideCursorZone(event.target)) {
                deactivate();
                return;
            }

            moveTo(event);
            ensureLoop();
        };

        card.addEventListener("pointerenter", onPointerEnter);
        card.addEventListener("pointermove", onPointerMove);
        card.addEventListener("pointerleave", onPointerLeave);
        card.addEventListener("pointercancel", onPointerLeave);
        document.addEventListener("pointermove", onDocumentPointerMove);
        document.addEventListener("visibilitychange", deactivate);

        const visibilityObserver =
            "IntersectionObserver" in window
                ? new IntersectionObserver(([entry]) => {
                      if (!entry?.isIntersecting) {
                          deactivate();
                      }
                  })
                : null;
        visibilityObserver?.observe(card);

        return () => {
            card.removeEventListener("pointerenter", onPointerEnter);
            card.removeEventListener("pointermove", onPointerMove);
            card.removeEventListener("pointerleave", onPointerLeave);
            card.removeEventListener("pointercancel", onPointerLeave);
            document.removeEventListener("pointermove", onDocumentPointerMove);
            document.removeEventListener("visibilitychange", deactivate);
            visibilityObserver?.disconnect();

            if (frame) {
                cancelAnimationFrame(frame);
            }

            cursor.dataset.active = "false";
        };
    }, [cardRef, cursorRef, enabled]);
}
