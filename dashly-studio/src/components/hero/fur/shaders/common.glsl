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
// al., 2017). Still used for per-strand drift DIRECTION, where only the
// plane matters and a slow rotation is harmless — but no longer for the
// pattern coordinate itself; see sampleFurPattern below for why.
void basisFromNormal(vec3 n, out vec3 t, out vec3 b) {
    float s = n.z >= 0.0 ? 1.0 : -1.0;
    float a = -1.0 / (s + n.z);
    float bb = n.x * n.y * a;
    t = vec3(1.0 + s * n.x * n.x * a, s * bb, -s * n.x);
    b = vec3(bb, s + n.y * n.y * a, -n.y);
}

// Triplanar sample of the fur pattern: the same texture projected down each
// of the three FIXED object axes, blended by how much the surface faces
// each one.
//
// This replaces a normal-derived tangent basis (`uv = vec2(dot(pos, t),
// dot(pos, b))`), which had a subtle but very visible failure on this mesh.
// Because that coordinate dots the full POSITION vector against a basis
// that rotates with the normal, a small change in normal moves the sample
// point by roughly |pos| * dTheta — and hello.glb's positions reach 0.41
// object units from origin. Sweeping the normal around a tube's circular
// cross-section therefore dragged the sampled coordinate across many cells,
// smearing what should be discrete round strand cross-sections into long
// marbled streaks along each stroke, worst on exactly the broad
// front-facing areas that most need to read as evenly furred.
//
// Projecting onto fixed axes removes the dependence on the normal entirely,
// so the pattern is locked to the surface: strands stay put, stay round,
// and stay the same size everywhere on the word.
vec4 sampleFurPattern(sampler2D tex, vec3 pos, vec3 n, float scale) {
    vec3 w = abs(n);
    // Sharpen toward the dominant axis so most fragments are effectively a
    // single projection (crisp strands), with a narrow blend band across
    // the 45-degree seams instead of a hard switch. The largest component of
    // a unit vector is always >= 0.577, so this can never go all-zero.
    w = max(w - 0.25, 0.0);
    w /= max(w.x + w.y + w.z, 1e-5);

    vec4 sx = texture2D(tex, pos.yz * scale);
    vec4 sy = texture2D(tex, pos.zx * scale);
    vec4 sz = texture2D(tex, pos.xy * scale);

    return sx * w.x + sy * w.y + sz * w.z;
}

// Linear -> sRGB output encoding.
//
// This is NOT optional bookkeeping; without it every colour in this fur
// system renders far darker than authored. three.js has ColorManagement on
// by default, so `new Color("#1ba7e8")` is converted into its LINEAR working
// space before it ever reaches a uniform — #1ba7e8 arrives as
// (0.011, 0.386, 0.807), not (0.106, 0.655, 0.910). Its own built-in
// materials undo that on the way out by ending their fragment shader with
// `#include <colorspace_fragment>`, but three appends nothing of the kind to
// a custom ShaderMaterial. Writing linear values straight into an
// sRGB-encoded framebuffer (renderer.outputColorSpace === "srgb") crushes
// everything, and crushes the darkest channel hardest — measured on the
// rendered canvas, an authored root of (27, 167, 232) was landing on screen
// as (6, 91, 175), a ~7.5x error in red against ~1.4x in blue. Any attempt
// to fix that by picking different hex values just chases a moving target.
vec3 linearToSRGB(vec3 c) {
    c = max(c, vec3(0.0));
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;

    return mix(lo, hi, step(vec3(0.0031308), c));
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
//    drops below 0.86x, so the shadowed side of a strand still reads as
//    fibre, not as a dark gap in the coverage. Raised from the reference's
//    own 0.8 floor because this word is lit as a soft, evenly-lit plush
//    object rather than a studio-lit demo prop — the extra headroom is
//    what stops the inside of each stroke reading as a cavity.
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
    float light = 0.86 + 0.08 * (0.5 + 0.5 * ndl) + 0.06 * pow(max(0.0, ndl), 6.0);

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(clamp(dot(n, halfVec), 0.0, 1.0), 24.0);

    // Fresnel-style rim brightening: surfaces turning AWAY from the viewer
    // (the rolled-over sides of each stroke) get lifted rather than
    // darkened. On a round cross-section this is what reads as "the middle
    // comes toward you and the sides fall away" — i.e. convex. Without it,
    // a tube lit by a single direction reads brightest on one flank and
    // darkest on the other, which the eye resolves as a groove.
    // Kept deliberately weak and MULTIPLICATIVE (no additive white term):
    // this only has to counteract the single-direction falloff that makes a
    // round stroke read as grooved. Anything stronger, or additive, washes
    // the saturated cyan out toward white across most of the surface, since
    // on a tube a large fraction of the visible area sits at a fairly
    // glancing angle.
    float facing = 1.0 - clamp(dot(n, viewDir), 0.0, 1.0);
    float rim = pow(facing, 3.0) * 0.18;

    float ao = uMaxAo + (1.0 - uMaxAo) * 0.9 * depthT * depthT;

    vec3 color = baseColor * light * ao * (1.0 + rim);
    color += vec3(0.65, 0.82, 0.95) * spec * 0.08 * mix(0.5, 1.0, depthT);

    return color;
}
