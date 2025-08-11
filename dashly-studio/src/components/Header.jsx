import "./Header.css";
import arrowIcon from "../assets/arrow.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMenuOpen &&
                navRef.current &&
                !navRef.current.contains(event.target)
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
        <header className="glass-navbar">
            <Link
                to="/"
                className="logo"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                Dashly
            </Link>

            <div
                className="hamburger"
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                {!isMenuOpen ? (
                    <>
                        <span></span>
                        <span></span>
                        <span></span>
                    </>
                ) : null}
            </div>

            <nav
                ref={navRef}
                className={`nav-links ${isMenuOpen ? "open" : ""}`}
            >
                {isMenuOpen && (
                    <span
                        className="close-icon"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        &times;
                    </span>
                )}
                <a href="/#packages" onClick={handleLinkClick}>
                    Services
                </a>
                <a href="/#stages" onClick={handleLinkClick}>
                    Stages
                </a>
                <a href="/#faq" onClick={handleLinkClick}>
                    FAQ
                </a>
                <a href="/#contact" className="cta" onClick={handleLinkClick}>
                    Get In Touch
                    <img
                        src={arrowIcon}
                        alt="Arrow icon"
                        className="arrow-icon"
                    />
                </a>
            </nav>
        </header>
    );
}

export default Header;
