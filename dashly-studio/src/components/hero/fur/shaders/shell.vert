// Shell vertex shader.
//
// The only displacement is `position + normal * (shellFraction * uFurLength)`
// — straight along THIS vertex's own normal, scaled by how far out this shell
// is. No shell scales the mesh as a whole (that is what inflates a fur mesh
// into a shapeless blob instead of growing fur from its actual surface).
//
// `gl_InstanceID` selects which of the `uShellCount` concentric copies this
// draw is currently rendering — one InstancedMesh, one draw call, instead of
// a separate Mesh object per shell.

uniform float uShellCount;
uniform float uFurLength;
uniform float uCompress;
uniform vec3  uGravity;
uniform vec3  uCursor;
uniform vec3  uCursorDir;
uniform float uCursorRadius;
uniform float uCursorStrength;

varying vec3  vRoot;
varying vec3  vObjNormal;
varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vShellT;

void main() {
    // 0 at the skin, 1 at the tip of the longest strand. A small non-zero
    // floor (0.05, not 0.0) keeps the first shell a hair's width proud of
    // the surface, so it never sits at exactly the same depth as the
    // separate, always-visible support mesh — that would z-fight.
    float t = float(gl_InstanceID) / max(uShellCount - 1.0, 1.0);
    float shell = mix(0.05, 1.0, t);

    vec3 n = normalize(normal);
    vec3 pos = position + n * (shell * uFurLength);

    // Strands droop very slightly under their own weight.
    float bend = shell * shell;
    pos += uGravity * bend * uFurLength;

    // Local cursor influence: a smooth, peaked falloff with no flat plateau,
    // measured from the ROOT position so a strand is affected as a whole.
    // Strands compress inward slightly before they lean sideways, then the
    // lateral lean takes over as the tip weight (bend) increases.
    float d = distance(position, uCursor);
    float infl = pow(clamp(1.0 - d / uCursorRadius, 0.0, 1.0), 1.6) * uCursorStrength;
    pos -= n * (uCompress * infl * (1.0 - bend) * uFurLength);
    pos += uCursorDir * infl * bend * uFurLength * 0.55;

    vShellT = shell;
    vRoot = position;
    vObjNormal = n;
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
