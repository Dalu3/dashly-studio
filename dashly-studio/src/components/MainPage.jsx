import "./MainPage.css";
import { navigateToHash } from "../utils/scrollToHash";

export function MainPage() {
    return (
        <div className="hero-copy" id="main">
            <div className="hero-copy__message">
                <h1>
                    <span>We create websites</span>
                    <span>That perform</span>
                </h1>
                <p>
                    Dashly Studio is a web design and development studio<br />
                    helping businesses build a stronger online presence
                </p>
            </div>

            <div className="hero-copy__meta" aria-label="Studio information">
                <span>Based in Scotland</span>
                <a
                    href="#work"
                    onClick={(event) => navigateToHash(event, "#work")}
                >
                    Scroll to explore
                    <span className="hero-copy__scroll-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                    </span>
                </a>
                <span>Working worldwide</span>
            </div>
        </div>
    );
}
