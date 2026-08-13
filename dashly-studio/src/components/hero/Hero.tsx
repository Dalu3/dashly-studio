import {
    Suspense,
    lazy,
    useCallback,
    type ReactNode,
} from "react";

import { HeroBackground } from "./HeroBackground";

/**
 * Loaded as its own chunk. three.js is ~170KB gzipped, so keeping it out of the
 * main bundle means the Hero's markup and text paint immediately and the 3D
 * word arrives afterwards, rather than blocking first render.
 */
const HelloModel = lazy(() => import("./HelloModel"));
import styles from "./Hero.module.css";

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
    const handleModelReady = useCallback(() => onReady?.(), [onReady]);

    return (
        <section className={styles.root} aria-label="Introduction">
            <HeroBackground />
            <Suspense fallback={null}>
                <HelloModel onReady={handleModelReady} />
            </Suspense>
            <div className={styles.dissolve} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </section>
    );
}
