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
import { createFins } from "./createFins";
import type { FinMaterial } from "./createFinMaterial";
import { createShells } from "./createShells";
import type { ShellMaterial } from "./createShellMaterial";
import { createSupportMaterial, type SupportMaterial } from "./createSupportMaterial";
import { generateNoiseTexture } from "./generateNoiseTexture";
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
    /** Lower shell count / cost on small screens. */
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
}

export interface FurHandles {
    /** support + shells + fins, ready to add to a parent Object3D. */
    group: Group;
    /** The always-visible base mesh — also the raycast target for cursor
     *  interaction, and what a bounding-box calculation should measure. */
    baseMesh: Mesh;
    shellMesh: InstancedMesh;
    finMesh: Mesh;
    materials: {
        shell: ShellMaterial;
        fin: FinMaterial;
        support: SupportMaterial;
    };
    dispose: () => void;
}

/**
 * Builds a complete fur system — base mesh, shell layers, fin geometry, all
 * three shaders, the noise texture they share, and local cursor interaction
 * — from one piece of source geometry.
 *
 * Does not deform, extrude, scale, or otherwise alter the input geometry's
 * silhouette: `prepareGeometry` only welds coincident seam vertices and
 * recomputes normals (see prepareGeometry.ts for exactly why), and every
 * displacement downstream happens per-vertex, along that vertex's own
 * normal, never as a transform on the mesh as a whole.
 */
export function createFur(
    sourceGeometry: BufferGeometry,
    options: CreateFurOptions,
): FurHandles {
    const geometry = prepareGeometry(sourceGeometry);
    const noiseTexture = generateNoiseTexture();

    const supportMaterial = createSupportMaterial({
        rootColor: options.rootColor,
    });
    const baseMesh = new Mesh(geometry, supportMaterial);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;

    const { mesh: shellMesh, material: shellMaterial } = createShells(geometry, {
        noiseTexture,
        mobile: options.mobile,
        rootColor: options.rootColor,
        tipColor: options.tipColor,
    });

    const { mesh: finMesh, material: finMaterial } = createFins(geometry, {
        noiseTexture,
        rootColor: options.rootColor,
        tipColor: options.tipColor,
    });

    if (options.lightDir) {
        shellMaterial.uniforms.uLightDir.value.copy(options.lightDir);
        finMaterial.uniforms.uLightDir.value.copy(options.lightDir);
        supportMaterial.uniforms.uLightDir.value.copy(options.lightDir);
    }

    const group = new Group();
    group.add(baseMesh, shellMesh, finMesh);

    const cursor: CursorInteractionHandle = createCursorInteraction({
        camera: options.camera,
        domElement: options.pointerTarget ?? window,
        viewportElement: options.viewportElement,
        raycastTargets: [baseMesh],
        materials: [shellMaterial, finMaterial],
        onFrame: options.requestRender,
    });

    const dispose = () => {
        cursor.dispose();

        // `geometry` is shared by baseMesh and shellMesh (an InstancedMesh
        // does not own a separate copy) — disposed once here, not twice.
        geometry.dispose();
        finMesh.geometry.dispose();

        supportMaterial.dispose();
        shellMaterial.dispose();
        finMaterial.dispose();
        noiseTexture.dispose();

        shellMesh.dispose();
    };

    return {
        group,
        baseMesh,
        shellMesh,
        finMesh,
        materials: { shell: shellMaterial, fin: finMaterial, support: supportMaterial },
        dispose,
    };
}
