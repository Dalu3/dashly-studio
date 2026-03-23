import "./Header.css";
import arrowIcon from "../assets/arrow.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ScrollLink from "./ScrollLink";

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
                <Link
                    to="/"
                    className="logo"
                    aria-label="Dashly Studio home"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                >
                    Dashly
                </Link>

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
                    <ScrollLink to="/#packages" onClick={handleLinkClick}>
                        Services
                    </ScrollLink>
                    <ScrollLink to="/#stages" onClick={handleLinkClick}>
                        Stages
                    </ScrollLink>
                    <ScrollLink to="/#faq" onClick={handleLinkClick}>
                        FAQ
                    </ScrollLink>
                    <ScrollLink
                        to="/#contact"
                        className="cta"
                        onClick={handleLinkClick}
                    >
                        Get In Touch
                        <img
                            src={arrowIcon}
                            alt="Contact Dashly Studio about a business website"
                            className="arrow-icon"
                            width="35"
                            height="35"
                            decoding="async"
                        />
                    </ScrollLink>
                </nav>
            </header>
        </>
    );
}

export default Header;
