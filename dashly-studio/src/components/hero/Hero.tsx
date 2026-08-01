import {
    Suspense,
    lazy,
    useCallback,
    useRef,
    useState,
    type ReactNode,
} from "react";

import type { ParallaxDebug } from "@/hooks/useHeroParallax";

import { HeroBackground } from "./HeroBackground";

/**
 * Loaded as its own chunk. three.js is ~170KB gzipped, so keeping it out of the
 * main bundle means the Hero's markup and text paint immediately and the 3D
 * word arrives afterwards, rather than blocking first render.
 */
const HelloModel = lazy(() => import("./HelloModel"));
import { HeroDebugPanel } from "./HeroDebugPanel";
import styles from "./Hero.module.css";

/**
 * Diagnostic overlay, off by default — append `?heroDebug` to the URL to show
 * it. Kept behind a flag rather than deleted so the runtime path (reduced
 * motion, scroll source, eased progress, live transforms) can be inspected on
 * any machine without a code change. Say the word and I will delete it and
 * HeroDebugPanel.tsx entirely.
 */
const showDebugPanel = () =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("heroDebug");

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
    const sampleRef = useRef<ParallaxDebug | null>(null);
    const [debug] = useState(showDebugPanel);
    const handleSample = useCallback((sample: ParallaxDebug) => {
        sampleRef.current = sample;
    }, []);

    return (
        <section className={styles.root} aria-label="Introduction">
            <HeroBackground
                onScrollSample={debug ? handleSample : undefined}
            />
            <Suspense fallback={null}>
                <HelloModel onReady={onReady} />
            </Suspense>
            <div className={styles.content}>{children}</div>
            {debug && <HeroDebugPanel sampleRef={sampleRef} />}
        </section>
    );
}
