import { BufferAttribute, BufferGeometry, Vector3 } from "three";

/**
 * Rebuilds hello.glb's lettering as a genuinely round, convex tube swept
 * along the model's OWN centreline.
 *
 * Why this exists — measured from the file, not assumed. hello.glb is not a
 * tube at all. Its swept cross-section is 510 rings of 27 vertices each, and
 * every one of those rings measures 0.0800 along the model's Y axis but only
 * 0.0100 across the letter plane: a thin flat ribbon, deeply extruded but
 * barely wide. Since the word is rotated to face the camera down that same Y
 * axis, we look at the ribbon EDGE-ON. The consequences were exactly the
 * symptoms this was reported as:
 *
 *   - Almost none of the visible stroke width was geometry. A 0.005
 *     half-width of base mesh sat inside ~0.011 of fur on each side, so the
 *     word was mostly fuzz around a hairline.
 *   - That hairline read as a hard line down the centre of every stroke —
 *     the "groove" — because it is a flat, sharply-bounded surface with a
 *     different shading response than the fur around it.
 *   - Nothing about it could ever look inflated or convex: the front-facing
 *     surface is genuinely flat, and only 0.01 wide.
 *
 * No amount of shading or fur tuning fixes a cross-section that is 8:1 flat,
 * which is why several passes of colour/lighting work never resolved it.
 *
 * The letterform itself is fine, so this keeps it exactly: the ring centres
 * of the original sweep ARE the handwritten path, so extracting them and
 * re-sweeping a circular profile along that same path preserves the shape
 * while replacing the profile with a round, convex one. Nothing here invents
 * letterforms from a font, an SVG, or a text primitive.
 */

export interface RoundedStrokeOptions {
    /**
     * Tube radius in source-model units. The original ribbon's in-plane
     * half-width was 0.005, so this is also "how much thicker the strokes
     * get".
     *
     * There is a hard ceiling here, measured from the letterform itself, not
     * chosen by taste. hello.glb's cursive is drawn with very tight
     * clearances — the median distance from a point on the path to the
     * nearest non-adjacent part of the path is only 0.0165, and the 5th
     * percentile is 0.0073. Since two strokes merge once 2 * radius exceeds
     * the gap between them, the proportion of the word that fuses together
     * climbs steeply:
     *
     *     r = 0.005  ->   9% merged   (the original thickness)
     *     r = 0.007  ->  23% merged   <- default
     *     r = 0.008  ->  43% merged
     *     r = 0.009  ->  79% merged
     *     r = 0.013  ->  95% merged   (loops fully closed; word illegible)
     *
     * Around 20% is roughly the genuine cursive joins — the places the pen
     * really does double back and touch. Past that the counters of the e, l,
     * l and o fill in and the word stops reading. So 0.007 is where "as
     * thick as possible" and "still legible" meet; going meaningfully
     * thicker needs a letterform drawn with wider counters, not a bigger
     * number here.
     */
    radius?: number;
    /** Vertices around the tube. 16 keeps the silhouette smooth at this
     *  on-screen size while producing FEWER vertices than the original mesh
     *  (510 x 16 = 8160 vs 13770), and correspondingly fewer fin edges. */
    radialSegments?: number;
    /** Rings used to round off each open stroke end into a dome. */
    capSegments?: number;
    /** Slight axial stretch for soft, handwritten terminals. */
    capLengthScale?: number;
}

interface Segment {
    points: Vector3[];
    closed: boolean;
}

/**
 * Recovers the vertices-per-ring of a swept mesh.
 *
 * A swept tube repeats the same cross-section profile at every ring, so the
 * profile's Y values repeat with the ring's period. This scores candidate
 * periods rather than demanding an exact match, because an exact match is
 * the wrong test: "hello" is six separate pen strokes concatenated into one
 * buffer, and at each of those six joins a window of one ring's length
 * straddles two strokes and breaks the pattern.
 *
 * Measured on hello.glb the separation is unambiguous — every wrong period
 * scores ~4%, while the true ring size (27) and its multiples score ~96%,
 * the shortfall being exactly those stroke joins. A 0.75 threshold therefore
 * sits in a very wide empty gap, and taking the SMALLEST qualifying divisor
 * picks 27 rather than one of its multiples.
 *
 * Returns null when nothing scores, so a mesh that is not a uniform sweep
 * leaves the caller on its original-geometry fallback instead of being
 * rebuilt into nonsense.
 */
function detectRingSize(
    getY: (i: number) => number,
    count: number,
): number | null {
    const EPS = 1e-6;
    const THRESHOLD = 0.75;

    for (let k = 3; k <= Math.min(256, Math.floor(count / 8)); k += 1) {
        if (count % k !== 0) {
            continue;
        }

        let hits = 0;
        let total = 0;

        // Sampled rather than exhaustive — enough to separate ~96% from ~4%,
        // and this runs once at load.
        for (let i = 0; i < count - k; i += 7) {
            if (Math.abs(getY(i) - getY(i + k)) <= EPS) {
                hits += 1;
            }

            total += 1;
        }

        if (total > 0 && hits / total >= THRESHOLD) {
            return k;
        }
    }

    return null;
}

/** Light smoothing of the extracted centreline. Ring centres carry a little
 *  sampling noise, which a round profile shows up as faint ripples along the
 *  stroke; a couple of passes of a [1,2,1] kernel removes it without moving
 *  the path perceptibly. Endpoints are pinned so strokes keep their length. */
function smooth(points: Vector3[], passes: number, closed: boolean): Vector3[] {
    let current = points;

    for (let p = 0; p < passes; p += 1) {
        const next = current.map((v) => v.clone());

        for (let i = 0; i < current.length; i += 1) {
            if (!closed && (i === 0 || i === current.length - 1)) {
                continue;
            }

            const prev = current[(i - 1 + current.length) % current.length]!;
            const here = current[i]!;
            const after = current[(i + 1) % current.length]!;

            next[i]!.copy(prev)
                .add(here.clone().multiplyScalar(2))
                .add(after)
                .multiplyScalar(0.25);
        }

        current = next;
    }

    return current;
}

/** Splits the ring centres into the separate pen strokes of the word. A jump
 *  much larger than the typical step means the sweep restarted somewhere
 *  else — "hello" is 6 such strokes. */
function splitStrokes(centres: Vector3[]): Segment[] {
    const steps: number[] = [];

    for (let i = 0; i < centres.length - 1; i += 1) {
        steps.push(centres[i]!.distanceTo(centres[i + 1]!));
    }

    const sorted = [...steps].sort((a, b) => a - b);
    const median = sorted[sorted.length >> 1] ?? 1;

    const segments: Segment[] = [];
    let start = 0;

    const push = (from: number, to: number) => {
        // Two centre rings are sufficient for `sweep` to build a short,
        // capped stroke. The source model contains one such separate
        // component; discarding it here removes real letter geometry.
        if (to - from < 1) {
            return;
        }

        const points = centres.slice(from, to + 1);
        // A stroke whose ends meet (the 'o', loops) should wrap instead of
        // being capped, or it shows a seam where the dome meets the tube.
        const closed = points[0]!.distanceTo(points[points.length - 1]!) < median * 2;

        if (closed) {
            points.pop();
        }

        segments.push({ points, closed });
    };

    for (let i = 0; i < steps.length; i += 1) {
        if (steps[i]! > median * 6) {
            push(start, i);
            start = i + 1;
        }
    }

    push(start, centres.length - 1);

    return segments;
}

/**
 * Sweeps a circular profile along one stroke using parallel-transport
 * frames — each frame is the previous one rotated by the minimal rotation
 * between consecutive tangents, rather than rebuilt from a fixed world "up".
 * A Frenet frame would flip wherever the handwritten path has an inflection
 * or a straight run, twisting the tube; parallel transport cannot.
 */
function sweep(
    segment: Segment,
    radius: number,
    radialSegments: number,
    capSegments: number,
    capLengthScale: number,
    positions: number[],
    indices: number[],
): void {
    const pts = segment.points;
    const n = pts.length;

    if (n < 2) {
        return;
    }

    const tangents: Vector3[] = [];

    for (let i = 0; i < n; i += 1) {
        const prev = pts[(i - 1 + n) % n]!;
        const next = pts[(i + 1) % n]!;
        let t: Vector3;

        if (segment.closed) {
            t = next.clone().sub(prev);
        } else if (i === 0) {
            t = pts[1]!.clone().sub(pts[0]!);
        } else if (i === n - 1) {
            t = pts[n - 1]!.clone().sub(pts[n - 2]!);
        } else {
            t = next.clone().sub(prev);
        }

        if (t.lengthSq() < 1e-20) {
            t.set(0, 0, 1);
        }

        tangents.push(t.normalize());
    }

    // Seed the first frame with any axis that is not parallel to the tangent.
    const first = tangents[0]!;
    let normal = new Vector3(0, 1, 0);

    if (Math.abs(first.dot(normal)) > 0.9) {
        normal.set(1, 0, 0);
    }

    normal = normal.sub(first.clone().multiplyScalar(normal.dot(first))).normalize();

    const normals: Vector3[] = [normal];

    for (let i = 1; i < n; i += 1) {
        const prevT = tangents[i - 1]!;
        const currT = tangents[i]!;
        const carried = normals[i - 1]!.clone();
        const axis = prevT.clone().cross(currT);

        if (axis.lengthSq() > 1e-20) {
            axis.normalize();
            const angle = Math.acos(Math.min(1, Math.max(-1, prevT.dot(currT))));
            carried.applyAxisAngle(axis, angle);
        }

        // Re-orthogonalise against drift so the frame stays exactly
        // perpendicular over hundreds of steps.
        carried.sub(currT.clone().multiplyScalar(carried.dot(currT)));
        normals.push(carried.normalize());
    }

    const ringStarts: number[] = [];

    const emitRing = (centre: Vector3, t: Vector3, nrm: Vector3, r: number) => {
        const bin = t.clone().cross(nrm).normalize();
        const ringStart = positions.length / 3;

        for (let j = 0; j < radialSegments; j += 1) {
            const a = (j / radialSegments) * Math.PI * 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;

            positions.push(
                centre.x + nrm.x * x + bin.x * y,
                centre.y + nrm.y * x + bin.y * y,
                centre.z + nrm.z * x + bin.z * y,
            );
        }

        ringStarts.push(ringStart);
    };

    const emitPole = (centre: Vector3) => {
        const pole = positions.length / 3;
        positions.push(centre.x, centre.y, centre.z);
        return pole;
    };

    let startPole: number | null = null;
    let endPole: number | null = null;

    // Dome the open ends so a stroke finishes as a rounded tip rather than an
    // open pipe. cos/sin of the dome angle gives radius and how far the ring
    // sits beyond the endpoint, i.e. a hemisphere.
    if (!segment.closed) {
        startPole = emitPole(
            pts[0]!.clone().add(
                tangents[0]!.clone().multiplyScalar(-radius * capLengthScale),
            ),
        );

        for (let c = capSegments - 1; c >= 1; c -= 1) {
            const phi = (c / capSegments) * (Math.PI / 2);
            emitRing(
                pts[0]!.clone().add(
                    tangents[0]!.clone().multiplyScalar(
                        -Math.sin(phi) * radius * capLengthScale,
                    ),
                ),
                tangents[0]!,
                normals[0]!,
                Math.cos(phi) * radius,
            );
        }
    }

    for (let i = 0; i < n; i += 1) {
        emitRing(pts[i]!, tangents[i]!, normals[i]!, radius);
    }

    if (!segment.closed) {
        for (let c = 1; c < capSegments; c += 1) {
            const phi = (c / capSegments) * (Math.PI / 2);
            emitRing(
                pts[n - 1]!.clone().add(
                    tangents[n - 1]!.clone().multiplyScalar(
                        Math.sin(phi) * radius * capLengthScale,
                    ),
                ),
                tangents[n - 1]!,
                normals[n - 1]!,
                Math.cos(phi) * radius,
            );
        }

        endPole = emitPole(
            pts[n - 1]!.clone().add(
                tangents[n - 1]!.clone().multiplyScalar(radius * capLengthScale),
            ),
        );
    }

    const rings = ringStarts.length;

    // Two triangles per quad. The radial index wraps with %, so the seam
    // shares vertices instead of duplicating them — no split normals, and so
    // no seam line of the kind the original mesh needed welding to fix.
    //
    // Winding matters here and is not a matter of taste. `emitRing` walks
    // its profile from `nrm` toward `bin = cross(tangent, nrm)`, and rings
    // advance along `tangent`; taking the ring step first and the angular
    // step second therefore yields cross(tangent, angular) = -radial, i.e.
    // faces wound so that `computeVertexNormals` points every normal at the
    // tube's own axis. Everything downstream reads that normal as "out":
    // shells, fins and the cursor's compression all displace along it, and
    // the support mesh backface-culls against it. Inverted, the entire fur
    // volume grows INWARD — measured on the rendered canvas, the word came
    // out as a smooth, furless balloon with the fur stack hidden inside it
    // and the inside of the far wall showing through. So the angular step is
    // taken first.
    const lastRing = segment.closed ? rings : rings - 1;

    for (let i = 0; i < lastRing; i += 1) {
        const a = ringStarts[i]!;
        const b = ringStarts[(i + 1) % rings]!;

        for (let j = 0; j < radialSegments; j += 1) {
            const j2 = (j + 1) % radialSegments;

            indices.push(a + j, b + j2, b + j);
            indices.push(a + j, a + j2, b + j2);
        }
    }

    if (!segment.closed && startPole !== null && endPole !== null) {
        const firstRing = ringStarts[0]!;
        const finalRing = ringStarts[rings - 1]!;

        for (let j = 0; j < radialSegments; j += 1) {
            const j2 = (j + 1) % radialSegments;

            // Real poles avoid the degenerate zero-radius rings previously
            // used here. Their faces give the endpoint a continuous normal,
            // so fur grows around a rounded cap instead of a clipped edge.
            indices.push(startPole, firstRing + j2, firstRing + j);
            indices.push(finalRing + j, finalRing + j2, endPole);
        }
    }
}

/**
 * Returns a rounded rebuild of `source`, or null if `source` is not a
 * uniform swept mesh this can safely interpret — in which case the caller
 * should fall back to using the original geometry unchanged.
 */
export function buildRoundedStrokeGeometry(
    source: BufferGeometry,
    options: RoundedStrokeOptions = {},
): BufferGeometry | null {
    const radius = options.radius ?? 0.007;
    const radialSegments = options.radialSegments ?? 24;
    const capSegments = options.capSegments ?? 4;
    const capLengthScale = options.capLengthScale ?? 1;

    const position = source.getAttribute("position");

    if (!position) {
        return null;
    }

    const ringSize = detectRingSize((i) => position.getY(i), position.count);

    if (!ringSize) {
        return null;
    }

    const ringTotal = position.count / ringSize;
    const centres: Vector3[] = [];

    for (let r = 0; r < ringTotal; r += 1) {
        const c = new Vector3();

        for (let j = 0; j < ringSize; j += 1) {
            const i = r * ringSize + j;
            c.x += position.getX(i);
            c.y += position.getY(i);
            c.z += position.getZ(i);
        }

        centres.push(c.divideScalar(ringSize));
    }

    const positions: number[] = [];
    const indices: number[] = [];

    for (const segment of splitStrokes(centres)) {
        sweep(
            { ...segment, points: smooth(segment.points, 2, segment.closed) },
            radius,
            radialSegments,
            capSegments,
            capLengthScale,
            positions,
            indices,
        );
    }

    if (indices.length === 0) {
        return null;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(positions), 3),
    );
    geometry.setIndex(
        new BufferAttribute(new Uint32Array(indices), 1),
    );
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    return geometry;
}
