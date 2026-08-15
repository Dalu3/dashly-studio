import { cn } from "@/utils/cn";
import type { MouseEvent } from "react";

import { FOOTER_NAV_LINKS, FOOTER_SOCIAL_LINKS } from "./footerLinks";
import styles from "./Footer.module.css";

/**
 * Site footer, matching the Figma frame exactly: tagline + wordmark, a
 * Navigation column, a "Let's stay in touch" column (plain text social
 * links, no icons), then copyright + legal links. Nothing here that isn't
 * in that frame — no Ukraine banner, no email line, no icon glyphs.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const handleLegalLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        const href = event.currentTarget.getAttribute("href");

        if (!href) {
            return;
        }

        window.scrollTo(0, 0);
        window.history.pushState({}, "", href);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return (
        <footer className={styles.root}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    <p className={styles.tagline}>
                        Let&rsquo;s create a website that works as hard as you do.
                    </p>
                    <p className={styles.wordmark}>Dashly Studio</p>
                </div>

                <div className={styles.columns}>
                    <nav className={styles.nav} aria-label="Footer">
                        <h3 className={styles.columnHeading}>Navigation</h3>
                        <ul className={styles.linkList}>
                            {FOOTER_NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a className={styles.link} href={link.href}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.touch}>
                        <h3 className={styles.columnHeading}>
                            Let&rsquo;s stay in touch
                        </h3>
                        <div className={styles.touchBody}>
                            <p className={styles.touchBlurb}>
                                {/* Figma's phone frame (node 609:91) uses shorter copy
                                    than tablet/desktop — two real text nodes toggled by
                                    CSS display so screen readers only ever see one. */}
                                <span className={styles.touchBlurbShort}>
                                    Follow us for updates and inspiration.
                                </span>
                                <span className={styles.touchBlurbLong}>
                                    Follow us on social media for updates, insights &amp;
                                    inspiration.
                                </span>
                            </p>
                            <ul className={styles.linkList}>
                                {FOOTER_SOCIAL_LINKS.map((social) => (
                                    <li key={social.href}>
                                        <a
                                            className={styles.link}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Dashly Studio on ${social.label}`}
                                        >
                                            {social.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.bottom}>
                <p className={styles.copyright}>
                    © {currentYear}, Dashly Studio. All Rights Reserved.
                </p>
                <div className={styles.legal}>
                    <a
                        className={cn(styles.link, styles.legalLink)}
                        href="/terms/"
                        onClick={handleLegalLinkClick}
                    >
                        Terms &amp; Conditions
                    </a>
                    <span className={styles.legalSeparator} aria-hidden="true">
                        •
                    </span>
                    <a
                        className={cn(styles.link, styles.legalLink)}
                        href="/privacy/"
                        onClick={handleLegalLinkClick}
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
}
