import{c as Pe,s as Oe,r as Gt,a as tt,b as Bt,j as Ot}from"./index-43GGIcJ4.js";import{g as L,V as Be,ac as jt,E as ot,C as je,ad as yt,a8 as Ht,ae as bt,h as Le,I as Et,z as at,B as ye,w as Vt,f as Ut,U as wt,af as Xt,ag as Yt,W as Zt,ah as Kt,ai as Qt,aj as $t,D as Jt,ak as en,al as tn,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as nn,G as rn}from"./three-gltf-DTLQIlxe.js";const on=340,an=28,sn=105,ln=13,cn=.055,St=1.6,dn=2600,un=75,hn=2900,fn=80,mn=600,pn=22;function nt(n,e,o,t,r,l){const s=(o-n)*t;let a=e+s*l;return a*=Math.exp(-r*l),[n+a*l,a]}function gn(n){const{camera:e,domElement:o,touchElement:t,viewportElement:r,raycastTargets:l,materials:s,frameLoop:a}=n,c=new Be(2,2),d=new jt,m=new L(1e6,1e6,1e6),b=new L,A=new L,f=new L;let S=!1,v=0,R=!1,T=!1;const M=new L(1e6,1e6,1e6),u=new L,i=new L,w=new L,g=new L(1e6,1e6,1e6),y=new L;let h=0,x=0,E=0,V=0,j=!1,Z=!0,J=!1,ae=0,_=0,q=0,H=!1,W=null;const Q=()=>{for(const p of s)p.uniforms.uCursorStrength.value=x,p.uniforms.uCursor.value.copy(M),p.uniforms.uCursorDir.value.copy(i),p.uniforms.uRipplePoint.value.copy(g)},ee=()=>{if(!H||l.length===0)return;H=!1;const p=r.getBoundingClientRect();c.set((ae-p.left)/p.width*2-1,-((_-p.top)/p.height)*2+1),d.setFromCamera(c,e);const B=d.intersectObjects(l,!1)[0];if(B&&B.object instanceof ot){const $=B.object.worldToLocal(B.point.clone());if(S){f.copy($).sub(A);const te=f.length();if(te>1e-6){b.copy(f).multiplyScalar(1/te);const fe=Math.max((q-v)/1e3,1/240),me=te/fe;h=Math.min(St,Math.max(h,1+me*cn))}}else h=1;A.copy($),v=q,S=!0,m.copy($),R=!0,T||(T=!0,M.copy($),u.set(0,0,0),g.copy($),y.set(0,0,0))}else R&&(h=0,S=!1,v=0,R=!1)},D=p=>{if(j)return J=!1,{keepRunning:!1,needsRender:!1};ee();const B=V?Math.min((p-V)/1e3,.05):1/60;V=p,R&&h>1&&(h=1+(h-1)*Math.exp(-7*B));const $=h>=x;[x,E]=nt(x,E,h,$?on:sn,$?an:ln,B),x=Math.min(Math.max(x,-.12),St);for(const O of["x","y","z"])[M[O],u[O]]=nt(M[O],u[O],m[O],dn,un,B),[i[O],w[O]]=nt(i[O],w[O],b[O],hn,fn,B),[g[O],y[O]]=nt(g[O],y[O],m[O],mn,pn,B);const te=Math.abs(h-x)<.0015&&Math.abs(E)<.0015,fe=u.lengthSq()<1e-9&&M.distanceToSquared(m)<1e-11,me=w.lengthSq()<1e-9&&i.distanceToSquared(b)<1e-9,De=y.lengthSq()<1e-9&&g.distanceToSquared(m)<1e-11;te&&(x=h,E=0);const Ae=te&&fe&&me&&De;return Q(),J=!Ae,{keepRunning:!Ae,needsRender:!0}},k=()=>{J||j||document.hidden||!Z||(J=!0,V=0,a.request(D))},be=()=>H||R||Math.abs(h-x)>=.0015||Math.abs(E)>=.0015||u.lengthSq()>=1e-9||M.distanceToSquared(m)>=1e-11||w.lengthSq()>=1e-9||i.distanceToSquared(b)>=1e-9||y.lengthSq()>=1e-9||g.distanceToSquared(m)>=1e-11,de=p=>{document.hidden||!Z||(ae=p.clientX,_=p.clientY,q=p.timeStamp,H=!0,k())},se=p=>{p instanceof PointerEvent&&p.pointerType!=="touch"&&de(p)},Ee=p=>{p instanceof PointerEvent&&p.pointerType!=="touch"&&de(p)},ie=()=>{H=!1,h=0,S=!1,v=0,b.set(0,0,0),R=!1,k()},X=p=>{(!(p instanceof PointerEvent)||p.pointerType!=="touch")&&ie()},ue=p=>{(!(p instanceof PointerEvent)||p.pointerType!=="touch")&&ie()},xe=p=>{p.pointerType!=="touch"||W!==null||(W=p.pointerId,t==null||t.setPointerCapture(p.pointerId),p.preventDefault(),de(p))},Se=p=>{p.pointerId===W&&(p.preventDefault(),de(p))},he=p=>{p.pointerId===W&&(W=null,t!=null&&t.hasPointerCapture(p.pointerId)&&t.releasePointerCapture(p.pointerId),ie())},Me=p=>{p.pointerId===W&&(W=null,ie())},ne=typeof IntersectionObserver=="function"?new IntersectionObserver(([p])=>{Z=!!(p!=null&&p.isIntersecting),Z||(Pe(k),H=!1,h=0,x=0,E=0,J=!1,a.cancel(D),Q())},{threshold:.01}):null;ne==null||ne.observe(r);const ge=()=>{document.hidden?(Pe(k),J=!1,a.cancel(D)):be()&&Oe(k)};return o.addEventListener("pointerdown",se,{passive:!0}),o.addEventListener("pointermove",Ee,{passive:!0}),o.addEventListener("pointerleave",X,{passive:!0}),o.addEventListener("pointerup",ue,{passive:!0}),o.addEventListener("pointercancel",ue,{passive:!0}),t==null||t.addEventListener("pointerdown",xe),t==null||t.addEventListener("pointermove",Se),t==null||t.addEventListener("pointerup",he),t==null||t.addEventListener("pointercancel",he),t==null||t.addEventListener("lostpointercapture",Me),document.addEventListener("visibilitychange",ge),{dispose:()=>{j=!0,W!==null&&(t!=null&&t.hasPointerCapture(W))&&t.releasePointerCapture(W),W=null,o.removeEventListener("pointerdown",se),o.removeEventListener("pointermove",Ee),o.removeEventListener("pointerleave",X),o.removeEventListener("pointerup",ue),o.removeEventListener("pointercancel",ue),t==null||t.removeEventListener("pointerdown",xe),t==null||t.removeEventListener("pointermove",Se),t==null||t.removeEventListener("pointerup",he),t==null||t.removeEventListener("pointercancel",he),t==null||t.removeEventListener("lostpointercapture",Me),document.removeEventListener("visibilitychange",ge),ne==null||ne.disconnect(),Pe(k),J=!1,a.cancel(D)}}}const rt=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,vn=`// Strand fragment shader.
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
uniform float uShadeContrast;

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
    // Per-strand brightness variation, attenuated by the responsive quality
    // profile. Full contrast preserves individually readable desktop fibres;
    // mobile blends toward the same 0.88 average so sub-pixel hairs form a
    // soft coat instead of high-frequency blue noise.
    float strandTone = mix(0.58, 1.18, vShade);
    color *= mix(0.88, strandTone, uShadeContrast);

    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vStrandT);

    // A little extra root occlusion reveals the layered pile and prevents a
    // very dense coat from merging into one flat cyan cloud. Tips retain the
    // clean highlight while the overlap beneath them carries visible depth.
    shaded *= mix(0.62, 1.07, smoothstep(0.0, 0.76, vStrandT));

    fragColor = vec4(linearToSRGB(shaded), 1.0);
}
`,wn=`// Strand vertex shader — real, individually-placed hair geometry.
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
// moving as one rigid patch is the static per-instance response, growth and
// curl data precomputed in createStrands.ts. A hundred strands under the same
// brush still start and settle together but visibly disagree in between.

uniform float uStrandLength;
uniform float uStrandWidth;
uniform vec2  uDrawingBufferSize;
uniform float uMinStrandPixels;
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
attribute vec4 aGrowth; // xyz grow direction, w length scale
attribute vec4 aCurl;   // xyz curl direction, w curl amount
attribute vec4 aIdle;   // xyz idle direction, w idle phase
attribute vec4 aParams; // width scale, idle frequency, response exponent/strength
attribute float aShade;

varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vStrandT;
varying float vShade;

void main() {
    float side = position.x;
    float t = position.y;
    vec3 n = normalize(aNormal);
    vec3 growDir = aGrowth.xyz;
    vec3 curlDir = aCurl.xyz;
    float curlAmount = aCurl.w;
    float responseExp = aParams.z;
    float strengthMul = aParams.w;
    float len = uStrandLength * aGrowth.w;

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
            vec3 awayDir = awayLength > 1e-5 ? away / awayLength : aIdle.xyz;
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
            float responseT = (responseExp - 0.55) / (1.9 - 0.55);
            float bendAmount = infl * mix(0.8, 1.25, responseT);
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
    // precomputed direction/phase/frequency so neighbouring strands drift
    // out of sync with each other rather than breathing as one surface.
    float idleAmount = sin(uTime * aParams.y + aIdle.w) * 0.05 * len * t;
    centre += aIdle.xyz * idleAmount;

    // Keep a plush body through the middle of the fibre, then taper all the
    // way to a genuinely fine zero-width tip. The sub-linear profile creates
    // soft overlap without the blunt, flat-card appearance of a wide tip.
    float width = uStrandWidth * aParams.x * pow(1.0 - t, 0.48);

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

    // Keep the authored world-space width whenever it already rasterises
    // cleanly. If projection/model scale would make it sub-pixel, expand only
    // the ribbon width to the profile's physical-pixel floor. The floor tapers
    // to zero with the hair, preserving fine tips and avoiding blunt cards.
    float halfWidth = width * 0.5;
    vec4 clipCentre = projectionMatrix * viewMatrix * vec4(worldCentre, 1.0);
    vec4 clipWidth = projectionMatrix * viewMatrix * vec4(widthAxis * halfWidth, 0.0);
    vec2 halfWidthNdc = clipWidth.xy / max(abs(clipCentre.w), 1e-5);
    float projectedFullWidth = length(
        halfWidthNdc * max(uDrawingBufferSize, vec2(1.0))
    );
    float minFullWidth = uMinStrandPixels * pow(max(1.0 - t, 0.0), 0.62);
    float screenSpaceScale = projectedFullWidth > 1e-5
        ? max(1.0, minFullWidth / projectedFullWidth)
        : 1.0;
    vec3 worldPos = worldCentre
        + widthAxis * (halfWidth * screenSpaceScale * side);

    vStrandT = t;
    vShade = aShade;
    vWorldNormal = worldGrowDir;
    vWorldPos = worldPos;

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}
`;function yn(n){var t,r;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new Be(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new je((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new je((r=n.tipColor)!=null?r:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uGravity:{value:new L(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new L(1e6,1e6,1e6)},uCursorDir:{value:new L(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new L(1e6,1e6,1e6)}};return new yt({glslVersion:bt,uniforms:e,vertexShader:rt+`
`+wn,fragmentShader:rt+`
`+vn,transparent:!1,depthWrite:!0,depthTest:!0,side:Ht})}const ht=5,ke=.01,ft=.02;function bn(){const n=ht+1,e=new Float32Array(n*2*3),o=[];for(let r=0;r<n;r+=1){const l=r/ht;for(const s of[-1,1]){const a=r*2+(s===-1?0:1);e[a*3]=s,e[a*3+1]=l,e[a*3+2]=0}}for(let r=0;r<ht;r+=1){const l=r*2,s=l+1,a=l+2,c=l+3;o.push(l,s,c,l,c,a)}const t=new at;return t.setAttribute("position",new ye(e,3)),t.setIndex(o),{geometry:t}}function xn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let o=Math.imul(e^e>>>15,1|e);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function Mt(n,e){const o=n.shade.length,t=[];for(let l=0;l<o;l+=1)e(l)&&t.push(l);const r=(l,s)=>{const a=new Float32Array(t.length*s);return t.forEach((c,d)=>{const m=c*s,b=d*s;for(let A=0;A<s;A+=1)a[b+A]=l[m+A]}),a};return{roots:r(n.roots,3),normals:r(n.normals,3),growth:r(n.growth,4),curl:r(n.curl,4),idle:r(n.idle,4),params:r(n.params,4),shade:r(n.shade,1)}}const Sn=n=>n-Math.floor(n),Y=n=>Sn(Math.sin(n)*43758.5453123),Mn=(n,e,o)=>{const t=Math.min(1,Math.max(0,(o-n)/(e-n)));return t*t*(3-2*t)};function At(n,e,o){const t=o>=0?1:-1,r=-1/(t+o),l=n*e*r;return[1+t*n*n*r,t*l,-t*n,l,t+e*e*r,-e]}function Dt(n,e){const o=n.getAttribute("position"),t=n.getAttribute("normal"),r=n.getIndex();if(!r)throw new Error("sampleRoots requires an indexed geometry");const l=r.count/3,s=new Float64Array(l),a=new L,c=new L,d=new L,m=new L,b=new L;let A=0;for(let h=0;h<l;h+=1){a.fromBufferAttribute(o,r.getX(h*3)),c.fromBufferAttribute(o,r.getX(h*3+1)),d.fromBufferAttribute(o,r.getX(h*3+2));const x=m.subVectors(c,a).cross(b.subVectors(d,a)).length()*.5;A+=x,s[h]=A}const f=xn(1592598103),S=new Float32Array(e*3),v=new Float32Array(e*3),R=new Float32Array(e*4),T=new Float32Array(e*4),M=new Float32Array(e*4),u=new Float32Array(e*4),i=new Float32Array(e),w=new L,g=new L,y=new L;for(let h=0;h<e;h+=1){const x=f()*A;let E=0,V=l-1;for(;E<V;){const ut=E+V>>>1;s[ut]<x?E=ut+1:V=ut}const j=E;a.fromBufferAttribute(o,r.getX(j*3)),c.fromBufferAttribute(o,r.getX(j*3+1)),d.fromBufferAttribute(o,r.getX(j*3+2)),w.fromBufferAttribute(t,r.getX(j*3)),g.fromBufferAttribute(t,r.getX(j*3+1)),y.fromBufferAttribute(t,r.getX(j*3+2));const Z=f(),J=f(),ae=Math.sqrt(Z),_=1-ae,q=J*ae,H=1-_-q;S[h*3]=a.x*_+c.x*q+d.x*H,S[h*3+1]=a.y*_+c.y*q+d.y*H,S[h*3+2]=a.z*_+c.z*q+d.z*H;const W=w.x*_+g.x*q+y.x*H,Q=w.y*_+g.y*q+y.y*H,ee=w.z*_+g.z*q+y.z*H,D=Math.hypot(W,Q,ee)||1;v[h*3]=W/D,v[h*3+1]=Q/D,v[h*3+2]=ee/D;const k=f()*1e3,be=Y(k*12.9898),de=Y(k*29.7331),se=Y(k*41.311),Ee=Y(k*53.913),ie=Y(k*7.719),X=Y(k*13.377),ue=Y(k*23.371),xe=Y(k*31.951),Se=Y(k*89.317),he=Y(k*101.667),Me=Y(k*113.311),ne=Y(k*127.211),ge=Mn(.92,1,be),p=.64+(1.32-.64)*be+ge*.26,B=(.68+(1.48-.68)*de)*(1.06+(.9-1.06)*ge),$=.04+(.32-.04)*se,te=Ee*Math.PI*2,fe=.08+(.48-.08)*ie,me=X*Math.PI*2,De=.55+(1.9-.55)*ue,Ae=.55+(1.35-.55)*xe,O=he*Math.PI*2,He=.5+(1.1-.5)*Me,C=ne*Math.PI*2,[z,I,N,G,P,F]=At(W/D,Q/D,ee/D),re=Math.cos(me),Ie=Math.sin(me),Fe=re*z+Ie*G,Ve=re*I+Ie*P,oe=re*N+Ie*F,_e=S[h*3],We=S[h*3+1],ze=S[h*3+2],qe=Math.floor(_e/ke),Ue=Math.floor(We/ke),le=Math.floor(ze/ke),ce=qe+Ue*57+le*113,ve=(qe+.5+(Y(ce+11.7)-.5)*.48)*ke,Te=(Ue+.5+(Y(ce+37.1)-.5)*.48)*ke,Xe=(le+.5+(Y(ce+73.9)-.5)*.48)*ke,Ye=ve-_e,Ge=Te-We,Ze=Xe-ze,pe=Ye*(W/D)+Ge*(Q/D)+Ze*(ee/D);let we=Ye-W/D*pe,Ne=Ge-Q/D*pe,Ke=Ze-ee/D*pe;const Qe=Math.hypot(we,Ne,Ke);Qe>1e-5?(we/=Qe,Ne/=Qe,Ke/=Qe):(we=Fe,Ne=Ve,Ke=oe);let $e=W/D+Fe*fe+we*ft,Je=Q/D+Ve*fe+Ne*ft,et=ee/D+oe*fe+Ke*ft;const st=Math.hypot($e,Je,et)||1;$e/=st,Je/=st,et/=st;const[zt,Nt,kt,_t,Wt,qt]=At($e,Je,et),it=Math.cos(te),lt=Math.sin(te),ct=Math.cos(C),dt=Math.sin(C),U=h*4;R[U]=$e,R[U+1]=Je,R[U+2]=et,R[U+3]=p,T[U]=it*zt+lt*_t,T[U+1]=it*Nt+lt*Wt,T[U+2]=it*kt+lt*qt,T[U+3]=$,M[U]=ct*z+dt*G,M[U+1]=ct*I+dt*P,M[U+2]=ct*N+dt*F,M[U+3]=O,u[U]=B,u[U+1]=He,u[U+2]=De,u[U+3]=Ae,i[h]=Se}return{roots:S,normals:v,growth:R,curl:T,idle:M,params:u,shade:i}}function An(n){const e=n.getAttribute("position"),o=n.getIndex();if(!o)return 0;const t=o.count/3,r=new L,l=new L,s=new L,a=new L,c=new L;let d=0;for(let m=0;m<t;m+=1)r.fromBufferAttribute(e,o.getX(m*3)),l.fromBufferAttribute(e,o.getX(m*3+1)),s.fromBufferAttribute(e,o.getX(m*3+2)),d+=a.subVectors(l,r).cross(c.subVectors(s,r)).length()*.5;return d}function It(n,e){const o=An(n);return Math.round(o*e)}function mt(n,e,o){const t=o?o.roots.length/3:It(n,e.density),{roots:r,normals:l,growth:s,curl:a,idle:c,params:d,shade:m}=o!=null?o:Dt(n,t),{geometry:b}=bn();b.setAttribute("aRoot",new Le(r,3)),b.setAttribute("aNormal",new Le(l,3)),b.setAttribute("aGrowth",new Le(s,4)),b.setAttribute("aCurl",new Le(a,4)),b.setAttribute("aIdle",new Le(c,4)),b.setAttribute("aParams",new Le(d,4)),b.setAttribute("aShade",new Le(m,1));const A=yn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),f=new Et(b,A,t);return f.frustumCulled=!1,{mesh:f,material:A}}const Tn=`precision highp float;
layout(location = 0) out vec4 fragColor;

uniform vec3 uRootColor;
uniform vec3 uTipColor;
uniform vec3 uLightDir;

varying vec3 vRoot;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying float vShellT;

void main() {
    // Stable object-space blue noise controls only the outer half of the
    // foundation. Inner shells remain continuous and hide the support mesh;
    // progressively sparse outer shells break up the contour without alpha
    // blending or high-frequency brightness noise.
    vec3 cell = floor(vRoot * 620.0);
    float lengthNoise = hash1(dot(cell, vec3(12.9898, 78.233, 37.719)));
    float localLength = mix(0.52, 1.0, lengthNoise);

    if (vShellT > localLength) {
        discard;
    }

    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 color = mix(uRootColor, uTipColor, vShellT * vShellT * 0.28);
    vec3 shaded = shadeFibre(color, n, normalize(uLightDir), viewDir, vShellT * 0.45);

    // Match the depth cue used by the real strand pass. Without root
    // occlusion the opaque mobile foundation sits over the support and reads
    // as one flat, bright cyan surface, erasing the darker pile beneath it.
    // Keep the outer shell slightly below full brightness so real hair tips
    // remain the visible highlight rather than the foundation itself.
    shaded *= mix(0.66, 0.98, smoothstep(0.0, 0.82, vShellT));

    fragColor = vec4(linearToSRGB(shaded), 1.0);
}
`,Ln=`uniform float uShellCount;
uniform float uShellLength;

varying vec3 vRoot;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying float vShellT;

void main() {
    float t = (float(gl_InstanceID) + 1.0) / max(uShellCount, 1.0);
    vec3 n = normalize(normal);
    vec3 shellPosition = position + n * (uShellLength * t);

    vRoot = position;
    vShellT = t;
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vWorldPos = (modelMatrix * vec4(shellPosition, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(shellPosition, 1.0);
}
`;function Cn(n,e){var s,a;const o={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new je((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new je((a=e.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new yt({glslVersion:bt,uniforms:o,vertexShader:Ln,fragmentShader:rt+`
`+Tn,side:Vt,transparent:!1,depthTest:!0,depthWrite:!0}),r=new Et(n,t,e.count),l=new Ut;for(let c=0;c<e.count;c+=1)r.setMatrixAt(c,l);return r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,{mesh:r,material:t}}const Rn=`// Support (base mesh) fragment shader.
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
`,Pn=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function En(n={}){var t;const e={uRootColor:{value:new je((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new yt({glslVersion:bt,uniforms:e,vertexShader:Pn,fragmentShader:rt+`
`+Rn})}function Dn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:o,frameLoop:t}=n;let r=!1,l=!1,s=0,a=0,c=0;const d=()=>r&&!document.hidden&&!l,m=v=>{if(l)return{keepRunning:!1,needsRender:!1};const T=1e3/Gt(n.idleFps,v);if(v-s<T)return{keepRunning:d(),needsRender:!1};const M=a?Math.min((v-a)/1e3,.05):0;return a=v,s=v,c+=M,o(c),{keepRunning:d(),needsRender:!0}},b=()=>{d()&&(a=0,s=0,t.request(m))},A=()=>{Pe(b),t.cancel(m)},f=new IntersectionObserver(v=>{r=v.some(R=>R.isIntersecting),d()?Oe(b):A()},{threshold:.01});f.observe(e);const S=()=>{d()?Oe(b):A()};return document.addEventListener("visibilitychange",S),{dispose:()=>{l=!0,A(),f.disconnect(),document.removeEventListener("visibilitychange",S)}}}function In(n,e){for(let r=3;r<=Math.min(256,Math.floor(e/8));r+=1){if(e%r!==0)continue;let l=0,s=0;for(let a=0;a<e-r;a+=7)Math.abs(n(a)-n(a+r))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return r}return null}function Fn(n,e,o){let t=n;for(let r=0;r<e;r+=1){const l=t.map(s=>s.clone());for(let s=0;s<t.length;s+=1){if(!o&&(s===0||s===t.length-1))continue;const a=t[(s-1+t.length)%t.length],c=t[s],d=t[(s+1)%t.length];l[s].copy(a).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=l}return t}function zn(n){var a;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const o=[...e].sort((c,d)=>c-d),t=(a=o[o.length>>1])!=null?a:1,r=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const m=n.slice(c,d+1),b=m[0].distanceTo(m[m.length-1])<t*2;b&&m.pop(),r.push({points:m,closed:b})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(s(l,c),l=c+1);return s(l,n.length-1),r}function Nn(n,e,o,t,r,l,s){const a=n.points,c=a.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const w=a[(i-1+c)%c],g=a[(i+1)%c];let y;n.closed?y=g.clone().sub(w):i===0?y=a[1].clone().sub(a[0]):i===c-1?y=a[c-1].clone().sub(a[c-2]):y=g.clone().sub(w),y.lengthSq()<1e-20&&y.set(0,0,1),d.push(y.normalize())}const m=d[0];let b=new L(0,1,0);Math.abs(m.dot(b))>.9&&b.set(1,0,0),b=b.sub(m.clone().multiplyScalar(b.dot(m))).normalize();const A=[b];for(let i=1;i<c;i+=1){const w=d[i-1],g=d[i],y=A[i-1].clone(),h=w.clone().cross(g);if(h.lengthSq()>1e-20){h.normalize();const x=Math.acos(Math.min(1,Math.max(-1,w.dot(g))));y.applyAxisAngle(h,x)}y.sub(g.clone().multiplyScalar(y.dot(g))),A.push(y.normalize())}const f=[],S=(i,w,g,y)=>{const h=w.clone().cross(g).normalize(),x=l.length/3;for(let E=0;E<o;E+=1){const V=E/o*Math.PI*2,j=Math.cos(V)*y,Z=Math.sin(V)*y;l.push(i.x+g.x*j+h.x*Z,i.y+g.y*j+h.y*Z,i.z+g.z*j+h.z*Z)}f.push(x)},v=i=>{const w=l.length/3;return l.push(i.x,i.y,i.z),w};let R=null,T=null;if(!n.closed){R=v(a[0].clone().add(d[0].clone().multiplyScalar(-e*r)));for(let i=t-1;i>=1;i-=1){const w=i/t*(Math.PI/2);S(a[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(w)*e*r)),d[0],A[0],Math.cos(w)*e)}}for(let i=0;i<c;i+=1)S(a[i],d[i],A[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const w=i/t*(Math.PI/2);S(a[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(w)*e*r)),d[c-1],A[c-1],Math.cos(w)*e)}T=v(a[c-1].clone().add(d[c-1].clone().multiplyScalar(e*r)))}const M=f.length,u=n.closed?M:M-1;for(let i=0;i<u;i+=1){const w=f[i],g=f[(i+1)%M];for(let y=0;y<o;y+=1){const h=(y+1)%o;s.push(w+y,g+h,g+y),s.push(w+y,w+h,g+h)}}if(!n.closed&&R!==null&&T!==null){const i=f[0],w=f[M-1];for(let g=0;g<o;g+=1){const y=(g+1)%o;s.push(R,i+y,i+g),s.push(w+g,w+y,T)}}}function kn(n,e={}){var f,S,v,R;const o=(f=e.radius)!=null?f:.007,t=(S=e.radialSegments)!=null?S:24,r=(v=e.capSegments)!=null?v:4,l=(R=e.capLengthScale)!=null?R:1,s=n.getAttribute("position");if(!s)return null;const a=In(T=>s.getY(T),s.count);if(!a)return null;const c=s.count/a,d=[];for(let T=0;T<c;T+=1){const M=new L;for(let u=0;u<a;u+=1){const i=T*a+u;M.x+=s.getX(i),M.y+=s.getY(i),M.z+=s.getZ(i)}d.push(M.divideScalar(a))}const m=[],b=[];for(const T of zn(d))Nn({...T,points:Fn(T.points,2,T.closed)},o,t,r,l,m,b);if(b.length===0)return null;const A=new at;return A.setAttribute("position",new ye(new Float32Array(m),3)),A.setIndex(new ye(new Uint32Array(b),1)),A.computeVertexNormals(),A.normalizeNormals(),A}const _n=.0085,Wn=1e-5,K=12,Tt=4,qn=1.5,Lt=1.15;function Gn(n){const e=n.getAttribute("position");if(!e||e.count<K*2)return n;const o=Math.floor(e.count/K),t=[];for(let u=0;u<o;u+=1){const i=new L,w=u*K;for(let g=0;g<K;g+=1)i.add(new L(e.getX(w+g),e.getY(w+g),e.getZ(w+g)));t.push(i.multiplyScalar(1/K))}const r=t.findIndex((u,i)=>{const w=t[i+1];return u.x>.06&&u.x<.07&&u.z>-.085&&u.z<-.075&&i>0&&w!==void 0&&u.distanceTo(w)>.02});if(r<1)return n;const l=t[r],s=l.clone().sub(t[r-1]).normalize(),a=r*K,c=Array.from({length:K},(u,i)=>new L(e.getX(a+i),e.getY(a+i),e.getZ(a+i))),d=c.reduce((u,i)=>u+i.distanceTo(l),0)/K;if(!Number.isFinite(d)||d<=0)return n;const m=Array.from(e.array),b=n.getIndex(),A=b?Array.from(b.array):Array.from({length:e.count},(u,i)=>i),f=d*qn,S=l.clone().addScaledVector(s,f);let v=m.length/3;for(const u of c){const i=S.clone().add(u.clone().sub(l));m.push(i.x,i.y,i.z)}for(let u=0;u<K;u+=1){const i=(u+1)%K;A.push(a+u,v+i,v+u,a+u,a+i,v+i)}for(let u=1;u<Tt;u+=1){const i=u/Tt*(Math.PI/2),w=Math.cos(i),g=Math.sin(i)*d*Lt,y=m.length/3;for(const h of c){const x=h.clone().sub(l).multiplyScalar(w),E=S.clone().add(x).addScaledVector(s,g);m.push(E.x,E.y,E.z)}for(let h=0;h<K;h+=1){const x=(h+1)%K;A.push(v+h,y+x,y+h,v+h,v+x,y+x)}v=y}const R=m.length/3,T=S.clone().addScaledVector(s,d*Lt);m.push(T.x,T.y,T.z);for(let u=0;u<K;u+=1){const i=(u+1)%K;A.push(v+u,v+i,R)}const M=new at;return M.setAttribute("position",new ye(new Float32Array(m),3)),M.setIndex(new ye(new Uint32Array(A),1)),M}function Bn(n,e=_n){const o=kn(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(o)return o;let t=Gn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=nn(t,Wn),t.computeVertexNormals(),t.normalizeNormals(),t}const On=.0078,jn=9e-4;function Hn(n,e){var M,u,i,w,g,y,h;const o=(u=(M=e.prepared)==null?void 0:M.geometry)!=null?u:Bn(n,e.quality.strokeRadius),t=En({rootColor:e.rootColor}),r=new ot(o,t);r.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:On,strandWidth:(w=e.quality.strandWidth)!=null?w:jn,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(y=(g=e.prepared)==null?void 0:g.strands)!=null?y:Dt(o,It(o,e.quality.density)),a=e.quality.shellCount>0,c=a?[mt(o,l,Mt(s,x=>s.shade[x]<e.quality.detailStrandFraction)),mt(o,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},Mt(s,x=>{const E=s.shade[x],V=Math.abs(s.normals[x*3+1]);return E>=e.quality.detailStrandFraction&&E<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&V<e.quality.silhouetteNormalThreshold}))]:[mt(o,l,s)],d=c.map(x=>x.mesh),m=c.map(x=>x.material),b=d[0],A=m[0],f=a?Cn(o,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const x of m)x.uniforms.uLightDir.value.copy(e.lightDir);f==null||f.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const S=new wt;S.add(r),f&&S.add(f.mesh),S.add(...d);const v=gn({camera:e.camera,domElement:(h=e.pointerTarget)!=null?h:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[r],materials:m,frameLoop:e.frameLoop}),R=Dn({viewportElement:e.viewportElement,setTime:x=>{for(const E of m)E.uniforms.uTime.value=x},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),T=()=>{R.dispose(),v.dispose(),o.dispose();for(const x of d)x.geometry.dispose();t.dispose();for(const x of m)x.dispose();f==null||f.material.dispose();for(const x of d)x.dispose();f==null||f.mesh.dispose()};return{group:S,baseMesh:r,strandMesh:b,strandMeshes:d,materials:{strand:A,strands:m,support:t,shell:f==null?void 0:f.material},dispose:T}}function Vn(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let o=1,t=!1,r=!1;const l=s=>{for(const a of e.values())a.reject(s);e.clear()};return n.onmessage=s=>{const a=s.data,c=e.get(a.id);if(c){if(e.delete(a.id),!a.ok){c.reject(new Error(a.message));return}c.resolve(a.meshes.map(Un))}},n.onerror=()=>{r=!0,l(new Error("fur generation worker failed"))},{generate:(s,a,c)=>{if(t||r)return Promise.reject(new Error("fur generation worker is disposed"));const d=o++,m=[],b=s.map(S=>{var u;const v=S.geometry.getAttribute("position"),R=new Float32Array(v.array),T=(u=S.geometry.getIndex())==null?void 0:u.array,M=T instanceof Uint16Array?new Uint16Array(T):T instanceof Uint32Array?new Uint32Array(T):Uint32Array.from({length:v.count},(i,w)=>w);return m.push(R.buffer,M.buffer),{position:R,index:M}}),A={id:d,density:a,strokeRadius:c,geometries:b},f=new Promise((S,v)=>{e.set(d,{resolve:S,reject:v})});return n.postMessage(A,m),f},dispose:()=>{t||(t=!0,n.terminate(),l(new Error("fur generation worker disposed")))}}}function Un(n){const e=new at;return e.setAttribute("position",new ye(n.geometry.position,3)),e.setAttribute("normal",new ye(n.geometry.normal,3)),e.setIndex(new ye(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Xn(n){const e=new Set;let o=0,t=!1,r=!1;const l=s=>{if(r){t=!1;return}let a=!1;for(const c of Array.from(e)){const d=c(s),m=typeof d=="boolean"?d:d.keepRunning;a||(a=typeof d=="boolean"?!0:d.needsRender),m||e.delete(c)}a&&n(),e.size>0?o=requestAnimationFrame(l):t=!1};return{request:s=>{e.add(s),!t&&!r&&(t=!0,o=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{r=!0,e.clear(),cancelAnimationFrame(o),t=!1}}}const Ft=640,Yn=[2,1.875,1.75,1.5,1.25,1],Ce={high:{name:"high",density:46e5,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:3e6,maxDpr:1.5,maxPhysicalPixels:25e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,maxDpr:1.5,maxPhysicalPixels:175e4,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Zn(n,e,o,t){const r=Math.max(1,n)*Math.max(1,e),l=Math.min(o,t.maxDpr);for(const s of Yn)if(s<=l&&r*s*s<=t.maxPhysicalPixels)return s;return Math.min(l,1)}function pt(n,e){if(typeof window<"u"){const o=new URLSearchParams(window.location.search).get("furQuality");if(o&&o in Ce)return Ce[o]}return e||n<=360?Ce["mobile-low"]:n<=Ft?Ce.mobile:n<=900?Ce.tablet:n<1280?Ce.balanced:Ce.high}const Kn="/models/hello.glb";let gt=null;function Qn(){return gt||(gt=new Promise((n,e)=>{const o=new Xt;o.onError=t=>{e(new Error(`failed to load ${t}`))},new rn(o).load(Kn,t=>{const r=[];if(t.scene.traverse(l=>{l instanceof ot&&r.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),r.length===0){e(new Error("no mesh found in hello.glb"));return}n(r)},void 0,e)})),gt}const $n="_root_1scrz_10",Jn="_interactionSurface_1scrz_42",Ct={root:$n,interactionSurface:Jn},vt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},er=["swiftshader","llvmpipe","softpipe","software","basic render","microsoft basic","mesa offscreen"];function tr(n){const e=n.getExtension("WEBGL_debug_renderer_info"),o=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER);if(typeof o!="string")return!1;const t=o.toLowerCase();return er.some(r=>t.includes(r))}const Rt=20,Pt=6.5,Re=1e-7,nr=Math.PI/2,rr="#159fdf";function ir({className:n,debug:e=!1,onWordVisibleChange:o}){const t=tt.useRef(null),r=tt.useRef(o);r.current=o;const l=Bt(),s=tt.useRef(l);return s.current=l,e||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),tt.useEffect(()=>{var De,Ae,O,He;const a=t.current;if(!a)return;const c=new Yt,d=new Zt(Rt,1,.1,100);d.position.set(0,0,Pt);const m=document.createElement("canvas"),b=(De=m.getContext("webgl2"))!=null?De:m.getContext("webgl");if(!b||tr(b)){a.dataset.webglUnavailable="true";return}const A=window.innerWidth<=Ft;let f;try{f=new Kt({antialias:!A,alpha:!0,powerPreference:"high-performance"})}catch{a.dataset.webglUnavailable="true";return}f.setClearAlpha(0),f.shadowMap.enabled=!0,f.shadowMap.type=Qt,f.shadowMap.autoUpdate=!1,a.appendChild(f.domElement);const S=document.createElement("div");S.className=Ct.interactionSurface,((Ae=a.parentElement)!=null?Ae:a).appendChild(S),c.add(new $t(14674678,1.5));const v=new Jt(16777215,1.4);v.position.set(-1.1,2,3.4),v.castShadow=!0,v.shadow.mapSize.set(A?1024:2048,A?1024:2048),v.shadow.bias=-8e-4,v.shadow.normalBias=.015,v.shadow.camera.left=-2,v.shadow.camera.right=2,v.shadow.camera.top=2,v.shadow.camera.bottom=-2,v.shadow.camera.near=.5,v.shadow.camera.far=12,v.shadow.radius=2.6,c.add(v);const R=v.position.clone().normalize(),T=new ot(new en(24,24),new tn({opacity:.07}));T.position.z=-.24,T.receiveShadow=!0,c.add(T);const M=new wt,u=new wt;u.rotation.x=nr,M.add(u),c.add(M);const i=new L;let w=!1,g=!1,y=!0,h=!document.hidden,x=!0;const E=C=>{var z;C.preventDefault(),x=!1,a.dataset.webglUnavailable="true",delete a.dataset.ready,(z=r.current)==null||z.call(r,!1)};f.domElement.addEventListener("webglcontextlost",E);let V=0,j=0,Z=0,J=0,ae=0;const _=[];let q=null,H=null,W=0,Q=0,ee=null,D=null;const k=new Be;let be=()=>{};const de=null,se=de instanceof WebGL2RenderingContext?de:null;(O=se==null?void 0:se.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const Ee=[],ie=()=>!g&&x&&y&&h,X=()=>{ie()&&((a.clientWidth!==j||a.clientHeight!==Z)&&be(),f.render(c,d))},ue=Xn(X),xe=Vn();let Se=()=>{};const he=new IntersectionObserver(([C])=>{y=!!(C!=null&&C.isIntersecting),ie()?(Se(),X(),Oe(X)):Pe(X)},{threshold:.01});he.observe(a);const Me=()=>{h=!document.hidden,ie()?Oe(X):Pe(X)};document.addEventListener("visibilitychange",Me);const ne=async(C,z)=>{const I=[];let N;try{N=await xe.generate(C,z.density,z.strokeRadius)}catch(G){if(g)return I;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",G)}if(g){for(const G of N!=null?N:[])G.geometry.dispose();return I}try{for(let G=0;G<C.length;G+=1){const P=C[G],F=Hn(P.geometry,{camera:d,viewportElement:f.domElement,pointerTarget:window,touchTarget:S,quality:z,rootColor:rr,lightDir:R,frameLoop:ue,reducedMotion:s.current,prepared:N==null?void 0:N[G]});F.group.position.copy(P.position),F.group.quaternion.copy(P.quaternion),F.group.scale.copy(P.scale),f.getDrawingBufferSize(k);for(const re of F.materials.strands)re.uniforms.uDrawingBufferSize.value.copy(k);I.push(F)}}catch(G){for(const P of I)P.dispose();throw G}return I},ge=C=>{ee=C;const z=++Q;window.clearTimeout(W),W=window.setTimeout(async()=>{const I=ee;if(ee=null,g||!w||!H||!I||(q==null?void 0:q.name)===I.name)return;let N;try{N=await ne(H,I)}catch(F){console.error("[HelloModel] failed to rebuild fur quality",F);return}if(g){for(const F of N)F.dispose();return}if(z!==Q){for(const F of N)F.dispose();return}const G=_.slice();for(const F of N)u.add(F.group);for(const F of G)u.remove(F.group);_.splice(0,_.length,...N),q=I,D&&(D.strandMaterials.splice(0,D.strandMaterials.length,...N.flatMap(F=>F.materials.strands)),D.supportMaterials.splice(0,D.supportMaterials.length,...N.map(F=>F.materials.support))),X();for(const F of G)F.dispose();const P=pt(a.clientWidth,s.current);P.name!==q.name&&ge(P)},180)},p=()=>{const C=a.clientWidth,z=a.clientHeight;if(C===0||z===0)return;V=C;const I=C/z,N=Math.abs(d.aspect-I)>Re;N&&(d.aspect=I,d.updateProjectionMatrix());const G=pt(C,s.current),P=Zn(C,z,window.devicePixelRatio,G),F=C!==j||z!==Z||Math.abs(P-J)>Re;if(F){f.setDrawingBufferSize(C,z,P),j=C,Z=z,J=P,f.getDrawingBufferSize(k);for(const pe of _)for(const we of pe.materials.strands)we.uniforms.uDrawingBufferSize.value.copy(k)}if(!w)return;(q==null?void 0:q.name)!==G.name&&ge(G);const re=I<.85?vt.mobile:I<1.4?vt.tablet:vt.desktop,Ie=I<.85?-.14:-.24,Fe=2*Math.tan(Rt*Math.PI/360)*Pt,Ve=Fe*I;let oe=re.width*Ve/i.x;oe=Math.min(oe,re.maxHeight*Fe/i.y),oe*=re.sizeScale;const _e=oe*re.verticalScale,We=re.offsetY*Fe,ze=Math.abs(M.scale.x-oe)>Re||Math.abs(M.scale.y-_e)>Re||Math.abs(M.scale.z-oe)>Re||Math.abs(M.position.y-We)>Re,qe=Math.abs(T.position.z-Ie)>Re,Ue=ze||qe;ze&&(M.scale.set(oe,_e,oe),M.position.set(0,We,0)),M.updateMatrixWorld(!0);const le=new xt;for(const pe of _)le.expandByObject(pe.baseMesh);const ce=new Be(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),ve=new Be(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),Te=new L;for(const pe of[le.min.x,le.max.x])for(const we of[le.min.y,le.max.y])for(const Ne of[le.min.z,le.max.z])Te.set(pe,we,Ne).project(d),ce.x=Math.min(ce.x,Te.x),ce.y=Math.min(ce.y,Te.y),ve.x=Math.max(ve.x,Te.x),ve.y=Math.max(ve.y,Te.y);const Xe=(ce.x+1)*.5*C,Ye=(ve.x+1)*.5*C,Ge=(1-ve.y)*.5*z,Ze=(1-ce.y)*.5*z;S.style.left=`${Xe}px`,S.style.top=`${Ge}px`,S.style.width=`${Ye-Xe}px`,S.style.height=`${Ze-Ge}px`,qe&&(T.position.z=Ie),ze&&(f.shadowMap.needsUpdate=!0),(F||N||Ue)&&X()};Se=p,be=p;const B=()=>{window.cancelAnimationFrame(ae),ae=window.requestAnimationFrame(()=>{ae=0,p()})};let $=0,te=0;const fe=async C=>{if(g)return;const z=pt(V,s.current),I=await ne(C,z);if(g){for(const P of I)P.dispose();return}H=C,q=z;for(const P of I)u.add(P.group),_.push(P);if(g||_.length===0)return;u.updateMatrixWorld(!0);const N=new xt;for(const P of _)N.expandByObject(P.baseMesh);N.getSize(i),u.position.sub(N.getCenter(new L)),w=!0,p(),D={scene:c,strandMaterials:_.flatMap(P=>P.materials.strands),supportMaterials:_.map(P=>P.materials.support),renderer:f,camera:d,requestRender:X,debug:void 0},te=requestAnimationFrame(()=>{var P;g||(a.dataset.ready="true",(P=r.current)==null||P.call(r,!0))})};Qn().then(C=>{g||($=requestAnimationFrame(()=>fe(C)))},C=>{console.error("[HelloModel] failed to load hello.glb",C)});const me=new ResizeObserver(B);return me.observe(a),window.addEventListener("resize",B,{passive:!0}),(He=window.visualViewport)==null||He.addEventListener("resize",B,{passive:!0}),window.addEventListener("orientationchange",B,{passive:!0}),p(),()=>{var C,z;g=!0,(C=r.current)==null||C.call(r,!1),Q+=1,cancelAnimationFrame($),cancelAnimationFrame(te),cancelAnimationFrame(ae),window.clearTimeout(W),me.disconnect(),he.disconnect(),window.removeEventListener("resize",B),(z=window.visualViewport)==null||z.removeEventListener("resize",B),window.removeEventListener("orientationchange",B),document.removeEventListener("visibilitychange",Me),f.domElement.removeEventListener("webglcontextlost",E),Pe(X);for(const I of _)I.dispose();if(T.geometry.dispose(),T.material.dispose(),ue.dispose(),xe.dispose(),se)for(const I of Ee)se.deleteQuery(I);f.dispose(),S.remove(),f.domElement.remove()}},[]),Ot.jsx("div",{ref:t,className:[Ct.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{ir as HelloModel,ir as default};
