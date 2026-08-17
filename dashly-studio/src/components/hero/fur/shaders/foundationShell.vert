uniform float uShellCount;
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
