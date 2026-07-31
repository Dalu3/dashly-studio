import { useEffect, useRef } from "react";
import {
    AmbientLight,
    Box3,
    DirectionalLight,
    Group,
    Mesh,
    PCFShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShadowMaterial,
    Vector3,
    WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createFur, type FurHandles } from "./fur/createFur";
import type { FinMaterial } from "./fur/createFinMaterial";
import type { ShellMaterial } from "./fur/createShellMaterial";
import type { SupportMaterial } from "./fur/createSupportMaterial";
import styles from "./HelloModel.module.css";

export interface HelloModelHandles {
    scene: Scene;
    /** One entry per mesh found in the GLB (currently always one, but the
     *  loader genuinely traverses and handles every mesh it finds). */
    shellMaterials: ShellMaterial[];
    finMaterials: FinMaterial[];
    supportMaterials: SupportMaterial[];
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    requestRender: () => void;
}

export interface HelloModelProps {
    className?: string;
    onReady?: (handles: HelloModelHandles) => void;
}

/**
 * Word size as a fraction of the visible frustum, ~80-90% of width per spec.
 * Width is the binding constraint on typical viewports (maxHeight is set
 * high enough not to clamp it first).
 */
const LAYOUT = {
    desktop: { width: 0.86, offsetY: 0.11, maxHeight: 0.44 },
    tablet: { width: 0.88, offsetY: 0.12, maxHeight: 0.42 },
    mobile: { width: 0.86, offsetY: 0.12, maxHeight: 0.36 },
} as const;

const CAMERA_FOV = 20;
const CAMERA_Z = 6.5;

/** -Z is the word's "up" in the file, so +90 deg about X stands it upright. */
const STAND_UP_X = Math.PI / 2;

/** Brighter, more saturated cyan-blue than the previous pass. */
const FUR_ROOT_COLOR = "#1c9be6";

/**
 * Host component: loads hello.glb, sets up the scene/camera/renderer/
 * lighting/shadow-plane/resize wiring, and initializes the fur system on
 * every mesh it finds. All fur-specific geometry, shading, and cursor logic
 * lives in `fur/` — this component only calls `createFur()` and places the
 * result.
 */
export function HelloModel({ className, onReady }: HelloModelProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        const scene = new Scene();
        const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
        camera.position.set(0, 0, CAMERA_Z);

        const renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearAlpha(0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFShadowMap;
        host.appendChild(renderer.domElement);

        /* Soft, simple lighting: one broad ambient fill plus a single
         * directional light for the shadow pass and the base mesh's own
         * shading. The fur shells/fins read their light direction from THIS
         * light (synced once below), so the whole word is lit consistently
         * instead of the fur guessing at a separately hand-picked angle. */
        scene.add(new AmbientLight(0xdfeaf6, 1.5));

        const key = new DirectionalLight(0xffffff, 1.4);
        key.position.set(-1.1, 2.0, 3.4);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.bias = -0.0008;
        key.shadow.normalBias = 0.015;
        key.shadow.camera.left = -2;
        key.shadow.camera.right = 2;
        key.shadow.camera.top = 2;
        key.shadow.camera.bottom = -2;
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 12;
        // Tighter, cleaner contact shadow — soft but no longer allowed to
        // spread far or read as blurry haze.
        key.shadow.radius = 2.6;
        scene.add(key);
        const lightDir = key.position.clone().normalize();

        const shadowPlane = new Mesh(
            new PlaneGeometry(24, 24),
            new ShadowMaterial({ opacity: 0.045 }),
        );
        shadowPlane.position.z = -0.24;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        const holder = new Group();
        const pivot = new Group();
        pivot.rotation.x = STAND_UP_X;
        holder.add(pivot);
        scene.add(holder);

        const modelSize = new Vector3();
        let modelReady = false;
        let disposed = false;

        const furHandles: FurHandles[] = [];

        const render = () => {
            if (!disposed) {
                renderer.render(scene, camera);
            }
        };

        const layout = () => {
            const w = host.clientWidth;
            const h = host.clientHeight;

            if (w === 0 || h === 0) {
                return;
            }

            const aspect = w / h;
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(w, h, false);

            if (!modelReady) {
                return;
            }

            const preset =
                aspect < 0.85
                    ? LAYOUT.mobile
                    : aspect < 1.4
                      ? LAYOUT.tablet
                      : LAYOUT.desktop;

            const visibleH =
                2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_Z;
            const visibleW = visibleH * aspect;

            let scale = (preset.width * visibleW) / modelSize.x;
            scale = Math.min(scale, (preset.maxHeight * visibleH) / modelSize.y);

            holder.scale.setScalar(scale);
            holder.position.set(0, preset.offsetY * visibleH, 0);

            render();
        };

        const loader = new GLTFLoader();
        loader.load(
            `${import.meta.env.BASE_URL}models/hello.glb`,
            (gltf) => {
                if (disposed) {
                    return;
                }

                const mobile = window.matchMedia("(max-width: 640px)").matches;
                const rootColor = FUR_ROOT_COLOR;

                // Every mesh actually inside the GLB gets its own, fully
                // independent fur system. There is exactly one mesh in this
                // file today, but nothing here assumes that.
                gltf.scene.traverse((child) => {
                    if (disposed || !(child instanceof Mesh)) {
                        return;
                    }

                    const fur = createFur(child.geometry, {
                        camera,
                        viewportElement: renderer.domElement,
                        pointerTarget: window,
                        mobile,
                        rootColor,
                        lightDir,
                        requestRender: render,
                    });

                    fur.group.position.copy(child.position);
                    fur.group.quaternion.copy(child.quaternion);
                    fur.group.scale.copy(child.scale);

                    pivot.add(fur.group);
                    furHandles.push(fur);

                    // The source node stays out of the scene — only the fur
                    // system built from its geometry is added.
                    child.visible = false;
                });

                if (furHandles.length === 0) {
                    console.error("[HelloModel] no mesh found in hello.glb");
                    return;
                }

                pivot.updateMatrixWorld(true);
                const box = new Box3();
                for (const fur of furHandles) {
                    box.expandByObject(fur.baseMesh);
                }
                box.getSize(modelSize);
                pivot.position.sub(box.getCenter(new Vector3()));

                modelReady = true;
                layout();

                const handles: HelloModelHandles = {
                    scene,
                    shellMaterials: furHandles.map((fur) => fur.materials.shell),
                    finMaterials: furHandles.map((fur) => fur.materials.fin),
                    supportMaterials: furHandles.map((fur) => fur.materials.support),
                    renderer,
                    camera,
                    requestRender: render,
                };

                if (import.meta.env.DEV) {
                    // Dev-only handle for tuning the fur from the console.
                    // Stripped from production builds by the DEV guard.
                    (
                        window as unknown as {
                            __helloFur?: HelloModelHandles & { furHandles: FurHandles[] };
                        }
                    ).__helloFur = { ...handles, furHandles };
                }

                onReadyRef.current?.(handles);
            },
            undefined,
            (error) => {
                console.error("[HelloModel] failed to load hello.glb", error);
            },
        );

        const observer = new ResizeObserver(layout);
        observer.observe(host);
        window.addEventListener("resize", layout, { passive: true });
        window.addEventListener("orientationchange", layout, { passive: true });
        layout();

        return () => {
            disposed = true;
            observer.disconnect();
            window.removeEventListener("resize", layout);
            window.removeEventListener("orientationchange", layout);

            for (const fur of furHandles) {
                fur.dispose();
            }
            shadowPlane.geometry.dispose();
            (shadowPlane.material as ShadowMaterial).dispose();

            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div
            ref={hostRef}
            className={[styles.root, className].filter(Boolean).join(" ")}
            aria-hidden="true"
        />
    );
}

export default HelloModel;
