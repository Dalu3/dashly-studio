import { cn } from "@/utils/cn";

import { DragCarousel } from "./DragCarousel";
import { Marquee } from "./Marquee";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS, type Project } from "./projects";
import styles from "./SelectedWork.module.css";

export interface SelectedWorkProps {
    /** Defaults to the shared project list in `projects.ts`. */
    projects?: Project[];
    className?: string;
}

/** Cards on screen at rest on a desktop viewport — see ProjectCard's
 *  `priority`. Anything past this loads lazily as it is dragged in. */
// The Hero occupies the first viewport, so even the first Selected Work cards
// are below the fold at initial load. Let the browser fetch them near their
// actual reveal instead of making the first paint pay for ~800KB of PNGs.
const EAGER_CARDS = 0;

/**
 * "Selected work" — a looping headline ticker over a draggable project
 * carousel.
 *
 * Assembly only. The two moving parts are generic and reusable on purpose:
 * <Marquee> takes any content, <DragCarousel> takes any children. This section
 * supplies the copy, the data and the component tokens that give both their
 * proportions.
 */
export function SelectedWork({ projects = PROJECTS, className }: SelectedWorkProps) {
    return (
        <section
            id="work"
            className={cn(styles.root, className)}
            aria-labelledby="selected-work-heading"
        >
            <h2 id="selected-work-heading" className={styles.srOnly}>
                Selected work
            </h2>

            <Marquee className={styles.ticker} speed={80}>
                <span className={styles.tickerText}>Selected work.</span>
            </Marquee>

            <DragCarousel className={styles.carousel} label="Selected work">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        priority={index < EAGER_CARDS}
                    />
                ))}
            </DragCarousel>
        </section>
    );
}
