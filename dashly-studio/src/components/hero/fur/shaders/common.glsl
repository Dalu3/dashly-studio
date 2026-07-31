// Shared GLSL, prepended to every fur shader (shell/fin/support) at material
// creation time — see the `COMMON_GLSL + ...` concatenation in
// createShellMaterial.ts / createFinMaterial.ts / createSupportMaterial.ts.
// This is a plain .glsl file imported via Vite's `?raw` suffix, not a
// preprocessor #include — WebGL has no include mechanism, so composition
// happens in JS before the source ever reaches the GPU compiler.

float hash1(float x) {
    return fract(sin(x) * 43758.5453123);
}

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
}

// Branchless orthonormal basis from a normal (Duff, Burgess, Christensen et
// al., 2017). Gives a tangent/bitangent pair that varies continuously with
// the normal, so the noise-texture sampling coordinate never seams across
// the surface — this is what stands in for a UV map on a mesh whose real
// UVs are too anisotropic to tile a texture against directly (measured on
// hello.glb: one UV unit spans roughly 100x more world distance along the
// tube than across it). Singular only at the single point n = (0, 0, -1).
void basisFromNormal(vec3 n, out vec3 t, out vec3 b) {
    float s = n.z >= 0.0 ? 1.0 : -1.0;
    float a = -1.0 / (s + n.z);
    float bb = n.x * n.y * a;
    t = vec3(1.0 + s * n.x * n.x * a, s * bb, -s * n.x);
    b = vec3(bb, s + n.y * n.y * a, -n.y);
}

// How dark the fur's own root (and the base/support mesh, which shades with
// depthT = 0) is allowed to get. Set from JS to the same value on every
// material that calls shadeFibre, so the base mesh and the base of every
// strand growing from it are darkened by exactly the same amount and never
// show a seam between "surface" and "fur root".
uniform float uMaxAo;

// `depthT` is 0 at the root (or the base/support mesh) and 1 at a strand's
// own tip. Two things adapted directly from the piellardj/fur-threejs
// reference fragment shader (recovered via string-literal extraction from
// its minified bundle, since it ships no source):
//
//  - `light` is deliberately flat and forgiving (the reference's own
//    comment on this exact formula reads "wrong but looks fine"): it never
//    drops below 0.8x, so the shadowed side of a strand still reads as
//    fibre, not as a dark gap in the coverage.
//  - `ao` darkens the root and brightens the tip with the same depthT^2
//    curve the reference uses for its shells, and reduces to exactly
//    `uMaxAo` at depthT = 0 — the same flat multiplier it applies to its
//    base/support mesh, so the two match without a seam.
//
// The specular term is this project's own addition (the reference has no
// half-vector specular, only a crude NdotL^6 term baked into `light`) —
// kept because it is what a fine synthetic fibre needs to visibly catch a
// highlight rather than reading as a matte, painted-on surface.
vec3 shadeFibre(vec3 baseColor, vec3 n, vec3 lightDir, vec3 viewDir, float depthT) {
    float ndl = dot(n, lightDir);
    float light = 0.8 + 0.1 * (0.5 + 0.5 * ndl) + 0.1 * pow(max(0.0, ndl), 6.0);

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(clamp(dot(n, halfVec), 0.0, 1.0), 24.0);

    float ao = uMaxAo + (1.0 - uMaxAo) * 0.9 * depthT * depthT;

    vec3 color = baseColor * light * ao;
    color += vec3(0.65, 0.82, 0.95) * spec * 0.12 * mix(0.5, 1.0, depthT);

    return color;
}
