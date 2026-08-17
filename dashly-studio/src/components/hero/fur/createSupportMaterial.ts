import {
    Color,
    GLSL3,
    ShaderMaterial,
    Vector3,
    type IUniform,
} from "three";

import commonGlsl from "./shaders/common.glsl?raw";
import supportFragmentSource from "./shaders/support.frag?raw";
import supportVertexSource from "./shaders/support.vert?raw";

export interface SupportUniforms {
    [uniform: string]: IUniform;
    uRootColor: IUniform<Color>;
    uLightDir: IUniform<Vector3>;
    uMaxAo: IUniform<number>;
}

export interface SupportMaterial extends ShaderMaterial {
    uniforms: SupportUniforms;
}

export interface SupportMaterialOptions {
    rootColor?: string;
}

/**
 * The always-visible base layer, shaded with the exact same lighting
 * function as the strands (adapted from the reference, where the base mesh
 * uses the same custom shader as the fur rather than a separate PBR
 * material) — this is what guarantees the base can never read as a
 * visually different "coating" underneath the fur, and what a temporary
 * swap to this material alone renders to verify the imported model's true
 * silhouette before any fur exists.
 *
 * Deliberately NOT cursor-reactive — the base mesh's geometry must never
 * move, rotate, or deform for any reason; only the strand system (see
 * createStrandMaterial.ts) responds to the cursor. This material used to
 * carry a small cursor-driven inward press (see git history), removed
 * because it visibly shifted the letterform's own silhouette near an edge
 * rather than reading as a subtle dent.
 */
export function createSupportMaterial(
    options: SupportMaterialOptions = {},
): SupportMaterial {
    const uniforms: SupportUniforms = {
        uRootColor: { value: new Color(options.rootColor ?? "#1eb6f7") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        // Same flat multiplier the reference applies to its own base mesh
        // (`color * maxAo * light`, no depth easing since there is no
        // "depth into the fur" at the surface itself) — and the same value
        // shadeFibre's ao curve reduces to at depthT = 0, so the base mesh
        // and the root of every strand growing from it match exactly. Must
        // stay in step with the strand material for that to hold.
        uMaxAo: { value: 0.84 },
    };

    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        vertexShader: supportVertexSource,
        fragmentShader: commonGlsl + "\n" + supportFragmentSource,
    });

    return material as SupportMaterial;
}
