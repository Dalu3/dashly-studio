import { useSyncExternalStore } from "react";

import { mediaUp, type Breakpoint } from "@/constants/breakpoints";

/**
 * Subscribes to a CSS media query.
 *
 * Uses `useSyncExternalStore` rather than useState + useEffect so the first
 * render already has the correct value — no layout flash from a wrong initial
 * `false`, and no tearing under concurrent rendering.
 *
 * The server snapshot returns `false`, i.e. the mobile-first base case.
 */
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onStoreChange) => {
            const mediaQueryList = window.matchMedia(query);
            mediaQueryList.addEventListener("change", onStoreChange);

            return () => {
                mediaQueryList.removeEventListener("change", onStoreChange);
            };
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

/**
 * Convenience wrapper for the named breakpoints.
 *
 * Prefer CSS for layout decisions — reach for this only when the DIFFERENCE is
 * behavioural (e.g. rendering a drawer instead of an inline nav), not visual.
 *
 * @example const isDesktop = useBreakpointUp("lg");
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
    return useMediaQuery(mediaUp(breakpoint));
}
