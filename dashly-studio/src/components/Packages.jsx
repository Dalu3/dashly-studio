import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./Packages.css";
import arrowImage from "../assets/arrow.webp";
import { PROJECT_TYPE_SELECT_EVENT } from "../constants/projectTypes";
import { navigateToHash } from "../utils/scrollToHash";

const packages = [
    {
        title: "Landing page",
        description:
            "A one-page website designed to turn visitors into customers with a clear message and strong call to action.",
    },
    {
        title: "Multi-Page Web",
        description:
            "A complete business website with dedicated pages for your services, company, portfolio, contact information and more.",
    },
    {
        title: "Catalogue Web",
        description:
            "Display your products or services in a structured online catalogue without online payments. Perfect for browsing and enquiries.",
    },
    {
        title: "E-Commerce",
        description:
            "Sell products online with a secure store, product management, shopping cart and payment integration.",
    },
    {
        title: "Web Application",
        description:
            "A tailored digital product that brings your workflow, customers and business tools together in one place.",
    },
];

const READING_COPY =
    "Choose the option closest to your idea, or answer five quick questions to receive a personalised project estimate.";
const READING_WORDS = READING_COPY.split(" ");

const PACKAGE_PROJECT_TYPES = {
    "Landing page": "Landing Page",
    "Multi-Page Web": "Multi-Page Web",
    "Catalogue Web": "Catalogue Web",
    "E-Commerce": "E-commerce",
    "Web Application": "Web Application",
};

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

    const selectPackage = (title) => {
        const projectType = PACKAGE_PROJECT_TYPES[title];

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

    const handlePackageKeyDown = (event, title) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        selectPackage(title);
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
        const copy = readingCopyRef.current;

        if (!copy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const rootStyles = window.getComputedStyle(document.documentElement);
        const readingStart = Number.parseFloat(
            rootStyles.getPropertyValue("--scroll-reading-start"),
        );
        const readingEnd = Number.parseFloat(
            rootStyles.getPropertyValue("--scroll-reading-end"),
        );
        let frame = 0;

        const updateProgress = () => {
            frame = 0;
            const viewportHeight = window.innerHeight;
            const { top } = copy.getBoundingClientRect();
            const start = viewportHeight * readingStart;
            const end = viewportHeight * readingEnd;
            const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));

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
        };

        const requestUpdate = () => {
            if (!frame) {
                frame = window.requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
        };
    }, []);

    useEffect(() => {
        const rows = packageRowsRef.current.filter(Boolean);
        let frame = 0;

        const updateActiveRow = () => {
            frame = 0;
            const visibleRows = rows.filter((row) => {
                const { bottom, top } = row.getBoundingClientRect();
                return bottom > 0 && top < window.innerHeight;
            });

            if (!visibleRows.length) {
                setActivePackageIndex(-1);
                return;
            }

            const anchor = window.innerHeight * 0.45;
            const closestRow = visibleRows.reduce((closest, row) => {
                const rowCenter =
                    row.getBoundingClientRect().top +
                    row.getBoundingClientRect().height / 2;
                const closestDistance = Math.abs(
                    closest.getBoundingClientRect().top +
                        closest.getBoundingClientRect().height / 2 -
                        anchor,
                );
                const rowDistance = Math.abs(rowCenter - anchor);

                return rowDistance < closestDistance ? row : closest;
            });
            const nextIndex = Number(closestRow.dataset.packageIndex);

            setActivePackageIndex((currentIndex) =>
                currentIndex === nextIndex ? currentIndex : nextIndex,
            );
        };

        const requestActiveRowUpdate = () => {
            if (!frame) {
                frame = window.requestAnimationFrame(updateActiveRow);
            }
        };

        updateActiveRow();
        window.addEventListener("scroll", requestActiveRowUpdate, {
            passive: true,
        });
        window.addEventListener("resize", requestActiveRowUpdate);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", requestActiveRowUpdate);
            window.removeEventListener("resize", requestActiveRowUpdate);
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
                    {packages.map((pkg, index) => (
                        <article
                            className={`package-row${activePackageIndex === index ? " package-row--active" : ""}`}
                            data-package-index={index}
                            key={pkg.title}
                            role="button"
                            tabIndex={0}
                            onClick={() => selectPackage(pkg.title)}
                            onKeyDown={(event) => handlePackageKeyDown(event, pkg.title)}
                            ref={(row) => {
                                packageRowsRef.current[index] = row;
                            }}
                        >
                            <h3>{pkg.title}</h3>
                            <p>{pkg.description}</p>
                        </article>
                    ))}
                </div>

                <div className="packages-estimate">
                    <p className="packages-estimate__desktop-copy">
                        Five questions and you&rsquo;ll have a price.
                    </p>
                    <a
                        href="#contact"
                        onClick={(event) => navigateToHash(event, "#contact")}
                    >
                        Get My Estimate
                        <img
                            src={arrowImage}
                            className="packages-estimate__icon"
                            alt=""
                            aria-hidden="true"
                        />
                    </a>
                    <p className="packages-estimate__mobile-caption">
                        Answer 5 quick questions to get a tailored estimate.
                    </p>
                </div>
            </div>
        </section>
    );
}
