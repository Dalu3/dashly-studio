import{r as j,u as ge,j as ve}from"./index-DL6xhbDn.js";import{V as g,a as we,R as be,M as re,C as $,S as ue,F as ye,G as fe,I as J,b as Se,B as me,c as ee,m as xe,d as te,e as Ae,P as De,W as Re,f as Me,A as Te,D as Ce,g as Le,h as Ee,p as Ie,i as ke}from"./preloadHello-Dd9BNBOj.js";const Fe=340,Pe=28,ze=105,Ne=13,Ge=.055,le=1.6,We=360,Oe=28,qe=420,Be=30,_e=42,He=5.8;function V(i,e,t,a,o,l){const n=(t-i)*a;let r=e+n*l;return r*=Math.exp(-o*l),[i+r*l,r]}function je(i){const{camera:e,domElement:t,viewportElement:a,raycastTargets:o,materials:l,frameLoop:n}=i,r=new we(2,2),s=new be,d=new g(1e6,1e6,1e6),h=new g,v=new g,w=new g;let x=!1,b=0,f=!1,E=!1;const c=new g(1e6,1e6,1e6),m=new g,p=new g,u=new g,y=new g(1e6,1e6,1e6),A=new g;let D=0,R=0,P=0,W=0,C=!1,L=!0,M=!1,k=0,z=0,S=0,I=!1;const N=()=>{for(const T of l)T.uniforms.uCursorStrength.value=R,T.uniforms.uCursor.value.copy(c),T.uniforms.uCursorDir.value.copy(p),T.uniforms.uRipplePoint.value.copy(y)},_=()=>{if(!I||o.length===0)return;I=!1;const T=a.getBoundingClientRect();r.set((k-T.left)/T.width*2-1,-((z-T.top)/T.height)*2+1),s.setFromCamera(r,e);const G=s.intersectObjects(o,!1)[0];if(G&&G.object instanceof re){const O=G.object.worldToLocal(G.point.clone());if(x){w.copy(O).sub(v);const B=w.length();if(B>1e-6){h.copy(w).multiplyScalar(1/B);const Y=Math.max((S-b)/1e3,1/240),K=B/Y;D=Math.min(le,Math.max(D,1+K*Ge))}}else D=1;v.copy(O),b=S,x=!0,d.copy(O),f=!0,E||(E=!0,c.copy(O),m.set(0,0,0),y.copy(O),A.set(0,0,0))}else f&&(D=0,x=!1,b=0,f=!1)},H=T=>{if(C)return M=!1,{keepRunning:!1,needsRender:!1};_();const G=W?Math.min((T-W)/1e3,.05):1/60;W=T,f&&D>1&&(D=1+(D-1)*Math.exp(-7*G));const O=D>=R;[R,P]=V(R,P,D,O?Fe:ze,O?Pe:Ne,G),R=Math.min(Math.max(R,-.12),le);for(const F of["x","y","z"])[c[F],m[F]]=V(c[F],m[F],d[F],We,Oe,G),[p[F],u[F]]=V(p[F],u[F],h[F],qe,Be,G),[y[F],A[F]]=V(y[F],A[F],d[F],_e,He,G);const B=Math.abs(D-R)<.0015&&Math.abs(P)<.0015,Y=m.lengthSq()<1e-9&&c.distanceToSquared(d)<1e-11,K=u.lengthSq()<1e-9&&p.distanceToSquared(h)<1e-9,pe=A.lengthSq()<1e-9&&y.distanceToSquared(d)<1e-11;B&&(R=D,P=0);const ie=B&&Y&&K&&pe;return N(),M=!ie,{keepRunning:!ie,needsRender:!0}},X=()=>{M||C||document.hidden||!L||(M=!0,W=0,n.request(H))},oe=T=>{!(T instanceof PointerEvent)||document.hidden||!L||(k=T.clientX,z=T.clientY,S=T.timeStamp,I=!0,X())},ae=()=>{I=!1,D=0,x=!1,b=0,h.set(0,0,0),f=!1,X()},q=typeof IntersectionObserver=="function"?new IntersectionObserver(([T])=>{L=!!(T!=null&&T.isIntersecting),L||(I=!1,D=0,R=0,P=0,M=!1,n.cancel(H),N())},{threshold:.01}):null;q==null||q.observe(a);const se=()=>{document.hidden?(M=!1,n.cancel(H)):X()};return t.addEventListener("pointermove",oe,{passive:!0}),t.addEventListener("pointerleave",ae,{passive:!0}),document.addEventListener("visibilitychange",se),{dispose:()=>{C=!0,t.removeEventListener("pointermove",oe),t.removeEventListener("pointerleave",ae),document.removeEventListener("visibilitychange",se),q==null||q.disconnect(),M=!1,n.cancel(H)}}}const ne=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,Ve=`// Strand fragment shader.
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
`,Ue=`// Strand vertex shader — real, individually-placed hair geometry.
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
    float clumpSize = 0.014;
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
    float clumpStrength = mix(0.06, 0.16, hash1(clumpId + 19.3));

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
        vec3 rippleOffset = aRoot - uRipplePoint;
        float cursorDistanceSq = dot(cursorOffset, cursorOffset);
        float rippleRadius = uCursorRadius * 2.1;
        float rippleDistanceSq = dot(rippleOffset, rippleOffset);

        if (
            cursorDistanceSq < uCursorRadius * uCursorRadius ||
            rippleDistanceSq < rippleRadius * rippleRadius
        ) {
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

            vec3 rippleAway = rippleOffset - n * dot(rippleOffset, n);
            float rippleDistance = length(rippleAway);
            vec3 rippleAwayDir = rippleDistance > 1e-5
                ? rippleAway / rippleDistance
                : awayDir;
            float rippleFalloff = smoothstep(
                rippleRadius,
                0.0,
                sqrt(rippleDistanceSq)
            );
            float rippleAmount = pow(rippleFalloff, 2.0) * uCursorStrength * 0.32;
            bentGrowDir = normalize(bentGrowDir + rippleAwayDir * rippleAmount);
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
`;function Xe(i){var a,o;const e={uStrandLength:{value:i.strandLength},uStrandWidth:{value:i.strandWidth},uRootColor:{value:new $((a=i.rootColor)!=null?a:"#1eb6f7")},uTipColor:{value:new $((o=i.tipColor)!=null?o:"#6fd4fb")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uGravity:{value:new g(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new g(1e6,1e6,1e6)},uCursorDir:{value:new g(0,0,0)},uCursorRadius:{value:.052},uCursorStrength:{value:0},uRipplePoint:{value:new g(1e6,1e6,1e6)}};return new ue({glslVersion:fe,uniforms:e,vertexShader:ne+`
`+Ue,fragmentShader:ne+`
`+Ve,transparent:!1,depthWrite:!0,depthTest:!0,side:ye})}const Q=5;function Ye(){const i=Q+1,e=new Float32Array(i*2*3),t=[];for(let o=0;o<i;o+=1){const l=o/Q;for(const n of[-1,1]){const r=o*2+(n===-1?0:1);e[r*3]=n,e[r*3+1]=l,e[r*3+2]=0}}for(let o=0;o<Q;o+=1){const l=o*2,n=l+1,r=l+2,s=l+3;t.push(l,n,s,l,s,r)}const a=new me;return a.setAttribute("position",new ee(e,3)),a.setIndex(t),{geometry:a}}function Ke(i){let e=i;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Je(i,e){const t=i.getAttribute("position"),a=i.getAttribute("normal"),o=i.getIndex();if(!o)throw new Error("sampleRoots requires an indexed geometry");const l=o.count/3,n=new Float64Array(l),r=new g,s=new g,d=new g,h=new g,v=new g;let w=0;for(let u=0;u<l;u+=1){r.fromBufferAttribute(t,o.getX(u*3)),s.fromBufferAttribute(t,o.getX(u*3+1)),d.fromBufferAttribute(t,o.getX(u*3+2));const y=h.subVectors(s,r).cross(v.subVectors(d,r)).length()*.5;w+=y,n[u]=w}const x=Ke(1592598103),b=new Float32Array(e*3),f=new Float32Array(e*3),E=new Float32Array(e),c=new g,m=new g,p=new g;for(let u=0;u<e;u+=1){const y=x()*w;let A=0,D=l-1;for(;A<D;){const _=A+D>>>1;n[_]<y?A=_+1:D=_}const R=A;r.fromBufferAttribute(t,o.getX(R*3)),s.fromBufferAttribute(t,o.getX(R*3+1)),d.fromBufferAttribute(t,o.getX(R*3+2)),c.fromBufferAttribute(a,o.getX(R*3)),m.fromBufferAttribute(a,o.getX(R*3+1)),p.fromBufferAttribute(a,o.getX(R*3+2));const P=x(),W=x(),C=Math.sqrt(P),L=1-C,M=W*C,k=1-L-M;b[u*3]=r.x*L+s.x*M+d.x*k,b[u*3+1]=r.y*L+s.y*M+d.y*k,b[u*3+2]=r.z*L+s.z*M+d.z*k;const z=c.x*L+m.x*M+p.x*k,S=c.y*L+m.y*M+p.y*k,I=c.z*L+m.z*M+p.z*k,N=Math.hypot(z,S,I)||1;f[u*3]=z/N,f[u*3+1]=S/N,f[u*3+2]=I/N,E[u]=x()*1e3}return{roots:b,normals:f,seeds:E}}function Qe(i){const e=i.getAttribute("position"),t=i.getIndex();if(!t)return 0;const a=t.count/3,o=new g,l=new g,n=new g,r=new g,s=new g;let d=0;for(let h=0;h<a;h+=1)o.fromBufferAttribute(e,t.getX(h*3)),l.fromBufferAttribute(e,t.getX(h*3+1)),n.fromBufferAttribute(e,t.getX(h*3+2)),d+=r.subVectors(l,o).cross(s.subVectors(n,o)).length()*.5;return d}function Ze(i,e){const t=Qe(i);return Math.round(t*e)}function $e(i,e){const t=Ze(i,e.density),{roots:a,normals:o,seeds:l}=Je(i,t),{geometry:n}=Ye();n.setAttribute("aRoot",new J(a,3)),n.setAttribute("aNormal",new J(o,3)),n.setAttribute("aSeed",new J(l,1));const r=Xe({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth}),s=new Se(n,r,t);return s.frustumCulled=!1,{mesh:s,material:r}}const et=`// Support (base mesh) fragment shader.
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
`,tt=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function nt(i={}){var a;const e={uRootColor:{value:new $((a=i.rootColor)!=null?a:"#1eb6f7")},uLightDir:{value:new g(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new ue({glslVersion:fe,uniforms:e,vertexShader:tt,fragmentShader:ne+`
`+et})}function rt(i){if(i.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:t,frameLoop:a}=i,o=performance.now();let l=!1,n=!1,r=0;const s=1e3/i.idleFps,d=()=>l&&!document.hidden&&!n,h=f=>n?{keepRunning:!1,needsRender:!1}:f-r<s?{keepRunning:d(),needsRender:!1}:(r=f,t((f-o)/1e3),{keepRunning:d(),needsRender:!0}),v=()=>{d()&&a.request(h)},w=()=>{a.cancel(h)},x=new IntersectionObserver(f=>{l=f.some(E=>E.isIntersecting),d()?v():w()},{threshold:.01});x.observe(e);const b=()=>{d()?v():w()};return document.addEventListener("visibilitychange",b),{dispose:()=>{n=!0,w(),x.disconnect(),document.removeEventListener("visibilitychange",b)}}}function ot(i,e){for(let o=3;o<=Math.min(256,Math.floor(e/8));o+=1){if(e%o!==0)continue;let l=0,n=0;for(let r=0;r<e-o;r+=7)Math.abs(i(r)-i(r+o))<=1e-6&&(l+=1),n+=1;if(n>0&&l/n>=.75)return o}return null}function at(i,e,t){let a=i;for(let o=0;o<e;o+=1){const l=a.map(n=>n.clone());for(let n=0;n<a.length;n+=1){if(!t&&(n===0||n===a.length-1))continue;const r=a[(n-1+a.length)%a.length],s=a[n],d=a[(n+1)%a.length];l[n].copy(r).add(s.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}a=l}return a}function st(i){var r;const e=[];for(let s=0;s<i.length-1;s+=1)e.push(i[s].distanceTo(i[s+1]));const t=[...e].sort((s,d)=>s-d),a=(r=t[t.length>>1])!=null?r:1,o=[];let l=0;const n=(s,d)=>{if(d-s<2)return;const h=i.slice(s,d+1),v=h[0].distanceTo(h[h.length-1])<a*2;v&&h.pop(),o.push({points:h,closed:v})};for(let s=0;s<e.length;s+=1)e[s]>a*6&&(n(l,s),l=s+1);return n(l,i.length-1),o}function it(i,e,t,a,o,l){const n=i.points,r=n.length;if(r<2)return;const s=[];for(let c=0;c<r;c+=1){const m=n[(c-1+r)%r],p=n[(c+1)%r];let u;i.closed?u=p.clone().sub(m):c===0?u=n[1].clone().sub(n[0]):c===r-1?u=n[r-1].clone().sub(n[r-2]):u=p.clone().sub(m),u.lengthSq()<1e-20&&u.set(0,0,1),s.push(u.normalize())}const d=s[0];let h=new g(0,1,0);Math.abs(d.dot(h))>.9&&h.set(1,0,0),h=h.sub(d.clone().multiplyScalar(h.dot(d))).normalize();const v=[h];for(let c=1;c<r;c+=1){const m=s[c-1],p=s[c],u=v[c-1].clone(),y=m.clone().cross(p);if(y.lengthSq()>1e-20){y.normalize();const A=Math.acos(Math.min(1,Math.max(-1,m.dot(p))));u.applyAxisAngle(y,A)}u.sub(p.clone().multiplyScalar(u.dot(p))),v.push(u.normalize())}const w=o.length/3,x=[],b=(c,m,p,u)=>{const y=m.clone().cross(p).normalize();for(let A=0;A<t;A+=1){const D=A/t*Math.PI*2,R=Math.cos(D)*u,P=Math.sin(D)*u;o.push(c.x+p.x*R+y.x*P,c.y+p.y*R+y.y*P,c.z+p.z*R+y.z*P)}x.push(1)};if(!i.closed)for(let c=a;c>=1;c-=1){const m=c/a*(Math.PI/2);b(n[0].clone().add(s[0].clone().multiplyScalar(-Math.sin(m)*e)),s[0],v[0],Math.cos(m)*e)}for(let c=0;c<r;c+=1)b(n[c],s[c],v[c],e);if(!i.closed)for(let c=1;c<=a;c+=1){const m=c/a*(Math.PI/2);b(n[r-1].clone().add(s[r-1].clone().multiplyScalar(Math.sin(m)*e)),s[r-1],v[r-1],Math.cos(m)*e)}const f=x.length,E=i.closed?f:f-1;for(let c=0;c<E;c+=1){const m=w+c*t,p=w+(c+1)%f*t;for(let u=0;u<t;u+=1){const y=(u+1)%t;l.push(m+u,p+y,p+u),l.push(m+u,m+y,p+y)}}}function lt(i,e={}){var w,x,b;const t=(w=e.radius)!=null?w:.007,a=(x=e.radialSegments)!=null?x:24,o=(b=e.capSegments)!=null?b:4,l=i.getAttribute("position");if(!l)return null;const n=ot(f=>l.getY(f),l.count);if(!n)return null;const r=l.count/n,s=[];for(let f=0;f<r;f+=1){const E=new g;for(let c=0;c<n;c+=1){const m=f*n+c;E.x+=l.getX(m),E.y+=l.getY(m),E.z+=l.getZ(m)}s.push(E.divideScalar(n))}const d=[],h=[];for(const f of st(s))it({...f,points:at(f.points,2,f.closed)},t,a,o,d,h);if(h.length===0)return null;const v=new me;return v.setAttribute("position",new ee(new Float32Array(d),3)),v.setIndex(new ee(new Uint32Array(h),1)),v.computeVertexNormals(),v.normalizeNormals(),v}const ct=.0085,dt=1e-5;function ht(i){const e=lt(i,{radius:ct,radialSegments:20,capSegments:5});if(e)return e;let t=i.clone();return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=xe(t,dt),t.computeVertexNormals(),t.normalizeNormals(),t}const ut=.0078,ft=9e-4;function mt(i,e){var v;const t=ht(i),a=nt({rootColor:e.rootColor}),o=new re(t,a);o.castShadow=!0;const{mesh:l,material:n}=$e(t,{density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:ut,strandWidth:ft});e.lightDir&&(n.uniforms.uLightDir.value.copy(e.lightDir),a.uniforms.uLightDir.value.copy(e.lightDir));const r=new te;r.add(o,l);const s=je({camera:e.camera,domElement:(v=e.pointerTarget)!=null?v:window,viewportElement:e.viewportElement,raycastTargets:[o],materials:[n],frameLoop:e.frameLoop}),d=rt({viewportElement:e.viewportElement,setTime:w=>{n.uniforms.uTime.value=w},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps});return{group:r,baseMesh:o,strandMesh:l,materials:{strand:n,support:a},dispose:()=>{d.dispose(),s.dispose(),t.dispose(),l.geometry.dispose(),a.dispose(),n.dispose(),l.dispose()}}}function pt(i){const e=new Set;let t=0,a=!1,o=!1;const l=n=>{if(o){a=!1;return}let r=!1;for(const s of Array.from(e)){const d=s(n),h=typeof d=="boolean"?d:d.keepRunning;r||(r=typeof d=="boolean"?!0:d.needsRender),h||e.delete(s)}r&&i(),e.size>0?t=requestAnimationFrame(l):a=!1};return{request:n=>{e.add(n),!a&&!o&&(a=!0,t=requestAnimationFrame(l))},cancel:n=>{e.delete(n)},dispose:()=>{o=!0,e.clear(),cancelAnimationFrame(t),a=!1}}}const U={high:{name:"high",density:46e5,maxDpr:2,idleFps:30},balanced:{name:"balanced",density:46e5,maxDpr:2,idleFps:30},mobile:{name:"mobile",density:19e5,maxDpr:1.25,idleFps:20}};function ce(i,e){if(typeof window<"u"){const t=new URLSearchParams(window.location.search).get("furQuality");if(t&&t in U)return U[t]}return i<=640||e?U.mobile:U.balanced}const gt="_root_1xfol_10",vt={root:gt},Z={desktop:{width:.9,offsetY:.19,maxHeight:.54},tablet:{width:.88,offsetY:.18,maxHeight:.54},mobile:{width:.9,offsetY:.12,maxHeight:.46}},wt=.8,de=20,he=6.5,bt=Math.PI/2,yt="#159fdf";function At({className:i,onReady:e}){const t=j.useRef(null),a=j.useRef(e);a.current=e;const o=ge(),l=j.useRef(o);return l.current=o,j.useEffect(()=>{const n=t.current;if(!n)return;const r=new Ae,s=new De(de,1,.1,100);s.position.set(0,0,he);const d=new Re({antialias:!0,alpha:!0,powerPreference:"high-performance"});d.setClearAlpha(0),d.shadowMap.enabled=!0,d.shadowMap.type=Me,d.shadowMap.autoUpdate=!1,n.appendChild(d.domElement),r.add(new Te(14674678,1.5));const h=new Ce(16777215,1.4);h.position.set(-1.1,2,3.4),h.castShadow=!0,h.shadow.mapSize.set(2048,2048),h.shadow.bias=-8e-4,h.shadow.normalBias=.015,h.shadow.camera.left=-2,h.shadow.camera.right=2,h.shadow.camera.top=2,h.shadow.camera.bottom=-2,h.shadow.camera.near=.5,h.shadow.camera.far=12,h.shadow.radius=2.6,r.add(h);const v=h.position.clone().normalize(),w=new re(new Le(24,24),new Ee({opacity:.07}));w.position.z=-.24,w.receiveShadow=!0,r.add(w);const x=new te,b=new te;b.rotation.x=bt,x.add(b),r.add(x);const f=new g;let E=!1,c=!1,m=0;const p=[],u=()=>{c||d.render(r,s)},y=pt(u),A=()=>{const C=n.clientWidth,L=n.clientHeight;if(C===0||L===0)return;m=C;const M=C/L;s.aspect=M,s.updateProjectionMatrix();const k=ce(C,l.current);if(d.setPixelRatio(Math.min(window.devicePixelRatio,k.maxDpr)),d.setSize(C,L,!1),!E)return;const z=M<.85?Z.mobile:M<1.4?Z.tablet:Z.desktop,S=2*Math.tan(de*Math.PI/360)*he,I=S*M;let N=z.width*I/f.x;N=Math.min(N,z.maxHeight*S/f.y),N*=wt,x.scale.setScalar(N),x.position.set(0,z.offsetY*S,0),d.shadowMap.needsUpdate=!0,u()};let D=0,R=0;const P=C=>{if(c)return;const L=ce(m,l.current),M=yt;for(const S of C){if(c)break;const I=mt(S.geometry,{camera:s,viewportElement:d.domElement,pointerTarget:window,quality:L,rootColor:M,lightDir:v,frameLoop:y,reducedMotion:l.current});I.group.position.copy(S.position),I.group.quaternion.copy(S.quaternion),I.group.scale.copy(S.scale),b.add(I.group),p.push(I)}if(c||p.length===0)return;b.updateMatrixWorld(!0);const k=new ke;for(const S of p)k.expandByObject(S.baseMesh);k.getSize(f),b.position.sub(k.getCenter(new g)),E=!0,A();const z={scene:r,strandMaterials:p.map(S=>S.materials.strand),supportMaterials:p.map(S=>S.materials.support),renderer:d,camera:s,requestRender:u};R=requestAnimationFrame(()=>{var S;c||(S=a.current)==null||S.call(a,z)})};Ie().then(C=>{c||(D=requestAnimationFrame(()=>P(C)))},C=>{console.error("[HelloModel] failed to load hello.glb",C)});const W=new ResizeObserver(A);return W.observe(n),window.addEventListener("resize",A,{passive:!0}),window.addEventListener("orientationchange",A,{passive:!0}),A(),()=>{c=!0,cancelAnimationFrame(D),cancelAnimationFrame(R),W.disconnect(),window.removeEventListener("resize",A),window.removeEventListener("orientationchange",A);for(const C of p)C.dispose();w.geometry.dispose(),w.material.dispose(),y.dispose(),d.dispose(),d.domElement.remove()}},[]),ve.jsx("div",{ref:t,className:[vt.root,i].filter(Boolean).join(" "),"aria-hidden":"true"})}export{At as HelloModel,At as default};
