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
 * function as the shells and fins (adapted from the reference, where the
 * base mesh uses the same custom shader as the fur rather than a separate
 * PBR material) — this is what guarantees the base can never read as a
 * visually different "coating" underneath the fur, and what a temporary
 * swap to this material alone renders to verify the imported model's true
 * silhouette before any fur exists.
 */
export function createSupportMaterial(
    options: SupportMaterialOptions = {},
): SupportMaterial {
    const uniforms: SupportUniforms = {
        uRootColor: { value: new Color(options.rootColor ?? "#1c9be6") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        // Same flat multiplier the reference applies to its own base mesh
        // (`color * maxAo * light`, no depth easing since there is no
        // "depth into the fur" at the surface itself) — and the same value
        // shadeFibre's ao curve reduces to at depthT = 0, so the base mesh
        // and the root of every strand growing from it match exactly.
        uMaxAo: { value: 0.7 },
    };

    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        vertexShader: supportVertexSource,
        fragmentShader: commonGlsl + "\n" + supportFragmentSource,
    });

    return material as SupportMaterial;
}
