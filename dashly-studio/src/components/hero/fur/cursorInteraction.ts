import {
    Mesh,
    Raycaster,
    Vector2,
    Vector3,
    type IUniform,
    type Object3D,
    type PerspectiveCamera,
} from "three";

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
    /** The element whose bounding box defines pointer -> NDC conversion —
     *  usually the renderer's canvas. */
    viewportElement: HTMLElement;
    /** Real geometry to raycast against — the always-visible base mesh(es),
     *  never the shells or fins themselves. */
    raycastTargets: Object3D[];
    /** Every fur material (shells + fins) that should react to the cursor. */
    materials: CursorReactiveMaterial[];
    /** Called once per settling frame, after uniforms are updated — the host
     *  uses this to request a render. */
    onFrame: () => void;
}

export interface CursorInteractionHandle {
    dispose: () => void;
}

/** Overall hover fade in/out — is the cursor over the model at all. */
const STRENGTH_STIFFNESS = 210;
const STRENGTH_DAMPING = 24;

/**
 * The cursor's OWN effective position/direction trail behind the real
 * pointer with a gentle, slightly underdamped spring, rather than snapping
 * to it every frame. This is what produces a natural trailing "brushed"
 * feel and the brief secondary settle after the pointer stops — genuine
 * per-fibre inertia would need a physics simulation per strand; a damped
 * spring on the effective brush centre is the lightweight, responsive
 * approximation of the same idea, applied once instead of per fibre.
 */
const FOLLOW_STIFFNESS = 220;
const FOLLOW_DAMPING = 26;
const DIRECTION_STIFFNESS = 300;
const DIRECTION_DAMPING = 30;

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
 * materials: only fibres near the cursor bend, with a smooth radial
 * falloff (computed per-vertex in the shell/fin vertex shaders, using the
 * `uCursor`/`uCursorRadius` this module maintains), inertia, and damping —
 * see the module doc comment above for why none of this is adapted from the
 * reference project.
 */
export function createCursorInteraction(
    options: CursorInteractionOptions,
): CursorInteractionHandle {
    const { camera, domElement, viewportElement, raycastTargets, materials, onFrame } =
        options;

    const pointerNdc = new Vector2(2, 2);
    const raycaster = new Raycaster();

    // Raw values from the most recent raycast hit.
    const targetPoint = new Vector3(1e6, 1e6, 1e6);
    const targetDir = new Vector3();
    const lastHit = new Vector3();
    let hasLastHit = false;
    let hovering = false;

    // What actually reaches the shader — trailing behind the raw values
    // above via a damped spring, never assigned directly.
    const followPoint = new Vector3(1e6, 1e6, 1e6);
    const followPointVelocity = new Vector3();
    const followDir = new Vector3();
    const followDirVelocity = new Vector3();

    let targetStrength = 0;
    let strength = 0;
    let strengthVelocity = 0;
    let lastTickTime = 0;
    let frameId = 0;
    let looping = false;
    let disposed = false;

    const applyUniforms = () => {
        for (const material of materials) {
            material.uniforms.uCursorStrength.value = strength;
            material.uniforms.uCursor.value.copy(followPoint);
            material.uniforms.uCursorDir.value.copy(followDir);
        }
    };

    /** Runs only while something is still moving or settling, then stops —
     *  an untouched page draws nothing. Three independent springs (overall
     *  strength, brush position, brush direction) are integrated with real
     *  elapsed time, so the feel doesn't change with frame rate and nothing
     *  is ever assigned directly. */
    const tick = (now: number) => {
        if (disposed) {
            looping = false;

            return;
        }

        const dt = lastTickTime
            ? Math.min((now - lastTickTime) / 1000, 0.05)
            : 1 / 60;
        lastTickTime = now;

        [strength, strengthVelocity] = springStep(
            strength,
            strengthVelocity,
            targetStrength,
            STRENGTH_STIFFNESS,
            STRENGTH_DAMPING,
            dt,
        );
        strength = Math.min(Math.max(strength, -0.2), 1.3);

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

        if (strengthAtRest) {
            strength = targetStrength;
            strengthVelocity = 0;
        }

        const atRest = strengthAtRest && pointAtRest && dirAtRest;

        applyUniforms();
        onFrame();

        if (!atRest) {
            frameId = requestAnimationFrame(tick);
        } else {
            looping = false;
        }
    };

    const startLoop = () => {
        if (!looping) {
            looping = true;
            lastTickTime = 0;
            frameId = requestAnimationFrame(tick);
        }
    };

    const handlePointerMove = (event: Event) => {
        if (!(event instanceof PointerEvent) || raycastTargets.length === 0) {
            return;
        }

        const rect = viewportElement.getBoundingClientRect();
        pointerNdc.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );

        raycaster.setFromCamera(pointerNdc, camera);
        const hit = raycaster.intersectObjects(raycastTargets, false)[0];

        if (hit && hit.object instanceof Mesh) {
            // Object space, matching `position` in the vertex shaders — this
            // only sets the TARGET; the shader-facing value is the damped
            // follow point updated in tick().
            const local = hit.object.worldToLocal(hit.point.clone());

            if (hasLastHit) {
                const delta = local.clone().sub(lastHit);

                if (delta.lengthSq() > 1e-12) {
                    targetDir.copy(delta.normalize());
                }
            }

            lastHit.copy(local);
            hasLastHit = true;
            targetPoint.copy(local);
            targetStrength = 1;
            hovering = true;
        } else if (hovering) {
            targetStrength = 0;
            hasLastHit = false;
            hovering = false;
        }

        startLoop();
    };

    const handlePointerLeave = () => {
        targetStrength = 0;
        hasLastHit = false;
        hovering = false;
        startLoop();
    };

    domElement.addEventListener("pointermove", handlePointerMove, {
        passive: true,
    });
    domElement.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
    });

    return {
        dispose: () => {
            disposed = true;
            domElement.removeEventListener("pointermove", handlePointerMove);
            domElement.removeEventListener("pointerleave", handlePointerLeave);
            cancelAnimationFrame(frameId);
        },
    };
}
