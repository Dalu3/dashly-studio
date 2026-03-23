import "./Footer.css";
import { Link } from "react-router-dom";

function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3.5"
                y="3.5"
                width="17"
                height="17"
                rx="5"
            />
            <circle cx="12" cy="12" r="4.1" />
            <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <path
                d="M11 10.1H13.1V18H15.2V10.1H16.95L17.3 8.05H15.2V6.95C15.2 6.12 15.54 5.65 16.42 5.65H17.35V4H15.58C13.45 4 13.1 5.44 13.1 6.42V8.05H11V10.1Z"
            />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <path d="M7.6 10.2V16.6" />
            <path d="M7.6 7.8V7.85" />
            <path d="M11 16.6V10.2" />
            <path d="M11 12.5C11 11.26 12 10.3 13.23 10.3C14.46 10.3 15.45 11.26 15.45 12.5V16.6" />
        </svg>
    );
}

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <p className="visually-hidden">
                    Dashly Studio is an Aberdeen web design and web development
                    studio serving small businesses across Scotland and the UK.
                </p>
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
                    <div className="footer-left">© 2026 DASHLY STUDIO</div>
                    <a
                        href="mailto:dashly.studio.webdev@gmail.com"
                        className="footer-email"
                    >
                        dashly.studio.webdev@gmail.com
                    </a>
                    <div className="footer-links">
                        <div className="footer-group footer-socials">
                            <a
                                href="https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link footer-social-link--instagram"
                                aria-label="Dashly Studio on Instagram"
                            >
                                <span className="footer-social-icon footer-social-icon--instagram">
                                    <InstagramIcon />
                                </span>
                                <span className="footer-social-label">
                                    Instagram
                                </span>
                            </a>
                            <a
                                href="https://www.facebook.com/share/1CJ437vchm/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link footer-social-link--facebook"
                                aria-label="Dashly Studio on Facebook"
                            >
                                <span className="footer-social-icon footer-social-icon--facebook">
                                    <FacebookIcon />
                                </span>
                                <span className="footer-social-label">
                                    Facebook
                                </span>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/dashly-studio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link footer-social-link--linkedin"
                                aria-label="Dashly Studio on LinkedIn"
                            >
                                <span className="footer-social-icon footer-social-icon--linkedin">
                                    <LinkedInIcon />
                                </span>
                                <span className="footer-social-label">
                                    LinkedIn
                                </span>
                            </a>
                        </div>
                        <div className="footer-group footer-legal">
                            <Link to="/privacy" className="footer-link">
                                Privacy
                            </Link>
                            <Link to="/terms" className="footer-link">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
