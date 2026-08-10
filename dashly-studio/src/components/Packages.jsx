import { useEffect, useRef, useState } from "react";

import "./Packages.css";
import arrowImage from "../assets/arrow.webp";
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

export default function Packages() {
    const revealTargetRef = useRef(null);
    const readingCopyRef = useRef(null);
    const [isMotionReady, setIsMotionReady] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

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

            copy.style.setProperty("--reading-progress", `${progress * 100}%`);
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
                    <p ref={readingCopyRef} className="packages-intro__reading-copy">
                        Choose the option closest to your idea, or answer five quick
                        questions to receive a personalised project estimate.
                    </p>
                </header>

                <div className="packages-list">
                    {packages.map((pkg) => (
                        <article className="package-row" key={pkg.title}>
                            <h3>{pkg.title}</h3>
                            <p>{pkg.description}</p>
                        </article>
                    ))}
                </div>

                <div className="packages-estimate">
                    <p>Five questions and you&rsquo;ll have a price.</p>
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
                </div>
            </div>
        </section>
    );
}
