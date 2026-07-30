import { useEffect, useRef, type RefObject } from "react";

/**
 * Fraction of the remaining distance covered per frame.
 *
 * 0.09 was too slow: mid-gesture the eased value trailed the raw one by ~3x
 * (measured: raw 0.55 vs eased 0.17), so most of the parallax never actually
 * appeared while the user was scrolling. 0.14 still lags visibly enough to
 * feel soft and to keep gliding after the gesture ends, but it now keeps up
 * during the gesture, which is when the effect has to be seen.
 */
const EASING_FACTOR = 0.14;

/**
 * Fraction of the hero's height over which the parallax completes.
 *
 * Previously the progress ramp was the hero's FULL height, which meant peak
 * displacement landed exactly when the hero had finished scrolling out of
 * view — the entire effect was spent on pixels nobody could see. Completing
 * at 45% means the movement builds while the hero still dominates the screen.
 */
const PROGRESS_RANGE = 0.45;

/** Once this close to the target, snap and stop writing. */
const SETTLE_EPSILON = 0.0004;

export interface ParallaxTarget {
    ref: RefObject<HTMLElement | null>;
    /** Horizontal travel at full progress, as a % of the hero's width. */
    x: number;
    /** Vertical travel at full progress, as a % of the hero's height. */
    y: number;
}

export interface ParallaxDebug {
    rawProgress: number;
    easedProgress: number;
    frames: number;
    fps: number;
    scrollSource: string;
}

/**
 * Identifies the element that actually scrolls this document.
 *
 * Exported for diagnostics: which element scrolls depends on how `overflow` is
 * set on `html`/`body`, and getting it wrong is a classic reason parallax
 * silently does nothing.
 */
export function getScrollSource(): Element {
    return document.scrollingElement ?? document.documentElement;
}

/**
 * Scroll-driven parallax for the Hero background layers.
 *
 * Two deliberate choices, both learned the hard way here:
 *
 * 1. No scroll listeners. The event target depends on which element owns the
 *    viewport's overflow, element scroll events do not bubble, and in a
 *    throttled document they are not dispatched at all because they are
 *    delivered on the frame boundary. Reading `getBoundingClientRect()` inside
 *    a rAF loop is correct no matter what scrolls — window, documentElement,
 *    body, or a nested container.
 *
 * 2. Transforms are written STRAIGHT onto each layer's style. The earlier
 *    version set one custom property on the container and let CSS `calc()`
 *    derive each layer's transform — but changing a custom property
 *    invalidates style for every descendant, which meant touching four large
 *    blurred layers on every frame. Writing five transforms directly touches
 *    only the five wrapper elements and keeps the blurred children untouched.
 *
 * The loop is bounded by an IntersectionObserver, so it stops entirely once
 * the hero scrolls off screen. No React state, so scrolling causes no renders.
 *
 * @param containerRef Element whose scroll progress drives the effect.
 * @param targets      Layers to move, with their per-layer travel.
 * @param enabled      Pass false to opt out (reduced motion).
 * @param onSample     Optional per-frame diagnostics callback.
 */
export function useHeroParallax(
    containerRef: RefObject<HTMLElement | null>,
    targets: ParallaxTarget[],
    enabled = true,
    onSample?: (debug: ParallaxDebug) => void,
): void {
    // Held in refs so changing identity never restarts the loop.
    const targetsRef = useRef(targets);
    targetsRef.current = targets;

    const sampleRef = useRef(onSample);
    sampleRef.current = onSample;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        if (!enabled) {
            // Reduced motion: park every layer at rest and never loop.
            for (const { ref } of targetsRef.current) {
                if (ref.current) {
                    ref.current.style.transform = "";
                }
            }

            return;
        }

        let target = 0;
        let current = 0;
        let frameId = 0;
        let looping = false;
        let onScreen = true;
        let frames = 0;
        let lastFpsAt = performance.now();
        let framesAtLastFps = 0;
        let fps = 0;

        const measure = () => {
            const rect = container.getBoundingClientRect();
            // Ramp over a FRACTION of the hero's height, so the effect is fully
            // expressed while the hero is still on screen rather than after it
            // has left. Clamped, so over-scroll cannot exceed the overhang.
            const span = (rect.height || 1) * PROGRESS_RANGE;
            const raw = -rect.top / span;

            target = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        };

        const paint = () => {
            for (const { ref, x, y } of targetsRef.current) {
                const el = ref.current;

                if (el) {
                    el.style.transform = `translate3d(${(x * current).toFixed(3)}%, ${(y * current).toFixed(3)}%, 0)`;
                }
            }
        };

        const tick = () => {
            measure();
            current += (target - current) * EASING_FACTOR;
            frames += 1;

            const settled = Math.abs(target - current) < SETTLE_EPSILON;

            if (settled) {
                current = target;
            }

            paint();

            const now = performance.now();

            if (now - lastFpsAt >= 500) {
                fps = ((frames - framesAtLastFps) * 1000) / (now - lastFpsAt);
                lastFpsAt = now;
                framesAtLastFps = frames;
            }

            sampleRef.current?.({
                rawProgress: target,
                easedProgress: current,
                frames,
                fps,
                scrollSource: getScrollSource().tagName.toLowerCase(),
            });

            // Keep spinning while on screen: the rect can change with no scroll
            // event at all (momentum, pinch zoom, layout shift, address bar).
            if (onScreen) {
                frameId = requestAnimationFrame(tick);
            } else {
                looping = false;
            }
        };

        const startLoop = () => {
            if (looping) {
                return;
            }

            looping = true;
            frameId = requestAnimationFrame(tick);
        };

        // Seed without easing so a mid-page reload does not animate from zero.
        measure();
        current = target;
        paint();

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (!entry) {
                    return;
                }

                onScreen = entry.isIntersecting;

                if (onScreen) {
                    startLoop();
                }
            },
            { threshold: 0 },
        );

        observer.observe(container);
        startLoop();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
            looping = false;
        };
    }, [containerRef, enabled]);
}
