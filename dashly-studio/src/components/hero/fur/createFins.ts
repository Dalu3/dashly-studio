import { BufferAttribute, BufferGeometry, Mesh, type DataTexture } from "three";

import { createFinMaterial, type FinMaterial } from "./createFinMaterial";

/**
 * Fin geometry generation, adapted from the piellardj/fur-threejs
 * reference's `dc` class (recovered from its compiled bundle — the
 * repository ships no readable source, so this was reconstructed by reading
 * the actual algorithm out of the minified-but-unobfuscated logic).
 *
 * The scheme: every ORIGINAL vertex is duplicated exactly once into a
 * "lower" (base, on the true surface) and "upper" (tip, extruded) copy,
 * sharing position and normal. Then, for every unique edge of the mesh, two
 * triangles are emitted referencing those four shared vertices via an INDEX
 * BUFFER. This is a real improvement over duplicating position/normal data
 * per edge occurrence (what an earlier version of this fur system did): the
 * attribute arrays here are exactly 2x the original vertex count, no matter
 * how many edges the mesh has, and the index buffer — small integers, not
 * full vertex data — carries the 6x-edge-count multiplication instead.
 */

interface AnalyzedVertex {
    x: number;
    y: number;
    z: number;
    nx: number;
    ny: number;
    nz: number;
}

/** Every unique edge of an indexed triangle geometry, each counted once
 *  regardless of which of its two adjacent triangles it is walked from. */
function collectUniqueEdges(
    index: BufferAttribute,
): Array<[number, number]> {
    const seen = new Set<number>();
    const edges: Array<[number, number]> = [];
    const count = index.count;

    for (let i = 0; i < count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        for (const [v0, v1] of [
            [a, b],
            [b, c],
            [c, a],
        ] as const) {
            // Order-independent key: 20 bits is comfortably more than this
            // mesh's vertex count needs. This runs once at load time, not
            // per frame.
            const key = v0 < v1 ? v0 * 0x100000 + v1 : v1 * 0x100000 + v0;

            if (!seen.has(key)) {
                seen.add(key);
                edges.push([v0, v1]);
            }
        }
    }

    return edges;
}

export function buildFinGeometry(source: BufferGeometry): BufferGeometry {
    const position = source.getAttribute("position");
    const normal = source.getAttribute("normal");
    const index = source.getIndex();

    if (!index) {
        throw new Error("buildFinGeometry requires an indexed geometry");
    }

    const vertexCount = position.count;
    const vertices: AnalyzedVertex[] = new Array(vertexCount);

    for (let i = 0; i < vertexCount; i += 1) {
        vertices[i] = {
            x: position.getX(i),
            y: position.getY(i),
            z: position.getZ(i),
            nx: normal.getX(i),
            ny: normal.getY(i),
            nz: normal.getZ(i),
        };
    }

    // Double every original vertex into a base (finT=0) / tip (finT=1) pair,
    // sharing position and normal — one pass over the vertex list, not the
    // edge list.
    const doubledCount = vertexCount * 2;
    const positions = new Float32Array(doubledCount * 3);
    const normals = new Float32Array(doubledCount * 3);
    const finT = new Float32Array(doubledCount);

    for (let i = 0; i < vertexCount; i += 1) {
        const v = vertices[i];

        if (!v) {
            continue;
        }

        const lower = i * 2;
        const upper = lower + 1;

        positions[lower * 3] = v.x;
        positions[lower * 3 + 1] = v.y;
        positions[lower * 3 + 2] = v.z;
        positions[upper * 3] = v.x;
        positions[upper * 3 + 1] = v.y;
        positions[upper * 3 + 2] = v.z;

        normals[lower * 3] = v.nx;
        normals[lower * 3 + 1] = v.ny;
        normals[lower * 3 + 2] = v.nz;
        normals[upper * 3] = v.nx;
        normals[upper * 3 + 1] = v.ny;
        normals[upper * 3 + 2] = v.nz;

        finT[lower] = 0;
        finT[upper] = 1;
    }

    // Two triangles per unique edge, referencing the shared base/tip pairs
    // of that edge's two endpoints via the index buffer.
    const edges = collectUniqueEdges(index);
    const indices = new Uint32Array(edges.length * 6);
    let ii = 0;

    for (const edge of edges) {
        const [a, b] = edge;
        const aLower = a * 2;
        const aUpper = aLower + 1;
        const bLower = b * 2;
        const bUpper = bLower + 1;

        indices[ii++] = aLower;
        indices[ii++] = bLower;
        indices[ii++] = bUpper;

        indices[ii++] = aLower;
        indices[ii++] = bUpper;
        indices[ii++] = aUpper;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new BufferAttribute(normals, 3));
    geometry.setAttribute("aFinT", new BufferAttribute(finT, 1));
    geometry.setIndex(new BufferAttribute(indices, 1));

    return geometry;
}

export interface CreateFinsOptions {
    noiseTexture: DataTexture;
    rootColor?: string;
    tipColor?: string;
}

export interface FinsResult {
    mesh: Mesh;
    material: FinMaterial;
}

/** The fin pass: one ordinary (non-instanced) mesh built once from the base
 *  geometry's edges. See the fin shader for how it self-selects down to
 *  only the silhouette at render time. */
export function createFins(
    geometry: BufferGeometry,
    options: CreateFinsOptions,
): FinsResult {
    const finGeometry = buildFinGeometry(geometry);
    const material = createFinMaterial({
        noiseTexture: options.noiseTexture,
        rootColor: options.rootColor,
        tipColor: options.tipColor,
    });
    const mesh = new Mesh(finGeometry, material);

    return { mesh, material };
}
