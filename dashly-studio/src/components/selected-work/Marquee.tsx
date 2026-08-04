import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";

import styles from "./Marquee.module.css";

export interface MarqueeProps {
    /** ONE copy of the content. The component repeats it as many times as the
     *  viewport needs — never duplicate it yourself. */
    children: ReactNode;
    /** Scroll speed in CSS pixels per second. Constant regardless of how wide
     *  the content or the viewport turn out to be. */
    speed?: number;
    /** Travel direction of the content itself. */
    direction?: "left" | "right";
    className?: string;
}

/** Copies rendered before the first measurement — enough to cover a wide
 *  desktop for the single frame before the ResizeObserver reports back. */
const INITIAL_COPIES = 3;

/**
 * Infinite horizontal ticker.
 *
 * The loop is seamless because of one invariant: the track is translated by
 * EXACTLY one copy's width, and every copy is identical. At the end of the
 * cycle copy N sits pixel-for-pixel where copy N-1 started, so the reset back
 * to 0 is invisible — there is no jump and no pause.
 *
 * Driven by a CSS keyframe animation rather than a rAF loop on purpose: a
 * `transform` animation with no other animated property is handed to the
 * compositor, so it keeps running at display refresh rate even while the main
 * thread is busy (React re-rendering, images decoding, the Hero's WebGL scene).
 * A JS loop would stutter in exactly those moments.
 *
 * Two measurements drive everything, both fed by a ResizeObserver so a font
 * swap or a viewport resize re-derives them:
 *   - copy width  → the translate distance AND the animation duration
 *                   (duration = width / speed keeps the speed constant)
 *   - root width  → how many copies are needed to never expose a gap
 */
export function Marquee({
    children,
    speed = 80,
    direction = "left",
    className,
}: MarqueeProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);

    const [copies, setCopies] = useState(INITIAL_COPIES);
    const [copyWidth, setCopyWidth] = useState(0);

    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const root = rootRef.current;
        const copy = copyRef.current;

        if (!root || !copy) {
            return undefined;
        }

        const measure = () => {
            // Fractional width, not offsetWidth: rounding to whole pixels here
            // would make the loop drift by up to 1px per cycle, which reads as
            // a periodic twitch.
            const width = copy.getBoundingClientRect().width;
            const available = root.getBoundingClientRect().width;

            if (width <= 0) {
                return;
            }

            setCopyWidth(width);
            // +1 so that at the moment the track has travelled a full copy
            // width, the far edge is still covered — that spare copy is what
            // guarantees no empty gap at any point in the cycle.
            setCopies(Math.max(2, Math.ceil(available / width) + 1));
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(root);
        observer.observe(copy);

        return () => observer.disconnect();
    }, [children]);

    const isRunning = copyWidth > 0 && !prefersReducedMotion;

    return (
        <div
            ref={rootRef}
            className={cn(styles.root, className)}
            aria-hidden="true"
        >
            <div
                className={cn(styles.track, isRunning && styles.animated)}
                style={{
                    "--marquee-distance": `${copyWidth}px`,
                    "--marquee-duration": `${copyWidth / speed}s`,
                    "--marquee-direction":
                        direction === "left" ? "normal" : "reverse",
                } as CSSProperties}
            >
                {Array.from({ length: copies }, (_, index) => (
                    <div
                        key={index}
                        ref={index === 0 ? copyRef : undefined}
                        className={styles.copy}
                    >
                        {children}
                    </div>
                ))}
            </div>
        </div>
    );
}
