/**
 * One damped-spring integration step, shared by the carousel's scroll-tilt
 * and the per-card cursor-tilt — kept in one place so the two systems can
 * never quietly drift apart in feel.
 *
 * Semi-implicit (symplectic) Euler: velocity is updated from the current
 * force first, then position is advanced using that *new* velocity. Unlike
 * the carousel's `easeOutCubic` settle (deliberately non-overshooting), an
 * under-damped spring like this one overshoots `target` before settling —
 * that overshoot is the whole point here, not a bug to tune away.
 */
export interface SpringState {
    value: number;
    velocity: number;
}

/** Below this, a spring is close enough to rest to stop animating it. */
export const SPRING_REST_EPSILON = 0.01;

export function springStep(
    state: SpringState,
    target: number,
    stiffness: number,
    damping: number,
    dtSeconds: number,
): void {
    const force = (target - state.value) * stiffness;

    state.velocity = (state.velocity + force * dtSeconds) * damping;
    state.value += state.velocity * dtSeconds;
}

export function isSpringAtRest(state: SpringState, target: number): boolean {
    return (
        Math.abs(state.value - target) < SPRING_REST_EPSILON &&
        Math.abs(state.velocity) < SPRING_REST_EPSILON
    );
}
