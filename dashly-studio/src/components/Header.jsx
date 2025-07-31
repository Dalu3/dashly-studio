import "./Header.css";
import arrowIcon from "../assets/arrow.png";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="glass-navbar">
            <Link to="/" className="logo">
                Dashly
            </Link>
            <nav className="nav-links">
                <a href="#packages">Services</a>
                <a href="#stages">Stages</a>
                <a href="#faq">FAQ</a>
                <a href="#contact" className="cta">
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
