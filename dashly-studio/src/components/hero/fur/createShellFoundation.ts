import {
    Color,
    DoubleSide,
    GLSL3,
    InstancedMesh,
    Matrix4,
    ShaderMaterial,
    Vector3,
    type BufferGeometry,
    type IUniform,
} from "three";

import commonGlsl from "./shaders/common.glsl?raw";
import fragmentSource from "./shaders/foundationShell.frag?raw";
import vertexSource from "./shaders/foundationShell.vert?raw";

interface ShellUniforms {
    [uniform: string]: IUniform;
    uShellCount: IUniform<number>;
    uShellLength: IUniform<number>;
    uRootColor: IUniform<Color>;
    uTipColor: IUniform<Color>;
    uLightDir: IUniform<Vector3>;
    uMaxAo: IUniform<number>;
}

export interface ShellFoundationMaterial extends ShaderMaterial {
    uniforms: ShellUniforms;
}

export interface ShellFoundationResult {
    mesh: InstancedMesh;
    material: ShellFoundationMaterial;
}

export function createShellFoundation(
    geometry: BufferGeometry,
    options: {
        count: number;
        length: number;
        rootColor?: string;
        tipColor?: string;
    },
): ShellFoundationResult {
    const uniforms: ShellUniforms = {
        uShellCount: { value: options.count },
        uShellLength: { value: options.length },
        uRootColor: { value: new Color(options.rootColor ?? "#1eb6f7") },
        uTipColor: { value: new Color(options.tipColor ?? "#6fd4fb") },
        uLightDir: { value: new Vector3(-0.4, 0.8, 0.6).normalize() },
        uMaxAo: { value: 0.9 },
    };
    const material = new ShaderMaterial({
        glslVersion: GLSL3,
        uniforms,
        vertexShader: vertexSource,
        fragmentShader: commonGlsl + "\n" + fragmentSource,
        side: DoubleSide,
        transparent: false,
        depthTest: true,
        depthWrite: true,
    }) as ShellFoundationMaterial;
    const mesh = new InstancedMesh(geometry, material, options.count);
    const identity = new Matrix4();

    for (let index = 0; index < options.count; index += 1) {
        mesh.setMatrixAt(index, identity);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return { mesh, material };
}
