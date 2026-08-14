import {
    Color,
    FrontSide,
    GLSL3,
    ShaderMaterial,
    Vector3,
    Vector2,
    type IUniform,
} from "three";

import commonGlsl from "./shaders/common.glsl?raw";
import strandFragmentSource from "./shaders/strand.frag?raw";
import strandVertexSource from "./shaders/strand.vert?raw";
import type { CursorReactiveUniforms } from "./cursorInteraction";

export interface StrandUniforms extends CursorReactiveUniforms {
    [uniform: string]: IUniform;
    uStrandLength: IUniform<number>;
    uStrandWidth: IUniform<number>;
    uDrawingBufferSize: IUniform<Vector2>;
    uMinStrandPixels: IUniform<number>;
    uShadeContrast: IUniform<number>;
    uRootColor: IUniform<Color>;
    uTipColor: IUniform<Color>;
    uLightDir: IUniform<Vector3>;
    uGravity: IUniform<Vector3>;
    uMaxAo: IUniform<number>;
    /** Seconds, driven by idleAnimation.ts — see strand.vert's own comment. */
    uTime: IUniform<number>;
}

export interface StrandMaterial extends ShaderMaterial {
    uniforms: StrandUniforms;
}

export interface StrandMaterialOptions {
    rootColor?: string;
    tipColor?: string;
    strandLength: number;
    strandWidth: number;
    minStrandPixels: number;
    shadeContrast: number;
}

export function createStrandMaterial(options: StrandMaterialOptions): StrandMaterial {
    const uniforms: StrandUniforms = {
        uStrandLength: { value: options.strandLength },
        uStrandWidth: { value: options.strandWidth },
        uDrawingBufferSize: { value: new Vector2(1, 1) },
        uMinStrandPixels: { value: options.minStrandPixels },
        uShadeContrast: { value: options.shadeContrast },
        uRootColor: { value: new Color(options.rootColor ?? "#1eb6f7") },
        uTipColor: { value: new Color(options.tipColor ?? "#6fd4fb") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        uGravity: { value: new Vector3(0, -0.1, 0) },
        uMaxAo: { value: 0.84 },
        uTime: { value: 0 },
        uCursor: { value: new Vector3(1e6, 1e6, 1e6) },
        uCursorDir: { value: new Vector3(0, 0, 0) },
        // Keep the brush local to the stroke under the pointer. The later
        // 0.052 radius covered roughly twice the surface area and could bend
        // neighbouring letter strokes that the cursor never touched.
        uCursorRadius: { value: 0.036 },
        uCursorStrength: { value: 0 },
        uRipplePoint: { value: new Vector3(1e6, 1e6, 1e6) },
    };

    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        // Unlike the old shell/fin vertex shaders, strand.vert itself needs
        // common.glsl's hash1/basisFromNormal (for per-strand tilt/curl) —
        // it, not just the fragment shader, needs the prepend.
        vertexShader: commonGlsl + "\n" + strandVertexSource,
        fragmentShader: commonGlsl + "\n" + strandFragmentSource,
        // Each strand is real, individually-depth-tested geometry — unlike
        // the old shell stack, there is no shared alpha-blended overdraw to
        // order, so this can just be opaque with standard depth handling.
        // That also means none of the depthWrite:false / depth-prepass
        // machinery the shell system needed (see git history on
        // createShellMaterial.ts) applies here at all; real geometry
        // resolves its own occlusion for free.
        transparent: false,
        depthWrite: true,
        depthTest: true,
        // strand.vert builds every ribbon's width axis from the current view
        // direction, so its winding consistently faces the camera. Keeping
        // back-face culling enabled avoids rasterising the hidden side of
        // these very numerous opaque ribbons without changing the visible
        // silhouette.
        side: FrontSide,
    });

    return material as StrandMaterial;
}
