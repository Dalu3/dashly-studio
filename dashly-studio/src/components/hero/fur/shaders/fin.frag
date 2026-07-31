// Fin fragment shader.
//
// Samples the SAME noise texture, at the SAME tangent-plane coordinate
// (derived from `vRoot`, the original un-extruded vertex position), as the
// shell fragment shader — shells and fins therefore read the same
// underlying "fur pattern" fabric, so there is no visible discontinuity
// where shell coverage ends and fin coverage begins.
//
// Fins and shells share one fragment shader in the reference (both its `cc`
// and `hc` materials point at the same compiled source, confirmed by
// extracting both from its minified bundle) — including the SAME real alpha
// blend toward each strand's own tip. An earlier version of this file
// assumed fins there were unconditionally opaque and added a dithered,
// view-dependent discard gate to compensate for our much finer base mesh
// (hello.glb has ~13.7k vertices vs. the reference's simple demo shapes)
// showing fins as flat opaque strips on front-facing surfaces. That
// assumption was wrong, and the fix it was compensating for is no longer
// needed once real alpha blending (below) is in place: a fin fragment now
// fades out smoothly toward its own tip instead of snapping straight to
// fully opaque, which is what made a flat strip visible in the first place.

precision highp float;
layout(location = 0) out vec4 fragColor;

uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform vec3  uRootColor;
uniform vec3  uTipColor;
uniform vec3  uLightDir;
uniform float uAlphaSharpness;

varying vec3  vRoot;
varying vec3  vObjNormal;
varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vFinT;

void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 objN = normalize(vObjNormal);
    vec3 tangent, bitangent;
    basisFromNormal(objN, tangent, bitangent);
    vec2 uv = vec2(dot(vRoot, tangent), dot(vRoot, bitangent)) * uNoiseScale;

    vec4 noiseSample = texture2D(uNoiseTexture, uv);
    float hairLength = max(0.01, noiseSample.r);
    float relativeHeight = vFinT / hairLength;
    if (relativeHeight >= 1.0) {
        discard;
    }

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 color = mix(uRootColor, uTipColor, clamp(vFinT * 1.2, 0.0, 1.0));
    color *= mix(0.75, 1.0, noiseSample.g);

    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vFinT);
    float alpha = pow(1.0 - relativeHeight, uAlphaSharpness);
    fragColor = vec4(shaded, alpha);
}
