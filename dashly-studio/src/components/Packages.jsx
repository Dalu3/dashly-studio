import { useEffect, useRef, useState } from "react";
import "./Packages.css";
import arrowImage from "../assets/arrow.png";
import { navigateToHash } from "../utils/scrollToHash";

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
    const animatedCardsRef = useRef(packages.map(() => false));
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

        const ResizeObserverConstructor = window.ResizeObserver;
        const resizeObserver =
            typeof ResizeObserverConstructor === "function"
                ? new ResizeObserverConstructor(updateAnimationMode)
                : null;

        resizeObserver?.observe(grid);
        window.addEventListener("resize", updateAnimationMode);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", updateAnimationMode);
        };
    }, [isMobileViewport]);

    useEffect(() => {
        if (typeof window === "undefined" || !shouldAnimateCards) {
            return undefined;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            animatedCardsRef.current = packages.map(() => true);
            setVisibleCards(packages.map(() => true));
            return undefined;
        }

        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return undefined;

        const revealCard = (card) => {
            const index = Number(card.dataset.packageIndex);

            if (
                Number.isNaN(index) ||
                animatedCardsRef.current[index] ||
                card.classList.contains("animated")
            ) {
                return;
            }

            animatedCardsRef.current[index] = true;

            setVisibleCards((current) => {
                if (current[index]) return current;

                const next = [...current];
                next[index] = true;
                return next;
            });
        };

        const revealVisibleCards = () => {
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;

            cards.forEach((card) => {
                if (
                    card.classList.contains("animated") ||
                    animatedCardsRef.current[
                        Number(card.dataset.packageIndex)
                    ]
                ) {
                    return;
                }

                const rect = card.getBoundingClientRect();
                const isVisible =
                    rect.top <= viewportHeight * 0.92 &&
                    rect.bottom >= viewportHeight * 0.08;

                if (isVisible) {
                    revealCard(card);
                }
            });
        };

        const forceLayout = () => {
            gridRef.current?.getBoundingClientRect();
            cards.forEach((card) => card.getBoundingClientRect());
        };

        let observer;

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (
                            !entry.isIntersecting ||
                            entry.target.classList.contains("animated")
                        ) {
                            return;
                        }

                        revealCard(entry.target);
                        observer?.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.1,
                },
            );

            window.requestAnimationFrame(() => {
                forceLayout();
                cards.forEach((card) => {
                    if (!card.classList.contains("animated")) {
                        observer?.observe(card);
                    }
                });
                revealVisibleCards();
            });
        } else {
            window.requestAnimationFrame(() => {
                forceLayout();
                revealVisibleCards();
            });
        }

        window.addEventListener("scroll", revealVisibleCards, {
            passive: true,
        });
        window.addEventListener("resize", revealVisibleCards);
        window.addEventListener("orientationchange", revealVisibleCards);
        window.addEventListener("load", revealVisibleCards);
        document.fonts?.ready?.then(revealVisibleCards);

        return () => {
            observer?.disconnect();
            window.removeEventListener("scroll", revealVisibleCards);
            window.removeEventListener("resize", revealVisibleCards);
            window.removeEventListener("orientationchange", revealVisibleCards);
            window.removeEventListener("load", revealVisibleCards);
        };
    }, [shouldAnimateCards]);

    return (
        <section className="packages-section" id="packages">
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
            <div className="packages-grid" ref={gridRef}>
                {packages.map((pkg, index) => (
                    <article
                        key={index}
                        ref={(element) => {
                            cardRefs.current[index] = element;
                        }}
                        data-package-index={index}
                        className={`package-card${shouldAnimateCards ? " package-card--mobile" : ""}${visibleCards[index] ? " is-visible animated" : ""}`}
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
                        <a
                            href="#contact"
                            className="package-cta"
                            onClick={(event) =>
                                navigateToHash(event, "#contact")
                            }
                        >
                            Ask a question{" "}
                            <img
                                src={arrowImage}
                                alt="Ask a question"
                                className="arrow-icon"
                            />
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}
