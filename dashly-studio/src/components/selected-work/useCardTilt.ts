import { useEffect, type RefObject } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { isSpringAtRest, springStep, type SpringState } from "./springStep";

/**
 * Per-card cursor tilt — entirely independent of the carousel's scroll
 * physics (`useDragCarousel`). Writes its own CSS custom properties on the
 * card element; `ProjectCard.module.css` is what composes them together with
 * the scroll-driven ones into a single `transform`. Neither system needs to
 * know the other exists.
 *
 * Desktop/mouse only: guarded by `(hover: hover) and (pointer: fine)` (the
 * same check `ProjectCard.module.css` already uses for its hover-zoom) and by
 * `prefers-reduced-motion`. On touch devices or with reduced motion this hook
 * does nothing — those get scroll-tilt only, per the design brief.
 */

/** Very subtle, per the brief — 2-3deg, not the showier scroll-tilt. */
const MAX_TILT_DEG = 3;
const MAX_TRANSLATE_PX = 6;
const STIFFNESS = 210;
const DAMPING = 0.78;

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

interface TiltTarget {
    tiltX: number;
    tiltY: number;
    tx: number;
    ty: number;
}

const RESTING_TARGET: TiltTarget = { tiltX: 0, tiltY: 0, tx: 0, ty: 0 };

export function useCardTilt(cardRef: RefObject<HTMLElement | null>) {
    const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
    const prefersReducedMotion = usePrefersReducedMotion();
    const enabled = canHover && !prefersReducedMotion;

    useEffect(() => {
        const card = cardRef.current;

        if (!card || !enabled) {
            return undefined;
        }

        const springs: Record<keyof TiltTarget, SpringState> = {
            tiltX: { value: 0, velocity: 0 },
            tiltY: { value: 0, velocity: 0 },
            tx: { value: 0, velocity: 0 },
            ty: { value: 0, velocity: 0 },
        };

        let target: TiltTarget = RESTING_TARGET;
        let frame = 0;
        let lastTime = 0;

        const write = () => {
            card.style.setProperty("--mouse-tilt-x", `${springs.tiltX.value.toFixed(3)}deg`);
            card.style.setProperty("--mouse-tilt-y", `${springs.tiltY.value.toFixed(3)}deg`);
            card.style.setProperty("--mouse-tx", `${springs.tx.value.toFixed(2)}px`);
            card.style.setProperty("--mouse-ty", `${springs.ty.value.toFixed(2)}px`);
        };

        const allSpringsAtRest = () =>
            (Object.keys(springs) as (keyof TiltTarget)[]).every((key) =>
                isSpringAtRest(springs[key], target[key]),
            );

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - lastTime) / 1000 || 1 / 60);
            lastTime = now;

            (Object.keys(springs) as (keyof TiltTarget)[]).forEach((key) => {
                springStep(springs[key], target[key], STIFFNESS, DAMPING, dt);
            });
            write();

            frame = allSpringsAtRest() ? 0 : requestAnimationFrame(tick);
        };

        const ensureLoop = () => {
            if (!frame) {
                lastTime = performance.now();
                frame = requestAnimationFrame(tick);
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") {
                return;
            }

            const rect = card.getBoundingClientRect();
            // Normalized to [-1, 1] on each axis, origin at the card's center.
            const normalX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const normalY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

            target = {
                // Cursor above center tilts the top back (negative rotateX).
                tiltX: clamp(-normalY * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG),
                tiltY: clamp(normalX * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG),
                tx: clamp(normalX * MAX_TRANSLATE_PX, -MAX_TRANSLATE_PX, MAX_TRANSLATE_PX),
                ty: clamp(normalY * MAX_TRANSLATE_PX, -MAX_TRANSLATE_PX, MAX_TRANSLATE_PX),
            };

            ensureLoop();
        };

        const onPointerLeave = () => {
            target = RESTING_TARGET;
            ensureLoop();
        };

        card.addEventListener("pointermove", onPointerMove);
        card.addEventListener("pointerleave", onPointerLeave);

        return () => {
            card.removeEventListener("pointermove", onPointerMove);
            card.removeEventListener("pointerleave", onPointerLeave);

            if (frame) {
                cancelAnimationFrame(frame);
            }

            card.style.removeProperty("--mouse-tilt-x");
            card.style.removeProperty("--mouse-tilt-y");
            card.style.removeProperty("--mouse-tx");
            card.style.removeProperty("--mouse-ty");
        };
    }, [cardRef, enabled]);
}
