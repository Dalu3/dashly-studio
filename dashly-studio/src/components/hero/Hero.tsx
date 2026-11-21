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
    deviceMemory?: number;
};

/**
 * How long a capable device may keep an empty hero before the static
 * wordmark steps in.
 *
 * Measured against production: the 3D word reports ready ~2.7s after
 * navigation on a cold cache, and that wait was the hero's behaviour for its
 * whole life — an empty first screen nobody asked to change. Painting the
 * wordmark over it and then swapping is not an improvement there, it is an
 * extra visible transition on a machine that never needed help. So this sits
 * comfortably above the normal arrival: a merely normal device never shows
 * the wordmark at all, and only one that is genuinely struggling does.
 *
 * It does not apply where `canEnhanceHero` said no — there the wordmark is
 * not a stopgap, it is the hero, and it paints immediately.
 */
const WORDMARK_GRACE_MS = 3500;

/** Reported gigabytes of RAM at or below which the fur hero is skipped. */
const LOW_MEMORY_GB = 4;
/** Reported logical cores at or below which the fur hero is skipped. */
const LOW_CORE_COUNT = 4;

/**
 * Mobile and tablet have their own geometry and DPR budgets, so width alone
 * is not a reason to drop HELLO — an earlier coarse-pointer gate removed it
 * from every phone and was itself reverted. What this gates on instead is
 * positive evidence that a device cannot afford ~160k strand instances.
 *
 * Both signals are optional, and an ABSENT signal always reads as capable:
 * `deviceMemory` is Chromium-only, so treating "unknown" as low-end would
 * take the hero away from every iPhone, iPad and Apple Silicon Mac.
 *
 * `hardwareConcurrency` needs the same care for the opposite reason: it is
 * PRESENT in WebKit but deliberately not truthful. To blunt fingerprinting,
 * Safari clamps it to a small constant on iOS — reported as 2, and 4 in
 * older write-ups — regardless of the six or more real cores in any A-series
 * iPhone. Read at face value it fails the low-core test on every single
 * iPhone, which is how the hero quietly vanished from Safari on phones:
 * exactly the coarse-pointer outcome that was already reverted once.
 *
 * So the core count is only consulted where it is a real count. `deviceMemory`
 * is the marker for that: a browser reporting it is Chromium, which reports
 * actual cores too. Where it is absent (WebKit, Firefox) the clamped or
 * withheld core count is ignored and memory-free devices stay capable.
 */
function canEnhanceHero(): boolean {
    const capabilities = navigator as NavigatorWithCapabilities;

    if (capabilities.connection?.saveData) {
        return false;
    }

    const memory = capabilities.deviceMemory;
    const reportsRealHardware = typeof memory === "number" && memory > 0;

    if (reportsRealHardware && memory <= LOW_MEMORY_GB) {
        return false;
    }

    // Only Chromium reaches this check (see the note above): there the count
    // is the machine's own, so it still catches the low-end Android and old
    // tablets this gate was written for.
    const cores = navigator.hardwareConcurrency;

    if (
        reportsRealHardware &&
        typeof cores === "number" &&
        cores > 0 &&
        cores <= LOW_CORE_COUNT
    ) {
        return false;
    }

    return true;
}

export interface HeroProps {
    /** Hero content. Intentionally empty for now — text, buttons and the
     *  "hello" wordmark are a later step. */
    children?: ReactNode;
}

/**
 * Minimum Hero shell needed to preview the animated background at full size.
 *
 * Deliberately contains no Hero content, no navigation, no logo and no
 * typography. Its only jobs are to be a full-viewport positioning context for
 * <HeroBackground /> and to keep future content structurally separate from the
 * decorative layers.
 */
export function Hero({ children }: HeroProps) {
    const reducedMotion = usePrefersReducedMotion();
    const enhancementAllowed = useMemo(canEnhanceHero, []);

    /**
     * Two different failures leave the first screen with no word on it, and
     * only one of them is worth covering eagerly. Where `canEnhanceHero`
     * said no, the 3D word is never coming, so the static wordmark IS the
     * hero and paints at once. Where it is coming, the wordmark is only a
     * stopgap: it is withheld for WORDMARK_GRACE_MS, so a device that
     * arrives on time shows the 3D word and nothing else — no stand-in and
     * no swap. Only a device still empty-handed after the grace gets it.
     *
     * That also keeps the file off the common path entirely: the element
     * does not exist until it is needed, so it never competes for the
     * connection with the three.js chunk and hello.glb it is covering for.
     */
    const [wordVisible, setWordVisible] = useState(false);
    const handleWordVisibleChange = useCallback((visible: boolean) => {
        setWordVisible(visible);
    }, []);

    const [wordmarkNeeded, setWordmarkNeeded] = useState(!enhancementAllowed);

    // The file is only fetched once the element mounts, so it lands some
    // way after that — and a 100KB sprite appearing at full opacity the
    // instant it decodes is its own pop. It fades in from its load event
    // instead, so whenever it arrives it arrives softly.
    const [wordmarkLoaded, setWordmarkLoaded] = useState(false);
    const handleWordmarkLoad = useCallback(() => {
        setWordmarkLoaded(true);
    }, []);

    // A cached sprite can be complete before React attaches onLoad, and
    // that event never replays — the element would then sit at zero opacity
    // for good. The ref catches exactly that case on mount.
    const handleWordmarkRef = useCallback((node: HTMLImageElement | null) => {
        if (node?.complete) {
            setWordmarkLoaded(true);
        }
    }, []);

    useEffect(() => {
        // Once shown it stays mounted: it has to be there to cross-fade out
        // under the arriving word, and to come back if that word is lost.
        if (!enhancementAllowed || wordVisible || wordmarkNeeded) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setWordmarkNeeded(true);
        }, WORDMARK_GRACE_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [enhancementAllowed, wordVisible, wordmarkNeeded]);

    return (
        <section className={styles.root} aria-labelledby="hero-title">
            <HeroBackground staticOnly={reducedMotion} />
            {/* The layer exists to be measured: it is the same box as the
                canvas host, so a container query on it branches on exactly
                the aspect HelloModel's own layout branches on. The viewport
                will not do — the Hero is 100svh MINIMUM and its content can
                push it taller, which is enough to land the two on different
                presets.

                Decorative: the hero's accessible name is the <h1>, and a
                second "hello" in the tree would only add noise. */}
            {wordmarkNeeded && (
                <div className={styles.wordmarkLayer} aria-hidden="true">
                    <img
                        ref={handleWordmarkRef}
                        className={styles.wordmark}
                        data-loaded={wordmarkLoaded ? "true" : undefined}
                        data-replaced={wordVisible ? "true" : undefined}
                        onLoad={handleWordmarkLoad}
                        src={`${import.meta.env.BASE_URL}images/hello-wordmark-1232.webp`}
                        /* Two widths, because the word is nearly
                           viewport-wide: a phone would otherwise spend 108KB
                           on pixels it cannot resolve, and a desktop at 1x
                           DPR would be handed a sprite to blow up. */
                        srcSet={`${import.meta.env.BASE_URL}images/hello-wordmark-880.webp 880w, ${import.meta.env.BASE_URL}images/hello-wordmark-1232.webp 1232w`}
                        sizes="90vw"
                        alt=""
                        width={1232}
                        height={491}
                        decoding="async"
                        /* React only learned the camelCase spelling in 19.
                           On 18 it warns and drops the attribute, so the
                           hint never reached the browser; spread the real
                           lowercase attribute name instead. */
                        {...{ fetchpriority: "high" }}
                    />
                </div>
            )}
            {enhancementAllowed && (
                <Suspense fallback={null}>
                    <HelloModel onWordVisibleChange={handleWordVisibleChange} />
                </Suspense>
            )}
            <div className={styles.dissolve} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </section>
    );
}
