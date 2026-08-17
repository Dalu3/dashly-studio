import { markHeroResumePressure } from "./heroFrameBudget";

/**
 * One resume boundary for every Hero subsystem.
 *
 * IntersectionObserver and `visibilitychange` callbacks can arrive in a small
 * burst when the Hero re-enters the viewport or a background tab becomes
 * visible. Scheduling their stable callbacks here deduplicates repeated
 * requests and lets the browser settle visibility/layout before any subsystem
 * resumes. Work requested while a flush is running is deferred to the next
 * frame instead of being mixed into the current one.
 */

type HeroResumeTask = () => void;
export type HeroResumePhase = "prewarm" | "background" | "content";

// Native smooth scrolling does not expose a completion callback. Keep the
// expensive content phase behind one short quiet window instead of waking it
// on every scroll event or adding another rAF polling loop.
const SCROLL_STABILITY_MS = 160;

const PHASES: readonly HeroResumePhase[] = [
    "prewarm",
    "background",
    "content",
];
const pendingTasks: Record<HeroResumePhase, Set<HeroResumeTask>> = {
    prewarm: new Set(),
    background: new Set(),
    content: new Set(),
};
let frameId = 0;
let stabilityTimer = 0;
let phaseIndex = 0;
let cycleActive = false;
let scrollActiveUntil = 0;

const hasPendingTasks = () =>
    PHASES.some((phase) => pendingTasks[phase].size > 0);

/** Called from the existing Hero scroll source. It is intentionally just a
 * timestamp update: no rendering, layout reads, or additional rAF chain. */
export function markHeroScrollActivity(): void {
    scrollActiveUntil = performance.now() + SCROLL_STABILITY_MS;
}

const contentNeedsToWaitForScroll = () =>
    Math.max(0, scrollActiveUntil - performance.now());

const startCycle = () => {
    if (frameId || cycleActive || typeof window === "undefined") {
        return;
    }

    cycleActive = true;
    phaseIndex = 0;
    markHeroResumePressure();

    const flushPhase = () => {
        frameId = 0;
        const phase = PHASES[phaseIndex]!;

        // The canvas/background can become ready immediately, but the
        // continuous fur idle loop belongs to content and must not compete
        // with an in-progress native smooth scroll.
        if (phase === "content") {
            const waitMs = contentNeedsToWaitForScroll();

            if (waitMs > 0) {
                cycleActive = false;
                stabilityTimer = window.setTimeout(() => {
                    stabilityTimer = 0;
                    startCycle();
                }, waitMs);
                return;
            }
        }

        const tasks = Array.from(pendingTasks[phase]);
        pendingTasks[phase].clear();

        for (const pending of tasks) {
            pending();
        }

        phaseIndex += 1;

        if (phaseIndex < PHASES.length) {
            frameId = window.requestAnimationFrame(flushPhase);
            return;
        }

        cycleActive = false;

        if (hasPendingTasks()) {
            startCycle();
        }
    };

    frameId = window.requestAnimationFrame(flushPhase);
};

export function scheduleHeroResume(
    task: HeroResumeTask,
    phase: HeroResumePhase = "content",
): void {
    pendingTasks[phase].add(task);

    if (stabilityTimer && phase !== "content" && typeof window !== "undefined") {
        window.clearTimeout(stabilityTimer);
        stabilityTimer = 0;
    }

    if (frameId || cycleActive || stabilityTimer || typeof window === "undefined") {
        return;
    }

    startCycle();
}

export function cancelHeroResume(task: HeroResumeTask): void {
    for (const phase of PHASES) {
        pendingTasks[phase].delete(task);
    }

    if (!hasPendingTasks() && frameId && typeof window !== "undefined") {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        phaseIndex = 0;
        cycleActive = false;
    }

    if (!hasPendingTasks() && stabilityTimer && typeof window !== "undefined") {
        window.clearTimeout(stabilityTimer);
        stabilityTimer = 0;
    }
}
