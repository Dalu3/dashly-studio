import{c as De,s as He,r as qt,a as tt,b as Gt,j as Bt}from"./index-CN__jC4i.js";import{g as A,V as je,ac as Ot,E as ot,C as Ue,ad as yt,a8 as Vt,ae as bt,h as Ae,I as Rt,z as at,B as we,w as jt,f as Ht,U as wt,af as Ut,ag as Xt,W as Yt,ah as Zt,ai as Kt,aj as $t,D as Qt,ak as Jt,al as en,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as tn,G as nn}from"./three-gltf-DTLQIlxe.js";const rn=340,on=28,an=105,sn=13,ln=.055,St=1.6,cn=2600,dn=75,un=2900,hn=80,fn=600,mn=22;function nt(n,e,o,t,r,l){const s=(o-n)*t;let a=e+s*l;return a*=Math.exp(-r*l),[n+a*l,a]}function pn(n){const{camera:e,domElement:o,touchElement:t,viewportElement:r,raycastTargets:l,materials:s,frameLoop:a}=n,c=new je(2,2),d=new Ot,m=new A(1e6,1e6,1e6),M=new A,p=new A,v=new A;let w=!1,C=0,L=!1,S=!1;const T=new A(1e6,1e6,1e6),f=new A,i=new A,g=new A,y=new A(1e6,1e6,1e6),b=new A;let u=0,x=0,I=0,O=0,B=!1,J=!0,$=!1,V=0,q=0,X=0,j=!1,W=null;const ee=()=>{for(const h of s)h.uniforms.uCursorStrength.value=x,h.uniforms.uCursor.value.copy(T),h.uniforms.uCursorDir.value.copy(i),h.uniforms.uRipplePoint.value.copy(y)},Y=()=>{if(!j||l.length===0)return;j=!1;const h=r.getBoundingClientRect();c.set((V-h.left)/h.width*2-1,-((q-h.top)/h.height)*2+1),d.setFromCamera(c,e);const Z=d.intersectObjects(l,!1)[0];if(Z&&Z.object instanceof ot){const te=Z.object.worldToLocal(Z.point.clone());if(w){v.copy(te).sub(p);const ae=v.length();if(ae>1e-6){M.copy(v).multiplyScalar(1/ae);const ce=Math.max((X-C)/1e3,1/240),fe=ae/ce;u=Math.min(St,Math.max(u,1+fe*ln))}}else u=1;p.copy(te),C=X,w=!0,m.copy(te),L=!0,S||(S=!0,T.copy(te),f.set(0,0,0),y.copy(te),b.set(0,0,0))}else L&&(u=0,w=!1,C=0,L=!1)},E=h=>{if(B)return $=!1,{keepRunning:!1,needsRender:!1};Y();const Z=O?Math.min((h-O)/1e3,.05):1/60;O=h,L&&u>1&&(u=1+(u-1)*Math.exp(-7*Z));const te=u>=x;[x,I]=nt(x,I,u,te?rn:an,te?on:sn,Z),x=Math.min(Math.max(x,-.12),St);for(const G of["x","y","z"])[T[G],f[G]]=nt(T[G],f[G],m[G],cn,dn,Z),[i[G],g[G]]=nt(i[G],g[G],M[G],un,hn,Z),[y[G],b[G]]=nt(y[G],b[G],m[G],fn,mn,Z);const ae=Math.abs(u-x)<.0015&&Math.abs(I)<.0015,ce=f.lengthSq()<1e-9&&T.distanceToSquared(m)<1e-11,fe=g.lengthSq()<1e-9&&i.distanceToSquared(M)<1e-9,Ie=b.lengthSq()<1e-9&&y.distanceToSquared(m)<1e-11;ae&&(x=u,I=0);const Ce=ae&&ce&&fe&&Ie;return ee(),$=!Ce,{keepRunning:!Ce,needsRender:!0}},_=()=>{$||B||document.hidden||!J||($=!0,O=0,a.request(E))},ye=()=>j||L||Math.abs(u-x)>=.0015||Math.abs(I)>=.0015||f.lengthSq()>=1e-9||T.distanceToSquared(m)>=1e-11||g.lengthSq()>=1e-9||i.distanceToSquared(M)>=1e-9||b.lengthSq()>=1e-9||y.distanceToSquared(m)>=1e-11,ne=h=>{document.hidden||!J||(V=h.clientX,q=h.clientY,X=h.timeStamp,j=!0,_())},Re=h=>{h instanceof PointerEvent&&h.pointerType!=="touch"&&ne(h)},me=h=>{h instanceof PointerEvent&&h.pointerType!=="touch"&&ne(h)},H=()=>{j=!1,u=0,w=!1,C=0,M.set(0,0,0),L=!1,_()},be=h=>{(!(h instanceof PointerEvent)||h.pointerType!=="touch")&&H()},ue=h=>{(!(h instanceof PointerEvent)||h.pointerType!=="touch")&&H()},xe=h=>{h.pointerType!=="touch"||W!==null||(W=h.pointerId,t==null||t.setPointerCapture(h.pointerId),h.preventDefault(),ne(h))},Se=h=>{h.pointerId===W&&(h.preventDefault(),ne(h))},he=h=>{h.pointerId===W&&(W=null,t!=null&&t.hasPointerCapture(h.pointerId)&&t.releasePointerCapture(h.pointerId),H())},Me=h=>{h.pointerId===W&&(W=null,H())},re=typeof IntersectionObserver=="function"?new IntersectionObserver(([h])=>{J=!!(h!=null&&h.isIntersecting),J||(De(_),j=!1,u=0,x=0,I=0,$=!1,a.cancel(E),ee())},{threshold:.01}):null;re==null||re.observe(r);const oe=()=>{document.hidden?(De(_),$=!1,a.cancel(E)):ye()&&He(_)};return o.addEventListener("pointerdown",Re,{passive:!0}),o.addEventListener("pointermove",me,{passive:!0}),o.addEventListener("pointerleave",be,{passive:!0}),o.addEventListener("pointerup",ue,{passive:!0}),o.addEventListener("pointercancel",ue,{passive:!0}),t==null||t.addEventListener("pointerdown",xe),t==null||t.addEventListener("pointermove",Se),t==null||t.addEventListener("pointerup",he),t==null||t.addEventListener("pointercancel",he),t==null||t.addEventListener("lostpointercapture",Me),document.addEventListener("visibilitychange",oe),{dispose:()=>{B=!0,W!==null&&(t!=null&&t.hasPointerCapture(W))&&t.releasePointerCapture(W),W=null,o.removeEventListener("pointerdown",Re),o.removeEventListener("pointermove",me),o.removeEventListener("pointerleave",be),o.removeEventListener("pointerup",ue),o.removeEventListener("pointercancel",ue),t==null||t.removeEventListener("pointerdown",xe),t==null||t.removeEventListener("pointermove",Se),t==null||t.removeEventListener("pointerup",he),t==null||t.removeEventListener("pointercancel",he),t==null||t.removeEventListener("lostpointercapture",Me),document.removeEventListener("visibilitychange",oe),re==null||re.disconnect(),De(_),$=!1,a.cancel(E)}}}const rt=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`;function wn(n){var t,r;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new je(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new Ue((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new Ue((r=n.tipColor)!=null?r:"#6fd4fb")},uLightDir:{value:new A(-.4,.8,.6).normalize()},uGravity:{value:new A(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new A(1e6,1e6,1e6)},uCursorDir:{value:new A(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new A(1e6,1e6,1e6)}};return new yt({glslVersion:bt,uniforms:e,vertexShader:rt+`
`+vn,fragmentShader:rt+`
`+gn,transparent:!1,depthWrite:!0,depthTest:!0,side:Vt})}const ht=5,Ne=.01,ft=.02;function yn(){const n=ht+1,e=new Float32Array(n*2*3),o=[];for(let r=0;r<n;r+=1){const l=r/ht;for(const s of[-1,1]){const a=r*2+(s===-1?0:1);e[a*3]=s,e[a*3+1]=l,e[a*3+2]=0}}for(let r=0;r<ht;r+=1){const l=r*2,s=l+1,a=l+2,c=l+3;o.push(l,s,c,l,c,a)}const t=new at;return t.setAttribute("position",new we(e,3)),t.setIndex(o),{geometry:t}}function bn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let o=Math.imul(e^e>>>15,1|e);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function Mt(n,e){const o=n.shade.length,t=[];for(let l=0;l<o;l+=1)e(l)&&t.push(l);const r=(l,s)=>{const a=new Float32Array(t.length*s);return t.forEach((c,d)=>{const m=c*s,M=d*s;for(let p=0;p<s;p+=1)a[M+p]=l[m+p]}),a};return{roots:r(n.roots,3),normals:r(n.normals,3),growth:r(n.growth,4),curl:r(n.curl,4),idle:r(n.idle,4),params:r(n.params,4),shade:r(n.shade,1)}}const xn=n=>n-Math.floor(n),K=n=>xn(Math.sin(n)*43758.5453123),Sn=(n,e,o)=>{const t=Math.min(1,Math.max(0,(o-n)/(e-n)));return t*t*(3-2*t)};function Ct(n,e,o){const t=o>=0?1:-1,r=-1/(t+o),l=n*e*r;return[1+t*n*n*r,t*l,-t*n,l,t+e*e*r,-e]}function It(n,e){const o=n.getAttribute("position"),t=n.getAttribute("normal"),r=n.getIndex();if(!r)throw new Error("sampleRoots requires an indexed geometry");const l=r.count/3,s=new Float64Array(l),a=new A,c=new A,d=new A,m=new A,M=new A;let p=0;for(let u=0;u<l;u+=1){a.fromBufferAttribute(o,r.getX(u*3)),c.fromBufferAttribute(o,r.getX(u*3+1)),d.fromBufferAttribute(o,r.getX(u*3+2));const x=m.subVectors(c,a).cross(M.subVectors(d,a)).length()*.5;p+=x,s[u]=p}const v=bn(1592598103),w=new Float32Array(e*3),C=new Float32Array(e*3),L=new Float32Array(e*4),S=new Float32Array(e*4),T=new Float32Array(e*4),f=new Float32Array(e*4),i=new Float32Array(e),g=new A,y=new A,b=new A;for(let u=0;u<e;u+=1){const x=v()*p;let I=0,O=l-1;for(;I<O;){const ut=I+O>>>1;s[ut]<x?I=ut+1:O=ut}const B=I;a.fromBufferAttribute(o,r.getX(B*3)),c.fromBufferAttribute(o,r.getX(B*3+1)),d.fromBufferAttribute(o,r.getX(B*3+2)),g.fromBufferAttribute(t,r.getX(B*3)),y.fromBufferAttribute(t,r.getX(B*3+1)),b.fromBufferAttribute(t,r.getX(B*3+2));const J=v(),$=v(),V=Math.sqrt(J),q=1-V,X=$*V,j=1-q-X;w[u*3]=a.x*q+c.x*X+d.x*j,w[u*3+1]=a.y*q+c.y*X+d.y*j,w[u*3+2]=a.z*q+c.z*X+d.z*j;const W=g.x*q+y.x*X+b.x*j,ee=g.y*q+y.y*X+b.y*j,Y=g.z*q+y.z*X+b.z*j,E=Math.hypot(W,ee,Y)||1;C[u*3]=W/E,C[u*3+1]=ee/E,C[u*3+2]=Y/E;const _=v()*1e3,ye=K(_*12.9898),ne=K(_*29.7331),Re=K(_*41.311),me=K(_*53.913),H=K(_*7.719),be=K(_*13.377),ue=K(_*23.371),xe=K(_*31.951),Se=K(_*89.317),he=K(_*101.667),Me=K(_*113.311),re=K(_*127.211),oe=Sn(.92,1,ye),h=.64+(1.32-.64)*ye+oe*.26,Z=(.68+(1.48-.68)*ne)*(1.06+(.9-1.06)*oe),te=.04+(.32-.04)*Re,ae=me*Math.PI*2,ce=.08+(.48-.08)*H,fe=be*Math.PI*2,Ie=.55+(1.9-.55)*ue,Ce=.55+(1.35-.55)*xe,G=he*Math.PI*2,Xe=.5+(1.1-.5)*Me,ke=re*Math.PI*2,[P,z,N,F,k,D]=Ct(W/E,ee/E,Y/E),R=Math.cos(fe),se=Math.sin(fe),We=R*P+se*F,Ee=R*z+se*k,Ye=R*N+se*D,ie=w[u*3],_e=w[u*3+1],qe=w[u*3+2],Fe=Math.floor(ie/Ne),Ge=Math.floor(_e/Ne),Ze=Math.floor(qe/Ne),le=Fe+Ge*57+Ze*113,pe=(Fe+.5+(K(le+11.7)-.5)*.48)*Ne,ge=(Ge+.5+(K(le+37.1)-.5)*.48)*Ne,Te=(Ze+.5+(K(le+73.9)-.5)*.48)*Ne,Be=pe-ie,Ke=ge-_e,Oe=Te-qe,Ve=Be*(W/E)+Ke*(ee/E)+Oe*(Y/E);let de=Be-W/E*Ve,ve=Ke-ee/E*Ve,ze=Oe-Y/E*Ve;const $e=Math.hypot(de,ve,ze);$e>1e-5?(de/=$e,ve/=$e,ze/=$e):(de=We,ve=Ee,ze=Ye);let Qe=W/E+We*ce+de*ft,Je=ee/E+Ee*ce+ve*ft,et=Y/E+Ye*ce+ze*ft;const st=Math.hypot(Qe,Je,et)||1;Qe/=st,Je/=st,et/=st;const[Ft,zt,Nt,kt,Wt,_t]=Ct(Qe,Je,et),it=Math.cos(ae),lt=Math.sin(ae),ct=Math.cos(ke),dt=Math.sin(ke),U=u*4;L[U]=Qe,L[U+1]=Je,L[U+2]=et,L[U+3]=h,S[U]=it*Ft+lt*kt,S[U+1]=it*zt+lt*Wt,S[U+2]=it*Nt+lt*_t,S[U+3]=te,T[U]=ct*P+dt*F,T[U+1]=ct*z+dt*k,T[U+2]=ct*N+dt*D,T[U+3]=G,f[U]=Z,f[U+1]=Xe,f[U+2]=Ie,f[U+3]=Ce,i[u]=Se}return{roots:w,normals:C,growth:L,curl:S,idle:T,params:f,shade:i}}function Mn(n){const e=n.getAttribute("position"),o=n.getIndex();if(!o)return 0;const t=o.count/3,r=new A,l=new A,s=new A,a=new A,c=new A;let d=0;for(let m=0;m<t;m+=1)r.fromBufferAttribute(e,o.getX(m*3)),l.fromBufferAttribute(e,o.getX(m*3+1)),s.fromBufferAttribute(e,o.getX(m*3+2)),d+=a.subVectors(l,r).cross(c.subVectors(s,r)).length()*.5;return d}function Et(n,e){const o=Mn(n);return Math.round(o*e)}function mt(n,e,o){const t=o?o.roots.length/3:Et(n,e.density),{roots:r,normals:l,growth:s,curl:a,idle:c,params:d,shade:m}=o!=null?o:It(n,t),{geometry:M}=yn();M.setAttribute("aRoot",new Ae(r,3)),M.setAttribute("aNormal",new Ae(l,3)),M.setAttribute("aGrowth",new Ae(s,4)),M.setAttribute("aCurl",new Ae(a,4)),M.setAttribute("aIdle",new Ae(c,4)),M.setAttribute("aParams",new Ae(d,4)),M.setAttribute("aShade",new Ae(m,1));const p=wn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),v=new Rt(M,p,t);return v.frustumCulled=!1,{mesh:v,material:p}}const Cn=`precision highp float;
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
`,Tn=`uniform float uShellCount;
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
`;function An(n,e){var s,a;const o={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Ue((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Ue((a=e.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new A(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new yt({glslVersion:bt,uniforms:o,vertexShader:Tn,fragmentShader:rt+`
`+Cn,side:jt,transparent:!1,depthTest:!0,depthWrite:!0}),r=new Rt(n,t,e.count),l=new Ht;for(let c=0;c<e.count;c+=1)r.setMatrixAt(c,l);return r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,{mesh:r,material:t}}const Ln=`// Support (base mesh) fragment shader.
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
`;function Dn(n={}){var t;const e={uRootColor:{value:new Ue((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new A(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new yt({glslVersion:bt,uniforms:e,vertexShader:Pn,fragmentShader:rt+`
`+Ln})}function Rn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:o,frameLoop:t}=n;let r=!1,l=!1,s=0,a=0,c=0;const d=()=>r&&!document.hidden&&!l,m=C=>{if(l)return{keepRunning:!1,needsRender:!1};const S=1e3/qt(n.idleFps,C);if(C-s<S)return{keepRunning:d(),needsRender:!1};const T=a?Math.min((C-a)/1e3,.05):0;return a=C,s=C,c+=T,o(c),{keepRunning:d(),needsRender:!0}},M=()=>{d()&&(a=0,s=0,t.request(m))},p=()=>{De(M),t.cancel(m)},v=new IntersectionObserver(C=>{r=C.some(L=>L.isIntersecting),d()?He(M):p()},{threshold:.01});v.observe(e);const w=()=>{d()?He(M):p()};return document.addEventListener("visibilitychange",w),{dispose:()=>{l=!0,p(),v.disconnect(),document.removeEventListener("visibilitychange",w)}}}function In(n,e){for(let r=3;r<=Math.min(256,Math.floor(e/8));r+=1){if(e%r!==0)continue;let l=0,s=0;for(let a=0;a<e-r;a+=7)Math.abs(n(a)-n(a+r))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return r}return null}function En(n,e,o){let t=n;for(let r=0;r<e;r+=1){const l=t.map(s=>s.clone());for(let s=0;s<t.length;s+=1){if(!o&&(s===0||s===t.length-1))continue;const a=t[(s-1+t.length)%t.length],c=t[s],d=t[(s+1)%t.length];l[s].copy(a).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=l}return t}function Fn(n){var a;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const o=[...e].sort((c,d)=>c-d),t=(a=o[o.length>>1])!=null?a:1,r=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const m=n.slice(c,d+1),M=m[0].distanceTo(m[m.length-1])<t*2;M&&m.pop(),r.push({points:m,closed:M})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(s(l,c),l=c+1);return s(l,n.length-1),r}function zn(n,e,o,t,r,l,s){const a=n.points,c=a.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const g=a[(i-1+c)%c],y=a[(i+1)%c];let b;n.closed?b=y.clone().sub(g):i===0?b=a[1].clone().sub(a[0]):i===c-1?b=a[c-1].clone().sub(a[c-2]):b=y.clone().sub(g),b.lengthSq()<1e-20&&b.set(0,0,1),d.push(b.normalize())}const m=d[0];let M=new A(0,1,0);Math.abs(m.dot(M))>.9&&M.set(1,0,0),M=M.sub(m.clone().multiplyScalar(M.dot(m))).normalize();const p=[M];for(let i=1;i<c;i+=1){const g=d[i-1],y=d[i],b=p[i-1].clone(),u=g.clone().cross(y);if(u.lengthSq()>1e-20){u.normalize();const x=Math.acos(Math.min(1,Math.max(-1,g.dot(y))));b.applyAxisAngle(u,x)}b.sub(y.clone().multiplyScalar(b.dot(y))),p.push(b.normalize())}const v=[],w=(i,g,y,b)=>{const u=g.clone().cross(y).normalize(),x=l.length/3;for(let I=0;I<o;I+=1){const O=I/o*Math.PI*2,B=Math.cos(O)*b,J=Math.sin(O)*b;l.push(i.x+y.x*B+u.x*J,i.y+y.y*B+u.y*J,i.z+y.z*B+u.z*J)}v.push(x)},C=i=>{const g=l.length/3;return l.push(i.x,i.y,i.z),g};let L=null,S=null;if(!n.closed){L=C(a[0].clone().add(d[0].clone().multiplyScalar(-e*r)));for(let i=t-1;i>=1;i-=1){const g=i/t*(Math.PI/2);w(a[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(g)*e*r)),d[0],p[0],Math.cos(g)*e)}}for(let i=0;i<c;i+=1)w(a[i],d[i],p[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const g=i/t*(Math.PI/2);w(a[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(g)*e*r)),d[c-1],p[c-1],Math.cos(g)*e)}S=C(a[c-1].clone().add(d[c-1].clone().multiplyScalar(e*r)))}const T=v.length,f=n.closed?T:T-1;for(let i=0;i<f;i+=1){const g=v[i],y=v[(i+1)%T];for(let b=0;b<o;b+=1){const u=(b+1)%o;s.push(g+b,y+u,y+b),s.push(g+b,g+u,y+u)}}if(!n.closed&&L!==null&&S!==null){const i=v[0],g=v[T-1];for(let y=0;y<o;y+=1){const b=(y+1)%o;s.push(L,i+b,i+y),s.push(g+y,g+b,S)}}}function Nn(n,e={}){var v,w,C,L;const o=(v=e.radius)!=null?v:.007,t=(w=e.radialSegments)!=null?w:24,r=(C=e.capSegments)!=null?C:4,l=(L=e.capLengthScale)!=null?L:1,s=n.getAttribute("position");if(!s)return null;const a=In(S=>s.getY(S),s.count);if(!a)return null;const c=s.count/a,d=[];for(let S=0;S<c;S+=1){const T=new A;for(let f=0;f<a;f+=1){const i=S*a+f;T.x+=s.getX(i),T.y+=s.getY(i),T.z+=s.getZ(i)}d.push(T.divideScalar(a))}const m=[],M=[];for(const S of Fn(d))zn({...S,points:En(S.points,2,S.closed)},o,t,r,l,m,M);if(M.length===0)return null;const p=new at;return p.setAttribute("position",new we(new Float32Array(m),3)),p.setIndex(new we(new Uint32Array(M),1)),p.computeVertexNormals(),p.normalizeNormals(),p}const kn=.0085,Wn=1e-5,Q=12,Tt=4,_n=1.5,At=1.15;function qn(n){const e=n.getAttribute("position");if(!e||e.count<Q*2)return n;const o=Math.floor(e.count/Q),t=[];for(let f=0;f<o;f+=1){const i=new A,g=f*Q;for(let y=0;y<Q;y+=1)i.add(new A(e.getX(g+y),e.getY(g+y),e.getZ(g+y)));t.push(i.multiplyScalar(1/Q))}const r=t.findIndex((f,i)=>{const g=t[i+1];return f.x>.06&&f.x<.07&&f.z>-.085&&f.z<-.075&&i>0&&g!==void 0&&f.distanceTo(g)>.02});if(r<1)return n;const l=t[r],s=l.clone().sub(t[r-1]).normalize(),a=r*Q,c=Array.from({length:Q},(f,i)=>new A(e.getX(a+i),e.getY(a+i),e.getZ(a+i))),d=c.reduce((f,i)=>f+i.distanceTo(l),0)/Q;if(!Number.isFinite(d)||d<=0)return n;const m=Array.from(e.array),M=n.getIndex(),p=M?Array.from(M.array):Array.from({length:e.count},(f,i)=>i),v=d*_n,w=l.clone().addScaledVector(s,v);let C=m.length/3;for(const f of c){const i=w.clone().add(f.clone().sub(l));m.push(i.x,i.y,i.z)}for(let f=0;f<Q;f+=1){const i=(f+1)%Q;p.push(a+f,C+i,C+f,a+f,a+i,C+i)}for(let f=1;f<Tt;f+=1){const i=f/Tt*(Math.PI/2),g=Math.cos(i),y=Math.sin(i)*d*At,b=m.length/3;for(const u of c){const x=u.clone().sub(l).multiplyScalar(g),I=w.clone().add(x).addScaledVector(s,y);m.push(I.x,I.y,I.z)}for(let u=0;u<Q;u+=1){const x=(u+1)%Q;p.push(C+u,b+x,b+u,C+u,C+x,b+x)}C=b}const L=m.length/3,S=w.clone().addScaledVector(s,d*At);m.push(S.x,S.y,S.z);for(let f=0;f<Q;f+=1){const i=(f+1)%Q;p.push(C+f,C+i,L)}const T=new at;return T.setAttribute("position",new we(new Float32Array(m),3)),T.setIndex(new we(new Uint32Array(p),1)),T}function Gn(n,e=kn){const o=Nn(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(o)return o;let t=qn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=tn(t,Wn),t.computeVertexNormals(),t.normalizeNormals(),t}const Bn=.0078,On=9e-4;function Vn(n,e){var T,f,i,g,y,b,u;const o=(f=(T=e.prepared)==null?void 0:T.geometry)!=null?f:Gn(n,e.quality.strokeRadius),t=Dn({rootColor:e.rootColor}),r=new ot(o,t);r.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:Bn,strandWidth:(g=e.quality.strandWidth)!=null?g:On,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(b=(y=e.prepared)==null?void 0:y.strands)!=null?b:It(o,Et(o,e.quality.density)),a=e.quality.shellCount>0,c=a?[mt(o,l,Mt(s,x=>s.shade[x]<e.quality.detailStrandFraction)),mt(o,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},Mt(s,x=>{const I=s.shade[x],O=Math.abs(s.normals[x*3+1]);return I>=e.quality.detailStrandFraction&&I<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&O<e.quality.silhouetteNormalThreshold}))]:[mt(o,l,s)],d=c.map(x=>x.mesh),m=c.map(x=>x.material),M=d[0],p=m[0],v=a?An(o,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const x of m)x.uniforms.uLightDir.value.copy(e.lightDir);v==null||v.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const w=new wt;w.add(r),v&&w.add(v.mesh),w.add(...d);const C=pn({camera:e.camera,domElement:(u=e.pointerTarget)!=null?u:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[r],materials:m,frameLoop:e.frameLoop}),L=Rn({viewportElement:e.viewportElement,setTime:x=>{for(const I of m)I.uniforms.uTime.value=x},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),S=()=>{L.dispose(),C.dispose(),o.dispose();for(const x of d)x.geometry.dispose();t.dispose();for(const x of m)x.dispose();v==null||v.material.dispose();for(const x of d)x.dispose();v==null||v.mesh.dispose()};return{group:w,baseMesh:r,strandMesh:M,strandMeshes:d,materials:{strand:p,strands:m,support:t,shell:v==null?void 0:v.material},dispose:S}}function jn(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let o=1,t=!1,r=!1;const l=s=>{for(const a of e.values())a.reject(s);e.clear()};return n.onmessage=s=>{const a=s.data,c=e.get(a.id);if(c){if(e.delete(a.id),!a.ok){c.reject(new Error(a.message));return}c.resolve(a.meshes.map(Hn))}},n.onerror=()=>{r=!0,l(new Error("fur generation worker failed"))},{generate:(s,a,c)=>{if(t||r)return Promise.reject(new Error("fur generation worker is disposed"));const d=o++,m=[],M=s.map(w=>{var f;const C=w.geometry.getAttribute("position"),L=new Float32Array(C.array),S=(f=w.geometry.getIndex())==null?void 0:f.array,T=S instanceof Uint16Array?new Uint16Array(S):S instanceof Uint32Array?new Uint32Array(S):Uint32Array.from({length:C.count},(i,g)=>g);return m.push(L.buffer,T.buffer),{position:L,index:T}}),p={id:d,density:a,strokeRadius:c,geometries:M},v=new Promise((w,C)=>{e.set(d,{resolve:w,reject:C})});return n.postMessage(p,m),v},dispose:()=>{t||(t=!0,n.terminate(),l(new Error("fur generation worker disposed")))}}}function Hn(n){const e=new at;return e.setAttribute("position",new we(n.geometry.position,3)),e.setAttribute("normal",new we(n.geometry.normal,3)),e.setIndex(new we(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Un(n){const e=new Set;let o=0,t=!1,r=!1;const l=s=>{if(r){t=!1;return}let a=!1;for(const c of Array.from(e)){const d=c(s),m=typeof d=="boolean"?d:d.keepRunning;a||(a=typeof d=="boolean"?!0:d.needsRender),m||e.delete(c)}a&&n(),e.size>0?o=requestAnimationFrame(l):t=!1};return{request:s=>{e.add(s),!t&&!r&&(t=!0,o=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{r=!0,e.clear(),cancelAnimationFrame(o),t=!1}}}const Xn=[2,1.875,1.75,1.5,1.25,1],Le={high:{name:"high",density:46e5,minDpr:1,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,minDpr:1.25,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,minDpr:1.5,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:3e6,minDpr:2,maxDpr:2,maxPhysicalPixels:25e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,minDpr:2,maxDpr:2,maxPhysicalPixels:175e4,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Yn(n,e,o,t){const r=Math.max(1,n)*Math.max(1,e),l=Math.min(Math.max(o,t.minDpr),t.maxDpr);for(const s of Xn)if(s<=l&&r*s*s<=t.maxPhysicalPixels)return s;return Math.min(l,1)}function pt(n,e){if(typeof window<"u"){const o=new URLSearchParams(window.location.search).get("furQuality");if(o&&o in Le)return Le[o]}return e||n<=360?Le["mobile-low"]:n<=640?Le.mobile:n<=900?Le.tablet:n<1280?Le.balanced:Le.high}const Zn="/models/hello.glb";let gt=null;function Kn(){return gt||(gt=new Promise((n,e)=>{const o=new Ut;o.onError=t=>{e(new Error(`failed to load ${t}`))},new nn(o).load(Zn,t=>{const r=[];if(t.scene.traverse(l=>{l instanceof ot&&r.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),r.length===0){e(new Error("no mesh found in hello.glb"));return}n(r)},void 0,e)})),gt}const $n="_root_e9bd2_10",Qn="_interactionSurface_e9bd2_29",Lt={root:$n,interactionSurface:Qn},vt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},Pt=20,Dt=6.5,Pe=1e-7,Jn=Math.PI/2,er="#159fdf";function or({className:n,onReady:e,debug:o=!1}){const t=tt.useRef(null),r=tt.useRef(e);r.current=e;const l=Gt(),s=tt.useRef(l);return s.current=l,o||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),tt.useEffect(()=>{var fe,Ie,Ce,G,Xe,ke;const a=t.current;if(!a)return;const c=new Xt,d=new Yt(Pt,1,.1,100);d.position.set(0,0,Dt);const m=document.createElement("canvas");if(!((fe=m.getContext("webgl2"))!=null?fe:m.getContext("webgl"))){a.dataset.webglUnavailable="true",(Ie=r.current)==null||Ie.call(r,null);return}let p;try{p=new Zt({antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{a.dataset.webglUnavailable="true",(Ce=r.current)==null||Ce.call(r,null);return}p.setClearAlpha(0),p.shadowMap.enabled=!0,p.shadowMap.type=Kt,p.shadowMap.autoUpdate=!1,a.appendChild(p.domElement);const v=document.createElement("div");v.className=Lt.interactionSurface,((G=a.parentElement)!=null?G:a).appendChild(v),c.add(new $t(14674678,1.5));const w=new Qt(16777215,1.4);w.position.set(-1.1,2,3.4),w.castShadow=!0,w.shadow.mapSize.set(2048,2048),w.shadow.bias=-8e-4,w.shadow.normalBias=.015,w.shadow.camera.left=-2,w.shadow.camera.right=2,w.shadow.camera.top=2,w.shadow.camera.bottom=-2,w.shadow.camera.near=.5,w.shadow.camera.far=12,w.shadow.radius=2.6,c.add(w);const C=w.position.clone().normalize(),L=new ot(new Jt(24,24),new en({opacity:.07}));L.position.z=-.24,L.receiveShadow=!0,c.add(L);const S=new wt,T=new wt;T.rotation.x=Jn,S.add(T),c.add(S);const f=new A;let i=!1,g=!1,y=!0,b=!document.hidden,u=!0;const x=P=>{P.preventDefault(),u=!1,p.domElement.style.visibility="hidden",a.dataset.webglUnavailable="true"};p.domElement.addEventListener("webglcontextlost",x);let I=0,O=0,B=0,J=0,$=0;const V=[];let q=null,X=null,j=0,W=0,ee=null,Y=null;const E=new je;let _=()=>{};const ye=null,ne=ye instanceof WebGL2RenderingContext?ye:null;(Xe=ne==null?void 0:ne.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const Re=[],me=()=>!g&&u&&y&&b,H=()=>{me()&&((a.clientWidth!==O||a.clientHeight!==B)&&_(),p.render(c,d))},be=Un(H),ue=jn();let xe=()=>{};const Se=new IntersectionObserver(([P])=>{y=!!(P!=null&&P.isIntersecting),me()?(xe(),H(),He(H)):De(H)},{threshold:.01});Se.observe(a);const he=()=>{b=!document.hidden,me()?He(H):De(H)};document.addEventListener("visibilitychange",he);const Me=async(P,z)=>{const N=[];let F;try{F=await ue.generate(P,z.density,z.strokeRadius)}catch(k){if(g)return N;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",k)}if(g){for(const k of F!=null?F:[])k.geometry.dispose();return N}try{for(let k=0;k<P.length;k+=1){const D=P[k],R=Vn(D.geometry,{camera:d,viewportElement:p.domElement,pointerTarget:window,touchTarget:v,quality:z,rootColor:er,lightDir:C,frameLoop:be,reducedMotion:s.current,prepared:F==null?void 0:F[k]});R.group.position.copy(D.position),R.group.quaternion.copy(D.quaternion),R.group.scale.copy(D.scale),p.getDrawingBufferSize(E);for(const se of R.materials.strands)se.uniforms.uDrawingBufferSize.value.copy(E);N.push(R)}}catch(k){for(const D of N)D.dispose();throw k}return N},re=P=>{ee=P;const z=++W;window.clearTimeout(j),j=window.setTimeout(async()=>{const N=ee;if(ee=null,g||!i||!X||!N||(q==null?void 0:q.name)===N.name)return;let F;try{F=await Me(X,N)}catch(R){console.error("[HelloModel] failed to rebuild fur quality",R);return}if(g){for(const R of F)R.dispose();return}if(z!==W){for(const R of F)R.dispose();return}const k=V.slice();for(const R of F)T.add(R.group);for(const R of k)T.remove(R.group);V.splice(0,V.length,...F),q=N,Y&&(Y.strandMaterials.splice(0,Y.strandMaterials.length,...F.flatMap(R=>R.materials.strands)),Y.supportMaterials.splice(0,Y.supportMaterials.length,...F.map(R=>R.materials.support))),H();for(const R of k)R.dispose();const D=pt(a.clientWidth,s.current);D.name!==q.name&&re(D)},180)},oe=()=>{const P=a.clientWidth,z=a.clientHeight;if(P===0||z===0)return;I=P;const N=P/z,F=Math.abs(d.aspect-N)>Pe;F&&(d.aspect=N,d.updateProjectionMatrix());const k=pt(P,s.current),D=Yn(P,z,window.devicePixelRatio,k),R=P!==O||z!==B||Math.abs(D-J)>Pe;if(R){p.setDrawingBufferSize(P,z,D),O=P,B=z,J=D,p.getDrawingBufferSize(E);for(const de of V)for(const ve of de.materials.strands)ve.uniforms.uDrawingBufferSize.value.copy(E)}if(!i)return;(q==null?void 0:q.name)!==k.name&&re(k);const se=N<.85?vt.mobile:N<1.4?vt.tablet:vt.desktop,We=N<.85?-.14:-.24,Ee=2*Math.tan(Pt*Math.PI/360)*Dt,Ye=Ee*N;let ie=se.width*Ye/f.x;ie=Math.min(ie,se.maxHeight*Ee/f.y),ie*=se.sizeScale;const _e=ie*se.verticalScale,qe=se.offsetY*Ee,Fe=Math.abs(S.scale.x-ie)>Pe||Math.abs(S.scale.y-_e)>Pe||Math.abs(S.scale.z-ie)>Pe||Math.abs(S.position.y-qe)>Pe,Ge=Math.abs(L.position.z-We)>Pe,Ze=Fe||Ge;Fe&&(S.scale.set(ie,_e,ie),S.position.set(0,qe,0)),S.updateMatrixWorld(!0);const le=new xt;for(const de of V)le.expandByObject(de.baseMesh);const pe=new je(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),ge=new je(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),Te=new A;for(const de of[le.min.x,le.max.x])for(const ve of[le.min.y,le.max.y])for(const ze of[le.min.z,le.max.z])Te.set(de,ve,ze).project(d),pe.x=Math.min(pe.x,Te.x),pe.y=Math.min(pe.y,Te.y),ge.x=Math.max(ge.x,Te.x),ge.y=Math.max(ge.y,Te.y);const Be=(pe.x+1)*.5*P,Ke=(ge.x+1)*.5*P,Oe=(1-ge.y)*.5*z,Ve=(1-pe.y)*.5*z;v.style.left=`${Be}px`,v.style.top=`${Oe}px`,v.style.width=`${Ke-Be}px`,v.style.height=`${Ve-Oe}px`,Ge&&(L.position.z=We),Fe&&(p.shadowMap.needsUpdate=!0),(R||F||Ze)&&H()};xe=oe,_=oe;const h=()=>{window.cancelAnimationFrame($),$=window.requestAnimationFrame(()=>{$=0,oe()})};let Z=0,te=0;const ae=async P=>{if(g)return;const z=pt(I,s.current),N=await Me(P,z);if(g){for(const D of N)D.dispose();return}X=P,q=z;for(const D of N)T.add(D.group),V.push(D);if(g||V.length===0)return;T.updateMatrixWorld(!0);const F=new xt;for(const D of V)F.expandByObject(D.baseMesh);F.getSize(f),T.position.sub(F.getCenter(new A)),i=!0,oe();const k={scene:c,strandMaterials:V.flatMap(D=>D.materials.strands),supportMaterials:V.map(D=>D.materials.support),renderer:p,camera:d,requestRender:H,debug:void 0};Y=k,te=requestAnimationFrame(()=>{var D;g||(D=r.current)==null||D.call(r,k)})};Kn().then(P=>{g||(Z=requestAnimationFrame(()=>ae(P)))},P=>{console.error("[HelloModel] failed to load hello.glb",P)});const ce=new ResizeObserver(h);return ce.observe(a),window.addEventListener("resize",h,{passive:!0}),(ke=window.visualViewport)==null||ke.addEventListener("resize",h,{passive:!0}),window.addEventListener("orientationchange",h,{passive:!0}),oe(),()=>{var P;g=!0,W+=1,cancelAnimationFrame(Z),cancelAnimationFrame(te),cancelAnimationFrame($),window.clearTimeout(j),ce.disconnect(),Se.disconnect(),window.removeEventListener("resize",h),(P=window.visualViewport)==null||P.removeEventListener("resize",h),window.removeEventListener("orientationchange",h),document.removeEventListener("visibilitychange",he),p.domElement.removeEventListener("webglcontextlost",x),De(H);for(const z of V)z.dispose();if(L.geometry.dispose(),L.material.dispose(),be.dispose(),ue.dispose(),ne)for(const z of Re)ne.deleteQuery(z);p.dispose(),v.remove(),p.domElement.remove()}},[]),Bt.jsx("div",{ref:t,className:[Lt.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{or as HelloModel,or as default};
