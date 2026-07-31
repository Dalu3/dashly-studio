import { InstancedMesh, Matrix4, type BufferGeometry } from "three";

import { createShellMaterial, shellCountFor } from "./createShellMaterial";
import type { DataTexture } from "three";

export interface CreateShellsOptions {
    noiseTexture: DataTexture;
    mobile: boolean;
    rootColor?: string;
    tipColor?: string;
}

export interface ShellsResult {
    mesh: InstancedMesh;
    material: ReturnType<typeof createShellMaterial>;
}

/**
 * The shell pass: the base geometry drawn `shellCount` times via a SINGLE
 * `InstancedMesh` — one draw call, not one Mesh object per shell (the
 * piellardj/fur-threejs reference does the latter: its shell manager class
 * literally constructs a new Mesh with a cloned material per shell height.
 * Instancing here is a deliberate improvement, not a simplification).
 *
 * Every instance's own transform matrix is identity — per-shell differences
 * live entirely in `gl_InstanceID` inside shell.vert, never in
 * `instanceMatrix`. That is what "offset shells only along vertex normals,
 * never scale them" means in practice: nothing here ever calls
 * `mesh.scale.setScalar(...)` or writes a non-identity instance matrix.
 */
export function createShells(
    geometry: BufferGeometry,
    options: CreateShellsOptions,
): ShellsResult {
    const shellCount = shellCountFor(options.mobile);
    const material = createShellMaterial({
        noiseTexture: options.noiseTexture,
        rootColor: options.rootColor,
        tipColor: options.tipColor,
    });
    material.uniforms.uShellCount.value = shellCount;

    const mesh = new InstancedMesh(geometry, material, shellCount);
    const identity = new Matrix4();

    for (let i = 0; i < shellCount; i += 1) {
        mesh.setMatrixAt(i, identity);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;

    return { mesh, material };
}
