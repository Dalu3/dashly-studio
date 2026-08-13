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
 * static response, growth and curl attributes derived once from a stable
 * seed, so neighbouring strands visibly diverge under the same brush without
 * repeating that seed math for every template vertex. See strand.vert.
 */

/** Rings along a strand's length, root (t=0) to tip (t=1). 5 keeps a visible
 *  taper and a touch of curl at a cost of only 10 vertices / 8 triangles per
 *  strand — cheap enough that instance count, not per-strand complexity, is
 *  the knob that matters for performance. */
const SEGMENTS = 5;
/** Size of the subtle shared lean field in model-space units. */
const SPATIAL_CLUMP_SIZE = 0.01;
/**
 * Keep clumping at one deliberately weak value. Randomly raising individual
 * cells as high as 0.08 creates isolated dense tufts at tight stroke joins,
 * even though root density and the underlying geometry are uniform.
 */
const SPATIAL_CLUMP_STRENGTH = 0.02;

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

export interface StrandAttributeData {
    /** vec3 per strand, object-space position on the tube surface. */
    roots: Float32Array;
    /** vec3 per strand, the surface's own (smooth, interpolated) normal at
     *  that point — each strand's un-tilted growth direction. */
    normals: Float32Array;
    /** Precomputed, static per-strand shader inputs. Each vec4 packs a
     *  direction plus one related scalar to keep attribute count modest. */
    growth: Float32Array;
    curl: Float32Array;
    idle: Float32Array;
    params: Float32Array;
    shade: Float32Array;
}

const fract = (value: number) => value - Math.floor(value);
const hash1 = (value: number) => fract(Math.sin(value) * 43758.5453123);
const smoothstep = (edge0: number, edge1: number, value: number) => {
    const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

/** CPU equivalent of common.glsl's branchless basisFromNormal(). */
function basisFromNormalComponents(
    nx: number,
    ny: number,
    nz: number,
): [number, number, number, number, number, number] {
    const sign = nz >= 0 ? 1 : -1;
    const a = -1 / (sign + nz);
    const b = nx * ny * a;

    return [
        1 + sign * nx * nx * a,
        sign * b,
        -sign * nx,
        b,
        sign + ny * ny * a,
        -ny,
    ];
}

/**
 * Places `count` strand roots on `geometry`'s surface, weighted by triangle
 * AREA rather than picked uniformly per-triangle — otherwise the small
 * triangles near the tube's tightly-radiused caps would carry the same
 * strand density as the large ones along a straight run, reading as
 * uneven tufting instead of a uniform pile.
 */
export function generateStrandAttributes(
    geometry: BufferGeometry,
    count: number,
): StrandAttributeData {
    const position = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    const index = geometry.getIndex();

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
        // Keep roots area-weighted across the whole tube. Biasing the visible
        // hemisphere or repaired terminals concentrates an unchanged total
        // number of strands at tight joins, where it reads as a clump rather
        // than an even coat.
        total += area;
        cumulativeArea[i] = total;
    }

    const random = mulberry32(0x5eed_1e57);
    const roots = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const growth = new Float32Array(count * 4);
    const curl = new Float32Array(count * 4);
    const idle = new Float32Array(count * 4);
    const params = new Float32Array(count * 4);
    const shade = new Float32Array(count);

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

        const seed = random() * 1000;
        const hLen = hash1(seed * 12.9898);
        const hWidth = hash1(seed * 29.7331);
        const hCurlAmt = hash1(seed * 41.311);
        const hCurlAng = hash1(seed * 53.913);
        const hTiltAmt = hash1(seed * 7.719);
        const hTiltAng = hash1(seed * 13.377);
        const hResp = hash1(seed * 23.371);
        const hStrMul = hash1(seed * 31.951);
        const hShade = hash1(seed * 89.317);
        const hIdlePh = hash1(seed * 101.667);
        const hIdleFr = hash1(seed * 113.311);
        const hIdleAng = hash1(seed * 127.211);

        const guardHair = smoothstep(0.92, 1, hLen);
        const lenScale = 0.64 + (1.32 - 0.64) * hLen + guardHair * 0.26;
        const widthScale =
            (0.68 + (1.48 - 0.68) * hWidth) *
            (1.06 + (0.9 - 1.06) * guardHair);
        const curlAmount = 0.04 + (0.32 - 0.04) * hCurlAmt;
        const curlAngle = hCurlAng * Math.PI * 2;
        const tiltAmount = 0.08 + (0.48 - 0.08) * hTiltAmt;
        const tiltAngle = hTiltAng * Math.PI * 2;
        const responseExp = 0.55 + (1.9 - 0.55) * hResp;
        const strengthMul = 0.55 + (1.35 - 0.55) * hStrMul;
        const idlePhase = hIdlePh * Math.PI * 2;
        const idleFreq = 0.5 + (1.1 - 0.5) * hIdleFr;
        const idleAngle = hIdleAng * Math.PI * 2;

        const [tx, ty, tz, bx, by, bz] = basisFromNormalComponents(
            nx / nLen,
            ny / nLen,
            nz / nLen,
        );
        const tiltCos = Math.cos(tiltAngle);
        const tiltSin = Math.sin(tiltAngle);
        const tiltX = tiltCos * tx + tiltSin * bx;
        const tiltY = tiltCos * ty + tiltSin * by;
        const tiltZ = tiltCos * tz + tiltSin * bz;

        const rootX = roots[s * 3]!;
        const rootY = roots[s * 3 + 1]!;
        const rootZ = roots[s * 3 + 2]!;
        const cellX = Math.floor(rootX / SPATIAL_CLUMP_SIZE);
        const cellY = Math.floor(rootY / SPATIAL_CLUMP_SIZE);
        const cellZ = Math.floor(rootZ / SPATIAL_CLUMP_SIZE);
        const clumpId = cellX + cellY * 57 + cellZ * 113;
        const centreX =
            (cellX + 0.5 + (hash1(clumpId + 11.7) - 0.5) * 0.48) *
            SPATIAL_CLUMP_SIZE;
        const centreY =
            (cellY + 0.5 + (hash1(clumpId + 37.1) - 0.5) * 0.48) *
            SPATIAL_CLUMP_SIZE;
        const centreZ =
            (cellZ + 0.5 + (hash1(clumpId + 73.9) - 0.5) * 0.48) *
            SPATIAL_CLUMP_SIZE;
        const offsetX = centreX - rootX;
        const offsetY = centreY - rootY;
        const offsetZ = centreZ - rootZ;
        const normalDot =
            offsetX * (nx / nLen) +
            offsetY * (ny / nLen) +
            offsetZ * (nz / nLen);
        let clumpX = offsetX - (nx / nLen) * normalDot;
        let clumpY = offsetY - (ny / nLen) * normalDot;
        let clumpZ = offsetZ - (nz / nLen) * normalDot;
        const clumpLength = Math.hypot(clumpX, clumpY, clumpZ);
        if (clumpLength > 1e-5) {
            clumpX /= clumpLength;
            clumpY /= clumpLength;
            clumpZ /= clumpLength;
        } else {
            clumpX = tiltX;
            clumpY = tiltY;
            clumpZ = tiltZ;
        }
        let growX =
            nx / nLen +
            tiltX * tiltAmount +
            clumpX * SPATIAL_CLUMP_STRENGTH;
        let growY =
            ny / nLen +
            tiltY * tiltAmount +
            clumpY * SPATIAL_CLUMP_STRENGTH;
        let growZ =
            nz / nLen +
            tiltZ * tiltAmount +
            clumpZ * SPATIAL_CLUMP_STRENGTH;
        const growLength = Math.hypot(growX, growY, growZ) || 1;
        growX /= growLength;
        growY /= growLength;
        growZ /= growLength;

        const [ctx, cty, ctz, cbx, cby, cbz] = basisFromNormalComponents(
            growX,
            growY,
            growZ,
        );
        const curlCos = Math.cos(curlAngle);
        const curlSin = Math.sin(curlAngle);
        const idleCos = Math.cos(idleAngle);
        const idleSin = Math.sin(idleAngle);
        const packed = s * 4;

        growth[packed] = growX;
        growth[packed + 1] = growY;
        growth[packed + 2] = growZ;
        growth[packed + 3] = lenScale;
        curl[packed] = curlCos * ctx + curlSin * cbx;
        curl[packed + 1] = curlCos * cty + curlSin * cby;
        curl[packed + 2] = curlCos * ctz + curlSin * cbz;
        curl[packed + 3] = curlAmount;
        idle[packed] = idleCos * tx + idleSin * bx;
        idle[packed + 1] = idleCos * ty + idleSin * by;
        idle[packed + 2] = idleCos * tz + idleSin * bz;
        idle[packed + 3] = idlePhase;
        params[packed] = widthScale;
        params[packed + 1] = idleFreq;
        params[packed + 2] = responseExp;
        params[packed + 3] = strengthMul;
        shade[s] = hShade;
    }

    return { roots, normals, growth, curl, idle, params, shade };
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
    prepared?: StrandAttributeData,
): StrandsResult {
    const count = prepared
        ? prepared.roots.length / 3
        : strandCountFor(geometry, options.density);
    const { roots, normals, growth, curl, idle, params, shade } =
        prepared ?? generateStrandAttributes(geometry, count);
    const { geometry: template } = buildStrandTemplate();

    template.setAttribute("aRoot", new InstancedBufferAttribute(roots, 3));
    template.setAttribute("aNormal", new InstancedBufferAttribute(normals, 3));
    template.setAttribute("aGrowth", new InstancedBufferAttribute(growth, 4));
    template.setAttribute("aCurl", new InstancedBufferAttribute(curl, 4));
    template.setAttribute("aIdle", new InstancedBufferAttribute(idle, 4));
    template.setAttribute("aParams", new InstancedBufferAttribute(params, 4));
    template.setAttribute("aShade", new InstancedBufferAttribute(shade, 1));

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
