/**
 * A small, continuous, ALWAYS-GATED animation loop that exists for exactly
 * one thing: driving `uTime` for strand.vert's idle sway, so the fur never
 * reads as a static prop even when nothing is touching it.
 *
 * It is registered with the same scene-wide frame loop as cursor interaction,
 * but remains gated hard on three independent conditions, any one of which
 * stops it:
 *
 *  - `prefers-reduced-motion` — checked ONCE at creation, never started at
 *    all if set. This is ambient/autoplaying motion, exactly what that
 *    preference exists to suppress, as distinct from the cursor interaction
 *    elsewhere in this system, which only ever moves in direct response to
 *    the user's own pointer.
 *  - `document.hidden` — a backgrounded tab gets no benefit from a
 *    decorative sway no one can see.
 *  - IntersectionObserver on the canvas — scrolled out of view is the same
 *    case as backgrounded, just scroll-triggered instead of tab-triggered.
 */

export interface IdleAnimationOptions {
    /** Observed for visibility — normally the renderer's canvas. */
    viewportElement: HTMLElement;
    /** Called every active idle update with elapsed seconds since creation. */
    setTime: (seconds: number) => void;
    /** The one scene-wide rAF driver shared with cursor interaction. */
    frameLoop: FrameLoopHandle;
    /** If true, the loop never starts at all. */
    reducedMotion: boolean;
    /** Maximum render cadence for the barely-moving breeze. */
    idleFps: number;
}

export interface IdleAnimationHandle {
    dispose: () => void;
}

export function createIdleAnimation(
    options: IdleAnimationOptions,
): IdleAnimationHandle {
    if (options.reducedMotion) {
        return { dispose: () => {} };
    }

    const { viewportElement, setTime, frameLoop } = options;

    const start = performance.now();
    let visible = false;
    let disposed = false;
    let lastUpdate = 0;

    // The shared frame loop still wakes for cursor work at display cadence,
    // while this decorative breeze requests a render only at preset cadence.
    const MIN_FRAME_MS = 1000 / options.idleFps;

    const shouldRun = () => visible && !document.hidden && !disposed;

    const tick = (now: number): FrameTickResult => {
        if (disposed) {
            return { keepRunning: false, needsRender: false };
        }

        if (now - lastUpdate < MIN_FRAME_MS) {
            return { keepRunning: shouldRun(), needsRender: false };
        }

        lastUpdate = now;
        setTime((now - start) / 1000);
        return { keepRunning: shouldRun(), needsRender: true };
    };

    const startLoop = () => {
        if (shouldRun()) {
            frameLoop.request(tick);
        }
    };

    const stopLoop = () => {
        frameLoop.cancel(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            visible = entries.some((entry) => entry.isIntersecting);

            if (shouldRun()) {
                startLoop();
            } else {
                stopLoop();
            }
        },
        // A low threshold — this only has to know "on screen at all", not
        // "mostly on screen"; the hero is usually much taller than the
        // viewport at typical zoom, so a stricter threshold could stay
        // false long after the word itself has scrolled into view.
        { threshold: 0.01 },
    );

    observer.observe(viewportElement);

    const handleVisibilityChange = () => {
        if (shouldRun()) {
            startLoop();
        } else {
            stopLoop();
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return {
        dispose: () => {
            disposed = true;
            stopLoop();
            observer.disconnect();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        },
    };
}
import type { FrameLoopHandle, FrameTickResult } from "./frameLoop";
