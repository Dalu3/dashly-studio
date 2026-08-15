import "./MainPage.css";
import { ArrowControl } from "./ui/ArrowControl";
import { navigateToHash } from "../utils/scrollToHash";
import { homeContent } from "../seo/siteMetadata.js";

export function MainPage() {
    return (
        <div className="hero-copy" id="main">
            <div className="hero-copy__message">
                <h1>
                    {homeContent.heroTitleLines.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </h1>
                <p>{homeContent.heroSubtitle}</p>
            </div>

            <div className="hero-copy__meta" aria-label="Studio information">
                <span>
                    Based in <br className="hero-copy__meta-break" /> Scotland
                </span>
                <a
                    href="#work"
                    onClick={(event) => navigateToHash(event, "#work")}
                >
                    <span className="hero-copy__scroll-label">Scroll to explore</span>
                    <ArrowControl
                        className="hero-copy__scroll-icon"
                        variant="accent"
                    />
                </a>
                <span>
                    Working <br className="hero-copy__meta-break" /> Worldwide
                </span>
            </div>
        </div>
    );
}
