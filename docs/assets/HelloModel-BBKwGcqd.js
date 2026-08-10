import{r as X,u as be,j as ye}from"./index-COOiCcNZ.js";import{g,V as Se,ac as xe,E as re,C as te,ad as ge,a8 as Ae,ae as ve,h as Q,I as Te,z as ae,B as V,U as ne,af as Me,W as Re,ag as Ce,ah as De,ai as Le,D as Ee,aj as Ie,ak as Pe,aa as ke}from"./three-vendor-BWiavw-v.js";import{m as Fe}from"./three-gltf-hKZJeKbV.js";import{preloadHelloGeometries as ze}from"./preloadHello-CMziDfQd.js";const Ne=340,_e=28,Ge=105,We=13,Oe=.055,de=1.6,Be=2600,qe=75,He=2900,Ve=80,je=600,Xe=22;function U(c,e,n,d,a,h){const o=(n-c)*d;let i=e+o*h;return i*=Math.exp(-a*h),[c+i*h,i]}function Ue(c){const{camera:e,domElement:n,viewportElement:d,raycastTargets:a,materials:h,frameLoop:o}=c,i=new Se(2,2),s=new xe,l=new g(1e6,1e6,1e6),u=new g,y=new g,v=new g;let x=!1,S=0,p=!1,L=!1;const w=new g(1e6,1e6,1e6),A=new g,C=new g,t=new g,r=new g(1e6,1e6,1e6),m=new g;let f=0,b=0,T=0,I=0,M=!1,P=!0,R=!1,k=0,z=0,D=0,F=!1;const G=()=>{for(const E of h)E.uniforms.uCursorStrength.value=b,E.uniforms.uCursor.value.copy(w),E.uniforms.uCursorDir.value.copy(C),E.uniforms.uRipplePoint.value.copy(r)},j=()=>{if(!F||a.length===0)return;F=!1;const E=d.getBoundingClientRect();i.set((k-E.left)/E.width*2-1,-((z-E.top)/E.height)*2+1),s.setFromCamera(i,e);const W=s.intersectObjects(a,!1)[0];if(W&&W.object instanceof re){const B=W.object.worldToLocal(W.point.clone());if(x){v.copy(B).sub(y);const H=v.length();if(H>1e-6){u.copy(v).multiplyScalar(1/H);const Z=Math.max((D-S)/1e3,1/240),J=H/Z;f=Math.min(de,Math.max(f,1+J*Oe))}}else f=1;y.copy(B),S=D,x=!0,l.copy(B),p=!0,L||(L=!0,w.copy(B),A.set(0,0,0),r.copy(B),m.set(0,0,0))}else p&&(f=0,x=!1,S=0,p=!1)},O=E=>{if(M)return R=!1,{keepRunning:!1,needsRender:!1};j();const W=I?Math.min((E-I)/1e3,.05):1/60;I=E,p&&f>1&&(f=1+(f-1)*Math.exp(-7*W));const B=f>=b;[b,T]=U(b,T,f,B?Ne:Ge,B?_e:We,W),b=Math.min(Math.max(b,-.12),de);for(const N of["x","y","z"])[w[N],A[N]]=U(w[N],A[N],l[N],Be,qe,W),[C[N],t[N]]=U(C[N],t[N],u[N],He,Ve,W),[r[N],m[N]]=U(r[N],m[N],l[N],je,Xe,W);const H=Math.abs(f-b)<.0015&&Math.abs(T)<.0015,Z=A.lengthSq()<1e-9&&w.distanceToSquared(l)<1e-11,J=t.lengthSq()<1e-9&&C.distanceToSquared(u)<1e-9,we=m.lengthSq()<1e-9&&r.distanceToSquared(l)<1e-11;H&&(b=f,T=0);const ce=H&&Z&&J&&we;return G(),R=!ce,{keepRunning:!ce,needsRender:!0}},K=()=>{R||M||document.hidden||!P||(R=!0,I=0,o.request(O))},se=E=>{!(E instanceof PointerEvent)||document.hidden||!P||(k=E.clientX,z=E.clientY,D=E.timeStamp,F=!0,K())},ie=()=>{F=!1,f=0,x=!1,S=0,u.set(0,0,0),p=!1,K()},q=typeof IntersectionObserver=="function"?new IntersectionObserver(([E])=>{P=!!(E!=null&&E.isIntersecting),P||(F=!1,f=0,b=0,T=0,R=!1,o.cancel(O),G())},{threshold:.01}):null;q==null||q.observe(d);const le=()=>{document.hidden?(R=!1,o.cancel(O)):K()};return n.addEventListener("pointermove",se,{passive:!0}),n.addEventListener("pointerleave",ie,{passive:!0}),document.addEventListener("visibilitychange",le),{dispose:()=>{M=!0,n.removeEventListener("pointermove",se),n.removeEventListener("pointerleave",ie),document.removeEventListener("visibilitychange",le),q==null||q.disconnect(),R=!1,o.cancel(O)}}}const oe=`// Shared GLSL, prepended to every fur shader (strand/support) at material
// creation time — see the \`commonGlsl + ...\` concatenation in
// createStrandMaterial.ts / createSupportMaterial.ts. This is a plain .glsl
// file imported via Vite's \`?raw\` suffix, not a preprocessor #include —
// WebGL has no include mechanism, so composition happens in JS before the
// source ever reaches the GPU compiler.

float hash1(float x) {
    return fract(sin(x) * 43758.5453123);
}

// Branchless orthonormal basis from a normal (Duff, Burgess, Christensen et
// al., 2017). Used to build each strand's own tilt/curl plane in
// strand.vert, where only the plane matters and a slow rotation around the
// normal is harmless.
void basisFromNormal(vec3 n, out vec3 t, out vec3 b) {
    float s = n.z >= 0.0 ? 1.0 : -1.0;
    float a = -1.0 / (s + n.z);
    float bb = n.x * n.y * a;
    t = vec3(1.0 + s * n.x * n.x * a, s * bb, -s * n.x);
    b = vec3(bb, s + n.y * n.y * a, -n.y);
}

// Local "skin compression" near the cursor — a soft inward press along the
// surface's own normal, never lateral, so it reads as a press-and-release
// rather than a slide. Shared VERBATIM between support.vert (the base mesh
// itself dents) and strand.vert (every strand's root must dent by the exact
// same amount, or fur visually detaches from the surface it grows from) —
// one implementation, so the two can never disagree.
vec3 cursorCompress(vec3 p, vec3 n, vec3 cursor, float radius, float strength) {
    // Max inward displacement at the very centre of the touch, in the same
    // object-space units as STROKE_RADIUS (0.0085 in prepareGeometry.ts) —
    // about a third of the tube's own radius, chosen so the letter visibly
    // gives under the cursor without ever pinching the tube's silhouette
    // inside out.
    float maxDepth = 0.0028;
    float d = distance(p, cursor);
    float falloff = pow(clamp(1.0 - d / radius, 0.0, 1.0), 2.0);
    // Clamped to [0, 1]: cursorInteraction's own spring can overshoot
    // slightly outside that range for a natural settle on the fur's OWN
    // bend (see its clamp to [-0.2, 1.3]), but a negative or >1x dent would
    // read as the surface bulging or over-pinching rather than pressing —
    // this is always a pure inward press, capped at its own full depth.
    float amount = clamp(strength, 0.0, 1.0) * falloff * maxDepth;

    return p - n * amount;
}

// Linear -> sRGB output encoding.
//
// This is NOT optional bookkeeping; without it every colour in this fur
// system renders far darker than authored. three.js has ColorManagement on
// by default, so \`new Color("#1ba7e8")\` is converted into its LINEAR working
// space before it ever reaches a uniform — #1ba7e8 arrives as
// (0.011, 0.386, 0.807), not (0.106, 0.655, 0.910). Its own built-in
// materials undo that on the way out by ending their fragment shader with
// \`#include <colorspace_fragment>\`, but three appends nothing of the kind to
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

// \`depthT\` is 0 at the root (or the base/support mesh) and 1 at a strand's
// own tip. Two things adapted directly from the piellardj/fur-threejs
// reference fragment shader (recovered via string-literal extraction from
// its minified bundle, since it ships no source):
//
//  - \`light\` is deliberately flat and forgiving (the reference's own
//    comment on this exact formula reads "wrong but looks fine"): it never
//    drops below 0.86x, so the shadowed side of a strand still reads as
//    fibre, not as a dark gap in the coverage. Raised from the reference's
//    own 0.8 floor because this word is lit as a soft, evenly-lit plush
//    object rather than a studio-lit demo prop — the extra headroom is
//    what stops the inside of each stroke reading as a cavity.
//  - \`ao\` darkens the root and brightens the tip with the same depthT^2
//    curve the reference uses for its shells, and reduces to exactly
//    \`uMaxAo\` at depthT = 0 — the same flat multiplier it applies to its
//    base/support mesh, so the two match without a seam.
//
// The specular term is this project's own addition (the reference has no
// half-vector specular, only a crude NdotL^6 term baked into \`light\`) —
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
`,Ye=`// Strand fragment shader.
//
// Real geometry, fully opaque — no alpha cutout, no discard, no blend-order
// concerns of the kind the old shell/fin system needed (see
// createStrandMaterial.ts). Shading reuses shadeFibre from common.glsl, the
// same root/tip mix, AO and rim-light curve the base/support mesh uses, so
// a strand's own root colour matches the skin it grows from with no seam.

precision highp float;
layout(location = 0) out vec4 fragColor;

uniform vec3 uRootColor;
uniform vec3 uTipColor;
uniform vec3 uLightDir;

varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vStrandT;
varying float vShade;

// shadeFibre, linearToSRGB come from common.glsl.

void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Root-biased colour ramp, squared like the old shell/fin pass — only
    // the outermost tips should pick up the pale highlight.
    vec3 color = mix(uRootColor, uTipColor, vStrandT * vStrandT);
    // Per-STRAND brightness variation (not per-fragment noise) — every
    // fragment of a given hair shares its one hashed value, so the fibre
    // reads as a single toned strand rather than a noisy surface. Widened
    // from (0.82, 1.0) — centred on roughly the same average so the overall
    // colour doesn't visibly shift, just spread further apart so
    // neighbouring hairs read as visibly different fibres instead of a
    // near-uniform tone.
    color *= mix(0.58, 1.18, vShade);

    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vStrandT);

    // A little extra root occlusion reveals the layered pile and prevents a
    // very dense coat from merging into one flat cyan cloud. Tips retain the
    // clean highlight while the overlap beneath them carries visible depth.
    shaded *= mix(0.62, 1.07, smoothstep(0.0, 0.76, vStrandT));

    fragColor = vec4(linearToSRGB(shaded), 1.0);
}
`,Ke=`// Strand vertex shader — real, individually-placed hair geometry.
//
// \`position.x\` is reused as this vertex's SIDE (-1/+1, which edge of the
// ribbon's width it is) and \`position.y\` as T (0 at the root, 1 at the
// tip) — see createStrands.ts's buildStrandTemplate for why: the template
// carries no real positions of its own, only this parametric shape, and
// every strand's actual placement/orientation/curve comes from the
// per-instance attributes below plus the current camera.
//
// Every strand reacts to the SAME shared cursor brush as before (uCursor /
// uCursorDir / uCursorRadius / uCursorStrength, still owned and spring-
// damped by cursorInteraction.ts, unchanged) — this is deliberately NOT
// per-strand physics. What makes neighbouring strands diverge instead of
// moving as one rigid patch is that each instance's \`aSeed\` derives its own
// response curve, strength, tilt and curl from that ONE shared signal, so a
// hundred strands under the same brush all start and settle together but
// visibly disagree on how much and how sharply in between.

uniform float uStrandLength;
uniform float uStrandWidth;
uniform vec3  uGravity;
uniform vec3  uCursor;
uniform vec3  uCursorDir;
uniform float uCursorRadius;
uniform float uCursorStrength;
uniform vec3  uRipplePoint;
// Seconds, driven by idleAnimation.ts's own gated rAF loop (paused off-
// screen, tab-hidden, or under prefers-reduced-motion — see that file) —
// NOT the same loop cursorInteraction.ts runs, which stops the instant
// nothing is settling. This is what keeps the fur from ever reading as a
// static prop even when no one is touching it.
uniform float uTime;

attribute vec3 aRoot;
attribute vec3 aNormal;
attribute float aSeed;

varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vStrandT;
varying float vShade;

// hash1, basisFromNormal come from common.glsl, prepended at material-
// creation time.

void main() {
    float side = position.x;
    float t = position.y;

    float hLen     = hash1(aSeed * 12.9898);
    float hWidth   = hash1(aSeed * 29.7331);
    float hCurlAmt = hash1(aSeed * 41.311);
    float hCurlAng = hash1(aSeed * 53.913);
    float hTiltAmt = hash1(aSeed * 7.719);
    float hTiltAng = hash1(aSeed * 13.377);
    float hResp    = hash1(aSeed * 23.371);
    float hStrMul  = hash1(aSeed * 31.951);
    float hShade   = hash1(aSeed * 89.317);
    float hIdlePh  = hash1(aSeed * 101.667);
    float hIdleFr  = hash1(aSeed * 113.311);
    float hIdleAng = hash1(aSeed * 127.211);

    // Widened from (0.72, 1.28) / (0.6, 1.5) — real fur (and plush) is not
    // one uniform pile length; visibly mixed lengths, with a handful of
    // strands clearly shorter or longer than their neighbours, is what
    // breaks up the "every hair the same" look into something that reads as
    // individual and organic rather than a uniform surface texture.
    // Keep the average pile length close to the previous realistic pass, but
    // widen the distribution in both directions. More short undercoat fibres
    // fill the body while sparse longer guard hairs break up the silhouette.
    // Dense, shorter undercoat builds the plush body; a smaller population
    // of distinctly longer guard hairs supplies flow and a soft silhouette.
    float guardHair   = smoothstep(0.92, 1.0, hLen);
    float lenScale    = mix(0.64, 1.32, hLen) + guardHair * 0.26;
    float widthScale  = mix(0.68, 1.48, hWidth) * mix(1.06, 0.9, guardHair);
    float curlAmount  = mix(0.04, 0.32, hCurlAmt);
    float curlAngle   = hCurlAng * 6.28318530718;
    // A strand whose growth direction points close to straight at the
    // camera foreshortens to almost nothing on screen — correct physically,
    // but on the broad front-facing crest of the tube (most of the visible
    // surface, since the camera sits close to head-on) that read as a bald
    // patch fringed only by the strands lucky enough to already lean toward
    // the silhouette. A real coat never grows perfectly perpendicular to
    // the skin at every follicle either, so a substantial MINIMUM tilt
    // (not just a small maximum) is the fix for both: every strand leans by
    // at least ~14 degrees, most by quite a bit more, so most of them read
    // as a visible slanted line instead of a foreshortened dot even head-on.
    float tiltAmount  = mix(0.08, 0.48, hTiltAmt);
    float tiltAngle   = hTiltAng * 6.28318530718;
    float responseExp = mix(0.55, 1.9, hResp);
    float strengthMul = mix(0.55, 1.35, hStrMul);

    vec3 n = normalize(aNormal);
    vec3 tangent, bitangent;
    basisFromNormal(n, tangent, bitangent);

    // Static per-strand tilt off the surface's own normal — real fur never
    // grows exactly perpendicular to the skin at every follicle, and this is
    // what keeps a whole patch of strands from standing up in mechanical
    // lockstep even before the cursor ever touches them.
    vec3 tiltDir = cos(tiltAngle) * tangent + sin(tiltAngle) * bitangent;

    // Soft spatial clumping: follicles in the same small surface cell lean
    // gently toward a shared, jittered centre. This makes neighbouring hairs
    // overlap in silky locks instead of every fibre standing independently,
    // while the low strength preserves the full coat volume.
    // Keep the grouping subtle: large shared cells made a visibly circular,
    // dense tuft at the tight joins of the H instead of an even coat.
    float clumpSize = 0.010;
    vec3 clumpCell = floor(aRoot / clumpSize);
    float clumpId = dot(clumpCell, vec3(1.0, 57.0, 113.0));
    vec3 clumpJitter = vec3(
        hash1(clumpId + 11.7),
        hash1(clumpId + 37.1),
        hash1(clumpId + 73.9)
    ) - 0.5;
    vec3 clumpCentre = (clumpCell + 0.5 + clumpJitter * 0.48) * clumpSize;
    vec3 clumpOffset = clumpCentre - aRoot;
    vec3 clumpDir = clumpOffset - n * dot(clumpOffset, n);
    float clumpDistance = length(clumpDir);
    clumpDir = clumpDistance > 1e-5 ? clumpDir / clumpDistance : tiltDir;
    float clumpStrength = mix(0.02, 0.08, hash1(clumpId + 19.3));

    vec3 growDir = normalize(
        n + tiltDir * tiltAmount + clumpDir * clumpStrength
    );

    // Curl basis around the static direction. Cursor motion changes only the
    // strand's growth orientation below; the curl itself remains a stable
    // per-fibre shape, so the pile bends without collapsing.
    vec3 curlTangent, curlBitangent;
    basisFromNormal(growDir, curlTangent, curlBitangent);
    vec3 curlDir = cos(curlAngle) * curlTangent + sin(curlAngle) * curlBitangent;

    float len = uStrandLength * lenScale;

    // The word's surface is the fixed anchor. Build a soft radial brush field
    // in the tangent plane of each follicle, then rotate only this strand's
    // outward direction away from the cursor. No base-mesh position,
    // object-space transform, or shared rigid block is changed.
    vec3 bentGrowDir = growDir;

    // Uniform early-out: idle frames skip the entire brush path. During an
    // interaction, squared-distance tests reject the overwhelming majority
    // of strands before any normalize(), distance(), pow() or ripple work.
    if (abs(uCursorStrength) > 0.001) {
        vec3 cursorOffset = aRoot - uCursor;
        float cursorDistanceSq = dot(cursorOffset, cursorOffset);

        if (cursorDistanceSq < uCursorRadius * uCursorRadius) {
            vec3 away = cursorOffset - n * dot(cursorOffset, n);
            float awayLength = length(away);
            vec3 awayDir = awayLength > 1e-5 ? away / awayLength : tangent;
            float radialFalloff = smoothstep(
                uCursorRadius,
                0.0,
                sqrt(cursorDistanceSq)
            );
            float infl = pow(radialFalloff, responseExp) * strengthMul * uCursorStrength;
            float cursorDirLength = length(uCursorDir);
            vec3 travelDir = cursorDirLength > 1e-5
                ? uCursorDir / cursorDirLength
                : awayDir;
            vec3 brushDir = normalize(awayDir * 0.78 + travelDir * 0.22);
            float bendAmount = infl * mix(0.8, 1.25, hResp);
            bentGrowDir = normalize(growDir + brushDir * bendAmount);
        }
    }

    // Centreline: extends along growDir, curling sideways more toward the
    // tip (t*t — more bend far from the root, same shape the old shell
    // system's gravity droop used) — a static, per-strand-unique curve
    // baked once per vertex, not simulated. \`aRoot\` itself is NEVER
    // displaced — the letterform's own surface must stay perfectly fixed
    // (see support.vert), so only the strand growing outward from a root
    // moves; the root is the one anchor point that never does.
    vec3 centre = aRoot
        + bentGrowDir * (len * t)
        + curlDir * (curlAmount * len * 0.55 * t * t);

    centre += uGravity * (t * t) * len;

    // Idle sway: a small, always-on, per-strand-phased wobble so the fur
    // never reads as a static prop even at rest — driven by uTime (see
    // idleAnimation.ts), not by the cursor at all. Anchored at the root
    // (scales with t, like the cursor bend above) and using its own
    // hashed angle/phase/frequency so neighbouring strands drift out of
    // sync with each other rather than breathing as one surface.
    float idleAngle = hIdleAng * 6.28318530718;
    vec3 idleDir = cos(idleAngle) * tangent + sin(idleAngle) * bitangent;
    float idleFreq = mix(0.5, 1.1, hIdleFr);
    float idlePhase = hIdlePh * 6.28318530718;
    float idleAmount = sin(uTime * idleFreq + idlePhase) * 0.05 * len * t;
    centre += idleDir * idleAmount;

    // Keep a plush body through the middle of the fibre, then taper all the
    // way to a genuinely fine zero-width tip. The sub-linear profile creates
    // soft overlap without the blunt, flat-card appearance of a wide tip.
    float width = uStrandWidth * widthScale * pow(1.0 - t, 0.48);

    vec3 worldCentre = (modelMatrix * vec4(centre, 1.0)).xyz;
    vec3 worldGrowDir = normalize(mat3(modelMatrix) * bentGrowDir);

    // Billboard the ribbon's WIDTH toward the viewer, per vertex, so a
    // strand reads as a visible sliver from any angle instead of vanishing
    // edge-on — the same trick grass/fur "cards" use. \`cross(growDir,
    // viewDir)\` degenerates whenever a strand points close to straight at
    // (or away from) the camera — which, for fur grown outward from a
    // surface facing a roughly fixed front-on camera, is the MOST common
    // case among visible strands, not a rare one, so this needs a real
    // fallback rather than an edge-case comment. When the primary axis is
    // too small to trust, fall back to a world reference axis instead;
    // if THAT also degenerates (growDir parallel to it too), fall back
    // again. Chained rather than assumed away.
    vec3 viewDir = normalize(cameraPosition - worldCentre);
    vec3 widthAxis = cross(worldGrowDir, viewDir);
    float axisLen = length(widthAxis);

    if (axisLen < 1e-4) {
        widthAxis = cross(worldGrowDir, vec3(0.0, 1.0, 0.0));
        axisLen = length(widthAxis);
    }

    if (axisLen < 1e-4) {
        widthAxis = cross(worldGrowDir, vec3(1.0, 0.0, 0.0));
        axisLen = length(widthAxis);
    }

    widthAxis = axisLen < 1e-4 ? vec3(0.0, 0.0, 1.0) : widthAxis / axisLen;

    vec3 worldPos = worldCentre + widthAxis * (width * side * 0.5);

    vStrandT = t;
    vShade = hShade;
    vWorldNormal = worldGrowDir;
    vWorldPos = worldPos;

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}
`;function Ze(c){var d,a;const e={uStrandLength:{value:c.strandLength},uStrandWidth:{value:c.strandWidth},uRootColor:{value:new te((d=c.rootColor)!=null?d:"#1eb6f7")},uTipColor:{value:new te((a=c.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uGravity:{value:new g(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new g(1e6,1e6,1e6)},uCursorDir:{value:new g(0,0,0)},uCursorRadius:{value:.052},uCursorStrength:{value:0},uRipplePoint:{value:new g(1e6,1e6,1e6)}};return new ge({glslVersion:ve,uniforms:e,vertexShader:oe+`
`+Ke,fragmentShader:oe+`
`+Ye,transparent:!1,depthWrite:!0,depthTest:!0,side:Ae})}const $=5,Je=.85;function Qe(){const c=$+1,e=new Float32Array(c*2*3),n=[];for(let a=0;a<c;a+=1){const h=a/$;for(const o of[-1,1]){const i=a*2+(o===-1?0:1);e[i*3]=o,e[i*3+1]=h,e[i*3+2]=0}}for(let a=0;a<$;a+=1){const h=a*2,o=h+1,i=h+2,s=h+3;n.push(h,o,s,h,s,i)}const d=new ae;return d.setAttribute("position",new V(e,3)),d.setIndex(n),{geometry:d}}function $e(c){let e=c;return()=>{e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function et(c,e){const n=c.getAttribute("position"),d=c.getAttribute("normal"),a=c.getIndex(),h=c.getAttribute("furCoverage");if(!a)throw new Error("sampleRoots requires an indexed geometry");const o=a.count/3,i=new Float64Array(o),s=new g,l=new g,u=new g,y=new g,v=new g;let x=0;for(let r=0;r<o;r+=1){s.fromBufferAttribute(n,a.getX(r*3)),l.fromBufferAttribute(n,a.getX(r*3+1)),u.fromBufferAttribute(n,a.getX(r*3+2));const m=y.subVectors(l,s).cross(v.subVectors(u,s)).length()*.5,f=h?(h.getX(a.getX(r*3))+h.getX(a.getX(r*3+1))+h.getX(a.getX(r*3+2)))/3:0;x+=m*(1+f*Je),i[r]=x}const S=$e(1592598103),p=new Float32Array(e*3),L=new Float32Array(e*3),w=new Float32Array(e),A=new g,C=new g,t=new g;for(let r=0;r<e;r+=1){const m=S()*x;let f=0,b=o-1;for(;f<b;){const O=f+b>>>1;i[O]<m?f=O+1:b=O}const T=f;s.fromBufferAttribute(n,a.getX(T*3)),l.fromBufferAttribute(n,a.getX(T*3+1)),u.fromBufferAttribute(n,a.getX(T*3+2)),A.fromBufferAttribute(d,a.getX(T*3)),C.fromBufferAttribute(d,a.getX(T*3+1)),t.fromBufferAttribute(d,a.getX(T*3+2));const I=S(),M=S(),P=Math.sqrt(I),R=1-P,k=M*P,z=1-R-k;p[r*3]=s.x*R+l.x*k+u.x*z,p[r*3+1]=s.y*R+l.y*k+u.y*z,p[r*3+2]=s.z*R+l.z*k+u.z*z;const D=A.x*R+C.x*k+t.x*z,F=A.y*R+C.y*k+t.y*z,G=A.z*R+C.z*k+t.z*z,j=Math.hypot(D,F,G)||1;L[r*3]=D/j,L[r*3+1]=F/j,L[r*3+2]=G/j,w[r]=S()*1e3}return{roots:p,normals:L,seeds:w}}function tt(c){const e=c.getAttribute("position"),n=c.getIndex();if(!n)return 0;const d=n.count/3,a=new g,h=new g,o=new g,i=new g,s=new g;let l=0;for(let u=0;u<d;u+=1)a.fromBufferAttribute(e,n.getX(u*3)),h.fromBufferAttribute(e,n.getX(u*3+1)),o.fromBufferAttribute(e,n.getX(u*3+2)),l+=i.subVectors(h,a).cross(s.subVectors(o,a)).length()*.5;return l}function nt(c,e){const n=tt(c);return Math.round(n*e)}function ot(c,e){const n=nt(c,e.density),{roots:d,normals:a,seeds:h}=et(c,n),{geometry:o}=Qe();o.setAttribute("aRoot",new Q(d,3)),o.setAttribute("aNormal",new Q(a,3)),o.setAttribute("aSeed",new Q(h,1));const i=Ze({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth}),s=new Te(o,i,n);return s.frustumCulled=!1,{mesh:s,material:i}}const rt=`// Support (base mesh) fragment shader.
//
// Shaded with the exact same \`shadeFibre\` lighting function as the shells
// and fins (depthT = 0, i.e. "root" shading) — adapted directly from the
// reference project, where the base mesh is drawn with the same custom
// shader as the fur rather than a separate PBR material. That is what
// guarantees the base can never read as a visually different "coating"
// underneath the fur: it is lit by literally the same code.

precision highp float;
layout(location = 0) out vec4 fragColor;

uniform vec3 uRootColor;
uniform vec3 uLightDir;

varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 shaded = shadeFibre(uRootColor, n, normalize(uLightDir), viewDir, 0.0);
    fragColor = vec4(linearToSRGB(shaded), 1.0);
}
`,at=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
// displacement of any kind, ever. This is what a temporary swap to a plain
// material would render on its own to verify the imported model's true
// silhouette before any fur exists.
//
// A cursor-driven inward press used to live here (see git history —
// cursorCompress in common.glsl). Removed: at this letterform's tube
// thickness, a press radius wide enough to feel deliberate was also wide
// enough, near an edge, to visibly shift the silhouette rather than read as
// a small dent — exactly the "the whole word moves" report this reverts.
// The word's own geometry must never move; only the fur strands growing
// from it react to the cursor now (see strand.vert).

varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
    vec3 n = normalize(normal);
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function st(c={}){var d;const e={uRootColor:{value:new te((d=c.rootColor)!=null?d:"#1eb6f7")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new ge({glslVersion:ve,uniforms:e,vertexShader:at,fragmentShader:oe+`
`+rt})}function it(c){if(c.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:n,frameLoop:d}=c,a=performance.now();let h=!1,o=!1,i=0;const s=1e3/c.idleFps,l=()=>h&&!document.hidden&&!o,u=p=>o?{keepRunning:!1,needsRender:!1}:p-i<s?{keepRunning:l(),needsRender:!1}:(i=p,n((p-a)/1e3),{keepRunning:l(),needsRender:!0}),y=()=>{l()&&d.request(u)},v=()=>{d.cancel(u)},x=new IntersectionObserver(p=>{h=p.some(L=>L.isIntersecting),l()?y():v()},{threshold:.01});x.observe(e);const S=()=>{l()?y():v()};return document.addEventListener("visibilitychange",S),{dispose:()=>{o=!0,v(),x.disconnect(),document.removeEventListener("visibilitychange",S)}}}function lt(c,e){for(let a=3;a<=Math.min(256,Math.floor(e/8));a+=1){if(e%a!==0)continue;let h=0,o=0;for(let i=0;i<e-a;i+=7)Math.abs(c(i)-c(i+a))<=1e-6&&(h+=1),o+=1;if(o>0&&h/o>=.75)return a}return null}function ct(c,e,n){let d=c;for(let a=0;a<e;a+=1){const h=d.map(o=>o.clone());for(let o=0;o<d.length;o+=1){if(!n&&(o===0||o===d.length-1))continue;const i=d[(o-1+d.length)%d.length],s=d[o],l=d[(o+1)%d.length];h[o].copy(i).add(s.clone().multiplyScalar(2)).add(l).multiplyScalar(.25)}d=h}return d}function dt(c){var i;const e=[];for(let s=0;s<c.length-1;s+=1)e.push(c[s].distanceTo(c[s+1]));const n=[...e].sort((s,l)=>s-l),d=(i=n[n.length>>1])!=null?i:1,a=[];let h=0;const o=(s,l)=>{if(l-s<1)return;const u=c.slice(s,l+1),y=u[0].distanceTo(u[u.length-1])<d*2;y&&u.pop(),a.push({points:u,closed:y})};for(let s=0;s<e.length;s+=1)e[s]>d*6&&(o(h,s),h=s+1);return o(h,c.length-1),a}function ht(c,e,n,d,a,h,o){const i=c.points,s=i.length;if(s<2)return;const l=[];for(let t=0;t<s;t+=1){const r=i[(t-1+s)%s],m=i[(t+1)%s];let f;c.closed?f=m.clone().sub(r):t===0?f=i[1].clone().sub(i[0]):t===s-1?f=i[s-1].clone().sub(i[s-2]):f=m.clone().sub(r),f.lengthSq()<1e-20&&f.set(0,0,1),l.push(f.normalize())}const u=l[0];let y=new g(0,1,0);Math.abs(u.dot(y))>.9&&y.set(1,0,0),y=y.sub(u.clone().multiplyScalar(y.dot(u))).normalize();const v=[y];for(let t=1;t<s;t+=1){const r=l[t-1],m=l[t],f=v[t-1].clone(),b=r.clone().cross(m);if(b.lengthSq()>1e-20){b.normalize();const T=Math.acos(Math.min(1,Math.max(-1,r.dot(m))));f.applyAxisAngle(b,T)}f.sub(m.clone().multiplyScalar(f.dot(m))),v.push(f.normalize())}const x=[],S=(t,r,m,f)=>{const b=r.clone().cross(m).normalize(),T=h.length/3;for(let I=0;I<n;I+=1){const M=I/n*Math.PI*2,P=Math.cos(M)*f,R=Math.sin(M)*f;h.push(t.x+m.x*P+b.x*R,t.y+m.y*P+b.y*R,t.z+m.z*P+b.z*R)}x.push(T)},p=t=>{const r=h.length/3;return h.push(t.x,t.y,t.z),r};let L=null,w=null;if(!c.closed){L=p(i[0].clone().add(l[0].clone().multiplyScalar(-e*a)));for(let t=d-1;t>=1;t-=1){const r=t/d*(Math.PI/2);S(i[0].clone().add(l[0].clone().multiplyScalar(-Math.sin(r)*e*a)),l[0],v[0],Math.cos(r)*e)}}for(let t=0;t<s;t+=1)S(i[t],l[t],v[t],e);if(!c.closed){for(let t=1;t<d;t+=1){const r=t/d*(Math.PI/2);S(i[s-1].clone().add(l[s-1].clone().multiplyScalar(Math.sin(r)*e*a)),l[s-1],v[s-1],Math.cos(r)*e)}w=p(i[s-1].clone().add(l[s-1].clone().multiplyScalar(e*a)))}const A=x.length,C=c.closed?A:A-1;for(let t=0;t<C;t+=1){const r=x[t],m=x[(t+1)%A];for(let f=0;f<n;f+=1){const b=(f+1)%n;o.push(r+f,m+b,m+f),o.push(r+f,r+b,m+b)}}if(!c.closed&&L!==null&&w!==null){const t=x[0],r=x[A-1];for(let m=0;m<n;m+=1){const f=(m+1)%n;o.push(L,t+f,t+m),o.push(r+m,r+f,w)}}}function ut(c,e={}){var x,S,p,L;const n=(x=e.radius)!=null?x:.007,d=(S=e.radialSegments)!=null?S:24,a=(p=e.capSegments)!=null?p:4,h=(L=e.capLengthScale)!=null?L:1,o=c.getAttribute("position");if(!o)return null;const i=lt(w=>o.getY(w),o.count);if(!i)return null;const s=o.count/i,l=[];for(let w=0;w<s;w+=1){const A=new g;for(let C=0;C<i;C+=1){const t=w*i+C;A.x+=o.getX(t),A.y+=o.getY(t),A.z+=o.getZ(t)}l.push(A.divideScalar(i))}const u=[],y=[];for(const w of dt(l))ht({...w,points:ct(w.points,2,w.closed)},n,d,a,h,u,y);if(y.length===0)return null;const v=new ae;return v.setAttribute("position",new V(new Float32Array(u),3)),v.setIndex(new V(new Uint32Array(y),1)),v.computeVertexNormals(),v.normalizeNormals(),v}const ft=.0085,mt=1e-5,_=12,he=4,pt=1.5,ue=1.15;function gt(c){const e=c.getAttribute("position");if(!e||e.count<_*2)return c;const n=Math.floor(e.count/_),d=[];for(let t=0;t<n;t+=1){const r=new g,m=t*_;for(let f=0;f<_;f+=1)r.add(new g(e.getX(m+f),e.getY(m+f),e.getZ(m+f)));d.push(r.multiplyScalar(1/_))}const a=d.findIndex((t,r)=>{const m=d[r+1];return t.x>.06&&t.x<.07&&t.z>-.085&&t.z<-.075&&r>0&&m!==void 0&&t.distanceTo(m)>.02});if(a<1)return c;const h=d[a],o=h.clone().sub(d[a-1]).normalize(),i=a*_,s=Array.from({length:_},(t,r)=>new g(e.getX(i+r),e.getY(i+r),e.getZ(i+r))),l=s.reduce((t,r)=>t+r.distanceTo(h),0)/_;if(!Number.isFinite(l)||l<=0)return c;const u=Array.from(e.array),y=c.getIndex(),v=y?Array.from(y.array):Array.from({length:e.count},(t,r)=>r),x=l*pt,S=h.clone().addScaledVector(o,x);let p=u.length/3;for(const t of s){const r=S.clone().add(t.clone().sub(h));u.push(r.x,r.y,r.z)}for(let t=0;t<_;t+=1){const r=(t+1)%_;v.push(i+t,p+r,p+t,i+t,i+r,p+r)}for(let t=1;t<he;t+=1){const r=t/he*(Math.PI/2),m=Math.cos(r),f=Math.sin(r)*l*ue,b=u.length/3;for(const T of s){const I=T.clone().sub(h).multiplyScalar(m),M=S.clone().add(I).addScaledVector(o,f);u.push(M.x,M.y,M.z)}for(let T=0;T<_;T+=1){const I=(T+1)%_;v.push(p+T,b+I,b+T,p+T,p+I,b+I)}p=b}const L=u.length/3,w=S.clone().addScaledVector(o,l*ue);u.push(w.x,w.y,w.z);for(let t=0;t<_;t+=1){const r=(t+1)%_;v.push(p+t,p+r,L)}const A=new ae;A.setAttribute("position",new V(new Float32Array(u),3)),A.setIndex(new V(new Uint32Array(v),1));const C=new Float32Array(u.length/3);return C.fill(1,e.count),A.setAttribute("furCoverage",new V(C,1)),A}function vt(c){const e=ut(c,{radius:ft,radialSegments:20,capSegments:7,capLengthScale:.75});if(e)return e;let n=gt(c);return n.deleteAttribute("normal"),n.getAttribute("uv")&&n.deleteAttribute("uv"),n=Fe(n,mt),n.computeVertexNormals(),n.normalizeNormals(),n}const wt=.0078,bt=9e-4;function yt(c,e){var y;const n=vt(c),d=st({rootColor:e.rootColor}),a=new re(n,d);a.castShadow=!0;const{mesh:h,material:o}=ot(n,{density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:wt,strandWidth:bt});e.lightDir&&(o.uniforms.uLightDir.value.copy(e.lightDir),d.uniforms.uLightDir.value.copy(e.lightDir));const i=new ne;i.add(a,h);const s=Ue({camera:e.camera,domElement:(y=e.pointerTarget)!=null?y:window,viewportElement:e.viewportElement,raycastTargets:[a],materials:[o],frameLoop:e.frameLoop}),l=it({viewportElement:e.viewportElement,setTime:v=>{o.uniforms.uTime.value=v},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps});return{group:i,baseMesh:a,strandMesh:h,materials:{strand:o,support:d},dispose:()=>{l.dispose(),s.dispose(),n.dispose(),h.geometry.dispose(),d.dispose(),o.dispose(),h.dispose()}}}function St(c){const e=new Set;let n=0,d=!1,a=!1;const h=o=>{if(a){d=!1;return}let i=!1;for(const s of Array.from(e)){const l=s(o),u=typeof l=="boolean"?l:l.keepRunning;i||(i=typeof l=="boolean"?!0:l.needsRender),u||e.delete(s)}i&&c(),e.size>0?n=requestAnimationFrame(h):d=!1};return{request:o=>{e.add(o),!d&&!a&&(d=!0,n=requestAnimationFrame(h))},cancel:o=>{e.delete(o)},dispose:()=>{a=!0,e.clear(),cancelAnimationFrame(n),d=!1}}}const Y={high:{name:"high",density:46e5,maxDpr:2,idleFps:30},balanced:{name:"balanced",density:46e5,maxDpr:2,idleFps:30},mobile:{name:"mobile",density:19e5,maxDpr:1.25,idleFps:20}};function fe(c,e){if(typeof window<"u"){const n=new URLSearchParams(window.location.search).get("furQuality");if(n&&n in Y)return Y[n]}return c<=640||e?Y.mobile:Y.balanced}const xt="_root_1xfol_10",At={root:xt},ee={desktop:{width:.9,offsetY:.19,maxHeight:.54},tablet:{width:.88,offsetY:.18,maxHeight:.54},mobile:{width:.9,offsetY:.12,maxHeight:.46}},Tt=.8,me=20,pe=6.5,Mt=Math.PI/2,Rt="#159fdf";function It({className:c,onReady:e}){const n=X.useRef(null),d=X.useRef(e);d.current=e;const a=be(),h=X.useRef(a);return h.current=a,X.useEffect(()=>{const o=n.current;if(!o)return;const i=new Me,s=new Re(me,1,.1,100);s.position.set(0,0,pe);const l=new Ce({antialias:!0,alpha:!0,powerPreference:"high-performance"});l.setClearAlpha(0),l.shadowMap.enabled=!0,l.shadowMap.type=De,l.shadowMap.autoUpdate=!1,o.appendChild(l.domElement),i.add(new Le(14674678,1.5));const u=new Ee(16777215,1.4);u.position.set(-1.1,2,3.4),u.castShadow=!0,u.shadow.mapSize.set(2048,2048),u.shadow.bias=-8e-4,u.shadow.normalBias=.015,u.shadow.camera.left=-2,u.shadow.camera.right=2,u.shadow.camera.top=2,u.shadow.camera.bottom=-2,u.shadow.camera.near=.5,u.shadow.camera.far=12,u.shadow.radius=2.6,i.add(u);const y=u.position.clone().normalize(),v=new re(new Ie(24,24),new Pe({opacity:.07}));v.position.z=-.24,v.receiveShadow=!0,i.add(v);const x=new ne,S=new ne;S.rotation.x=Mt,x.add(S),i.add(x);const p=new g;let L=!1,w=!1,A=0;const C=[],t=()=>{w||l.render(i,s)},r=St(t),m=()=>{const M=o.clientWidth,P=o.clientHeight;if(M===0||P===0)return;A=M;const R=M/P;s.aspect=R,s.updateProjectionMatrix();const k=fe(M,h.current);if(l.setPixelRatio(Math.min(window.devicePixelRatio,k.maxDpr)),l.setSize(M,P,!1),!L)return;const z=R<.85?ee.mobile:R<1.4?ee.tablet:ee.desktop,D=2*Math.tan(me*Math.PI/360)*pe,F=D*R;let G=z.width*F/p.x;G=Math.min(G,z.maxHeight*D/p.y),G*=Tt,x.scale.setScalar(G),x.position.set(0,z.offsetY*D,0),l.shadowMap.needsUpdate=!0,t()};let f=0,b=0;const T=M=>{if(w)return;const P=fe(A,h.current),R=Rt;for(const D of M){if(w)break;const F=yt(D.geometry,{camera:s,viewportElement:l.domElement,pointerTarget:window,quality:P,rootColor:R,lightDir:y,frameLoop:r,reducedMotion:h.current});F.group.position.copy(D.position),F.group.quaternion.copy(D.quaternion),F.group.scale.copy(D.scale),S.add(F.group),C.push(F)}if(w||C.length===0)return;S.updateMatrixWorld(!0);const k=new ke;for(const D of C)k.expandByObject(D.baseMesh);k.getSize(p),S.position.sub(k.getCenter(new g)),L=!0,m();const z={scene:i,strandMaterials:C.map(D=>D.materials.strand),supportMaterials:C.map(D=>D.materials.support),renderer:l,camera:s,requestRender:t};b=requestAnimationFrame(()=>{var D;w||(D=d.current)==null||D.call(d,z)})};ze().then(M=>{w||(f=requestAnimationFrame(()=>T(M)))},M=>{console.error("[HelloModel] failed to load hello.glb",M)});const I=new ResizeObserver(m);return I.observe(o),window.addEventListener("resize",m,{passive:!0}),window.addEventListener("orientationchange",m,{passive:!0}),m(),()=>{w=!0,cancelAnimationFrame(f),cancelAnimationFrame(b),I.disconnect(),window.removeEventListener("resize",m),window.removeEventListener("orientationchange",m);for(const M of C)M.dispose();v.geometry.dispose(),v.material.dispose(),r.dispose(),l.dispose(),l.domElement.remove()}},[]),ye.jsx("div",{ref:n,className:[At.root,c].filter(Boolean).join(" "),"aria-hidden":"true"})}export{It as HelloModel,It as default};
