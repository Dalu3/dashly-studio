import { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./Stages.css";
import arrowRight from "../assets/arrow-right.png";
import arrowLeft from "../assets/arrow-left.png";

const MOBILE_BREAKPOINT = "(max-width: 768px)";

const stages = [
    {
        title: "DISCOVERY CALL",
        description: `We start with a Zoom call or in-person meeting to understand your business, goals, and vision. After that, we’ll send you a detailed summary of what we discussed. \n\nYou’ll have time to review everything and decide if you’d like to move forward with the project.`,
    },
    {
        title: "RESEARCH & STRATEGY",
        description: `We analyse your industry, audience, and key competitors to uncover opportunities.\n\nThis helps us create a strategy that aligns with your goals and captures your audience’s attention.`,
    },
    {
        title: "PLANNING & WIREFRAMES",
        description: `We organise your content into a clear, user-friendly structure and create low-fidelity wireframes — simple layouts that map out each page's key sections and flow.\n\nThis gives you a clear visual plan of how the website will work before we start designing.`,
    },
    {
        title: "DESIGN",
        description: `We bring the wireframes to life with a modern, responsive design tailored to your brand.\n\nYou’ll receive a full preview and have the chance to share any feedback. We’ll keep adjusting the design until it feels perfect to you.`,
    },
    {
        title: "DEVELOPMENT",
        description: `Once the design is approved, we turn it into a fully functional, responsive website using clean, modern code.\n\nEverything is built to be fast, secure, SEO-friendly, and perfectly adapted to all devices — from desktop to mobile.`,
    },
    {
        title: "LAUNCH & ONGOING SUPPORT",
        description: `Once the website is completed, we will test it across all devices to ensure everything works smoothly. \n\n Every project includes 2 weeks of post-launch support for any minor fixes or adjustments. After that, you can always reach out for updates or new features.
        `,
    },
];

export default function Stages() {
    const [current, setCurrent] = useState(0);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const stageBodyRef = useRef(null);
    const stageTextRef = useRef(null);
    const measureRefs = useRef([]);
    const [stageTextMinHeight, setStageTextMinHeight] = useState(0);
    const [isMobileViewport, setIsMobileViewport] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(MOBILE_BREAKPOINT).matches;
    });

    const next = () => setCurrent((prev) => (prev + 1) % stages.length);
    const prev = () =>
        setCurrent((prev) => (prev - 1 + stages.length) % stages.length);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
        const handleChange = (event) => {
            setIsMobileViewport(event.matches);
        };

        setIsMobileViewport(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                prev();
            } else if (e.key === "ArrowRight") {
                next();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [current]);

    const handleTouchStart = (event) => {
        if (!isMobileViewport) return;

        const touch = event.changedTouches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    };

    const handleTouchEnd = (event) => {
        if (!isMobileViewport) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            next();
            return;
        }

        prev();
    };

    useLayoutEffect(() => {
        if (
            typeof window === "undefined" ||
            !stageBodyRef.current ||
            !stageTextRef.current
        ) {
            return undefined;
        }

        const updateStageTextHeight = () => {
            const width = stageTextRef.current?.getBoundingClientRect().width;
            if (!width) return;

            measureRefs.current.forEach((node) => {
                if (node) {
                    node.style.width = `${width}px`;
                }
            });

            const measuredHeights = measureRefs.current
                .map((node) => (node ? node.getBoundingClientRect().height : 0))
                .filter((height) => height > 0);
            const maxHeight = Math.ceil(
                measuredHeights.length
                    ? Math.max(...measuredHeights)
                    : stageTextRef.current.getBoundingClientRect().height,
            );

            setStageTextMinHeight((currentHeight) =>
                currentHeight === maxHeight ? currentHeight : maxHeight,
            );
        };

        updateStageTextHeight();

        const resizeObserver = new ResizeObserver(updateStageTextHeight);
        resizeObserver.observe(stageBodyRef.current);

        window.addEventListener("resize", updateStageTextHeight);
        document.fonts?.ready?.then(updateStageTextHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateStageTextHeight);
        };
    }, [isMobileViewport]);

    return (
        <section
            className="stages-container"
            id="stages"
            aria-labelledby="stages-title"
        >
            <div className="stages-header">
                <h2 className="block-title" id="stages-title">
                    {isMobileViewport
                        ? "Website Process in 7 Steps"
                        : "7 Stages of Website You Need to Know"}
                </h2>

                <div className="stages-navigation">
                    <button
                        className="arrow-button"
                        onClick={prev}
                        type="button"
                        aria-label="Previous stage"
                    >
                        <span className="arrow-line" />
                        <img
                            src={arrowRight}
                            alt=""
                            className="arrow-image"
                            aria-hidden="true"
                        />
                    </button>

                    <div className="stage-counter">
                        <span className="stage-current">{current + 1}</span>
                        <span className="stage-total">/{stages.length}</span>
                    </div>

                    <button
                        className="arrow-button"
                        onClick={next}
                        type="button"
                        aria-label="Next stage"
                    >
                        <img
                            src={arrowLeft}
                            alt=""
                            className="arrow-image"
                            aria-hidden="true"
                        />

                        <span className="arrow-line" />
                    </button>
                </div>
            </div>

            <div className="stage-buttons">
                {stages.map((_, i) => (
                    <button
                        key={i}
                        className={i === current ? "active" : ""}
                        onClick={() => setCurrent(i)}
                        type="button"
                        aria-label={`Show stage ${i + 1}`}
                    >
                        Stage {i + 1}
                    </button>
                ))}
            </div>

            <div
                className="stage-body"
                ref={stageBodyRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="stage-text"
                    key={current}
                    ref={stageTextRef}
                    style={
                        stageTextMinHeight
                            ? { minHeight: `${stageTextMinHeight}px` }
                            : undefined
                    }
                >
                    <h3>{stages[current].title}</h3>
                    <p className="stage-description">
                        {stages[current].description}
                    </p>
                </div>

                <div className="stage-circle">
                    <svg width="270" height="270" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#b6ecff"
                            strokeWidth="10"
                            fill="none"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#29c9ff"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray="282"
                            strokeDashoffset={
                                (1 - (current + 1) / stages.length) * 282
                            }
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            style={{
                                transition:
                                    "stroke-dashoffset 0.6s ease-in-out",
                            }}
                        />
                        {current === stages.length - 1 ? (
                            <path
                                d="M39 50L46.5 57.5L60 44"
                                className="stage-checkmark"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ) : null}
                    </svg>
                </div>
            </div>

            <div className="stage-measurements" aria-hidden="true">
                {stages.map((stage, index) => (
                    <div
                        key={index}
                        ref={(element) => {
                            measureRefs.current[index] = element;
                        }}
                        className="stage-text stage-text--measure"
                    >
                        <h3>{stage.title}</h3>
                        <p className="stage-description">{stage.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
