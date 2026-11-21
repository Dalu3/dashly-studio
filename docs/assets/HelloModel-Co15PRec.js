import{c as We,s as Qe,r as Gt,a as nt,b as Bt,j as Ot}from"./index-BshaTcSC.js";import{g as C,V as Ke,ac as jt,E as at,C as Je,ad as yt,a8 as Ht,ae as bt,h as Ne,I as Et,z as st,B as Le,w as Ut,f as Vt,U as vt,af as Xt,ag as Yt,W as $t,ah as Zt,ai as Kt,aj as Qt,D as Jt,ak as en,al as tn,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as nn,G as rn}from"./three-gltf-DTLQIlxe.js";const on=340,an=28,sn=105,ln=13,cn=.055,St=1.6,dn=2600,un=75,hn=2900,fn=80,mn=600,pn=22;function rt(n,e,a,t,o,l){const s=(a-n)*t;let r=e+s*l;return r*=Math.exp(-o*l),[n+r*l,r]}function gn(n){const{camera:e,domElement:a,touchElement:t,viewportElement:o,raycastTargets:l,materials:s,frameLoop:r}=n,c=new Ke(2,2),d=new jt,m=new C(1e6,1e6,1e6),b=new C,A=new C,x=new C;let f=!1,S=0,R=!1,L=!1;const M=new C(1e6,1e6,1e6),u=new C,i=new C,w=new C,p=new C(1e6,1e6,1e6),v=new C;let h=0,y=0,P=0,U=0,j=!1,te=!0,ae=!1,ve=0,K=0,Y=0,V=!1,k=null;const q=()=>{for(const g of s)g.uniforms.uCursorStrength.value=y,g.uniforms.uCursor.value.copy(M),g.uniforms.uCursorDir.value.copy(i),g.uniforms.uRipplePoint.value.copy(p)},O=()=>{if(!V||l.length===0)return;V=!1;const g=o.getBoundingClientRect();c.set((ve-g.left)/g.width*2-1,-((K-g.top)/g.height)*2+1),d.setFromCamera(c,e);const $=d.intersectObjects(l,!1)[0];if($&&$.object instanceof at){const ne=$.object.worldToLocal($.point.clone());if(f){x.copy(ne).sub(A);const ie=x.length();if(ie>1e-6){b.copy(x).multiplyScalar(1/ie);const re=Math.max((Y-S)/1e3,1/240),Q=ie/re;h=Math.min(St,Math.max(h,1+Q*cn))}}else h=1;A.copy(ne),S=Y,f=!0,m.copy(ne),R=!0,L||(L=!0,M.copy(ne),u.set(0,0,0),p.copy(ne),v.set(0,0,0))}else R&&(h=0,f=!1,S=0,R=!1)},_=g=>{if(j)return ae=!1,{keepRunning:!1,needsRender:!1};O();const $=U?Math.min((g-U)/1e3,.05):1/60;U=g,R&&h>1&&(h=1+(h-1)*Math.exp(-7*$));const ne=h>=y;[y,P]=rt(y,P,h,ne?on:sn,ne?an:ln,$),y=Math.min(Math.max(y,-.12),St);for(const G of["x","y","z"])[M[G],u[G]]=rt(M[G],u[G],m[G],dn,un,$),[i[G],w[G]]=rt(i[G],w[G],b[G],hn,fn,$),[p[G],v[G]]=rt(p[G],v[G],m[G],mn,pn,$);const ie=Math.abs(h-y)<.0015&&Math.abs(P)<.0015,re=u.lengthSq()<1e-9&&M.distanceToSquared(m)<1e-11,Q=w.lengthSq()<1e-9&&i.distanceToSquared(b)<1e-9,Ge=v.lengthSq()<1e-9&&p.distanceToSquared(m)<1e-11;ie&&(y=h,P=0);const Re=ie&&re&&Q&&Ge;return q(),ae=!Re,{keepRunning:!Re,needsRender:!0}},W=()=>{ae||j||document.hidden||!te||(ae=!0,U=0,r.request(_))},ye=()=>V||R||Math.abs(h-y)>=.0015||Math.abs(P)>=.0015||u.lengthSq()>=1e-9||M.distanceToSquared(m)>=1e-11||w.lengthSq()>=1e-9||i.distanceToSquared(b)>=1e-9||v.lengthSq()>=1e-9||p.distanceToSquared(m)>=1e-11,ue=g=>{document.hidden||!te||(ve=g.clientX,K=g.clientY,Y=g.timeStamp,V=!0,W())},ce=g=>{g instanceof PointerEvent&&g.pointerType!=="touch"&&ue(g)},fe=g=>{g instanceof PointerEvent&&g.pointerType!=="touch"&&ue(g)},me=()=>{V=!1,h=0,f=!1,S=0,b.set(0,0,0),R=!1,W()},Ce=g=>{(!(g instanceof PointerEvent)||g.pointerType!=="touch")&&me()},se=g=>{(!(g instanceof PointerEvent)||g.pointerType!=="touch")&&me()},qe=g=>{g.pointerType!=="touch"||k!==null||(k=g.pointerId,t==null||t.setPointerCapture(g.pointerId),g.preventDefault(),ue(g))},be=g=>{g.pointerId===k&&(g.preventDefault(),ue(g))},H=g=>{g.pointerId===k&&(k=null,t!=null&&t.hasPointerCapture(g.pointerId)&&t.releasePointerCapture(g.pointerId),me())},Pe=g=>{g.pointerId===k&&(k=null,me())},de=typeof IntersectionObserver=="function"?new IntersectionObserver(([g])=>{te=!!(g!=null&&g.isIntersecting),te||(We(W),V=!1,h=0,y=0,P=0,ae=!1,r.cancel(_),q())},{threshold:.01}):null;de==null||de.observe(o);const xe=()=>{document.hidden?(We(W),ae=!1,r.cancel(_)):ye()&&Qe(W)};return a.addEventListener("pointerdown",ce,{passive:!0}),a.addEventListener("pointermove",fe,{passive:!0}),a.addEventListener("pointerleave",Ce,{passive:!0}),a.addEventListener("pointerup",se,{passive:!0}),a.addEventListener("pointercancel",se,{passive:!0}),t==null||t.addEventListener("pointerdown",qe),t==null||t.addEventListener("pointermove",be),t==null||t.addEventListener("pointerup",H),t==null||t.addEventListener("pointercancel",H),t==null||t.addEventListener("lostpointercapture",Pe),document.addEventListener("visibilitychange",xe),{dispose:()=>{j=!0,k!==null&&(t!=null&&t.hasPointerCapture(k))&&t.releasePointerCapture(k),k=null,a.removeEventListener("pointerdown",ce),a.removeEventListener("pointermove",fe),a.removeEventListener("pointerleave",Ce),a.removeEventListener("pointerup",se),a.removeEventListener("pointercancel",se),t==null||t.removeEventListener("pointerdown",qe),t==null||t.removeEventListener("pointermove",be),t==null||t.removeEventListener("pointerup",H),t==null||t.removeEventListener("pointercancel",H),t==null||t.removeEventListener("lostpointercapture",Pe),document.removeEventListener("visibilitychange",xe),de==null||de.disconnect(),We(W),ae=!1,r.cancel(_)}}}const ot=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,wn=`// Strand fragment shader.
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
`;function yn(n){var t,o;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new Ke(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new Je((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new Je((o=n.tipColor)!=null?o:"#6fd4fb")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uGravity:{value:new C(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new C(1e6,1e6,1e6)},uCursorDir:{value:new C(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new C(1e6,1e6,1e6)}};return new yt({glslVersion:bt,uniforms:e,vertexShader:ot+`
`+vn,fragmentShader:ot+`
`+wn,transparent:!1,depthWrite:!0,depthTest:!0,side:Ht})}const ft=5,Ue=.01,mt=.02;function bn(){const n=ft+1,e=new Float32Array(n*2*3),a=[];for(let o=0;o<n;o+=1){const l=o/ft;for(const s of[-1,1]){const r=o*2+(s===-1?0:1);e[r*3]=s,e[r*3+1]=l,e[r*3+2]=0}}for(let o=0;o<ft;o+=1){const l=o*2,s=l+1,r=l+2,c=l+3;a.push(l,s,c,l,c,r)}const t=new st;return t.setAttribute("position",new Le(e,3)),t.setIndex(a),{geometry:t}}function xn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}function Mt(n,e){const a=n.shade.length,t=[];for(let l=0;l<a;l+=1)e(l)&&t.push(l);const o=(l,s)=>{const r=new Float32Array(t.length*s);return t.forEach((c,d)=>{const m=c*s,b=d*s;for(let A=0;A<s;A+=1)r[b+A]=l[m+A]}),r};return{roots:o(n.roots,3),normals:o(n.normals,3),growth:o(n.growth,4),curl:o(n.curl,4),idle:o(n.idle,4),params:o(n.params,4),shade:o(n.shade,1)}}const Sn=n=>n-Math.floor(n),Z=n=>Sn(Math.sin(n)*43758.5453123),Mn=(n,e,a)=>{const t=Math.min(1,Math.max(0,(a-n)/(e-n)));return t*t*(3-2*t)};function At(n,e,a){const t=a>=0?1:-1,o=-1/(t+a),l=n*e*o;return[1+t*n*n*o,t*l,-t*n,l,t+e*e*o,-e]}function Dt(n,e){const a=n.getAttribute("position"),t=n.getAttribute("normal"),o=n.getIndex();if(!o)throw new Error("sampleRoots requires an indexed geometry");const l=o.count/3,s=new Float64Array(l),r=new C,c=new C,d=new C,m=new C,b=new C;let A=0;for(let h=0;h<l;h+=1){r.fromBufferAttribute(a,o.getX(h*3)),c.fromBufferAttribute(a,o.getX(h*3+1)),d.fromBufferAttribute(a,o.getX(h*3+2));const y=m.subVectors(c,r).cross(b.subVectors(d,r)).length()*.5;A+=y,s[h]=A}const x=xn(1592598103),f=new Float32Array(e*3),S=new Float32Array(e*3),R=new Float32Array(e*4),L=new Float32Array(e*4),M=new Float32Array(e*4),u=new Float32Array(e*4),i=new Float32Array(e),w=new C,p=new C,v=new C;for(let h=0;h<e;h+=1){const y=x()*A;let P=0,U=l-1;for(;P<U;){const ht=P+U>>>1;s[ht]<y?P=ht+1:U=ht}const j=P;r.fromBufferAttribute(a,o.getX(j*3)),c.fromBufferAttribute(a,o.getX(j*3+1)),d.fromBufferAttribute(a,o.getX(j*3+2)),w.fromBufferAttribute(t,o.getX(j*3)),p.fromBufferAttribute(t,o.getX(j*3+1)),v.fromBufferAttribute(t,o.getX(j*3+2));const te=x(),ae=x(),ve=Math.sqrt(te),K=1-ve,Y=ae*ve,V=1-K-Y;f[h*3]=r.x*K+c.x*Y+d.x*V,f[h*3+1]=r.y*K+c.y*Y+d.y*V,f[h*3+2]=r.z*K+c.z*Y+d.z*V;const k=w.x*K+p.x*Y+v.x*V,q=w.y*K+p.y*Y+v.y*V,O=w.z*K+p.z*Y+v.z*V,_=Math.hypot(k,q,O)||1;S[h*3]=k/_,S[h*3+1]=q/_,S[h*3+2]=O/_;const W=x()*1e3,ye=Z(W*12.9898),ue=Z(W*29.7331),ce=Z(W*41.311),fe=Z(W*53.913),me=Z(W*7.719),Ce=Z(W*13.377),se=Z(W*23.371),qe=Z(W*31.951),be=Z(W*89.317),H=Z(W*101.667),Pe=Z(W*113.311),de=Z(W*127.211),xe=Mn(.92,1,ye),g=.64+(1.32-.64)*ye+xe*.26,$=(.68+(1.48-.68)*ue)*(1.06+(.9-1.06)*xe),ne=.04+(.32-.04)*ce,ie=fe*Math.PI*2,re=.08+(.48-.08)*me,Q=Ce*Math.PI*2,Ge=.55+(1.9-.55)*se,Re=.55+(1.35-.55)*qe,G=H*Math.PI*2,et=.5+(1.1-.5)*Pe,Ve=de*Math.PI*2,[Xe,Ye,$e,T,z,D]=At(k/_,q/_,O/_),I=Math.cos(Q),N=Math.sin(Q),E=I*Xe+N*T,F=I*Ye+N*z,oe=I*$e+N*D,Se=f[h*3],B=f[h*3+1],Ee=f[h*3+2],J=Math.floor(Se/Ue),De=Math.floor(B/Ue),Fe=Math.floor(Ee/Ue),pe=J+De*57+Fe*113,Me=(J+.5+(Z(pe+11.7)-.5)*.48)*Ue,Ie=(De+.5+(Z(pe+37.1)-.5)*.48)*Ue,le=(Fe+.5+(Z(pe+73.9)-.5)*.48)*Ue,ge=Me-Se,we=Ie-B,Ae=le-Ee,Be=ge*(k/_)+we*(q/_)+Ae*(O/_);let Oe=ge-k/_*Be,ze=we-q/_*Be,je=Ae-O/_*Be;const he=Math.hypot(Oe,ze,je);he>1e-5?(Oe/=he,ze/=he,je/=he):(Oe=E,ze=F,je=oe);let Te=k/_+E*re+Oe*mt,He=q/_+F*re+ze*mt,tt=O/_+oe*re+je*mt;const it=Math.hypot(Te,He,tt)||1;Te/=it,He/=it,tt/=it;const[zt,Nt,_t,kt,Wt,qt]=At(Te,He,tt),lt=Math.cos(ie),ct=Math.sin(ie),dt=Math.cos(Ve),ut=Math.sin(Ve),X=h*4;R[X]=Te,R[X+1]=He,R[X+2]=tt,R[X+3]=g,L[X]=lt*zt+ct*kt,L[X+1]=lt*Nt+ct*Wt,L[X+2]=lt*_t+ct*qt,L[X+3]=ne,M[X]=dt*Xe+ut*T,M[X+1]=dt*Ye+ut*z,M[X+2]=dt*$e+ut*D,M[X+3]=G,u[X]=$,u[X+1]=et,u[X+2]=Ge,u[X+3]=Re,i[h]=be}return{roots:f,normals:S,growth:R,curl:L,idle:M,params:u,shade:i}}function An(n){const e=n.getAttribute("position"),a=n.getIndex();if(!a)return 0;const t=a.count/3,o=new C,l=new C,s=new C,r=new C,c=new C;let d=0;for(let m=0;m<t;m+=1)o.fromBufferAttribute(e,a.getX(m*3)),l.fromBufferAttribute(e,a.getX(m*3+1)),s.fromBufferAttribute(e,a.getX(m*3+2)),d+=r.subVectors(l,o).cross(c.subVectors(s,o)).length()*.5;return d}function Ft(n,e){const a=An(n);return Math.round(a*e)}function pt(n,e,a){const t=a?a.roots.length/3:Ft(n,e.density),{roots:o,normals:l,growth:s,curl:r,idle:c,params:d,shade:m}=a!=null?a:Dt(n,t),{geometry:b}=bn();b.setAttribute("aRoot",new Ne(o,3)),b.setAttribute("aNormal",new Ne(l,3)),b.setAttribute("aGrowth",new Ne(s,4)),b.setAttribute("aCurl",new Ne(r,4)),b.setAttribute("aIdle",new Ne(c,4)),b.setAttribute("aParams",new Ne(d,4)),b.setAttribute("aShade",new Ne(m,1));const A=yn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),x=new Et(b,A,t);return x.frustumCulled=!1,{mesh:x,material:A}}const Tn=`precision highp float;
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
`;function Cn(n,e){var s,r;const a={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Je((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Je((r=e.tipColor)!=null?r:"#6fd4fb")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new yt({glslVersion:bt,uniforms:a,vertexShader:Ln,fragmentShader:ot+`
`+Tn,side:Ut,transparent:!1,depthTest:!0,depthWrite:!0}),o=new Et(n,t,e.count),l=new Vt;for(let c=0;c<e.count;c+=1)o.setMatrixAt(c,l);return o.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,{mesh:o,material:t}}const Pn=`// Support (base mesh) fragment shader.
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
`,Rn=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function En(n={}){var t;const e={uRootColor:{value:new Je((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new yt({glslVersion:bt,uniforms:e,vertexShader:Rn,fragmentShader:ot+`
`+Pn})}function Dn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:a,frameLoop:t}=n;let o=!1,l=!1,s=0,r=0,c=0;const d=()=>o&&!document.hidden&&!l,m=S=>{if(l)return{keepRunning:!1,needsRender:!1};const L=1e3/Gt(n.idleFps,S);if(S-s<L)return{keepRunning:d(),needsRender:!1};const M=r?Math.min((S-r)/1e3,.05):0;return r=S,s=S,c+=M,a(c),{keepRunning:d(),needsRender:!0}},b=()=>{d()&&(r=0,s=0,t.request(m))},A=()=>{We(b),t.cancel(m)},x=new IntersectionObserver(S=>{o=S.some(R=>R.isIntersecting),d()?Qe(b):A()},{threshold:.01});x.observe(e);const f=()=>{d()?Qe(b):A()};return document.addEventListener("visibilitychange",f),{dispose:()=>{l=!0,A(),x.disconnect(),document.removeEventListener("visibilitychange",f)}}}function Fn(n,e){for(let o=3;o<=Math.min(256,Math.floor(e/8));o+=1){if(e%o!==0)continue;let l=0,s=0;for(let r=0;r<e-o;r+=7)Math.abs(n(r)-n(r+o))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return o}return null}function In(n,e,a){let t=n;for(let o=0;o<e;o+=1){const l=t.map(s=>s.clone());for(let s=0;s<t.length;s+=1){if(!a&&(s===0||s===t.length-1))continue;const r=t[(s-1+t.length)%t.length],c=t[s],d=t[(s+1)%t.length];l[s].copy(r).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=l}return t}function zn(n){var r;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const a=[...e].sort((c,d)=>c-d),t=(r=a[a.length>>1])!=null?r:1,o=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const m=n.slice(c,d+1),b=m[0].distanceTo(m[m.length-1])<t*2;b&&m.pop(),o.push({points:m,closed:b})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(s(l,c),l=c+1);return s(l,n.length-1),o}function Nn(n,e,a,t,o,l,s){const r=n.points,c=r.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const w=r[(i-1+c)%c],p=r[(i+1)%c];let v;n.closed?v=p.clone().sub(w):i===0?v=r[1].clone().sub(r[0]):i===c-1?v=r[c-1].clone().sub(r[c-2]):v=p.clone().sub(w),v.lengthSq()<1e-20&&v.set(0,0,1),d.push(v.normalize())}const m=d[0];let b=new C(0,1,0);Math.abs(m.dot(b))>.9&&b.set(1,0,0),b=b.sub(m.clone().multiplyScalar(b.dot(m))).normalize();const A=[b];for(let i=1;i<c;i+=1){const w=d[i-1],p=d[i],v=A[i-1].clone(),h=w.clone().cross(p);if(h.lengthSq()>1e-20){h.normalize();const y=Math.acos(Math.min(1,Math.max(-1,w.dot(p))));v.applyAxisAngle(h,y)}v.sub(p.clone().multiplyScalar(v.dot(p))),A.push(v.normalize())}const x=[],f=(i,w,p,v)=>{const h=w.clone().cross(p).normalize(),y=l.length/3;for(let P=0;P<a;P+=1){const U=P/a*Math.PI*2,j=Math.cos(U)*v,te=Math.sin(U)*v;l.push(i.x+p.x*j+h.x*te,i.y+p.y*j+h.y*te,i.z+p.z*j+h.z*te)}x.push(y)},S=i=>{const w=l.length/3;return l.push(i.x,i.y,i.z),w};let R=null,L=null;if(!n.closed){R=S(r[0].clone().add(d[0].clone().multiplyScalar(-e*o)));for(let i=t-1;i>=1;i-=1){const w=i/t*(Math.PI/2);f(r[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(w)*e*o)),d[0],A[0],Math.cos(w)*e)}}for(let i=0;i<c;i+=1)f(r[i],d[i],A[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const w=i/t*(Math.PI/2);f(r[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(w)*e*o)),d[c-1],A[c-1],Math.cos(w)*e)}L=S(r[c-1].clone().add(d[c-1].clone().multiplyScalar(e*o)))}const M=x.length,u=n.closed?M:M-1;for(let i=0;i<u;i+=1){const w=x[i],p=x[(i+1)%M];for(let v=0;v<a;v+=1){const h=(v+1)%a;s.push(w+v,p+h,p+v),s.push(w+v,w+h,p+h)}}if(!n.closed&&R!==null&&L!==null){const i=x[0],w=x[M-1];for(let p=0;p<a;p+=1){const v=(p+1)%a;s.push(R,i+v,i+p),s.push(w+p,w+v,L)}}}function _n(n,e={}){var x,f,S,R;const a=(x=e.radius)!=null?x:.007,t=(f=e.radialSegments)!=null?f:24,o=(S=e.capSegments)!=null?S:4,l=(R=e.capLengthScale)!=null?R:1,s=n.getAttribute("position");if(!s)return null;const r=Fn(L=>s.getY(L),s.count);if(!r)return null;const c=s.count/r,d=[];for(let L=0;L<c;L+=1){const M=new C;for(let u=0;u<r;u+=1){const i=L*r+u;M.x+=s.getX(i),M.y+=s.getY(i),M.z+=s.getZ(i)}d.push(M.divideScalar(r))}const m=[],b=[];for(const L of zn(d))Nn({...L,points:In(L.points,2,L.closed)},a,t,o,l,m,b);if(b.length===0)return null;const A=new st;return A.setAttribute("position",new Le(new Float32Array(m),3)),A.setIndex(new Le(new Uint32Array(b),1)),A.computeVertexNormals(),A.normalizeNormals(),A}const kn=.0085,Wn=1e-5,ee=12,Tt=4,qn=1.5,Lt=1.15;function Gn(n){const e=n.getAttribute("position");if(!e||e.count<ee*2)return n;const a=Math.floor(e.count/ee),t=[];for(let u=0;u<a;u+=1){const i=new C,w=u*ee;for(let p=0;p<ee;p+=1)i.add(new C(e.getX(w+p),e.getY(w+p),e.getZ(w+p)));t.push(i.multiplyScalar(1/ee))}const o=t.findIndex((u,i)=>{const w=t[i+1];return u.x>.06&&u.x<.07&&u.z>-.085&&u.z<-.075&&i>0&&w!==void 0&&u.distanceTo(w)>.02});if(o<1)return n;const l=t[o],s=l.clone().sub(t[o-1]).normalize(),r=o*ee,c=Array.from({length:ee},(u,i)=>new C(e.getX(r+i),e.getY(r+i),e.getZ(r+i))),d=c.reduce((u,i)=>u+i.distanceTo(l),0)/ee;if(!Number.isFinite(d)||d<=0)return n;const m=Array.from(e.array),b=n.getIndex(),A=b?Array.from(b.array):Array.from({length:e.count},(u,i)=>i),x=d*qn,f=l.clone().addScaledVector(s,x);let S=m.length/3;for(const u of c){const i=f.clone().add(u.clone().sub(l));m.push(i.x,i.y,i.z)}for(let u=0;u<ee;u+=1){const i=(u+1)%ee;A.push(r+u,S+i,S+u,r+u,r+i,S+i)}for(let u=1;u<Tt;u+=1){const i=u/Tt*(Math.PI/2),w=Math.cos(i),p=Math.sin(i)*d*Lt,v=m.length/3;for(const h of c){const y=h.clone().sub(l).multiplyScalar(w),P=f.clone().add(y).addScaledVector(s,p);m.push(P.x,P.y,P.z)}for(let h=0;h<ee;h+=1){const y=(h+1)%ee;A.push(S+h,v+y,v+h,S+h,S+y,v+y)}S=v}const R=m.length/3,L=f.clone().addScaledVector(s,d*Lt);m.push(L.x,L.y,L.z);for(let u=0;u<ee;u+=1){const i=(u+1)%ee;A.push(S+u,S+i,R)}const M=new st;return M.setAttribute("position",new Le(new Float32Array(m),3)),M.setIndex(new Le(new Uint32Array(A),1)),M}function Bn(n,e=kn){const a=_n(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(a)return a;let t=Gn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=nn(t,Wn),t.computeVertexNormals(),t.normalizeNormals(),t}const On=.0078,jn=9e-4;function Hn(n,e){var M,u,i,w,p,v,h;const a=(u=(M=e.prepared)==null?void 0:M.geometry)!=null?u:Bn(n,e.quality.strokeRadius),t=En({rootColor:e.rootColor}),o=new at(a,t);o.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:On,strandWidth:(w=e.quality.strandWidth)!=null?w:jn,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(v=(p=e.prepared)==null?void 0:p.strands)!=null?v:Dt(a,Ft(a,e.quality.density)),r=e.quality.shellCount>0,c=r?[pt(a,l,Mt(s,y=>s.shade[y]<e.quality.detailStrandFraction)),pt(a,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},Mt(s,y=>{const P=s.shade[y],U=Math.abs(s.normals[y*3+1]);return P>=e.quality.detailStrandFraction&&P<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&U<e.quality.silhouetteNormalThreshold}))]:[pt(a,l,s)],d=c.map(y=>y.mesh),m=c.map(y=>y.material),b=d[0],A=m[0],x=r?Cn(a,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const y of m)y.uniforms.uLightDir.value.copy(e.lightDir);x==null||x.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const f=new vt;f.add(o),x&&f.add(x.mesh),f.add(...d);const S=gn({camera:e.camera,domElement:(h=e.pointerTarget)!=null?h:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[o],materials:m,frameLoop:e.frameLoop}),R=Dn({viewportElement:e.viewportElement,setTime:y=>{for(const P of m)P.uniforms.uTime.value=y},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),L=()=>{R.dispose(),S.dispose(),a.dispose();for(const y of d)y.geometry.dispose();t.dispose();for(const y of m)y.dispose();x==null||x.material.dispose();for(const y of d)y.dispose();x==null||x.mesh.dispose()};return{group:f,baseMesh:o,strandMesh:b,strandMeshes:d,materials:{strand:A,strands:m,support:t,shell:x==null?void 0:x.material},dispose:L}}function Un(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let a=1,t=!1,o=!1;const l=s=>{for(const r of e.values())r.reject(s);e.clear()};return n.onmessage=s=>{const r=s.data,c=e.get(r.id);if(c){if(e.delete(r.id),!r.ok){c.reject(new Error(r.message));return}c.resolve(r.meshes.map(Vn))}},n.onerror=()=>{o=!0,l(new Error("fur generation worker failed"))},{generate:(s,r,c)=>{if(t||o)return Promise.reject(new Error("fur generation worker is disposed"));const d=a++,m=[],b=s.map(f=>{var u;const S=f.geometry.getAttribute("position"),R=new Float32Array(S.array),L=(u=f.geometry.getIndex())==null?void 0:u.array,M=L instanceof Uint16Array?new Uint16Array(L):L instanceof Uint32Array?new Uint32Array(L):Uint32Array.from({length:S.count},(i,w)=>w);return m.push(R.buffer,M.buffer),{position:R,index:M}}),A={id:d,density:r,strokeRadius:c,geometries:b},x=new Promise((f,S)=>{e.set(d,{resolve:f,reject:S})});return n.postMessage(A,m),x},dispose:()=>{t||(t=!0,n.terminate(),l(new Error("fur generation worker disposed")))}}}function Vn(n){const e=new st;return e.setAttribute("position",new Le(n.geometry.position,3)),e.setAttribute("normal",new Le(n.geometry.normal,3)),e.setIndex(new Le(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Xn(n){const e=new Set;let a=0,t=!1,o=!1;const l=s=>{if(o){t=!1;return}let r=!1;for(const c of Array.from(e)){const d=c(s),m=typeof d=="boolean"?d:d.keepRunning;r||(r=typeof d=="boolean"?!0:d.needsRender),m||e.delete(c)}r&&n(),e.size>0?a=requestAnimationFrame(l):t=!1};return{request:s=>{e.add(s),!t&&!o&&(t=!0,a=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{o=!0,e.clear(),cancelAnimationFrame(a),t=!1}}}const It=640,Yn=[3,2.75,2.5,2.25,2,1.875,1.75,1.5,1.25,1],_e={high:{name:"high",density:46e5,msaa:!0,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,msaa:!0,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,msaa:!0,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:35e5,msaa:!0,maxDpr:3,maxPhysicalPixels:42e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-coarse":{name:"mobile-coarse",density:22e5,msaa:!0,maxDpr:3,maxPhysicalPixels:42e5,idleFps:20,strokeRadius:.00875,strandLength:.0088,strandWidth:.0016,minStrandPixels:1.05,shadeContrast:.74,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,msaa:!0,maxDpr:2.5,maxPhysicalPixels:26e5,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function $n(n,e,a,t){const o=Math.max(1,n)*Math.max(1,e),l=Math.min(a,t.maxDpr);for(const s of Yn)if(s<=l&&o*s*s<=t.maxPhysicalPixels)return s;return Math.min(l,1)}function Ze(n,e){if(typeof window<"u"){const a=new URLSearchParams(window.location.search).get("furQuality");if(a&&a in _e)return _e[a]}return e||n<=360?_e["mobile-low"]:n<=It?_e.mobile:n<=900?_e.tablet:n<1280?_e.balanced:_e.high}const Zn="/models/hello.glb";let gt=null;function Kn(){return gt||(gt=new Promise((n,e)=>{const a=new Xt;a.onError=t=>{e(new Error(`failed to load ${t}`))},new rn(a).load(Zn,t=>{const o=[];if(t.scene.traverse(l=>{l instanceof at&&o.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),o.length===0){e(new Error("no mesh found in hello.glb"));return}n(o)},void 0,e)})),gt}const Qn="_root_1scrz_10",Jn="_interactionSurface_1scrz_42",Ct={root:Qn,interactionSurface:Jn},wt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},er=["swiftshader","llvmpipe","softpipe","software","basic render","microsoft basic","mesa offscreen"];function tr(n){const e=n.getExtension("WEBGL_debug_renderer_info"),a=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER);if(typeof a!="string")return!1;const t=a.toLowerCase();return er.some(o=>t.includes(o))}const Pt=20,Rt=6.5,ke=1e-7,nr=Math.PI/2,rr="#159fdf";function ir({className:n,debug:e=!1,onWordVisibleChange:a}){const t=nt.useRef(null),o=nt.useRef(a);o.current=a;const l=Bt(),s=nt.useRef(l);return s.current=l,e||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),nt.useEffect(()=>{var Ve,Xe,Ye,$e;const r=t.current;if(!r)return;const c=new Yt,d=new $t(Pt,1,.1,100);d.position.set(0,0,Rt);const m=document.createElement("canvas"),b=(Ve=m.getContext("webgl2"))!=null?Ve:m.getContext("webgl");if(!b||tr(b)){r.dataset.webglUnavailable="true";return}const A=Ze(window.innerWidth,s.current),x=window.innerWidth<=It;let f;try{f=new Zt({antialias:A.msaa,alpha:!0,powerPreference:"high-performance"})}catch{r.dataset.webglUnavailable="true";return}f.setClearAlpha(0),f.shadowMap.enabled=!0,f.shadowMap.type=Kt,f.shadowMap.autoUpdate=!1,r.appendChild(f.domElement);let S=0,R=null,L=null;if(new URLSearchParams(window.location.search).has("furDebug")){for(const B of r.querySelectorAll("[data-fur-debug]"))B.remove();const T=document.createElement("pre");T.dataset.furDebug="true",R=T,T.style.cssText=["position:absolute","inset:auto auto 8px 8px","z-index:99","margin:0","padding:8px 10px","font:11px/1.45 ui-monospace,monospace","color:#0b2233","background:rgba(255,255,255,.82)","border-radius:8px","pointer-events:none","white-space:pre"].join(";"),r.appendChild(T);let z=f.info.render.frame,D=performance.now(),I=0,N=0,E=D,F=0;const oe=B=>{N=Math.max(N,B-E),E=B,I+=1,F=requestAnimationFrame(oe)};F=requestAnimationFrame(oe),L=()=>cancelAnimationFrame(F);const Se=()=>{const B=f.getContext(),Ee=performance.now(),J=Math.max(Ee-D,1),De=(f.info.render.frame-z)*1e3/J,Fe=I*1e3/J,pe=N;z=f.info.render.frame,D=Ee,I=0,N=0;const Me={x:f.domElement.width,y:f.domElement.height},Ie=Ze(r.clientWidth||window.innerWidth,s.current),le=B.getExtension("WEBGL_debug_renderer_info");T.textContent=[`preset   ${Ie.name}`,`css      ${r.clientWidth}x${r.clientHeight}`,`buffer   ${Me.x}x${Me.y}`,`dpr      ${window.devicePixelRatio} -> ${(Me.x/Math.max(r.clientWidth,1)).toFixed(2)}`,`samples  ${B.getParameter(B.SAMPLES)} / max ${"MAX_SAMPLES"in B?String(B.getParameter(B.MAX_SAMPLES)):"n/a (webgl1)"}`,`asked    msaa ${String(Ie.msaa)}`,`drawn    ${De.toFixed(1)}/s of ${Ie.idleFps} target`,`screen   ${Fe.toFixed(1)}/s, worst gap ${pe.toFixed(0)}ms`,`tris     ${(f.info.render.triangles/1e3).toFixed(0)}k`,`gpu      ${le?String(B.getParameter(le.UNMASKED_RENDERER_WEBGL)).slice(0,34):"hidden"}`].join(`
`)};Se(),S=window.setInterval(Se,1e3)}const M=document.createElement("div");M.className=Ct.interactionSurface,((Xe=r.parentElement)!=null?Xe:r).appendChild(M),c.add(new Qt(14674678,1.5));const u=new Jt(16777215,1.4);u.position.set(-1.1,2,3.4),u.castShadow=!0,u.shadow.mapSize.set(x?1024:2048,x?1024:2048),u.shadow.bias=-8e-4,u.shadow.normalBias=.015,u.shadow.camera.left=-2,u.shadow.camera.right=2,u.shadow.camera.top=2,u.shadow.camera.bottom=-2,u.shadow.camera.near=.5,u.shadow.camera.far=12,u.shadow.radius=2.6,c.add(u);const i=u.position.clone().normalize(),w=new at(new en(24,24),new tn({opacity:.07}));w.position.z=-.24,w.receiveShadow=!0,c.add(w);const p=new vt,v=new vt;v.rotation.x=nr,p.add(v),c.add(p);const h=new C;let y=!1,P=!1,U=!0,j=!document.hidden,te=!0;const ae=T=>{var z;T.preventDefault(),te=!1,r.dataset.webglUnavailable="true",delete r.dataset.ready,(z=o.current)==null||z.call(o,!1)};f.domElement.addEventListener("webglcontextlost",ae);let ve=0,K=0,Y=0,V=0,k=0;const q=[];let O=null,_=null,W=0,ye=0,ue=null,ce=null;const fe=new Ke;let me=()=>{};const Ce=null,se=Ce instanceof WebGL2RenderingContext?Ce:null;(Ye=se==null?void 0:se.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const qe=[],be=()=>!P&&te&&U&&j,H=()=>{be()&&((r.clientWidth!==K||r.clientHeight!==Y)&&me(),f.render(c,d))},Pe=Xn(H),de=Un();let xe=()=>{};const g=new IntersectionObserver(([T])=>{U=!!(T!=null&&T.isIntersecting),be()?(xe(),H(),Qe(H)):We(H)},{threshold:.01});g.observe(r);const $=()=>{j=!document.hidden,be()?Qe(H):We(H)};document.addEventListener("visibilitychange",$);const ne=async(T,z)=>{const D=[];let I;try{I=await de.generate(T,z.density,z.strokeRadius)}catch(N){if(P)return D;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",N)}if(P){for(const N of I!=null?I:[])N.geometry.dispose();return D}try{for(let N=0;N<T.length;N+=1){const E=T[N],F=Hn(E.geometry,{camera:d,viewportElement:f.domElement,pointerTarget:window,touchTarget:M,quality:z,rootColor:rr,lightDir:i,frameLoop:Pe,reducedMotion:s.current,prepared:I==null?void 0:I[N]});F.group.position.copy(E.position),F.group.quaternion.copy(E.quaternion),F.group.scale.copy(E.scale),f.getDrawingBufferSize(fe);for(const oe of F.materials.strands)oe.uniforms.uDrawingBufferSize.value.copy(fe);D.push(F)}}catch(N){for(const E of D)E.dispose();throw N}return D},ie=T=>{ue=T;const z=++ye;window.clearTimeout(W),W=window.setTimeout(async()=>{const D=ue;if(ue=null,P||!y||!_||!D||(O==null?void 0:O.name)===D.name)return;let I;try{I=await ne(_,D)}catch(F){console.error("[HelloModel] failed to rebuild fur quality",F);return}if(P){for(const F of I)F.dispose();return}if(z!==ye){for(const F of I)F.dispose();return}const N=q.slice();for(const F of I)v.add(F.group);for(const F of N)v.remove(F.group);q.splice(0,q.length,...I),O=D,ce&&(ce.strandMaterials.splice(0,ce.strandMaterials.length,...I.flatMap(F=>F.materials.strands)),ce.supportMaterials.splice(0,ce.supportMaterials.length,...I.map(F=>F.materials.support))),H();for(const F of N)F.dispose();const E=Ze(r.clientWidth,s.current);E.name!==O.name&&ie(E)},180)},re=()=>{const T=r.clientWidth,z=r.clientHeight;if(T===0||z===0)return;ve=T;const D=T/z,I=Math.abs(d.aspect-D)>ke;I&&(d.aspect=D,d.updateProjectionMatrix());const N=Ze(T,s.current),E=$n(T,z,window.devicePixelRatio,N),F=T!==K||z!==Y||Math.abs(E-V)>ke;if(F){f.setDrawingBufferSize(T,z,E),K=T,Y=z,V=E,f.getDrawingBufferSize(fe);for(const he of q)for(const Te of he.materials.strands)Te.uniforms.uDrawingBufferSize.value.copy(fe)}if(!y)return;(O==null?void 0:O.name)!==N.name&&ie(N);const oe=D<.85?wt.mobile:D<1.4?wt.tablet:wt.desktop,Se=D<.85?-.14:-.24,B=2*Math.tan(Pt*Math.PI/360)*Rt,Ee=B*D;let J=oe.width*Ee/h.x;J=Math.min(J,oe.maxHeight*B/h.y),J*=oe.sizeScale;const De=J*oe.verticalScale,Fe=oe.offsetY*B,pe=Math.abs(p.scale.x-J)>ke||Math.abs(p.scale.y-De)>ke||Math.abs(p.scale.z-J)>ke||Math.abs(p.position.y-Fe)>ke,Me=Math.abs(w.position.z-Se)>ke,Ie=pe||Me;pe&&(p.scale.set(J,De,J),p.position.set(0,Fe,0)),p.updateMatrixWorld(!0);const le=new xt;for(const he of q)le.expandByObject(he.baseMesh);const ge=new Ke(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),we=new Ke(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),Ae=new C;for(const he of[le.min.x,le.max.x])for(const Te of[le.min.y,le.max.y])for(const He of[le.min.z,le.max.z])Ae.set(he,Te,He).project(d),ge.x=Math.min(ge.x,Ae.x),ge.y=Math.min(ge.y,Ae.y),we.x=Math.max(we.x,Ae.x),we.y=Math.max(we.y,Ae.y);const Be=(ge.x+1)*.5*T,Oe=(we.x+1)*.5*T,ze=(1-we.y)*.5*z,je=(1-ge.y)*.5*z;M.style.left=`${Be}px`,M.style.top=`${ze}px`,M.style.width=`${Oe-Be}px`,M.style.height=`${je-ze}px`,Me&&(w.position.z=Se),pe&&(f.shadowMap.needsUpdate=!0),(F||I||Ie)&&H()};xe=re,me=re;const Q=()=>{window.cancelAnimationFrame(k),k=window.requestAnimationFrame(()=>{k=0,re()})};let Ge=0,Re=0;const G=async T=>{if(P)return;const z=Ze(ve,s.current),D=await ne(T,z);if(P){for(const E of D)E.dispose();return}_=T,O=z;for(const E of D)v.add(E.group),q.push(E);if(P||q.length===0)return;v.updateMatrixWorld(!0);const I=new xt;for(const E of q)I.expandByObject(E.baseMesh);I.getSize(h),v.position.sub(I.getCenter(new C)),y=!0,re(),ce={scene:c,strandMaterials:q.flatMap(E=>E.materials.strands),supportMaterials:q.map(E=>E.materials.support),renderer:f,camera:d,requestRender:H,debug:void 0},Re=requestAnimationFrame(()=>{var E;P||(r.dataset.ready="true",(E=o.current)==null||E.call(o,!0))})};Kn().then(T=>{P||(Ge=requestAnimationFrame(()=>G(T)))},T=>{console.error("[HelloModel] failed to load hello.glb",T)});const et=new ResizeObserver(Q);return et.observe(r),window.addEventListener("resize",Q,{passive:!0}),($e=window.visualViewport)==null||$e.addEventListener("resize",Q,{passive:!0}),window.addEventListener("orientationchange",Q,{passive:!0}),re(),()=>{var T,z;P=!0,(T=o.current)==null||T.call(o,!1),ye+=1,cancelAnimationFrame(Ge),cancelAnimationFrame(Re),cancelAnimationFrame(k),window.clearTimeout(W),window.clearInterval(S),L==null||L(),R==null||R.remove(),et.disconnect(),g.disconnect(),window.removeEventListener("resize",Q),(z=window.visualViewport)==null||z.removeEventListener("resize",Q),window.removeEventListener("orientationchange",Q),document.removeEventListener("visibilitychange",$),f.domElement.removeEventListener("webglcontextlost",ae),We(H);for(const D of q)D.dispose();if(w.geometry.dispose(),w.material.dispose(),Pe.dispose(),de.dispose(),se)for(const D of qe)se.deleteQuery(D);f.dispose(),M.remove(),f.domElement.remove()}},[]),Ot.jsx("div",{ref:t,className:[Ct.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{ir as HelloModel,ir as default};
