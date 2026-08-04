/**
 * A small, continuous, ALWAYS-GATED animation loop that exists for exactly
 * one thing: driving `uTime` for strand.vert's idle sway, so the fur never
 * reads as a static prop even when nothing is touching it.
 *
 * This is deliberately separate from cursorInteraction.ts's own loop, which
 * stops the instant its springs settle — an idle-motion loop can't do that,
 * it has to keep running for as long as the fur is visible at all. That
 * makes it the one piece of this whole system that runs continuously, so it
 * is gated hard on three independent conditions, any one of which stops it:
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
    /** Called every active frame with elapsed seconds since creation. */
    setTime: (seconds: number) => void;
    /** Called after `setTime`, so the host can request a render. */
    onFrame: () => void;
    /** If true, the loop never starts at all. */
    reducedMotion: boolean;
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

    const { viewportElement, setTime, onFrame } = options;

    const start = performance.now();
    let frameId = 0;
    let running = false;
    let visible = false;
    let disposed = false;

    const tick = (now: number) => {
        if (disposed) {
            return;
        }

        setTime((now - start) / 1000);
        onFrame();
        frameId = requestAnimationFrame(tick);
    };

    const shouldRun = () => visible && !document.hidden;

    const startLoop = () => {
        if (!running && shouldRun()) {
            running = true;
            frameId = requestAnimationFrame(tick);
        }
    };

    const stopLoop = () => {
        if (running) {
            running = false;
            cancelAnimationFrame(frameId);
        }
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
