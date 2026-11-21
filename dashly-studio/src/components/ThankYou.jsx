import { SOCIAL_PROFILE_LINKS } from "@/constants/socialLinks";
import { trackSocialClick } from "@/utils/consentScripts";

import { TextArrowAction } from "./ui/TextArrowAction.jsx";
import "./ThankYou.css";

/**
 * Post-enquiry confirmation. Composed like a landing-page section rather than
 * a modal: one centred content column on the site's section rhythm, then a
 * quiet social block before the footer. The page background lands on
 * `--color-surface-accent-subtle` so the dark footer meets the same colour it
 * meets on the home page.
 */
export default function ThankYou() {
    return (
        <main className="thank-you-page" id="main-content" tabIndex={-1}>
            <div className="thank-you-page__inner">
                <div className="thank-you-page__copy">
                    <span className="thank-you-page__mark" aria-hidden="true">
                        <span className="thank-you-page__mark-tick" />
                    </span>
                    <h1 className="thank-you-page__title">Thank you!</h1>
                    <p className="thank-you-page__body">
                        Your enquiry is on its way. We&rsquo;ll reply within 1
                        working day with the best next step for your project.
                    </p>
                    <TextArrowAction
                        className="thank-you-page__action"
                        href="/"
                    >
                        Back to homepage
                    </TextArrowAction>
                </div>

                <section
                    className="thank-you-page__connect"
                    aria-labelledby="thank-you-connect-heading"
                >
                    <h2
                        className="thank-you-page__connect-heading"
                        id="thank-you-connect-heading"
                    >
                        Let&rsquo;s stay connected
                    </h2>
                    <p className="thank-you-page__connect-note">
                        Follow us for our latest projects, updates and
                        inspiration.
                    </p>
                    <ul className="thank-you-page__socials">
                        {SOCIAL_PROFILE_LINKS.map((social) => (
                            <li key={social.platform}>
                                <a
                                    className="thank-you-page__social"
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Dashly Studio on ${social.label} (opens in a new tab)`}
                                    onClick={() =>
                                        trackSocialClick(social.platform)
                                    }
                                >
                                    {social.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
