import { useLayoutEffect, useRef } from "react";
import styles from "./Stages.module.css";
import arrowAsset from "../assets/process/arrow.svg";
import routeAsset from "../assets/process/route.svg";
import discoveryImage from "../assets/process/stage-1-discovery.webp";
import strategyImage from "../assets/process/stage-2-strategy.webp";
import wireframesImage from "../assets/process/stage-3-wireframes.webp";
import designImage from "../assets/process/stage-4-design.webp";
import developmentImage from "../assets/process/stage-5-development.webp";
import launchImage from "../assets/process/stage-6-launch.webp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SECTION_PREWARM_ROOT_MARGIN } from "../constants/performance";

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";
const ROUTE_VIEW_BOX = "0 0 1004 963";
/* Mirrors the user-provided route.svg so the animated arrow follows the
   exact same path that is visible on desktop. */
const ROUTE_PATH =
    "M0.183594 1.48877C152.684 20.2111 509.781 55.2137 718.164 45.4455C926.547 35.6772 957.443 79.8015 950.464 102.599C934.847 153.617 361.758 240.832 274.018 279.881C274.018 279.881 229.491 293.896 206.405 311.765C199.004 317.494 193.814 319.998 188.515 327.714C183.095 335.608 179.989 350.704 179.989 350.704C176.487 368.061 195.337 403.703 225.887 413.169C261.353 424.158 968.624 516.759 968.624 516.759C968.624 516.759 1118.65 567.157 781.615 646.188C444.579 725.218 381.671 723.207 162.605 817.13C82.8268 851.335 150.496 886.598 225.887 898.727C420.078 929.97 757.805 952.93 957.396 961.211";

const stages = [
    {
        title: "Discovery Call",
        description:
            "We create page layouts and organise content to ensure a smooth user experience and logical navigation.",
        image: discoveryImage,
        imageWidth: 2731,
        imageHeight: 4096,
        className: styles.stage1,
    },
    {
        title: "Strategy & Planning",
        description:
            "We define the website structure, user journey, features, and a clear roadmap before design begins.",
        image: strategyImage,
        imageWidth: 4000,
        imageHeight: 2667,
        className: styles.stage2,
    },
    {
        title: "Wireframes",
        description:
            "We create page layouts and organise content to ensure a smooth user experience and logical navigation.",
        image: wireframesImage,
        imageWidth: 4096,
        imageHeight: 2731,
        className: styles.stage3,
    },
    {
        title: "UI/UX Design",
        description:
            "We transform the wireframes into a modern, engaging interface that reflects your brand and builds trust.",
        image: designImage,
        imageWidth: 4096,
        imageHeight: 2731,
        className: styles.stage4,
    },
    {
        title: "Development & Testing",
        description:
            "We develop a fast, responsive website and carefully test every page, interaction, and feature before launch.",
        image: developmentImage,
        imageWidth: 4096,
        imageHeight: 2300,
        className: styles.stage5,
    },
    {
        title: "Launch & Support",
        description:
            "Once everything is approved, we launch your website and provide ongoing support, updates, and improvements.",
        image: launchImage,
        imageWidth: 4096,
        imageHeight: 2731,
        className: styles.stage6,
    },
];

function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}

function smoothstep(value) {
    const clamped = clamp(value);
    return clamped * clamped * (3 - 2 * clamped);
}

function buildResponsivePath(points) {
    if (!points.length) return "";

    return points.slice(1).reduce((path, point, index) => {
        const previous = points[index];
        const middleY = previous.y + (point.y - previous.y) / 2;

        return `${path} C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
}

export default function Stages() {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sectionRef = useRef(null);
    const flowRef = useRef(null);
    const routeSvgRef = useRef(null);
    const routePathRef = useRef(null);
    const routeStartMaskRef = useRef(null);
    const routeEndMaskRef = useRef(null);
    const arrowRef = useRef(null);
    const stageRefs = useRef([]);
    const stageRouteProgressRef = useRef(stages.map((_, index) => index / 5));

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const flow = flowRef.current;
        const routeSvg = routeSvgRef.current;
        const routePath = routePathRef.current;
        const routeStartMask = routeStartMaskRef.current;
        const routeEndMask = routeEndMaskRef.current;
        const arrow = arrowRef.current;

        if (!section || !flow || !routeSvg || !routePath || !arrow) {
            return undefined;
        }

        const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const tabletQuery = window.matchMedia(
            "(min-width: 48rem) and (max-width: 63.999rem)",
        );
        let frameId = 0;
        let resizeFrameId = 0;
        let currentProgress = 0;
        let targetProgress = 0;
        let scrollStart = 0;
        let scrollDistance = 1;
        let routeLength = 0;
        let scrollStartViewportRatio = 0.68;
        let disposed = false;
        let sectionActive = false;
        let geometryReady = false;
        let geometryDirty = true;
        const arrowFadeStart = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-arrow-fade-start"),
        );
        const arrowArrivalDuration = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-arrow-arrival-duration"),
        );
        const imageArrivalDuration = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-image-arrival-duration"),
        );
        const imageHoldDuration = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-image-hold-duration"),
        );
        const imageExitDuration = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-image-exit-duration"),
        );
        const finalStageRouteProgress = Number.parseFloat(
            window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--process-final-stage-route-progress"),
        );

        const pointInFlow = (distance, matrix, flowRect) => {
            if (!matrix) return { x: 0, y: 0 };

            const routePoint = routePath.getPointAtLength(distance);
            const svgPoint = routeSvg.createSVGPoint();
            svgPoint.x = routePoint.x;
            svgPoint.y = routePoint.y;

            const screenPoint = svgPoint.matrixTransform(matrix);
            return {
                x: screenPoint.x - flowRect.left,
                y: screenPoint.y - flowRect.top,
            };
        };

        const setArrowPosition = (progress) => {
            if (!routeLength) return;

            const matrix = routePath.getScreenCTM();
            const flowRect = flow.getBoundingClientRect();
            const clampedProgress = clamp(progress);
            const distance = clampedProgress * routeLength;
            const tangentOffset = Math.max(routeLength * 0.002, 0.5);
            const before = pointInFlow(
                Math.max(0, distance - tangentOffset),
                matrix,
                flowRect,
            );
            const after = pointInFlow(
                Math.min(routeLength, distance + tangentOffset),
                matrix,
                flowRect,
            );
            const point = pointInFlow(distance, matrix, flowRect);
            const angle =
                (Math.atan2(after.y - before.y, after.x - before.x) * 180) /
                Math.PI;

            arrow.style.setProperty("--arrow-x", `${point.x}px`);
            arrow.style.setProperty("--arrow-y", `${point.y}px`);
            arrow.style.setProperty("--arrow-rotation", `${angle + 90}deg`);
            const arrowArrival = smoothstep(
                clamp(clampedProgress / arrowArrivalDuration),
            );
            const arrowExit =
                1 -
                smoothstep(
                    clamp(
                        (clampedProgress - arrowFadeStart) /
                            (1 - arrowFadeStart),
                    ),
                );

            arrow.style.setProperty(
                "--arrow-opacity",
                (arrowArrival * arrowExit).toFixed(4),
            );
        };

        const setStageVisuals = (progress, showAll = false) => {
            stageRefs.current.forEach((stage, index) => {
                if (!stage) return;

                const isInitialResponsiveStage =
                    !desktopQuery.matches && index === 0;
                const routeProgress =
                    index === stages.length - 1
                        ? finalStageRouteProgress
                        : (stageRouteProgressRef.current[index] ?? 0);
                const nextRouteProgress =
                    stageRouteProgressRef.current[index + 1];
                const imageProgress = progress - routeProgress;
                const imageArrival = smoothstep(
                    clamp(imageProgress / imageArrivalDuration),
                );
                const imageExit = smoothstep(
                    clamp(
                        (imageProgress -
                            imageArrivalDuration -
                            imageHoldDuration) /
                            imageExitDuration,
                    ),
                );
                const imageExitBeforeNext = Number.isFinite(
                    nextRouteProgress,
                )
                    ? smoothstep(
                          clamp(
                              (progress -
                                  (nextRouteProgress - imageExitDuration)) /
                                  imageExitDuration,
                          ),
                      )
                    : imageExit;
                const initialResponsiveImageExit = smoothstep(
                    clamp(
                        (progress - imageHoldDuration) /
                            imageExitDuration,
                    ),
                );
                const imageReveal = showAll
                    ? 1
                    : isInitialResponsiveStage
                      ? 1 - Math.max(
                            initialResponsiveImageExit,
                            imageExitBeforeNext,
                        )
                      : imageArrival * (1 - imageExitBeforeNext);
                /* Copy is a permanent milestone: it arrives with the plane,
                   then remains readable while only its accompanying image
                   continues to the next step. */
                const reveal = showAll || isInitialResponsiveStage ? 1 : imageArrival;
                const numberReveal = reveal;
                const copyReveal = reveal;
                const numberShift = (1 - numberReveal) * 1;
                const copyShift = (1 - copyReveal) * 1.25;

                stage.style.setProperty(
                    "--stage-image-opacity",
                    imageReveal.toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-image-scale",
                    (0.94 + imageReveal * 0.06).toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-image-shift",
                    `${((1 - imageReveal) * 1.5).toFixed(4)}rem`,
                );
                stage.style.setProperty(
                    "--stage-number-opacity",
                    numberReveal.toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-number-shift",
                    `${numberShift.toFixed(4)}rem`,
                );
                stage.style.setProperty(
                    "--stage-copy-opacity",
                    copyReveal.toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-copy-shift",
                    `${copyShift.toFixed(4)}rem`,
                );
            });
        };

        const findStageRouteProgress = () => {
            if (!routeLength) return;

            const flowRect = flow.getBoundingClientRect();
            const matrix = routePath.getScreenCTM();
            const sampleCount = 480;
            const samples = Array.from({ length: sampleCount + 1 }, (_, index) => {
                const progress = index / sampleCount;
                return {
                    progress,
                    point: pointInFlow(progress * routeLength, matrix, flowRect),
                };
            });

            let previousProgress = 0;
            stageRouteProgressRef.current = stageRefs.current.map((stage, index) => {
                const anchor = stage?.querySelector("[data-process-anchor]");
                if (!anchor) return index / Math.max(stages.length - 1, 1);

                const rect = anchor.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2 - flowRect.left;
                const targetY = rect.top + rect.height / 2 - flowRect.top;
                const closest = samples.reduce((candidate, sample) => {
                    const candidateDistance =
                        (candidate.point.x - targetX) ** 2 +
                        (candidate.point.y - targetY) ** 2;
                    const sampleDistance =
                        (sample.point.x - targetX) ** 2 +
                        (sample.point.y - targetY) ** 2;

                    return sampleDistance < candidateDistance ? sample : candidate;
                });
                const progress = Math.max(previousProgress, closest.progress);

                previousProgress = progress;
                return progress;
            });
        };

        const updateScrollMetrics = () => {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top + window.scrollY;
            scrollStart =
                sectionTop - window.innerHeight * scrollStartViewportRatio;
            const scrollEnd =
                sectionTop + sectionRect.height - window.innerHeight;
            scrollDistance = Math.max(scrollEnd - scrollStart, 1);
            targetProgress = clamp(
                (window.scrollY - scrollStart) / scrollDistance,
            );
        };

        const updateGeometry = () => {
            const configuredScrollStart = Number.parseFloat(
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("--process-scroll-start"),
            );
            scrollStartViewportRatio = Number.isFinite(configuredScrollStart)
                ? configuredScrollStart
                : 0.68;

            if (desktopQuery.matches) {
                routeSvg.setAttribute("viewBox", ROUTE_VIEW_BOX);
                routePath.setAttribute("d", ROUTE_PATH);
            } else {
                const flowRect = flow.getBoundingClientRect();
                const stagePoints = stageRefs.current
                    .map((stage) =>
                        stage?.querySelector("[data-process-anchor]"),
                    )
                    .filter(Boolean)
                    .map((anchor) => {
                        const rect = anchor.getBoundingClientRect();
                        return {
                            x: rect.left + rect.width / 2 - flowRect.left,
                            y: rect.top + rect.height / 2 - flowRect.top,
                        };
                    });
                routeSvg.setAttribute(
                    "viewBox",
                    `0 0 ${Math.max(flowRect.width, 1)} ${Math.max(flowRect.height, 1)}`,
                );
                routePath.setAttribute("d", buildResponsivePath(stagePoints));

                const routeStart = stagePoints[0];
                const routeEnd = stagePoints.at(-1);

                if (routeStart) {
                    routeStartMask?.setAttribute("cx", `${routeStart.x}`);
                    routeStartMask?.setAttribute("cy", `${routeStart.y}`);
                }

                if (routeEnd) {
                    routeEndMask?.setAttribute("cx", `${routeEnd.x}`);
                    routeEndMask?.setAttribute("cy", `${routeEnd.y}`);
                }
            }

            routeLength = routePath.getTotalLength();
            findStageRouteProgress();
            updateScrollMetrics();

            const settledProgress = prefersReducedMotion ? 1 : targetProgress;
            currentProgress = settledProgress;
            setArrowPosition(settledProgress);
            setStageVisuals(settledProgress, prefersReducedMotion);
        };

        const render = () => {
            frameId = 0;

            if (!sectionActive) {
                return;
            }

            const difference = targetProgress - currentProgress;

            if (Math.abs(difference) < 0.0005) {
                currentProgress = targetProgress;
            } else {
                currentProgress += difference * 0.16;
            }

            setArrowPosition(currentProgress);
            setStageVisuals(currentProgress);

            if (Math.abs(targetProgress - currentProgress) >= 0.0005) {
                frameId = window.requestAnimationFrame(render);
            }
        };

        const requestRender = () => {
            if (!sectionActive) return;

            updateScrollMetrics();
            if (!frameId) frameId = window.requestAnimationFrame(render);
        };

        const requestGeometryUpdate = () => {
            if (disposed) return;

            geometryDirty = true;

            if (!sectionActive) return;

            if (resizeFrameId) {
                window.cancelAnimationFrame(resizeFrameId);
            }

            resizeFrameId = window.requestAnimationFrame(() => {
                resizeFrameId = 0;
                updateGeometry();
                geometryReady = true;
                geometryDirty = false;
            });
        };

        const activateSection = () => {
            if (sectionActive || disposed) return;

            sectionActive = true;

            if (geometryDirty || !geometryReady) {
                updateGeometry();
                geometryReady = true;
                geometryDirty = false;
            }

            if (!prefersReducedMotion) {
                window.addEventListener("scroll", requestRender, {
                    passive: true,
                });
                requestRender();
            }
        };

        const deactivateSection = () => {
            if (!sectionActive) return;

            sectionActive = false;
            window.removeEventListener("scroll", requestRender);

            if (frameId) {
                window.cancelAnimationFrame(frameId);
                frameId = 0;
            }
        };

        section.dataset.motionReady = "true";

        const resizeObserver = new ResizeObserver(requestGeometryUpdate);
        resizeObserver.observe(section);
        resizeObserver.observe(flow);

        window.addEventListener("resize", requestGeometryUpdate);
        desktopQuery.addEventListener("change", requestGeometryUpdate);
        tabletQuery.addEventListener("change", requestGeometryUpdate);
        document.fonts?.ready?.then(() => {
            if (!disposed) requestGeometryUpdate();
        });

        const viewportObserver =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                      ([entry]) => {
                          if (entry?.isIntersecting) {
                              activateSection();
                          } else {
                              deactivateSection();
                          }
                      },
                      { rootMargin: SECTION_PREWARM_ROOT_MARGIN, threshold: 0 },
                  )
                : null;

        if (viewportObserver) {
            viewportObserver.observe(section);
        } else {
            activateSection();
        }

        return () => {
            disposed = true;
            delete section.dataset.motionReady;
            deactivateSection();
            resizeObserver.disconnect();
            viewportObserver?.disconnect();
            window.removeEventListener("resize", requestGeometryUpdate);
            desktopQuery.removeEventListener("change", requestGeometryUpdate);
            tabletQuery.removeEventListener("change", requestGeometryUpdate);

            if (frameId) window.cancelAnimationFrame(frameId);
            if (resizeFrameId) {
                window.cancelAnimationFrame(resizeFrameId);
            }
        };
    }, [prefersReducedMotion]);

    return (
        <section
            className={styles.section}
            id="stages"
            ref={sectionRef}
            aria-labelledby="process-title"
        >
            <div className={styles.canvas}>
                <header className={styles.header}>
                    <h2 className={styles.heading} id="process-title">
                                   HOW WE MAKE IT WORK
                    </h2>
                    <p className={styles.intro}>
                                From strategy to development, every step is shaped around your business and its goals, ensuring the final website works exactly as it should.
                    </p>
                </header>

                <div className={styles.flow} ref={flowRef}>
                    <img
                        className={styles.routeAsset}
                        src={routeAsset}
                        alt=""
                        aria-hidden="true"
                    />
                    <svg
                        className={styles.routeGeometry}
                        ref={routeSvgRef}
                        viewBox={ROUTE_VIEW_BOX}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path ref={routePathRef} d={ROUTE_PATH} />
                        <circle
                            className={`${styles.routeEndpointMask} ${styles.routeStartMask}`}
                            ref={routeStartMaskRef}
                            aria-hidden="true"
                        />
                        <circle
                            className={`${styles.routeEndpointMask} ${styles.routeEndMask}`}
                            ref={routeEndMaskRef}
                            aria-hidden="true"
                        />
                    </svg>

                    <span
                        className={styles.arrow}
                        ref={arrowRef}
                        aria-hidden="true"
                    >
                        <img src={arrowAsset} alt="" />
                    </span>

                    {stages.map((stage, index) => (
                        <article
                            className={`${styles.stage} ${stage.className}`}
                            key={stage.title}
                            ref={(node) => {
                                stageRefs.current[index] = node;
                            }}
                        >
                            <span
                                className={styles.anchor}
                                data-process-anchor
                                aria-hidden="true"
                            />
                            <span className={styles.number} aria-hidden="true">
                                {index + 1}
                            </span>
                            <div className={styles.copy}>
                                <h3>{stage.title}</h3>
                                <p>{stage.description}</p>
                            </div>
                            <figure className={styles.figure}>
                                <div className={styles.card}>
                                    <span className={styles.media}>
                                        <img
                                            src={stage.image}
                                            alt=""
                                            width={stage.imageWidth}
                                            height={stage.imageHeight}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </span>
                                </div>
                            </figure>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
