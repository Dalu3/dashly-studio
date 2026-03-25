import "./Header.css";
import { useEffect, useRef, useState } from "react";
import arrowIcon from "../assets/arrow.png";
import { navigateToHash } from "../utils/scrollToHash";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef();
    const navRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMenuOpen &&
                headerRef.current &&
                !headerRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const handleHashLinkClick = (event, hash) => {
        event.preventDefault();

        if (isMenuOpen) {
            setIsMenuOpen(false);
            window.requestAnimationFrame(() => {
                navigateToHash(null, hash, "/");
            });
            return;
        }

        navigateToHash(null, hash, "/");
    };

    return (
        <>
            {isMenuOpen ? (
                <button
                    type="button"
                    className="menu-overlay open"
                    aria-hidden="false"
                    tabIndex={0}
                    onClick={() => setIsMenuOpen(false)}
                />
            ) : null}

            <header className="glass-navbar" ref={headerRef}>
                <a
                    href="/"
                    className="logo"
                    aria-label="Dashly Studio home"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Dashly
                </a>

                <button
                    type="button"
                    className={`hamburger ${isMenuOpen ? "open" : ""}`}
                    aria-label={
                        isMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav
                    id="primary-navigation"
                    aria-label="Primary"
                    ref={navRef}
                    className={`nav-links ${isMenuOpen ? "open" : ""}`}
                >
                    <a
                        href="/#packages"
                        onClick={(event) => handleHashLinkClick(event, "#packages")}
                    >
                        Services
                    </a>
                    <a
                        href="/#stages"
                        onClick={(event) => handleHashLinkClick(event, "#stages")}
                    >
                        Stages
                    </a>
                    <a
                        href="/#faq"
                        onClick={(event) => handleHashLinkClick(event, "#faq")}
                    >
                        FAQ
                    </a>
                    <a
                        href="/#contact"
                        className="cta"
                        onClick={(event) => handleHashLinkClick(event, "#contact")}
                    >
                        Get In Touch
                        <img
                            src={arrowIcon}
                            alt="Contact Dashly Studio"
                            className="arrow-icon"
                        />
                    </a>
                </nav>
            </header>
        </>
    );
}

export default Header;
