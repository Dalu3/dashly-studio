import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-support">
                    <span
                        className="clickable-ukraine"
                        onClick={() =>
                            window.open(
                                "https://savelife.in.ua/en/donate-en/#donate-army-card-oncehttps://savelife.in.ua/en/donate-en/",
                                "_blank"
                            )
                        }
                    >
                        Stand With Ukraine
                    </span>
                    <span className="ukraine-flag"></span>
                </div>

                <div className="footer-bottom">
                    <div className="footer-left">© 2025 DASHLY STUDIO</div>
                    <div className="footer-links">
                        <a
                            href="https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <Link to="/privacy" className="privacy-link">
                            Privacy
                        </Link>
                        <Link to="/terms" className="privacy-link">
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
