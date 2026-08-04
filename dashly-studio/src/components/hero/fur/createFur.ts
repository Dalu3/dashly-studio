import {
    Group,
    Mesh,
    type BufferGeometry,
    type InstancedMesh,
    type PerspectiveCamera,
    type Vector3,
} from "three";

import {
    createCursorInteraction,
    type CursorInteractionHandle,
} from "./cursorInteraction";
import { createStrands } from "./createStrands";
import type { StrandMaterial } from "./createStrandMaterial";
import { createSupportMaterial, type SupportMaterial } from "./createSupportMaterial";
import { createIdleAnimation, type IdleAnimationHandle } from "./idleAnimation";
import { prepareGeometry } from "./prepareGeometry";

/**
 * Public entry point for the fur system. Everything it needs is passed in —
 * it never reaches into a scene, a renderer, or the DOM beyond the pointer
 * target it is told to listen on — so it can be dropped onto any mesh
 * without depending on how the surrounding scene is put together.
 */
export interface CreateFurOptions {
    camera: PerspectiveCamera;
    /** Element whose bounding box defines pointer -> NDC conversion for
     *  cursor interaction — normally the renderer's canvas. */
    viewportElement: HTMLElement;
    /** Element to listen for pointer movement on. Defaults to `window`, so a
     *  `pointer-events: none` canvas can still react without ever
     *  intercepting a click meant for the page. */
    pointerTarget?: EventTarget;
    /** Lower strand count on small screens. */
    mobile: boolean;
    rootColor?: string;
    tipColor?: string;
    /** Synced to the host's own key light, if provided — keeps the fur and
     *  whatever else is in the scene lit consistently instead of the fur
     *  guessing at a separately hand-picked direction. */
    lightDir?: Vector3;
    /** Called after cursor-interaction uniforms change, so the host can
     *  request a render. The fur system does not own a renderer. */
    requestRender: () => void;
    /** Disables the idle sway loop entirely (see idleAnimation.ts) — the
     *  cursor interaction elsewhere in this system is unaffected, since it
     *  only ever moves in direct response to the user's own pointer. */
    reducedMotion: boolean;
}

export interface FurHandles {
    /** support + strands, ready to add to a parent Object3D. */
    group: Group;
    /** The always-visible base mesh — also the raycast target for cursor
     *  interaction, and what a bounding-box calculation should measure. */
    baseMesh: Mesh;
    strandMesh: InstancedMesh;
    materials: {
        strand: StrandMaterial;
        support: SupportMaterial;
    };
    dispose: () => void;
}

/** Strand length/width, in the same raw object-space units as
 *  STROKE_RADIUS (0.0085) in prepareGeometry.ts. Individually-visible real
 *  geometry reads correctly at different numbers than the old shell system's
 *  uFurLength (0.0075) did — that was a stack of translucent layers, this is
 *  crisp opaque hairs, and the two techniques' "same" length does not look
 *  the same. Length a little past the old shell value (thin geometry alone
 *  needs a bit more reach to read as hair rather than stubble); width a
 *  small fraction of the tube's own radius, per strand, before per-strand
 *  widthScale variation (see strand.vert) spreads it further. */
// Shortened from 0.009 — paired with the further density increase in
// createStrands.ts (more, shorter strands rather than fewer, longer ones),
// this is what makes short DENSE pile read correctly instead of the letters
// growing a longer, sparser-looking coat.
const STRAND_LENGTH = 0.0065;
// Trimmed again from 0.00075 — still paired with a further density increase
// (see STRAND_DENSITY_DESKTOP/MOBILE in createStrands.ts) so total coverage
// doesn't drop: more, thinner hairs instead of fewer, thicker ones is what
// actually reads as "fine" rather than "uniform blur" at this word's
// on-screen size.
const STRAND_WIDTH = 0.00062;

/**
 * Builds a complete fur system — base mesh plus thousands of individually-
 * placed, individually-varied strand hairs — from one piece of source
 * geometry.
 *
 * The one thing that does change the source shape is `prepareGeometry`,
 * which re-sweeps the wordmark's own centreline with a round, thicker
 * profile — the source is a flat ribbon seen edge-on, and no shading fixes
 * that (see prepareGeometry.ts and buildRoundedStroke.ts for the
 * measurements). It keeps the letterforms exactly and replaces only the
 * cross-section. Nothing downstream of it deforms or scales anything: every
 * strand grows from its own sampled root, along its own direction, never as
 * a transform on the mesh as a whole.
 */
export function createFur(
    sourceGeometry: BufferGeometry,
    options: CreateFurOptions,
): FurHandles {
    const geometry = prepareGeometry(sourceGeometry);

    const supportMaterial = createSupportMaterial({
        rootColor: options.rootColor,
    });
    const baseMesh = new Mesh(geometry, supportMaterial);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;

    const { mesh: strandMesh, material: strandMaterial } = createStrands(geometry, {
        mobile: options.mobile,
        rootColor: options.rootColor,
        tipColor: options.tipColor,
        strandLength: STRAND_LENGTH,
        strandWidth: STRAND_WIDTH,
    });

    if (options.lightDir) {
        strandMaterial.uniforms.uLightDir.value.copy(options.lightDir);
        supportMaterial.uniforms.uLightDir.value.copy(options.lightDir);
    }

    const group = new Group();
    group.add(baseMesh, strandMesh);

    const cursor: CursorInteractionHandle = createCursorInteraction({
        camera: options.camera,
        domElement: options.pointerTarget ?? window,
        viewportElement: options.viewportElement,
        raycastTargets: [baseMesh],
        // supportMaterial deliberately excluded — the base mesh's geometry
        // must never move, so it isn't cursor-reactive at all (see
        // createSupportMaterial.ts). Only strandMaterial reacts.
        materials: [strandMaterial],
        onFrame: options.requestRender,
    });

    const idle: IdleAnimationHandle = createIdleAnimation({
        viewportElement: options.viewportElement,
        setTime: (seconds) => {
            strandMaterial.uniforms.uTime.value = seconds;
        },
        onFrame: options.requestRender,
        reducedMotion: options.reducedMotion,
    });

    const dispose = () => {
        idle.dispose();
        cursor.dispose();

        // `geometry` (the tube) is shared only with baseMesh. strandMesh has
        // its own, separate template geometry (see createStrands.ts) with
        // the per-instance aRoot/aNormal/aSeed buffers baked in — neither
        // dispose() call below touches the other's geometry or material,
        // InstancedMesh.dispose() itself only releases the instancing GPU
        // state, not the geometry/material objects.
        geometry.dispose();
        strandMesh.geometry.dispose();

        supportMaterial.dispose();
        strandMaterial.dispose();

        strandMesh.dispose();
    };

    return {
        group,
        baseMesh,
        strandMesh,
        materials: { strand: strandMaterial, support: supportMaterial },
        dispose,
    };
}
