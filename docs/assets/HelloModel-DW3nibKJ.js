import{c as pe,s as Se,r as Pt,a as Ie,u as Dt,j as It}from"./index-C1dztu7B.js";import{g as T,V as Ft,ac as zt,E as $e,C as Qe,ad as bt,a8 as kt,ae as yt,h as he,I as Nt,z as ze,B as ce,U as Ke,af as _t,W as Gt,ag as qt,ah as Wt,ai as Ot,D as Bt,aj as Ht,ak as Vt,aa as jt}from"./three-vendor-BWiavw-v.js";import{m as Ut}from"./three-gltf-hKZJeKbV.js";import{preloadHelloGeometries as Xt}from"./preloadHello-CMziDfQd.js";const Yt=340,Zt=28,Qt=105,Kt=13,Jt=.055,ft=1.6,$t=2600,en=75,tn=2900,nn=80,on=600,rn=22;function Fe(t,e,n,s,i,d){const r=(n-t)*s;let o=e+r*d;return o*=Math.exp(-i*d),[t+o*d,o]}function sn(t){const{camera:e,domElement:n,viewportElement:s,raycastTargets:i,materials:d,frameLoop:r}=t,o=new Ft(2,2),l=new zt,c=new T(1e6,1e6,1e6),u=new T,f=new T,A=new T;let b=!1,y=0,g=!1,E=!1;const S=new T(1e6,1e6,1e6),x=new T,m=new T,a=new T,w=new T(1e6,1e6,1e6),v=new T;let p=0,h=0,I=0,N=0,G=!1,F=!0,O=!1,oe=0,te=0,V=0,_=!1;const K=()=>{for(const C of d)C.uniforms.uCursorStrength.value=h,C.uniforms.uCursor.value.copy(S),C.uniforms.uCursorDir.value.copy(m),C.uniforms.uRipplePoint.value.copy(w)},X=()=>{if(!_||i.length===0)return;_=!1;const C=s.getBoundingClientRect();o.set((oe-C.left)/C.width*2-1,-((te-C.top)/C.height)*2+1),l.setFromCamera(o,e);const j=l.intersectObjects(i,!1)[0];if(j&&j.object instanceof $e){const Q=j.object.worldToLocal(j.point.clone());if(b){A.copy(Q).sub(f);const ee=A.length();if(ee>1e-6){u.copy(A).multiplyScalar(1/ee);const ie=Math.max((V-y)/1e3,1/240),le=ee/ie;p=Math.min(ft,Math.max(p,1+le*Jt))}}else p=1;f.copy(Q),y=V,b=!0,c.copy(Q),g=!0,E||(E=!0,S.copy(Q),x.set(0,0,0),w.copy(Q),v.set(0,0,0))}else g&&(p=0,b=!1,y=0,g=!1)},Z=C=>{if(G)return O=!1,{keepRunning:!1,needsRender:!1};X();const j=N?Math.min((C-N)/1e3,.05):1/60;N=C,g&&p>1&&(p=1+(p-1)*Math.exp(-7*j));const Q=p>=h;[h,I]=Fe(h,I,p,Q?Yt:Qt,Q?Zt:Kt,j),h=Math.min(Math.max(h,-.12),ft);for(const M of["x","y","z"])[S[M],x[M]]=Fe(S[M],x[M],c[M],$t,en,j),[m[M],a[M]]=Fe(m[M],a[M],u[M],tn,nn,j),[w[M],v[M]]=Fe(w[M],v[M],c[M],on,rn,j);const ee=Math.abs(p-h)<.0015&&Math.abs(I)<.0015,ie=x.lengthSq()<1e-9&&S.distanceToSquared(c)<1e-11,le=a.lengthSq()<1e-9&&m.distanceToSquared(u)<1e-9,R=v.lengthSq()<1e-9&&w.distanceToSquared(c)<1e-11;ee&&(h=p,I=0);const q=ee&&ie&&le&&R;return K(),O=!q,{keepRunning:!q,needsRender:!0}},B=()=>{O||G||document.hidden||!F||(O=!0,N=0,r.request(Z))},P=()=>_||g||Math.abs(p-h)>=.0015||Math.abs(I)>=.0015||x.lengthSq()>=1e-9||S.distanceToSquared(c)>=1e-11||a.lengthSq()>=1e-9||m.distanceToSquared(u)>=1e-9||v.lengthSq()>=1e-9||w.distanceToSquared(c)>=1e-11,W=C=>{!(C instanceof PointerEvent)||document.hidden||!F||(oe=C.clientX,te=C.clientY,V=C.timeStamp,_=!0,B())},re=C=>{W(C)},de=C=>{W(C)},se=()=>{_=!1,p=0,b=!1,y=0,u.set(0,0,0),g=!1,B()},ne=()=>{se()},J=typeof IntersectionObserver=="function"?new IntersectionObserver(([C])=>{F=!!(C!=null&&C.isIntersecting),F||(pe(B),_=!1,p=0,h=0,I=0,O=!1,r.cancel(Z),K())},{threshold:.01}):null;J==null||J.observe(s);const ae=()=>{document.hidden?(pe(B),O=!1,r.cancel(Z)):P()&&Se(B)};return n.addEventListener("pointerdown",re,{passive:!0}),n.addEventListener("pointermove",de,{passive:!0}),n.addEventListener("pointerleave",se,{passive:!0}),n.addEventListener("pointerup",ne,{passive:!0}),n.addEventListener("pointercancel",ne,{passive:!0}),document.addEventListener("visibilitychange",ae),{dispose:()=>{G=!0,n.removeEventListener("pointerdown",re),n.removeEventListener("pointermove",de),n.removeEventListener("pointerleave",se),n.removeEventListener("pointerup",ne),n.removeEventListener("pointercancel",ne),document.removeEventListener("visibilitychange",ae),J==null||J.disconnect(),pe(B),O=!1,r.cancel(Z)}}}const Je=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,an=`// Strand fragment shader.
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
`,ln=`// Strand vertex shader — real, individually-placed hair geometry.
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

    vec3 worldPos = worldCentre + widthAxis * (width * side * 0.5);

    vStrandT = t;
    vShade = aShade;
    vWorldNormal = worldGrowDir;
    vWorldPos = worldPos;

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}
`;function cn(t){var s,i;const e={uStrandLength:{value:t.strandLength},uStrandWidth:{value:t.strandWidth},uRootColor:{value:new Qe((s=t.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Qe((i=t.tipColor)!=null?i:"#6fd4fb")},uLightDir:{value:new T(-.4,.8,.6).normalize()},uGravity:{value:new T(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new T(1e6,1e6,1e6)},uCursorDir:{value:new T(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new T(1e6,1e6,1e6)}};return new bt({glslVersion:yt,uniforms:e,vertexShader:Je+`
`+ln,fragmentShader:Je+`
`+an,transparent:!1,depthWrite:!0,depthTest:!0,side:kt})}const Ue=5,we=.01,Xe=.02;function dn(){const t=Ue+1,e=new Float32Array(t*2*3),n=[];for(let i=0;i<t;i+=1){const d=i/Ue;for(const r of[-1,1]){const o=i*2+(r===-1?0:1);e[o*3]=r,e[o*3+1]=d,e[o*3+2]=0}}for(let i=0;i<Ue;i+=1){const d=i*2,r=d+1,o=d+2,l=d+3;n.push(d,r,l,d,l,o)}const s=new ze;return s.setAttribute("position",new ce(e,3)),s.setIndex(n),{geometry:s}}function un(t){let e=t;return()=>{e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const hn=t=>t-Math.floor(t),U=t=>hn(Math.sin(t)*43758.5453123),fn=(t,e,n)=>{const s=Math.min(1,Math.max(0,(n-t)/(e-t)));return s*s*(3-2*s)};function mt(t,e,n){const s=n>=0?1:-1,i=-1/(s+n),d=t*e*i;return[1+s*t*t*i,s*d,-s*t,d,s+e*e*i,-e]}function mn(t,e){const n=t.getAttribute("position"),s=t.getAttribute("normal"),i=t.getIndex();if(!i)throw new Error("sampleRoots requires an indexed geometry");const d=i.count/3,r=new Float64Array(d),o=new T,l=new T,c=new T,u=new T,f=new T;let A=0;for(let h=0;h<d;h+=1){o.fromBufferAttribute(n,i.getX(h*3)),l.fromBufferAttribute(n,i.getX(h*3+1)),c.fromBufferAttribute(n,i.getX(h*3+2));const I=u.subVectors(l,o).cross(f.subVectors(c,o)).length()*.5;A+=I,r[h]=A}const b=un(1592598103),y=new Float32Array(e*3),g=new Float32Array(e*3),E=new Float32Array(e*4),S=new Float32Array(e*4),x=new Float32Array(e*4),m=new Float32Array(e*4),a=new Float32Array(e),w=new T,v=new T,p=new T;for(let h=0;h<e;h+=1){const I=b()*A;let N=0,G=d-1;for(;N<G;){const je=N+G>>>1;r[je]<I?N=je+1:G=je}const F=N;o.fromBufferAttribute(n,i.getX(F*3)),l.fromBufferAttribute(n,i.getX(F*3+1)),c.fromBufferAttribute(n,i.getX(F*3+2)),w.fromBufferAttribute(s,i.getX(F*3)),v.fromBufferAttribute(s,i.getX(F*3+1)),p.fromBufferAttribute(s,i.getX(F*3+2));const O=b(),oe=b(),te=Math.sqrt(O),V=1-te,_=oe*te,K=1-V-_;y[h*3]=o.x*V+l.x*_+c.x*K,y[h*3+1]=o.y*V+l.y*_+c.y*K,y[h*3+2]=o.z*V+l.z*_+c.z*K;const X=w.x*V+v.x*_+p.x*K,Z=w.y*V+v.y*_+p.y*K,B=w.z*V+v.z*_+p.z*K,P=Math.hypot(X,Z,B)||1;g[h*3]=X/P,g[h*3+1]=Z/P,g[h*3+2]=B/P;const W=b()*1e3,re=U(W*12.9898),de=U(W*29.7331),se=U(W*41.311),ne=U(W*53.913),J=U(W*7.719),ae=U(W*13.377),C=U(W*23.371),j=U(W*31.951),Q=U(W*89.317),ee=U(W*101.667),ie=U(W*113.311),le=U(W*127.211),R=fn(.92,1,re),q=.64+(1.32-.64)*re+R*.26,M=(.68+(1.48-.68)*de)*(1.06+(.9-1.06)*R),z=.04+(.32-.04)*se,k=ne*Math.PI*2,L=.08+(.48-.08)*J,D=ae*Math.PI*2,ue=.55+(1.9-.55)*C,Ae=.55+(1.35-.55)*j,ve=ee*Math.PI*2,ke=.5+(1.1-.5)*ie,$=le*Math.PI*2,[be,ye,ge,xe,Me,et]=mt(X/P,Z/P,B/P),Ne=Math.cos(D),_e=Math.sin(D),tt=Ne*be+_e*xe,nt=Ne*ye+_e*Me,ot=Ne*ge+_e*et,rt=y[h*3],st=y[h*3+1],at=y[h*3+2],it=Math.floor(rt/we),lt=Math.floor(st/we),ct=Math.floor(at/we),Ge=it+lt*57+ct*113,xt=(it+.5+(U(Ge+11.7)-.5)*.48)*we,St=(lt+.5+(U(Ge+37.1)-.5)*.48)*we,At=(ct+.5+(U(Ge+73.9)-.5)*.48)*we,dt=xt-rt,ut=St-st,ht=At-at,qe=dt*(X/P)+ut*(Z/P)+ht*(B/P);let Te=dt-X/P*qe,Re=ut-Z/P*qe,Ce=ht-B/P*qe;const Le=Math.hypot(Te,Re,Ce);Le>1e-5?(Te/=Le,Re/=Le,Ce/=Le):(Te=tt,Re=nt,Ce=ot);let Ee=X/P+tt*L+Te*Xe,Pe=Z/P+nt*L+Re*Xe,De=B/P+ot*L+Ce*Xe;const We=Math.hypot(Ee,Pe,De)||1;Ee/=We,Pe/=We,De/=We;const[Mt,Tt,Rt,Ct,Lt,Et]=mt(Ee,Pe,De),Oe=Math.cos(k),Be=Math.sin(k),He=Math.cos($),Ve=Math.sin($),H=h*4;E[H]=Ee,E[H+1]=Pe,E[H+2]=De,E[H+3]=q,S[H]=Oe*Mt+Be*Ct,S[H+1]=Oe*Tt+Be*Lt,S[H+2]=Oe*Rt+Be*Et,S[H+3]=z,x[H]=He*be+Ve*xe,x[H+1]=He*ye+Ve*Me,x[H+2]=He*ge+Ve*et,x[H+3]=ve,m[H]=M,m[H+1]=ke,m[H+2]=ue,m[H+3]=Ae,a[h]=Q}return{roots:y,normals:g,growth:E,curl:S,idle:x,params:m,shade:a}}function pn(t){const e=t.getAttribute("position"),n=t.getIndex();if(!n)return 0;const s=n.count/3,i=new T,d=new T,r=new T,o=new T,l=new T;let c=0;for(let u=0;u<s;u+=1)i.fromBufferAttribute(e,n.getX(u*3)),d.fromBufferAttribute(e,n.getX(u*3+1)),r.fromBufferAttribute(e,n.getX(u*3+2)),c+=o.subVectors(d,i).cross(l.subVectors(r,i)).length()*.5;return c}function gn(t,e){const n=pn(t);return Math.round(n*e)}function wn(t,e,n){const s=n?n.roots.length/3:gn(t,e.density),{roots:i,normals:d,growth:r,curl:o,idle:l,params:c,shade:u}=n!=null?n:mn(t,s),{geometry:f}=dn();f.setAttribute("aRoot",new he(i,3)),f.setAttribute("aNormal",new he(d,3)),f.setAttribute("aGrowth",new he(r,4)),f.setAttribute("aCurl",new he(o,4)),f.setAttribute("aIdle",new he(l,4)),f.setAttribute("aParams",new he(c,4)),f.setAttribute("aShade",new he(u,1));const A=cn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth}),b=new Nt(f,A,s);return b.frustumCulled=!1,{mesh:b,material:A}}const vn=`// Support (base mesh) fragment shader.
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
`,bn=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function yn(t={}){var s;const e={uRootColor:{value:new Qe((s=t.rootColor)!=null?s:"#1eb6f7")},uLightDir:{value:new T(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new bt({glslVersion:yt,uniforms:e,vertexShader:bn,fragmentShader:Je+`
`+vn})}function xn(t){if(t.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:n,frameLoop:s}=t;let i=!1,d=!1,r=0,o=0,l=0;const c=()=>i&&!document.hidden&&!d,u=g=>{if(d)return{keepRunning:!1,needsRender:!1};const S=1e3/Pt(t.idleFps,g);if(g-r<S)return{keepRunning:c(),needsRender:!1};const x=o?Math.min((g-o)/1e3,.05):0;return o=g,r=g,l+=x,n(l),{keepRunning:c(),needsRender:!0}},f=()=>{c()&&(o=0,r=0,s.request(u))},A=()=>{pe(f),s.cancel(u)},b=new IntersectionObserver(g=>{i=g.some(E=>E.isIntersecting),c()?Se(f):A()},{threshold:.01});b.observe(e);const y=()=>{c()?Se(f):A()};return document.addEventListener("visibilitychange",y),{dispose:()=>{d=!0,A(),b.disconnect(),document.removeEventListener("visibilitychange",y)}}}function Sn(t,e){for(let i=3;i<=Math.min(256,Math.floor(e/8));i+=1){if(e%i!==0)continue;let d=0,r=0;for(let o=0;o<e-i;o+=7)Math.abs(t(o)-t(o+i))<=1e-6&&(d+=1),r+=1;if(r>0&&d/r>=.75)return i}return null}function An(t,e,n){let s=t;for(let i=0;i<e;i+=1){const d=s.map(r=>r.clone());for(let r=0;r<s.length;r+=1){if(!n&&(r===0||r===s.length-1))continue;const o=s[(r-1+s.length)%s.length],l=s[r],c=s[(r+1)%s.length];d[r].copy(o).add(l.clone().multiplyScalar(2)).add(c).multiplyScalar(.25)}s=d}return s}function Mn(t){var o;const e=[];for(let l=0;l<t.length-1;l+=1)e.push(t[l].distanceTo(t[l+1]));const n=[...e].sort((l,c)=>l-c),s=(o=n[n.length>>1])!=null?o:1,i=[];let d=0;const r=(l,c)=>{if(c-l<1)return;const u=t.slice(l,c+1),f=u[0].distanceTo(u[u.length-1])<s*2;f&&u.pop(),i.push({points:u,closed:f})};for(let l=0;l<e.length;l+=1)e[l]>s*6&&(r(d,l),d=l+1);return r(d,t.length-1),i}function Tn(t,e,n,s,i,d,r){const o=t.points,l=o.length;if(l<2)return;const c=[];for(let a=0;a<l;a+=1){const w=o[(a-1+l)%l],v=o[(a+1)%l];let p;t.closed?p=v.clone().sub(w):a===0?p=o[1].clone().sub(o[0]):a===l-1?p=o[l-1].clone().sub(o[l-2]):p=v.clone().sub(w),p.lengthSq()<1e-20&&p.set(0,0,1),c.push(p.normalize())}const u=c[0];let f=new T(0,1,0);Math.abs(u.dot(f))>.9&&f.set(1,0,0),f=f.sub(u.clone().multiplyScalar(f.dot(u))).normalize();const A=[f];for(let a=1;a<l;a+=1){const w=c[a-1],v=c[a],p=A[a-1].clone(),h=w.clone().cross(v);if(h.lengthSq()>1e-20){h.normalize();const I=Math.acos(Math.min(1,Math.max(-1,w.dot(v))));p.applyAxisAngle(h,I)}p.sub(v.clone().multiplyScalar(p.dot(v))),A.push(p.normalize())}const b=[],y=(a,w,v,p)=>{const h=w.clone().cross(v).normalize(),I=d.length/3;for(let N=0;N<n;N+=1){const G=N/n*Math.PI*2,F=Math.cos(G)*p,O=Math.sin(G)*p;d.push(a.x+v.x*F+h.x*O,a.y+v.y*F+h.y*O,a.z+v.z*F+h.z*O)}b.push(I)},g=a=>{const w=d.length/3;return d.push(a.x,a.y,a.z),w};let E=null,S=null;if(!t.closed){E=g(o[0].clone().add(c[0].clone().multiplyScalar(-e*i)));for(let a=s-1;a>=1;a-=1){const w=a/s*(Math.PI/2);y(o[0].clone().add(c[0].clone().multiplyScalar(-Math.sin(w)*e*i)),c[0],A[0],Math.cos(w)*e)}}for(let a=0;a<l;a+=1)y(o[a],c[a],A[a],e);if(!t.closed){for(let a=1;a<s;a+=1){const w=a/s*(Math.PI/2);y(o[l-1].clone().add(c[l-1].clone().multiplyScalar(Math.sin(w)*e*i)),c[l-1],A[l-1],Math.cos(w)*e)}S=g(o[l-1].clone().add(c[l-1].clone().multiplyScalar(e*i)))}const x=b.length,m=t.closed?x:x-1;for(let a=0;a<m;a+=1){const w=b[a],v=b[(a+1)%x];for(let p=0;p<n;p+=1){const h=(p+1)%n;r.push(w+p,v+h,v+p),r.push(w+p,w+h,v+h)}}if(!t.closed&&E!==null&&S!==null){const a=b[0],w=b[x-1];for(let v=0;v<n;v+=1){const p=(v+1)%n;r.push(E,a+p,a+v),r.push(w+v,w+p,S)}}}function Rn(t,e={}){var b,y,g,E;const n=(b=e.radius)!=null?b:.007,s=(y=e.radialSegments)!=null?y:24,i=(g=e.capSegments)!=null?g:4,d=(E=e.capLengthScale)!=null?E:1,r=t.getAttribute("position");if(!r)return null;const o=Sn(S=>r.getY(S),r.count);if(!o)return null;const l=r.count/o,c=[];for(let S=0;S<l;S+=1){const x=new T;for(let m=0;m<o;m+=1){const a=S*o+m;x.x+=r.getX(a),x.y+=r.getY(a),x.z+=r.getZ(a)}c.push(x.divideScalar(o))}const u=[],f=[];for(const S of Mn(c))Tn({...S,points:An(S.points,2,S.closed)},n,s,i,d,u,f);if(f.length===0)return null;const A=new ze;return A.setAttribute("position",new ce(new Float32Array(u),3)),A.setIndex(new ce(new Uint32Array(f),1)),A.computeVertexNormals(),A.normalizeNormals(),A}const Cn=.0085,Ln=1e-5,Y=12,pt=4,En=1.5,gt=1.15;function Pn(t){const e=t.getAttribute("position");if(!e||e.count<Y*2)return t;const n=Math.floor(e.count/Y),s=[];for(let m=0;m<n;m+=1){const a=new T,w=m*Y;for(let v=0;v<Y;v+=1)a.add(new T(e.getX(w+v),e.getY(w+v),e.getZ(w+v)));s.push(a.multiplyScalar(1/Y))}const i=s.findIndex((m,a)=>{const w=s[a+1];return m.x>.06&&m.x<.07&&m.z>-.085&&m.z<-.075&&a>0&&w!==void 0&&m.distanceTo(w)>.02});if(i<1)return t;const d=s[i],r=d.clone().sub(s[i-1]).normalize(),o=i*Y,l=Array.from({length:Y},(m,a)=>new T(e.getX(o+a),e.getY(o+a),e.getZ(o+a))),c=l.reduce((m,a)=>m+a.distanceTo(d),0)/Y;if(!Number.isFinite(c)||c<=0)return t;const u=Array.from(e.array),f=t.getIndex(),A=f?Array.from(f.array):Array.from({length:e.count},(m,a)=>a),b=c*En,y=d.clone().addScaledVector(r,b);let g=u.length/3;for(const m of l){const a=y.clone().add(m.clone().sub(d));u.push(a.x,a.y,a.z)}for(let m=0;m<Y;m+=1){const a=(m+1)%Y;A.push(o+m,g+a,g+m,o+m,o+a,g+a)}for(let m=1;m<pt;m+=1){const a=m/pt*(Math.PI/2),w=Math.cos(a),v=Math.sin(a)*c*gt,p=u.length/3;for(const h of l){const I=h.clone().sub(d).multiplyScalar(w),N=y.clone().add(I).addScaledVector(r,v);u.push(N.x,N.y,N.z)}for(let h=0;h<Y;h+=1){const I=(h+1)%Y;A.push(g+h,p+I,p+h,g+h,g+I,p+I)}g=p}const E=u.length/3,S=y.clone().addScaledVector(r,c*gt);u.push(S.x,S.y,S.z);for(let m=0;m<Y;m+=1){const a=(m+1)%Y;A.push(g+m,g+a,E)}const x=new ze;return x.setAttribute("position",new ce(new Float32Array(u),3)),x.setIndex(new ce(new Uint32Array(A),1)),x}function Dn(t){const e=Rn(t,{radius:Cn,radialSegments:20,capSegments:7,capLengthScale:.75});if(e)return e;let n=Pn(t);return n.deleteAttribute("normal"),n.getAttribute("uv")&&n.deleteAttribute("uv"),n=Ut(n,Ln),n.computeVertexNormals(),n.normalizeNormals(),n}const In=.0078,Fn=9e-4;function zn(t,e){var f,A,b,y;const n=(A=(f=e.prepared)==null?void 0:f.geometry)!=null?A:Dn(t),s=yn({rootColor:e.rootColor}),i=new $e(n,s);i.castShadow=!0;const{mesh:d,material:r}=wn(n,{density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:In,strandWidth:Fn},(b=e.prepared)==null?void 0:b.strands);e.lightDir&&(r.uniforms.uLightDir.value.copy(e.lightDir),s.uniforms.uLightDir.value.copy(e.lightDir));const o=new Ke;o.add(i,d);const l=sn({camera:e.camera,domElement:(y=e.pointerTarget)!=null?y:window,viewportElement:e.viewportElement,raycastTargets:[i],materials:[r],frameLoop:e.frameLoop}),c=xn({viewportElement:e.viewportElement,setTime:g=>{r.uniforms.uTime.value=g},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps});return{group:o,baseMesh:i,strandMesh:d,materials:{strand:r,support:s},dispose:()=>{c.dispose(),l.dispose(),n.dispose(),d.geometry.dispose(),s.dispose(),r.dispose(),d.dispose()}}}function kn(){const t=new Worker(new URL("/assets/furGeneration.worker-FqcCRML7.js",import.meta.url),{type:"module"}),e=new Map;let n=1,s=!1,i=!1;const d=r=>{for(const o of e.values())o.reject(r);e.clear()};return t.onmessage=r=>{const o=r.data,l=e.get(o.id);if(l){if(e.delete(o.id),!o.ok){l.reject(new Error(o.message));return}l.resolve(o.meshes.map(Nn))}},t.onerror=()=>{i=!0,d(new Error("fur generation worker failed"))},{generate:(r,o)=>{if(s||i)return Promise.reject(new Error("fur generation worker is disposed"));const l=n++,c=[],u=r.map(b=>{var x;const y=b.geometry.getAttribute("position"),g=new Float32Array(y.array),E=(x=b.geometry.getIndex())==null?void 0:x.array,S=E instanceof Uint16Array?new Uint16Array(E):E instanceof Uint32Array?new Uint32Array(E):Uint32Array.from({length:y.count},(m,a)=>a);return c.push(g.buffer,S.buffer),{position:g,index:S}}),f={id:l,density:o,geometries:u},A=new Promise((b,y)=>{e.set(l,{resolve:b,reject:y})});return t.postMessage(f,c),A},dispose:()=>{s||(s=!0,t.terminate(),d(new Error("fur generation worker disposed")))}}}function Nn(t){const e=new ze;return e.setAttribute("position",new ce(t.geometry.position,3)),e.setAttribute("normal",new ce(t.geometry.normal,3)),e.setIndex(new ce(t.geometry.index,1)),{geometry:e,strands:t.strands}}function _n(t){const e=new Set;let n=0,s=!1,i=!1;const d=r=>{if(i){s=!1;return}let o=!1;for(const l of Array.from(e)){const c=l(r),u=typeof c=="boolean"?c:c.keepRunning;o||(o=typeof c=="boolean"?!0:c.needsRender),u||e.delete(l)}o&&t(),e.size>0?n=requestAnimationFrame(d):s=!1};return{request:r=>{e.add(r),!s&&!i&&(s=!0,n=requestAnimationFrame(d))},cancel:r=>{e.delete(r)},dispose:()=>{i=!0,e.clear(),cancelAnimationFrame(n),s=!1}}}const Gn=[2,1.75,1.5,1.25,1],fe={high:{name:"high",density:48e5,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30},balanced:{name:"balanced",density:435e4,maxDpr:2,maxPhysicalPixels:45e5,idleFps:30},tablet:{name:"tablet",density:4e6,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24},mobile:{name:"mobile",density:24e5,maxDpr:2,maxPhysicalPixels:25e5,idleFps:20},"mobile-low":{name:"mobile-low",density:19e5,maxDpr:2,maxPhysicalPixels:175e4,idleFps:15}};function qn(t,e,n,s){const i=Math.max(1,t)*Math.max(1,e),d=Math.min(n,s.maxDpr);for(const r of Gn)if(r<=d&&i*r*r<=s.maxPhysicalPixels)return r;return Math.min(d,1)}function Ye(t,e){if(typeof window<"u"){const n=new URLSearchParams(window.location.search).get("furQuality");if(n&&n in fe)return fe[n]}return e||t<=360?fe["mobile-low"]:t<=640?fe.mobile:t<=900?fe.tablet:t<1280?fe.balanced:fe.high}const Wn="_root_1xfol_10",On={root:Wn},Ze={desktop:{width:.93,offsetY:.12,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},wt=20,vt=6.5,Bn=120,me=1e-7,Hn=Math.PI/2,Vn="#159fdf";function Zn({className:t,onReady:e,debug:n=!1}){const s=Ie.useRef(null),i=Ie.useRef(e);i.current=e;const d=Dt(),r=Ie.useRef(d);return r.current=d,Ie.useEffect(()=>{var le;const o=s.current;if(!o)return;const l=new _t,c=new Gt(wt,1,.1,100);c.position.set(0,0,vt);const u=new qt({antialias:!0,alpha:!0,powerPreference:"high-performance"});u.setClearAlpha(0),u.shadowMap.enabled=!0,u.shadowMap.type=Wt,u.shadowMap.autoUpdate=!1,o.appendChild(u.domElement),l.add(new Ot(14674678,1.5));const f=new Bt(16777215,1.4);f.position.set(-1.1,2,3.4),f.castShadow=!0,f.shadow.mapSize.set(2048,2048),f.shadow.bias=-8e-4,f.shadow.normalBias=.015,f.shadow.camera.left=-2,f.shadow.camera.right=2,f.shadow.camera.top=2,f.shadow.camera.bottom=-2,f.shadow.camera.near=.5,f.shadow.camera.far=12,f.shadow.radius=2.6,l.add(f);const A=f.position.clone().normalize(),b=new $e(new Ht(24,24),new Vt({opacity:.07}));b.position.z=-.24,b.receiveShadow=!0,l.add(b);const y=new Ke,g=new Ke;g.rotation.x=Hn,y.add(g),l.add(y);const E=new T;let S=!1,x=!1,m=!0,a=!document.hidden,w=0,v=0,p=0,h=0,I=0,N=0;const G=[];let F=null,O=null,oe=0,te=0,V=null,_=null;const K=null,X=K instanceof WebGL2RenderingContext?K:null;(le=X==null?void 0:X.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const Z=[],B=()=>!x&&m&&a,P=()=>{B()&&u.render(l,c)},W=_n(P),re=kn(),de=new IntersectionObserver(([R])=>{m=!!(R!=null&&R.isIntersecting),B()?(P(),Se(P)):pe(P)},{threshold:.01});de.observe(o);const se=()=>{a=!document.hidden,B()?Se(P):pe(P)};document.addEventListener("visibilitychange",se);const ne=async(R,q)=>{const M=[];let z;try{z=await re.generate(R,q.density)}catch(k){if(x)return M;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",k)}if(x){for(const k of z!=null?z:[])k.geometry.dispose();return M}try{for(let k=0;k<R.length;k+=1){const L=R[k],D=zn(L.geometry,{camera:c,viewportElement:u.domElement,pointerTarget:window,quality:q,rootColor:Vn,lightDir:A,frameLoop:W,reducedMotion:r.current,prepared:z==null?void 0:z[k]});D.group.position.copy(L.position),D.group.quaternion.copy(L.quaternion),D.group.scale.copy(L.scale),M.push(D)}}catch(k){for(const L of M)L.dispose();throw k}return M},J=R=>{V=R;const q=++te;window.clearTimeout(oe),oe=window.setTimeout(async()=>{const M=V;if(V=null,x||!S||!O||!M||(F==null?void 0:F.name)===M.name)return;let z;try{z=await ne(O,M)}catch(D){console.error("[HelloModel] failed to rebuild fur quality",D);return}if(x){for(const D of z)D.dispose();return}if(q!==te){for(const D of z)D.dispose();return}const k=G.slice();for(const D of z)g.add(D.group);for(const D of k)g.remove(D.group);G.splice(0,G.length,...z),F=M,_&&(_.strandMaterials.splice(0,_.strandMaterials.length,...z.map(D=>D.materials.strand)),_.supportMaterials.splice(0,_.supportMaterials.length,...z.map(D=>D.materials.support))),P();for(const D of k)D.dispose();const L=Ye(o.clientWidth,r.current);L.name!==F.name&&J(L)},180)},ae=()=>{const R=o.clientWidth,q=o.clientHeight;if(R===0||q===0)return;w=R;const M=R/q,z=Math.abs(c.aspect-M)>me;z&&(c.aspect=M,c.updateProjectionMatrix());const k=Ye(R,r.current),L=qn(R,q,window.devicePixelRatio,k),D=R!==v||q!==p||Math.abs(L-h)>me;if(D&&(u.setDrawingBufferSize(R,q,L),v=R,p=q,h=L),!S)return;(F==null?void 0:F.name)!==k.name&&J(k);const ue=M<.85?Ze.mobile:M<1.4?Ze.tablet:Ze.desktop,Ae=M<.85?-.065:-.24,ve=2*Math.tan(wt*Math.PI/360)*vt,ke=ve*M;let $=ue.width*ke/E.x;$=Math.min($,ue.maxHeight*ve/E.y),$*=ue.sizeScale;const be=$*ue.verticalScale,ye=ue.offsetY*ve,ge=Math.abs(y.scale.x-$)>me||Math.abs(y.scale.y-be)>me||Math.abs(y.scale.z-$)>me||Math.abs(y.position.y-ye)>me,xe=Math.abs(b.position.z-Ae)>me,Me=ge||xe;ge&&(y.scale.set($,be,$),y.position.set(0,ye,0)),xe&&(b.position.z=Ae),ge&&(u.shadowMap.needsUpdate=!0),(D||z||Me)&&P()},C=()=>{window.clearTimeout(I),window.cancelAnimationFrame(N),I=window.setTimeout(()=>{I=0,N=window.requestAnimationFrame(()=>{N=0,ae()})},Bn)};let j=0,Q=0;const ee=async R=>{if(x)return;const q=Ye(w,r.current),M=await ne(R,q);if(x){for(const L of M)L.dispose();return}O=R,F=q;for(const L of M)g.add(L.group),G.push(L);if(x||G.length===0)return;g.updateMatrixWorld(!0);const z=new jt;for(const L of G)z.expandByObject(L.baseMesh);z.getSize(E),g.position.sub(z.getCenter(new T)),S=!0,ae();const k={scene:l,strandMaterials:G.map(L=>L.materials.strand),supportMaterials:G.map(L=>L.materials.support),renderer:u,camera:c,requestRender:P,debug:void 0};_=k,Q=requestAnimationFrame(()=>{var L;x||(L=i.current)==null||L.call(i,k)})};Xt().then(R=>{x||(j=requestAnimationFrame(()=>ee(R)))},R=>{console.error("[HelloModel] failed to load hello.glb",R)});const ie=new ResizeObserver(C);return ie.observe(o),window.addEventListener("resize",C,{passive:!0}),window.addEventListener("orientationchange",C,{passive:!0}),ae(),()=>{x=!0,te+=1,cancelAnimationFrame(j),cancelAnimationFrame(Q),cancelAnimationFrame(N),window.clearTimeout(oe),window.clearTimeout(I),ie.disconnect(),de.disconnect(),window.removeEventListener("resize",C),window.removeEventListener("orientationchange",C),document.removeEventListener("visibilitychange",se),pe(P);for(const R of G)R.dispose();if(b.geometry.dispose(),b.material.dispose(),W.dispose(),re.dispose(),X)for(const R of Z)X.deleteQuery(R);u.dispose(),u.domElement.remove()}},[]),It.jsx("div",{ref:s,className:[On.root,t].filter(Boolean).join(" "),"aria-hidden":"true"})}export{Zn as HelloModel,Zn as default};
