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

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { createFur, type FurHandles } from "./fur/createFur";
import {
    createFurDataWorker,
    type PreparedFurData,
} from "./fur/furDataWorker";
import { createFrameLoop } from "./fur/frameLoop";
import { resolveFurPixelRatio, resolveFurQuality } from "./fur/quality";
import type { FurQualityPreset } from "./fur/quality";
import type { StrandMaterial } from "./fur/createStrandMaterial";
import type { SupportMaterial } from "./fur/createSupportMaterial";
import {
    preloadHelloGeometries,
    type HelloMeshSource,
} from "./fur/preloadHello";
import styles from "./HelloModel.module.css";
import {
    cancelHeroResume,
    scheduleHeroResume,
} from "./heroResumeScheduler";

export interface HelloModelHandles {
    scene: Scene;
    /** One entry per mesh found in the GLB (currently always one, but the
     *  loader genuinely traverses and handles every mesh it finds). */
    strandMaterials: StrandMaterial[];
    supportMaterials: SupportMaterial[];
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    requestRender: () => void;
    debug?: HelloModelDebugHandle;
}

export interface HelloModelDebugSnapshot {
    quality: FurQualityPreset | null;
    strands: number;
    strandVertices: number;
    strandTriangles: number;
    baseVertices: number;
    baseTriangles: number;
    drawCalls: number;
    renderedTriangles: number;
    cpuRenderMs: number;
    gpuRenderMs: number | null;
    gpuTimerSupported: boolean;
    renders: number;
    shadowUpdates: number;
    canvasCssWidth: number;
    canvasCssHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    pixelRatio: number;
    heroInViewport: boolean;
    documentVisible: boolean;
}

export interface HelloModelDebugHandle {
    snapshot: () => HelloModelDebugSnapshot;
}

export interface HelloModelProps {
    className?: string;
    onReady?: (handles: HelloModelHandles) => void;
    debug?: boolean;
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
 * These also trade against the fur's own reach: individual strands (see
 * fur/createStrands.ts, fur/shaders/strand.vert) grow past the base mesh's
 * own bounding box, which is what these fractions measure, so the true
 * on-screen footprint is larger than the number here. The stroke body is a
 * round 0.0085-radius tube (see prepareGeometry.ts) with strands reaching
 * STRAND_LENGTH (0.009, times each strand's own random length scale) past
 * it. That is comfortably inside the margin these fractions leave — measured
 * on the canvas, the word still lands short of the frustum edge at every
 * breakpoint — but a further rise in either the radius or the strand length
 * means re-checking this pair.
 */
const LAYOUT = {
    desktop: {
        // Preserve the original wide-screen composition: the wordmark fills
        // the upper Hero more confidently and sits closer to the navigation.
        width: 0.93,
        offsetY: 0.12,
        maxHeight: 0.57,
        sizeScale: 0.87,
        verticalScale: 1,
    },
    tablet: {
        width: 0.88,
        offsetY: 0.18,
        maxHeight: 0.54,
        sizeScale: 0.8,
        verticalScale: 1,
    },
    // 375px Figma composition: the word occupies nearly the full visual
    // width and sits in the upper third, without affecting tablet/desktop.
    mobile: {
        width: 0.94,
        offsetY: 0.15,
        maxHeight: 0.54,
        sizeScale: 1,
        verticalScale: 1.08,
    },
} as const;

const CAMERA_FOV = 20;
const CAMERA_Z = 6.5;
const LAYOUT_RESIZE_DEBOUNCE_MS = 120;
const LAYOUT_EPSILON = 1e-7;

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
const FUR_ROOT_COLOR = "#159fdf";

/**
 * Host component: loads hello.glb, sets up the scene/camera/renderer/
 * lighting/shadow-plane/resize wiring, and initializes the fur system on
 * every mesh it finds. All fur-specific geometry, shading, and cursor logic
 * lives in `fur/` — this component only calls `createFur()` and places the
 * result.
 */
export function HelloModel({ className, onReady, debug = false }: HelloModelProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    // Read once per mount via a ref, same pattern as onReadyRef above — the
    // effect below builds the whole scene exactly once ([] deps); a live
    // mid-session change to this OS-level preference re-triggering that
    // whole rebuild would be a much bigger disruption than just not
    // reacting to it until next mount.
    const reducedMotion = usePrefersReducedMotion();
    const reducedMotionRef = useRef(reducedMotion);
    reducedMotionRef.current = reducedMotion;
    const debugEnabled = import.meta.env.DEV && debug;

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        const scene = new Scene();
        const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
        camera.position.set(0, 0, CAMERA_Z);

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setClearAlpha(0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFShadowMap;
        // The base word and light never animate. Generate their contact shadow
        // on layout changes only, not for every moving-fibre render.
        renderer.shadowMap.autoUpdate = false;
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
        key.shadow.radius = 2.6;
        scene.add(key);
        const lightDir = key.position.clone().normalize();

        const shadowPlane = new Mesh(
            new PlaneGeometry(24, 24),
            new ShadowMaterial({ opacity: 0.07 }),
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
        let heroInViewport = true;
        let documentVisible = !document.hidden;

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
        let lastCanvasWidth = 0;
        let lastCanvasHeight = 0;
        let lastPixelRatio = 0;
        let layoutTimer = 0;
        let layoutFrameId = 0;

        const furHandles: FurHandles[] = [];
        let activeQuality: FurQualityPreset | null = null;
        let rebuildSources: readonly HelloMeshSource[] | null = null;
        let rebuildTimer = 0;
        let rebuildGeneration = 0;
        let pendingQuality: FurQualityPreset | null = null;
        let publicHandles: HelloModelHandles | null = null;
        let cpuRenderMs = 0;
        let gpuRenderMs: number | null = null;
        let renderCount = 0;
        let shadowUpdateCount = 0;

        const rendererContext = debugEnabled ? renderer.getContext() : null;
        const gl =
            rendererContext instanceof WebGL2RenderingContext
                ? rendererContext
                : null;
        const gpuTimer = gl?.getExtension("EXT_disjoint_timer_query_webgl2") ?? null;
        let activeGpuQuery: WebGLQuery | null = null;
        const pendingGpuQueries: WebGLQuery[] = [];

        const collectCompletedGpuQueries = () => {
            if (!gl || !gpuTimer) {
                return;
            }

            while (pendingGpuQueries.length > 0) {
                const query = pendingGpuQueries[0]!;
                const available = gl.getQueryParameter(
                    query,
                    gl.QUERY_RESULT_AVAILABLE,
                ) as boolean;

                if (!available) {
                    break;
                }

                pendingGpuQueries.shift();
                const disjoint = gl.getParameter(gpuTimer.GPU_DISJOINT_EXT) as boolean;

                if (!disjoint) {
                    const nanoseconds = gl.getQueryParameter(
                        query,
                        gl.QUERY_RESULT,
                    ) as number;
                    gpuRenderMs = nanoseconds / 1_000_000;
                }

                gl.deleteQuery(query);
            }
        };

        const canRender = () =>
            !disposed && heroInViewport && documentVisible;

        const render = () => {
            if (canRender()) {
                const startedAt = debugEnabled ? performance.now() : 0;

                if (debugEnabled && gl && gpuTimer && !activeGpuQuery) {
                    collectCompletedGpuQueries();
                    activeGpuQuery = gl.createQuery();

                    if (activeGpuQuery) {
                        gl.beginQuery(gpuTimer.TIME_ELAPSED_EXT, activeGpuQuery);
                    }
                }

                renderer.render(scene, camera);

                if (debugEnabled) {
                    cpuRenderMs = performance.now() - startedAt;
                    renderCount += 1;

                    if (gl && gpuTimer && activeGpuQuery) {
                        gl.endQuery(gpuTimer.TIME_ELAPSED_EXT);
                        pendingGpuQueries.push(activeGpuQuery);
                        activeGpuQuery = null;
                    }
                }
            }
        };

        const frameLoop = createFrameLoop(render);
        const furDataWorker = createFurDataWorker();

        // This is the final render gate for the entire WebGL scene. Fur
        // subsystems already stop their own ticks when hidden/offscreen, but
        // layout() can also request a direct draw after ResizeObserver events.
        // Keeping the permission here makes it impossible for a resize or
        // delayed tick to render an invisible Hero.
        const viewportObserver = new IntersectionObserver(
            ([entry]) => {
                heroInViewport = Boolean(entry?.isIntersecting);

                if (canRender()) {
                    // Keep the already-created canvas visually correct on the
                    // first re-entry frame. The scheduler below still holds
                    // the continuous idle loop until scrolling is quiet.
                    render();
                    scheduleHeroResume(render);
                } else {
                    cancelHeroResume(render);
                }
            },
            { threshold: 0.01 },
        );
        viewportObserver.observe(host);

        const handleDocumentVisibility = () => {
            documentVisible = !document.hidden;

            if (canRender()) {
                scheduleHeroResume(render);
            } else {
                cancelHeroResume(render);
            }
        };
        document.addEventListener("visibilitychange", handleDocumentVisibility);

        const createFurSet = async (
            sources: readonly HelloMeshSource[],
            quality: FurQualityPreset,
        ): Promise<FurHandles[]> => {
            const created: FurHandles[] = [];
            let prepared: PreparedFurData[] | undefined;

            try {
                prepared = await furDataWorker.generate(sources, quality.density);
            } catch (error) {
                if (disposed) {
                    return created;
                }
                // Worker support/failure must never make the Hero disappear.
                // This exceptional path preserves the former synchronous
                // generation and reports why the optimisation was bypassed.
                console.warn(
                    "[HelloModel] worker generation unavailable; using main-thread fallback",
                    error,
                );
            }

            if (disposed) {
                for (const data of prepared ?? []) {
                    data.geometry.dispose();
                }
                return created;
            }

            try {
                for (let index = 0; index < sources.length; index += 1) {
                    const source = sources[index]!;
                    const fur = createFur(source.geometry, {
                        camera,
                        viewportElement: renderer.domElement,
                        pointerTarget: window,
                        quality,
                        rootColor: FUR_ROOT_COLOR,
                        lightDir,
                        frameLoop,
                        reducedMotion: reducedMotionRef.current,
                        prepared: prepared?.[index],
                    });

                    fur.group.position.copy(source.position);
                    fur.group.quaternion.copy(source.quaternion);
                    fur.group.scale.copy(source.scale);
                    created.push(fur);
                }
            } catch (error) {
                for (const fur of created) {
                    fur.dispose();
                }

                throw error;
            }

            return created;
        };

        const scheduleQualityRebuild = (quality: FurQualityPreset) => {
            pendingQuality = quality;
            const requestedGeneration = ++rebuildGeneration;
            window.clearTimeout(rebuildTimer);
            rebuildTimer = window.setTimeout(async () => {
                const nextQuality = pendingQuality;
                pendingQuality = null;

                if (
                    disposed ||
                    !modelReady ||
                    !rebuildSources ||
                    !nextQuality ||
                    activeQuality?.name === nextQuality.name
                ) {
                    return;
                }

                let replacement: FurHandles[];

                try {
                    // Build completely before touching the visible set. This
                    // briefly holds both buffers, but prevents a blank frame
                    // or half-built coat during orientation changes.
                    replacement = await createFurSet(rebuildSources, nextQuality);
                } catch (error) {
                    console.error("[HelloModel] failed to rebuild fur quality", error);
                    return;
                }

                if (disposed) {
                    for (const fur of replacement) {
                        fur.dispose();
                    }
                    return;
                }

                if (requestedGeneration !== rebuildGeneration) {
                    for (const fur of replacement) {
                        fur.dispose();
                    }
                    return;
                }

                const previous = furHandles.slice();
                for (const fur of replacement) {
                    pivot.add(fur.group);
                }
                for (const fur of previous) {
                    pivot.remove(fur.group);
                }
                furHandles.splice(0, furHandles.length, ...replacement);
                activeQuality = nextQuality;

                if (publicHandles) {
                    publicHandles.strandMaterials.splice(
                        0,
                        publicHandles.strandMaterials.length,
                        ...replacement.map((fur) => fur.materials.strand),
                    );
                    publicHandles.supportMaterials.splice(
                        0,
                        publicHandles.supportMaterials.length,
                        ...replacement.map((fur) => fur.materials.support),
                    );
                }

                render();

                // Dispose only after the replacement has been rendered once;
                // no frame can observe missing geometry between the two sets.
                for (const fur of previous) {
                    fur.dispose();
                }

                // A second resize may have landed while the synchronous build
                // was running. Re-check the bucket once, then debounce again
                // only when it genuinely changed.
                const latest = resolveFurQuality(
                    host.clientWidth,
                    reducedMotionRef.current,
                );
                if (latest.name !== activeQuality.name) {
                    scheduleQualityRebuild(latest);
                }
            }, 180);
        };

        const applyLayout = () => {
            const w = host.clientWidth;
            const h = host.clientHeight;

            if (w === 0 || h === 0) {
                return;
            }

            lastMeasuredWidth = w;

            const aspect = w / h;
            const projectionChanged =
                Math.abs(camera.aspect - aspect) > LAYOUT_EPSILON;
            if (projectionChanged) {
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }

            const quality = resolveFurQuality(w, reducedMotionRef.current);
            const pixelRatio = resolveFurPixelRatio(
                w,
                h,
                window.devicePixelRatio,
                quality,
            );
            const drawingBufferChanged =
                w !== lastCanvasWidth ||
                h !== lastCanvasHeight ||
                Math.abs(pixelRatio - lastPixelRatio) > LAYOUT_EPSILON;

            if (drawingBufferChanged) {
                // Updates logical drawing-buffer dimensions and DPR in one
                // renderer operation (CSS sizing remains the host's 100%).
                // Calling setPixelRatio() followed by setSize() can allocate
                // two framebuffers when both values changed during a resize.
                renderer.setDrawingBufferSize(w, h, pixelRatio);
                lastCanvasWidth = w;
                lastCanvasHeight = h;
                lastPixelRatio = pixelRatio;
            }

            if (!modelReady) {
                return;
            }

            if (activeQuality?.name !== quality.name) {
                scheduleQualityRebuild(quality);
            }

            const preset =
                aspect < 0.85
                    ? LAYOUT.mobile
                    : aspect < 1.4
                      ? LAYOUT.tablet
                      : LAYOUT.desktop;

            // The mobile composition keeps the contact shadow tight beneath
            // the word. Desktop retains its existing deeper, more dramatic
            // separation from the ground plane.
            const shadowZ = aspect < 0.85 ? -0.065 : -0.24;

            const visibleH =
                2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_Z;
            const visibleW = visibleH * aspect;

            let scale = (preset.width * visibleW) / modelSize.x;
            scale = Math.min(scale, (preset.maxHeight * visibleH) / modelSize.y);
            scale *= preset.sizeScale;

            const scaleY = scale * preset.verticalScale;
            const positionY = preset.offsetY * visibleH;
            const holderTransformChanged =
                Math.abs(holder.scale.x - scale) > LAYOUT_EPSILON ||
                Math.abs(holder.scale.y - scaleY) > LAYOUT_EPSILON ||
                Math.abs(holder.scale.z - scale) > LAYOUT_EPSILON ||
                Math.abs(holder.position.y - positionY) > LAYOUT_EPSILON;
            const shadowReceiverChanged =
                Math.abs(shadowPlane.position.z - shadowZ) > LAYOUT_EPSILON;
            const compositionChanged =
                holderTransformChanged || shadowReceiverChanged;

            if (holderTransformChanged) {
                holder.scale.set(scale, scaleY, scale);
                holder.position.set(0, positionY, 0);
            }

            if (shadowReceiverChanged) {
                shadowPlane.position.z = shadowZ;
            }

            // The shadow texture is rendered from the directional light's
            // camera, so changing the main camera projection or moving only
            // the receiving plane cannot change it. Re-render solely when the
            // actual static caster transform changes.
            if (holderTransformChanged) {
                renderer.shadowMap.needsUpdate = true;
                shadowUpdateCount += 1;
            }

            if (drawingBufferChanged || projectionChanged || compositionChanged) {
                render();
            }
        };

        const scheduleLayout = () => {
            window.clearTimeout(layoutTimer);
            window.cancelAnimationFrame(layoutFrameId);
            layoutTimer = window.setTimeout(() => {
                layoutTimer = 0;
                layoutFrameId = window.requestAnimationFrame(() => {
                    layoutFrameId = 0;
                    applyLayout();
                });
            }, LAYOUT_RESIZE_DEBOUNCE_MS);
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
        const buildScene = async (sources: readonly HelloMeshSource[]) => {
            if (disposed) {
                return;
            }

            const quality = resolveFurQuality(
                lastMeasuredWidth,
                reducedMotionRef.current,
            );
            const initialFur = await createFurSet(sources, quality);
            if (disposed) {
                for (const fur of initialFur) {
                    fur.dispose();
                }
                return;
            }
            rebuildSources = sources;
            activeQuality = quality;

            // Every mesh actually inside the GLB gets its own independent fur
            // system. There is one mesh today, but this remains multi-mesh safe.
            for (const fur of initialFur) {
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

            // Computes final scale/position for the now-measured model and
            // performs the actual first render.
            applyLayout();

            const handles: HelloModelHandles = {
                scene,
                strandMaterials: furHandles.map((fur) => fur.materials.strand),
                supportMaterials: furHandles.map((fur) => fur.materials.support),
                renderer,
                camera,
                requestRender: render,
                debug: debugEnabled
                    ? {
                          snapshot: () => {
                              collectCompletedGpuQueries();

                              let strands = 0;
                              let strandVertices = 0;
                              let strandTriangles = 0;
                              let baseVertices = 0;
                              let baseTriangles = 0;

                              for (const fur of furHandles) {
                                  const strandCount = fur.strandMesh.count;
                                  const templateVertices =
                                      fur.strandMesh.geometry.getAttribute("position")
                                          .count;
                                  const templateIndices =
                                      fur.strandMesh.geometry.getIndex()?.count ?? 0;
                                  const baseIndexCount =
                                      fur.baseMesh.geometry.getIndex()?.count ?? 0;

                                  strands += strandCount;
                                  strandVertices += strandCount * templateVertices;
                                  strandTriangles +=
                                      strandCount * (templateIndices / 3);
                                  baseVertices +=
                                      fur.baseMesh.geometry.getAttribute("position")
                                          .count;
                                  baseTriangles += baseIndexCount / 3;
                              }

                              return {
                                  quality: activeQuality,
                                  strands,
                                  strandVertices,
                                  strandTriangles,
                                  baseVertices,
                                  baseTriangles,
                                  drawCalls: renderer.info.render.calls,
                                  renderedTriangles: renderer.info.render.triangles,
                                  cpuRenderMs,
                                  gpuRenderMs,
                                  gpuTimerSupported: Boolean(gpuTimer),
                                  renders: renderCount,
                                  shadowUpdates: shadowUpdateCount,
                                  canvasCssWidth: renderer.domElement.clientWidth,
                                  canvasCssHeight: renderer.domElement.clientHeight,
                                  canvasWidth: renderer.domElement.width,
                                  canvasHeight: renderer.domElement.height,
                                  pixelRatio: renderer.getPixelRatio(),
                                  heroInViewport,
                                  documentVisible,
                              };
                          },
                      }
                    : undefined,
            };
            publicHandles = handles;

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

        const observer = new ResizeObserver(scheduleLayout);
        observer.observe(host);
        window.addEventListener("resize", scheduleLayout, { passive: true });
        window.addEventListener("orientationchange", scheduleLayout, {
            passive: true,
        });
        applyLayout();

        return () => {
            disposed = true;
            rebuildGeneration += 1;
            cancelAnimationFrame(buildFrameId);
            cancelAnimationFrame(readyFrameId);
            cancelAnimationFrame(layoutFrameId);
            window.clearTimeout(rebuildTimer);
            window.clearTimeout(layoutTimer);
            observer.disconnect();
            viewportObserver.disconnect();
            window.removeEventListener("resize", scheduleLayout);
            window.removeEventListener("orientationchange", scheduleLayout);
            document.removeEventListener(
                "visibilitychange",
                handleDocumentVisibility,
            );
            cancelHeroResume(render);

            for (const fur of furHandles) {
                fur.dispose();
            }
            shadowPlane.geometry.dispose();
            (shadowPlane.material as ShadowMaterial).dispose();
            frameLoop.dispose();
            furDataWorker.dispose();

            if (gl) {
                if (activeGpuQuery) {
                    gl.deleteQuery(activeGpuQuery);
                }

                for (const query of pendingGpuQueries) {
                    gl.deleteQuery(query);
                }
            }

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
