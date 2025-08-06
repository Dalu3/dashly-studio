import { useEffect } from "react";
import "./Privacy.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { MouseFollower } from "./MouseFollower";

export default function Privacy() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <MouseFollower />
            <Header />
            <div className="privacy-container">
                <h1>Privacy Policy</h1>
                <p>Last updated: July 31, 2025</p>

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

                <h2>4. Third-Party Services</h2>
                <p>
                    We may use third-party services like analytics tools or
                    email delivery platforms. These providers have their own
                    privacy policies.
                </p>

                <h2>5. Your Rights</h2>
                <ul>
                    <li>
                        You can request access, correction, or deletion of your
                        personal data.
                    </li>
                    <li>
                        You may opt out of marketing communications at any time.
                    </li>
                </ul>

                <h2>6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, feel
                    free to contact us via the form on our website.
                </p>
            </div>
            <Footer />
        </>
    );
}
