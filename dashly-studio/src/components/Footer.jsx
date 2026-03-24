import "./Footer.css";

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
            <path d="M11 10.1H13.1V18H15.2V10.1H16.95L17.3 8.05H15.2V6.95C15.2 6.12 15.54 5.65 16.42 5.65H17.35V4H15.58C13.45 4 13.1 5.44 13.1 6.42V8.05H11V10.1Z" />
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

function InstagramMobileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.55a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.1A4.9 4.9 0 1 1 7.1 12 4.9 4.9 0 0 1 12 7.1Zm0 1.8A3.1 3.1 0 1 0 15.1 12 3.1 3.1 0 0 0 12 8.9Z" />
        </svg>
    );
}

function FacebookMobileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
                x="2.9"
                y="2.9"
                width="18.2"
                height="18.2"
                rx="5.2"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M13.18 18v-5.08h1.72l.26-1.99h-1.98V9.65c0-.57.16-.96.98-.96h1.06V6.91c-.19-.03-.85-.07-1.6-.07-1.58 0-2.65.96-2.65 2.73v1.36h-1.79v1.99h1.79V18h2.21Z"
                fill="currentColor"
            />
        </svg>
    );
}

function LinkedInMobileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
                x="2.9"
                y="2.9"
                width="18.2"
                height="18.2"
                rx="5.2"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M8.04 10.18A1.36 1.36 0 1 1 8.05 7.46a1.36 1.36 0 0 1-.01 2.72ZM6.81 11.2h2.45v6.99H6.81V11.2Zm3.84 0H13v.95h.04c.32-.56 1.12-1.13 2.31-1.13 2.47 0 2.92 1.62 2.92 3.38v3.79h-2.45v-3.36c0-.8-.01-1.84-1.24-1.84s-1.43.87-1.43 1.77v3.43H10.65V11.2Z"
                fill="currentColor"
            />
        </svg>
    );
}

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
                    <div className="footer-left">© 2026 Dashly Studio</div>
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
                                <span className="footer-social-icon footer-social-icon--mobile footer-social-icon--instagram-mobile">
                                    <InstagramMobileIcon />
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
                                <span className="footer-social-icon footer-social-icon--mobile footer-social-icon--facebook-mobile">
                                    <FacebookMobileIcon />
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
                                <span className="footer-social-icon footer-social-icon--mobile footer-social-icon--linkedin-mobile">
                                    <LinkedInMobileIcon />
                                </span>
                                <span className="footer-social-label">
                                    LinkedIn
                                </span>
                            </a>
                        </div>
                        <div className="footer-group footer-legal">
                            <a href="/privacy/" className="footer-link">
                                Privacy
                            </a>
                            <a href="/terms/" className="footer-link">
                                Terms
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
