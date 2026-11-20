import { SOCIAL_LINKS } from "@/seo/siteMetadata.js";

/**
 * The studio's social profiles, resolved once from the `SOCIAL_LINKS` URLs in
 * `siteMetadata.js` (which structured data also consumes). Any UI that shows a
 * social link — footer, thank-you page — reads this list rather than repeating
 * a URL, so there is exactly one place a profile URL can change.
 */
export type SocialPlatform = "instagram" | "facebook" | "linkedin";

export interface SocialProfileLink {
    /** Stable identity, also sent as the GA4 `social_click` platform value. */
    platform: SocialPlatform;
    label: string;
    href: string;
}

export const SOCIAL_PROFILE_LINKS: readonly SocialProfileLink[] = [
    {
        platform: "instagram",
        label: "Instagram",
        href: SOCIAL_LINKS[0]!,
    },
    {
        platform: "facebook",
        label: "Facebook",
        href: SOCIAL_LINKS[1]!,
    },
    {
        platform: "linkedin",
        label: "LinkedIn",
        href: SOCIAL_LINKS[2]!,
    },
];
