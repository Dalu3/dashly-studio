/**
 * Breakpoints — the JavaScript mirror of the `--bp-*` tokens in
 * `src/styles/tokens/layout.css`.
 *
 * Two sources of truth is normally a smell, but CSS custom properties cannot be
 * used inside `@media` queries and media queries cannot be read out of CSS from
 * JS. The values are duplicated here deliberately and must be kept in sync with
 * layout.css. That is the whole reason this file is small and does nothing else.
 *
 * Mobile-first: every value is a `min-width` threshold.
 */

export const BREAKPOINTS = {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Builds a mobile-first `min-width` media query string for a named breakpoint.
 *
 * @example mediaUp("md") // "(min-width: 48rem)"
 */
export function mediaUp(breakpoint: Breakpoint): string {
    return `(min-width: ${BREAKPOINTS[breakpoint] / 16}rem)`;
}
