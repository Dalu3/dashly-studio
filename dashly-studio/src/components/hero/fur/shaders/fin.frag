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
// extracting both from its minified bundle), with no view-dependent gate of
// any kind — its fins are always drawn.
//
// That works there and NOT here purely because of mesh density. Fin
// geometry emits one quad per unique mesh edge; hello.glb has 13,770
// vertices / 26,208 triangles / ~39,300 unique edges, where the
// reference's demo props (torus, sphere, chair) are an order of magnitude
// coarser. On a front-facing surface every one of those ~39,300 quads
// extends straight at the viewer and is therefore seen edge-on, as a hairline
// — and because the tube's edges form a regular ring/longitudinal grid,
// ~39,300 hairlines land as a regular rope-like ribbing straight down every
// stroke, plus a dark seam where they pile up densest.
//
// So the silhouette term below is deliberately NOT from the reference. It
// is what makes fins do their actual job — filling the silhouette gap at
// grazing angles, where shells alone go transparent — while staying out of
// the way of front-facing surfaces the shells already cover properly on
// their own. This was briefly removed in an earlier pass on the mistaken
// theory that alpha blending superseded it; the ribbing it exists to
// prevent came straight back, so it is restored here, now as a smooth
// alpha fade rather than the previous dithered discard.

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

    // Same fixed-axis triplanar projection, at the same scale, from the same
    // un-extruded root position as shell.frag — shells and fins must read
    // the identical underlying pattern or the silhouette shows a seam.
    vec4 noiseSample = sampleFurPattern(uNoiseTexture, vRoot, objN, uNoiseScale);
    float hairLength = max(0.01, noiseSample.r);
    float relativeHeight = vFinT / hairLength;
    if (relativeHeight >= 1.0) {
        discard;
    }

    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // 1 only where this surface is close to edge-on to the camera (the
    // silhouette, where shells thin out and fins are genuinely needed);
    // 0 across everything facing the viewer, where an edge-on fin quad
    // would otherwise draw a hairline over fur the shells already render.
    float facing = abs(dot(n, viewDir));
    float silhouette = smoothstep(0.62, 0.12, facing);

    if (silhouette <= 0.001) {
        discard;
    }

    // Same root-biased ramp as shell.frag — see its comment.
    vec3 color = mix(uRootColor, uTipColor, vFinT * vFinT);
    color *= mix(0.82, 1.0, noiseSample.g);

    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vFinT);
    float alpha = pow(1.0 - relativeHeight, uAlphaSharpness) * silhouette;
    fragColor = vec4(linearToSRGB(shaded), alpha);
}
