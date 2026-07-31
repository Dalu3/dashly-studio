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
        // ~37% of the tube's own radius (0.04 raw units) — long enough to
        // read as genuine plush thickness rather than a fuzzy outline, per
        // the piellardj/fur-threejs reference's own default (its "Length"
        // slider defaults to a shell height of 0.05 * 2.75 = 0.1375 against
        // demo objects of roughly unit local scale — a proportionally much
        // thicker coat than this project's earlier, more conservative
        // value).
        uFurLength: { value: 0.015 },
        uNoiseTexture: { value: options.noiseTexture },
        // Cells-per-object-unit, multiplying the tangent-plane coordinate
        // before it samples the noise texture. Re-derived from the
        // reference's own default ("Density" slider = 12, its noiseScale
        // uniform applied directly to raw mesh UV): the previous value here
        // (72) packed roughly 6x more strand-cells across the same surface
        // area than that ratio implies, which is what read as fine
        // high-frequency static rather than individually legible fibres.
        uNoiseScale: { value: 10 },
        uCompress: { value: 0.5 },
        // Reduced from 0.12: at a noise-texture cell size of 1/16 in
        // sampling-space, 0.12 could wobble a sample across nearly two full
        // cells at a shell's tip, blurring the pattern it was meant to
        // vary.
        uCurl: { value: 0.05 },
        uRootColor: { value: new Color(options.rootColor ?? "#1c9be6") },
        uTipColor: { value: new Color(options.tipColor ?? "#8fd8f7") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        uGravity: { value: new Vector3(0, -0.1, 0) },
        uCursor: { value: new Vector3(1e6, 1e6, 1e6) },
        uCursorDir: { value: new Vector3(0, 0, 0) },
        uCursorRadius: { value: 0.036 },
        uCursorStrength: { value: 0 },
        // Matches the reference's own default `maxAo` exactly.
        uMaxAo: { value: 0.7 },
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
 * The reference's own default is 60 (its "Quality" slider). 48/30 keeps
 * comfortably within that quality range while trimming for mobile — cheap
 * to raise here because this project draws every shell as ONE InstancedMesh
 * (a single draw call), unlike the reference's N-separate-Mesh-per-shell
 * approach, so shell count no longer multiplies draw-call count the way it
 * would there.
 */
export function shellCountFor(mobile: boolean): number {
    return mobile ? 30 : 48;
}
