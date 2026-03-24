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
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.64 21v-7.73h2.6l.39-3.02h-2.99V8.32c0-.87.24-1.47 1.5-1.47H16.8V4.14c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.17v2.06H7.6v3.02h2.72V21h3.32Z" />
        </svg>
    );
}

function LinkedInMobileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.94 8.5A1.94 1.94 0 1 1 6.95 4.62 1.94 1.94 0 0 1 6.94 8.5ZM5.2 9.97h3.48V21H5.2V9.97Zm5.47 0H14v1.5h.05c.46-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.34V21h-3.48v-5.32c0-1.27-.02-2.9-1.76-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-3.48V9.97Z" />
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
