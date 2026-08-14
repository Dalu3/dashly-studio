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
