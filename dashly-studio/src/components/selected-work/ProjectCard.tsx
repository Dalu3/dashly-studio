import { useRef } from "react";

import { cn } from "@/utils/cn";

import type { Project } from "./projects";
import styles from "./ProjectCard.module.css";
import { useCardTilt } from "./useCardTilt";

export interface ProjectCardProps {
    project: Project;
    /**
     * Loads the image immediately instead of lazily. Set on the cards that are
     * on screen at rest — lazy-loading something already visible only delays it.
     */
    priority?: boolean;
    className?: string;
}

/**
 * One project in the carousel: image frame, title, description.
 *
 * The frame reserves its space via `aspect-ratio`, so cards never resize as
 * images arrive — which matters here beyond the usual reflow annoyance, because
 * the carousel's snap positions are measured from card geometry.
 */
export function ProjectCard({
    project,
    priority = false,
    className,
}: ProjectCardProps) {
    const { title, description, image, width, height, imageAlt, url, mobileImage } = project;
    const cardRef = useRef<HTMLElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);

    useCardTilt(cardRef, frameRef);

    return (
        <article ref={cardRef} className={cn(styles.card, className)}>
            <a
                className={styles.link}
                href={url}
                target="_blank"
                rel="noreferrer"
            >
                <div ref={frameRef} className={styles.frame}>
                    {image ? (
                        <picture>
                            {mobileImage && (
                                /* Phone-only crop, not just a resized copy — see
                                   the field doc on Project.mobileImage. --bp-md
                                   (48rem/768px) is the site's mobile/tablet line
                                   (layout.css), so tablet gets the desktop image. */
                                <source
                                    media="(max-width: 47.999rem)"
                                    srcSet={mobileImage}
                                />
                            )}
                            <img
                                className={styles.image}
                                src={image}
                                alt={imageAlt ?? `${title} — ${description}`}
                                width={width}
                                height={height}
                                loading={priority ? "eager" : "lazy"}
                                decoding="async"
                                /* Native image dragging would steal the gesture from
                                   the carousel before the pointer handlers ever run. */
                                draggable={false}
                            />
                        </picture>
                    ) : (
                        <div className={styles.placeholder} aria-hidden="true" />
                    )}
                </div>

                <div className={styles.meta}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>
            </a>
        </article>
    );
}
