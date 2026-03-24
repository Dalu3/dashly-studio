import "./Header.css";
import { useEffect, useRef, useState } from "react";
import arrowIcon from "../assets/arrow.png";

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

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className={`menu-overlay ${isMenuOpen ? "open" : ""}`}
                aria-hidden={!isMenuOpen}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
            />

            <header className="glass-navbar" ref={headerRef}>
                <a
                    href="/"
                    className="logo"
                    aria-label="Dashly Studio home"
                    onClick={handleLinkClick}
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
                    <a href="/#packages" onClick={handleLinkClick}>
                        Services
                    </a>
                    <a href="/#stages" onClick={handleLinkClick}>
                        Stages
                    </a>
                    <a href="/#faq" onClick={handleLinkClick}>
                        FAQ
                    </a>
                    <a
                        href="/#contact"
                        className="cta"
                        onClick={handleLinkClick}
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
