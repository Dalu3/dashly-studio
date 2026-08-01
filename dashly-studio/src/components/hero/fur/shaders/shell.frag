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

    // Subtle per-strand direction drift: the SAMPLE POINT wobbles slightly
    // in a random per-cell direction, growing with shell height — this is
    // what varies strand direction rather than just position. Done in 3D
    // object space (and flattened into the local tangent plane so a strand
    // leans along its surface rather than into it) because the pattern
    // coordinate itself is now a fixed-axis triplanar projection rather
    // than a 2D tangent-space uv.
    vec3 cell = floor(vRoot * uNoiseScale * 16.0);
    float h1 = hash1(dot(cell, vec3(12.9898, 78.233, 37.719)));
    float h2 = hash1(dot(cell, vec3(93.989, 47.271, 21.113)));
    float h3 = hash1(dot(cell, vec3(61.317, 15.733, 88.191)));

    vec3 tangent, bitangent;
    basisFromNormal(objN, tangent, bitangent);
    vec3 drift = tangent * (h1 - 0.5) + bitangent * (h2 - 0.5)
        + objN * (h3 - 0.5) * 0.15;
    // Cell size in object units is 1 / (uNoiseScale * cellsPerAxis); scaling
    // the drift by 1/uNoiseScale keeps the wobble a constant fraction of a
    // strand cell no matter what density is set to.
    vec3 samplePos = vRoot
        + normalize(drift) * (uCurl / uNoiseScale) * (vShellT * vShellT);

    vec4 noiseSample = sampleFurPattern(uNoiseTexture, samplePos, objN, uNoiseScale);
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

    // Biased toward the ROOT colour (squared, not the previous 1.2x
    // over-drive that hit full tip colour by 83% height). Only the outermost
    // fibre tips should pick up the pale highlight; letting it reach most of
    // the shell stack is what desaturates the whole word toward white.
    vec3 color = mix(uRootColor, uTipColor, vShellT * vShellT);
    color *= mix(0.82, 1.0, shade);

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
    fragColor = vec4(linearToSRGB(shaded), alpha);
}
