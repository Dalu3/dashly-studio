import {
    Color,
    DoubleSide,
    GLSL3,
    ShaderMaterial,
    Vector3,
    type DataTexture,
    type IUniform,
} from "three";

import commonGlsl from "./shaders/common.glsl?raw";
import shellFragmentSource from "./shaders/shell.frag?raw";
import shellVertexSource from "./shaders/shell.vert?raw";

export interface ShellUniforms {
    /** Required so this satisfies ShaderMaterial's uniform record. */
    [uniform: string]: IUniform;
    uShellCount: IUniform<number>;
    uFurLength: IUniform<number>;
    uNoiseTexture: IUniform<DataTexture | null>;
    uNoiseScale: IUniform<number>;
    uCompress: IUniform<number>;
    uCurl: IUniform<number>;
    uRootColor: IUniform<Color>;
    uTipColor: IUniform<Color>;
    uLightDir: IUniform<Vector3>;
    uGravity: IUniform<Vector3>;
    uCursor: IUniform<Vector3>;
    uCursorDir: IUniform<Vector3>;
    uCursorRadius: IUniform<number>;
    uCursorStrength: IUniform<number>;
    uMaxAo: IUniform<number>;
    uAlphaSharpness: IUniform<number>;
}

export interface ShellMaterial extends ShaderMaterial {
    uniforms: ShellUniforms;
}

export interface ShellMaterialOptions {
    noiseTexture: DataTexture;
    rootColor?: string;
    tipColor?: string;
}

export function createShellMaterial(
    options: ShellMaterialOptions,
): ShellMaterial {
    const uniforms: ShellUniforms = {
        uShellCount: { value: 1 },
        // ~28% of the tube's own radius (0.04 raw units). Deliberately
        // SHORTER than an earlier 0.017 pass: long fur turned the word into
        // a spiky halo around a pale core rather than the reference's short,
        // dense, velvet-like pile, and long strands stacked up at grazing
        // angles into a heavy saturated rim that fought the interior.
        // Shortening also frees screen margin — fur grows past the base
        // mesh's bounding box, which is what LAYOUT in HelloModel.tsx
        // measures — and that reclaimed margin is what pays for the larger
        // on-screen scale there. The two are coupled: raising this again
        // means lowering LAYOUT to match.
        uFurLength: { value: 0.011 },
        uNoiseTexture: { value: options.noiseTexture },
        // Cells-per-object-unit, scaling the triplanar sample coordinate
        // (see sampleFurPattern in common.glsl). The noise texture itself
        // holds 16 Worley cells per uv unit, so strand cells per object unit
        // is this x 16 — at 20 that is ~26 strand cells across a stroke's
        // width, which reads as many fine fibres. Raised alongside the
        // shorter fur above: stubbier strands need to be finer and denser to
        // still read as fur rather than as a bumpy surface.
        uNoiseScale: { value: 20 },
        uCompress: { value: 0.5 },
        // Kept small on purpose. This is a fraction of a strand cell, so at
        // higher uNoiseScale a large value would drag the sample across
        // neighbouring cells and blur the very pattern it exists to vary.
        uCurl: { value: 0.05 },
        uRootColor: { value: new Color(options.rootColor ?? "#1eb6f7") },
        uTipColor: { value: new Color(options.tipColor ?? "#6fd4fb") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        uGravity: { value: new Vector3(0, -0.1, 0) },
        uCursor: { value: new Vector3(1e6, 1e6, 1e6) },
        uCursorDir: { value: new Vector3(0, 0, 0) },
        uCursorRadius: { value: 0.036 },
        uCursorStrength: { value: 0 },
        // The reference's own default is 0.7, which suits its dark studio
        // backdrop. Against this hero's pale sky it crushed the inside of
        // each stroke to ~70% brightness while the fur tips stayed near
        // full — read as a dark cavity down the middle of every letter,
        // i.e. concave. 0.84 keeps a real root-to-tip depth cue while
        // staying well clear of that.
        uMaxAo: { value: 0.84 },
        // pow(smoothness + 0.5, 2) at the reference's own default
        // smoothness (0.5) works out to exactly 1.0 — a plain linear alpha
        // falloff, alpha = 1 - relativeHeight.
        uAlphaSharpness: { value: 1.0 },
    };

    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        vertexShader: shellVertexSource,
        fragmentShader: commonGlsl + "\n" + shellFragmentSource,
        // Strands are seen from every angle; without this the far side of
        // each fibre is culled.
        side: DoubleSide,
        // Real alpha blending (see shell.frag's `alpha = pow(1 - t,
        // uAlphaSharpness)`) rather than opaque-with-discard, matching the
        // reference's own shell material (`cc.transparent = true`).
        // depthWrite off — otherwise an early (short, near-root) shell would
        // write depth and occlude a farther-out, still-visible fragment
        // from a LATER shell at the same screen pixel, since shells here are
        // drawn as one InstancedMesh in a fixed instance order rather than
        // depth-sorted per fragment.
        transparent: true,
        depthWrite: false,
    });

    return material as ShellMaterial;
}

/**
 * Trimmed back down from an earlier pass at 48/30. That version chased the
 * reference's own default (60) for maximum shell-to-shell smoothness, but
 * every shell here is a full alpha-blended overdraw pass (see `transparent:
 * true` above) — unlike the reference's opaque-with-discard shells, blended
 * fragments can't be early-Z-rejected, so shell count multiplies GPU
 * fragment cost directly, not just vertex cost. 36/22 is the balance point:
 * still comfortably above the pre-alpha-blend baseline (28/22) for smooth
 * coverage, without paying for shells whose contribution below full opacity
 * is barely visible.
 */
export function shellCountFor(mobile: boolean): number {
    return mobile ? 22 : 36;
}
