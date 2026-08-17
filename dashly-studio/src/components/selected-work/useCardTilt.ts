import { useEffect, type RefObject } from "react";

/**
 * Per-card side hover tilt — entirely independent of the carousel's scroll
 * physics (`useDragCarousel`). It listens to the image frame and writes its
 * own CSS custom properties on the card; `ProjectCard.module.css` composes
 * them with the scroll-driven values into one transform on the complete card.
 * The image never moves by itself.
 *
 * Mouse/trackpad only: the actual pointer event identifies touch input instead
 * of relying on a media query, which can report a coarse primary pointer on
 * hybrid devices even while a mouse is active.
 */

/** The pointer adds a readable but restrained side-to-side lean. */
const SIDE_TILT_Y_DEG = 5.5;
const CENTER_DEAD_ZONE = 0.08;
/** Exponential response reaches the target monotonically, so hover can never
 *  overshoot, bounce or oscillate around the requested angle. */
const TILT_RESPONSE = 11;
const REST_EPSILON_DEG = 0.005;

interface TiltTarget {
    tiltX: number;
    tiltY: number;
}

const RESTING_TARGET: TiltTarget = { tiltX: 0, tiltY: 0 };

export function useCardTilt(
    cardRef: RefObject<HTMLElement | null>,
    pointerTargetRef?: RefObject<HTMLElement | null>,
) {
    useEffect(() => {
        const card = cardRef.current;
        const imageFrame = pointerTargetRef?.current;

        if (!card || !imageFrame) {
            return undefined;
        }

        const pointerTarget = card;

        const current: TiltTarget = { tiltX: 0, tiltY: 0 };

        let target: TiltTarget = RESTING_TARGET;
        let frame = 0;
        let lastTime = 0;

        const write = () => {
            card.style.setProperty(
                "--pointer-tilt-x",
                `${current.tiltX.toFixed(3)}deg`,
            );
            card.style.setProperty(
                "--pointer-tilt-y",
                `${current.tiltY.toFixed(3)}deg`,
            );
        };

        const isAtRest = () =>
            (Object.keys(current) as (keyof TiltTarget)[]).every(
                (key) => Math.abs(current[key] - target[key]) < REST_EPSILON_DEG,
            );

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - lastTime) / 1000 || 1 / 60);
            lastTime = now;

            const interpolation = 1 - Math.exp(-TILT_RESPONSE * dt);

            (Object.keys(current) as (keyof TiltTarget)[]).forEach((key) => {
                current[key] += (target[key] - current[key]) * interpolation;
            });

            if (isAtRest()) {
                current.tiltX = target.tiltX;
                current.tiltY = target.tiltY;
            }

            write();

            frame = isAtRest() ? 0 : requestAnimationFrame(tick);
        };

        const ensureLoop = () => {
            if (!frame) {
                lastTime = performance.now();
                frame = requestAnimationFrame(tick);
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") {
                return;
            }

            const rect = pointerTarget.getBoundingClientRect();
            const imageBottom = rect.top + imageFrame.offsetHeight;

            // The article is deliberately the stable, untransformed hit area.
            // Only its image-height portion drives tilt; moving over the text
            // returns the card to rest without letting a rotating boundary
            // repeatedly fire pointerleave/pointerenter near its edges.
            if (event.clientY < rect.top || event.clientY > imageBottom) {
                target = RESTING_TARGET;
                ensureLoop();
                return;
            }

            // Normalized to [-1, 1] on each axis, origin at the image center.
            const normalX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const tiltY =
                Math.abs(normalX) <= CENTER_DEAD_ZONE
                    ? 0
                    : Math.sign(normalX) * SIDE_TILT_Y_DEG;

            target = {
                // Stable left/centre/right zones avoid tiny cursor movements
                // continuously retargeting the animation. Perspective on the
                // carousel supplies the depth; hover only needs rotateY.
                tiltX: 0,
                tiltY,
            };

            ensureLoop();
        };

        const onPointerLeave = () => {
            target = RESTING_TARGET;
            ensureLoop();
        };

        pointerTarget.addEventListener("pointerenter", onPointerMove);
        pointerTarget.addEventListener("pointermove", onPointerMove);
        pointerTarget.addEventListener("pointerleave", onPointerLeave);

        return () => {
            pointerTarget.removeEventListener("pointerenter", onPointerMove);
            pointerTarget.removeEventListener("pointermove", onPointerMove);
            pointerTarget.removeEventListener("pointerleave", onPointerLeave);

            if (frame) {
                cancelAnimationFrame(frame);
            }

            card.style.removeProperty("--pointer-tilt-x");
            card.style.removeProperty("--pointer-tilt-y");
        };
    }, [cardRef, pointerTargetRef]);
}
