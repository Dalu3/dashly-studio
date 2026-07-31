import {
    DataTexture,
    LinearFilter,
    LinearMipmapLinearFilter,
    RepeatWrapping,
    RGBAFormat,
} from "three";

/**
 * Bakes the fur's strand pattern into a small tileable texture, once, at
 * load time.
 *
 * This is the technique verified in the piellardj/fur-threejs reference
 * (its shell shader samples a texture whose RED channel is "how tall can
 * fur grow at this texel" and whose GREEN channel is a per-strand shading
 * multiplier — recovered via string-literal extraction from its minified
 * bundle, since that repository ships no readable source or sourcemap). The
 * reference ships this as a pre-authored 256x256 PNG
 * (docs/resources/textures/noise.png); pulling that exact file down and
 * inspecting its raw pixel values (R min 0 / max 255 / mean ~125, a smooth
 * radial gradient from isolated minima) confirms R is a genuine, UNBOUNDED
 * Worley/Voronoi **F1 distance field** — 0 exactly at each jittered seed
 * point, rising with distance from it — not a per-seed disk of fixed
 * radius. That matters: with `hairLength = max(0.01, R)` and a shell
 * discarding once its own height exceeds that, hair is bald only in the
 * small area immediately surrounding each seed and grows across nearly all
 * the REST of the cell, including every point that is merely equidistant
 * between two neighbouring seeds — not just a small disk around one
 * center. An earlier version of this function instead computed a capped
 * "coverage disk" (`max(0, 1 - dist/radius)`) that fell back to a length
 * FLOOR outside a ~0.3-0.55-cell-unit disk around each seed, leaving large
 * swathes of every cell at the shortest possible strand length — a real,
 * measurable contributor to the fur reading as a sparse layer of tufts
 * rather than one continuous dense surface. Generating it procedurally here
 * (rather than shipping the reference's own PNG) keeps the pattern's
 * parameters (cell count, length range) part of the code.
 *
 *   R = raw, normalised Voronoi F1 distance to the nearest jittered seed —
 *       0 at a seed, rising smoothly with distance from it, clamped to 1 at
 *       `normDistance` cell-units out. Comparing a shell's own height
 *       against this value (see shell.frag / fin.frag) is what gives each
 *       strand its length, with only the immediate neighbourhood of each
 *       seed reading as short/bald.
 *   G = a second, decorrelated per-cell value used as a brightness
 *       multiplier, for subtle tone variation between neighbouring fibres —
 *       kept in the same ~0.6-1.0 range measured in the reference's own PNG
 *       (161-255 of 255).
 */

export interface NoiseTextureOptions {
    /** Texture resolution (square). */
    size?: number;
    /** How many Worley cells the texture spans, before tiling. */
    cellsPerAxis?: number;
    /** Minimum / maximum relative strand length, both in (0, 1]. */
    minLength?: number;
    maxLength?: number;
    /**
     * Raw F1 distance (in cell units) that maps to `maxLength`. A Voronoi
     * cell's farthest interior point from its own seed — a cell vertex,
     * equidistant from 2-3 neighbours — typically falls around 0.55-0.75
     * cell-units out with this jitter amount; 0.65 spreads the full
     * min-max range across most of a cell's area instead of saturating
     * (clipping to maxLength) too early or too late.
     */
    normDistance?: number;
}

function hash2(x: number, y: number): [number, number] {
    const dx = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    const dy = Math.sin(x * 269.5 + y * 183.3) * 43758.5453123;

    return [dx - Math.floor(dx), dy - Math.floor(dy)];
}

function hash1(x: number): number {
    const s = Math.sin(x) * 43758.5453123;

    return s - Math.floor(s);
}

export function generateNoiseTexture(
    options: NoiseTextureOptions = {},
): DataTexture {
    const size = options.size ?? 128;
    const cellsPerAxis = options.cellsPerAxis ?? 16;
    const minLength = options.minLength ?? 0.06;
    const maxLength = options.maxLength ?? 1.0;
    const normDistance = options.normDistance ?? 0.65;

    const data = new Uint8Array(size * size * 4);

    for (let py = 0; py < size; py += 1) {
        for (let px = 0; px < size; px += 1) {
            const u = (px / size) * cellsPerAxis;
            const v = (py / size) * cellsPerAxis;
            const cellX = Math.floor(u);
            const cellY = Math.floor(v);

            let bestDist = Infinity;
            let bestCellX = cellX;
            let bestCellY = cellY;

            // 3x3 neighbour search for the nearest jittered cell centre —
            // what turns a plain grid into organic-looking Worley noise
            // (see the shell/fin shaders' own commentary on this trade-off).
            for (let oy = -1; oy <= 1; oy += 1) {
                for (let ox = -1; ox <= 1; ox += 1) {
                    const cx = cellX + ox;
                    const cy = cellY + oy;
                    const [jx, jy] = hash2(cx, cy);
                    const centerX = cx + 0.15 + jx * 0.7;
                    const centerY = cy + 0.15 + jy * 0.7;
                    const dx = u - centerX;
                    const dy = v - centerY;
                    const dist = Math.hypot(dx, dy);

                    if (dist < bestDist) {
                        bestDist = dist;
                        bestCellX = cx;
                        bestCellY = cy;
                    }
                }
            }

            const cellRand2 = hash1(bestCellX * 39.346 + bestCellY * 11.135);

            // Raw F1 distance, normalised and clamped — see normDistance
            // above. This is the reference's own field shape: bald only
            // right at each seed, growing across essentially the whole rest
            // of the cell rather than being capped to a small disk.
            const normalized = Math.min(1, bestDist / normDistance);
            const length = minLength + (maxLength - minLength) * normalized;
            const shade = 0.6 + 0.4 * cellRand2;

            const idx = (py * size + px) * 4;
            data[idx] = Math.round(Math.min(255, Math.max(0, length * 255)));
            data[idx + 1] = Math.round(Math.min(255, Math.max(0, shade * 255)));
            data[idx + 2] = 0;
            data[idx + 3] = 255;
        }
    }

    const texture = new DataTexture(data, size, size, RGBAFormat);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    return texture;
}
