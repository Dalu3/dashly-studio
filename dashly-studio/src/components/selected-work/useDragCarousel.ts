import { useEffect, type RefObject } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { isSpringAtRest, springStep, type SpringState } from "./springStep";

/**
 * Pointer-driven horizontal carousel: drag, flick, inertia, snap, plus a
 * cinematic scroll-tilt layer on top.
 *
 * Everything below runs OUTSIDE React. The offset lives in a closure variable
 * and is written straight to `track.style.transform`, so a drag causes zero
 * re-renders and zero style recalculation beyond the composited transform
 * itself. Nothing in the hot path reads layout, so there is no read/write
 * interleaving and therefore no layout thrashing — measurements happen only on
 * mount and on resize, never during a gesture.
 *
 * Why custom physics instead of `scroll-snap`: native mandatory snapping cannot
 * express "carry the flick's momentum, then settle on whichever card that
 * momentum was heading for". It snaps to the neighbour and stops. The
 * projection below is what makes a fast flick cross several cards and still
 * come to rest cleanly aligned.
 *
 * The scroll-tilt layer (search "TILT" below) is a second, independent system
 * bolted onto the same measurements: it never touches `offset`, `raw` or the
 * snap logic above — it only READS `offset` each frame. Cards have no
 * cursor-driven transform, so hover can never change their resting pose.
 *
 * Scroll-tilt is driven ENTIRELY by scroll velocity — never by a card's
 * position. At rest (velocity 0) the target is always exactly 0deg, so
 * every card is perfectly flat and the temporary inline tilt values are
 * removed. It's `rotateY` (with a very small `rotateX` riding along for
 * depth), one shared value written once on `track` and inherited by every
 * `.card` (ordinary CSS custom-property inheritance) — the whole visible
 * strip leans together, like inertia acting on one physical object, not each
 * card independently. The spring is tuned for ZERO overshoot (see
 * TILT_STIFFNESS/TILT_DAMPING below): no bounce, no wobble, just a smooth rise
 * while scrolling and a smooth fall back to exactly flat once it stops.
 */

/** Velocity retained per 60fps frame after release. 0.94 ≈ a 280ms glide. */
const FRICTION = 0.94;
const FRAME_MS = 1000 / 60;

/**
 * How far a flick would travel if left to decay on its own. This is the closed
 * form of the geometric series `Σ v·FRICTION^n` — using it means the snap
 * target is chosen from where the gesture was actually going, not from where
 * the finger happened to leave the screen.
 */
const PROJECTION_MS = FRAME_MS / (1 - FRICTION);

/** Resistance past the first/last card. Lower = stiffer edge. */
const RUBBER_BAND = 0.35;

/** Movement under this many px is a click, not a drag. */
const DRAG_THRESHOLD = 4;

/** Settle animation bounds. Long drags get more time, but never sluggish. */
const MIN_SETTLE_MS = 380;
const MAX_SETTLE_MS = 900;
const SETTLE_MS_PER_PX = 1.2;

/** Weight of the newest sample in the velocity average. Lower = smoother, but
 *  slower to notice a direction change mid-drag. */
const VELOCITY_SMOOTHING = 0.22;

/** Trackpad horizontal scrolling settles once it has been quiet this long. */
const WHEEL_SETTLE_DELAY_MS = 140;

// ---- TILT: tuning ---------------------------------------------------------

/** Rotation per (px/sec) of on-screen track velocity — the ONLY input to
 *  scroll-tilt. The target is negated at the use site so the visual lean is
 *  always opposite to the direction the cards are moving. At rest (velocity
 *  0) this always evaluates to 0deg. */
const VELOCITY_TILT_DEG = 0.016;
/** Ceiling — brief asks for "very subtle", 4-8deg. */
const MAX_ROTATE_Y_DEG = 8;
/** The X-axis contribution is a sliver of the (already-smoothed) rotateY
 *  value — never its own input or spring, so it can't lead or lag it. */
const ROTATE_X_RATIO = 0.2;
/** Touch/coarse-pointer devices keep scroll-tilt but softer, per the brief. */
const MOBILE_TILT_SCALE = 0.6;
/** Tuned via a standalone step simulation for ZERO overshoot: settles in
 *  ~0.7s with no bounce past target — "no bouncing, no sudden snapping, no
 *  wobbling" ruled out the springier overshoot-and-settle style used
 *  elsewhere in this file (the position SETTLE animation is a different,
 *  intentionally snappy thing and is untouched). */
const TILT_STIFFNESS = 190;
const TILT_DAMPING = 0.6;
/** Pointer events do not necessarily arrive on every animation frame. Retain
 *  the last measured velocity briefly so the spring has time to express the
 *  gesture, then decay it smoothly to an exact rest without wobble. */
const TILT_VELOCITY_RETENTION = 0.86;
const TILT_VELOCITY_REST_PX_PER_SECOND = 4;

export interface DragCarouselOptions {
    /** Applied to the viewport while a drag is in progress — drives the
     *  `grabbing` cursor and suppresses hover effects mid-gesture. */
    draggingClassName?: string;
    /** Applied until all scroll-driven movement and tilt have settled. */
    movingClassName?: string;
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

/** No overshoot, decelerating — reads as a continuation of the flick rather
 *  than as a separate animation starting from rest. (Position settle only —
 *  the scroll-TILT layer above has its own, separately-tuned spring.) */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function useDragCarousel(
    viewportRef: RefObject<HTMLElement | null>,
    trackRef: RefObject<HTMLElement | null>,
    { draggingClassName, movingClassName }: DragCarouselOptions = {},
) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isCoarsePointer = useMediaQuery("(pointer: coarse)");

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;

        if (!viewport || !track) {
            return undefined;
        }

        /** Current translate, in px. 0 = start, negative = scrolled right. */
        let offset = 0;
        /** Undamped drag position — kept apart from `offset` so the rubber band
         *  at the edges is computed from the true finger travel each move
         *  instead of compounding a damped value into itself. */
        let raw = 0;
        /** Most negative reachable offset (0 when everything already fits). */
        let minOffset = 0;
        /** Rest positions, one per card, already clamped into range. */
        let snapPoints: number[] = [0];

        let dragging = false;
        let activePointer: number | null = null;
        let startX = 0;
        let lastX = 0;
        let lastTime = 0;
        let velocity = 0;
        let movedPastThreshold = false;

        let settleFrame = 0;
        let wheelTimer = 0;
        let cards: HTMLElement[] = [];

        // ---- TILT: state ----------------------------------------------------
        /** One shared spring — the whole visible strip leans together. */
        const rotationY: SpringState = { value: 0, velocity: 0 };
        let rotationYTarget = 0;
        let tiltFrame = 0;
        let tiltPrevOffset = 0;
        let tiltPrevTime = 0;
        let tiltVelocity = 0;

        const write = () => {
            track.style.transform = `translate3d(${offset}px, 0, 0)`;
        };

        const cancelSettle = () => {
            if (settleFrame) {
                cancelAnimationFrame(settleFrame);
                settleFrame = 0;
            }
        };

        /**
         * Recomputes bounds and snap positions. The only place that reads
         * layout — called on mount and on resize, never during a gesture.
         *
         * `offsetLeft` is layout-based and so is unaffected by the transform we
         * are applying, which is what makes measuring mid-animation safe. It is
         * relative to the track because the track is `position: relative`.
         */
        const measure = () => {
            cards = Array.from(track.children) as HTMLElement[];
            const first = cards[0];
            const last = cards[cards.length - 1];

            if (!first || !last) {
                snapPoints = [0];
                minOffset = 0;
                return;
            }

            const paddingRight =
                parseFloat(getComputedStyle(track).paddingRight) || 0;
            const contentWidth =
                last.offsetLeft + last.offsetWidth + paddingRight;

            minOffset = Math.min(0, viewport.clientWidth - contentWidth);

            // Snapping aligns each card to wherever the FIRST card naturally
            // sits, so cards always come to rest on the page gutter without
            // this hook needing to know what the gutter is.
            const base = first.offsetLeft;
            snapPoints = cards.map((card) =>
                clamp(-(card.offsetLeft - base), minOffset, 0),
            );

            offset = clamp(offset, minOffset, 0);
            raw = offset;
            write();
        };

        const nearestSnapIndex = (position: number) => {
            let bestIndex = 0;
            let bestDistance = Infinity;

            snapPoints.forEach((point, index) => {
                const distance = Math.abs(position - point);

                if (distance < bestDistance) {
                    bestIndex = index;
                    bestDistance = distance;
                }
            });

            return bestIndex;
        };

        const nearestSnap = (position: number) =>
            snapPoints[nearestSnapIndex(position)] ?? 0;

        const settleTo = (target: number) => {
            cancelSettle();

            const from = offset;
            const delta = target - from;

            if (Math.abs(delta) < 0.5) {
                offset = target;
                raw = target;
                write();
                ensureTiltLoop();
                return;
            }

            const duration = clamp(
                Math.abs(delta) * SETTLE_MS_PER_PX,
                MIN_SETTLE_MS,
                MAX_SETTLE_MS,
            );
            const start = performance.now();

            const step = (now: number) => {
                const progress = Math.min(1, (now - start) / duration);

                offset = from + delta * easeOutCubic(progress);
                write();

                if (progress < 1) {
                    settleFrame = requestAnimationFrame(step);
                    return;
                }

                settleFrame = 0;
                raw = offset;
            };

            settleFrame = requestAnimationFrame(step);
            ensureTiltLoop();
        };

        /** Where the flick was heading → the card that lands under it. */
        const settleFromVelocity = () => {
            const projected = clamp(
                offset + velocity * PROJECTION_MS,
                minOffset,
                0,
            );

            settleTo(nearestSnap(projected));
        };

        const goToIndex = (index: number) => {
            const target = snapPoints[clamp(index, 0, snapPoints.length - 1)];

            if (target !== undefined) {
                settleTo(target);
            }
        };

        const currentIndex = () => nearestSnapIndex(offset);

        // ---- TILT: per-frame loop --------------------------------------------

        const tickTilt = (now: number) => {
            const dt = Math.min(0.05, (now - tiltPrevTime) / 1000 || FRAME_MS / 1000);
            const offsetDelta = offset - tiltPrevOffset;

            if (Math.abs(offsetDelta) > 0.01) {
                tiltVelocity = offsetDelta / dt;
            } else {
                tiltVelocity *= TILT_VELOCITY_RETENTION;

                if (Math.abs(tiltVelocity) < TILT_VELOCITY_REST_PX_PER_SECOND) {
                    tiltVelocity = 0;
                }
            }

            tiltPrevOffset = offset;
            tiltPrevTime = now;

            const intensity = isCoarsePointer ? MOBILE_TILT_SCALE : 1;

            // Cards lean opposite to their on-screen movement. `offset` is the
            // track's on-screen translation, so negate its velocity here:
            // moving right produces a leftward lean and vice versa. At rest,
            // retained velocity is exactly 0, so this is exactly 0 too.
            rotationYTarget = prefersReducedMotion
                ? 0
                : clamp(
                      -tiltVelocity * VELOCITY_TILT_DEG * intensity,
                      -MAX_ROTATE_Y_DEG,
                      MAX_ROTATE_Y_DEG,
                  );

            springStep(rotationY, rotationYTarget, TILT_STIFFNESS, TILT_DAMPING, dt);

            // Written once, on the track, and inherited by every `.card` —
            // the whole visible strip leans together as one object.
            track.style.setProperty("--tilt-rotate-y", `${rotationY.value.toFixed(3)}deg`);
            track.style.setProperty(
                "--tilt-rotate-x",
                `${(rotationY.value * ROTATE_X_RATIO).toFixed(3)}deg`,
            );

            // Reaching a non-zero moving target is not a resting state. The
            // loop must keep running so retained velocity can decay and pull
            // the card all the way back to 0deg. Stopping here used to leave
            // the last non-zero custom property frozen on every card.
            const atRest =
                rotationYTarget === 0 && isSpringAtRest(rotationY, rotationYTarget);

            if (atRest) {
                // Do not leave a fractional residual custom property behind.
                // Removing both values makes the CSS fallback the authoritative
                // idle state: cards are flat without a stale inline transform
                // signal waiting to be composed with the next gesture.
                rotationY.value = 0;
                rotationY.velocity = 0;
                track.style.removeProperty("--tilt-rotate-y");
                track.style.removeProperty("--tilt-rotate-x");

                if (movingClassName) {
                    viewport.classList.remove(movingClassName);
                }
            }

            tiltFrame = atRest ? 0 : requestAnimationFrame(tickTilt);
        };

        const ensureTiltLoop = (previousOffset = offset) => {
            if (movingClassName) {
                viewport.classList.add(movingClassName);
            }

            if (!tiltFrame) {
                tiltPrevTime = performance.now();
                // Preserve the movement that started the loop. If we sample
                // from the already-updated offset, short drags and wheel
                // gestures lose their first velocity frame and appear flat.
                tiltPrevOffset = previousOffset;
                tiltFrame = requestAnimationFrame(tickTilt);
            }
        };

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }

            cancelSettle();

            dragging = true;
            activePointer = event.pointerId;
            movedPastThreshold = false;
            startX = event.clientX;
            lastX = event.clientX;
            lastTime = event.timeStamp;
            velocity = 0;
            raw = offset;

            // Capture keeps the gesture alive when the pointer leaves the
            // viewport mid-drag. It throws if the pointer is already gone by
            // the time we get here, which must not take the drag down with it.
            try {
                viewport.setPointerCapture(event.pointerId);
            } catch {
                /* capture is an enhancement, not a requirement */
            }

            if (draggingClassName) {
                viewport.classList.add(draggingClassName);
            }

        };

        const onPointerMove = (event: PointerEvent) => {
            if (!dragging || event.pointerId !== activePointer) {
                return;
            }

            const dx = event.clientX - lastX;
            const dt = Math.max(1, event.timeStamp - lastTime);

            lastX = event.clientX;
            lastTime = event.timeStamp;

            if (Math.abs(event.clientX - startX) > DRAG_THRESHOLD) {
                movedPastThreshold = true;
            }

            velocity =
                velocity * (1 - VELOCITY_SMOOTHING) +
                (dx / dt) * VELOCITY_SMOOTHING;

            const previousOffset = offset;
            raw += dx;

            // Past either end the content follows the finger at a fraction of
            // its speed, then the release below snaps it back inside.
            if (raw > 0) {
                offset = raw * RUBBER_BAND;
            } else if (raw < minOffset) {
                offset = minOffset + (raw - minOffset) * RUBBER_BAND;
            } else {
                offset = raw;
            }

            write();
            // A paused drag can let the tilt spring reach rest. Restart it on
            // the next movement so the response stays velocity-driven during
            // the whole gesture.
            ensureTiltLoop(previousOffset);
        };

        const endDrag = (event: PointerEvent) => {
            if (!dragging || event.pointerId !== activePointer) {
                return;
            }

            dragging = false;
            activePointer = null;

            if (viewport.hasPointerCapture(event.pointerId)) {
                viewport.releasePointerCapture(event.pointerId);
            }

            if (draggingClassName) {
                viewport.classList.remove(draggingClassName);
            }

            // A gesture that got long enough to be a drag must not also fire a
            // click on whatever card it started on.
            if (movedPastThreshold) {
                viewport.addEventListener("click", suppressClick, {
                    capture: true,
                    once: true,
                });
            }

            settleFromVelocity();
        };

        const onPointerCancel = (event: PointerEvent) => {
            // Fires when the browser takes the gesture over for vertical page
            // scrolling. Drop the momentum and just tidy up the position.
            velocity = 0;
            endDrag(event);
        };

        const suppressClick = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        /**
         * Trackpad / horizontal-wheel support. Only claims genuinely horizontal
         * intent, so vertical page scrolling over the carousel is untouched.
         */
        const onWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
                return;
            }

            event.preventDefault();
            cancelSettle();

            const previousOffset = offset;
            offset = clamp(offset - event.deltaX, minOffset, 0);
            raw = offset;
            write();
            ensureTiltLoop(previousOffset);

            window.clearTimeout(wheelTimer);
            wheelTimer = window.setTimeout(() => {
                settleTo(nearestSnap(offset));
            }, WHEEL_SETTLE_DELAY_MS);
        };

        /** Drag-only would leave the carousel unusable by keyboard. */
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault();
                    goToIndex(currentIndex() + 1);
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    goToIndex(currentIndex() - 1);
                    break;
                case "Home":
                    event.preventDefault();
                    goToIndex(0);
                    break;
                case "End":
                    event.preventDefault();
                    goToIndex(snapPoints.length - 1);
                    break;
                default:
                    break;
            }
        };

        const onDragStart = (event: Event) => {
            // Native image/text dragging would hijack the gesture.
            event.preventDefault();
        };

        measure();

        const observer = new ResizeObserver(() => {
            cancelSettle();
            measure();
            settleTo(nearestSnap(offset));
        });
        observer.observe(viewport);
        observer.observe(track);

        viewport.addEventListener("pointerdown", onPointerDown);
        viewport.addEventListener("pointermove", onPointerMove);
        viewport.addEventListener("pointerup", endDrag);
        viewport.addEventListener("pointercancel", onPointerCancel);
        viewport.addEventListener("wheel", onWheel, { passive: false });
        viewport.addEventListener("keydown", onKeyDown);
        viewport.addEventListener("dragstart", onDragStart);

        return () => {
            observer.disconnect();
            cancelSettle();
            window.clearTimeout(wheelTimer);

            if (tiltFrame) {
                cancelAnimationFrame(tiltFrame);
                tiltFrame = 0;
            }

            track.style.removeProperty("--tilt-rotate-y");
            track.style.removeProperty("--tilt-rotate-x");

            viewport.removeEventListener("pointerdown", onPointerDown);
            viewport.removeEventListener("pointermove", onPointerMove);
            viewport.removeEventListener("pointerup", endDrag);
            viewport.removeEventListener("pointercancel", onPointerCancel);
            viewport.removeEventListener("wheel", onWheel);
            viewport.removeEventListener("keydown", onKeyDown);
            viewport.removeEventListener("dragstart", onDragStart);
            viewport.removeEventListener("click", suppressClick, {
                capture: true,
            });

            if (draggingClassName) {
                viewport.classList.remove(draggingClassName);
            }

            if (movingClassName) {
                viewport.classList.remove(movingClassName);
            }
        };
    }, [
        viewportRef,
        trackRef,
        draggingClassName,
        movingClassName,
        prefersReducedMotion,
        isCoarsePointer,
    ]);
}
