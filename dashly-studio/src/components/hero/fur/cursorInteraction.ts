import {
    Mesh,
    Raycaster,
    Vector2,
    Vector3,
    type IUniform,
    type Object3D,
    type PerspectiveCamera,
} from "three";
import {
    cancelHeroResume,
    scheduleHeroResume,
} from "../heroResumeScheduler";

import type { FrameLoopHandle, FrameTickResult } from "./frameLoop";

/**
 * This module has no counterpart in the piellardj/fur-threejs reference.
 * Its "brush" is a manually-dragged UI slider that applies one GLOBAL
 * rotation to every strand's growth direction at once (confirmed by reading
 * its setter — `Page.Range.getValue("brush-range-id")` feeding a single
 * rotation matrix uniform, shared by every shell). There is no raycasting
 * anywhere in that project's bundle (`Raycaster`, `intersectObject`: zero
 * occurrences) and its three `pointermove` listeners all belong to
 * OrbitControls, not fur. Everything below — local raycasting, distance
 * falloff, and the two damped springs that make the brush trail behind the
 * real cursor instead of snapping to it — is this project's own, built to
 * the interaction spec directly, independent of the reference.
 */

/** The subset of a fur (shell or fin) material's uniforms this module needs
 *  to drive. Both createShellMaterial and createFinMaterial produce
 *  materials whose uniforms satisfy this shape. */
export interface CursorReactiveUniforms {
    uCursor: IUniform<Vector3>;
    uCursorDir: IUniform<Vector3>;
    uCursorRadius: IUniform<number>;
    uCursorStrength: IUniform<number>;
    /** A SECOND brush position, trailing the real one via its own softer,
     *  underdamped spring (see RIPPLE_STIFFNESS/RIPPLE_DAMPING below) — not
     *  a copy of `uCursor`. Strand.vert uses the gap between the two, and
     *  the gentle overshoot as this one catches up, as a cheap stand-in for
     *  a wave propagating through the fur after the cursor passes, without
     *  actually simulating one. Declared on every cursor-reactive material
     *  for uniformity even where a shader doesn't read it (support.vert
     *  doesn't) — an unused uniform costs nothing. */
    uRipplePoint: IUniform<Vector3>;
    [key: string]: IUniform;
}

export interface CursorReactiveMaterial {
    uniforms: CursorReactiveUniforms;
}

export interface CursorInteractionOptions {
    camera: PerspectiveCamera;
    /** Element to listen for pointer movement on. Typically `window`, so a
     *  `pointer-events: none` canvas can still react to the cursor without
     *  ever intercepting a click meant for the page. */
    domElement: EventTarget;
    /** Touch-only hit surface covering the projected word. It owns touch
     *  pointer capture without making the whole Hero block native scroll. */
    touchElement?: HTMLElement;
    /** The element whose bounding box defines pointer -> NDC conversion —
     *  usually the renderer's canvas. */
    viewportElement: HTMLElement;
    /** Real geometry to raycast against — the always-visible base mesh(es),
     *  never the shells or fins themselves. */
    raycastTargets: Object3D[];
    /** Every fur material (shells + fins) that should react to the cursor. */
    materials: CursorReactiveMaterial[];
    /** Shared rAF driver — see frameLoop.ts. Registering here rather than
     *  calling requestAnimationFrame directly is what keeps this module and
     *  idleAnimation.ts from ever running two independent rAF chains (and so
     *  calling render() twice in the same real frame) at once. */
    frameLoop: FrameLoopHandle;
}

export interface CursorInteractionHandle {
    dispose: () => void;
}

/** Overall hover fade in/out — is the cursor over the model at all. */
const STRENGTH_RISE_STIFFNESS = 340;
const STRENGTH_RISE_DAMPING = 28;
const STRENGTH_FALL_STIFFNESS = 105;
const STRENGTH_FALL_DAMPING = 13;
const IMPULSE_DECAY = 7;
const SPEED_BOOST = 0.055;
const MAX_CURSOR_STRENGTH = 1.6;

/**
 * The cursor's OWN effective position/direction trail behind the real
 * pointer with a damped spring, rather than snapping to it every frame —
 * this is what keeps the brush centre from teleporting on a fast flick. The
 * stiffness/damping pair is tuned tight enough that the trail is no longer
 * visible during ordinary pointer motion (raised from the original
 * 360/28 and 420/30, which read as a lagging "shadow"), while keeping the
 * damping ratio roughly constant so the response doesn't start overshooting.
 */
const FOLLOW_STIFFNESS = 2600;
const FOLLOW_DAMPING = 75;
const DIRECTION_STIFFNESS = 2900;
const DIRECTION_DAMPING = 80;

/**
 * A SECOND position spring chasing the same raw target as `followPoint` —
 * this is the one most likely to read as "a shadow lagging behind the
 * cursor": at the original 42/5.8 it was an order of magnitude softer than
 * followPoint even before followPoint itself got tightened above, so
 * raising followPoint's responsiveness alone only made the gap between the
 * two MORE visible, not less. Still deliberately softer than followPoint
 * (damping is below critical for this stiffness, same as before) so a
 * little wave/overshoot character survives strand.vert's ripple term, but
 * now catches up fast enough that it no longer reads as a separate trailing
 * shape.
 */
const RIPPLE_STIFFNESS = 600;
const RIPPLE_DAMPING = 22;

/** Critically-damped-ish spring integrator for a single scalar, applied
 *  per-axis for a Vector3. Shared shape for strength/position/direction so
 *  all three settle with the same character. */
function springStep(
    value: number,
    velocity: number,
    target: number,
    stiffness: number,
    damping: number,
    dt: number,
): [number, number] {
    const force = (target - value) * stiffness;
    let v = velocity + force * dt;
    v *= Math.exp(-damping * dt);
    const next = value + v * dt;

    return [next, v];
}

/**
 * Wires up local, raycasting-based cursor interaction for a set of fur
 * materials: only fibres near the cursor react, with a smooth radial falloff
 * (computed per-vertex in strand.vert / support.vert, using the
 * `uCursor`/`uCursorRadius` this module maintains), inertia, and damping —
 * see the module doc comment above for why none of this is adapted from the
 * reference project.
 */
export function createCursorInteraction(
    options: CursorInteractionOptions,
): CursorInteractionHandle {
    const {
        camera,
        domElement,
        touchElement,
        viewportElement,
        raycastTargets,
        materials,
        frameLoop,
    } = options;

    const pointerNdc = new Vector2(2, 2);
    const raycaster = new Raycaster();

    // Raw values from the most recent raycast hit.
    const targetPoint = new Vector3(1e6, 1e6, 1e6);
    const targetDir = new Vector3();
    const lastHit = new Vector3();
    const hitDelta = new Vector3();
    let hasLastHit = false;
    let lastHitTime = 0;
    let hovering = false;
    // True once the cursor has ever actually landed on the mesh — see the
    // snap in resolvePendingMove() below for why this exists.
    let hasEverHit = false;

    // What actually reaches the shader — trailing behind the raw values
    // above via a damped spring, never assigned directly.
    const followPoint = new Vector3(1e6, 1e6, 1e6);
    const followPointVelocity = new Vector3();
    const followDir = new Vector3();
    const followDirVelocity = new Vector3();

    // The ripple point chases `targetPoint` too — the SAME raw raycast
    // target as followPoint, not followPoint itself — so it has its own
    // independent, softer race to get there rather than trailing a trail.
    const ripplePoint = new Vector3(1e6, 1e6, 1e6);
    const ripplePointVelocity = new Vector3();

    let targetStrength = 0;
    let strength = 0;
    let strengthVelocity = 0;
    let lastTickTime = 0;
    let disposed = false;
    let visible = true;
    let loopActive = false;

    // The raw pointer position from the most recent `pointermove`, applied
    // to a real Raycaster at most ONCE PER FRAME inside tick() below —
    // never inside the event handler itself. `pointermove` can fire far
    // more often than the display refresh rate (uncoalesced high-poll-rate
    // mice easily exceed it); raycasting hello.glb's ~13.7k-vertex geometry
    // on every single one of those events was real, measurable, and
    // entirely wasted work between two events that land in the same frame.
    let pendingClientX = 0;
    let pendingClientY = 0;
    let pendingEventTime = 0;
    let hasPendingMove = false;
    let activeTouchPointerId: number | null = null;

    const applyUniforms = () => {
        for (const material of materials) {
            material.uniforms.uCursorStrength.value = strength;
            material.uniforms.uCursor.value.copy(followPoint);
            material.uniforms.uCursorDir.value.copy(followDir);
            material.uniforms.uRipplePoint.value.copy(ripplePoint);
        }
    };

    /** The actual raycast — moved out of the event handler (see
     *  `hasPendingMove` above) so it runs at most once per animation
     *  frame regardless of how many raw pointer events arrived since the
     *  last one. */
    const resolvePendingMove = () => {
        if (!hasPendingMove || raycastTargets.length === 0) {
            return;
        }

        hasPendingMove = false;

        const rect = viewportElement.getBoundingClientRect();
        pointerNdc.set(
            ((pendingClientX - rect.left) / rect.width) * 2 - 1,
            -((pendingClientY - rect.top) / rect.height) * 2 + 1,
        );

        raycaster.setFromCamera(pointerNdc, camera);
        const hit = raycaster.intersectObjects(raycastTargets, false)[0];

        if (hit && hit.object instanceof Mesh) {
            // Object space, matching `position` in the vertex shaders — this
            // only sets the TARGET; the shader-facing value is the damped
            // follow point updated below.
            const local = hit.object.worldToLocal(hit.point.clone());

            if (hasLastHit) {
                hitDelta.copy(local).sub(lastHit);
                const distance = hitDelta.length();

                if (distance > 1e-6) {
                    targetDir.copy(hitDelta).multiplyScalar(1 / distance);
                    const elapsed = Math.max(
                        (pendingEventTime - lastHitTime) / 1000,
                        1 / 240,
                    );
                    const speed = distance / elapsed;
                    targetStrength = Math.min(
                        MAX_CURSOR_STRENGTH,
                        Math.max(targetStrength, 1 + speed * SPEED_BOOST),
                    );
                }
            } else {
                targetStrength = 1;
            }

            lastHit.copy(local);
            lastHitTime = pendingEventTime;
            hasLastHit = true;
            targetPoint.copy(local);
            hovering = true;

            if (!hasEverHit) {
                hasEverHit = true;
                // The very FIRST contact ever: followPoint/ripplePoint are
                // still sitting at their initial off-mesh sentinel
                // ((1e6, 1e6, 1e6) — see their declarations above), which
                // exists purely so a position is never accidentally "on the
                // mesh" while uCursorStrength is legitimately 0. Springing
                // FROM that sentinel instead of snapping was measured (a
                // direct simulation of springStep, not a guess) at ~1.7s for
                // followPoint and ~5.3s for ripplePoint before either got
                // within 0.001 units of a real target — long enough that the
                // very first time anyone's cursor ever touches the word, it
                // looks completely unresponsive. Every LATER retarget is a
                // jump within the word's own small bounding box (at most
                // its ~0.4-unit extent) and settles within a fraction of a
                // second, so this snap only ever needs to happen once.
                followPoint.copy(local);
                followPointVelocity.set(0, 0, 0);
                ripplePoint.copy(local);
                ripplePointVelocity.set(0, 0, 0);
            }
        } else if (hovering) {
            targetStrength = 0;
            hasLastHit = false;
            lastHitTime = 0;
            hovering = false;
        }
    };

    /** Runs only while something is still moving or settling, then stops —
     *  an untouched page draws nothing. Three independent springs (overall
     *  strength, brush position, brush direction) are integrated with real
     *  elapsed time, so the feel doesn't change with frame rate and nothing
     *  is ever assigned directly. Registered with the shared frameLoop
     *  (see frameLoop.ts) rather than calling requestAnimationFrame itself —
     *  returns whether it wants to keep being called, instead of
     *  self-scheduling. */
    const tick = (now: number): FrameTickResult => {
        if (disposed) {
            loopActive = false;
            return { keepRunning: false, needsRender: false };
        }

        resolvePendingMove();

        const dt = lastTickTime
            ? Math.min((now - lastTickTime) / 1000, 0.05)
            : 1 / 60;
        lastTickTime = now;

        // A fast pass injects extra energy, then eases back to the steady
        // hover level. The slower release spring below preserves the brief
        // follow-through after the pointer has already moved on.
        if (hovering && targetStrength > 1) {
            targetStrength = 1 +
                (targetStrength - 1) * Math.exp(-IMPULSE_DECAY * dt);
        }

        const strengthRising = targetStrength >= strength;

        [strength, strengthVelocity] = springStep(
            strength,
            strengthVelocity,
            targetStrength,
            strengthRising ? STRENGTH_RISE_STIFFNESS : STRENGTH_FALL_STIFFNESS,
            strengthRising ? STRENGTH_RISE_DAMPING : STRENGTH_FALL_DAMPING,
            dt,
        );
        strength = Math.min(Math.max(strength, -0.12), MAX_CURSOR_STRENGTH);

        for (const axis of ["x", "y", "z"] as const) {
            [followPoint[axis], followPointVelocity[axis]] = springStep(
                followPoint[axis],
                followPointVelocity[axis],
                targetPoint[axis],
                FOLLOW_STIFFNESS,
                FOLLOW_DAMPING,
                dt,
            );
            [followDir[axis], followDirVelocity[axis]] = springStep(
                followDir[axis],
                followDirVelocity[axis],
                targetDir[axis],
                DIRECTION_STIFFNESS,
                DIRECTION_DAMPING,
                dt,
            );
            [ripplePoint[axis], ripplePointVelocity[axis]] = springStep(
                ripplePoint[axis],
                ripplePointVelocity[axis],
                targetPoint[axis],
                RIPPLE_STIFFNESS,
                RIPPLE_DAMPING,
                dt,
            );
        }

        const strengthAtRest =
            Math.abs(targetStrength - strength) < 0.0015 &&
            Math.abs(strengthVelocity) < 0.0015;
        const pointAtRest =
            followPointVelocity.lengthSq() < 1e-9 &&
            followPoint.distanceToSquared(targetPoint) < 1e-11;
        const dirAtRest =
            followDirVelocity.lengthSq() < 1e-9 &&
            followDir.distanceToSquared(targetDir) < 1e-9;
        // The ripple spring is deliberately the LAST thing to settle (low
        // stiffness, underdamped) — the loop has to keep running until it
        // does too, or the ripple's own tail-end oscillation would get cut
        // off mid-wobble the instant the (faster) follow point stops.
        const rippleAtRest =
            ripplePointVelocity.lengthSq() < 1e-9 &&
            ripplePoint.distanceToSquared(targetPoint) < 1e-11;

        if (strengthAtRest) {
            strength = targetStrength;
            strengthVelocity = 0;
        }

        const atRest = strengthAtRest && pointAtRest && dirAtRest && rippleAtRest;

        applyUniforms();
        loopActive = !atRest;

        return { keepRunning: !atRest, needsRender: true };
    };

    const startLoop = () => {
        if (loopActive || disposed || document.hidden || !visible) {
            return;
        }

        loopActive = true;
        lastTickTime = 0;
        frameLoop.request(tick);
    };

    const interactionNeedsResume = () =>
        hasPendingMove ||
        hovering ||
        Math.abs(targetStrength - strength) >= 0.0015 ||
        Math.abs(strengthVelocity) >= 0.0015 ||
        followPointVelocity.lengthSq() >= 1e-9 ||
        followPoint.distanceToSquared(targetPoint) >= 1e-11 ||
        followDirVelocity.lengthSq() >= 1e-9 ||
        followDir.distanceToSquared(targetDir) >= 1e-9 ||
        ripplePointVelocity.lengthSq() >= 1e-9 ||
        ripplePoint.distanceToSquared(targetPoint) >= 1e-11;

    const queuePointerSample = (event: PointerEvent) => {
        if (
            document.hidden ||
            !visible
        ) {
            return;
        }

        pendingClientX = event.clientX;
        pendingClientY = event.clientY;
        pendingEventTime = event.timeStamp;
        hasPendingMove = true;
        startLoop();
    };

    const handlePointerDown = (event: Event) => {
        if (event instanceof PointerEvent && event.pointerType !== "touch") {
            queuePointerSample(event);
        }
    };

    const handlePointerMove = (event: Event) => {
        if (event instanceof PointerEvent && event.pointerType !== "touch") {
            queuePointerSample(event);
        }
    };

    const resetInteraction = () => {
        hasPendingMove = false;
        targetStrength = 0;
        hasLastHit = false;
        lastHitTime = 0;
        targetDir.set(0, 0, 0);
        hovering = false;
        startLoop();
    };

    const handlePointerLeave = (event: Event) => {
        if (!(event instanceof PointerEvent) || event.pointerType !== "touch") {
            resetInteraction();
        }
    };

    const handlePointerEnd = (event: Event) => {
        if (!(event instanceof PointerEvent) || event.pointerType !== "touch") {
            resetInteraction();
        }
    };

    const handleTouchPointerDown = (event: PointerEvent) => {
        if (event.pointerType !== "touch" || activeTouchPointerId !== null) {
            return;
        }

        activeTouchPointerId = event.pointerId;
        touchElement?.setPointerCapture(event.pointerId);
        event.preventDefault();
        queuePointerSample(event);
    };

    const handleTouchPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== activeTouchPointerId) {
            return;
        }

        event.preventDefault();
        queuePointerSample(event);
    };

    const finishTouchPointer = (event: PointerEvent) => {
        if (event.pointerId !== activeTouchPointerId) {
            return;
        }

        activeTouchPointerId = null;
        if (touchElement?.hasPointerCapture(event.pointerId)) {
            touchElement.releasePointerCapture(event.pointerId);
        }
        resetInteraction();
    };

    const handleLostPointerCapture = (event: PointerEvent) => {
        if (event.pointerId === activeTouchPointerId) {
            activeTouchPointerId = null;
            resetInteraction();
        }
    };

    // Pointer events are listened to on window because the canvas is
    // intentionally click-through. Do not raycast the word for every mouse
    // move once the Hero has left the viewport.
    const visibilityObserver =
        typeof IntersectionObserver === "function"
            ? new IntersectionObserver(
                  ([entry]) => {
                      visible = Boolean(entry?.isIntersecting);

                      if (!visible) {
                          cancelHeroResume(startLoop);
                          hasPendingMove = false;
                          targetStrength = 0;
                          strength = 0;
                          strengthVelocity = 0;
                          loopActive = false;
                          frameLoop.cancel(tick);
                          applyUniforms();
                      }
                  },
                  { threshold: 0.01 },
              )
            : null;

    visibilityObserver?.observe(viewportElement);

    // A settling spring left running in a backgrounded tab is wasted work —
    // rAF is throttled there but not guaranteed to stop, and the tab can
    // stay backgrounded indefinitely. Explicitly stopping (and cleanly
    // resuming on return) is cheap insurance rather than relying on browser
    // throttling alone.
    const handleVisibilityChange = () => {
        if (document.hidden) {
            cancelHeroResume(startLoop);
            loopActive = false;
            frameLoop.cancel(tick);
        } else if (interactionNeedsResume()) {
            // If a spring hadn't finished settling before the tab was
            // hidden, this picks it back up; if everything was already at
            // rest, no WebGL frame is requested at all.
            scheduleHeroResume(startLoop);
        }
    };

    domElement.addEventListener("pointerdown", handlePointerDown, {
        passive: true,
    });
    domElement.addEventListener("pointermove", handlePointerMove, {
        passive: true,
    });
    domElement.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
    });
    domElement.addEventListener("pointerup", handlePointerEnd, {
        passive: true,
    });
    domElement.addEventListener("pointercancel", handlePointerEnd, {
        passive: true,
    });
    touchElement?.addEventListener("pointerdown", handleTouchPointerDown);
    touchElement?.addEventListener("pointermove", handleTouchPointerMove);
    touchElement?.addEventListener("pointerup", finishTouchPointer);
    touchElement?.addEventListener("pointercancel", finishTouchPointer);
    touchElement?.addEventListener(
        "lostpointercapture",
        handleLostPointerCapture,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return {
        dispose: () => {
            disposed = true;
            if (
                activeTouchPointerId !== null &&
                touchElement?.hasPointerCapture(activeTouchPointerId)
            ) {
                touchElement.releasePointerCapture(activeTouchPointerId);
            }
            activeTouchPointerId = null;
            domElement.removeEventListener("pointerdown", handlePointerDown);
            domElement.removeEventListener("pointermove", handlePointerMove);
            domElement.removeEventListener("pointerleave", handlePointerLeave);
            domElement.removeEventListener("pointerup", handlePointerEnd);
            domElement.removeEventListener("pointercancel", handlePointerEnd);
            touchElement?.removeEventListener(
                "pointerdown",
                handleTouchPointerDown,
            );
            touchElement?.removeEventListener(
                "pointermove",
                handleTouchPointerMove,
            );
            touchElement?.removeEventListener("pointerup", finishTouchPointer);
            touchElement?.removeEventListener(
                "pointercancel",
                finishTouchPointer,
            );
            touchElement?.removeEventListener(
                "lostpointercapture",
                handleLostPointerCapture,
            );
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            visibilityObserver?.disconnect();
            cancelHeroResume(startLoop);
            loopActive = false;
            frameLoop.cancel(tick);
        },
    };
}
