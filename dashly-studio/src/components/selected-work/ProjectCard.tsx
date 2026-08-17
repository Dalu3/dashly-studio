import { useId, useRef } from "react";
import { createPortal } from "react-dom";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";

import type { Project } from "./projects";
import styles from "./ProjectCard.module.css";
import { useCardTilt } from "./useCardTilt";
import { useProjectCardCursor } from "./useProjectCardCursor";

const CURSOR_WORD_OFFSETS = ["0%", "33.333%", "66.667%"] as const;

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
    const {
        title,
        description,
        mobileDescription,
        image,
        width,
        height,
        imageAlt,
        url,
        mobileImage,
    } = project;
    const cardRef = useRef<HTMLElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const cursorPathId = `project-card-cursor-${useId().replace(/:/g, "")}`;
    const hasFineDesktopPointer = useMediaQuery(
        "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
    );
    const prefersReducedMotion = usePrefersReducedMotion();
    const isCursorEnabled = hasFineDesktopPointer && !prefersReducedMotion;

    useCardTilt(cardRef, frameRef);
    useProjectCardCursor(cardRef, cursorRef, isCursorEnabled);

    const cursor = isCursorEnabled
        ? createPortal(
              <span
                  ref={cursorRef}
                  className={styles.cursor}
                  data-active="false"
                  aria-hidden="true"
              >
                  <svg viewBox="0 0 100 100" focusable="false">
                      <circle className={styles.cursorCircle} cx="50" cy="50" r="50" />
                      <g className={styles.cursorSpinner}>
                          <defs>
                              <path
                                  id={cursorPathId}
                                  d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                              />
                          </defs>
                          {CURSOR_WORD_OFFSETS.map((startOffset) => (
                              <text key={startOffset} className={styles.cursorText}>
                                  <textPath
                                      href={`#${cursorPathId}`}
                                      startOffset={startOffset}
                                  >
                                      DISCOVER <tspan className={styles.cursorSeparator}>·</tspan>
                                  </textPath>
                              </text>
                          ))}
                      </g>
                  </svg>
              </span>,
              document.body,
          )
        : null;

    return (
        <article
            ref={cardRef}
            className={cn(styles.card, isCursorEnabled && styles.cursorEnabled, className)}
        >
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
                    <p className={styles.description}>
                        <span
                            className={cn(
                                styles.desktopDescription,
                                mobileDescription && styles.hasMobileDescription,
                            )}
                        >
                            {description}
                        </span>
                        {mobileDescription && (
                            <span className={styles.mobileDescription}>
                                {mobileDescription}
                            </span>
                        )}
                    </p>
                </div>
            </a>
            {cursor}
        </article>
    );
}
