export interface FooterNavLink {
    label: string;
    href: string;
}

export interface FooterSocialLink {
    /** Stable identity, not currently used for an icon — the Figma frame
     *  shows these as plain text links. */
    platform: "instagram" | "facebook" | "linkedin";
    label: string;
    href: string;
}

/**
 * In-page anchors, matching Header.jsx's own nav hrefs — plain links are
 * enough because App.jsx already smooth-scrolls on any hash change
 * (see `scrollToHash`), so no click handler is needed here.
 *
 * CMS-ready: this is the one place that would change to pull nav copy from a
 * future content source. The layout in Footer.tsx never has to change.
 */
export const FOOTER_NAV_LINKS: readonly FooterNavLink[] = [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#packages" },
    { label: "Process", href: "/#stages" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
];

export const FOOTER_SOCIAL_LINKS: readonly FooterSocialLink[] = [
    {
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr",
    },
    {
        platform: "facebook",
        label: "Facebook",
        href: "https://www.facebook.com/share/1CJ437vchm/?mibextid=wwXIfr",
    },
    {
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/dashly-studio/",
    },
];
