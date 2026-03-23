import { useEffect, useRef, useState } from "react";
import "./Packages.css";
import arrowImage from "../assets/arrow.png";
import ScrollLink from "./ScrollLink";

const MOBILE_BREAKPOINT = "(max-width: 768px)";

const packages = [
    {
        title: "Landing page",
        price: "from £600",
        description:
            "One-page website designed to convert visitors into taking a specific action: booking a service, signing up, or making a purchase etc.",
    },
    {
        title: "Portfolio Web",
        price: "from £600",
        description:
            "Showcase your work, style, or brand with a clean, responsive portfolio site built to impress, convert, and help you stand out in your industry.",
    },
    {
        title: "Multi-Page Web",
        price: "from £750",
        description:
            "A full-featured website with multiple pages perfect for businesses needing separate sections for services, about, contact, and more.",
    },
    {
        title: "Catalogue Web",
        price: "from £800",
        description:
            "Display your products or services in a clean, organised online catalogue without a payment system. Great for browsing, menus, or list of products.",
    },
    {
        title: "E-commerce",
        price: "from £1000",
        description:
            "A fast, secure online store built to sell, complete with product pages, cart, payment integration, and mobile optimization.",
    },
    {
        title: "Redesign Web",
        price: "from £600",
        description:
            "We’ll redesign your current site to look modern, load faster, and work better, enhancing both the user experience and your results.",
    },
];

export default function Packages() {
    const cardRefs = useRef([]);
    const gridRef = useRef(null);
    const [isMobileViewport, setIsMobileViewport] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(MOBILE_BREAKPOINT).matches;
    });
    const [shouldAnimateCards, setShouldAnimateCards] = useState(false);
    const [visibleCards, setVisibleCards] = useState(() =>
        packages.map(() => false),
    );

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
        if (typeof window === "undefined" || !gridRef.current) {
            return undefined;
        }

        const grid = gridRef.current;
        const updateAnimationMode = () => {
            const columns = window
                .getComputedStyle(grid)
                .gridTemplateColumns.split(" ")
                .filter(Boolean).length;

            setShouldAnimateCards(isMobileViewport && columns === 1);
        };

        updateAnimationMode();

        const resizeObserver = new ResizeObserver(updateAnimationMode);
        resizeObserver.observe(grid);
        window.addEventListener("resize", updateAnimationMode);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateAnimationMode);
        };
    }, [isMobileViewport]);

    useEffect(() => {
        if (typeof window === "undefined" || !shouldAnimateCards) {
            return undefined;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisibleCards(packages.map(() => true));
            return undefined;
        }

        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const index = Number(entry.target.dataset.packageIndex);
                    setVisibleCards((current) => {
                        if (current[index]) return current;

                        const next = [...current];
                        next[index] = true;
                        return next;
                    });
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.25,
                rootMargin: "0px 0px -18% 0px",
            },
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [shouldAnimateCards]);

    return (
        <section
            className="packages-section"
            id="packages"
            aria-labelledby="packages-title"
            aria-describedby="packages-seo-copy"
        >
            <h2 className="block-title" id="packages-title">
                {isMobileViewport ? (
                    "Choose Your Website Package"
                ) : (
                    <>
                        Choose Your Perfect
                        <br />
                        Development Package
                    </>
                )}
            </h2>
            <p className="visually-hidden" id="packages-seo-copy">
                Dashly Studio offers website creation UK packages, business
                website UK launches, and responsive website UK builds for
                companies that need a modern online presence in Aberdeen,
                Scotland, and across the United Kingdom.
            </p>
            <div className="packages-grid" ref={gridRef}>
                {packages.map((pkg, index) => (
                    <article
                        key={index}
                        ref={(element) => {
                            cardRefs.current[index] = element;
                        }}
                        data-package-index={index}
                        className={`package-card${shouldAnimateCards ? " package-card--mobile" : ""}${visibleCards[index] ? " is-visible" : ""}`}
                        style={
                            shouldAnimateCards
                                ? {
                                      "--package-delay": `${Math.min(index, 2) * 0.12}s`,
                                  }
                                : undefined
                        }
                    >
                        <div className="package-header">
                            <h3>{pkg.title}</h3>
                            <span className="package-price">{pkg.price}</span>
                        </div>
                        <p className="package-description">{pkg.description}</p>
                        <ScrollLink to="#contact" className="package-cta">
                            Ask a question{" "}
                            <img
                                src={arrowImage}
                                alt="Ask about a small business website package"
                                className="arrow-icon"
                                width="24"
                                height="24"
                                decoding="async"
                            />
                        </ScrollLink>
                    </article>
                ))}
            </div>
        </section>
    );
}
