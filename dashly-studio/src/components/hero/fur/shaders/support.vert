// Support (base mesh) vertex shader — the geometry exactly as authored, no
// displacement of any kind. This is what a temporary swap to a plain
// material would render on its own to verify the imported model's true
// silhouette before any fur exists.

varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
    vec3 n = normalize(normal);
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
