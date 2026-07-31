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
import finFragmentSource from "./shaders/fin.frag?raw";
import finVertexSource from "./shaders/fin.vert?raw";

export interface FinUniforms {
    [uniform: string]: IUniform;
    uFurLength: IUniform<number>;
    uNoiseTexture: IUniform<DataTexture | null>;
    uNoiseScale: IUniform<number>;
    uRootColor: IUniform<Color>;
    uTipColor: IUniform<Color>;
    uLightDir: IUniform<Vector3>;
    uCursor: IUniform<Vector3>;
    uCursorDir: IUniform<Vector3>;
    uCursorRadius: IUniform<number>;
    uCursorStrength: IUniform<number>;
    uMaxAo: IUniform<number>;
    uAlphaSharpness: IUniform<number>;
}

export interface FinMaterial extends ShaderMaterial {
    uniforms: FinUniforms;
}

export interface FinMaterialOptions {
    noiseTexture: DataTexture;
    rootColor?: string;
    tipColor?: string;
}

export function createFinMaterial(options: FinMaterialOptions): FinMaterial {
    const uniforms: FinUniforms = {
        // Matches the shell material's uFurLength — see its own comment for
        // why (the reference's own default, translated to this tube's
        // radius).
        uFurLength: { value: 0.015 },
        uNoiseTexture: { value: options.noiseTexture },
        uNoiseScale: { value: 10 },
        uRootColor: { value: new Color(options.rootColor ?? "#1c9be6") },
        uTipColor: { value: new Color(options.tipColor ?? "#8fd8f7") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        uCursor: { value: new Vector3(1e6, 1e6, 1e6) },
        uCursorDir: { value: new Vector3(0, 0, 0) },
        uCursorRadius: { value: 0.036 },
        uCursorStrength: { value: 0 },
        uMaxAo: { value: 0.7 },
        uAlphaSharpness: { value: 1.0 },
    };

    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        vertexShader: finVertexSource,
        fragmentShader: commonGlsl + "\n" + finFragmentSource,
        side: DoubleSide,
        // Real alpha blending, matching the reference's own fin material
        // (`hc.transparent = true, hc.depthWrite = false`) — see fin.frag.
        transparent: true,
        depthWrite: false,
    });

    return material as FinMaterial;
}
