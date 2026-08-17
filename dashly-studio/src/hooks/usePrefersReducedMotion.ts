import { useMediaQuery } from "./useMediaQuery";

/**
 * Whether the user has asked the OS to reduce motion.
 *
 * CSS-driven animation already honours this automatically, because every
 * `--duration-*` token collapses to 1ms under `prefers-reduced-motion`
 * (see `src/styles/tokens/motion.css`).
 *
 * This hook is for the cases CSS cannot reach: skipping a JS-driven scroll
 * effect, disabling autoplay, or not mounting a decorative canvas at all.
 */
export function usePrefersReducedMotion(): boolean {
    return useMediaQuery("(prefers-reduced-motion: reduce)");
}
