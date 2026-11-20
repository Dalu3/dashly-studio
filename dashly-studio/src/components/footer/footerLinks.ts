import {
    SOCIAL_PROFILE_LINKS,
    type SocialProfileLink,
} from "@/constants/socialLinks";

export interface FooterNavLink {
    label: string;
    href: string;
}

/** The Figma frame shows these as plain text links, so no icon field. */
export type FooterSocialLink = SocialProfileLink;

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

export const FOOTER_SOCIAL_LINKS: readonly FooterSocialLink[] =
    SOCIAL_PROFILE_LINKS;
