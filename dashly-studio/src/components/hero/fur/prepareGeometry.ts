import type { BufferGeometry } from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
 * The piellardj/fur-threejs reference does not do this (zero occurrences of
 * `mergeVertices` anywhere in its bundle) — its demo models (torus, chair,
 * sphere, …) evidently do not have this kind of seam, so there was nothing
 * for it to fix. This is specific to hello.glb, not something carried over
 * from the reference.
 */
const WELD_TOLERANCE = 1e-5;

/**
 * Clones the given geometry and prepares it for fur generation: welds
 * position-duplicate vertices (see WELD_TOLERANCE), then recomputes smooth
 * vertex normals from the welded topology.
 *
 * The original geometry is never mutated. Normal and UV attributes are
 * dropped before welding — `mergeVertices` only merges vertices whose EVERY
 * attribute matches, and the seam's old (divergent) normals and
 * texture-wrap UVs would otherwise block exactly the merge this is for.
 * Neither is used downstream: fur placement is driven by object-space
 * position via a per-fragment tangent basis (see shell.frag), not by UV.
 */
export function prepareGeometry(source: BufferGeometry): BufferGeometry {
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
