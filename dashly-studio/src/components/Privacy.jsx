import { useEffect } from "react";
import "./Privacy.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { MouseFollower } from "./MouseFollower";
import Seo from "./Seo.jsx";

export default function Privacy() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <Seo
                title="Privacy Policy | Dashly Studio"
                description="Privacy policy for Dashly Studio, a web design and website development studio serving Aberdeen and businesses across the UK."
                path="/privacy"
                robots="noindex,follow"
            />
            <MouseFollower />
            <Header />
            <main className="privacy-container">
                <h1>Privacy Policy</h1>
                <p>Last updated: March 22, 2026</p>

                <h2>1. Introduction</h2>
                <p>
                    We respect your privacy and are committed to protecting your
                    personal data. This Privacy Policy explains how we collect,
                    use, and safeguard your information when you visit our
                    website.
                </p>

                <h2>2. Information We Collect</h2>
                <ul>
                    <li>
                        Personal Information (such as name, email) that you
                        voluntarily provide via forms.
                    </li>
                    <li>
                        Usage Data (e.g., browser type, pages visited) collected
                        automatically.
                    </li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <ul>
                    <li>To respond to inquiries and provide support.</li>
                    <li>
                        To improve website functionality and user experience.
                    </li>
                    <li>
                        To send occasional updates or offers (if you opt-in).
                    </li>
                </ul>

                <h2>4. Cookies and Consent</h2>
                <p>
                    We use a small number of cookies and similar technologies
                    to keep the website working, understand site usage, and
                    support marketing when those tools are enabled.
                </p>
                <ul>
                    <li>
                        Necessary cookies are always active because they support
                        core site functionality and security.
                    </li>
                    <li>
                        Analytics cookies are optional and only run if you
                        choose to allow them.
                    </li>
                    <li>
                        Marketing cookies are optional and only run if you
                        choose to allow them.
                    </li>
                    <li>
                        We store your cookie preferences in your browser&apos;s
                        local storage so we can remember your choice.
                    </li>
                </ul>
                <p>
                    You can update your choice at any time using the
                    &quot;Cookie Settings&quot; link in the footer.
                </p>

                <h2>5. Third-Party Services</h2>
                <p>
                    We may use third-party services like analytics tools or
                    email delivery platforms. These providers have their own
                    privacy policies.
                </p>

                <h2>6. Your Rights</h2>
                <ul>
                    <li>
                        You can request access, correction, or deletion of your
                        personal data.
                    </li>
                    <li>
                        You may opt out of marketing communications at any time.
                    </li>
                </ul>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, feel
                    free to contact us via the form on our website.
                </p>
            </main>
            <Footer />
        </>
    );
}
