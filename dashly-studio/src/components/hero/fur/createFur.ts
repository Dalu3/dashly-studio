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
import type { FrameLoopHandle } from "./frameLoop";
import type { FurQualityPreset } from "./quality";
import type { PreparedFurData } from "./furDataWorker";

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
    quality: FurQualityPreset;
    rootColor?: string;
    tipColor?: string;
    /** Synced to the host's own key light, if provided — keeps the fur and
     *  whatever else is in the scene lit consistently instead of the fur
     *  guessing at a separately hand-picked direction. */
    lightDir?: Vector3;
    /** The one scene-wide rAF/render driver shared by every fur subsystem. */
    frameLoop: FrameLoopHandle;
    /** Disables the idle sway loop entirely (see idleAnimation.ts) — the
     *  cursor interaction elsewhere in this system is unaffected, since it
     *  only ever moves in direct response to the user's own pointer. */
    reducedMotion: boolean;
    /** Geometry and strand attributes prepared off the main thread. */
    prepared?: PreparedFurData;
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
// A longer pile gives the word a silky coat rather than short plush fuzz.
// Per-strand length variation in strand.vert still keeps the silhouette from
// becoming a uniform inflated outline.
const DEFAULT_STRAND_LENGTH = 0.0078;
// Slightly fuller roots and mid-sections improve overlap and front-surface
// coverage. The shader keeps the final tip at zero width, so the additional
// body does not turn the fibres into blunt ribbons.
const DEFAULT_STRAND_WIDTH = 0.0009;

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
    const geometry =
        options.prepared?.geometry ??
        prepareGeometry(sourceGeometry, options.quality.strokeRadius);

    const supportMaterial = createSupportMaterial({
        rootColor: options.rootColor,
    });
    const baseMesh = new Mesh(geometry, supportMaterial);
    // The support body is perfectly static, so its contact shadow can be
    // generated once and reused while only the fibres animate.
    baseMesh.castShadow = true;

    const { mesh: strandMesh, material: strandMaterial } = createStrands(
        geometry,
        {
            density: options.quality.density,
            rootColor: options.rootColor,
            tipColor: options.tipColor,
            strandLength:
                options.quality.strandLength ?? DEFAULT_STRAND_LENGTH,
            strandWidth: options.quality.strandWidth ?? DEFAULT_STRAND_WIDTH,
            minStrandPixels: options.quality.minStrandPixels,
            shadeContrast: options.quality.shadeContrast,
        },
        options.prepared?.strands,
    );

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
        frameLoop: options.frameLoop,
    });

    const idle: IdleAnimationHandle = createIdleAnimation({
        viewportElement: options.viewportElement,
        setTime: (seconds) => {
            strandMaterial.uniforms.uTime.value = seconds;
        },
        frameLoop: options.frameLoop,
        reducedMotion: options.reducedMotion,
        idleFps: options.quality.idleFps,
    });

    const dispose = () => {
        idle.dispose();
        cursor.dispose();

        // `geometry` (the tube) is shared only with baseMesh. strandMesh has
        // its own, separate template geometry (see createStrands.ts) with
        // the per-instance root/normal/static-shape buffers baked in — neither
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
