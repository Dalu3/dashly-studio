import { LoadingManager, Mesh, Quaternion, Vector3, type BufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Loading + parsing hello.glb (a network fetch plus a glTF/binary parse of
 * ~13.7k vertices) is the slowest, most cacheable part of getting the fur
 * scene on screen — and, unlike everything downstream of it, has nothing to
 * do with having a live canvas or WebGL context. Splitting it out here lets
 * it start as early as the app can trigger it (see the dynamic import in
 * App.jsx, kicked off in parallel with the loader screen) instead of only
 * after HelloModel's own lazy chunk has loaded AND mounted.
 *
 * The promise is cached at module scope, so:
 *   - A caller that starts this before HelloModel mounts (App.jsx) means
 *     HelloModel's own call below just awaits an already-settled promise —
 *     no second network request.
 *   - React StrictMode's dev-only double-invoke of HelloModel's effect (or
 *     any genuine remount) reuses the same result instead of re-fetching
 *     and re-parsing the same file. `prepareGeometry` (called downstream,
 *     inside createFur) still clones its own working copy every time, so
 *     two concurrent fur instances built from this cache never share a
 *     disposable GPU resource.
 */

export interface HelloMeshSource {
    geometry: BufferGeometry;
    position: Vector3;
    quaternion: Quaternion;
    scale: Vector3;
}

const MODEL_URL = `${import.meta.env.BASE_URL}models/hello.glb`;

let cached: Promise<HelloMeshSource[]> | null = null;

export function preloadHelloGeometries(): Promise<HelloMeshSource[]> {
    if (!cached) {
        cached = new Promise((resolve, reject) => {
            // A LoadingManager rather than a bare loader: hello.glb is the
            // only asset today, but every future asset this fur system
            // needs (a colour/pattern texture, an SVG-sourced font, more
            // than one model) registers with the SAME manager instead of
            // each shipping its own separate, uncoordinated load promise.
            const manager = new LoadingManager();
            manager.onError = (url) => {
                reject(new Error(`failed to load ${url}`));
            };

            new GLTFLoader(manager).load(
                MODEL_URL,
                (gltf) => {
                    const sources: HelloMeshSource[] = [];

                    gltf.scene.traverse((child) => {
                        if (!(child instanceof Mesh)) {
                            return;
                        }

                        sources.push({
                            geometry: child.geometry,
                            position: child.position.clone(),
                            quaternion: child.quaternion.clone(),
                            scale: child.scale.clone(),
                        });
                    });

                    if (sources.length === 0) {
                        reject(new Error("no mesh found in hello.glb"));
                        return;
                    }

                    resolve(sources);
                },
                undefined,
                reject,
            );
        });
    }

    return cached;
}
