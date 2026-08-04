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
 */

import cvWebWork from "@/assets/work/cv-wev-work.webp";
import forPeopleWork from "@/assets/work/Forpeople-work.webp";
import privateDocWork from "@/assets/work/private-doc-work.webp";

export interface Project {
    /** Stable identity for React's reconciliation. */
    id: string;
    title: string;
    description: string;
    /** External project URL opened from the complete card. */
    url?: string;
    /** Imported image module. Undefined renders the empty frame. */
    image?: string;
    /** Intrinsic pixel size of `image`. Prevents layout shift on load. */
    width?: number;
    height?: number;
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
        title: "For People",
        description: "Healthcare platform with a custom CMS",
        url: "https://forpeople.com.ua/",
        image: forPeopleWork,
        width: 630,
        height: 380,
    },
    {
        id: "private-practice",
        title: "Private Practice",
        description: "Responsive website for a Ukrainian doctor",
        url: "https://anastasiiaponomarenko.com/",
        image: privateDocWork,
        width: 630,
        height: 380,
    },
];
