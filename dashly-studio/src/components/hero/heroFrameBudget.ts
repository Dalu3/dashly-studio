/**
 * Shared pressure signal for independent Hero animation systems.
 *
 * CSS compositor animation cannot be driven by the WebGL frame loop, but
 * scroll/parallax and staged resume can tell the decorative fur idle pass to
 * yield GPU time temporarily. Direct pointer interaction never consults this
 * budget and therefore stays at display cadence.
 */

const SCROLL_IDLE_FPS = 10;
const RESUME_IDLE_FPS = 8;
const SCROLL_PRESSURE_MS = 180;
const RESUME_PRESSURE_MS = 350;

let constrainedUntil = 0;
let constrainedIdleFps = Number.POSITIVE_INFINITY;

const constrain = (idleFps: number, durationMs: number): void => {
    const now = performance.now();

    if (now >= constrainedUntil) {
        constrainedIdleFps = idleFps;
    } else {
        constrainedIdleFps = Math.min(constrainedIdleFps, idleFps);
    }

    constrainedUntil = Math.max(constrainedUntil, now + durationMs);
};

export const markHeroScrollPressure = (): void => {
    constrain(SCROLL_IDLE_FPS, SCROLL_PRESSURE_MS);
};

export const markHeroResumePressure = (): void => {
    constrain(RESUME_IDLE_FPS, RESUME_PRESSURE_MS);
};

export const resolveHeroIdleFps = (
    profileIdleFps: number,
    now: number,
): number => {
    if (now >= constrainedUntil) {
        constrainedIdleFps = Number.POSITIVE_INFINITY;
        return profileIdleFps;
    }

    return Math.min(profileIdleFps, constrainedIdleFps);
};

export const getHeroFrameBudgetSnapshot = () => {
    const now = performance.now();
    const constrained = now < constrainedUntil;

    return {
        constrained,
        idleFps: constrained ? constrainedIdleFps : null,
        remainingMs: constrained ? constrainedUntil - now : 0,
    };
};
