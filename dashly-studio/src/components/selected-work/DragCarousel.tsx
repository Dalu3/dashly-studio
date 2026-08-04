import { useRef, type ReactNode } from "react";

import { cn } from "@/utils/cn";

import { useDragCarousel } from "./useDragCarousel";
import styles from "./DragCarousel.module.css";

export interface DragCarouselProps {
    /** Each child becomes one slide and one snap position. */
    children: ReactNode;
    /** Announced to assistive technology; the region is keyboard operable. */
    label: string;
    className?: string;
}

/**
 * Horizontally draggable, inertial, snapping carousel.
 *
 * Presentation only — all the gesture and physics work lives in
 * `useDragCarousel`, which never touches React state, so dragging renders
 * nothing and the whole gesture stays on the compositor.
 *
 * Accessibility: dragging is not the only way through. The viewport is a
 * focusable region and arrow / Home / End keys move between the same snap
 * points the gestures use.
 */
export function DragCarousel({ children, label, className }: DragCarouselProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useDragCarousel(viewportRef, trackRef, {
        draggingClassName: styles.isDragging ?? "",
    });

    return (
        <div
            ref={viewportRef}
            className={cn(styles.viewport, className)}
            role="region"
            aria-label={label}
            tabIndex={0}
        >
            <div ref={trackRef} className={styles.track}>
                {children}
            </div>
        </div>
    );
}
