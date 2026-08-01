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

import { createFur, type FurHandles } from "./fur/createFur";
import type { FinMaterial } from "./fur/createFinMaterial";
import type { ShellMaterial } from "./fur/createShellMaterial";
import type { SupportMaterial } from "./fur/createSupportMaterial";
import {
    preloadHelloGeometries,
    type HelloMeshSource,
} from "./fur/preloadHello";
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
 * Word size as a fraction of the visible frustum. `scale` below takes the
 * MIN of the width- and height-derived values, so whichever is tighter wins.
 *
 * Worth knowing before touching these: at a wide desktop aspect it is
 * `maxHeight` that binds, not `width` — hello.glb is a long, low wordmark
 * (its box is ~41.4 x 15.1 world units, an aspect of ~2.7), so on a 16:9
 * viewport the height limit is reached well before the width one. Raising
 * `width` alone there changes nothing at all; the earlier 0.44 maxHeight was
 * the real reason the word read as too small.
 *
 * These also trade against uFurLength: fur grows past the base mesh's own
 * bounding box, which is what these fractions measure, so the true on-screen
 * footprint is larger than the number here. At the current 0.011 fur length
 * these land at roughly 93% (desktop) and 95% (tablet/mobile) of viewport
 * width including fur — deliberately short of 100% so no strand clips at the
 * frustum edge. Shortening the fur is what freed the margin for this larger
 * scale; lengthening it again means walking these back.
 */
const LAYOUT = {
    desktop: { width: 0.93, offsetY: 0.11, maxHeight: 0.57 },
    tablet: { width: 0.9, offsetY: 0.12, maxHeight: 0.57 },
    mobile: { width: 0.9, offsetY: 0.12, maxHeight: 0.46 },
} as const;

const CAMERA_FOV = 20;
const CAMERA_Z = 6.5;

/** -Z is the word's "up" in the file, so +90 deg about X stands it upright. */
const STAND_UP_X = Math.PI / 2;

/**
 * Light, saturated cyan matching the plush reference. Not eyeballed: with
 * the linear->sRGB output fix in place (see linearToSRGB in common.glsl),
 * this value was tuned by sampling the actual rendered canvas until the
 * opaque interior of the strokes measured rgb(54, 175, 228) against the
 * reference's own rgb(45, 178, 238) — within ~4% per channel.
 *
 * Note it renders very close to as-authored now, so treat it as a real
 * colour rather than a pre-compensated one; pushing it paler desaturates the
 * word instead of brightening it, since the shading already sits near 1.0.
 */
const FUR_ROOT_COLOR = "#1eb6f7";

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

        // Set by layout() the first time it sees a real (non-zero) host
        // width, and read once below when the fur system is actually built.
        // Reading `window.matchMedia` directly at that point used to be
        // enough, back when the model always finished a fresh network fetch
        // well after the page had settled. Now that hello.glb is preloaded
        // (see preloadHello.ts) the ready callback can fire almost
        // instantly on an already-warm cache — sometimes before the very
        // first layout pass has run — so matchMedia could occasionally
        // observe a transient pre-layout viewport width and latch the wrong
        // shell count for the rest of the page's life. layout()'s own
        // zero-guard already exists for exactly this kind of race; reusing
        // its measurement here closes the same gap for shell count too.
        let lastMeasuredWidth = 0;

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

            lastMeasuredWidth = w;

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

        let buildFrameId = 0;
        let readyFrameId = 0;

        /** Everything here is genuinely heavy, synchronous, main-thread CPU
         *  work: welding + renormalising ~13.7k vertices, baking the noise
         *  texture, building shell/fin geometry and their shader materials,
         *  and (new below) compiling those shaders. Calling this straight
         *  out of the promise continuation used to run it inside the SAME
         *  microtask as mount — the promise was frequently already resolved
         *  by the time this component mounted (see preloadHello.ts), so
         *  "await" bought no real yield at all, and this entire block ran
         *  back-to-back with mounting, before the browser had painted
         *  anything. Callers below defer this one real frame via
         *  requestAnimationFrame specifically to fix that. */
        const buildScene = (sources: readonly HelloMeshSource[]) => {
            if (disposed) {
                return;
            }

            const mobile = lastMeasuredWidth > 0 && lastMeasuredWidth <= 640;
            const rootColor = FUR_ROOT_COLOR;

            // Every mesh actually inside the GLB gets its own, fully
            // independent fur system. There is exactly one mesh in this
            // file today, but nothing here assumes that.
            for (const source of sources) {
                if (disposed) {
                    break;
                }

                const fur = createFur(source.geometry, {
                    camera,
                    viewportElement: renderer.domElement,
                    pointerTarget: window,
                    mobile,
                    rootColor,
                    lightDir,
                    requestRender: render,
                });

                fur.group.position.copy(source.position);
                fur.group.quaternion.copy(source.quaternion);
                fur.group.scale.copy(source.scale);

                pivot.add(fur.group);
                furHandles.push(fur);
            }

            if (disposed || furHandles.length === 0) {
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

            // Every fur/support ShaderMaterial compiles its GLSL program the
            // first time it's actually drawn — normally that cost lands
            // silently inside the first render() call. Paying it here,
            // explicitly, while still hidden behind the loader, means it
            // can never stall the reveal itself.
            renderer.compile(scene, camera);

            // Computes final scale/position for the now-measured model and
            // performs the actual first render.
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

            // One more frame boundary before announcing "ready": by the
            // time THIS callback runs, the browser has had a real
            // opportunity to composite the frame render() just issued, so
            // the caller (Hero -> App's loader gate) is reacting to an
            // actually-presented frame, not just "the JS finished running".
            readyFrameId = requestAnimationFrame(() => {
                if (!disposed) {
                    onReadyRef.current?.(handles);
                }
            });
        };

        // Reuses the SAME cached fetch+parse App.jsx already kicked off
        // during the loader screen (see preloadHello.ts) — by the time this
        // resolves here, the slow network+parse work is very often already
        // done. `requestAnimationFrame` (rather than acting the instant the
        // promise settles) is what actually guarantees the browser gets to
        // paint at least once — a resolved promise's `.then()` runs as a
        // same-frame microtask, before any paint, so without this the
        // heavy work in buildScene() could still block the very first
        // paint despite "awaiting" something.
        preloadHelloGeometries().then(
            (sources) => {
                if (disposed) {
                    return;
                }

                buildFrameId = requestAnimationFrame(() => buildScene(sources));
            },
            (error: unknown) => {
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
            cancelAnimationFrame(buildFrameId);
            cancelAnimationFrame(readyFrameId);
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
