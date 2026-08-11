import{r as Z,u as xe,j as Ae}from"./index-C1-p2Urd.js";import{g,V as Te,ac as Me,E as le,C as ae,ad as be,a8 as Re,ae as ye,h as ne,I as De,z as ce,B as Y,U as se,af as Ce,W as Le,ag as Ee,ah as Ie,ai as Pe,D as ke,aj as Fe,ak as ze,aa as Ne}from"./three-vendor-BWiavw-v.js";import{m as _e}from"./three-gltf-hKZJeKbV.js";import{preloadHelloGeometries as Ge}from"./preloadHello-CMziDfQd.js";const We=340,Oe=28,Be=105,qe=13,Ve=.055,fe=1.6,He=2600,je=75,Xe=2900,Ue=80,Ye=600,Ke=22;function J(l,e,n,c,a,h){const r=(n-l)*c;let i=e+r*h;return i*=Math.exp(-a*h),[l+i*h,i]}function Ze(l){const{camera:e,domElement:n,viewportElement:c,raycastTargets:a,materials:h,frameLoop:r}=l,i=new Te(2,2),s=new Me,d=new g(1e6,1e6,1e6),u=new g,y=new g,v=new g;let S=!1,x=0,w=!1,M=!1;const p=new g(1e6,1e6,1e6),T=new g,L=new g,t=new g,o=new g(1e6,1e6,1e6),m=new g;let f=0,b=0,A=0,P=0,I=!1,z=!0,C=!1,W=0,O=0,D=0,N=!1;const G=()=>{for(const R of h)R.uniforms.uCursorStrength.value=b,R.uniforms.uCursor.value.copy(p),R.uniforms.uCursorDir.value.copy(L),R.uniforms.uRipplePoint.value.copy(o)},B=()=>{if(!N||a.length===0)return;N=!1;const R=c.getBoundingClientRect();i.set((W-R.left)/R.width*2-1,-((O-R.top)/R.height)*2+1),s.setFromCamera(i,e);const V=s.intersectObjects(a,!1)[0];if(V&&V.object instanceof le){const j=V.object.worldToLocal(V.point.clone());if(S){v.copy(j).sub(y);const U=v.length();if(U>1e-6){u.copy(v).multiplyScalar(1/U);const ee=Math.max((D-x)/1e3,1/240),te=U/ee;f=Math.min(fe,Math.max(f,1+te*Ve))}}else f=1;y.copy(j),x=D,S=!0,d.copy(j),w=!0,M||(M=!0,p.copy(j),T.set(0,0,0),o.copy(j),m.set(0,0,0))}else w&&(f=0,S=!1,x=0,w=!1)},k=R=>{if(I)return C=!1,{keepRunning:!1,needsRender:!1};B();const V=P?Math.min((R-P)/1e3,.05):1/60;P=R,w&&f>1&&(f=1+(f-1)*Math.exp(-7*V));const j=f>=b;[b,A]=J(b,A,f,j?We:Be,j?Oe:qe,V),b=Math.min(Math.max(b,-.12),fe);for(const F of["x","y","z"])[p[F],T[F]]=J(p[F],T[F],d[F],He,je,V),[L[F],t[F]]=J(L[F],t[F],u[F],Xe,Ue,V),[o[F],m[F]]=J(o[F],m[F],d[F],Ye,Ke,V);const U=Math.abs(f-b)<.0015&&Math.abs(A)<.0015,ee=T.lengthSq()<1e-9&&p.distanceToSquared(d)<1e-11,te=t.lengthSq()<1e-9&&L.distanceToSquared(u)<1e-9,Se=m.lengthSq()<1e-9&&o.distanceToSquared(d)<1e-11;U&&(b=f,A=0);const ue=U&&ee&&te&&Se;return G(),C=!ue,{keepRunning:!ue,needsRender:!0}},E=()=>{C||I||document.hidden||!z||(C=!0,P=0,r.request(k))},q=R=>{!(R instanceof PointerEvent)||document.hidden||!z||(W=R.clientX,O=R.clientY,D=R.timeStamp,N=!0,E())},H=R=>{q(R)},de=R=>{q(R)},$=()=>{N=!1,f=0,S=!1,x=0,u.set(0,0,0),w=!1,E()},K=()=>{$()},X=typeof IntersectionObserver=="function"?new IntersectionObserver(([R])=>{z=!!(R!=null&&R.isIntersecting),z||(N=!1,f=0,b=0,A=0,C=!1,r.cancel(k),G())},{threshold:.01}):null;X==null||X.observe(c);const he=()=>{document.hidden?(C=!1,r.cancel(k)):E()};return n.addEventListener("pointerdown",H,{passive:!0}),n.addEventListener("pointermove",de,{passive:!0}),n.addEventListener("pointerleave",$,{passive:!0}),n.addEventListener("pointerup",K,{passive:!0}),n.addEventListener("pointercancel",K,{passive:!0}),document.addEventListener("visibilitychange",he),{dispose:()=>{I=!0,n.removeEventListener("pointerdown",H),n.removeEventListener("pointermove",de),n.removeEventListener("pointerleave",$),n.removeEventListener("pointerup",K),n.removeEventListener("pointercancel",K),document.removeEventListener("visibilitychange",he),X==null||X.disconnect(),C=!1,r.cancel(k)}}}const ie=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,Je=`// Strand fragment shader.
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
`,Qe=`// Strand vertex shader — real, individually-placed hair geometry.
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
`;function $e(l){var c,a;const e={uStrandLength:{value:l.strandLength},uStrandWidth:{value:l.strandWidth},uRootColor:{value:new ae((c=l.rootColor)!=null?c:"#1eb6f7")},uTipColor:{value:new ae((a=l.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uGravity:{value:new g(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new g(1e6,1e6,1e6)},uCursorDir:{value:new g(0,0,0)},uCursorRadius:{value:.052},uCursorStrength:{value:0},uRipplePoint:{value:new g(1e6,1e6,1e6)}};return new be({glslVersion:ye,uniforms:e,vertexShader:ie+`
`+Qe,fragmentShader:ie+`
`+Je,transparent:!1,depthWrite:!0,depthTest:!0,side:Re})}const oe=5,et=.85;function tt(){const l=oe+1,e=new Float32Array(l*2*3),n=[];for(let a=0;a<l;a+=1){const h=a/oe;for(const r of[-1,1]){const i=a*2+(r===-1?0:1);e[i*3]=r,e[i*3+1]=h,e[i*3+2]=0}}for(let a=0;a<oe;a+=1){const h=a*2,r=h+1,i=h+2,s=h+3;n.push(h,r,s,h,s,i)}const c=new ce;return c.setAttribute("position",new Y(e,3)),c.setIndex(n),{geometry:c}}function nt(l){let e=l;return()=>{e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function ot(l,e){const n=l.getAttribute("position"),c=l.getAttribute("normal"),a=l.getIndex(),h=l.getAttribute("furCoverage");if(!a)throw new Error("sampleRoots requires an indexed geometry");const r=a.count/3,i=new Float64Array(r),s=new g,d=new g,u=new g,y=new g,v=new g;let S=0;for(let o=0;o<r;o+=1){s.fromBufferAttribute(n,a.getX(o*3)),d.fromBufferAttribute(n,a.getX(o*3+1)),u.fromBufferAttribute(n,a.getX(o*3+2));const m=y.subVectors(d,s).cross(v.subVectors(u,s)).length()*.5,f=h?(h.getX(a.getX(o*3))+h.getX(a.getX(o*3+1))+h.getX(a.getX(o*3+2)))/3:0;S+=m*(1+f*et),i[o]=S}const x=nt(1592598103),w=new Float32Array(e*3),M=new Float32Array(e*3),p=new Float32Array(e),T=new g,L=new g,t=new g;for(let o=0;o<e;o+=1){const m=x()*S;let f=0,b=r-1;for(;f<b;){const k=f+b>>>1;i[k]<m?f=k+1:b=k}const A=f;s.fromBufferAttribute(n,a.getX(A*3)),d.fromBufferAttribute(n,a.getX(A*3+1)),u.fromBufferAttribute(n,a.getX(A*3+2)),T.fromBufferAttribute(c,a.getX(A*3)),L.fromBufferAttribute(c,a.getX(A*3+1)),t.fromBufferAttribute(c,a.getX(A*3+2));const P=x(),I=x(),z=Math.sqrt(P),C=1-z,W=I*z,O=1-C-W;w[o*3]=s.x*C+d.x*W+u.x*O,w[o*3+1]=s.y*C+d.y*W+u.y*O,w[o*3+2]=s.z*C+d.z*W+u.z*O;const D=T.x*C+L.x*W+t.x*O,N=T.y*C+L.y*W+t.y*O,G=T.z*C+L.z*W+t.z*O,B=Math.hypot(D,N,G)||1;M[o*3]=D/B,M[o*3+1]=N/B,M[o*3+2]=G/B,p[o]=x()*1e3}return{roots:w,normals:M,seeds:p}}function rt(l){const e=l.getAttribute("position"),n=l.getIndex();if(!n)return 0;const c=n.count/3,a=new g,h=new g,r=new g,i=new g,s=new g;let d=0;for(let u=0;u<c;u+=1)a.fromBufferAttribute(e,n.getX(u*3)),h.fromBufferAttribute(e,n.getX(u*3+1)),r.fromBufferAttribute(e,n.getX(u*3+2)),d+=i.subVectors(h,a).cross(s.subVectors(r,a)).length()*.5;return d}function at(l,e){const n=rt(l);return Math.round(n*e)}function st(l,e){const n=at(l,e.density),{roots:c,normals:a,seeds:h}=ot(l,n),{geometry:r}=tt();r.setAttribute("aRoot",new ne(c,3)),r.setAttribute("aNormal",new ne(a,3)),r.setAttribute("aSeed",new ne(h,1));const i=$e({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth}),s=new De(r,i,n);return s.frustumCulled=!1,{mesh:s,material:i}}const it=`// Support (base mesh) fragment shader.
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
`,lt=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function ct(l={}){var c;const e={uRootColor:{value:new ae((c=l.rootColor)!=null?c:"#1eb6f7")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new be({glslVersion:ye,uniforms:e,vertexShader:lt,fragmentShader:ie+`
`+it})}function dt(l){if(l.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:n,frameLoop:c}=l;let a=!1,h=!1,r=0,i=0,s=0;const d=1e3/l.idleFps,u=()=>a&&!document.hidden&&!h,y=M=>{if(h)return{keepRunning:!1,needsRender:!1};if(M-r<d)return{keepRunning:u(),needsRender:!1};const p=i?Math.min((M-i)/1e3,.05):0;return i=M,r=M,s+=p,n(s),{keepRunning:u(),needsRender:!0}},v=()=>{u()&&(i=0,r=0,c.request(y))},S=()=>{c.cancel(y)},x=new IntersectionObserver(M=>{a=M.some(p=>p.isIntersecting),u()?v():S()},{threshold:.01});x.observe(e);const w=()=>{u()?v():S()};return document.addEventListener("visibilitychange",w),{dispose:()=>{h=!0,S(),x.disconnect(),document.removeEventListener("visibilitychange",w)}}}function ht(l,e){for(let a=3;a<=Math.min(256,Math.floor(e/8));a+=1){if(e%a!==0)continue;let h=0,r=0;for(let i=0;i<e-a;i+=7)Math.abs(l(i)-l(i+a))<=1e-6&&(h+=1),r+=1;if(r>0&&h/r>=.75)return a}return null}function ut(l,e,n){let c=l;for(let a=0;a<e;a+=1){const h=c.map(r=>r.clone());for(let r=0;r<c.length;r+=1){if(!n&&(r===0||r===c.length-1))continue;const i=c[(r-1+c.length)%c.length],s=c[r],d=c[(r+1)%c.length];h[r].copy(i).add(s.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}c=h}return c}function ft(l){var i;const e=[];for(let s=0;s<l.length-1;s+=1)e.push(l[s].distanceTo(l[s+1]));const n=[...e].sort((s,d)=>s-d),c=(i=n[n.length>>1])!=null?i:1,a=[];let h=0;const r=(s,d)=>{if(d-s<1)return;const u=l.slice(s,d+1),y=u[0].distanceTo(u[u.length-1])<c*2;y&&u.pop(),a.push({points:u,closed:y})};for(let s=0;s<e.length;s+=1)e[s]>c*6&&(r(h,s),h=s+1);return r(h,l.length-1),a}function mt(l,e,n,c,a,h,r){const i=l.points,s=i.length;if(s<2)return;const d=[];for(let t=0;t<s;t+=1){const o=i[(t-1+s)%s],m=i[(t+1)%s];let f;l.closed?f=m.clone().sub(o):t===0?f=i[1].clone().sub(i[0]):t===s-1?f=i[s-1].clone().sub(i[s-2]):f=m.clone().sub(o),f.lengthSq()<1e-20&&f.set(0,0,1),d.push(f.normalize())}const u=d[0];let y=new g(0,1,0);Math.abs(u.dot(y))>.9&&y.set(1,0,0),y=y.sub(u.clone().multiplyScalar(y.dot(u))).normalize();const v=[y];for(let t=1;t<s;t+=1){const o=d[t-1],m=d[t],f=v[t-1].clone(),b=o.clone().cross(m);if(b.lengthSq()>1e-20){b.normalize();const A=Math.acos(Math.min(1,Math.max(-1,o.dot(m))));f.applyAxisAngle(b,A)}f.sub(m.clone().multiplyScalar(f.dot(m))),v.push(f.normalize())}const S=[],x=(t,o,m,f)=>{const b=o.clone().cross(m).normalize(),A=h.length/3;for(let P=0;P<n;P+=1){const I=P/n*Math.PI*2,z=Math.cos(I)*f,C=Math.sin(I)*f;h.push(t.x+m.x*z+b.x*C,t.y+m.y*z+b.y*C,t.z+m.z*z+b.z*C)}S.push(A)},w=t=>{const o=h.length/3;return h.push(t.x,t.y,t.z),o};let M=null,p=null;if(!l.closed){M=w(i[0].clone().add(d[0].clone().multiplyScalar(-e*a)));for(let t=c-1;t>=1;t-=1){const o=t/c*(Math.PI/2);x(i[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(o)*e*a)),d[0],v[0],Math.cos(o)*e)}}for(let t=0;t<s;t+=1)x(i[t],d[t],v[t],e);if(!l.closed){for(let t=1;t<c;t+=1){const o=t/c*(Math.PI/2);x(i[s-1].clone().add(d[s-1].clone().multiplyScalar(Math.sin(o)*e*a)),d[s-1],v[s-1],Math.cos(o)*e)}p=w(i[s-1].clone().add(d[s-1].clone().multiplyScalar(e*a)))}const T=S.length,L=l.closed?T:T-1;for(let t=0;t<L;t+=1){const o=S[t],m=S[(t+1)%T];for(let f=0;f<n;f+=1){const b=(f+1)%n;r.push(o+f,m+b,m+f),r.push(o+f,o+b,m+b)}}if(!l.closed&&M!==null&&p!==null){const t=S[0],o=S[T-1];for(let m=0;m<n;m+=1){const f=(m+1)%n;r.push(M,t+f,t+m),r.push(o+m,o+f,p)}}}function pt(l,e={}){var S,x,w,M;const n=(S=e.radius)!=null?S:.007,c=(x=e.radialSegments)!=null?x:24,a=(w=e.capSegments)!=null?w:4,h=(M=e.capLengthScale)!=null?M:1,r=l.getAttribute("position");if(!r)return null;const i=ht(p=>r.getY(p),r.count);if(!i)return null;const s=r.count/i,d=[];for(let p=0;p<s;p+=1){const T=new g;for(let L=0;L<i;L+=1){const t=p*i+L;T.x+=r.getX(t),T.y+=r.getY(t),T.z+=r.getZ(t)}d.push(T.divideScalar(i))}const u=[],y=[];for(const p of ft(d))mt({...p,points:ut(p.points,2,p.closed)},n,c,a,h,u,y);if(y.length===0)return null;const v=new ce;return v.setAttribute("position",new Y(new Float32Array(u),3)),v.setIndex(new Y(new Uint32Array(y),1)),v.computeVertexNormals(),v.normalizeNormals(),v}const gt=.0085,vt=1e-5,_=12,me=4,wt=1.5,pe=1.15;function bt(l){const e=l.getAttribute("position");if(!e||e.count<_*2)return l;const n=Math.floor(e.count/_),c=[];for(let t=0;t<n;t+=1){const o=new g,m=t*_;for(let f=0;f<_;f+=1)o.add(new g(e.getX(m+f),e.getY(m+f),e.getZ(m+f)));c.push(o.multiplyScalar(1/_))}const a=c.findIndex((t,o)=>{const m=c[o+1];return t.x>.06&&t.x<.07&&t.z>-.085&&t.z<-.075&&o>0&&m!==void 0&&t.distanceTo(m)>.02});if(a<1)return l;const h=c[a],r=h.clone().sub(c[a-1]).normalize(),i=a*_,s=Array.from({length:_},(t,o)=>new g(e.getX(i+o),e.getY(i+o),e.getZ(i+o))),d=s.reduce((t,o)=>t+o.distanceTo(h),0)/_;if(!Number.isFinite(d)||d<=0)return l;const u=Array.from(e.array),y=l.getIndex(),v=y?Array.from(y.array):Array.from({length:e.count},(t,o)=>o),S=d*wt,x=h.clone().addScaledVector(r,S);let w=u.length/3;for(const t of s){const o=x.clone().add(t.clone().sub(h));u.push(o.x,o.y,o.z)}for(let t=0;t<_;t+=1){const o=(t+1)%_;v.push(i+t,w+o,w+t,i+t,i+o,w+o)}for(let t=1;t<me;t+=1){const o=t/me*(Math.PI/2),m=Math.cos(o),f=Math.sin(o)*d*pe,b=u.length/3;for(const A of s){const P=A.clone().sub(h).multiplyScalar(m),I=x.clone().add(P).addScaledVector(r,f);u.push(I.x,I.y,I.z)}for(let A=0;A<_;A+=1){const P=(A+1)%_;v.push(w+A,b+P,b+A,w+A,w+P,b+P)}w=b}const M=u.length/3,p=x.clone().addScaledVector(r,d*pe);u.push(p.x,p.y,p.z);for(let t=0;t<_;t+=1){const o=(t+1)%_;v.push(w+t,w+o,M)}const T=new ce;T.setAttribute("position",new Y(new Float32Array(u),3)),T.setIndex(new Y(new Uint32Array(v),1));const L=new Float32Array(u.length/3);return L.fill(1,e.count),T.setAttribute("furCoverage",new Y(L,1)),T}function yt(l){const e=pt(l,{radius:gt,radialSegments:20,capSegments:7,capLengthScale:.75});if(e)return e;let n=bt(l);return n.deleteAttribute("normal"),n.getAttribute("uv")&&n.deleteAttribute("uv"),n=_e(n,vt),n.computeVertexNormals(),n.normalizeNormals(),n}const St=.0078,xt=9e-4;function At(l,e){var y;const n=yt(l),c=ct({rootColor:e.rootColor}),a=new le(n,c);a.castShadow=!0;const{mesh:h,material:r}=st(n,{density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:St,strandWidth:xt});e.lightDir&&(r.uniforms.uLightDir.value.copy(e.lightDir),c.uniforms.uLightDir.value.copy(e.lightDir));const i=new se;i.add(a,h);const s=Ze({camera:e.camera,domElement:(y=e.pointerTarget)!=null?y:window,viewportElement:e.viewportElement,raycastTargets:[a],materials:[r],frameLoop:e.frameLoop}),d=dt({viewportElement:e.viewportElement,setTime:v=>{r.uniforms.uTime.value=v},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps});return{group:i,baseMesh:a,strandMesh:h,materials:{strand:r,support:c},dispose:()=>{d.dispose(),s.dispose(),n.dispose(),h.geometry.dispose(),c.dispose(),r.dispose(),h.dispose()}}}function Tt(l){const e=new Set;let n=0,c=!1,a=!1;const h=r=>{if(a){c=!1;return}let i=!1;for(const s of Array.from(e)){const d=s(r),u=typeof d=="boolean"?d:d.keepRunning;i||(i=typeof d=="boolean"?!0:d.needsRender),u||e.delete(s)}i&&l(),e.size>0?n=requestAnimationFrame(h):c=!1};return{request:r=>{e.add(r),!c&&!a&&(c=!0,n=requestAnimationFrame(h))},cancel:r=>{e.delete(r)},dispose:()=>{a=!0,e.clear(),cancelAnimationFrame(n),c=!1}}}const Q={high:{name:"high",density:46e5,maxDpr:2,idleFps:30},balanced:{name:"balanced",density:46e5,maxDpr:2,idleFps:30},mobile:{name:"mobile",density:19e5,maxDpr:2,idleFps:20}};function ge(l,e){if(typeof window<"u"){const n=new URLSearchParams(window.location.search).get("furQuality");if(n&&n in Q)return Q[n]}return l<=640||e?Q.mobile:Q.balanced}const Mt="_root_1xfol_10",Rt={root:Mt},re={desktop:{width:.9,offsetY:.19,maxHeight:.54,sizeScale:.8,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},ve=20,we=6.5,Dt=Math.PI/2,Ct="#159fdf";function kt({className:l,onReady:e}){const n=Z.useRef(null),c=Z.useRef(e);c.current=e;const a=xe(),h=Z.useRef(a);return h.current=a,Z.useEffect(()=>{const r=n.current;if(!r)return;const i=new Ce,s=new Le(ve,1,.1,100);s.position.set(0,0,we);const d=new Ee({antialias:!0,alpha:!0,powerPreference:"high-performance"});d.setClearAlpha(0),d.shadowMap.enabled=!0,d.shadowMap.type=Ie,d.shadowMap.autoUpdate=!1,r.appendChild(d.domElement),i.add(new Pe(14674678,1.5));const u=new ke(16777215,1.4);u.position.set(-1.1,2,3.4),u.castShadow=!0,u.shadow.mapSize.set(2048,2048),u.shadow.bias=-8e-4,u.shadow.normalBias=.015,u.shadow.camera.left=-2,u.shadow.camera.right=2,u.shadow.camera.top=2,u.shadow.camera.bottom=-2,u.shadow.camera.near=.5,u.shadow.camera.far=12,u.shadow.radius=2.6,i.add(u);const y=u.position.clone().normalize(),v=new le(new Fe(24,24),new ze({opacity:.07}));v.position.z=-.24,v.receiveShadow=!0,i.add(v);const S=new se,x=new se;x.rotation.x=Dt,S.add(x),i.add(S);const w=new g;let M=!1,p=!1,T=!0,L=!document.hidden,t=0;const o=[],m=()=>!p&&T&&L,f=()=>{m()&&d.render(i,s)},b=Tt(f),A=new IntersectionObserver(([D])=>{T=!!(D!=null&&D.isIntersecting),m()&&f()},{threshold:.01});A.observe(r);const P=()=>{L=!document.hidden,m()&&f()};document.addEventListener("visibilitychange",P);const I=()=>{const D=r.clientWidth,N=r.clientHeight;if(D===0||N===0)return;t=D;const G=D/N;s.aspect=G,s.updateProjectionMatrix();const B=ge(D,h.current);if(d.setPixelRatio(Math.min(window.devicePixelRatio,B.maxDpr)),d.setSize(D,N,!1),!M)return;const k=G<.85?re.mobile:G<1.4?re.tablet:re.desktop;v.position.z=G<.85?-.065:-.24;const E=2*Math.tan(ve*Math.PI/360)*we,q=E*G;let H=k.width*q/w.x;H=Math.min(H,k.maxHeight*E/w.y),H*=k.sizeScale,S.scale.set(H,H*k.verticalScale,H),S.position.set(0,k.offsetY*E,0),d.shadowMap.needsUpdate=!0,f()};let z=0,C=0;const W=D=>{if(p)return;const N=ge(t,h.current),G=Ct;for(const E of D){if(p)break;const q=At(E.geometry,{camera:s,viewportElement:d.domElement,pointerTarget:window,quality:N,rootColor:G,lightDir:y,frameLoop:b,reducedMotion:h.current});q.group.position.copy(E.position),q.group.quaternion.copy(E.quaternion),q.group.scale.copy(E.scale),x.add(q.group),o.push(q)}if(p||o.length===0)return;x.updateMatrixWorld(!0);const B=new Ne;for(const E of o)B.expandByObject(E.baseMesh);B.getSize(w),x.position.sub(B.getCenter(new g)),M=!0,I();const k={scene:i,strandMaterials:o.map(E=>E.materials.strand),supportMaterials:o.map(E=>E.materials.support),renderer:d,camera:s,requestRender:f};C=requestAnimationFrame(()=>{var E;p||(E=c.current)==null||E.call(c,k)})};Ge().then(D=>{p||(z=requestAnimationFrame(()=>W(D)))},D=>{console.error("[HelloModel] failed to load hello.glb",D)});const O=new ResizeObserver(I);return O.observe(r),window.addEventListener("resize",I,{passive:!0}),window.addEventListener("orientationchange",I,{passive:!0}),I(),()=>{p=!0,cancelAnimationFrame(z),cancelAnimationFrame(C),O.disconnect(),A.disconnect(),window.removeEventListener("resize",I),window.removeEventListener("orientationchange",I),document.removeEventListener("visibilitychange",P);for(const D of o)D.dispose();v.geometry.dispose(),v.material.dispose(),b.dispose(),d.dispose(),d.domElement.remove()}},[]),Ae.jsx("div",{ref:n,className:[Rt.root,l].filter(Boolean).join(" "),"aria-hidden":"true"})}export{kt as HelloModel,kt as default};
