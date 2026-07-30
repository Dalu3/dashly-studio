import { useMemo, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useHeroParallax, type ParallaxDebug } from "@/hooks/useHeroParallax";
import { cn } from "@/utils/cn";

import styles from "./HeroBackground.module.css";

export interface HeroBackgroundProps {
    className?: string;
    /** Diagnostics only. Called once per animation frame. */
    onScrollSample?: (debug: ParallaxDebug) => void;
}

/**
 * Decorative animated satin-fabric background for the Hero.
 *
 * DOM shape — the parallax wrapper and the idle layer are separate elements on
 * purpose, so their transforms cannot overwrite each other:
 *
 *   .root
 *     └── .parallax   transform written per frame by useHeroParallax  ← scroll
 *           └── .layer  transform: <keyframes>                        ← idle
 *
 * Idle drift is pure CSS: four layers on closed-loop keyframes at four mutually
 * non-harmonic durations (9s, 11s, 13s, 14s), so they never resynchronise and
 * the loop point is never visible. Scroll parallax is one rAF loop writing five
 * transforms directly.
 *
 * No React state is touched while scrolling, so scrolling causes zero renders.
 * Under `prefers-reduced-motion` the hook parks the layers and the CSS drops
 * the animation, leaving the full static composition.
 *
 * Accessibility: the whole subtree is `aria-hidden` and `pointer-events: none`,
 * so it is invisible to assistive technology and cannot swallow clicks or
 * interfere with text selection in the Hero content layered above it.
 */
export function HeroBackground({
    className,
    onScrollSample,
}: HeroBackgroundProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLDivElement>(null);
    const depthRef = useRef<HTMLDivElement>(null);
    const streakARef = useRef<HTMLDivElement>(null);
    const streakBRef = useRef<HTMLDivElement>(null);
    const streakCRef = useRef<HTMLDivElement>(null);
    const streakDRef = useRef<HTMLDivElement>(null);
    const sheenRef = useRef<HTMLDivElement>(null);

    const prefersReducedMotion = usePrefersReducedMotion();

    // Travel at full scroll progress, as a % of the hero box. Back layers move
    // least and the soft foreground sheen most — that spread is the depth cue.
    // Horizontal alternates sign so scrolling shears the weave diagonally
    // rather than sliding it straight down like a blind.
    //
    // Sized against the overhang budget: a layer overhangs by 40% of the hero
    // and idle drift peaks near 22% of it, so the deepest parallax stays at
    // 22% — the layers' 1.05-1.10 scale covers the remainder.
    const targets = useMemo(
        () => [
            { ref: baseRef, x: -1, y: 3 },
            { ref: depthRef, x: 2.2, y: 6 },
            { ref: streakARef, x: -4, y: 9.5 },
            { ref: streakBRef, x: 6, y: 12.5 },
            { ref: streakCRef, x: -7.5, y: 15.5 },
            { ref: streakDRef, x: 9, y: 18 },
            { ref: sheenRef, x: -10, y: 20 },
        ],
        [],
    );

    useHeroParallax(rootRef, targets, !prefersReducedMotion, onScrollSample);

    return (
        <div
            ref={rootRef}
            className={cn(styles.root, className)}
            aria-hidden="true"
        >
            <div ref={baseRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.base)} />
            </div>
            <div ref={depthRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.depth)} />
            </div>
            <div ref={streakARef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.streakA)} />
            </div>
            <div ref={streakBRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.streakB)} />
            </div>
            <div ref={streakCRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.streakC)} />
            </div>
            <div ref={streakDRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.streakD)} />
            </div>
            <div ref={sheenRef} className={styles.parallax}>
                <div className={cn(styles.layer, styles.sheen)} />
            </div>
        </div>
    );
}
