import{c as Ce,s as qe,r as qt,a as Qe,b as Gt,j as Bt}from"./index-D6SSzV3d.js";import{g as L,V as _e,ac as Ot,E as tt,C as Ge,ad as wt,a8 as Vt,ae as yt,h as Me,I as Dt,z as nt,B as ve,w as jt,f as Ht,U as vt,af as Ut,ag as Xt,W as Yt,ah as Zt,ai as Kt,aj as $t,D as Qt,ak as Jt,al as en,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as tn,G as nn}from"./three-gltf-DTLQIlxe.js";const rn=340,on=28,an=105,sn=13,ln=.055,St=1.6,cn=2600,dn=75,un=2900,hn=80,fn=600,mn=22;function Je(n,e,r,t,o,l){const s=(r-n)*t;let a=e+s*l;return a*=Math.exp(-o*l),[n+a*l,a]}function pn(n){const{camera:e,domElement:r,touchElement:t,viewportElement:o,raycastTargets:l,materials:s,frameLoop:a}=n,c=new _e(2,2),d=new Ot,u=new L(1e6,1e6,1e6),g=new L,p=new L,S=new L;let M=!1,v=0,P=!1,T=!1;const A=new L(1e6,1e6,1e6),h=new L,i=new L,w=new L,y=new L(1e6,1e6,1e6),b=new L;let f=0,x=0,I=0,V=0,G=!1,q=!0,B=!1,le=0,Z=0,U=0,O=!1,z=null;const K=()=>{for(const m of s)m.uniforms.uCursorStrength.value=x,m.uniforms.uCursor.value.copy(A),m.uniforms.uCursorDir.value.copy(i),m.uniforms.uRipplePoint.value.copy(y)},ne=()=>{if(!O||l.length===0)return;O=!1;const m=o.getBoundingClientRect();c.set((le-m.left)/m.width*2-1,-((Z-m.top)/m.height)*2+1),d.setFromCamera(c,e);const $=d.intersectObjects(l,!1)[0];if($&&$.object instanceof tt){const J=$.object.worldToLocal($.point.clone());if(M){S.copy(J).sub(p);const ee=S.length();if(ee>1e-6){g.copy(S).multiplyScalar(1/ee);const ae=Math.max((U-v)/1e3,1/240),he=ee/ae;f=Math.min(St,Math.max(f,1+he*ln))}}else f=1;p.copy(J),v=U,M=!0,u.copy(J),P=!0,T||(T=!0,A.copy(J),h.set(0,0,0),y.copy(J),b.set(0,0,0))}else P&&(f=0,M=!1,v=0,P=!1)},W=m=>{if(G)return B=!1,{keepRunning:!1,needsRender:!1};ne();const $=V?Math.min((m-V)/1e3,.05):1/60;V=m,P&&f>1&&(f=1+(f-1)*Math.exp(-7*$));const J=f>=x;[x,I]=Je(x,I,f,J?rn:an,J?on:sn,$),x=Math.min(Math.max(x,-.12),St);for(const C of["x","y","z"])[A[C],h[C]]=Je(A[C],h[C],u[C],cn,dn,$),[i[C],w[C]]=Je(i[C],w[C],g[C],un,hn,$),[y[C],b[C]]=Je(y[C],b[C],u[C],fn,mn,$);const ee=Math.abs(f-x)<.0015&&Math.abs(I)<.0015,ae=h.lengthSq()<1e-9&&A.distanceToSquared(u)<1e-11,he=w.lengthSq()<1e-9&&i.distanceToSquared(g)<1e-9,R=b.lengthSq()<1e-9&&y.distanceToSquared(u)<1e-11;ee&&(x=f,I=0);const F=ee&&ae&&he&&R;return K(),B=!F,{keepRunning:!F,needsRender:!0}},N=()=>{B||G||document.hidden||!q||(B=!0,V=0,a.request(W))},Le=()=>O||P||Math.abs(f-x)>=.0015||Math.abs(I)>=.0015||h.lengthSq()>=1e-9||A.distanceToSquared(u)>=1e-11||w.lengthSq()>=1e-9||i.distanceToSquared(g)>=1e-9||b.lengthSq()>=1e-9||y.distanceToSquared(u)>=1e-11,re=m=>{document.hidden||!q||(le=m.clientX,Z=m.clientY,U=m.timeStamp,O=!0,N())},X=m=>{m instanceof PointerEvent&&m.pointerType!=="touch"&&re(m)},we=m=>{m instanceof PointerEvent&&m.pointerType!=="touch"&&re(m)},ce=()=>{O=!1,f=0,M=!1,v=0,g.set(0,0,0),P=!1,N()},ye=m=>{(!(m instanceof PointerEvent)||m.pointerType!=="touch")&&ce()},de=m=>{(!(m instanceof PointerEvent)||m.pointerType!=="touch")&&ce()},be=m=>{m.pointerType!=="touch"||z!==null||(z=m.pointerId,t==null||t.setPointerCapture(m.pointerId),m.preventDefault(),re(m))},xe=m=>{m.pointerId===z&&(m.preventDefault(),re(m))},ue=m=>{m.pointerId===z&&(z=null,t!=null&&t.hasPointerCapture(m.pointerId)&&t.releasePointerCapture(m.pointerId),ce())},oe=m=>{m.pointerId===z&&(z=null,ce())},j=typeof IntersectionObserver=="function"?new IntersectionObserver(([m])=>{q=!!(m!=null&&m.isIntersecting),q||(Ce(N),O=!1,f=0,x=0,I=0,B=!1,a.cancel(W),K())},{threshold:.01}):null;j==null||j.observe(o);const pe=()=>{document.hidden?(Ce(N),B=!1,a.cancel(W)):Le()&&qe(N)};return r.addEventListener("pointerdown",X,{passive:!0}),r.addEventListener("pointermove",we,{passive:!0}),r.addEventListener("pointerleave",ye,{passive:!0}),r.addEventListener("pointerup",de,{passive:!0}),r.addEventListener("pointercancel",de,{passive:!0}),t==null||t.addEventListener("pointerdown",be),t==null||t.addEventListener("pointermove",xe),t==null||t.addEventListener("pointerup",ue),t==null||t.addEventListener("pointercancel",ue),t==null||t.addEventListener("lostpointercapture",oe),document.addEventListener("visibilitychange",pe),{dispose:()=>{G=!0,z!==null&&(t!=null&&t.hasPointerCapture(z))&&t.releasePointerCapture(z),z=null,r.removeEventListener("pointerdown",X),r.removeEventListener("pointermove",we),r.removeEventListener("pointerleave",ye),r.removeEventListener("pointerup",de),r.removeEventListener("pointercancel",de),t==null||t.removeEventListener("pointerdown",be),t==null||t.removeEventListener("pointermove",xe),t==null||t.removeEventListener("pointerup",ue),t==null||t.removeEventListener("pointercancel",ue),t==null||t.removeEventListener("lostpointercapture",oe),document.removeEventListener("visibilitychange",pe),j==null||j.disconnect(),Ce(N),B=!1,a.cancel(W)}}}const et=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,gn=`// Strand fragment shader.
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
`,vn=`// Strand vertex shader — real, individually-placed hair geometry.
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
`;function wn(n){var t,o;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new _e(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new Ge((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new Ge((o=n.tipColor)!=null?o:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uGravity:{value:new L(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new L(1e6,1e6,1e6)},uCursorDir:{value:new L(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new L(1e6,1e6,1e6)}};return new wt({glslVersion:yt,uniforms:e,vertexShader:et+`
`+vn,fragmentShader:et+`
`+gn,transparent:!1,depthWrite:!0,depthTest:!0,side:Vt})}const ut=5,Ee=.01,ht=.02;function yn(){const n=ut+1,e=new Float32Array(n*2*3),r=[];for(let o=0;o<n;o+=1){const l=o/ut;for(const s of[-1,1]){const a=o*2+(s===-1?0:1);e[a*3]=s,e[a*3+1]=l,e[a*3+2]=0}}for(let o=0;o<ut;o+=1){const l=o*2,s=l+1,a=l+2,c=l+3;r.push(l,s,c,l,c,a)}const t=new nt;return t.setAttribute("position",new ve(e,3)),t.setIndex(r),{geometry:t}}function bn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let r=Math.imul(e^e>>>15,1|e);return r=r+Math.imul(r^r>>>7,61|r)^r,((r^r>>>14)>>>0)/4294967296}}function Mt(n,e){const r=n.shade.length,t=[];for(let l=0;l<r;l+=1)e(l)&&t.push(l);const o=(l,s)=>{const a=new Float32Array(t.length*s);return t.forEach((c,d)=>{const u=c*s,g=d*s;for(let p=0;p<s;p+=1)a[g+p]=l[u+p]}),a};return{roots:o(n.roots,3),normals:o(n.normals,3),growth:o(n.growth,4),curl:o(n.curl,4),idle:o(n.idle,4),params:o(n.params,4),shade:o(n.shade,1)}}const xn=n=>n-Math.floor(n),Y=n=>xn(Math.sin(n)*43758.5453123),Sn=(n,e,r)=>{const t=Math.min(1,Math.max(0,(r-n)/(e-n)));return t*t*(3-2*t)};function Tt(n,e,r){const t=r>=0?1:-1,o=-1/(t+r),l=n*e*o;return[1+t*n*n*o,t*l,-t*n,l,t+e*e*o,-e]}function It(n,e){const r=n.getAttribute("position"),t=n.getAttribute("normal"),o=n.getIndex();if(!o)throw new Error("sampleRoots requires an indexed geometry");const l=o.count/3,s=new Float64Array(l),a=new L,c=new L,d=new L,u=new L,g=new L;let p=0;for(let f=0;f<l;f+=1){a.fromBufferAttribute(r,o.getX(f*3)),c.fromBufferAttribute(r,o.getX(f*3+1)),d.fromBufferAttribute(r,o.getX(f*3+2));const x=u.subVectors(c,a).cross(g.subVectors(d,a)).length()*.5;p+=x,s[f]=p}const S=bn(1592598103),M=new Float32Array(e*3),v=new Float32Array(e*3),P=new Float32Array(e*4),T=new Float32Array(e*4),A=new Float32Array(e*4),h=new Float32Array(e*4),i=new Float32Array(e),w=new L,y=new L,b=new L;for(let f=0;f<e;f+=1){const x=S()*p;let I=0,V=l-1;for(;I<V;){const dt=I+V>>>1;s[dt]<x?I=dt+1:V=dt}const G=I;a.fromBufferAttribute(r,o.getX(G*3)),c.fromBufferAttribute(r,o.getX(G*3+1)),d.fromBufferAttribute(r,o.getX(G*3+2)),w.fromBufferAttribute(t,o.getX(G*3)),y.fromBufferAttribute(t,o.getX(G*3+1)),b.fromBufferAttribute(t,o.getX(G*3+2));const q=S(),B=S(),le=Math.sqrt(q),Z=1-le,U=B*le,O=1-Z-U;M[f*3]=a.x*Z+c.x*U+d.x*O,M[f*3+1]=a.y*Z+c.y*U+d.y*O,M[f*3+2]=a.z*Z+c.z*U+d.z*O;const z=w.x*Z+y.x*U+b.x*O,K=w.y*Z+y.y*U+b.y*O,ne=w.z*Z+y.z*U+b.z*O,W=Math.hypot(z,K,ne)||1;v[f*3]=z/W,v[f*3+1]=K/W,v[f*3+2]=ne/W;const N=S()*1e3,Le=Y(N*12.9898),re=Y(N*29.7331),X=Y(N*41.311),we=Y(N*53.913),ce=Y(N*7.719),ye=Y(N*13.377),de=Y(N*23.371),be=Y(N*31.951),xe=Y(N*89.317),ue=Y(N*101.667),oe=Y(N*113.311),j=Y(N*127.211),pe=Sn(.92,1,Le),m=.64+(1.32-.64)*Le+pe*.26,$=(.68+(1.48-.68)*re)*(1.06+(.9-1.06)*pe),J=.04+(.32-.04)*X,ee=we*Math.PI*2,ae=.08+(.48-.08)*ce,he=ye*Math.PI*2,R=.55+(1.9-.55)*de,F=.55+(1.35-.55)*be,C=ue*Math.PI*2,k=.5+(1.1-.5)*oe,_=j*Math.PI*2,[D,E,se,Fe,Pe,Be]=Tt(z/W,K/W,ne/W),te=Math.cos(he),Re=Math.sin(he),ze=te*D+Re*Fe,De=te*E+Re*Pe,Ne=te*se+Re*Be,Oe=M[f*3],ie=M[f*3+1],fe=M[f*3+2],me=Math.floor(Oe/Ee),ge=Math.floor(ie/Ee),ke=Math.floor(fe/Ee),We=me+ge*57+ke*113,Ve=(me+.5+(Y(We+11.7)-.5)*.48)*Ee,rt=(ge+.5+(Y(We+37.1)-.5)*.48)*Ee,Se=(ke+.5+(Y(We+73.9)-.5)*.48)*Ee,Ie=Ve-Oe,je=rt-ie,bt=Se-fe,ot=Ie*(z/W)+je*(K/W)+bt*(ne/W);let He=Ie-z/W*ot,Ue=je-K/W*ot,Xe=bt-ne/W*ot;const Ye=Math.hypot(He,Ue,Xe);Ye>1e-5?(He/=Ye,Ue/=Ye,Xe/=Ye):(He=ze,Ue=De,Xe=Ne);let Ze=z/W+ze*ae+He*ht,Ke=K/W+De*ae+Ue*ht,$e=ne/W+Ne*ae+Xe*ht;const at=Math.hypot(Ze,Ke,$e)||1;Ze/=at,Ke/=at,$e/=at;const[Ft,zt,Nt,kt,Wt,_t]=Tt(Ze,Ke,$e),st=Math.cos(ee),it=Math.sin(ee),lt=Math.cos(_),ct=Math.sin(_),H=f*4;P[H]=Ze,P[H+1]=Ke,P[H+2]=$e,P[H+3]=m,T[H]=st*Ft+it*kt,T[H+1]=st*zt+it*Wt,T[H+2]=st*Nt+it*_t,T[H+3]=J,A[H]=lt*D+ct*Fe,A[H+1]=lt*E+ct*Pe,A[H+2]=lt*se+ct*Be,A[H+3]=C,h[H]=$,h[H+1]=k,h[H+2]=R,h[H+3]=F,i[f]=xe}return{roots:M,normals:v,growth:P,curl:T,idle:A,params:h,shade:i}}function Mn(n){const e=n.getAttribute("position"),r=n.getIndex();if(!r)return 0;const t=r.count/3,o=new L,l=new L,s=new L,a=new L,c=new L;let d=0;for(let u=0;u<t;u+=1)o.fromBufferAttribute(e,r.getX(u*3)),l.fromBufferAttribute(e,r.getX(u*3+1)),s.fromBufferAttribute(e,r.getX(u*3+2)),d+=a.subVectors(l,o).cross(c.subVectors(s,o)).length()*.5;return d}function Et(n,e){const r=Mn(n);return Math.round(r*e)}function ft(n,e,r){const t=r?r.roots.length/3:Et(n,e.density),{roots:o,normals:l,growth:s,curl:a,idle:c,params:d,shade:u}=r!=null?r:It(n,t),{geometry:g}=yn();g.setAttribute("aRoot",new Me(o,3)),g.setAttribute("aNormal",new Me(l,3)),g.setAttribute("aGrowth",new Me(s,4)),g.setAttribute("aCurl",new Me(a,4)),g.setAttribute("aIdle",new Me(c,4)),g.setAttribute("aParams",new Me(d,4)),g.setAttribute("aShade",new Me(u,1));const p=wn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),S=new Dt(g,p,t);return S.frustumCulled=!1,{mesh:S,material:p}}const Tn=`precision highp float;
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
`,An=`uniform float uShellCount;
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
`;function Cn(n,e){var s,a;const r={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Ge((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Ge((a=e.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new wt({glslVersion:yt,uniforms:r,vertexShader:An,fragmentShader:et+`
`+Tn,side:jt,transparent:!1,depthTest:!0,depthWrite:!0}),o=new Dt(n,t,e.count),l=new Ht;for(let c=0;c<e.count;c+=1)o.setMatrixAt(c,l);return o.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,{mesh:o,material:t}}const Ln=`// Support (base mesh) fragment shader.
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
`;function Rn(n={}){var t;const e={uRootColor:{value:new Ge((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new wt({glslVersion:yt,uniforms:e,vertexShader:Pn,fragmentShader:et+`
`+Ln})}function Dn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:r,frameLoop:t}=n;let o=!1,l=!1,s=0,a=0,c=0;const d=()=>o&&!document.hidden&&!l,u=v=>{if(l)return{keepRunning:!1,needsRender:!1};const T=1e3/qt(n.idleFps,v);if(v-s<T)return{keepRunning:d(),needsRender:!1};const A=a?Math.min((v-a)/1e3,.05):0;return a=v,s=v,c+=A,r(c),{keepRunning:d(),needsRender:!0}},g=()=>{d()&&(a=0,s=0,t.request(u))},p=()=>{Ce(g),t.cancel(u)},S=new IntersectionObserver(v=>{o=v.some(P=>P.isIntersecting),d()?qe(g):p()},{threshold:.01});S.observe(e);const M=()=>{d()?qe(g):p()};return document.addEventListener("visibilitychange",M),{dispose:()=>{l=!0,p(),S.disconnect(),document.removeEventListener("visibilitychange",M)}}}function In(n,e){for(let o=3;o<=Math.min(256,Math.floor(e/8));o+=1){if(e%o!==0)continue;let l=0,s=0;for(let a=0;a<e-o;a+=7)Math.abs(n(a)-n(a+o))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return o}return null}function En(n,e,r){let t=n;for(let o=0;o<e;o+=1){const l=t.map(s=>s.clone());for(let s=0;s<t.length;s+=1){if(!r&&(s===0||s===t.length-1))continue;const a=t[(s-1+t.length)%t.length],c=t[s],d=t[(s+1)%t.length];l[s].copy(a).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=l}return t}function Fn(n){var a;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const r=[...e].sort((c,d)=>c-d),t=(a=r[r.length>>1])!=null?a:1,o=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const u=n.slice(c,d+1),g=u[0].distanceTo(u[u.length-1])<t*2;g&&u.pop(),o.push({points:u,closed:g})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(s(l,c),l=c+1);return s(l,n.length-1),o}function zn(n,e,r,t,o,l,s){const a=n.points,c=a.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const w=a[(i-1+c)%c],y=a[(i+1)%c];let b;n.closed?b=y.clone().sub(w):i===0?b=a[1].clone().sub(a[0]):i===c-1?b=a[c-1].clone().sub(a[c-2]):b=y.clone().sub(w),b.lengthSq()<1e-20&&b.set(0,0,1),d.push(b.normalize())}const u=d[0];let g=new L(0,1,0);Math.abs(u.dot(g))>.9&&g.set(1,0,0),g=g.sub(u.clone().multiplyScalar(g.dot(u))).normalize();const p=[g];for(let i=1;i<c;i+=1){const w=d[i-1],y=d[i],b=p[i-1].clone(),f=w.clone().cross(y);if(f.lengthSq()>1e-20){f.normalize();const x=Math.acos(Math.min(1,Math.max(-1,w.dot(y))));b.applyAxisAngle(f,x)}b.sub(y.clone().multiplyScalar(b.dot(y))),p.push(b.normalize())}const S=[],M=(i,w,y,b)=>{const f=w.clone().cross(y).normalize(),x=l.length/3;for(let I=0;I<r;I+=1){const V=I/r*Math.PI*2,G=Math.cos(V)*b,q=Math.sin(V)*b;l.push(i.x+y.x*G+f.x*q,i.y+y.y*G+f.y*q,i.z+y.z*G+f.z*q)}S.push(x)},v=i=>{const w=l.length/3;return l.push(i.x,i.y,i.z),w};let P=null,T=null;if(!n.closed){P=v(a[0].clone().add(d[0].clone().multiplyScalar(-e*o)));for(let i=t-1;i>=1;i-=1){const w=i/t*(Math.PI/2);M(a[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(w)*e*o)),d[0],p[0],Math.cos(w)*e)}}for(let i=0;i<c;i+=1)M(a[i],d[i],p[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const w=i/t*(Math.PI/2);M(a[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(w)*e*o)),d[c-1],p[c-1],Math.cos(w)*e)}T=v(a[c-1].clone().add(d[c-1].clone().multiplyScalar(e*o)))}const A=S.length,h=n.closed?A:A-1;for(let i=0;i<h;i+=1){const w=S[i],y=S[(i+1)%A];for(let b=0;b<r;b+=1){const f=(b+1)%r;s.push(w+b,y+f,y+b),s.push(w+b,w+f,y+f)}}if(!n.closed&&P!==null&&T!==null){const i=S[0],w=S[A-1];for(let y=0;y<r;y+=1){const b=(y+1)%r;s.push(P,i+b,i+y),s.push(w+y,w+b,T)}}}function Nn(n,e={}){var S,M,v,P;const r=(S=e.radius)!=null?S:.007,t=(M=e.radialSegments)!=null?M:24,o=(v=e.capSegments)!=null?v:4,l=(P=e.capLengthScale)!=null?P:1,s=n.getAttribute("position");if(!s)return null;const a=In(T=>s.getY(T),s.count);if(!a)return null;const c=s.count/a,d=[];for(let T=0;T<c;T+=1){const A=new L;for(let h=0;h<a;h+=1){const i=T*a+h;A.x+=s.getX(i),A.y+=s.getY(i),A.z+=s.getZ(i)}d.push(A.divideScalar(a))}const u=[],g=[];for(const T of Fn(d))zn({...T,points:En(T.points,2,T.closed)},r,t,o,l,u,g);if(g.length===0)return null;const p=new nt;return p.setAttribute("position",new ve(new Float32Array(u),3)),p.setIndex(new ve(new Uint32Array(g),1)),p.computeVertexNormals(),p.normalizeNormals(),p}const kn=.0085,Wn=1e-5,Q=12,At=4,_n=1.5,Ct=1.15;function qn(n){const e=n.getAttribute("position");if(!e||e.count<Q*2)return n;const r=Math.floor(e.count/Q),t=[];for(let h=0;h<r;h+=1){const i=new L,w=h*Q;for(let y=0;y<Q;y+=1)i.add(new L(e.getX(w+y),e.getY(w+y),e.getZ(w+y)));t.push(i.multiplyScalar(1/Q))}const o=t.findIndex((h,i)=>{const w=t[i+1];return h.x>.06&&h.x<.07&&h.z>-.085&&h.z<-.075&&i>0&&w!==void 0&&h.distanceTo(w)>.02});if(o<1)return n;const l=t[o],s=l.clone().sub(t[o-1]).normalize(),a=o*Q,c=Array.from({length:Q},(h,i)=>new L(e.getX(a+i),e.getY(a+i),e.getZ(a+i))),d=c.reduce((h,i)=>h+i.distanceTo(l),0)/Q;if(!Number.isFinite(d)||d<=0)return n;const u=Array.from(e.array),g=n.getIndex(),p=g?Array.from(g.array):Array.from({length:e.count},(h,i)=>i),S=d*_n,M=l.clone().addScaledVector(s,S);let v=u.length/3;for(const h of c){const i=M.clone().add(h.clone().sub(l));u.push(i.x,i.y,i.z)}for(let h=0;h<Q;h+=1){const i=(h+1)%Q;p.push(a+h,v+i,v+h,a+h,a+i,v+i)}for(let h=1;h<At;h+=1){const i=h/At*(Math.PI/2),w=Math.cos(i),y=Math.sin(i)*d*Ct,b=u.length/3;for(const f of c){const x=f.clone().sub(l).multiplyScalar(w),I=M.clone().add(x).addScaledVector(s,y);u.push(I.x,I.y,I.z)}for(let f=0;f<Q;f+=1){const x=(f+1)%Q;p.push(v+f,b+x,b+f,v+f,v+x,b+x)}v=b}const P=u.length/3,T=M.clone().addScaledVector(s,d*Ct);u.push(T.x,T.y,T.z);for(let h=0;h<Q;h+=1){const i=(h+1)%Q;p.push(v+h,v+i,P)}const A=new nt;return A.setAttribute("position",new ve(new Float32Array(u),3)),A.setIndex(new ve(new Uint32Array(p),1)),A}function Gn(n,e=kn){const r=Nn(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(r)return r;let t=qn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=tn(t,Wn),t.computeVertexNormals(),t.normalizeNormals(),t}const Bn=.0078,On=9e-4;function Vn(n,e){var A,h,i,w,y,b,f;const r=(h=(A=e.prepared)==null?void 0:A.geometry)!=null?h:Gn(n,e.quality.strokeRadius),t=Rn({rootColor:e.rootColor}),o=new tt(r,t);o.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:Bn,strandWidth:(w=e.quality.strandWidth)!=null?w:On,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(b=(y=e.prepared)==null?void 0:y.strands)!=null?b:It(r,Et(r,e.quality.density)),a=e.quality.shellCount>0,c=a?[ft(r,l,Mt(s,x=>s.shade[x]<e.quality.detailStrandFraction)),ft(r,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},Mt(s,x=>{const I=s.shade[x],V=Math.abs(s.normals[x*3+1]);return I>=e.quality.detailStrandFraction&&I<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&V<e.quality.silhouetteNormalThreshold}))]:[ft(r,l,s)],d=c.map(x=>x.mesh),u=c.map(x=>x.material),g=d[0],p=u[0],S=a?Cn(r,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const x of u)x.uniforms.uLightDir.value.copy(e.lightDir);S==null||S.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const M=new vt;M.add(o),S&&M.add(S.mesh),M.add(...d);const v=pn({camera:e.camera,domElement:(f=e.pointerTarget)!=null?f:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[o],materials:u,frameLoop:e.frameLoop}),P=Dn({viewportElement:e.viewportElement,setTime:x=>{for(const I of u)I.uniforms.uTime.value=x},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),T=()=>{P.dispose(),v.dispose(),r.dispose();for(const x of d)x.geometry.dispose();t.dispose();for(const x of u)x.dispose();S==null||S.material.dispose();for(const x of d)x.dispose();S==null||S.mesh.dispose()};return{group:M,baseMesh:o,strandMesh:g,strandMeshes:d,materials:{strand:p,strands:u,support:t,shell:S==null?void 0:S.material},dispose:T}}function jn(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let r=1,t=!1,o=!1;const l=s=>{for(const a of e.values())a.reject(s);e.clear()};return n.onmessage=s=>{const a=s.data,c=e.get(a.id);if(c){if(e.delete(a.id),!a.ok){c.reject(new Error(a.message));return}c.resolve(a.meshes.map(Hn))}},n.onerror=()=>{o=!0,l(new Error("fur generation worker failed"))},{generate:(s,a,c)=>{if(t||o)return Promise.reject(new Error("fur generation worker is disposed"));const d=r++,u=[],g=s.map(M=>{var h;const v=M.geometry.getAttribute("position"),P=new Float32Array(v.array),T=(h=M.geometry.getIndex())==null?void 0:h.array,A=T instanceof Uint16Array?new Uint16Array(T):T instanceof Uint32Array?new Uint32Array(T):Uint32Array.from({length:v.count},(i,w)=>w);return u.push(P.buffer,A.buffer),{position:P,index:A}}),p={id:d,density:a,strokeRadius:c,geometries:g},S=new Promise((M,v)=>{e.set(d,{resolve:M,reject:v})});return n.postMessage(p,u),S},dispose:()=>{t||(t=!0,n.terminate(),l(new Error("fur generation worker disposed")))}}}function Hn(n){const e=new nt;return e.setAttribute("position",new ve(n.geometry.position,3)),e.setAttribute("normal",new ve(n.geometry.normal,3)),e.setIndex(new ve(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Un(n){const e=new Set;let r=0,t=!1,o=!1;const l=s=>{if(o){t=!1;return}let a=!1;for(const c of Array.from(e)){const d=c(s),u=typeof d=="boolean"?d:d.keepRunning;a||(a=typeof d=="boolean"?!0:d.needsRender),u||e.delete(c)}a&&n(),e.size>0?r=requestAnimationFrame(l):t=!1};return{request:s=>{e.add(s),!t&&!o&&(t=!0,r=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{o=!0,e.clear(),cancelAnimationFrame(r),t=!1}}}const Xn=[2,1.875,1.75,1.5,1.25,1],Te={high:{name:"high",density:46e5,minDpr:1,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,minDpr:1.25,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,minDpr:1.5,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:3e6,minDpr:2,maxDpr:2,maxPhysicalPixels:25e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,minDpr:2,maxDpr:2,maxPhysicalPixels:175e4,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Yn(n,e,r,t){const o=Math.max(1,n)*Math.max(1,e),l=Math.min(Math.max(r,t.minDpr),t.maxDpr);for(const s of Xn)if(s<=l&&o*s*s<=t.maxPhysicalPixels)return s;return Math.min(l,1)}function mt(n,e){if(typeof window<"u"){const r=new URLSearchParams(window.location.search).get("furQuality");if(r&&r in Te)return Te[r]}return e||n<=360?Te["mobile-low"]:n<=640?Te.mobile:n<=900?Te.tablet:n<1280?Te.balanced:Te.high}const Zn="/models/hello.glb";let pt=null;function Kn(){return pt||(pt=new Promise((n,e)=>{const r=new Ut;r.onError=t=>{e(new Error(`failed to load ${t}`))},new nn(r).load(Zn,t=>{const o=[];if(t.scene.traverse(l=>{l instanceof tt&&o.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),o.length===0){e(new Error("no mesh found in hello.glb"));return}n(o)},void 0,e)})),pt}const $n="_root_e9bd2_10",Qn="_interactionSurface_e9bd2_29",Lt={root:$n,interactionSurface:Qn},gt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},Pt=20,Rt=6.5,Ae=1e-7,Jn=Math.PI/2,er="#159fdf";function or({className:n,onReady:e,debug:r=!1}){const t=Qe.useRef(null),o=Qe.useRef(e);o.current=e;const l=Gt(),s=Qe.useRef(l);return s.current=l,r||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),Qe.useEffect(()=>{var ee,ae,he;const a=t.current;if(!a)return;const c=new Xt,d=new Yt(Pt,1,.1,100);d.position.set(0,0,Rt);const u=new Zt({antialias:!0,alpha:!0,powerPreference:"high-performance"});u.setClearAlpha(0),u.shadowMap.enabled=!0,u.shadowMap.type=Kt,u.shadowMap.autoUpdate=!1,a.appendChild(u.domElement);const g=document.createElement("div");g.className=Lt.interactionSurface,((ee=a.parentElement)!=null?ee:a).appendChild(g),c.add(new $t(14674678,1.5));const p=new Qt(16777215,1.4);p.position.set(-1.1,2,3.4),p.castShadow=!0,p.shadow.mapSize.set(2048,2048),p.shadow.bias=-8e-4,p.shadow.normalBias=.015,p.shadow.camera.left=-2,p.shadow.camera.right=2,p.shadow.camera.top=2,p.shadow.camera.bottom=-2,p.shadow.camera.near=.5,p.shadow.camera.far=12,p.shadow.radius=2.6,c.add(p);const S=p.position.clone().normalize(),M=new tt(new Jt(24,24),new en({opacity:.07}));M.position.z=-.24,M.receiveShadow=!0,c.add(M);const v=new vt,P=new vt;P.rotation.x=Jn,v.add(P),c.add(v);const T=new L;let A=!1,h=!1,i=!0,w=!document.hidden,y=!0;const b=R=>{R.preventDefault(),y=!1,u.domElement.style.visibility="hidden",a.dataset.webglUnavailable="true"};u.domElement.addEventListener("webglcontextlost",b);let f=0,x=0,I=0,V=0,G=0;const q=[];let B=null,le=null,Z=0,U=0,O=null,z=null;const K=new _e;let ne=()=>{};const W=null,N=W instanceof WebGL2RenderingContext?W:null;(ae=N==null?void 0:N.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const Le=[],re=()=>!h&&y&&i&&w,X=()=>{re()&&((a.clientWidth!==x||a.clientHeight!==I)&&ne(),u.render(c,d))},we=Un(X),ce=jn();let ye=()=>{};const de=new IntersectionObserver(([R])=>{i=!!(R!=null&&R.isIntersecting),re()?(ye(),X(),qe(X)):Ce(X)},{threshold:.01});de.observe(a);const be=()=>{w=!document.hidden,re()?qe(X):Ce(X)};document.addEventListener("visibilitychange",be);const xe=async(R,F)=>{const C=[];let k;try{k=await ce.generate(R,F.density,F.strokeRadius)}catch(_){if(h)return C;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",_)}if(h){for(const _ of k!=null?k:[])_.geometry.dispose();return C}try{for(let _=0;_<R.length;_+=1){const D=R[_],E=Vn(D.geometry,{camera:d,viewportElement:u.domElement,pointerTarget:window,touchTarget:g,quality:F,rootColor:er,lightDir:S,frameLoop:we,reducedMotion:s.current,prepared:k==null?void 0:k[_]});E.group.position.copy(D.position),E.group.quaternion.copy(D.quaternion),E.group.scale.copy(D.scale),u.getDrawingBufferSize(K);for(const se of E.materials.strands)se.uniforms.uDrawingBufferSize.value.copy(K);C.push(E)}}catch(_){for(const D of C)D.dispose();throw _}return C},ue=R=>{O=R;const F=++U;window.clearTimeout(Z),Z=window.setTimeout(async()=>{const C=O;if(O=null,h||!A||!le||!C||(B==null?void 0:B.name)===C.name)return;let k;try{k=await xe(le,C)}catch(E){console.error("[HelloModel] failed to rebuild fur quality",E);return}if(h){for(const E of k)E.dispose();return}if(F!==U){for(const E of k)E.dispose();return}const _=q.slice();for(const E of k)P.add(E.group);for(const E of _)P.remove(E.group);q.splice(0,q.length,...k),B=C,z&&(z.strandMaterials.splice(0,z.strandMaterials.length,...k.flatMap(E=>E.materials.strands)),z.supportMaterials.splice(0,z.supportMaterials.length,...k.map(E=>E.materials.support))),X();for(const E of _)E.dispose();const D=mt(a.clientWidth,s.current);D.name!==B.name&&ue(D)},180)},oe=()=>{const R=a.clientWidth,F=a.clientHeight;if(R===0||F===0)return;f=R;const C=R/F,k=Math.abs(d.aspect-C)>Ae;k&&(d.aspect=C,d.updateProjectionMatrix());const _=mt(R,s.current),D=Yn(R,F,window.devicePixelRatio,_),E=R!==x||F!==I||Math.abs(D-V)>Ae;if(E){u.setDrawingBufferSize(R,F,D),x=R,I=F,V=D,u.getDrawingBufferSize(K);for(const Se of q)for(const Ie of Se.materials.strands)Ie.uniforms.uDrawingBufferSize.value.copy(K)}if(!A)return;(B==null?void 0:B.name)!==_.name&&ue(_);const se=C<.85?gt.mobile:C<1.4?gt.tablet:gt.desktop,Fe=C<.85?-.14:-.24,Pe=2*Math.tan(Pt*Math.PI/360)*Rt,Be=Pe*C;let te=se.width*Be/T.x;te=Math.min(te,se.maxHeight*Pe/T.y),te*=se.sizeScale;const Re=te*se.verticalScale,ze=se.offsetY*Pe,De=Math.abs(v.scale.x-te)>Ae||Math.abs(v.scale.y-Re)>Ae||Math.abs(v.scale.z-te)>Ae||Math.abs(v.position.y-ze)>Ae,Ne=Math.abs(M.position.z-Fe)>Ae,Oe=De||Ne;De&&(v.scale.set(te,Re,te),v.position.set(0,ze,0)),v.updateMatrixWorld(!0);const ie=new xt;for(const Se of q)ie.expandByObject(Se.baseMesh);const fe=new _e(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),me=new _e(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),ge=new L;for(const Se of[ie.min.x,ie.max.x])for(const Ie of[ie.min.y,ie.max.y])for(const je of[ie.min.z,ie.max.z])ge.set(Se,Ie,je).project(d),fe.x=Math.min(fe.x,ge.x),fe.y=Math.min(fe.y,ge.y),me.x=Math.max(me.x,ge.x),me.y=Math.max(me.y,ge.y);const ke=(fe.x+1)*.5*R,We=(me.x+1)*.5*R,Ve=(1-me.y)*.5*F,rt=(1-fe.y)*.5*F;g.style.left=`${ke}px`,g.style.top=`${Ve}px`,g.style.width=`${We-ke}px`,g.style.height=`${rt-Ve}px`,Ne&&(M.position.z=Fe),De&&(u.shadowMap.needsUpdate=!0),(E||k||Oe)&&X()};ye=oe,ne=oe;const j=()=>{window.cancelAnimationFrame(G),G=window.requestAnimationFrame(()=>{G=0,oe()})};let pe=0,m=0;const $=async R=>{if(h)return;const F=mt(f,s.current),C=await xe(R,F);if(h){for(const D of C)D.dispose();return}le=R,B=F;for(const D of C)P.add(D.group),q.push(D);if(h||q.length===0)return;P.updateMatrixWorld(!0);const k=new xt;for(const D of q)k.expandByObject(D.baseMesh);k.getSize(T),P.position.sub(k.getCenter(new L)),A=!0,oe();const _={scene:c,strandMaterials:q.flatMap(D=>D.materials.strands),supportMaterials:q.map(D=>D.materials.support),renderer:u,camera:d,requestRender:X,debug:void 0};z=_,m=requestAnimationFrame(()=>{var D;h||(D=o.current)==null||D.call(o,_)})};Kn().then(R=>{h||(pe=requestAnimationFrame(()=>$(R)))},R=>{console.error("[HelloModel] failed to load hello.glb",R)});const J=new ResizeObserver(j);return J.observe(a),window.addEventListener("resize",j,{passive:!0}),(he=window.visualViewport)==null||he.addEventListener("resize",j,{passive:!0}),window.addEventListener("orientationchange",j,{passive:!0}),oe(),()=>{var R;h=!0,U+=1,cancelAnimationFrame(pe),cancelAnimationFrame(m),cancelAnimationFrame(G),window.clearTimeout(Z),J.disconnect(),de.disconnect(),window.removeEventListener("resize",j),(R=window.visualViewport)==null||R.removeEventListener("resize",j),window.removeEventListener("orientationchange",j),document.removeEventListener("visibilitychange",be),u.domElement.removeEventListener("webglcontextlost",b),Ce(X);for(const F of q)F.dispose();if(M.geometry.dispose(),M.material.dispose(),we.dispose(),ce.dispose(),N)for(const F of Le)N.deleteQuery(F);u.dispose(),g.remove(),u.domElement.remove()}},[]),Bt.jsx("div",{ref:t,className:[Lt.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{or as HelloModel,or as default};
