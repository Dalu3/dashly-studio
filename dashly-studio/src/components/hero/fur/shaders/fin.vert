// Fin vertex shader.
//
// `aFinT` is 0 at the base ring (on the true surface) and 1 at the tip ring
// — see createFins.ts for how the geometry itself is built: two vertices per
// ORIGINAL mesh vertex (base + tip, sharing position/normal), connected into
// quads via an index buffer, one quad per unique mesh edge. That scheme is
// adapted directly from the piellardj/fur-threejs reference (its `dc` class,
// recovered from the compiled bundle) — it is meaningfully cheaper than
// duplicating position/normal per edge-occurrence, since shared vertices are
// referenced by index rather than repeated.
//
// Displacement, again, is along the vertex normal only, scaled by `aFinT` —
// no scaling of the mesh.

uniform float uFurLength;
uniform vec3  uCursor;
uniform vec3  uCursorDir;
uniform float uCursorRadius;
uniform float uCursorStrength;

attribute float aFinT;

varying vec3  vRoot;
varying vec3  vObjNormal;
varying vec3  vWorldNormal;
varying vec3  vWorldPos;
varying float vFinT;

void main() {
    vec3 n = normalize(normal);
    vec3 pos = position + n * (aFinT * uFurLength);

    // Same local, peaked falloff as the shells, so the whole silhouette
    // brushes together instead of the fin edge moving differently from the
    // shell hair right next to it.
    float bend = aFinT * aFinT;
    float d = distance(position, uCursor);
    float infl = pow(clamp(1.0 - d / uCursorRadius, 0.0, 1.0), 1.6) * uCursorStrength;
    pos += uCursorDir * infl * bend * uFurLength * 0.55;

    vFinT = aFinT;
    vRoot = position;
    vObjNormal = n;
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
