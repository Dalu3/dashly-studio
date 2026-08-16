import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./Packages.css";
import arrowImage from "../assets/arrow.svg";
import { PROJECT_TYPE_SELECT_EVENT } from "../constants/projectTypes";
import { navigateToHash } from "../utils/scrollToHash";
import { openEstimator } from "./estimator/estimatorEvents";
import { SECTION_PREWARM_ROOT_MARGIN } from "../constants/performance";
import { SERVICE_OFFERINGS } from "../data/services";

const READING_COPY =
    "Choose the option closest to your idea, or answer five quick questions to receive a personalised project estimate.";
const READING_WORDS = READING_COPY.split(" ");


function ReadingCopy({ readingCopyRef }) {
    const measureRef = useRef(null);
    const [lines, setLines] = useState(null);

    useLayoutEffect(() => {
        const measure = measureRef.current;

        if (!measure) {
            return undefined;
        }

        const measureLines = () => {
            const words = Array.from(
                measure.querySelectorAll("[data-reading-word]"),
            );
            const nextLines = [];
            let previousTop = null;

            words.forEach((word) => {
                const top = Math.round(word.getBoundingClientRect().top);

                if (previousTop === null || Math.abs(top - previousTop) > 1) {
                    nextLines.push([]);
                    previousTop = top;
                }

                nextLines[nextLines.length - 1].push(word.textContent ?? "");
            });

            setLines((currentLines) => {
                const current = JSON.stringify(currentLines);
                const next = JSON.stringify(nextLines);

                return current === next ? currentLines : nextLines;
            });
        };

        measureLines();

        const resizeObserver =
            "ResizeObserver" in window
                ? new ResizeObserver(measureLines)
                : null;

        resizeObserver?.observe(measure);

        const fontsReady = document.fonts?.ready;
        fontsReady?.then(measureLines).catch(() => {});

        return () => {
            resizeObserver?.disconnect();
        };
    }, []);

    const outputLines = lines ?? [READING_WORDS];

    return (
        <p ref={readingCopyRef} className="packages-intro__reading-copy">
            <span
                ref={measureRef}
                className="packages-intro__reading-measure"
                aria-hidden="true"
            >
                {READING_WORDS.map((word, index) => (
                    <span data-reading-word key={`${word}-${index}`}>
                        {word}
                        {index < READING_WORDS.length - 1 ? " " : ""}
                    </span>
                ))}
            </span>
            <span
                className="packages-intro__reading-output"
                data-reading-ready={lines ? "true" : "false"}
            >
                {outputLines.map((line, index) => (
                    <span data-reading-line key={`${line.join("-")}-${index}`}>
                        {line.join(" ")}
                    </span>
                ))}
            </span>
        </p>
    );
}

export default function Packages() {
    const revealTargetRef = useRef(null);
    const readingCopyRef = useRef(null);
    const packageRowsRef = useRef([]);
    const [isMotionReady, setIsMotionReady] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [activePackageIndex, setActivePackageIndex] = useState(-1);

    const selectPackage = (service) => {
        const projectType = service.projectType;

        if (!projectType) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(PROJECT_TYPE_SELECT_EVENT, {
                detail: { projectType },
            }),
        );
        navigateToHash(null, "#contact");
    };

    useEffect(() => {
        const revealTarget = revealTargetRef.current;

        if (!revealTarget) {
            return undefined;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setIsMotionReady(true);
            setIsRevealed(true);
            return undefined;
        }

        if (!("IntersectionObserver" in window)) {
            setIsMotionReady(true);
            setIsRevealed(true);
            return undefined;
        }

        let firstFrame = 0;
        let revealFrame = 0;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) {
                    return;
                }

                // The prepared state is painted in its own frame. Without
                // this separation, React can batch both states and the
                // browser has no visible start point from which to animate.
                setIsMotionReady(true);
                firstFrame = window.requestAnimationFrame(() => {
                    revealFrame = window.requestAnimationFrame(() => {
                        setIsRevealed(true);
                    });
                });
                observer.disconnect();
            },
            // Observe the section rather than the small intro. On mobile the
            // intro can pass the viewport before 75% of it is visible, which
            // left the reveal in its static state. This threshold starts the
            // sequence only once a meaningful portion of the block is on
            // screen, while remaining reliable at every viewport height.
            { threshold: 0.12 },
        );

        observer.observe(revealTarget);
        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(revealFrame);
        };
    }, []);

    useEffect(() => {
        const section = revealTargetRef.current;
        const copy = readingCopyRef.current;
        const rows = packageRowsRef.current.filter(Boolean);

        if (!section || !copy) {
            return undefined;
        }

        const readingEnabled = !window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const rootStyles = window.getComputedStyle(document.documentElement);
        const readingStart = Number.parseFloat(
            rootStyles.getPropertyValue("--scroll-reading-start"),
        );
        const readingEnd = Number.parseFloat(
            rootStyles.getPropertyValue("--scroll-reading-end"),
        );
        let frame = 0;
        let sectionActive = false;

        const updateScrollEffects = () => {
            frame = 0;
            if (!sectionActive) return;

            const viewportHeight = window.innerHeight;

            if (readingEnabled) {
                const { top } = copy.getBoundingClientRect();
                const start = viewportHeight * readingStart;
                const end = viewportHeight * readingEnd;
                const progress = Math.min(
                    1,
                    Math.max(0, (start - top) / (start - end)),
                );
                const lines = copy.querySelectorAll("[data-reading-line]");
                const lineCount = lines.length || 1;

                lines.forEach((line, index) => {
                    const lineProgress = Math.min(
                        1,
                        Math.max(0, progress * lineCount - index),
                    );
                    line.style.setProperty(
                        "--line-progress",
                        `${lineProgress * 100}%`,
                    );
                });
            }

            // Read every row exactly once per frame. The previous reducer read
            // the same rectangles repeatedly while comparing candidates.
            const visibleRows = rows
                .map((row) => ({ row, rect: row.getBoundingClientRect() }))
                .filter(({ rect }) => rect.bottom > 0 && rect.top < viewportHeight);

            if (!visibleRows.length) {
                setActivePackageIndex(-1);
                return;
            }

            const anchor = viewportHeight * 0.45;
            const closest = visibleRows.reduce((current, candidate) => {
                const currentDistance = Math.abs(
                    current.rect.top + current.rect.height / 2 - anchor,
                );
                const candidateDistance = Math.abs(
                    candidate.rect.top + candidate.rect.height / 2 - anchor,
                );

                return candidateDistance < currentDistance ? candidate : current;
            });
            const nextIndex = Number(closest.row.dataset.packageIndex);

            setActivePackageIndex((currentIndex) =>
                currentIndex === nextIndex ? currentIndex : nextIndex,
            );
        };

        const requestUpdate = () => {
            if (!frame) {
                frame = window.requestAnimationFrame(updateScrollEffects);
            }
        };

        const activateSection = () => {
            if (sectionActive) return;

            sectionActive = true;
            window.addEventListener("scroll", requestUpdate, { passive: true });
            window.addEventListener("resize", requestUpdate);
            requestUpdate();
        };

        const deactivateSection = () => {
            if (!sectionActive) return;

            sectionActive = false;
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
            window.cancelAnimationFrame(frame);
            frame = 0;
        };

        const observer =
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

        if (observer) {
            observer.observe(section);
        } else {
            activateSection();
        }

        return () => {
            deactivateSection();
            observer?.disconnect();
        };
    }, []);

    return (
        <section
            ref={revealTargetRef}
            className={`packages-section${isMotionReady ? " packages-section--motion-ready" : ""}${isRevealed ? " packages-section--revealed" : ""}`}
            id="packages"
            aria-labelledby="packages-title"
        >
            <div className="packages-content">
                <header className="packages-intro">
                    <h2 id="packages-title">
                        The websites <span>we build</span>
                    </h2>
                    <ReadingCopy readingCopyRef={readingCopyRef} />
                </header>

                <div className="packages-list">
                    {SERVICE_OFFERINGS.map((pkg, index) => (
                        <article
                            className={`package-row${activePackageIndex === index ? " package-row--active" : ""}`}
                            data-package-index={index}
                            key={pkg.id}
                            ref={(row) => {
                                packageRowsRef.current[index] = row;
                            }}
                        >
                            <h3 id={`package-title-${pkg.id}`}>{pkg.label}</h3>
                            <p>{pkg.description}</p>
                            <button
                                type="button"
                                className="package-row__action"
                                aria-labelledby={`package-title-${pkg.id}`}
                                onClick={() => selectPackage(pkg)}
                            />
                        </article>
                    ))}
                </div>

                <div className="packages-estimate">
                    <p className="packages-estimate__desktop-copy">
                        Five questions and you&rsquo;ll have a price.
                    </p>
                    <button
                        type="button"
                        onClick={(event) => openEstimator(event.currentTarget)}
                    >
                        Get My Estimate
                        <img
                            src={arrowImage}
                            className="packages-estimate__icon"
                            alt=""
                            width="1080"
                            height="1350"
                            aria-hidden="true"
                        />
                    </button>
                    <p className="packages-estimate__mobile-caption">
                        Answer 5 quick questions to get a tailored estimate.
                    </p>
                </div>
            </div>
        </section>
    );
}
