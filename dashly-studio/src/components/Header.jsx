import "./Header.css";
import arrowIcon from "../assets/arrow.png";

function Header() {
    return (
        <header className="glass-navbar">
            <div className="logo">Dashly</div>
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
