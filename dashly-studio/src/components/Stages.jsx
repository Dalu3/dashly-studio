import { useLayoutEffect, useRef } from "react";
import styles from "./Stages.module.css";
import arrowAsset from "../assets/process/arrow.svg";
import routeAsset from "../assets/process/route.svg";
import discoveryImage from "../assets/process/stage-1-discovery.jpg";
import strategyImage from "../assets/process/stage-2-strategy.jpg";
import wireframesImage from "../assets/process/stage-3-wireframes.jpg";
import designImage from "../assets/process/stage-4-design.jpg";
import developmentImage from "../assets/process/stage-5-development.jpg";
import launchImage from "../assets/process/stage-6-launch.jpg";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";
const FIGMA_ROUTE_VIEW_BOX = "0 0 997.739 962.71";
const FIGMA_ROUTE_PATH =
    "M0.182781 1.48882C152.684 20.2112 509.781 55.2138 718.163 45.4455C926.546 35.6773 971.963 80.448 968.624 104.054C961.375 155.294 357.706 241.89 274.017 279.881L217.246 311.628L177.173 350.701C179.399 366.167 190.53 401.495 217.246 419.078C250.641 441.056 968.624 489.897 968.624 516.759C968.624 543.622 1105.54 541.18 781.614 646.188C457.687 751.195 274.017 712.123 127.081 817.131C9.53184 901.137 607.962 948.187 921.871 961.211";

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
    const arrowRef = useRef(null);
    const stageRefs = useRef([]);
    const thresholdsRef = useRef(stages.map((_, index) => index / 5));

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const flow = flowRef.current;
        const routeSvg = routeSvgRef.current;
        const routePath = routePathRef.current;
        const arrow = arrowRef.current;

        if (!section || !flow || !routeSvg || !routePath || !arrow) {
            return undefined;
        }

        const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        let frameId = 0;
        let resizeFrameId = 0;
        let currentProgress = 0;
        let targetProgress = 0;
        let scrollStart = 0;
        let scrollDistance = 1;
        let routeLength = 0;
        let disposed = false;

        const pointInFlow = (distance) => {
            const matrix = routePath.getScreenCTM();
            const flowRect = flow.getBoundingClientRect();

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

            const distance = clamp(progress) * routeLength;
            const tangentOffset = Math.max(routeLength * 0.002, 0.5);
            const before = pointInFlow(Math.max(0, distance - tangentOffset));
            const after = pointInFlow(
                Math.min(routeLength, distance + tangentOffset),
            );
            const point = pointInFlow(distance);
            const angle =
                (Math.atan2(after.y - before.y, after.x - before.x) * 180) /
                Math.PI;

            arrow.style.setProperty("--arrow-x", `${point.x}px`);
            arrow.style.setProperty("--arrow-y", `${point.y}px`);
            arrow.style.setProperty("--arrow-rotation", `${angle + 90}deg`);
        };

        const setStageVisuals = (progress) => {
            stageRefs.current.forEach((stage, index) => {
                if (!stage) return;

                const threshold = thresholdsRef.current[index] ?? 0;
                const reveal = smoothstep(
                    clamp((progress - (threshold - 0.05)) / 0.1),
                );
                const numberReveal = smoothstep(
                    clamp((reveal - 0.06) / 0.84),
                );
                const copyReveal = smoothstep(
                    clamp((reveal - 0.16) / 0.84),
                );
                const imageScale = 0.94 + reveal * 0.06;
                const imageShift = (1 - reveal) * 1.5;
                const numberShift = (1 - numberReveal) * 1;
                const copyShift = (1 - copyReveal) * 1.25;

                stage.style.setProperty(
                    "--stage-image-opacity",
                    reveal.toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-image-scale",
                    imageScale.toFixed(4),
                );
                stage.style.setProperty(
                    "--stage-image-shift",
                    `${imageShift.toFixed(4)}rem`,
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

        const findStageThresholds = () => {
            if (!routeLength) return;

            const flowRect = flow.getBoundingClientRect();
            const sampleCount = 360;
            const samples = Array.from(
                { length: sampleCount + 1 },
                (_, index) => {
                    const progress = index / sampleCount;
                    return {
                        progress,
                        point: pointInFlow(progress * routeLength),
                    };
                },
            );

            let previousThreshold = 0;
            thresholdsRef.current = stageRefs.current.map((stage, index) => {
                const anchor = stage?.querySelector("[data-process-anchor]");
                if (!anchor) return index / Math.max(stages.length - 1, 1);

                const rect = anchor.getBoundingClientRect();
                const target = {
                    x: rect.left + rect.width / 2 - flowRect.left,
                    y: rect.top + rect.height / 2 - flowRect.top,
                };
                let closest = samples[0];
                let closestDistance = Number.POSITIVE_INFINITY;

                samples.forEach((sample) => {
                    const deltaX = sample.point.x - target.x;
                    const deltaY = sample.point.y - target.y;
                    const distance = deltaX * deltaX + deltaY * deltaY;

                    if (distance < closestDistance) {
                        closest = sample;
                        closestDistance = distance;
                    }
                });

                const minimum = index === 0 ? 0.05 : previousThreshold + 0.03;
                const threshold = clamp(
                    Math.max(minimum, closest.progress),
                    0,
                    0.94,
                );
                previousThreshold = threshold;
                return threshold;
            });
        };

        const updateScrollMetrics = () => {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top + window.scrollY;
            scrollStart = sectionTop - window.innerHeight * 0.68;
            const scrollEnd =
                sectionTop + sectionRect.height - window.innerHeight * 0.38;
            scrollDistance = Math.max(scrollEnd - scrollStart, 1);
            targetProgress = clamp(
                (window.scrollY - scrollStart) / scrollDistance,
            );
        };

        const updateGeometry = () => {
            if (desktopQuery.matches) {
                routeSvg.setAttribute("viewBox", FIGMA_ROUTE_VIEW_BOX);
                routePath.setAttribute("d", FIGMA_ROUTE_PATH);
            } else {
                const flowRect = flow.getBoundingClientRect();
                const points = stageRefs.current
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
                routePath.setAttribute("d", buildResponsivePath(points));
            }

            routeLength = routePath.getTotalLength();
            findStageThresholds();
            updateScrollMetrics();

            const settledProgress = prefersReducedMotion ? 1 : targetProgress;
            currentProgress = settledProgress;
            setArrowPosition(settledProgress);
            setStageVisuals(settledProgress);
        };

        const render = () => {
            frameId = 0;
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
            updateScrollMetrics();
            if (!frameId) frameId = window.requestAnimationFrame(render);
        };

        const requestGeometryUpdate = () => {
            if (disposed) return;

            if (resizeFrameId) {
                window.cancelAnimationFrame(resizeFrameId);
            }

            resizeFrameId = window.requestAnimationFrame(() => {
                resizeFrameId = 0;
                updateGeometry();
            });
        };

        section.dataset.motionReady = "true";
        updateGeometry();

        const resizeObserver = new ResizeObserver(requestGeometryUpdate);
        resizeObserver.observe(section);
        resizeObserver.observe(flow);

        window.addEventListener("resize", requestGeometryUpdate);
        desktopQuery.addEventListener("change", requestGeometryUpdate);
        document.fonts?.ready?.then(() => {
            if (!disposed) requestGeometryUpdate();
        });

        if (!prefersReducedMotion) {
            window.addEventListener("scroll", requestRender, {
                passive: true,
            });
        }

        return () => {
            disposed = true;
            delete section.dataset.motionReady;
            resizeObserver.disconnect();
            window.removeEventListener("resize", requestGeometryUpdate);
            desktopQuery.removeEventListener("change", requestGeometryUpdate);

            if (!prefersReducedMotion) {
                window.removeEventListener("scroll", requestRender);
            }

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
                        From First Idea To A Website That Works
                    </h2>
                    <p className={styles.intro}>
                        We guide every project through a clear, thoughtful
                        process — combining strategy, design and development to
                        create a website that looks great, works smoothly and
                        supports your business goals.
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
                        viewBox={FIGMA_ROUTE_VIEW_BOX}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path ref={routePathRef} d={FIGMA_ROUTE_PATH} />
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
