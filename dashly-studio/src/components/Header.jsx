import "./Header.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navigateToHash, scrollToTop } from "../utils/scrollToHash";
import { openEstimator } from "./estimator/estimatorEvents";
import { TextArrowAction } from "./ui/TextArrowAction.jsx";

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
    const initialScrollPhase = window.location.pathname === "/" ? "top" : "floating";
    const [scrollPhase, setScrollPhase] = useState(initialScrollPhase);
    const scrollPhaseRef = useRef(initialScrollPhase);
    const scrollPositionRef = useRef({ x: 0, y: 0 });
    const pendingLogoScrollRef = useRef(false);
    const pendingHashScrollRef = useRef(null);
    const pendingEstimatorOpenRef = useRef(null);
    const menuCloseCompletedRef = useRef(true);
    const menuRef = useRef(null);
    const menuTriggerRef = useRef(null);

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
            // Restore the locked position only while transitioning directly
            // from the open menu state. Once the close transition is active,
            // navigation may already have started a smooth scroll; restoring
            // here would overwrite it with an instant jump in Safari.
            if (isMenuOpen) {
                window.scrollTo(
                    scrollPositionRef.current.x,
                    scrollPositionRef.current.y,
                );
            }
        };
    }, [isMenuOpen, isMenuClosing]);

    useEffect(() => {
        if (!isMenuOpen || !menuRef.current) {
            return undefined;
        }

        const menu = menuRef.current;
        const focusableSelector =
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = () => [...menu.querySelectorAll(focusableSelector)];
        const firstFocusable = focusable()[0];
        firstFocusable?.focus();

        const trapFocus = (event) => {
            if (event.key !== "Tab") return;

            const items = focusable();
            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", trapFocus);
        return () => document.removeEventListener("keydown", trapFocus);
    }, [isMenuOpen]);

    useEffect(() => {
        let frameId = 0;

        const commitScrolledState = () => {
            frameId = 0;
            const isSecondaryPage = window.location.pathname !== "/";
            const nextPhase = isSecondaryPage
                ? "floating"
                : window.scrollY >= window.innerHeight
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
            if (window.location.pathname !== "/") {
                window.history.pushState({}, "", "/#estimator");
                window.dispatchEvent(new PopStateEvent("popstate"));
                return;
            }

            const trigger = isMenuOpen
                ? document.querySelector(".hamburger")
                : event.currentTarget;
            if (isMenuOpen) {
                pendingEstimatorOpenRef.current = trigger;
                closeMobileMenu();
                return;
            }

            openEstimator(trigger);
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
        menuCloseCompletedRef.current = true;
        setIsMenuClosing(false);
        setIsMenuOpen(true);
    };

    const closeMobileMenu = () => {
        menuCloseCompletedRef.current = false;
        setIsMenuOpen(false);
        setIsMenuClosing(true);
        window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
    };

    const completeMobileMenuClose = useCallback(() => {
        if (menuCloseCompletedRef.current) return;

        menuCloseCompletedRef.current = true;
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

        if (pendingEstimatorOpenRef.current) {
            const trigger = pendingEstimatorOpenRef.current;
            pendingEstimatorOpenRef.current = null;
            window.requestAnimationFrame(() => openEstimator(trigger));
        }
    }, []);

    const handleMenuTransitionEnd = (event) => {
        if (
            event.target === event.currentTarget &&
            event.propertyName === "opacity" &&
            !isMenuOpen
        ) {
            completeMobileMenuClose();
        }
    };

    useEffect(() => {
        if (!isMenuClosing) return undefined;

        const rawDuration = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--duration-normal")
            .trim();
        const parsedDuration = Number.parseFloat(rawDuration);
        const duration = Number.isFinite(parsedDuration)
            ? rawDuration.endsWith("ms")
                ? parsedDuration
                : parsedDuration * 1000
            : 0;
        let frameId = 0;
        const timerId = window.setTimeout(() => {
            frameId = window.requestAnimationFrame(completeMobileMenuClose);
        }, duration);

        return () => {
            window.clearTimeout(timerId);
            window.cancelAnimationFrame(frameId);
        };
    }, [completeMobileMenuClose, isMenuClosing]);

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
                    ref={menuTriggerRef}
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
                    <TextArrowAction
                        href="/#contact"
                        onClick={(event) => handleHashLinkClick(event, "#contact")}
                    >
                        Let’s Talk
                    </TextArrowAction>
                </nav>
            </header>

            {createPortal(
                <aside
                    id="mobile-navigation"
                    ref={menuRef}
                    className={`mobile-menu ${isMenuOpen ? "mobile-menu--open" : ""}`}
                    aria-hidden={!isMenuOpen}
                    inert={isMenuOpen ? undefined : ""}
                    onTransitionEnd={handleMenuTransitionEnd}
                >
                    <div className="mobile-menu__top">
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
                        <TextArrowAction
                            href="/#contact"
                            className="mobile-menu__cta"
                            onClick={(event) => handleHashLinkClick(event, "#contact")}
                        >
                            Let’s Talk
                        </TextArrowAction>
                    </nav>
                </aside>,
                document.body,
            )}
        </>
    );
}

export default Header;
