import "./Header.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import arrowIcon from "../assets/arrow.webp";
import { navigateToHash, scrollToTop } from "../utils/scrollToHash";
import { openEstimator } from "./estimator/estimatorEvents";

const mobileLinks = [
    ["Work", "#work"],
    ["Services", "#packages"],
    ["Stages", "#stages"],
    ["FAQ", "#faq"],
    ["Price Estimator", "#estimator"],
];

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuClosing, setIsMenuClosing] = useState(false);
    const [scrollPhase, setScrollPhase] = useState("top");
    const scrollPhaseRef = useRef("top");
    const scrollPositionRef = useRef({ x: 0, y: 0 });
    const pendingLogoScrollRef = useRef(false);
    const pendingHashScrollRef = useRef(null);

    useLayoutEffect(() => {
        if (!isMenuOpen && !isMenuClosing) {
            return undefined;
        }

        const body = document.body;
        const documentElement = document.documentElement;
        const previousStyles = {
            bodyOverflow: body.style.overflow,
            htmlOverflow: documentElement.style.overflow,
            htmlOverscrollBehavior: documentElement.style.overscrollBehavior,
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                setIsMenuClosing(true);
            }
        };

        body.style.overflow = "hidden";
        documentElement.style.overflow = "hidden";
        documentElement.style.overscrollBehavior = "none";
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            body.style.overflow = previousStyles.bodyOverflow;
            documentElement.style.overflow = previousStyles.htmlOverflow;
            documentElement.style.overscrollBehavior =
                previousStyles.htmlOverscrollBehavior;
            document.removeEventListener("keydown", closeOnEscape);
            window.scrollTo(scrollPositionRef.current.x, scrollPositionRef.current.y);
        };
    }, [isMenuOpen, isMenuClosing]);

    useEffect(() => {
        let frameId = 0;

        const commitScrolledState = () => {
            frameId = 0;
            const nextPhase =
                window.scrollY >= window.innerHeight
                    ? "floating"
                    : window.scrollY > 0
                      ? "scrolling"
                      : "top";

            if (nextPhase !== scrollPhaseRef.current) {
                scrollPhaseRef.current = nextPhase;
                setScrollPhase(nextPhase);
            }
        };

        const scheduleScrolledState = () => {
            if (!frameId) {
                frameId = window.requestAnimationFrame(commitScrolledState);
            }
        };

        commitScrolledState();
        window.addEventListener("scroll", scheduleScrolledState, { passive: true });
        window.addEventListener("resize", scheduleScrolledState);

        return () => {
            window.removeEventListener("scroll", scheduleScrolledState);
            window.removeEventListener("resize", scheduleScrolledState);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const handleHashLinkClick = (event, hash) => {
        event.preventDefault();

        if (hash === "#estimator") {
            const trigger = isMenuOpen
                ? document.querySelector(".hamburger")
                : event.currentTarget;
            if (isMenuOpen) closeMobileMenu();
            window.requestAnimationFrame(() => openEstimator(trigger));
            return;
        }

        if (isMenuOpen) {
            pendingHashScrollRef.current = hash;
            closeMobileMenu();
            return;
        }

        navigateToHash(null, hash, "/");
    };

    const handleLogoClick = (event) => {
        event.preventDefault();

        if (window.location.pathname !== "/") {
            window.location.assign("/");
            return;
        }

        window.history.replaceState({}, "", "/");

        if (isMenuOpen) {
            pendingLogoScrollRef.current = true;
            closeMobileMenu();
            return;
        }

        scrollToTop();
    };

    const toggleMobileMenu = () => {
        if (isMenuOpen) {
            closeMobileMenu();
            return;
        }

        scrollPositionRef.current = { x: window.scrollX, y: window.scrollY };
        setIsMenuClosing(false);
        setIsMenuOpen(true);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        setIsMenuClosing(true);
    };

    const handleMenuTransitionEnd = (event) => {
        if (
            event.target === event.currentTarget &&
            event.propertyName === "opacity" &&
            !isMenuOpen
        ) {
            setIsMenuClosing(false);

            if (pendingLogoScrollRef.current) {
                pendingLogoScrollRef.current = false;
                scrollToTop();
            }

            if (pendingHashScrollRef.current) {
                const hash = pendingHashScrollRef.current;
                pendingHashScrollRef.current = null;

                window.requestAnimationFrame(() =>
                    navigateToHash(null, hash, "/"),
                );
            }
        }
    };

    return (
        <>
            <header
                className={`glass-navbar glass-navbar--${scrollPhase} ${isMenuOpen || isMenuClosing ? "glass-navbar--menu-open" : ""}`}
            >
                <a
                    href="/"
                    className="logo"
                    aria-label="Dashly Studio home"
                    onClick={handleLogoClick}
                >
                    Dashly
                </a>

                <button
                    type="button"
                    className={`hamburger ${isMenuOpen ? "hamburger--open" : ""}`}
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={toggleMobileMenu}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav className="nav-links" aria-label="Primary">
                    {mobileLinks.map(([label, hash]) => (
                        <a
                            key={hash}
                            href={`/${hash}`}
                            onClick={(event) => handleHashLinkClick(event, hash)}
                        >
                            {label}
                        </a>
                    ))}
                    <a
                        href="/#contact"
                        className="cta"
                        onClick={(event) => handleHashLinkClick(event, "#contact")}
                    >
                        Let’s Talk
                        <img src={arrowIcon} alt="" className="arrow-icon" />
                    </a>
                </nav>
            </header>

            {createPortal(
                <aside
                    id="mobile-navigation"
                    className={`mobile-menu ${isMenuOpen ? "mobile-menu--open" : ""}`}
                    aria-hidden={!isMenuOpen}
                    inert={isMenuOpen ? undefined : ""}
                    onTransitionEnd={handleMenuTransitionEnd}
                >
                    <div className="mobile-menu__top" aria-hidden="true">
                        <a
                            href="/"
                            className="mobile-menu__logo"
                            aria-label="Dashly Studio home"
                            onClick={handleLogoClick}
                        >
                            Dashly
                        </a>
                        <button
                            type="button"
                            className="mobile-menu__close"
                            aria-label="Close navigation menu"
                            onClick={closeMobileMenu}
                        >
                            ×
                        </button>
                    </div>

                    <nav className="mobile-menu__links" aria-label="Mobile primary">
                        {mobileLinks.map(([label, hash]) => (
                            <a
                                key={hash}
                                href={`/${hash}`}
                                onClick={(event) => handleHashLinkClick(event, hash)}
                            >
                                {label}
                            </a>
                        ))}
                        <a
                            href="/#contact"
                            className="mobile-menu__cta"
                            onClick={(event) => handleHashLinkClick(event, "#contact")}
                        >
                            <span>Let’s Talk</span>
                            <img
                                src={arrowIcon}
                                alt=""
                                aria-hidden="true"
                                className="mobile-menu__cta-arrow"
                            />
                        </a>
                    </nav>
                </aside>,
                document.body,
            )}
        </>
    );
}

export default Header;
