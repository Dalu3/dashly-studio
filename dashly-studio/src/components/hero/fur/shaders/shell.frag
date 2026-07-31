// Shell fragment shader.
//
// Strand shape and per-strand length come from a TEXTURE, not a live
// per-fragment cell search — this is the technique verified in the
// piellardj/fur-threejs reference (extracted from its compiled shader via
// `gl.getShaderSource()`, since the repository ships no readable source):
// a small tileable texture whose RED channel encodes "how tall can fur grow
// at this texel" and whose GREEN channel is a decorrelated per-strand
// brightness. One `texture2D()` sample replaces what used to be a 5-tap
// Worley neighbour search plus several hashes per fragment.
//
// See generateNoiseTexture.ts for how that texture is baked — using the same
// Worley-cell math this shader used to run live, just baked once at load
// time instead of recomputed every fragment every frame.

precision highp float;
layout(location = 0) out vec4 fragColor;

uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uCurl;
uniform vec3  uRootColor;
uniform vec3  uTipColor;
uniform vec3  uLightDir;
uniform float uAlphaSharpness;

varying vec3  vRoot;
varying vec3  vObjNormal;
varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vShellT;

// hash1, basisFromNormal, shadeFibre come from common.glsl, prepended at
// material-creation time.

void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 objN = normalize(vObjNormal);
    vec3 tangent, bitangent;
    basisFromNormal(objN, tangent, bitangent);

    // Flat local 2D coordinate on the surface — the tangent plane keeps this
    // isotropic no matter which way the tube curves, unlike the mesh's own
    // (badly stretched) UVs.
    vec2 uv = vec2(dot(vRoot, tangent), dot(vRoot, bitangent)) * uNoiseScale;

    // Subtle per-cell direction drift: the texture SAMPLE point wobbles a
    // little in a random per-cell direction, growing with shell height —
    // this is what varies strand DIRECTION rather than just position. Cheap
    // on purpose: one hash of the cell, not a neighbour search.
    vec2 cell = floor(uv);
    float curlAngle = hash1(dot(cell, vec2(12.9898, 78.233))) * 6.28318;
    vec2 curl = vec2(cos(curlAngle), sin(curlAngle)) * uCurl * (vShellT * vShellT);

    vec4 noiseSample = texture2D(uNoiseTexture, uv + curl);
    float hairLength = max(0.01, noiseSample.r);
    float shade = noiseSample.g;

    // This shell only exists here if it is still within this texel's strand
    // length — the SAME comparison the reference shader makes. Fragments
    // past this point are fully transparent, so a hard discard here (rather
    // than falling through to alpha = 0 below) just skips the blend work
    // for something invisible anyway.
    float relativeHeight = vShellT / hairLength;
    if (relativeHeight >= 1.0) {
        discard;
    }

    vec3 color = mix(uRootColor, uTipColor, clamp(vShellT * 1.2, 0.0, 1.0));
    color *= mix(0.75, 1.0, shade);

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vShellT);

    // Real alpha blending toward each strand's own tip — `alpha = pow(1 - t,
    // smoothness)`, lifted directly from the reference fragment shader —
    // instead of every visible fragment being fully opaque. This is what
    // lets overlapping shells at different heights read as one continuous,
    // soft-edged volume instead of a stack of thin, separately-outlined
    // layers: the outermost few shells fade in gradually rather than
    // snapping from "nothing" to "fully opaque" the instant they clear the
    // strand-length test.
    float alpha = pow(1.0 - relativeHeight, uAlphaSharpness);
    fragColor = vec4(shaded, alpha);
}
