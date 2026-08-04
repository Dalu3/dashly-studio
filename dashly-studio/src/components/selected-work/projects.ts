/**
 * Selected work — the carousel's content.
 *
 * PLACEHOLDER CONTENT. Titles and descriptions are the ones legible in the
 * design reference; the rest are stand-ins. Every card renders its empty image
 * frame until a preview is supplied, so the section is complete and correct
 * before the artwork exists.
 *
 * To wire up a real project: drop the export into `src/assets/work/`, import it
 * at the top of this file (Vite fingerprints and optimises imported assets —
 * do NOT hardcode a `/src/...` string path), and set `image` plus the intrinsic
 * `width`/`height` of that file. The dimensions are what reserve the card's
 * space before the bytes arrive, so there is no reflow as images load.
 */

import cvWebWork from "@/assets/work/cv-wev-work.png";
import forPeopleWork from "@/assets/work/Forpeople-work.png";
import privateDocWork from "@/assets/work/private-doc-work.png";

export interface Project {
    /** Stable identity for React's reconciliation. */
    id: string;
    title: string;
    description: string;
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
        image: cvWebWork,
        width: 630,
        height: 380,
    },
    {
        id: "for-people",
        title: "For People",
        description: "Healthcare platform with a custom CMS",
        image: forPeopleWork,
        width: 630,
        height: 380,
    },
    {
        id: "private-practice",
        title: "Private Practice",
        description: "Responsive website for a Ukrainian doctor",
        image: privateDocWork,
        width: 630,
        height: 380,
    },
    {
        id: "project-four",
        title: "Project Four",
        description: "Brand & Web Design",
    },
    {
        id: "project-five",
        title: "Project Five",
        description: "Web Development",
    },
];
