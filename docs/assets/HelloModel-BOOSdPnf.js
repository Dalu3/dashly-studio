import{c as Ee,s as Ve,r as Gt,a as tt,b as Bt,j as Ot}from"./index-D7x7Ku-p.js";import{g as L,V as He,ac as jt,E as at,C as Ue,ad as yt,a8 as Ht,ae as bt,h as Ce,I as Et,z as st,B as be,w as Vt,f as Ut,U as wt,af as Xt,ag as Yt,W as Zt,ah as Kt,ai as Qt,aj as $t,D as Jt,ak as en,al as tn,aa as xt}from"./three-vendor-CYnsQO5e.js";import{m as nn,G as rn}from"./three-gltf-DTLQIlxe.js";const on=340,an=28,sn=105,ln=13,cn=.055,St=1.6,dn=2600,un=75,hn=2900,fn=80,mn=600,pn=22;function nt(n,e,o,t,r,l){const s=(o-n)*t;let a=e+s*l;return a*=Math.exp(-r*l),[n+a*l,a]}function gn(n){const{camera:e,domElement:o,touchElement:t,viewportElement:r,raycastTargets:l,materials:s,frameLoop:a}=n,c=new He(2,2),d=new jt,f=new L(1e6,1e6,1e6),b=new L,T=new L,x=new L;let g=!1,w=0,M=!1,C=!1;const A=new L(1e6,1e6,1e6),u=new L,i=new L,v=new L,y=new L(1e6,1e6,1e6),m=new L;let h=0,S=0,D=0,U=0,H=!1,K=!0,$=!1,he=0,Y=0,_=0,W=!1,q=null;const J=()=>{for(const p of s)p.uniforms.uCursorStrength.value=S,p.uniforms.uCursor.value.copy(A),p.uniforms.uCursorDir.value.copy(i),p.uniforms.uRipplePoint.value.copy(y)},ee=()=>{if(!W||l.length===0)return;W=!1;const p=r.getBoundingClientRect();c.set((he-p.left)/p.width*2-1,-((Y-p.top)/p.height)*2+1),d.setFromCamera(c,e);const O=d.intersectObjects(l,!1)[0];if(O&&O.object instanceof at){const j=O.object.worldToLocal(O.point.clone());if(g){x.copy(j).sub(T);const te=x.length();if(te>1e-6){b.copy(x).multiplyScalar(1/te);const ie=Math.max((_-w)/1e3,1/240),ge=te/ie;h=Math.min(St,Math.max(h,1+ge*cn))}}else h=1;T.copy(j),w=_,g=!0,f.copy(j),M=!0,C||(C=!0,A.copy(j),u.set(0,0,0),y.copy(j),m.set(0,0,0))}else M&&(h=0,g=!1,w=0,M=!1)},k=p=>{if(H)return $=!1,{keepRunning:!1,needsRender:!1};ee();const O=U?Math.min((p-U)/1e3,.05):1/60;U=p,M&&h>1&&(h=1+(h-1)*Math.exp(-7*O));const j=h>=S;[S,D]=nt(S,D,h,j?on:sn,j?an:ln,O),S=Math.min(Math.max(S,-.12),St);for(const B of["x","y","z"])[A[B],u[B]]=nt(A[B],u[B],f[B],dn,un,O),[i[B],v[B]]=nt(i[B],v[B],b[B],hn,fn,O),[y[B],m[B]]=nt(y[B],m[B],f[B],mn,pn,O);const te=Math.abs(h-S)<.0015&&Math.abs(D)<.0015,ie=u.lengthSq()<1e-9&&A.distanceToSquared(f)<1e-11,ge=v.lengthSq()<1e-9&&i.distanceToSquared(b)<1e-9,De=m.lengthSq()<1e-9&&y.distanceToSquared(f)<1e-11;te&&(S=h,D=0);const Te=te&&ie&&ge&&De;return J(),$=!Te,{keepRunning:!Te,needsRender:!0}},F=()=>{$||H||document.hidden||!K||($=!0,U=0,a.request(k))},ce=()=>W||M||Math.abs(h-S)>=.0015||Math.abs(D)>=.0015||u.lengthSq()>=1e-9||A.distanceToSquared(f)>=1e-11||v.lengthSq()>=1e-9||i.distanceToSquared(b)>=1e-9||m.lengthSq()>=1e-9||y.distanceToSquared(f)>=1e-11,de=p=>{document.hidden||!K||(he=p.clientX,Y=p.clientY,_=p.timeStamp,W=!0,F())},xe=p=>{p instanceof PointerEvent&&p.pointerType!=="touch"&&de(p)},se=p=>{p instanceof PointerEvent&&p.pointerType!=="touch"&&de(p)},fe=()=>{W=!1,h=0,g=!1,w=0,b.set(0,0,0),M=!1,F()},me=p=>{(!(p instanceof PointerEvent)||p.pointerType!=="touch")&&fe()},V=p=>{(!(p instanceof PointerEvent)||p.pointerType!=="touch")&&fe()},Se=p=>{p.pointerType!=="touch"||q!==null||(q=p.pointerId,t==null||t.setPointerCapture(p.pointerId),p.preventDefault(),de(p))},Me=p=>{p.pointerId===q&&(p.preventDefault(),de(p))},ue=p=>{p.pointerId===q&&(q=null,t!=null&&t.hasPointerCapture(p.pointerId)&&t.releasePointerCapture(p.pointerId),fe())},Ae=p=>{p.pointerId===q&&(q=null,fe())},ne=typeof IntersectionObserver=="function"?new IntersectionObserver(([p])=>{K=!!(p!=null&&p.isIntersecting),K||(Ee(F),W=!1,h=0,S=0,D=0,$=!1,a.cancel(k),J())},{threshold:.01}):null;ne==null||ne.observe(r);const pe=()=>{document.hidden?(Ee(F),$=!1,a.cancel(k)):ce()&&Ve(F)};return o.addEventListener("pointerdown",xe,{passive:!0}),o.addEventListener("pointermove",se,{passive:!0}),o.addEventListener("pointerleave",me,{passive:!0}),o.addEventListener("pointerup",V,{passive:!0}),o.addEventListener("pointercancel",V,{passive:!0}),t==null||t.addEventListener("pointerdown",Se),t==null||t.addEventListener("pointermove",Me),t==null||t.addEventListener("pointerup",ue),t==null||t.addEventListener("pointercancel",ue),t==null||t.addEventListener("lostpointercapture",Ae),document.addEventListener("visibilitychange",pe),{dispose:()=>{H=!0,q!==null&&(t!=null&&t.hasPointerCapture(q))&&t.releasePointerCapture(q),q=null,o.removeEventListener("pointerdown",xe),o.removeEventListener("pointermove",se),o.removeEventListener("pointerleave",me),o.removeEventListener("pointerup",V),o.removeEventListener("pointercancel",V),t==null||t.removeEventListener("pointerdown",Se),t==null||t.removeEventListener("pointermove",Me),t==null||t.removeEventListener("pointerup",ue),t==null||t.removeEventListener("pointercancel",ue),t==null||t.removeEventListener("lostpointercapture",Ae),document.removeEventListener("visibilitychange",pe),ne==null||ne.disconnect(),Ee(F),$=!1,a.cancel(k)}}}const ot=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`;function yn(n){var t,r;const e={uStrandLength:{value:n.strandLength},uStrandWidth:{value:n.strandWidth},uDrawingBufferSize:{value:new He(1,1)},uMinStrandPixels:{value:n.minStrandPixels},uShadeContrast:{value:n.shadeContrast},uRootColor:{value:new Ue((t=n.rootColor)!=null?t:"#1eb6f7")},uTipColor:{value:new Ue((r=n.tipColor)!=null?r:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uGravity:{value:new L(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new L(1e6,1e6,1e6)},uCursorDir:{value:new L(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new L(1e6,1e6,1e6)}};return new yt({glslVersion:bt,uniforms:e,vertexShader:ot+`
`+wn,fragmentShader:ot+`
`+vn,transparent:!1,depthWrite:!0,depthTest:!0,side:Ht})}const ft=5,Ne=.01,mt=.02;function bn(){const n=ft+1,e=new Float32Array(n*2*3),o=[];for(let r=0;r<n;r+=1){const l=r/ft;for(const s of[-1,1]){const a=r*2+(s===-1?0:1);e[a*3]=s,e[a*3+1]=l,e[a*3+2]=0}}for(let r=0;r<ft;r+=1){const l=r*2,s=l+1,a=l+2,c=l+3;o.push(l,s,c,l,c,a)}const t=new st;return t.setAttribute("position",new be(e,3)),t.setIndex(o),{geometry:t}}function xn(n){let e=n;return()=>{e|=0,e=e+1831565813|0;let o=Math.imul(e^e>>>15,1|e);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function Mt(n,e){const o=n.shade.length,t=[];for(let l=0;l<o;l+=1)e(l)&&t.push(l);const r=(l,s)=>{const a=new Float32Array(t.length*s);return t.forEach((c,d)=>{const f=c*s,b=d*s;for(let T=0;T<s;T+=1)a[b+T]=l[f+T]}),a};return{roots:r(n.roots,3),normals:r(n.normals,3),growth:r(n.growth,4),curl:r(n.curl,4),idle:r(n.idle,4),params:r(n.params,4),shade:r(n.shade,1)}}const Sn=n=>n-Math.floor(n),Z=n=>Sn(Math.sin(n)*43758.5453123),Mn=(n,e,o)=>{const t=Math.min(1,Math.max(0,(o-n)/(e-n)));return t*t*(3-2*t)};function At(n,e,o){const t=o>=0?1:-1,r=-1/(t+o),l=n*e*r;return[1+t*n*n*r,t*l,-t*n,l,t+e*e*r,-e]}function Dt(n,e){const o=n.getAttribute("position"),t=n.getAttribute("normal"),r=n.getIndex();if(!r)throw new Error("sampleRoots requires an indexed geometry");const l=r.count/3,s=new Float64Array(l),a=new L,c=new L,d=new L,f=new L,b=new L;let T=0;for(let h=0;h<l;h+=1){a.fromBufferAttribute(o,r.getX(h*3)),c.fromBufferAttribute(o,r.getX(h*3+1)),d.fromBufferAttribute(o,r.getX(h*3+2));const S=f.subVectors(c,a).cross(b.subVectors(d,a)).length()*.5;T+=S,s[h]=T}const x=xn(1592598103),g=new Float32Array(e*3),w=new Float32Array(e*3),M=new Float32Array(e*4),C=new Float32Array(e*4),A=new Float32Array(e*4),u=new Float32Array(e*4),i=new Float32Array(e),v=new L,y=new L,m=new L;for(let h=0;h<e;h+=1){const S=x()*T;let D=0,U=l-1;for(;D<U;){const ht=D+U>>>1;s[ht]<S?D=ht+1:U=ht}const H=D;a.fromBufferAttribute(o,r.getX(H*3)),c.fromBufferAttribute(o,r.getX(H*3+1)),d.fromBufferAttribute(o,r.getX(H*3+2)),v.fromBufferAttribute(t,r.getX(H*3)),y.fromBufferAttribute(t,r.getX(H*3+1)),m.fromBufferAttribute(t,r.getX(H*3+2));const K=x(),$=x(),he=Math.sqrt(K),Y=1-he,_=$*he,W=1-Y-_;g[h*3]=a.x*Y+c.x*_+d.x*W,g[h*3+1]=a.y*Y+c.y*_+d.y*W,g[h*3+2]=a.z*Y+c.z*_+d.z*W;const q=v.x*Y+y.x*_+m.x*W,J=v.y*Y+y.y*_+m.y*W,ee=v.z*Y+y.z*_+m.z*W,k=Math.hypot(q,J,ee)||1;w[h*3]=q/k,w[h*3+1]=J/k,w[h*3+2]=ee/k;const F=x()*1e3,ce=Z(F*12.9898),de=Z(F*29.7331),xe=Z(F*41.311),se=Z(F*53.913),fe=Z(F*7.719),me=Z(F*13.377),V=Z(F*23.371),Se=Z(F*31.951),Me=Z(F*89.317),ue=Z(F*101.667),Ae=Z(F*113.311),ne=Z(F*127.211),pe=Mn(.92,1,ce),p=.64+(1.32-.64)*ce+pe*.26,O=(.68+(1.48-.68)*de)*(1.06+(.9-1.06)*pe),j=.04+(.32-.04)*xe,te=se*Math.PI*2,ie=.08+(.48-.08)*fe,ge=me*Math.PI*2,De=.55+(1.9-.55)*V,Te=.55+(1.35-.55)*Se,B=ue*Math.PI*2,Xe=.5+(1.1-.5)*Ae,ke=ne*Math.PI*2,[R,z,I,N,G,P]=At(q/k,J/k,ee/k),E=Math.cos(ge),re=Math.sin(ge),_e=E*R+re*N,Ie=E*z+re*G,Ye=E*I+re*P,oe=g[h*3],We=g[h*3+1],qe=g[h*3+2],Fe=Math.floor(oe/Ne),Ge=Math.floor(We/Ne),Ze=Math.floor(qe/Ne),ae=Fe+Ge*57+Ze*113,ve=(Fe+.5+(Z(ae+11.7)-.5)*.48)*Ne,we=(Ge+.5+(Z(ae+37.1)-.5)*.48)*Ne,Le=(Ze+.5+(Z(ae+73.9)-.5)*.48)*Ne,Be=ve-oe,Ke=we-We,Oe=Le-qe,je=Be*(q/k)+Ke*(J/k)+Oe*(ee/k);let le=Be-q/k*je,ye=Ke-J/k*je,ze=Oe-ee/k*je;const Qe=Math.hypot(le,ye,ze);Qe>1e-5?(le/=Qe,ye/=Qe,ze/=Qe):(le=_e,ye=Ie,ze=Ye);let $e=q/k+_e*ie+le*mt,Je=J/k+Ie*ie+ye*mt,et=ee/k+Ye*ie+ze*mt;const it=Math.hypot($e,Je,et)||1;$e/=it,Je/=it,et/=it;const[zt,Nt,kt,_t,Wt,qt]=At($e,Je,et),lt=Math.cos(te),ct=Math.sin(te),dt=Math.cos(ke),ut=Math.sin(ke),X=h*4;M[X]=$e,M[X+1]=Je,M[X+2]=et,M[X+3]=p,C[X]=lt*zt+ct*_t,C[X+1]=lt*Nt+ct*Wt,C[X+2]=lt*kt+ct*qt,C[X+3]=j,A[X]=dt*R+ut*N,A[X+1]=dt*z+ut*G,A[X+2]=dt*I+ut*P,A[X+3]=B,u[X]=O,u[X+1]=Xe,u[X+2]=De,u[X+3]=Te,i[h]=Me}return{roots:g,normals:w,growth:M,curl:C,idle:A,params:u,shade:i}}function An(n){const e=n.getAttribute("position"),o=n.getIndex();if(!o)return 0;const t=o.count/3,r=new L,l=new L,s=new L,a=new L,c=new L;let d=0;for(let f=0;f<t;f+=1)r.fromBufferAttribute(e,o.getX(f*3)),l.fromBufferAttribute(e,o.getX(f*3+1)),s.fromBufferAttribute(e,o.getX(f*3+2)),d+=a.subVectors(l,r).cross(c.subVectors(s,r)).length()*.5;return d}function It(n,e){const o=An(n);return Math.round(o*e)}function pt(n,e,o){const t=o?o.roots.length/3:It(n,e.density),{roots:r,normals:l,growth:s,curl:a,idle:c,params:d,shade:f}=o!=null?o:Dt(n,t),{geometry:b}=bn();b.setAttribute("aRoot",new Ce(r,3)),b.setAttribute("aNormal",new Ce(l,3)),b.setAttribute("aGrowth",new Ce(s,4)),b.setAttribute("aCurl",new Ce(a,4)),b.setAttribute("aIdle",new Ce(c,4)),b.setAttribute("aParams",new Ce(d,4)),b.setAttribute("aShade",new Ce(f,1));const T=yn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),x=new Et(b,T,t);return x.frustumCulled=!1,{mesh:x,material:T}}const Tn=`precision highp float;
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
`;function Cn(n,e){var s,a;const o={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Ue((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Ue((a=e.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},t=new yt({glslVersion:bt,uniforms:o,vertexShader:Ln,fragmentShader:ot+`
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
`;function En(n={}){var t;const e={uRootColor:{value:new Ue((t=n.rootColor)!=null?t:"#1eb6f7")},uLightDir:{value:new L(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new yt({glslVersion:bt,uniforms:e,vertexShader:Pn,fragmentShader:ot+`
`+Rn})}function Dn(n){if(n.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:o,frameLoop:t}=n;let r=!1,l=!1,s=0,a=0,c=0;const d=()=>r&&!document.hidden&&!l,f=w=>{if(l)return{keepRunning:!1,needsRender:!1};const C=1e3/Gt(n.idleFps,w);if(w-s<C)return{keepRunning:d(),needsRender:!1};const A=a?Math.min((w-a)/1e3,.05):0;return a=w,s=w,c+=A,o(c),{keepRunning:d(),needsRender:!0}},b=()=>{d()&&(a=0,s=0,t.request(f))},T=()=>{Ee(b),t.cancel(f)},x=new IntersectionObserver(w=>{r=w.some(M=>M.isIntersecting),d()?Ve(b):T()},{threshold:.01});x.observe(e);const g=()=>{d()?Ve(b):T()};return document.addEventListener("visibilitychange",g),{dispose:()=>{l=!0,T(),x.disconnect(),document.removeEventListener("visibilitychange",g)}}}function In(n,e){for(let r=3;r<=Math.min(256,Math.floor(e/8));r+=1){if(e%r!==0)continue;let l=0,s=0;for(let a=0;a<e-r;a+=7)Math.abs(n(a)-n(a+r))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return r}return null}function Fn(n,e,o){let t=n;for(let r=0;r<e;r+=1){const l=t.map(s=>s.clone());for(let s=0;s<t.length;s+=1){if(!o&&(s===0||s===t.length-1))continue;const a=t[(s-1+t.length)%t.length],c=t[s],d=t[(s+1)%t.length];l[s].copy(a).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}t=l}return t}function zn(n){var a;const e=[];for(let c=0;c<n.length-1;c+=1)e.push(n[c].distanceTo(n[c+1]));const o=[...e].sort((c,d)=>c-d),t=(a=o[o.length>>1])!=null?a:1,r=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const f=n.slice(c,d+1),b=f[0].distanceTo(f[f.length-1])<t*2;b&&f.pop(),r.push({points:f,closed:b})};for(let c=0;c<e.length;c+=1)e[c]>t*6&&(s(l,c),l=c+1);return s(l,n.length-1),r}function Nn(n,e,o,t,r,l,s){const a=n.points,c=a.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const v=a[(i-1+c)%c],y=a[(i+1)%c];let m;n.closed?m=y.clone().sub(v):i===0?m=a[1].clone().sub(a[0]):i===c-1?m=a[c-1].clone().sub(a[c-2]):m=y.clone().sub(v),m.lengthSq()<1e-20&&m.set(0,0,1),d.push(m.normalize())}const f=d[0];let b=new L(0,1,0);Math.abs(f.dot(b))>.9&&b.set(1,0,0),b=b.sub(f.clone().multiplyScalar(b.dot(f))).normalize();const T=[b];for(let i=1;i<c;i+=1){const v=d[i-1],y=d[i],m=T[i-1].clone(),h=v.clone().cross(y);if(h.lengthSq()>1e-20){h.normalize();const S=Math.acos(Math.min(1,Math.max(-1,v.dot(y))));m.applyAxisAngle(h,S)}m.sub(y.clone().multiplyScalar(m.dot(y))),T.push(m.normalize())}const x=[],g=(i,v,y,m)=>{const h=v.clone().cross(y).normalize(),S=l.length/3;for(let D=0;D<o;D+=1){const U=D/o*Math.PI*2,H=Math.cos(U)*m,K=Math.sin(U)*m;l.push(i.x+y.x*H+h.x*K,i.y+y.y*H+h.y*K,i.z+y.z*H+h.z*K)}x.push(S)},w=i=>{const v=l.length/3;return l.push(i.x,i.y,i.z),v};let M=null,C=null;if(!n.closed){M=w(a[0].clone().add(d[0].clone().multiplyScalar(-e*r)));for(let i=t-1;i>=1;i-=1){const v=i/t*(Math.PI/2);g(a[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(v)*e*r)),d[0],T[0],Math.cos(v)*e)}}for(let i=0;i<c;i+=1)g(a[i],d[i],T[i],e);if(!n.closed){for(let i=1;i<t;i+=1){const v=i/t*(Math.PI/2);g(a[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(v)*e*r)),d[c-1],T[c-1],Math.cos(v)*e)}C=w(a[c-1].clone().add(d[c-1].clone().multiplyScalar(e*r)))}const A=x.length,u=n.closed?A:A-1;for(let i=0;i<u;i+=1){const v=x[i],y=x[(i+1)%A];for(let m=0;m<o;m+=1){const h=(m+1)%o;s.push(v+m,y+h,y+m),s.push(v+m,v+h,y+h)}}if(!n.closed&&M!==null&&C!==null){const i=x[0],v=x[A-1];for(let y=0;y<o;y+=1){const m=(y+1)%o;s.push(M,i+m,i+y),s.push(v+y,v+m,C)}}}function kn(n,e={}){var x,g,w,M;const o=(x=e.radius)!=null?x:.007,t=(g=e.radialSegments)!=null?g:24,r=(w=e.capSegments)!=null?w:4,l=(M=e.capLengthScale)!=null?M:1,s=n.getAttribute("position");if(!s)return null;const a=In(C=>s.getY(C),s.count);if(!a)return null;const c=s.count/a,d=[];for(let C=0;C<c;C+=1){const A=new L;for(let u=0;u<a;u+=1){const i=C*a+u;A.x+=s.getX(i),A.y+=s.getY(i),A.z+=s.getZ(i)}d.push(A.divideScalar(a))}const f=[],b=[];for(const C of zn(d))Nn({...C,points:Fn(C.points,2,C.closed)},o,t,r,l,f,b);if(b.length===0)return null;const T=new st;return T.setAttribute("position",new be(new Float32Array(f),3)),T.setIndex(new be(new Uint32Array(b),1)),T.computeVertexNormals(),T.normalizeNormals(),T}const _n=.0085,Wn=1e-5,Q=12,Tt=4,qn=1.5,Lt=1.15;function Gn(n){const e=n.getAttribute("position");if(!e||e.count<Q*2)return n;const o=Math.floor(e.count/Q),t=[];for(let u=0;u<o;u+=1){const i=new L,v=u*Q;for(let y=0;y<Q;y+=1)i.add(new L(e.getX(v+y),e.getY(v+y),e.getZ(v+y)));t.push(i.multiplyScalar(1/Q))}const r=t.findIndex((u,i)=>{const v=t[i+1];return u.x>.06&&u.x<.07&&u.z>-.085&&u.z<-.075&&i>0&&v!==void 0&&u.distanceTo(v)>.02});if(r<1)return n;const l=t[r],s=l.clone().sub(t[r-1]).normalize(),a=r*Q,c=Array.from({length:Q},(u,i)=>new L(e.getX(a+i),e.getY(a+i),e.getZ(a+i))),d=c.reduce((u,i)=>u+i.distanceTo(l),0)/Q;if(!Number.isFinite(d)||d<=0)return n;const f=Array.from(e.array),b=n.getIndex(),T=b?Array.from(b.array):Array.from({length:e.count},(u,i)=>i),x=d*qn,g=l.clone().addScaledVector(s,x);let w=f.length/3;for(const u of c){const i=g.clone().add(u.clone().sub(l));f.push(i.x,i.y,i.z)}for(let u=0;u<Q;u+=1){const i=(u+1)%Q;T.push(a+u,w+i,w+u,a+u,a+i,w+i)}for(let u=1;u<Tt;u+=1){const i=u/Tt*(Math.PI/2),v=Math.cos(i),y=Math.sin(i)*d*Lt,m=f.length/3;for(const h of c){const S=h.clone().sub(l).multiplyScalar(v),D=g.clone().add(S).addScaledVector(s,y);f.push(D.x,D.y,D.z)}for(let h=0;h<Q;h+=1){const S=(h+1)%Q;T.push(w+h,m+S,m+h,w+h,w+S,m+S)}w=m}const M=f.length/3,C=g.clone().addScaledVector(s,d*Lt);f.push(C.x,C.y,C.z);for(let u=0;u<Q;u+=1){const i=(u+1)%Q;T.push(w+u,w+i,M)}const A=new st;return A.setAttribute("position",new be(new Float32Array(f),3)),A.setIndex(new be(new Uint32Array(T),1)),A}function Bn(n,e=_n){const o=kn(n,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(o)return o;let t=Gn(n);return t.deleteAttribute("normal"),t.getAttribute("uv")&&t.deleteAttribute("uv"),t=nn(t,Wn),t.computeVertexNormals(),t.normalizeNormals(),t}const On=.0078,jn=9e-4;function Hn(n,e){var A,u,i,v,y,m,h;const o=(u=(A=e.prepared)==null?void 0:A.geometry)!=null?u:Bn(n,e.quality.strokeRadius),t=En({rootColor:e.rootColor}),r=new at(o,t);r.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:On,strandWidth:(v=e.quality.strandWidth)!=null?v:jn,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(m=(y=e.prepared)==null?void 0:y.strands)!=null?m:Dt(o,It(o,e.quality.density)),a=e.quality.shellCount>0,c=a?[pt(o,l,Mt(s,S=>s.shade[S]<e.quality.detailStrandFraction)),pt(o,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},Mt(s,S=>{const D=s.shade[S],U=Math.abs(s.normals[S*3+1]);return D>=e.quality.detailStrandFraction&&D<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&U<e.quality.silhouetteNormalThreshold}))]:[pt(o,l,s)],d=c.map(S=>S.mesh),f=c.map(S=>S.material),b=d[0],T=f[0],x=a?Cn(o,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const S of f)S.uniforms.uLightDir.value.copy(e.lightDir);x==null||x.material.uniforms.uLightDir.value.copy(e.lightDir),t.uniforms.uLightDir.value.copy(e.lightDir)}const g=new wt;g.add(r),x&&g.add(x.mesh),g.add(...d);const w=gn({camera:e.camera,domElement:(h=e.pointerTarget)!=null?h:window,touchElement:e.touchTarget,viewportElement:e.viewportElement,raycastTargets:[r],materials:f,frameLoop:e.frameLoop}),M=Dn({viewportElement:e.viewportElement,setTime:S=>{for(const D of f)D.uniforms.uTime.value=S},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),C=()=>{M.dispose(),w.dispose(),o.dispose();for(const S of d)S.geometry.dispose();t.dispose();for(const S of f)S.dispose();x==null||x.material.dispose();for(const S of d)S.dispose();x==null||x.mesh.dispose()};return{group:g,baseMesh:r,strandMesh:b,strandMeshes:d,materials:{strand:T,strands:f,support:t,shell:x==null?void 0:x.material},dispose:C}}function Vn(){const n=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let o=1,t=!1,r=!1;const l=s=>{for(const a of e.values())a.reject(s);e.clear()};return n.onmessage=s=>{const a=s.data,c=e.get(a.id);if(c){if(e.delete(a.id),!a.ok){c.reject(new Error(a.message));return}c.resolve(a.meshes.map(Un))}},n.onerror=()=>{r=!0,l(new Error("fur generation worker failed"))},{generate:(s,a,c)=>{if(t||r)return Promise.reject(new Error("fur generation worker is disposed"));const d=o++,f=[],b=s.map(g=>{var u;const w=g.geometry.getAttribute("position"),M=new Float32Array(w.array),C=(u=g.geometry.getIndex())==null?void 0:u.array,A=C instanceof Uint16Array?new Uint16Array(C):C instanceof Uint32Array?new Uint32Array(C):Uint32Array.from({length:w.count},(i,v)=>v);return f.push(M.buffer,A.buffer),{position:M,index:A}}),T={id:d,density:a,strokeRadius:c,geometries:b},x=new Promise((g,w)=>{e.set(d,{resolve:g,reject:w})});return n.postMessage(T,f),x},dispose:()=>{t||(t=!0,n.terminate(),l(new Error("fur generation worker disposed")))}}}function Un(n){const e=new st;return e.setAttribute("position",new be(n.geometry.position,3)),e.setAttribute("normal",new be(n.geometry.normal,3)),e.setIndex(new be(n.geometry.index,1)),{geometry:e,strands:n.strands}}function Xn(n){const e=new Set;let o=0,t=!1,r=!1;const l=s=>{if(r){t=!1;return}let a=!1;for(const c of Array.from(e)){const d=c(s),f=typeof d=="boolean"?d:d.keepRunning;a||(a=typeof d=="boolean"?!0:d.needsRender),f||e.delete(c)}a&&n(),e.size>0?o=requestAnimationFrame(l):t=!1};return{request:s=>{e.add(s),!t&&!r&&(t=!0,o=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{r=!0,e.clear(),cancelAnimationFrame(o),t=!1}}}const Ft=640,Yn=[3,2.75,2.5,2.25,2,1.875,1.75,1.5,1.25,1],Re={high:{name:"high",density:46e5,msaa:!0,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,msaa:!0,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,msaa:!0,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:35e5,msaa:!0,maxDpr:3,maxPhysicalPixels:42e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:23e5,msaa:!0,maxDpr:2.5,maxPhysicalPixels:26e5,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Zn(n,e,o,t){const r=Math.max(1,n)*Math.max(1,e),l=Math.min(o,t.maxDpr);for(const s of Yn)if(s<=l&&r*s*s<=t.maxPhysicalPixels)return s;return Math.min(l,1)}function rt(n,e){if(typeof window<"u"){const o=new URLSearchParams(window.location.search).get("furQuality");if(o&&o in Re)return Re[o]}return e||n<=360?Re["mobile-low"]:n<=Ft?Re.mobile:n<=900?Re.tablet:n<1280?Re.balanced:Re.high}const Kn="/models/hello.glb";let gt=null;function Qn(){return gt||(gt=new Promise((n,e)=>{const o=new Xt;o.onError=t=>{e(new Error(`failed to load ${t}`))},new rn(o).load(Kn,t=>{const r=[];if(t.scene.traverse(l=>{l instanceof at&&r.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),r.length===0){e(new Error("no mesh found in hello.glb"));return}n(r)},void 0,e)})),gt}const $n="_root_1scrz_10",Jn="_interactionSurface_1scrz_42",Ct={root:$n,interactionSurface:Jn},vt={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},er=["swiftshader","llvmpipe","softpipe","software","basic render","microsoft basic","mesa offscreen"];function tr(n){const e=n.getExtension("WEBGL_debug_renderer_info"),o=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER);if(typeof o!="string")return!1;const t=o.toLowerCase();return er.some(r=>t.includes(r))}const Rt=20,Pt=6.5,Pe=1e-7,nr=Math.PI/2,rr="#159fdf";function ir({className:n,debug:e=!1,onWordVisibleChange:o}){const t=tt.useRef(null),r=tt.useRef(o);r.current=o;const l=Bt(),s=tt.useRef(l);return s.current=l,e||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),tt.useEffect(()=>{var Te,B,Xe,ke;const a=t.current;if(!a)return;const c=new Yt,d=new Zt(Rt,1,.1,100);d.position.set(0,0,Pt);const f=document.createElement("canvas"),b=(Te=f.getContext("webgl2"))!=null?Te:f.getContext("webgl");if(!b||tr(b)){a.dataset.webglUnavailable="true";return}const T=rt(window.innerWidth,s.current),x=window.innerWidth<=Ft;let g;try{g=new Kt({antialias:T.msaa,alpha:!0,powerPreference:"high-performance"})}catch{a.dataset.webglUnavailable="true";return}g.setClearAlpha(0),g.shadowMap.enabled=!0,g.shadowMap.type=Qt,g.shadowMap.autoUpdate=!1,a.appendChild(g.domElement);const w=document.createElement("div");w.className=Ct.interactionSurface,((B=a.parentElement)!=null?B:a).appendChild(w),c.add(new $t(14674678,1.5));const M=new Jt(16777215,1.4);M.position.set(-1.1,2,3.4),M.castShadow=!0,M.shadow.mapSize.set(x?1024:2048,x?1024:2048),M.shadow.bias=-8e-4,M.shadow.normalBias=.015,M.shadow.camera.left=-2,M.shadow.camera.right=2,M.shadow.camera.top=2,M.shadow.camera.bottom=-2,M.shadow.camera.near=.5,M.shadow.camera.far=12,M.shadow.radius=2.6,c.add(M);const C=M.position.clone().normalize(),A=new at(new en(24,24),new tn({opacity:.07}));A.position.z=-.24,A.receiveShadow=!0,c.add(A);const u=new wt,i=new wt;i.rotation.x=nr,u.add(i),c.add(u);const v=new L;let y=!1,m=!1,h=!0,S=!document.hidden,D=!0;const U=R=>{var z;R.preventDefault(),D=!1,a.dataset.webglUnavailable="true",delete a.dataset.ready,(z=r.current)==null||z.call(r,!1)};g.domElement.addEventListener("webglcontextlost",U);let H=0,K=0,$=0,he=0,Y=0;const _=[];let W=null,q=null,J=0,ee=0,k=null,F=null;const ce=new He;let de=()=>{};const xe=null,se=xe instanceof WebGL2RenderingContext?xe:null;(Xe=se==null?void 0:se.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const fe=[],me=()=>!m&&D&&h&&S,V=()=>{me()&&((a.clientWidth!==K||a.clientHeight!==$)&&de(),g.render(c,d))},Se=Xn(V),Me=Vn();let ue=()=>{};const Ae=new IntersectionObserver(([R])=>{h=!!(R!=null&&R.isIntersecting),me()?(ue(),V(),Ve(V)):Ee(V)},{threshold:.01});Ae.observe(a);const ne=()=>{S=!document.hidden,me()?Ve(V):Ee(V)};document.addEventListener("visibilitychange",ne);const pe=async(R,z)=>{const I=[];let N;try{N=await Me.generate(R,z.density,z.strokeRadius)}catch(G){if(m)return I;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",G)}if(m){for(const G of N!=null?N:[])G.geometry.dispose();return I}try{for(let G=0;G<R.length;G+=1){const P=R[G],E=Hn(P.geometry,{camera:d,viewportElement:g.domElement,pointerTarget:window,touchTarget:w,quality:z,rootColor:rr,lightDir:C,frameLoop:Se,reducedMotion:s.current,prepared:N==null?void 0:N[G]});E.group.position.copy(P.position),E.group.quaternion.copy(P.quaternion),E.group.scale.copy(P.scale),g.getDrawingBufferSize(ce);for(const re of E.materials.strands)re.uniforms.uDrawingBufferSize.value.copy(ce);I.push(E)}}catch(G){for(const P of I)P.dispose();throw G}return I},p=R=>{k=R;const z=++ee;window.clearTimeout(J),J=window.setTimeout(async()=>{const I=k;if(k=null,m||!y||!q||!I||(W==null?void 0:W.name)===I.name)return;let N;try{N=await pe(q,I)}catch(E){console.error("[HelloModel] failed to rebuild fur quality",E);return}if(m){for(const E of N)E.dispose();return}if(z!==ee){for(const E of N)E.dispose();return}const G=_.slice();for(const E of N)i.add(E.group);for(const E of G)i.remove(E.group);_.splice(0,_.length,...N),W=I,F&&(F.strandMaterials.splice(0,F.strandMaterials.length,...N.flatMap(E=>E.materials.strands)),F.supportMaterials.splice(0,F.supportMaterials.length,...N.map(E=>E.materials.support))),V();for(const E of G)E.dispose();const P=rt(a.clientWidth,s.current);P.name!==W.name&&p(P)},180)},O=()=>{const R=a.clientWidth,z=a.clientHeight;if(R===0||z===0)return;H=R;const I=R/z,N=Math.abs(d.aspect-I)>Pe;N&&(d.aspect=I,d.updateProjectionMatrix());const G=rt(R,s.current),P=Zn(R,z,window.devicePixelRatio,G),E=R!==K||z!==$||Math.abs(P-he)>Pe;if(E){g.setDrawingBufferSize(R,z,P),K=R,$=z,he=P,g.getDrawingBufferSize(ce);for(const le of _)for(const ye of le.materials.strands)ye.uniforms.uDrawingBufferSize.value.copy(ce)}if(!y)return;(W==null?void 0:W.name)!==G.name&&p(G);const re=I<.85?vt.mobile:I<1.4?vt.tablet:vt.desktop,_e=I<.85?-.14:-.24,Ie=2*Math.tan(Rt*Math.PI/360)*Pt,Ye=Ie*I;let oe=re.width*Ye/v.x;oe=Math.min(oe,re.maxHeight*Ie/v.y),oe*=re.sizeScale;const We=oe*re.verticalScale,qe=re.offsetY*Ie,Fe=Math.abs(u.scale.x-oe)>Pe||Math.abs(u.scale.y-We)>Pe||Math.abs(u.scale.z-oe)>Pe||Math.abs(u.position.y-qe)>Pe,Ge=Math.abs(A.position.z-_e)>Pe,Ze=Fe||Ge;Fe&&(u.scale.set(oe,We,oe),u.position.set(0,qe,0)),u.updateMatrixWorld(!0);const ae=new xt;for(const le of _)ae.expandByObject(le.baseMesh);const ve=new He(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),we=new He(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY),Le=new L;for(const le of[ae.min.x,ae.max.x])for(const ye of[ae.min.y,ae.max.y])for(const ze of[ae.min.z,ae.max.z])Le.set(le,ye,ze).project(d),ve.x=Math.min(ve.x,Le.x),ve.y=Math.min(ve.y,Le.y),we.x=Math.max(we.x,Le.x),we.y=Math.max(we.y,Le.y);const Be=(ve.x+1)*.5*R,Ke=(we.x+1)*.5*R,Oe=(1-we.y)*.5*z,je=(1-ve.y)*.5*z;w.style.left=`${Be}px`,w.style.top=`${Oe}px`,w.style.width=`${Ke-Be}px`,w.style.height=`${je-Oe}px`,Ge&&(A.position.z=_e),Fe&&(g.shadowMap.needsUpdate=!0),(E||N||Ze)&&V()};ue=O,de=O;const j=()=>{window.cancelAnimationFrame(Y),Y=window.requestAnimationFrame(()=>{Y=0,O()})};let te=0,ie=0;const ge=async R=>{if(m)return;const z=rt(H,s.current),I=await pe(R,z);if(m){for(const P of I)P.dispose();return}q=R,W=z;for(const P of I)i.add(P.group),_.push(P);if(m||_.length===0)return;i.updateMatrixWorld(!0);const N=new xt;for(const P of _)N.expandByObject(P.baseMesh);N.getSize(v),i.position.sub(N.getCenter(new L)),y=!0,O(),F={scene:c,strandMaterials:_.flatMap(P=>P.materials.strands),supportMaterials:_.map(P=>P.materials.support),renderer:g,camera:d,requestRender:V,debug:void 0},ie=requestAnimationFrame(()=>{var P;m||(a.dataset.ready="true",(P=r.current)==null||P.call(r,!0))})};Qn().then(R=>{m||(te=requestAnimationFrame(()=>ge(R)))},R=>{console.error("[HelloModel] failed to load hello.glb",R)});const De=new ResizeObserver(j);return De.observe(a),window.addEventListener("resize",j,{passive:!0}),(ke=window.visualViewport)==null||ke.addEventListener("resize",j,{passive:!0}),window.addEventListener("orientationchange",j,{passive:!0}),O(),()=>{var R,z;m=!0,(R=r.current)==null||R.call(r,!1),ee+=1,cancelAnimationFrame(te),cancelAnimationFrame(ie),cancelAnimationFrame(Y),window.clearTimeout(J),De.disconnect(),Ae.disconnect(),window.removeEventListener("resize",j),(z=window.visualViewport)==null||z.removeEventListener("resize",j),window.removeEventListener("orientationchange",j),document.removeEventListener("visibilitychange",ne),g.domElement.removeEventListener("webglcontextlost",U),Ee(V);for(const I of _)I.dispose();if(A.geometry.dispose(),A.material.dispose(),Se.dispose(),Me.dispose(),se)for(const I of fe)se.deleteQuery(I);g.dispose(),w.remove(),g.domElement.remove()}},[]),Ot.jsx("div",{ref:t,className:[Ct.root,n].filter(Boolean).join(" "),"aria-hidden":"true"})}export{ir as HelloModel,ir as default};
