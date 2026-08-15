import{c as we,s as Le,r as Nt,a as Be,u as qt,j as _t}from"./index-DghIGepI.js";import{g as C,V as it,ac as Gt,E as Ve,C as Re,ad as lt,a8 as Bt,ae as ct,h as pe,I as Ct,z as He,B as ue,w as Ot,f as jt,U as st,af as Vt,ag as Ht,W as Ut,ah as Xt,ai as Yt,aj as Zt,D as Kt,ak as Qt,al as Jt,aa as $t}from"./three-vendor-CYnsQO5e.js";import{m as en,G as tn}from"./three-gltf-DTLQIlxe.js";const nn=340,on=28,rn=105,an=13,sn=.055,wt=1.6,ln=2600,cn=75,dn=2900,un=80,hn=600,fn=22;function Oe(t,e,o,n,r,l){const s=(o-t)*n;let a=e+s*l;return a*=Math.exp(-r*l),[t+a*l,a]}function mn(t){const{camera:e,domElement:o,viewportElement:n,raycastTargets:r,materials:l,frameLoop:s}=t,a=new it(2,2),c=new Gt,d=new C(1e6,1e6,1e6),u=new C,p=new C,A=new C;let g=!1,b=0,w=!1,R=!1;const x=new C(1e6,1e6,1e6),S=new C,f=new C,i=new C,v=new C(1e6,1e6,1e6),y=new C;let m=0,h=0,M=0,F=0,B=!1,E=!0,z=!1,le=0,ae=0,U=0,G=!1;const j=()=>{for(const L of l)L.uniforms.uCursorStrength.value=h,L.uniforms.uCursor.value.copy(x),L.uniforms.uCursorDir.value.copy(f),L.uniforms.uRipplePoint.value.copy(v)},$=()=>{if(!G||r.length===0)return;G=!1;const L=n.getBoundingClientRect();a.set((le-L.left)/L.width*2-1,-((ae-L.top)/L.height)*2+1),c.setFromCamera(a,e);const Y=c.intersectObjects(r,!1)[0];if(Y&&Y.object instanceof Ve){const ee=Y.object.worldToLocal(Y.point.clone());if(g){A.copy(ee).sub(p);const Q=A.length();if(Q>1e-6){u.copy(A).multiplyScalar(1/Q);const te=Math.max((U-b)/1e3,1/240),de=Q/te;m=Math.min(wt,Math.max(m,1+de*sn))}}else m=1;p.copy(ee),b=U,g=!0,d.copy(ee),w=!0,R||(R=!0,x.copy(ee),S.set(0,0,0),v.copy(ee),y.set(0,0,0))}else w&&(m=0,g=!1,b=0,w=!1)},K=L=>{if(B)return z=!1,{keepRunning:!1,needsRender:!1};$();const Y=F?Math.min((L-F)/1e3,.05):1/60;F=L,w&&m>1&&(m=1+(m-1)*Math.exp(-7*Y));const ee=m>=h;[h,M]=Oe(h,M,m,ee?nn:rn,ee?on:an,Y),h=Math.min(Math.max(h,-.12),wt);for(const _ of["x","y","z"])[x[_],S[_]]=Oe(x[_],S[_],d[_],ln,cn,Y),[f[_],i[_]]=Oe(f[_],i[_],u[_],dn,un,Y),[v[_],y[_]]=Oe(v[_],y[_],d[_],hn,fn,Y);const Q=Math.abs(m-h)<.0015&&Math.abs(M)<.0015,te=S.lengthSq()<1e-9&&x.distanceToSquared(d)<1e-11,de=i.lengthSq()<1e-9&&f.distanceToSquared(u)<1e-9,fe=y.lengthSq()<1e-9&&v.distanceToSquared(d)<1e-11;Q&&(h=m,M=0);const ye=Q&&te&&de&&fe;return j(),z=!ye,{keepRunning:!ye,needsRender:!0}},V=()=>{z||B||document.hidden||!E||(z=!0,F=0,s.request(K))},k=()=>G||w||Math.abs(m-h)>=.0015||Math.abs(M)>=.0015||S.lengthSq()>=1e-9||x.distanceToSquared(d)>=1e-11||i.lengthSq()>=1e-9||f.distanceToSquared(u)>=1e-9||y.lengthSq()>=1e-9||v.distanceToSquared(d)>=1e-11,O=L=>{!(L instanceof PointerEvent)||document.hidden||!E||(le=L.clientX,ae=L.clientY,U=L.timeStamp,G=!0,V())},se=L=>{O(L)},X=L=>{O(L)},ce=()=>{G=!1,m=0,g=!1,b=0,u.set(0,0,0),w=!1,V()},ie=()=>{ce()},ne=typeof IntersectionObserver=="function"?new IntersectionObserver(([L])=>{E=!!(L!=null&&L.isIntersecting),E||(we(V),G=!1,m=0,h=0,M=0,z=!1,s.cancel(K),j())},{threshold:.01}):null;ne==null||ne.observe(n);const he=()=>{document.hidden?(we(V),z=!1,s.cancel(K)):k()&&Le(V)};return o.addEventListener("pointerdown",se,{passive:!0}),o.addEventListener("pointermove",X,{passive:!0}),o.addEventListener("pointerleave",ce,{passive:!0}),o.addEventListener("pointerup",ie,{passive:!0}),o.addEventListener("pointercancel",ie,{passive:!0}),document.addEventListener("visibilitychange",he),{dispose:()=>{B=!0,o.removeEventListener("pointerdown",se),o.removeEventListener("pointermove",X),o.removeEventListener("pointerleave",ce),o.removeEventListener("pointerup",ie),o.removeEventListener("pointercancel",ie),document.removeEventListener("visibilitychange",he),ne==null||ne.disconnect(),we(V),z=!1,s.cancel(K)}}}const je=`// Shared GLSL, prepended to every fur shader (strand/support) at material
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
`,pn=`// Strand fragment shader.
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
`,gn=`// Strand vertex shader — real, individually-placed hair geometry.
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
`;function vn(t){var n,r;const e={uStrandLength:{value:t.strandLength},uStrandWidth:{value:t.strandWidth},uDrawingBufferSize:{value:new it(1,1)},uMinStrandPixels:{value:t.minStrandPixels},uShadeContrast:{value:t.shadeContrast},uRootColor:{value:new Re((n=t.rootColor)!=null?n:"#1eb6f7")},uTipColor:{value:new Re((r=t.tipColor)!=null?r:"#6fd4fb")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uGravity:{value:new C(0,-.1,0)},uMaxAo:{value:.84},uTime:{value:0},uCursor:{value:new C(1e6,1e6,1e6)},uCursorDir:{value:new C(0,0,0)},uCursorRadius:{value:.036},uCursorStrength:{value:0},uRipplePoint:{value:new C(1e6,1e6,1e6)}};return new lt({glslVersion:ct,uniforms:e,vertexShader:je+`
`+gn,fragmentShader:je+`
`+pn,transparent:!1,depthWrite:!0,depthTest:!0,side:Bt})}const et=5,xe=.01,tt=.02;function wn(){const t=et+1,e=new Float32Array(t*2*3),o=[];for(let r=0;r<t;r+=1){const l=r/et;for(const s of[-1,1]){const a=r*2+(s===-1?0:1);e[a*3]=s,e[a*3+1]=l,e[a*3+2]=0}}for(let r=0;r<et;r+=1){const l=r*2,s=l+1,a=l+2,c=l+3;o.push(l,s,c,l,c,a)}const n=new He;return n.setAttribute("position",new ue(e,3)),n.setIndex(o),{geometry:n}}function yn(t){let e=t;return()=>{e|=0,e=e+1831565813|0;let o=Math.imul(e^e>>>15,1|e);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function yt(t,e){const o=t.shade.length,n=[];for(let l=0;l<o;l+=1)e(l)&&n.push(l);const r=(l,s)=>{const a=new Float32Array(n.length*s);return n.forEach((c,d)=>{const u=c*s,p=d*s;for(let A=0;A<s;A+=1)a[p+A]=l[u+A]}),a};return{roots:r(t.roots,3),normals:r(t.normals,3),growth:r(t.growth,4),curl:r(t.curl,4),idle:r(t.idle,4),params:r(t.params,4),shade:r(t.shade,1)}}const bn=t=>t-Math.floor(t),Z=t=>bn(Math.sin(t)*43758.5453123),Sn=(t,e,o)=>{const n=Math.min(1,Math.max(0,(o-t)/(e-t)));return n*n*(3-2*n)};function bt(t,e,o){const n=o>=0?1:-1,r=-1/(n+o),l=t*e*r;return[1+n*t*t*r,n*l,-n*t,l,n+e*e*r,-e]}function Tt(t,e){const o=t.getAttribute("position"),n=t.getAttribute("normal"),r=t.getIndex();if(!r)throw new Error("sampleRoots requires an indexed geometry");const l=r.count/3,s=new Float64Array(l),a=new C,c=new C,d=new C,u=new C,p=new C;let A=0;for(let h=0;h<l;h+=1){a.fromBufferAttribute(o,r.getX(h*3)),c.fromBufferAttribute(o,r.getX(h*3+1)),d.fromBufferAttribute(o,r.getX(h*3+2));const M=u.subVectors(c,a).cross(p.subVectors(d,a)).length()*.5;A+=M,s[h]=A}const g=yn(1592598103),b=new Float32Array(e*3),w=new Float32Array(e*3),R=new Float32Array(e*4),x=new Float32Array(e*4),S=new Float32Array(e*4),f=new Float32Array(e*4),i=new Float32Array(e),v=new C,y=new C,m=new C;for(let h=0;h<e;h+=1){const M=g()*A;let F=0,B=l-1;for(;F<B;){const $e=F+B>>>1;s[$e]<M?F=$e+1:B=$e}const E=F;a.fromBufferAttribute(o,r.getX(E*3)),c.fromBufferAttribute(o,r.getX(E*3+1)),d.fromBufferAttribute(o,r.getX(E*3+2)),v.fromBufferAttribute(n,r.getX(E*3)),y.fromBufferAttribute(n,r.getX(E*3+1)),m.fromBufferAttribute(n,r.getX(E*3+2));const z=g(),le=g(),ae=Math.sqrt(z),U=1-ae,G=le*ae,j=1-U-G;b[h*3]=a.x*U+c.x*G+d.x*j,b[h*3+1]=a.y*U+c.y*G+d.y*j,b[h*3+2]=a.z*U+c.z*G+d.z*j;const $=v.x*U+y.x*G+m.x*j,K=v.y*U+y.y*G+m.y*j,V=v.z*U+y.z*G+m.z*j,k=Math.hypot($,K,V)||1;w[h*3]=$/k,w[h*3+1]=K/k,w[h*3+2]=V/k;const O=g()*1e3,se=Z(O*12.9898),X=Z(O*29.7331),ce=Z(O*41.311),ie=Z(O*53.913),ne=Z(O*7.719),he=Z(O*13.377),L=Z(O*23.371),Y=Z(O*31.951),ee=Z(O*89.317),Q=Z(O*101.667),te=Z(O*113.311),de=Z(O*127.211),fe=Sn(.92,1,se),ye=.64+(1.32-.64)*se+fe*.26,_=(.68+(1.48-.68)*X)*(1.06+(.9-1.06)*fe),Pe=.04+(.32-.04)*ce,Me=ie*Math.PI*2,T=.08+(.48-.08)*ne,W=he*Math.PI*2,N=.55+(1.9-.55)*L,I=.55+(1.35-.55)*Y,q=Q*Math.PI*2,P=.5+(1.1-.5)*te,D=de*Math.PI*2,[re,Ae,be,De,oe,Ce]=bt($/k,K/k,V/k),Se=Math.cos(W),me=Math.sin(W),Te=Se*re+me*De,Ee=Se*Ae+me*oe,Fe=Se*be+me*Ce,Ie=b[h*3],dt=b[h*3+1],ut=b[h*3+2],ht=Math.floor(Ie/xe),ft=Math.floor(dt/xe),mt=Math.floor(ut/xe),Ue=ht+ft*57+mt*113,Rt=(ht+.5+(Z(Ue+11.7)-.5)*.48)*xe,Pt=(ft+.5+(Z(Ue+37.1)-.5)*.48)*xe,Dt=(mt+.5+(Z(Ue+73.9)-.5)*.48)*xe,pt=Rt-Ie,gt=Pt-dt,vt=Dt-ut,Xe=pt*($/k)+gt*(K/k)+vt*(V/k);let ze=pt-$/k*Xe,ke=gt-K/k*Xe,We=vt-V/k*Xe;const Ne=Math.hypot(ze,ke,We);Ne>1e-5?(ze/=Ne,ke/=Ne,We/=Ne):(ze=Te,ke=Ee,We=Fe);let qe=$/k+Te*T+ze*tt,_e=K/k+Ee*T+ke*tt,Ge=V/k+Fe*T+We*tt;const Ye=Math.hypot(qe,_e,Ge)||1;qe/=Ye,_e/=Ye,Ge/=Ye;const[Et,Ft,It,zt,kt,Wt]=bt(qe,_e,Ge),Ze=Math.cos(Me),Ke=Math.sin(Me),Qe=Math.cos(D),Je=Math.sin(D),H=h*4;R[H]=qe,R[H+1]=_e,R[H+2]=Ge,R[H+3]=ye,x[H]=Ze*Et+Ke*zt,x[H+1]=Ze*Ft+Ke*kt,x[H+2]=Ze*It+Ke*Wt,x[H+3]=Pe,S[H]=Qe*re+Je*De,S[H+1]=Qe*Ae+Je*oe,S[H+2]=Qe*be+Je*Ce,S[H+3]=q,f[H]=_,f[H+1]=P,f[H+2]=N,f[H+3]=I,i[h]=ee}return{roots:b,normals:w,growth:R,curl:x,idle:S,params:f,shade:i}}function xn(t){const e=t.getAttribute("position"),o=t.getIndex();if(!o)return 0;const n=o.count/3,r=new C,l=new C,s=new C,a=new C,c=new C;let d=0;for(let u=0;u<n;u+=1)r.fromBufferAttribute(e,o.getX(u*3)),l.fromBufferAttribute(e,o.getX(u*3+1)),s.fromBufferAttribute(e,o.getX(u*3+2)),d+=a.subVectors(l,r).cross(c.subVectors(s,r)).length()*.5;return d}function Lt(t,e){const o=xn(t);return Math.round(o*e)}function nt(t,e,o){const n=o?o.roots.length/3:Lt(t,e.density),{roots:r,normals:l,growth:s,curl:a,idle:c,params:d,shade:u}=o!=null?o:Tt(t,n),{geometry:p}=wn();p.setAttribute("aRoot",new pe(r,3)),p.setAttribute("aNormal",new pe(l,3)),p.setAttribute("aGrowth",new pe(s,4)),p.setAttribute("aCurl",new pe(a,4)),p.setAttribute("aIdle",new pe(c,4)),p.setAttribute("aParams",new pe(d,4)),p.setAttribute("aShade",new pe(u,1));const A=vn({rootColor:e.rootColor,tipColor:e.tipColor,strandLength:e.strandLength,strandWidth:e.strandWidth,minStrandPixels:e.minStrandPixels,shadeContrast:e.shadeContrast}),g=new Ct(p,A,n);return g.frustumCulled=!1,{mesh:g,material:A}}const Mn=`precision highp float;
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
`;function Cn(t,e){var s,a;const o={uShellCount:{value:e.count},uShellLength:{value:e.length},uRootColor:{value:new Re((s=e.rootColor)!=null?s:"#1eb6f7")},uTipColor:{value:new Re((a=e.tipColor)!=null?a:"#6fd4fb")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uMaxAo:{value:.9}},n=new lt({glslVersion:ct,uniforms:o,vertexShader:An,fragmentShader:je+`
`+Mn,side:Ot,transparent:!1,depthTest:!0,depthWrite:!0}),r=new Ct(t,n,e.count),l=new jt;for(let c=0;c<e.count;c+=1)r.setMatrixAt(c,l);return r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,{mesh:r,material:n}}const Tn=`// Support (base mesh) fragment shader.
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
`,Ln=`// Support (base mesh) vertex shader — the geometry exactly as authored, no
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
`;function Rn(t={}){var n;const e={uRootColor:{value:new Re((n=t.rootColor)!=null?n:"#1eb6f7")},uLightDir:{value:new C(-.4,.8,.6).normalize()},uMaxAo:{value:.84}};return new lt({glslVersion:ct,uniforms:e,vertexShader:Ln,fragmentShader:je+`
`+Tn})}function Pn(t){if(t.reducedMotion)return{dispose:()=>{}};const{viewportElement:e,setTime:o,frameLoop:n}=t;let r=!1,l=!1,s=0,a=0,c=0;const d=()=>r&&!document.hidden&&!l,u=w=>{if(l)return{keepRunning:!1,needsRender:!1};const x=1e3/Nt(t.idleFps,w);if(w-s<x)return{keepRunning:d(),needsRender:!1};const S=a?Math.min((w-a)/1e3,.05):0;return a=w,s=w,c+=S,o(c),{keepRunning:d(),needsRender:!0}},p=()=>{d()&&(a=0,s=0,n.request(u))},A=()=>{we(p),n.cancel(u)},g=new IntersectionObserver(w=>{r=w.some(R=>R.isIntersecting),d()?Le(p):A()},{threshold:.01});g.observe(e);const b=()=>{d()?Le(p):A()};return document.addEventListener("visibilitychange",b),{dispose:()=>{l=!0,A(),g.disconnect(),document.removeEventListener("visibilitychange",b)}}}function Dn(t,e){for(let r=3;r<=Math.min(256,Math.floor(e/8));r+=1){if(e%r!==0)continue;let l=0,s=0;for(let a=0;a<e-r;a+=7)Math.abs(t(a)-t(a+r))<=1e-6&&(l+=1),s+=1;if(s>0&&l/s>=.75)return r}return null}function En(t,e,o){let n=t;for(let r=0;r<e;r+=1){const l=n.map(s=>s.clone());for(let s=0;s<n.length;s+=1){if(!o&&(s===0||s===n.length-1))continue;const a=n[(s-1+n.length)%n.length],c=n[s],d=n[(s+1)%n.length];l[s].copy(a).add(c.clone().multiplyScalar(2)).add(d).multiplyScalar(.25)}n=l}return n}function Fn(t){var a;const e=[];for(let c=0;c<t.length-1;c+=1)e.push(t[c].distanceTo(t[c+1]));const o=[...e].sort((c,d)=>c-d),n=(a=o[o.length>>1])!=null?a:1,r=[];let l=0;const s=(c,d)=>{if(d-c<1)return;const u=t.slice(c,d+1),p=u[0].distanceTo(u[u.length-1])<n*2;p&&u.pop(),r.push({points:u,closed:p})};for(let c=0;c<e.length;c+=1)e[c]>n*6&&(s(l,c),l=c+1);return s(l,t.length-1),r}function In(t,e,o,n,r,l,s){const a=t.points,c=a.length;if(c<2)return;const d=[];for(let i=0;i<c;i+=1){const v=a[(i-1+c)%c],y=a[(i+1)%c];let m;t.closed?m=y.clone().sub(v):i===0?m=a[1].clone().sub(a[0]):i===c-1?m=a[c-1].clone().sub(a[c-2]):m=y.clone().sub(v),m.lengthSq()<1e-20&&m.set(0,0,1),d.push(m.normalize())}const u=d[0];let p=new C(0,1,0);Math.abs(u.dot(p))>.9&&p.set(1,0,0),p=p.sub(u.clone().multiplyScalar(p.dot(u))).normalize();const A=[p];for(let i=1;i<c;i+=1){const v=d[i-1],y=d[i],m=A[i-1].clone(),h=v.clone().cross(y);if(h.lengthSq()>1e-20){h.normalize();const M=Math.acos(Math.min(1,Math.max(-1,v.dot(y))));m.applyAxisAngle(h,M)}m.sub(y.clone().multiplyScalar(m.dot(y))),A.push(m.normalize())}const g=[],b=(i,v,y,m)=>{const h=v.clone().cross(y).normalize(),M=l.length/3;for(let F=0;F<o;F+=1){const B=F/o*Math.PI*2,E=Math.cos(B)*m,z=Math.sin(B)*m;l.push(i.x+y.x*E+h.x*z,i.y+y.y*E+h.y*z,i.z+y.z*E+h.z*z)}g.push(M)},w=i=>{const v=l.length/3;return l.push(i.x,i.y,i.z),v};let R=null,x=null;if(!t.closed){R=w(a[0].clone().add(d[0].clone().multiplyScalar(-e*r)));for(let i=n-1;i>=1;i-=1){const v=i/n*(Math.PI/2);b(a[0].clone().add(d[0].clone().multiplyScalar(-Math.sin(v)*e*r)),d[0],A[0],Math.cos(v)*e)}}for(let i=0;i<c;i+=1)b(a[i],d[i],A[i],e);if(!t.closed){for(let i=1;i<n;i+=1){const v=i/n*(Math.PI/2);b(a[c-1].clone().add(d[c-1].clone().multiplyScalar(Math.sin(v)*e*r)),d[c-1],A[c-1],Math.cos(v)*e)}x=w(a[c-1].clone().add(d[c-1].clone().multiplyScalar(e*r)))}const S=g.length,f=t.closed?S:S-1;for(let i=0;i<f;i+=1){const v=g[i],y=g[(i+1)%S];for(let m=0;m<o;m+=1){const h=(m+1)%o;s.push(v+m,y+h,y+m),s.push(v+m,v+h,y+h)}}if(!t.closed&&R!==null&&x!==null){const i=g[0],v=g[S-1];for(let y=0;y<o;y+=1){const m=(y+1)%o;s.push(R,i+m,i+y),s.push(v+y,v+m,x)}}}function zn(t,e={}){var g,b,w,R;const o=(g=e.radius)!=null?g:.007,n=(b=e.radialSegments)!=null?b:24,r=(w=e.capSegments)!=null?w:4,l=(R=e.capLengthScale)!=null?R:1,s=t.getAttribute("position");if(!s)return null;const a=Dn(x=>s.getY(x),s.count);if(!a)return null;const c=s.count/a,d=[];for(let x=0;x<c;x+=1){const S=new C;for(let f=0;f<a;f+=1){const i=x*a+f;S.x+=s.getX(i),S.y+=s.getY(i),S.z+=s.getZ(i)}d.push(S.divideScalar(a))}const u=[],p=[];for(const x of Fn(d))In({...x,points:En(x.points,2,x.closed)},o,n,r,l,u,p);if(p.length===0)return null;const A=new He;return A.setAttribute("position",new ue(new Float32Array(u),3)),A.setIndex(new ue(new Uint32Array(p),1)),A.computeVertexNormals(),A.normalizeNormals(),A}const kn=.0085,Wn=1e-5,J=12,St=4,Nn=1.5,xt=1.15;function qn(t){const e=t.getAttribute("position");if(!e||e.count<J*2)return t;const o=Math.floor(e.count/J),n=[];for(let f=0;f<o;f+=1){const i=new C,v=f*J;for(let y=0;y<J;y+=1)i.add(new C(e.getX(v+y),e.getY(v+y),e.getZ(v+y)));n.push(i.multiplyScalar(1/J))}const r=n.findIndex((f,i)=>{const v=n[i+1];return f.x>.06&&f.x<.07&&f.z>-.085&&f.z<-.075&&i>0&&v!==void 0&&f.distanceTo(v)>.02});if(r<1)return t;const l=n[r],s=l.clone().sub(n[r-1]).normalize(),a=r*J,c=Array.from({length:J},(f,i)=>new C(e.getX(a+i),e.getY(a+i),e.getZ(a+i))),d=c.reduce((f,i)=>f+i.distanceTo(l),0)/J;if(!Number.isFinite(d)||d<=0)return t;const u=Array.from(e.array),p=t.getIndex(),A=p?Array.from(p.array):Array.from({length:e.count},(f,i)=>i),g=d*Nn,b=l.clone().addScaledVector(s,g);let w=u.length/3;for(const f of c){const i=b.clone().add(f.clone().sub(l));u.push(i.x,i.y,i.z)}for(let f=0;f<J;f+=1){const i=(f+1)%J;A.push(a+f,w+i,w+f,a+f,a+i,w+i)}for(let f=1;f<St;f+=1){const i=f/St*(Math.PI/2),v=Math.cos(i),y=Math.sin(i)*d*xt,m=u.length/3;for(const h of c){const M=h.clone().sub(l).multiplyScalar(v),F=b.clone().add(M).addScaledVector(s,y);u.push(F.x,F.y,F.z)}for(let h=0;h<J;h+=1){const M=(h+1)%J;A.push(w+h,m+M,m+h,w+h,w+M,m+M)}w=m}const R=u.length/3,x=b.clone().addScaledVector(s,d*xt);u.push(x.x,x.y,x.z);for(let f=0;f<J;f+=1){const i=(f+1)%J;A.push(w+f,w+i,R)}const S=new He;return S.setAttribute("position",new ue(new Float32Array(u),3)),S.setIndex(new ue(new Uint32Array(A),1)),S}function _n(t,e=kn){const o=zn(t,{radius:e,radialSegments:20,capSegments:7,capLengthScale:.75});if(o)return o;let n=qn(t);return n.deleteAttribute("normal"),n.getAttribute("uv")&&n.deleteAttribute("uv"),n=en(n,Wn),n.computeVertexNormals(),n.normalizeNormals(),n}const Gn=.0078,Bn=9e-4;function On(t,e){var S,f,i,v,y,m,h;const o=(f=(S=e.prepared)==null?void 0:S.geometry)!=null?f:_n(t,e.quality.strokeRadius),n=Rn({rootColor:e.rootColor}),r=new Ve(o,n);r.castShadow=!0;const l={density:e.quality.density,rootColor:e.rootColor,tipColor:e.tipColor,strandLength:(i=e.quality.strandLength)!=null?i:Gn,strandWidth:(v=e.quality.strandWidth)!=null?v:Bn,minStrandPixels:e.quality.minStrandPixels,shadeContrast:e.quality.shadeContrast},s=(m=(y=e.prepared)==null?void 0:y.strands)!=null?m:Tt(o,Lt(o,e.quality.density)),a=e.quality.shellCount>0,c=a?[nt(o,l,yt(s,M=>s.shade[M]<e.quality.detailStrandFraction)),nt(o,{...l,strandLength:l.strandLength*1.16,strandWidth:l.strandWidth*1.1,minStrandPixels:l.minStrandPixels*1.12},yt(s,M=>{const F=s.shade[M],B=Math.abs(s.normals[M*3+1]);return F>=e.quality.detailStrandFraction&&F<e.quality.detailStrandFraction+(1-e.quality.detailStrandFraction)*e.quality.silhouetteStrandFraction&&B<e.quality.silhouetteNormalThreshold}))]:[nt(o,l,s)],d=c.map(M=>M.mesh),u=c.map(M=>M.material),p=d[0],A=u[0],g=a?Cn(o,{count:e.quality.shellCount,length:e.quality.shellLength,rootColor:e.rootColor,tipColor:e.tipColor}):null;if(e.lightDir){for(const M of u)M.uniforms.uLightDir.value.copy(e.lightDir);g==null||g.material.uniforms.uLightDir.value.copy(e.lightDir),n.uniforms.uLightDir.value.copy(e.lightDir)}const b=new st;b.add(r),g&&b.add(g.mesh),b.add(...d);const w=mn({camera:e.camera,domElement:(h=e.pointerTarget)!=null?h:window,viewportElement:e.viewportElement,raycastTargets:[r],materials:u,frameLoop:e.frameLoop}),R=Pn({viewportElement:e.viewportElement,setTime:M=>{for(const F of u)F.uniforms.uTime.value=M},frameLoop:e.frameLoop,reducedMotion:e.reducedMotion,idleFps:e.quality.idleFps}),x=()=>{R.dispose(),w.dispose(),o.dispose();for(const M of d)M.geometry.dispose();n.dispose();for(const M of u)M.dispose();g==null||g.material.dispose();for(const M of d)M.dispose();g==null||g.mesh.dispose()};return{group:b,baseMesh:r,strandMesh:p,strandMeshes:d,materials:{strand:A,strands:u,support:n,shell:g==null?void 0:g.material},dispose:x}}function jn(){const t=new Worker(new URL("/assets/furGeneration.worker-Chwjn-RG.js",import.meta.url),{type:"module"}),e=new Map;let o=1,n=!1,r=!1;const l=s=>{for(const a of e.values())a.reject(s);e.clear()};return t.onmessage=s=>{const a=s.data,c=e.get(a.id);if(c){if(e.delete(a.id),!a.ok){c.reject(new Error(a.message));return}c.resolve(a.meshes.map(Vn))}},t.onerror=()=>{r=!0,l(new Error("fur generation worker failed"))},{generate:(s,a,c)=>{if(n||r)return Promise.reject(new Error("fur generation worker is disposed"));const d=o++,u=[],p=s.map(b=>{var f;const w=b.geometry.getAttribute("position"),R=new Float32Array(w.array),x=(f=b.geometry.getIndex())==null?void 0:f.array,S=x instanceof Uint16Array?new Uint16Array(x):x instanceof Uint32Array?new Uint32Array(x):Uint32Array.from({length:w.count},(i,v)=>v);return u.push(R.buffer,S.buffer),{position:R,index:S}}),A={id:d,density:a,strokeRadius:c,geometries:p},g=new Promise((b,w)=>{e.set(d,{resolve:b,reject:w})});return t.postMessage(A,u),g},dispose:()=>{n||(n=!0,t.terminate(),l(new Error("fur generation worker disposed")))}}}function Vn(t){const e=new He;return e.setAttribute("position",new ue(t.geometry.position,3)),e.setAttribute("normal",new ue(t.geometry.normal,3)),e.setIndex(new ue(t.geometry.index,1)),{geometry:e,strands:t.strands}}function Hn(t){const e=new Set;let o=0,n=!1,r=!1;const l=s=>{if(r){n=!1;return}let a=!1;for(const c of Array.from(e)){const d=c(s),u=typeof d=="boolean"?d:d.keepRunning;a||(a=typeof d=="boolean"?!0:d.needsRender),u||e.delete(c)}a&&t(),e.size>0?o=requestAnimationFrame(l):n=!1};return{request:s=>{e.add(s),!n&&!r&&(n=!0,o=requestAnimationFrame(l))},cancel:s=>{e.delete(s)},dispose:()=>{r=!0,e.clear(),cancelAnimationFrame(o),n=!1}}}const Un=[2,1.875,1.75,1.5,1.25,1],ge={high:{name:"high",density:46e5,minDpr:1,maxDpr:2,maxPhysicalPixels:6e6,idleFps:30,strokeRadius:.0085,strandLength:.0078,strandWidth:9e-4,minStrandPixels:.7,shadeContrast:1,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},balanced:{name:"balanced",density:415e4,minDpr:1.25,maxDpr:1.875,maxPhysicalPixels:45e5,idleFps:30,strokeRadius:.00855,strandLength:.0079,strandWidth:94e-5,minStrandPixels:.85,shadeContrast:.8,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:0},tablet:{name:"tablet",density:375e4,minDpr:1.5,maxDpr:2,maxPhysicalPixels:35e5,idleFps:24,strokeRadius:.00865,strandLength:.0081,strandWidth:98e-5,minStrandPixels:.88,shadeContrast:.72,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.38},mobile:{name:"mobile",density:225e4,minDpr:2,maxDpr:2,maxPhysicalPixels:25e5,idleFps:20,strokeRadius:.00875,strandLength:.00835,strandWidth:.00102,minStrandPixels:.92,shadeContrast:.68,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.4},"mobile-low":{name:"mobile-low",density:175e4,minDpr:2,maxDpr:2,maxPhysicalPixels:175e4,idleFps:15,strokeRadius:.0088,strandLength:.00855,strandWidth:.00106,minStrandPixels:.98,shadeContrast:.62,shellCount:0,shellLength:0,detailStrandFraction:1,silhouetteStrandFraction:0,silhouetteNormalThreshold:.42}};function Xn(t,e,o,n){const r=Math.max(1,t)*Math.max(1,e),l=Math.min(Math.max(o,n.minDpr),n.maxDpr);for(const s of Un)if(s<=l&&r*s*s<=n.maxPhysicalPixels)return s;return Math.min(l,1)}function ot(t,e){if(typeof window<"u"){const o=new URLSearchParams(window.location.search).get("furQuality");if(o&&o in ge)return ge[o]}return e||t<=360?ge["mobile-low"]:t<=640?ge.mobile:t<=900?ge.tablet:t<1280?ge.balanced:ge.high}const Yn="/models/hello.glb";let rt=null;function Zn(){return rt||(rt=new Promise((t,e)=>{const o=new Vt;o.onError=n=>{e(new Error(`failed to load ${n}`))},new tn(o).load(Yn,n=>{const r=[];if(n.scene.traverse(l=>{l instanceof Ve&&r.push({geometry:l.geometry,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone()})}),r.length===0){e(new Error("no mesh found in hello.glb"));return}t(r)},void 0,e)})),rt}const Kn="_root_1xfol_10",Qn={root:Kn},at={desktop:{width:.93,offsetY:.19,maxHeight:.57,sizeScale:.87,verticalScale:1},tablet:{width:.88,offsetY:.18,maxHeight:.54,sizeScale:.8,verticalScale:1},mobile:{width:.94,offsetY:.15,maxHeight:.54,sizeScale:1,verticalScale:1.08}},Mt=20,At=6.5,ve=1e-7,Jn=Math.PI/2,$n="#159fdf";function oo({className:t,onReady:e,debug:o=!1}){const n=Be.useRef(null),r=Be.useRef(e);r.current=e;const l=qt(),s=Be.useRef(l);return s.current=l,o||typeof window<"u"&&new URLSearchParams(window.location.search).has("furDebug"),Be.useEffect(()=>{var Pe,Me;const a=n.current;if(!a)return;const c=new Ht,d=new Ut(Mt,1,.1,100);d.position.set(0,0,At);const u=new Xt({antialias:!0,alpha:!0,powerPreference:"high-performance"});u.setClearAlpha(0),u.shadowMap.enabled=!0,u.shadowMap.type=Yt,u.shadowMap.autoUpdate=!1,a.appendChild(u.domElement),c.add(new Zt(14674678,1.5));const p=new Kt(16777215,1.4);p.position.set(-1.1,2,3.4),p.castShadow=!0,p.shadow.mapSize.set(2048,2048),p.shadow.bias=-8e-4,p.shadow.normalBias=.015,p.shadow.camera.left=-2,p.shadow.camera.right=2,p.shadow.camera.top=2,p.shadow.camera.bottom=-2,p.shadow.camera.near=.5,p.shadow.camera.far=12,p.shadow.radius=2.6,c.add(p);const A=p.position.clone().normalize(),g=new Ve(new Qt(24,24),new Jt({opacity:.07}));g.position.z=-.24,g.receiveShadow=!0,c.add(g);const b=new st,w=new st;w.rotation.x=Jn,b.add(w),c.add(b);const R=new C;let x=!1,S=!1,f=!0,i=!document.hidden,v=!0;const y=T=>{T.preventDefault(),v=!1,u.domElement.style.visibility="hidden",a.dataset.webglUnavailable="true"};u.domElement.addEventListener("webglcontextlost",y);let m=0,h=0,M=0,F=0,B=0;const E=[];let z=null,le=null,ae=0,U=0,G=null,j=null;const $=new it;let K=()=>{};const V=null,k=V instanceof WebGL2RenderingContext?V:null;(Pe=k==null?void 0:k.getExtension("EXT_disjoint_timer_query_webgl2"))!=null;const O=[],se=()=>!S&&v&&f&&i,X=()=>{se()&&((a.clientWidth!==h||a.clientHeight!==M)&&K(),u.render(c,d))},ce=Hn(X),ie=jn();let ne=()=>{};const he=new IntersectionObserver(([T])=>{f=!!(T!=null&&T.isIntersecting),se()?(ne(),X(),Le(X)):we(X)},{threshold:.01});he.observe(a);const L=()=>{i=!document.hidden,se()?Le(X):we(X)};document.addEventListener("visibilitychange",L);const Y=async(T,W)=>{const N=[];let I;try{I=await ie.generate(T,W.density,W.strokeRadius)}catch(q){if(S)return N;console.warn("[HelloModel] worker generation unavailable; using main-thread fallback",q)}if(S){for(const q of I!=null?I:[])q.geometry.dispose();return N}try{for(let q=0;q<T.length;q+=1){const P=T[q],D=On(P.geometry,{camera:d,viewportElement:u.domElement,pointerTarget:window,quality:W,rootColor:$n,lightDir:A,frameLoop:ce,reducedMotion:s.current,prepared:I==null?void 0:I[q]});D.group.position.copy(P.position),D.group.quaternion.copy(P.quaternion),D.group.scale.copy(P.scale),u.getDrawingBufferSize($);for(const re of D.materials.strands)re.uniforms.uDrawingBufferSize.value.copy($);N.push(D)}}catch(q){for(const P of N)P.dispose();throw q}return N},ee=T=>{G=T;const W=++U;window.clearTimeout(ae),ae=window.setTimeout(async()=>{const N=G;if(G=null,S||!x||!le||!N||(z==null?void 0:z.name)===N.name)return;let I;try{I=await Y(le,N)}catch(D){console.error("[HelloModel] failed to rebuild fur quality",D);return}if(S){for(const D of I)D.dispose();return}if(W!==U){for(const D of I)D.dispose();return}const q=E.slice();for(const D of I)w.add(D.group);for(const D of q)w.remove(D.group);E.splice(0,E.length,...I),z=N,j&&(j.strandMaterials.splice(0,j.strandMaterials.length,...I.flatMap(D=>D.materials.strands)),j.supportMaterials.splice(0,j.supportMaterials.length,...I.map(D=>D.materials.support))),X();for(const D of q)D.dispose();const P=ot(a.clientWidth,s.current);P.name!==z.name&&ee(P)},180)},Q=()=>{const T=a.clientWidth,W=a.clientHeight;if(T===0||W===0)return;m=T;const N=T/W,I=Math.abs(d.aspect-N)>ve;I&&(d.aspect=N,d.updateProjectionMatrix());const q=ot(T,s.current),P=Xn(T,W,window.devicePixelRatio,q),D=T!==h||W!==M||Math.abs(P-F)>ve;if(D){u.setDrawingBufferSize(T,W,P),h=T,M=W,F=P,u.getDrawingBufferSize($);for(const Fe of E)for(const Ie of Fe.materials.strands)Ie.uniforms.uDrawingBufferSize.value.copy($)}if(!x)return;(z==null?void 0:z.name)!==q.name&&ee(q);const re=N<.85?at.mobile:N<1.4?at.tablet:at.desktop,Ae=N<.85?-.14:-.24,be=2*Math.tan(Mt*Math.PI/360)*At,De=be*N;let oe=re.width*De/R.x;oe=Math.min(oe,re.maxHeight*be/R.y),oe*=re.sizeScale;const Ce=oe*re.verticalScale,Se=re.offsetY*be,me=Math.abs(b.scale.x-oe)>ve||Math.abs(b.scale.y-Ce)>ve||Math.abs(b.scale.z-oe)>ve||Math.abs(b.position.y-Se)>ve,Te=Math.abs(g.position.z-Ae)>ve,Ee=me||Te;me&&(b.scale.set(oe,Ce,oe),b.position.set(0,Se,0)),Te&&(g.position.z=Ae),me&&(u.shadowMap.needsUpdate=!0),(D||I||Ee)&&X()};ne=Q,K=Q;const te=()=>{window.cancelAnimationFrame(B),B=window.requestAnimationFrame(()=>{B=0,Q()})};let de=0,fe=0;const ye=async T=>{if(S)return;const W=ot(m,s.current),N=await Y(T,W);if(S){for(const P of N)P.dispose();return}le=T,z=W;for(const P of N)w.add(P.group),E.push(P);if(S||E.length===0)return;w.updateMatrixWorld(!0);const I=new $t;for(const P of E)I.expandByObject(P.baseMesh);I.getSize(R),w.position.sub(I.getCenter(new C)),x=!0,Q();const q={scene:c,strandMaterials:E.flatMap(P=>P.materials.strands),supportMaterials:E.map(P=>P.materials.support),renderer:u,camera:d,requestRender:X,debug:void 0};j=q,fe=requestAnimationFrame(()=>{var P;S||(P=r.current)==null||P.call(r,q)})};Zn().then(T=>{S||(de=requestAnimationFrame(()=>ye(T)))},T=>{console.error("[HelloModel] failed to load hello.glb",T)});const _=new ResizeObserver(te);return _.observe(a),window.addEventListener("resize",te,{passive:!0}),(Me=window.visualViewport)==null||Me.addEventListener("resize",te,{passive:!0}),window.addEventListener("orientationchange",te,{passive:!0}),Q(),()=>{var T;S=!0,U+=1,cancelAnimationFrame(de),cancelAnimationFrame(fe),cancelAnimationFrame(B),window.clearTimeout(ae),_.disconnect(),he.disconnect(),window.removeEventListener("resize",te),(T=window.visualViewport)==null||T.removeEventListener("resize",te),window.removeEventListener("orientationchange",te),document.removeEventListener("visibilitychange",L),u.domElement.removeEventListener("webglcontextlost",y),we(X);for(const W of E)W.dispose();if(g.geometry.dispose(),g.material.dispose(),ce.dispose(),ie.dispose(),k)for(const W of O)k.deleteQuery(W);u.dispose(),u.domElement.remove()}},[]),_t.jsx("div",{ref:n,className:[Qn.root,t].filter(Boolean).join(" "),"aria-hidden":"true"})}export{oo as HelloModel,oo as default};
