import {
    BufferAttribute,
    BufferGeometry,
    InstancedBufferAttribute,
    InstancedMesh,
    Vector3,
} from "three";

import { createStrandMaterial, type StrandMaterial } from "./createStrandMaterial";

/**
 * Real, individually-visible hair geometry, replacing the old shell-texture
 * illusion (see createShells.ts / createFins.ts, both removed alongside
 * this). Each strand is its own small tapered ribbon — a handful of
 * triangles, instanced thousands of times — rather than a shared alpha-
 * blended layer stack. That is the actual fix for "looks like one fuzzy
 * mass": a shell stack has no per-strand identity to begin with, no matter
 * how fine its noise pattern gets; a ribbon per hair does.
 *
 * Deliberately NOT full per-strand physics (agreed scope: "middle ground").
 * Each strand still reacts to the one shared, CPU-spring-damped cursor brush
 * from cursorInteraction.ts, but every instance carries its own
 * hashed seed that desyncs its response curve, strength, tilt and curl, so
 * neighbouring strands visibly diverge under the same brush instead of
 * moving as one rigid patch. See strand.vert for exactly how.
 */

/** Rings along a strand's length, root (t=0) to tip (t=1). 5 keeps a visible
 *  taper and a touch of curl at a cost of only 10 vertices / 8 triangles per
 *  strand — cheap enough that instance count, not per-strand complexity, is
 *  the knob that matters for performance. */
const SEGMENTS = 5;
/** Additional root selection weight for explicitly rounded line terminals. */
const EDGE_FUR_DENSITY_BOOST = 0.85;

export interface StrandTemplate {
    geometry: BufferGeometry;
}

/**
 * The shared, non-instanced template every strand instance re-transforms in
 * strand.vert. `position.x` is reused as the -1/+1 SIDE of the ribbon (which
 * edge of its width this vertex is) and `position.y` as T (0 at the root,
 * 1 at the tip) — not real positions; the actual per-strand shape and
 * placement is computed entirely in the vertex shader from these two plus
 * the per-instance attributes below. Doing it this way (instead of custom
 * attribute names) reuses the attribute three.js/WebGL already wires up for
 * every geometry, with no extra buffer.
 */
function buildStrandTemplate(): StrandTemplate {
    const ringCount = SEGMENTS + 1;
    const positions = new Float32Array(ringCount * 2 * 3);
    const indices: number[] = [];

    for (let i = 0; i < ringCount; i += 1) {
        const t = i / SEGMENTS;

        for (const side of [-1, 1]) {
            const vi = i * 2 + (side === -1 ? 0 : 1);

            positions[vi * 3] = side;
            positions[vi * 3 + 1] = t;
            positions[vi * 3 + 2] = 0;
        }
    }

    for (let i = 0; i < SEGMENTS; i += 1) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;

        // Two triangles per ring-to-ring quad. Winding doesn't matter for
        // shading (strand.frag shades by growth direction, never by this
        // template's own facet normal — see strand.vert) but is kept
        // consistent anyway; DoubleSide on the material is what actually
        // guards against ever culling the "wrong" face of a billboard whose
        // orientation is recomputed per vertex.
        indices.push(a, b, d, a, d, c);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setIndex(indices);

    return { geometry };
}

/** Deterministic PRNG (mulberry32) — strand placement/seeds should be stable
 *  across reloads (a fixed, reviewable arrangement) rather than re-randomised
 *  every HMR refresh. */
function mulberry32(seed: number): () => number {
    let a = seed;

    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface SampledRoots {
    /** vec3 per strand, object-space position on the tube surface. */
    roots: Float32Array;
    /** vec3 per strand, the surface's own (smooth, interpolated) normal at
     *  that point — each strand's un-tilted growth direction. */
    normals: Float32Array;
    /** One stable seed per strand for shader-side variation. */
    seeds: Float32Array;
}

/**
 * Places `count` strand roots on `geometry`'s surface, weighted by triangle
 * AREA rather than picked uniformly per-triangle — otherwise the small
 * triangles near the tube's tightly-radiused caps would carry the same
 * strand density as the large ones along a straight run, reading as
 * uneven tufting instead of a uniform pile.
 */
function sampleRoots(geometry: BufferGeometry, count: number): SampledRoots {
    const position = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    const index = geometry.getIndex();
    const furCoverage = geometry.getAttribute("furCoverage");

    if (!index) {
        throw new Error("sampleRoots requires an indexed geometry");
    }

    const triCount = index.count / 3;
    const cumulativeArea = new Float64Array(triCount);
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    const edgeA = new Vector3();
    const edgeB = new Vector3();
    let total = 0;

    for (let i = 0; i < triCount; i += 1) {
        a.fromBufferAttribute(position, index.getX(i * 3));
        b.fromBufferAttribute(position, index.getX(i * 3 + 1));
        c.fromBufferAttribute(position, index.getX(i * 3 + 2));

        const area = edgeA
            .subVectors(b, a)
            .cross(edgeB.subVectors(c, a))
            .length() * 0.5;
        const edgeCoverage = furCoverage
            ? (
                furCoverage.getX(index.getX(i * 3)) +
                furCoverage.getX(index.getX(i * 3 + 1)) +
                furCoverage.getX(index.getX(i * 3 + 2))
            ) / 3
            : 0;
        total += area * (1 + edgeCoverage * EDGE_FUR_DENSITY_BOOST);
        cumulativeArea[i] = total;
    }

    const random = mulberry32(0x5eed_1e57);
    const roots = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    const na = new Vector3();
    const nb = new Vector3();
    const nc = new Vector3();

    for (let s = 0; s < count; s += 1) {
        const target = random() * total;

        // Binary search for the first triangle whose cumulative area exceeds
        // `target` — this runs once per strand at load time, not per frame.
        let lo = 0;
        let hi = triCount - 1;

        while (lo < hi) {
            const mid = (lo + hi) >>> 1;

            if (cumulativeArea[mid]! < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        const tri = lo;
        a.fromBufferAttribute(position, index.getX(tri * 3));
        b.fromBufferAttribute(position, index.getX(tri * 3 + 1));
        c.fromBufferAttribute(position, index.getX(tri * 3 + 2));
        na.fromBufferAttribute(normal, index.getX(tri * 3));
        nb.fromBufferAttribute(normal, index.getX(tri * 3 + 1));
        nc.fromBufferAttribute(normal, index.getX(tri * 3 + 2));

        // Uniform-in-triangle barycentric sample (Osada et al.'s sqrt trick —
        // without it, points cluster toward one corner instead of spreading
        // evenly across the triangle's area).
        const r1 = random();
        const r2 = random();
        const su0 = Math.sqrt(r1);
        const wa = 1 - su0;
        const wb = r2 * su0;
        const wc = 1 - wa - wb;

        roots[s * 3] = a.x * wa + b.x * wb + c.x * wc;
        roots[s * 3 + 1] = a.y * wa + b.y * wb + c.y * wc;
        roots[s * 3 + 2] = a.z * wa + b.z * wb + c.z * wc;

        const nx = na.x * wa + nb.x * wb + nc.x * wc;
        const ny = na.y * wa + nb.y * wb + nc.y * wc;
        const nz = na.z * wa + nb.z * wb + nc.z * wc;
        const nLen = Math.hypot(nx, ny, nz) || 1;

        normals[s * 3] = nx / nLen;
        normals[s * 3 + 1] = ny / nLen;
        normals[s * 3 + 2] = nz / nLen;

        seeds[s] = random() * 1000;
    }

    return { roots, normals, seeds };
}

/** Strands per unit of the tube's own surface area (object-space units
 *  squared). Tuned against hello.glb specifically — see createStrands's own
 *  desktop/mobile counts, which are this density x the geometry's actual
 *  measured area, not hand-picked absolute numbers, so it stays correct if
 *  the letterform (and so its area) ever changes.
 *
 *  Raised 3x from an initial 5.2e5 / 2.1e5 pass: at that density the FRONT
 *  faces (most of the visible surface, since the camera sits close to
 *  head-on) read as bald between strands, with real coverage only where the
 *  billboard axis happens to line up with the silhouette — individually
 *  crisp hairs, but not a furry SURFACE. Real geometry has no free lunch the
 *  way the old shell/noise-texture technique did (a texture has no gaps by
 *  construction; discrete strand instances do, until there are enough of
 *  them) — this is that "enough" for the front faces specifically, checked
 *  by rendering, not derived.
 *
 *  Raised again (~1.7x, to 2.6e6 / 1.05e6) alongside shortening STRAND_LENGTH
 *  in createFur.ts: a shorter strand covers less screen area on its own, so
 *  holding coverage steady — let alone increasing it, which is what was
 *  actually asked for here — needs more of them, not the same count.
 *
 *  Raised once more (~1.4x) alongside a further STRAND_WIDTH cut — thinner
 *  strands need more of them per unit area to hold the same coverage, and
 *  measured render cost at the previous density left enormous headroom
 *  (~0.3ms/frame against a 16.6ms 60fps budget, gl.finish()-synced, not
 *  just CPU submit time), so there was room to spend on density rather than
 *  compromise on how thin each strand could be. */
// Restore the full pile density used by the realistic rendering pass. The
// shared scene loop now keeps this affordable: idle draws are capped, cursor
// and idle updates share one render, and the shadow map is no longer rebuilt
// per frame. Density is important here because front-facing fibres are heavily
// foreshortened; reducing the count exposes the support mesh and makes the
// letter interiors look flat even though roots are sampled across the whole
// surface.
function measureSurfaceArea(geometry: BufferGeometry): number {
    const position = geometry.getAttribute("position");
    const index = geometry.getIndex();

    if (!index) {
        return 0;
    }

    const triCount = index.count / 3;
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    const edgeA = new Vector3();
    const edgeB = new Vector3();
    let total = 0;

    for (let i = 0; i < triCount; i += 1) {
        a.fromBufferAttribute(position, index.getX(i * 3));
        b.fromBufferAttribute(position, index.getX(i * 3 + 1));
        c.fromBufferAttribute(position, index.getX(i * 3 + 2));
        total += edgeA
            .subVectors(b, a)
            .cross(edgeB.subVectors(c, a))
            .length() * 0.5;
    }

    return total;
}

export function strandCountFor(geometry: BufferGeometry, density: number): number {
    const area = measureSurfaceArea(geometry);

    return Math.round(area * density);
}

export interface CreateStrandsOptions {
    density: number;
    rootColor?: string;
    tipColor?: string;
    strandLength: number;
    strandWidth: number;
}

export interface StrandsResult {
    mesh: InstancedMesh;
    material: StrandMaterial;
}

export function createStrands(
    geometry: BufferGeometry,
    options: CreateStrandsOptions,
): StrandsResult {
    const count = strandCountFor(geometry, options.density);
    const { roots, normals, seeds } = sampleRoots(geometry, count);
    const { geometry: template } = buildStrandTemplate();

    template.setAttribute("aRoot", new InstancedBufferAttribute(roots, 3));
    template.setAttribute("aNormal", new InstancedBufferAttribute(normals, 3));
    template.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));

    const material = createStrandMaterial({
        rootColor: options.rootColor,
        tipColor: options.tipColor,
        strandLength: options.strandLength,
        strandWidth: options.strandWidth,
    });

    const mesh = new InstancedMesh(template, material, count);
    // Every instance's placement lives in aRoot/aNormal (read directly in
    // strand.vert), never in instanceMatrix — same reasoning as the old
    // shell system: nothing here scales or repositions the mesh as a whole.
    mesh.frustumCulled = false;

    return { mesh, material };
}
