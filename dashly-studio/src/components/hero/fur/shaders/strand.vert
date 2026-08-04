// Strand vertex shader — real, individually-placed hair geometry.
//
// `position.x` is reused as this vertex's SIDE (-1/+1, which edge of the
// ribbon's width it is) and `position.y` as T (0 at the root, 1 at the
// tip) — see createStrands.ts's buildStrandTemplate for why: the template
// carries no real positions of its own, only this parametric shape, and
// every strand's actual placement/orientation/curve comes from the
// per-instance attributes below plus the current camera.
//
// Every strand reacts to the SAME shared cursor brush as before (uCursor /
// uCursorDir / uCursorRadius / uCursorStrength, still owned and spring-
// damped by cursorInteraction.ts, unchanged) — this is deliberately NOT
// per-strand physics. What makes neighbouring strands diverge instead of
// moving as one rigid patch is that each instance's `aSeed` derives its own
// response curve, strength, tilt and curl from that ONE shared signal, so a
// hundred strands under the same brush all start and settle together but
// visibly disagree on how much and how sharply in between.

uniform float uStrandLength;
uniform float uStrandWidth;
uniform vec3  uGravity;
uniform float uCompress;
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

    // Every other piece of per-strand variation comes from hashing this ONE
    // seed with a different salt per output — one float of instance
    // bandwidth standing in for what would otherwise be seven.
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
    float lenScale    = mix(0.5, 1.55, hLen);
    float widthScale  = mix(0.45, 1.7, hWidth);
    float curlAmount  = mix(0.25, 1.0, hCurlAmt);
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
    float tiltAmount  = mix(0.25, 1.05, hTiltAmt);
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
    vec3 growDir = normalize(n + tiltDir * tiltAmount);

    // Curl basis around the TILTED direction, so curl bends away from where
    // the strand actually points rather than the raw surface normal.
    vec3 curlTangent, curlBitangent;
    basisFromNormal(growDir, curlTangent, curlBitangent);
    vec3 curlDir = cos(curlAngle) * curlTangent + sin(curlAngle) * curlBitangent;

    float len = uStrandLength * lenScale;

    // Centreline: extends along growDir, curling sideways more toward the
    // tip (t*t — more bend far from the root, same shape the old shell
    // system's gravity droop used) — a static, per-strand-unique curve
    // baked once per vertex, not simulated. `aRoot` itself is NEVER
    // displaced — the letterform's own surface must stay perfectly fixed
    // (see support.vert), so only the strand growing outward from a root
    // moves; the root is the one anchor point that never does.
    vec3 centre = aRoot
        + growDir * (len * t)
        + curlDir * (curlAmount * len * 0.55 * t * t);

    centre += uGravity * (t * t) * len;

    // Cursor bend: same falloff SHAPE the old shell/fin system used, but
    // raised to this strand's own responseExp and scaled by its own
    // strengthMul — the actual desync mechanism described above.
    float d = distance(aRoot, uCursor);
    float rawFalloff = pow(clamp(1.0 - d / uCursorRadius, 0.0, 1.0), 1.6);
    float infl = pow(rawFalloff, responseExp) * strengthMul * uCursorStrength;
    float bend = t * t;
    centre -= growDir * (uCompress * infl * (1.0 - bend) * len);
    centre += uCursorDir * (infl * bend * len * 0.55);

    // "Comb part": strands split to either side of the brush's TRAVEL line
    // instead of every strand under the brush leaning the same way — this
    // is what makes the interaction read as combing/brushing through fur
    // rather than a uniform gust pushing on it. `cursorDirSafe` guards the
    // rest position (uCursorDir = (0,0,0) there, which normalize() cannot
    // take); the `+ vec3(1e-6)` on the cross product guards the separate,
    // rarer case where growDir happens to be exactly parallel to the travel
    // direction, which would otherwise zero the cross product too.
    float cursorDirLenSq = dot(uCursorDir, uCursorDir);
    vec3 cursorDirSafe = cursorDirLenSq > 1e-10 ? uCursorDir * inversesqrt(cursorDirLenSq) : tangent;
    vec3 partAxis = normalize(cross(n, cursorDirSafe) + vec3(1e-6, 0.0, 0.0));
    float partSign = dot(aRoot - uCursor, partAxis) >= 0.0 ? 1.0 : -1.0;
    centre += partAxis * (partSign * infl * bend * len * 0.3);

    // Trailing ripple: a SECOND, softer brush point (uRipplePoint, see
    // cursorInteraction.ts's own underdamped spring for it) with a wider
    // radius and gentler push, in the same travel direction. Its natural
    // lag and overshoot as it catches up to the real brush is what reads
    // as a wave running through the fur just after the cursor passes,
    // rather than the bend simply switching off the instant the cursor
    // moves on.
    float dRipple = distance(aRoot, uRipplePoint);
    float rippleRadius = uCursorRadius * 1.8;
    float rippleFalloff = pow(clamp(1.0 - dRipple / rippleRadius, 0.0, 1.0), 2.0);
    float rippleInfl = rippleFalloff * uCursorStrength * 0.45;
    centre += uCursorDir * (rippleInfl * bend * len * 0.4);

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

    float width = uStrandWidth * widthScale * (1.0 - t);

    vec3 worldCentre = (modelMatrix * vec4(centre, 1.0)).xyz;
    vec3 worldGrowDir = normalize(mat3(modelMatrix) * growDir);

    // Billboard the ribbon's WIDTH toward the viewer, per vertex, so a
    // strand reads as a visible sliver from any angle instead of vanishing
    // edge-on — the same trick grass/fur "cards" use. `cross(growDir,
    // viewDir)` degenerates whenever a strand points close to straight at
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
