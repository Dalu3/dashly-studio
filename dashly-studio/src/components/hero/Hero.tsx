import {
    Suspense,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HeroBackground } from "./HeroBackground";

/**
 * Loaded as its own chunk. three.js is ~170KB gzipped, so keeping it out of the
 * main bundle means the Hero's markup and text paint immediately and the 3D
 * word arrives afterwards, rather than blocking first render.
 */
const HelloModel = lazy(() => import("./HelloModel"));
import styles from "./Hero.module.css";

type NavigatorWithCapabilities = Navigator & {
    connection?: { saveData?: boolean };
};

function canEnhanceHero(): boolean {
    const capabilities = navigator as NavigatorWithCapabilities;
    const dataSaver = Boolean(capabilities.connection?.saveData);

    // Mobile/tablet now have dedicated geometry and DPR budgets. The former
    // coarse-pointer / DPR / CPU gate removed HELLO completely on a direct
    // phone load and only appeared to work when DevTools first mounted the
    // desktop version before resizing. Keep the explicit user preference
    // (Save-Data) as the only capability-level opt-out; reduced motion is
    // handled separately by the component.
    return !dataSaver;
}

export interface HeroProps {
    /** Hero content. Intentionally empty for now — text, buttons and the
     *  "hello" wordmark are a later step. */
    children?: ReactNode;
    /** Fires once the 3D "hello" scene has been built, its shaders
     *  compiled, and a first frame actually rendered (forwarded straight
     *  from HelloModel's own onReady — see its comments for exactly what
     *  "ready" means here). App.jsx's loader waits on this rather than on
     *  the asset fetch alone. */
    onReady?: () => void;
}

/**
 * Minimum Hero shell needed to preview the animated background at full size.
 *
 * Deliberately contains no Hero content, no navigation, no logo and no
 * typography. Its only jobs are to be a full-viewport positioning context for
 * <HeroBackground /> and to keep future content structurally separate from the
 * decorative layers.
 */
export function Hero({ children, onReady }: HeroProps) {
    const reducedMotion = usePrefersReducedMotion();
    const [shouldMountModel, setShouldMountModel] = useState(false);
    const enhancementAllowed = useMemo(canEnhanceHero, []);
    const handleModelReady = useCallback(() => onReady?.(), [onReady]);

    useEffect(() => {
        if (!enhancementAllowed) {
            onReady?.();
        }
    }, [enhancementAllowed, onReady]);

    useEffect(() => {
        if (!enhancementAllowed) {
            setShouldMountModel(false);
            return undefined;
        }

        let cancelled = false;
        let timeoutId = 0;
        let idleId = 0;

        const mountModel = () => {
            if (!cancelled) {
                setShouldMountModel(true);
            }
        };
        const scheduleAfterLoad = () => {
            const requestIdle = Reflect.get(window, "requestIdleCallback");

            if (typeof requestIdle === "function") {
                idleId = requestIdle.call(window, mountModel, { timeout: 2000 });
                return;
            }

            timeoutId = window.setTimeout(mountModel, 1200);
        };

        if (document.readyState === "complete") {
            scheduleAfterLoad();
        } else {
            window.addEventListener("load", scheduleAfterLoad, { once: true });
        }

        return () => {
            cancelled = true;
            window.removeEventListener("load", scheduleAfterLoad);
            window.clearTimeout(timeoutId);
            const cancelIdle = Reflect.get(window, "cancelIdleCallback");
            if (idleId && typeof cancelIdle === "function") {
                cancelIdle.call(window, idleId);
            }
        };
    }, [enhancementAllowed]);

    return (
        <section className={styles.root} aria-label="Introduction">
            <HeroBackground staticOnly={reducedMotion} />
            {shouldMountModel && (
                <Suspense fallback={null}>
                    <HelloModel onReady={handleModelReady} />
                </Suspense>
            )}
            <div className={styles.dissolve} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </section>
    );
}
