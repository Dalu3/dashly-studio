/**
 * Selected work — the carousel's content.
 *
 * The carousel currently contains the three projects with available artwork.
 * Projects without a preview are intentionally omitted until their assets are
 * ready, so the section never renders empty cards.
 *
 * To wire up a real project: drop the export into `src/assets/work/`, import it
 * at the top of this file (Vite fingerprints and optimises imported assets —
 * do NOT hardcode a `/src/...` string path), and set `image` plus the intrinsic
 * `width`/`height` of that file. The dimensions are what reserve the card's
 * space before the bytes arrive, so there is no reflow as images load.
 *
 * `mobileImage` is optional and, when set, is served in place of `image`
 * below --bp-md (48rem/768px) via a <picture> source in ProjectCard — a
 * separate crop/export for phone widths, not just a resized copy.
 *
 * mobileImage is NOT wired up below right now: the current
 * *-mobile.png/webp exports in src/assets/work are only 300x200 (the
 * desktop images are 630x380), so on a 2x/3x phone they render visibly
 * soft at the card's ~300px display width. Re-import and set mobileImage
 * once real 2x/3x mobile exports (~600x400 / 900x600) land.
 */

import cvWebWork from "@/assets/work/cv-web-work.webp";
import forPeopleWork from "@/assets/work/forpeople-work.webp";
import privateDocWork from "@/assets/work/private-doc-work.webp";

export interface Project {
    /** Stable identity for React's reconciliation. */
    id: string;
    title: string;
    description: string;
    /** Shorter description used only below the tablet breakpoint. */
    mobileDescription?: string;
    /** External project URL opened from the complete card. */
    url?: string;
    /** Imported image module. Undefined renders the empty frame. */
    image?: string;
    /** Intrinsic pixel size of `image`. Prevents layout shift on load. */
    width?: number;
    height?: number;
    /** Optional phone-only crop, served below --bp-md (48rem/768px) instead
     *  of `image`. Falls back to `image` at every width when omitted. */
    mobileImage?: string;
    /** Defaults to a description built from the title. Set this when the image
     *  carries information the title and description do not. */
    imageAlt?: string;
}

export const PROJECTS: Project[] = [
    {
        id: "digital-cv",
        title: "Digital CV",
        description: "Interactive personal portfolio",
        url: "https://darialysunets.com/",
        image: cvWebWork,
        width: 630,
        height: 380,
    },
    {
        id: "for-people",
        title: "Healthcare Platform",
        description: "Custom-built website with a tailored CMS",
        mobileDescription: "Custom website with tailored CMS",
        url: "https://forpeople.com.ua/",
        image: forPeopleWork,
        width: 630,
        height: 380,
    },
    {
        id: "private-practice",
        title: "Private Practice",
        description: "Responsive website for a Ukrainian doctor",
        mobileDescription: "Responsive website for a doctor",
        url: "https://anastasiiaponomarenko.com/",
        image: privateDocWork,
        width: 630,
        height: 380,
    },
];
