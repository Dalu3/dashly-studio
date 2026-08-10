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
    // Keep the grouping subtle: large shared cells made a visibly circular,
    // dense tuft at the tight joins of the H instead of an even coat.
    float clumpSize = 0.010;
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
    float clumpStrength = mix(0.02, 0.08, hash1(clumpId + 19.3));

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
        float cursorDistanceSq = dot(cursorOffset, cursorOffset);

        if (cursorDistanceSq < uCursorRadius * uCursorRadius) {
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
        }
    }

    // Centreline: extends along growDir, curling sideways more toward the
    // tip (t*t — more bend far from the root, same shape the old shell
    // system's gravity droop used) — a static, per-strand-unique curve
    // baked once per vertex, not simulated. `aRoot` itself is NEVER
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
