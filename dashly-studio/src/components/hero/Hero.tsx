import { Suspense, lazy, useMemo, type ReactNode } from "react";

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
 */
function canEnhanceHero(): boolean {
    const capabilities = navigator as NavigatorWithCapabilities;

    if (capabilities.connection?.saveData) {
        return false;
    }

    const memory = capabilities.deviceMemory;

    if (typeof memory === "number" && memory > 0 && memory <= LOW_MEMORY_GB) {
        return false;
    }

    // Apple's A-series has reported 6 logical cores since the A11, and Apple
    // Silicon Macs report 8 or more, so this threshold cannot catch a current
    // iPhone, iPad or Mac — it is aimed at low-end Android and old tablets.
    const cores = navigator.hardwareConcurrency;

    if (typeof cores === "number" && cores > 0 && cores <= LOW_CORE_COUNT) {
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

    return (
        <section className={styles.root} aria-labelledby="hero-title">
            <HeroBackground staticOnly={reducedMotion} />
            {enhancementAllowed && (
                <Suspense fallback={null}>
                    <HelloModel />
                </Suspense>
            )}
            <div className={styles.dissolve} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </section>
    );
}
