import type { BufferGeometry } from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { buildRoundedStrokeGeometry } from "./buildRoundedStroke";

/**
 * Tube radius, in hello.glb's raw (~0.4-unit-wide) object space, for the
 * rounded rebuild — see buildRoundedStroke.ts for what it replaces and why
 * the source ribbon cannot be shaded into looking round.
 *
 * 0.0085 against the original ribbon's 0.005 in-plane half-width, i.e. ~70%
 * thicker in the direction that is actually visible.
 *
 * This is the CEILING, not a taste setting, and it was found by rendering
 * rather than reasoned from the model. What caps it is the cursive's own
 * clearances: measured off hello.glb's centreline, the gap from a point on
 * the path to the nearest non-adjacent part of it is 0.0164 at the median
 * and 0.0073 at the 5th percentile, and the fur adds its own 0.011 halo on
 * every side of whatever the body's radius is. Rendered:
 *
 *     0.0085  the letter counters — the eye of the e, the two l loops, the
 *             o — are open; this is the value here
 *     0.0090  the e's eye has already closed
 *     0.0105  the word is a blob, with or without a shorter fur pile
 *     0.0125  no letterforms left at all
 *
 * So the body cannot be made to dominate the stroke by growing it. Whether
 * the word reads as solid or as a hollow outline is set by the RATIO of this
 * radius to uFurLength, and with the radius pinned here that ratio is the
 * fur's to give.
 */
const STROKE_RADIUS = 0.0085;

/**
 * How coincident two vertices must be (in hello.glb's raw, ~0.4-unit-wide
 * object space) to be welded into one before normals are recomputed.
 *
 * This removes a dark seam that otherwise runs along the tube: the source
 * mesh duplicates vertices at its circular cross-section's wrap seam, each
 * copy keeping its own (slightly different) normal, since
 * `computeVertexNormals` averages by vertex INDEX, not by position — two
 * position-identical-but-separately-indexed vertices never get merged into
 * one shared normal on their own. Welding first, then recomputing, fixes
 * this at the source instead of masking it in the shader.
 *
 * 1e-5 is comfortably smaller than the tightest real gap between two
 * different loops of hello.glb's cursive stroke (measured at ~4e-4 in the
 * file) — small enough that genuinely separate geometry is never
 * accidentally welded, large enough to catch the seam's
 * floating-point-identical duplicates.
 *
 * Only reached on the fallback path below; the rounded rebuild shares its
 * seam vertices by construction and so has nothing to weld.
 */
const WELD_TOLERANCE = 1e-5;

/**
 * Prepares the source geometry for fur generation.
 *
 * Preferred path: re-sweep the word as a genuinely round tube along its own
 * centreline (buildRoundedStroke.ts). The source mesh is an 8:1 flat ribbon
 * seen edge-on, which is why the strokes read as a hairline core inside a
 * cloud of fur with a hard line down the middle — no amount of shading fixes
 * a cross-section that is flat. The rebuild keeps the letterform exactly
 * (it sweeps the ORIGINAL ring centres, it does not synthesise letters from
 * a font or an SVG) and changes only the profile: round, convex, thicker,
 * with domed ends and no hard edges anywhere.
 *
 * Fallback path (a source mesh that is not a uniform sweep, so the rebuild
 * declines): the previous behaviour, unchanged — weld position-duplicate
 * vertices, then recompute smooth normals.
 *
 * The original geometry is never mutated. Normal and UV attributes are
 * dropped before welding — `mergeVertices` only merges vertices whose EVERY
 * attribute matches, and the seam's old (divergent) normals and
 * texture-wrap UVs would otherwise block exactly the merge this is for.
 * Neither is used downstream: fur placement is driven by object-space
 * position via a fixed-axis triplanar projection (see shell.frag), not by UV.
 */
export function prepareGeometry(source: BufferGeometry): BufferGeometry {
    const rounded = buildRoundedStrokeGeometry(source, {
        radius: STROKE_RADIUS,
        // 20 segments puts the facet-to-facet angle at 18 degrees. On a
        // stroke this narrow that is already below what reads as faceted,
        // and it keeps the rebuilt mesh (~11k vertices) and its derived fin
        // edges slightly cheaper than the original 13.7k-vertex ribbon.
        radialSegments: 20,
        capSegments: 5,
    });

    if (rounded) {
        return rounded;
    }

    let geometry = source.clone();

    geometry.deleteAttribute("normal");
    if (geometry.getAttribute("uv")) {
        geometry.deleteAttribute("uv");
    }

    geometry = mergeVertices(geometry, WELD_TOLERANCE);
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    return geometry;
}
