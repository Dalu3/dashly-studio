import "./Privacy.css"; // Reusing the same styles
import { useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { MouseFollower } from "./MouseFollower.jsx";

export default function Terms() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <MouseFollower />
            <Header />
            <div className="privacy-container">
                <h1>Terms and Conditions</h1>
                <p>Last updated: July 31, 2025</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using this website, you agree to comply
                    with and be bound by these Terms and Conditions. If you do
                    not agree, please do not use the website.
                </p>

                <h2>2. Use of the Website</h2>
                <ul>
                    <li>
                        You must be at least 13 years old to use this website.
                    </li>
                    <li>
                        You agree to use the website only for lawful purposes
                        and in a way that does not infringe the rights of
                        others.
                    </li>
                    <li>
                        You must not copy, distribute, or reproduce any content
                        without written permission.
                    </li>
                </ul>

                <h2>3. Intellectual Property</h2>
                <p>
                    All content on this website, including text, images, logos,
                    and designs, is the property of Dashly Studio unless stated
                    otherwise. You may not use or reproduce any materials
                    without prior written consent.
                </p>

                <h2>4. Limitation of Liability</h2>
                <p>
                    We strive to provide accurate and up-to-date information but
                    make no warranties or guarantees. Dashly Studio is not
                    responsible for any loss or damage resulting from your use
                    of this website.
                </p>

                <h2>5. External Links</h2>
                <p>
                    This website may include links to third-party websites. We
                    are not responsible for the content or practices of any
                    external sites.
                </p>

                <h2>6. Changes to These Terms</h2>
                <p>
                    We may update these Terms and Conditions at any time.
                    Changes will be posted on this page, and your continued use
                    of the website constitutes acceptance of those changes.
                </p>

                <h2>7. Contact</h2>
                <p>
                    If you have any questions about these Terms and Conditions,
                    please contact us via the form on our website.
                </p>
            </div>
            <Footer />
        </>
    );
}
