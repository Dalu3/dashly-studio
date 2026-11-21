import{c as Pe,s as Be,r as Gt,a as ut,b as Bt,j as Ot}from"./index-BjHydUcR.js";import{g as R,V as Ge,ac as Vt,E as nt,C as Oe,ad as yt,a8 as jt,ae as bt,h as Ce,I as Et,z as rt,B as ye,w as Ht,f as Ut,U as wt,af as Xt,ag as Yt,W as Zt,ah as Kt,ai as Qt,aj as $t,D as Jt,ak as en,al as tn,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as nn,G as rn}from"./three-gltf-DTLQIlxe.js";const on=340,an=28,sn=105,ln=13,cn=.055,St=1.6,dn=2600,un=75,hn=2900,fn=80,mn=600,pn=22;function et(n,e,r,t,o,a){const l=(r-n)*t;let s=e+l*a;return s*=Math.exp(-o*a),[n+s*a,s]}function gn(n){const{camera:e,domElement:r,touchElement:t,viewportElement:o,raycastTargets:a,materials:l,frameLoop:s}=n,c=new Ge(2,2),d=new Vt,f=new R(1e6,1e6,1e6),h=new R,y=new R,p=new R;let C=!1,b=0,T=!1,A=!1;const L=new R(1e6,1e6,1e6),m=new R,i=new R,w=new R,x=new R(1e6,1e6,1e6),S=new R;let u=0,M=0,P=0,G=0,B=!1,H=!0,_=!1,U=0,Q=0,X=0,O=!1,W=null;const V=()=>{for(const g of l)g.uniforms.uCursorStrength.value=M,g.uniforms.uCursor.value.copy(L),g.uniforms.uCursorDir.value.copy(i),g.uniforms.uRipplePoint.value.copy(x)},ee=()=>{if(!O||a.length===0)return;O=!1;const g=o.getBoundingClientRect();c.set((U-g.left)/g.width*2-1,-((Q-g.top)/g.height)*2+1),d.setFromCamera(c,e);const Z=d.intersectObjects(a,!1)[0];if(Z&&Z.object instanceof nt){const ne=Z.object.worldToLocal(Z.point.clone());if(C){p.copy(ne).sub(y);const re=p.length();if(re>1e-6){h.copy(p).multiplyScalar(1/re);const se=Math.max((X-b)/1e3,1/240),he=re/se;u=Math.min(St,Math.max(u,1+he*cn))}}else u=1;y.copy(ne),b=X,C=!0,f.copy(ne),T=!0,A||(A=!0,L.copy(ne),m.set(0,0,0),x.copy(ne),S.set(0,0,0))}else T&&(u=0,C=!1,b=0,T=!1)},F=g=>{if(B)return _=!1,{keepRunning:!1,needsRender:!1};ee();const Z=G?Math.min((g-G)/1e3,.05):1/60;G=g,T&&u>1&&(u=1+(u-1)*Math.exp(-7*Z));const ne=u>=M;[M,P]=et(M,P,u,ne?on:sn,ne?an:ln,Z),M=Math.min(Math.max(M,-.12),St);for(const v of["x","y","z"])[L[v],m[v]]=et(L[v],m[v],f[v],dn,un,Z),[i[v],w[v]]=et(i[v],w[v],h[v],hn,fn,Z),[x[v],S[v]]=et(x[v],S[v],f[v],mn,pn,Z);const re=Math.abs(u-M)<.0015&&Math.abs(P)<.0015,se=m.lengthSq()<1e-9&&L.distanceToSquared(f)<1e-11,he=w.lengthSq()<1e-9&&i.distanceToSquared(h)<1e-9,Ee=S.lengthSq()<1e-9&&x.distanceToSquared(f)<1e-11;re&&(M=u,P=0);const Ae=re&&se&&he&&Ee;return V(),_=!Ae,{keepRunning:!Ae,needsRender:!0}},k=()=>{_||B||document.hidden||!H||(_=!0,G=0,s.request(F))},ae=()=>O||T||Math.abs(u-M)>=.0015||Math.abs(P)>=.0015||m.lengthSq()>=1e-9||L.distanceToSquared(f)>=1e-11||w.lengthSq()>=1e-9||i.distanceToSquared(h)>=1e-9||S.lengthSq()>=1e-9||x.distanceToSquared(f)>=1e-11,ge=g=>{document.hidden||!H||(U=g.clientX,Q=g.clientY,X=g.timeStamp,O=!0,k())},ve=g=>{g instanceof PointerEvent&&g.pointerType!=="touch"&&ge(g)},Y=g=>{g instanceof PointerEvent&&g.pointerType!=="touch"&&ge(g)},ce=()=>{O=!1,u=0,C=!1,b=0,h.set(0,0,0),T=!1,k()},be=g=>{(!(g instanceof PointerEvent)||g.pointerType!=="touch")&&ce()},de=g=>{(!(g instanceof PointerEvent)||g.pointerType!=="touch")&&ce()},xe=g=>{g.pointerType!=="touch"||W!==null||(W=g.pointerId,t==null||t.setPointerCapture(g.pointerId),g.preventDefault(),ge(g))},Se=g=>{g.pointerId===W&&(g.preventDefault(),ge(g))},ue=g=>{g.pointerId===W&&(W=null,t!=null&&t.hasPointerCapture(g.pointerId)&&t.releasePointerCapture(g.pointerId),ce())},Me=g=>{g.pointerId===W&&(W=null,ce())},$=typeof IntersectionObserver=="function"?new IntersectionObserver(([g])=>{H=!!(g!=null&&g.isIntersecting),H||(Pe(k),O=!1,u=0,M=0,P=0,_=!1,s.cancel(F),V())},{threshold:.01}):null;$==null||$.observe(o);const te=()=>{document.hidden?(Pe(k),_=!1,s.cancel(F)):ae()&&Be(k)};return r.addEventListener("pointerdown",ve,{passive:!0}),r.addEventListener("pointermove",Y,{passive:!0}),r.addEventListener("pointerleave",be,{passive:!0}),r.addEventListener("pointerup",de,{passive:!0}),r.addEventListener("pointercancel",de,{passive:!0}),t==null||t.addEventListener("pointerdown",xe),t==null||t.addEventListener("pointermove",Se),t==null||t.addEventListener("pointerup",ue),t==null||t.addEventListener("pointercancel",ue),t==null||t.addEventListener("lostpointercapture",Me),document.addEventListener("visibilitychange",te),{dispose:()=>{B=!0,W!==null&&(t!=null&&t.hasPointerCapture(W))&&t.releasePointerCapture(W),W=null,r.removeEventListener("pointerdown",ve),r.removeEventListener("pointermove",Y),r.removeEventListener("pointerleave",be),r.removeEventListener("pointerup",de),r.removeEventListener("pointercancel",de),t==null||t.removeEventListener("pointerdown",xe),t==null||t.removeEventListener("pointermove",Se),t==null||t.removeEventListener("pointerup",ue),t==null||t.removeEventListener("pointercancel",ue),t==null||t.removeEventListener("lostpointercapture",Me),document.removeEventListener("visibilitychange",te),$==null||$.disconnect(),Pe(k),_=!1,s.cancel(F)}}}const tt=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`;function yn(n){var t,o;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new Ge(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new Oe((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new Oe((o=n.tipColor)!=null?o:"#6fd4fb")},uLightDir:{value:new R(-.4,.8,.6).normalize()},uGravity:{value:new R(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new R(1e6,1e6,1e6)},uCursorDir:{value:new R(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new R(1e6,1e6,1e6)}};return new yt({glslVersion:bt,uniforms:e,vertexShader:tt+`
`+wn,fragmentShader:tt+`
`+vn,transparent:!1,depthWrite:!0,depthTest:!0,side:jt})}const ht=5,Fe=.01,ft=.02;function bn(){const n=ht+1,e=new Float32Array(n*2*3),r=[];for(let o=0;o<n;o+=1){const a=o/ht;for(const l of[-1,1]){const s=o*2+(l===-1?0:1);e[s*3]=l,e[s*3+1]=a,e[s*3+2]=0}}for(let o=0;o<ht;o+=1){const a=o*2,l=a+1,s=a+2,c=a+3;r.push(a,l,c,a,c,s)}const t=new rt;return t.setAttribute("position",new ye(e,3)),t.setIndex(r),{geometry:t}}function xn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let r=Math.imul(e^e>>>15,1|e);return r=r+Math.imul(r^r>>>7,61|r)^r,((r^r>>>14)>>>0)/4294967296}}function Mt(n,e){const r=n.shade.length,t=[];for(let a=0;a<r;a+=1)e(a)&&t.push(a);const o=(a,l)=>{const s=new Float32Array(t.length*l);return t.forEach((c,d)=>{const f=c*l,h=d*l;for(let y=0;y<l;y+=1)s[h+y]=a[f+y]}),s};return{roots:o(n.roots,3),normals:o(n.normals,3),growth:o(n.growth,4),curl:o(n.curl,4),idle:o(n.idle,4),params:o(n.params,4),shade:o(n.shade,1)}}const Sn=n=>n-Math.floor(n),K=n=>Sn(Math.sin(n)*43758.5453123),Mn=(n,e,r)=>{const t=Math.min(1,Math.max(0,(r-n)/(e-n)));return t*t*(3-2*t)};function At(n,e,r){const t=r>=0?1:-1,o=-1/(t+r),a=n*e*o;return[1+t*n*n*o,t*a,-t*n,a,t+e*e*o,-e]}function Dt(n,e){const r=n.getAttribute("position"),t=n.getAttribute("normal"),o=n.getIndex();if(!o)throw new Error("sampleRoots requires an indexed geometry");const a=o.count/3,l=new Float64Array(a),s=new R,c=new R,d=new R,f=new R,h=new R;let y=0;for(let u=0;u<a;u+=1){s.fromBufferAttribute(r,o.getX(u*3)),c.fromBufferAttribute(r,o.getX(u*3+1)),d.fromBufferAttribute(r,o.getX(u*3+2));const M=f.subVectors(c,s).cross(h.subVectors(d,s)).length()*.5;y+=M,l[u]=y}const p=xn(1592598103),C=new Float32Array(e*3),b=new Float32Array(e*3),T=new Float32Array(e*4),A=new Float32Array(e*4),L=new Float32Array(e*4),m=new Float32Array(e*4),i=new Float32Array(e),w=new R,x=new R,S=new R;for(let u=0;u<e;u+=1){const M=p()*y;let P=0,G=a-1;for(;P<G;){const dt=P+G>>>1;l[dt]<M?P=dt+1:G=dt}const B=P;s.fromBufferAttribute(r,o.getX(B*3)),c.fromBufferAttribute(r,o.getX(B*3+1)),d.fromBufferAttribute(r,o.getX(B*3+2)),w.fromBufferAttribute(t,o.getX(B*3)),x.fromBufferAttribute(t,o.getX(B*3+1)),S.fromBufferAttribute(t,o.getX(B*3+2));const H=p(),_=p(),U=Math.sqrt(H),Q=1-U,X=_*U,O=1-Q-X;C[u*3]=s.x*Q+c.x*X+d.x*O,C[u*3+1]=s.y*Q+c.y*X+d.y*O,C[u*3+2]=s.z*Q+c.z*X+d.z*O;const W=w.x*Q+x.x*X+S.x*O,V=w.y*Q+x.y*X+S.y*O,ee=w.z*Q+x.z*X+S.z*O,F=Math.hypot(W,V,ee)||1;b[u*3]=W/F,b[u*3+1]=V/F,b[u*3+2]=ee/F;const k=p()*1e3,ae=K(k*12.9898),ge=K(k*29.7331),ve=K(k*41.311),Y=K(k*53.913),ce=K(k*7.719),be=K(k*13.377),de=K(k*23.371),xe=K(k*31.951),Se=K(k*89.317),ue=K(k*101.667),Me=K(k*113.311),$=K(k*127.211),te=Mn(.92,1,ae),g=.64+(1.32-.64)*ae+te*.26,Z=(.68+(1.48-.68)*ge)*(1.06+(.9-1.06)*te),ne=.04+(.32-.04)*ve,re=Y*Math.PI*2,se=.08+(.48-.08)*ce,he=be*Math.PI*2,Ee=.55+(1.9-.55)*de,Ae=.55+(1.35-.55)*xe,v=ue*Math.PI*2,z=.5+(1.1-.5)*Me,N=$*Math.PI*2,[I,q,E,D,ie,ze]=At(W/F,V/F,ee/F),Te=Math.cos(he),Ne=Math.sin(he),oe=Te*I+Ne*D,We=Te*q+Ne*ie,ke=Te*E+Ne*ze,De=C[u*3],_e=C[u*3+1],Ve=C[u*3+2],le=Math.floor(De/Fe),fe=Math.floor(_e/Fe),me=Math.floor(Ve/Fe),pe=le+fe*57+me*113,je=(le+.5+(K(pe+11.7)-.5)*.48)*Fe,ot=(fe+.5+(K(pe+37.1)-.5)*.48)*Fe,He=(me+.5+(K(pe+73.9)-.5)*.48)*Fe,Ue=je-De,we=ot-_e,Ie=He-Ve,qe=Ue*(W/F)+we*(V/F)+Ie*(ee/F);let Xe=Ue-W/F*qe,Ye=we-V/F*qe,Ze=Ie-ee/F*qe;const Ke=Math.hypot(Xe,Ye,Ze);Ke>1e-5?(Xe/=Ke,Ye/=Ke,Ze/=Ke):(Xe=oe,Ye=We,Ze=ke);let Qe=W/F+oe*se+Xe*ft,$e=V/F+We*se+Ye*ft,Je=ee/F+ke*se+Ze*ft;const at=Math.hypot(Qe,$e,Je)||1;Qe/=at,$e/=at,Je/=at;const[zt,Nt,Wt,kt,_t,qt]=At(Qe,$e,Je),st=Math.cos(re),it=Math.sin(re),lt=Math.cos(N),ct=Math.sin(N),j=u*4;T[j]=Qe,T[j+1]=$e,T[j+2]=Je,T[j+3]=g,A[j]=st*zt+it*kt,A[j+1]=st*Nt+it*_t,A[j+2]=st*Wt+it*qt,A[j+3]=ne,L[j]=lt*I+ct*D,L[j+1]=lt*q+ct*ie,L[j+2]=lt*E+ct*ze,L[j+3]=v,m[j]=Z,m[j+1]=z,m[j+2]=Ee,m[j+3]=Ae,i[u]=Se}return{roots:C,normals:b,growth:T,curl:A,idle:L,params:m,shade:i}}function An(n){const e=n.getAttribute("position"),r=n.getIndex();if(!r)return 0;const t=r.count/3,o=new R,a=new R,l=new R,s=new R,c=new R;let d=0;for(let f=0;f<t;f+=1)o.fromBufferAttribute(e,r.getX(f*3)),a.fromBufferAttribute(e,r.getX(f*3+1)),l.fromBufferAttribute(e,r.getX(f*3+2)),d+=s.subVectors(a,o).cross(c.subVectors(l,o)).length()*.5;return d}function It(n,e){const r=An(n);return Math.round(r*e)}function mt(n,e,r){const t=r?r.roots.length/3:It(n,e.density),{roots:o,normals:a,growth:l,curl:s,idle:c,params:d,shade:f}=r!=null?r:Dt(n,t),{geometry:h}=bn();h.setAttribute("aRoot",new Ce(o,3)),h.setAttribute("aNormal",new Ce(a,3)),h.setAttribute("aGrowth",new Ce(l,4)),h.setAttribute("aCurl",new Ce(s,4)),h.setAttribute("aIdle",new Ce(c,4)),h.setAttribute("aParams",new Ce(d,4)),h.setAttribute("aShade",new Ce(f,1));const y=yn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),p=new Et(h,y,t);return p.frustumCulled=!1,{mesh:p,material:y}}const Tn=`precision highp float;
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
`,Cn=`uniform float uShellCount;
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
`;function Ln(n,e){var l,s;const r={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Oe((l=e.rootColor)!=null?l:"#1eb6f7")},uTipColor:{value:new Oe((s=e.tipColor)!=null?s:"#6fd4fb")},uLightDir:{value:new R(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new yt({glslVersion:bt,uniforms:r,vertexShader:Cn,fragmentShader:tt+`
`+Tn,side:Ht,transparent:!1,depthTest:!0,depthWrite:!0}),o=new Et(n,t,e.count),a=new Ut;for(let c=0;c<e.count;c+=1)o.setMatrixAt(c,a);return o.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,{mesh:o,material:t}}const Rn=`// Support (base mesh) fragment shader.
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
`;function En(n={}){var t;const e={uRootColor:{value:new Oe((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new R(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new yt({glslVersion:bt,uniforms:e,vertexShader:Pn,fragmentShader:tt+`
`+Rn})}function Dn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:r,frameLoop:t}=n;let o=!1,a=!1,l=0,s=0,c=0;const d=()=>o&&!document.hidden&&!a,f=b=>{if(a)return{keepRunning:!1,needsRender:!1};const A=1e3/Gt(n.idleFps,b);if(b-l<A)return{keepRunning:d(),needsRender:!1};const L=s?Math.min((b-s)/1e3,.05):0;return s=b,l=b,c+=L,r(c),{keepRunning:d(),needsRender:!0}},h=()=>{d()&&(s=0,l=0,t.request(f))},y=()=>{Pe(h),t.cancel(f)},p=new IntersectionObserver(b=>{o=b.some(T=>T.isIntersecting),d()?Be(h):y()},{threshold:.01});p.observe(e);const C=()=>{d()?Be(h):y()};return document.addEventListener("visibilitychange",C),{dispose:()=>{a=!0,y(),p.disconnect(),document.removeEventListener("visibilitychange",C)}}}function In(n,e){for(let o=3;o<=Math.min(256,Math.floor(e/8));o+=1){if(e%o!==0)continue;let a=0,l=0;for(let s=0;s<e-o;s+=7)Math.abs(n(s)-n(s+o))<=1e-6&&(a+=1),l+=1;if(l>0&&a/l>=.75)return o}return null}function Fn(n,e,r){let t=n;for(let o=0;o<e;o+=1){const a=t.map(l=>l.clone());for(let l=0;l<t.length;l+=1){if(!r&&(l===0||l===t.length-1))continue;const s=t[(l-1+t.length)%t.length],c=t[l],d=t[(l+1)%t.length];a[l].copy(s).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=a}return t}function zn(n){var s;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const r=[...e].sort((c,d)=>c-d),t=(s=r[r.length>>1])!=null?s:1,o=[];let a=0;const l=(c,d)=>{if(d-c<1)return;const f=n.slice(c,d+1),h=f[0].distanceTo(f[f.length-1])<t*2;h&&f.pop(),o.push({points:f,closed:h})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(l(a,c),a=c+1);return l(a,n.length-1),o}function Nn(n,e,r,t,o,a,l){const s=n.points,c=s.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const w=s[(i-1+c)%c],x=s[(i+1)%c];let S;n.closed?S=x.clone().sub(w):i===0?S=s[1].clone().sub(s[0]):i===c-1?S=s[c-1].clone().sub(s[c-2]):S=x.clone().sub(w),S.lengthSq()<1e-20&&S.set(0,0,1),d.push(S.normalize())}const f=d[0];let h=new R(0,1,0);Math.abs(f.dot(h))>.9&&h.set(1,0,0),h=h.sub(f.clone().multiplyScalar(h.dot(f))).normalize();const y=[h];for(let i=1;i<c;i+=1){const w=d[i-1],x=d[i],S=y[i-1].clone(),u=w.clone().cross(x);if(u.lengthSq()>1e-20){u.normalize();const M=Math.acos(Math.min(1,Math.max(-1,w.dot(x))));S.applyAxisAngle(u,M)}S.sub(x.clone().multiplyScalar(S.dot(x))),y.push(S.normalize())}const p=[],C=(i,w,x,S)=>{const u=w.clone().cross(x).normalize(),M=a.length/3;for(let P=0;P<r;P+=1){const G=P/r*Math.PI*2,B=Math.cos(G)*S,H=Math.sin(G)*S;a.push(i.x+x.x*B+u.x*H,i.y+x.y*B+u.y*H,i.z+x.z*B+u.z*H)}p.push(M)},b=i=>{const w=a.length/3;return a.push(i.x,i.y,i.z),w};let T=null,A=null;if(!n.closed){T=b(s[0].clone().add(d[0].clone().multiplyScalar(-e*o)));for(let i=t-1;i>=1;i-=1){const w=i/t*(Math.PI/2);C(s[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(w)*e*o)),d[0],y[0],Math.cos(w)*e)}}for(let i=0;i<c;i+=1)C(s[i],d[i],y[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const w=i/t*(Math.PI/2);C(s[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(w)*e*o)),d[c-1],y[c-1],Math.cos(w)*e)}A=b(s[c-1].clone().add(d[c-1].clone().multiplyScalar(e*o)))}const L=p.length,m=n.closed?L:L-1;for(let i=0;i<m;i+=1){const w=p[i],x=p[(i+1)%L];for(let S=0;S<r;S+=1){const u=(S+1)%r;l.push(w+S,x+u,x+S),l.push(w+S,w+u,x+u)}}if(!n.closed&&T!==null&&A!==null){const i=p[0],w=p[L-1];for(let x=0;x<r;x+=1){const S=(x+1)%r;l.push(T,i+S,i+x),l.push(w+x,w+S,A)}}}function Wn(n,e={}){var p,C,b,T;const r=(p=e.radius)!=null?p:.007,t=(C=e.radialSegments)!=null?C:24,o=(b=e.capSegments)!=null?b:4,a=(T=e.capLengthScale)!=null?T:1,l=n.getAttribute("position");if(!l)return null;const s=In(A=>l.getY(A),l.count);if(!s)return null;const c=l.count/s,d=[];for(let A=0;A<c;A+=1){const L=new R;for(let m=0;m<s;m+=1){const i=A*s+m;L.x+=l.getX(i),L.y+=l.getY(i),L.z+=l.getZ(i)}d.push(L.divideScalar(s))}const f=[],h=[];for(const A of zn(d))Nn({...A,points:Fn(A.points,2,A.closed)},r,t,o,a,f,h);if(h.length===0)return null;const y=new rt;return y.setAttribute("position",new ye(new Float32Array(f),3)),y.setIndex(new ye(new Uint32Array(h),1)),y.computeVertexNormals(),y.normalizeNormals(),y}const kn=.0085,_n=1e-5,J=12,Tt=4,qn=1.5,Ct=1.15;function Gn(n){const e=n.getAttribute("position");if(!e||e.count<J*2)return n;const r=Math.floor(e.count/J),t=[];for(let m=0;m<r;m+=1){const i=new R,w=m*J;for(let x=0;x<J;x+=1)i.add(new R(e.getX(w+x),e.getY(w+x),e.getZ(w+x)));t.push(i.multiplyScalar(1/J))}const o=t.findIndex((m,i)=>{const w=t[i+1];return m.x>.06&&m.x<.07&&m.z>-.085&&m.z<-.075&&i>0&&w!==void 0&&m.distanceTo(w)>.02});if(o<1)return n;const a=t[o],l=a.clone().sub(t[o-1]).normalize(),s=o*J,c=Array.from({length:J},(m,i)=>new R(e.getX(s+i),e.getY(s+i),e.getZ(s+i))),d=c.reduce((m,i)=>m+i.distanceTo(a),0)/J;if(!Number.isFinite(d)||d<=0)return n;const f=Array.from(e.array),h=n.getIndex(),y=h?Array.from(h.array):Array.from({length:e.count},(m,i)=>i),p=d*qn,C=a.clone().addScaledVector(l,p);let b=f.length/3;for(const m of c){const i=C.clone().add(m.clone().sub(a));f.push(i.x,i.y,i.z)}for(let m=0;m<J;m+=1){const i=(m+1)%J;y.push(s+m,b+i,b+m,s+m,s+i,b+i)}for(let m=1;m<Tt;m+=1){const i=m/Tt*(Math.PI/2),w=Math.cos(i),x=Math.sin(i)*d*Ct,S=f.length/3;for(const u of c){const M=u.clone().sub(a).multiplyScalar(w),P=C.clone().add(M).addScaledVector(l,x);f.push(P.x,P.y,P.z)}for(let u=0;u<J;u+=1){const M=(u+1)%J;y.push(b+u,S+M,S+u,b+u,b+M,S+M)}b=S}const T=f.length/3,A=C.clone().addScaledVector(l,d*Ct);f.push(A.x,A.y,A.z);for(let m=0;m<J;m+=1){const i=(m+1)%J;y.push(b+m,b+i,T)}const L=new rt;return L.setAttribute("position",new ye(new Float32Array(f),3)),L.setIndex(new ye(new Uint32Array(y),1)),L}function Bn(n,e=kn){const r=Wn(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(r)return r;let t=Gn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=nn(t,_n),t.computeVertexNormals(),t.normalizeNormals(),t}const On=.0078,Vn=9e-4;function jn(n,e){var L,m,i,w,x,S,u;const r=(m=(L=e.prepared)==null?void 0:L.geometry)!=null?m:Bn(n,e.quality.strokeRadius),t=En({rootColor:e.rootColor}),o=new nt(r,t);o.castShadow=!0;const a={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:On,strandWidth:(w=e.quality.strandWidth)!=null?w:Vn,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},l=(S=(x=e.prepared)==null?void 0:x.strands)!=null?S:Dt(r,It(r,e.quality.density)),s=e.quality.shellCount>0,c=s?[mt(r,a,Mt(l,M=>l.shade[M]<e.quality.detailStrandFraction)),mt(r,{...a,strandLength:a.strandLength*1.16,strandWidth:a.strandWidth*1.1,minStrandPixels:a.minStrandPixels*1.12},Mt(l,M=>{const P=l.shade[M],G=Math.abs(l.normals[M*3+1]);return P>=e.quality.detailStrandFraction&&P<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&G<e.quality.silhouetteNormalThreshold}))]:[mt(r,a,l)],d=c.map(M=>M.mesh),f=c.map(M=>M.material),h=d[0],y=f[0],p=s?Ln(r,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const M of f)M.uniforms.uLightDir.value.copy(e.lightDir);p==null||p.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const C=new wt;C.add(o),p&&C.add(p.mesh),C.add(...d);const b=gn({camera:e.camera,domElement:(u=e.pointerTarget)!=null?u:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[o],materials:f,frameLoop:e.frameLoop}),T=Dn({viewportElement:e.viewportElement,setTime:M=>{for(const P of f)P.uniforms.uTime.value=M},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),A=()=>{T.dispose(),b.dispose(),r.dispose();for(const M of d)M.geometry.dispose();t.dispose();for(const M of f)M.dispose();p==null||p.material.dispose();for(const M of d)M.dispose();p==null||p.mesh.dispose()};return{group:C,baseMesh:o,strandMesh:h,strandMeshes:d,materials:{strand:y,strands:f,support:t,shell:p==null?void 0:p.material},dispose:A}}function Hn(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let r=1,t=!1,o=!1;const a=l=>{for(const s of e.values())s.reject(l);e.clear()};return n.onmessage=l=>{const s=l.data,c=e.get(s.id);if(c){if(e.delete(s.id),!s.ok){c.reject(new Error(s.message));return}c.resolve(s.meshes.map(Un))}},n.onerror=()=>{o=!0,a(new Error("fur generation worker failed"))},{generate:(l,s,c)=>{if(t||o)return Promise.reject(new Error("fur generation worker is disposed"));const d=r++,f=[],h=l.map(C=>{var m;const b=C.geometry.getAttribute("position"),T=new Float32Array(b.array),A=(m=C.geometry.getIndex())==null?void 0:m.array,L=A instanceof Uint16Array?new Uint16Array(A):A instanceof Uint32Array?new Uint32Array(A):Uint32Array.from({length:b.count},(i,w)=>w);return f.push(T.buffer,L.buffer),{position:T,index:L}}),y={id:d,density:s,strokeRadius:c,geometries:h},p=new Promise((C,b)=>{e.set(d,{resolve:C,reject:b})});return n.postMessage(y,f),p},dispose:()=>{t||(t=!0,n.terminate(),a(new Error("fur generation worker disposed")))}}}function Un(n){const e=new rt;return e.setAttribute("position",new ye(n.geometry.position,3)),e.setAttribute("normal",new ye(n.geometry.normal,3)),e.setIndex(new ye(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Xn(n){const e=new Set;let r=0,t=!1,o=!1;const a=l=>{if(o){t=!1;return}let s=!1;for(const c of Array.from(e)){const d=c(l),f=typeof d=="boolean"?d:d.keepRunning;s||(s=typeof d=="boolean"?!0:d.needsRender),f||e.delete(c)}s&&n(),e.size>0?r=requestAnimationFrame(a):t=!1};return{request:l=>{e.add(l),!t&&!o&&(t=!0,r=requestAnimationFrame(a))},cancel:l=>{e.delete(l)},dispose:()=>{o=!0,e.clear(),cancelAnimationFrame(r),t=!1}}}const Ft=640,Yn=[2,1.875,1.75,1.5,1.25,1],Le={high:{name:"high",density:46e5,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:3e6,maxDpr:1.5,maxPhysicalPixels:25e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,maxDpr:1.5,maxPhysicalPixels:175e4,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Zn(n,e,r,t){const o=Math.max(1,n)*Math.max(1,e),a=Math.min(r,t.maxDpr);for(const l of Yn)if(l<=a&&o*l*l<=t.maxPhysicalPixels)return l;return Math.min(a,1)}function pt(n,e){if(typeof window<"u"){const r=new URLSearchParams(window.location.search).get("furQuality");if(r&&r in Le)return Le[r]}return e||n<=360?Le["mobile-low"]:n<=Ft?Le.mobile:n<=900?Le.tablet:n<1280?Le.balanced:Le.high}const Kn="/models/hello.glb";let gt=null;function Qn(){return gt||(gt=new Promise((n,e)=>{const r=new Xt;r.onError=t=>{e(new Error(`failed to load ${t}`))},new rn(r).load(Kn,t=>{const o=[];if(t.scene.traverse(a=>{a instanceof nt&&o.push({geometry:a.geometry,position:a.position.clone(),quaternion:a.quaternion.clone(),scale:a.scale.clone()})}),o.length===0){e(new Error("no mesh found in hello.glb"));return}n(o)},void 0,e)})),gt}const $n="_root_1scrz_10",Jn="_interactionSurface_1scrz_42",Lt={root:$n,interactionSurface:Jn},vt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},er=["swiftshader","llvmpipe","softpipe","software","basic render","microsoft basic","mesa offscreen"];function tr(n){const e=n.getExtension("WEBGL_debug_renderer_info"),r=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER);if(typeof r!="string")return!1;const t=r.toLowerCase();return er.some(o=>t.includes(o))}const Rt=20,Pt=6.5,Re=1e-7,nr=Math.PI/2,rr="#159fdf";function ir({className:n,debug:e=!1}){const r=ut.useRef(null),t=Bt(),o=ut.useRef(t);return o.current=t,e||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),ut.useEffect(()=>{var se,he,Ee,Ae;const a=r.current;if(!a)return;const l=new Yt,s=new Zt(Rt,1,.1,100);s.position.set(0,0,Pt);const c=document.createElement("canvas"),d=(se=c.getContext("webgl2"))!=null?se:c.getContext("webgl");if(!d||tr(d)){a.dataset.webglUnavailable="true";return}const f=window.innerWidth<=Ft;let h;try{h=new Kt({antialias:!f,alpha:!0,powerPreference:"high-performance"})}catch{a.dataset.webglUnavailable="true";return}h.setClearAlpha(0),h.shadowMap.enabled=!0,h.shadowMap.type=Qt,h.shadowMap.autoUpdate=!1,a.appendChild(h.domElement);const y=document.createElement("div");y.className=Lt.interactionSurface,((he=a.parentElement)!=null?he:a).appendChild(y),l.add(new $t(14674678,1.5));const p=new Jt(16777215,1.4);p.position.set(-1.1,2,3.4),p.castShadow=!0,p.shadow.mapSize.set(f?1024:2048,f?1024:2048),p.shadow.bias=-8e-4,p.shadow.normalBias=.015,p.shadow.camera.left=-2,p.shadow.camera.right=2,p.shadow.camera.top=2,p.shadow.camera.bottom=-2,p.shadow.camera.near=.5,p.shadow.camera.far=12,p.shadow.radius=2.6,l.add(p);const C=p.position.clone().normalize(),b=new nt(new en(24,24),new tn({opacity:.07}));b.position.z=-.24,b.receiveShadow=!0,l.add(b);const T=new wt,A=new wt;A.rotation.x=nr,T.add(A),l.add(T);const L=new R;let m=!1,i=!1,w=!0,x=!document.hidden,S=!0;const u=v=>{v.preventDefault(),S=!1,a.dataset.webglUnavailable="true",delete a.dataset.ready};h.domElement.addEventListener("webglcontextlost",u);let M=0,P=0,G=0,B=0,H=0;const _=[];let U=null,Q=null,X=0,O=0,W=null,V=null;const ee=new Ge;let F=()=>{};const k=null,ae=k instanceof WebGL2RenderingContext?k:null;(Ee=ae==null?void 0:ae.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const ge=[],ve=()=>!i&&S&&w&&x,Y=()=>{ve()&&((a.clientWidth!==P||a.clientHeight!==G)&&F(),h.render(l,s))},ce=Xn(Y),be=Hn();let de=()=>{};const xe=new IntersectionObserver(([v])=>{w=!!(v!=null&&v.isIntersecting),ve()?(de(),Y(),Be(Y)):Pe(Y)},{threshold:.01});xe.observe(a);const Se=()=>{x=!document.hidden,ve()?Be(Y):Pe(Y)};document.addEventListener("visibilitychange",Se);const ue=async(v,z)=>{const N=[];let I;try{I=await be.generate(v,z.density,z.strokeRadius)}catch(q){if(i)return N;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",q)}if(i){for(const q of I!=null?I:[])q.geometry.dispose();return N}try{for(let q=0;q<v.length;q+=1){const E=v[q],D=jn(E.geometry,{camera:s,viewportElement:h.domElement,pointerTarget:window,touchTarget:y,quality:z,rootColor:rr,lightDir:C,frameLoop:ce,reducedMotion:o.current,prepared:I==null?void 0:I[q]});D.group.position.copy(E.position),D.group.quaternion.copy(E.quaternion),D.group.scale.copy(E.scale),h.getDrawingBufferSize(ee);for(const ie of D.materials.strands)ie.uniforms.uDrawingBufferSize.value.copy(ee);N.push(D)}}catch(q){for(const E of N)E.dispose();throw q}return N},Me=v=>{W=v;const z=++O;window.clearTimeout(X),X=window.setTimeout(async()=>{const N=W;if(W=null,i||!m||!Q||!N||(U==null?void 0:U.name)===N.name)return;let I;try{I=await ue(Q,N)}catch(D){console.error("[HelloModel] failed to rebuild fur quality",D);return}if(i){for(const D of I)D.dispose();return}if(z!==O){for(const D of I)D.dispose();return}const q=_.slice();for(const D of I)A.add(D.group);for(const D of q)A.remove(D.group);_.splice(0,_.length,...I),U=N,V&&(V.strandMaterials.splice(0,V.strandMaterials.length,...I.flatMap(D=>D.materials.strands)),V.supportMaterials.splice(0,V.supportMaterials.length,...I.map(D=>D.materials.support))),Y();for(const D of q)D.dispose();const E=pt(a.clientWidth,o.current);E.name!==U.name&&Me(E)},180)},$=()=>{const v=a.clientWidth,z=a.clientHeight;if(v===0||z===0)return;M=v;const N=v/z,I=Math.abs(s.aspect-N)>Re;I&&(s.aspect=N,s.updateProjectionMatrix());const q=pt(v,o.current),E=Zn(v,z,window.devicePixelRatio,q),D=v!==P||z!==G||Math.abs(E-B)>Re;if(D){h.setDrawingBufferSize(v,z,E),P=v,G=z,B=E,h.getDrawingBufferSize(ee);for(const we of _)for(const Ie of we.materials.strands)Ie.uniforms.uDrawingBufferSize.value.copy(ee)}if(!m)return;(U==null?void 0:U.name)!==q.name&&Me(q);const ie=N<.85?vt.mobile:N<1.4?vt.tablet:vt.desktop,ze=N<.85?-.14:-.24,Te=2*Math.tan(Rt*Math.PI/360)*Pt,Ne=Te*N;let oe=ie.width*Ne/L.x;oe=Math.min(oe,ie.maxHeight*Te/L.y),oe*=ie.sizeScale;const We=oe*ie.verticalScale,ke=ie.offsetY*Te,De=Math.abs(T.scale.x-oe)>Re||Math.abs(T.scale.y-We)>Re||Math.abs(T.scale.z-oe)>Re||Math.abs(T.position.y-ke)>Re,_e=Math.abs(b.position.z-ze)>Re,Ve=De||_e;De&&(T.scale.set(oe,We,oe),T.position.set(0,ke,0)),T.updateMatrixWorld(!0);const le=new xt;for(const we of _)le.expandByObject(we.baseMesh);const fe=new Ge(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),me=new Ge(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),pe=new R;for(const we of[le.min.x,le.max.x])for(const Ie of[le.min.y,le.max.y])for(const qe of[le.min.z,le.max.z])pe.set(we,Ie,qe).project(s),fe.x=Math.min(fe.x,pe.x),fe.y=Math.min(fe.y,pe.y),me.x=Math.max(me.x,pe.x),me.y=Math.max(me.y,pe.y);const je=(fe.x+1)*.5*v,ot=(me.x+1)*.5*v,He=(1-me.y)*.5*z,Ue=(1-fe.y)*.5*z;y.style.left=`${je}px`,y.style.top=`${He}px`,y.style.width=`${ot-je}px`,y.style.height=`${Ue-He}px`,_e&&(b.position.z=ze),De&&(h.shadowMap.needsUpdate=!0),(D||I||Ve)&&Y()};de=$,F=$;const te=()=>{window.cancelAnimationFrame(H),H=window.requestAnimationFrame(()=>{H=0,$()})};let g=0,Z=0;const ne=async v=>{if(i)return;const z=pt(M,o.current),N=await ue(v,z);if(i){for(const E of N)E.dispose();return}Q=v,U=z;for(const E of N)A.add(E.group),_.push(E);if(i||_.length===0)return;A.updateMatrixWorld(!0);const I=new xt;for(const E of _)I.expandByObject(E.baseMesh);I.getSize(L),A.position.sub(I.getCenter(new R)),m=!0,$(),V={scene:l,strandMaterials:_.flatMap(E=>E.materials.strands),supportMaterials:_.map(E=>E.materials.support),renderer:h,camera:s,requestRender:Y,debug:void 0},Z=requestAnimationFrame(()=>{i||(a.dataset.ready="true")})};Qn().then(v=>{i||(g=requestAnimationFrame(()=>ne(v)))},v=>{console.error("[HelloModel] failed to load hello.glb",v)});const re=new ResizeObserver(te);return re.observe(a),window.addEventListener("resize",te,{passive:!0}),(Ae=window.visualViewport)==null||Ae.addEventListener("resize",te,{passive:!0}),window.addEventListener("orientationchange",te,{passive:!0}),$(),()=>{var v;i=!0,O+=1,cancelAnimationFrame(g),cancelAnimationFrame(Z),cancelAnimationFrame(H),window.clearTimeout(X),re.disconnect(),xe.disconnect(),window.removeEventListener("resize",te),(v=window.visualViewport)==null||v.removeEventListener("resize",te),window.removeEventListener("orientationchange",te),document.removeEventListener("visibilitychange",Se),h.domElement.removeEventListener("webglcontextlost",u),Pe(Y);for(const z of _)z.dispose();if(b.geometry.dispose(),b.material.dispose(),ce.dispose(),be.dispose(),ae)for(const z of ge)ae.deleteQuery(z);h.dispose(),y.remove(),h.domElement.remove()}},[]),Ot.jsx("div",{ref:r,className:[Lt.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{ir as HelloModel,ir as default};
