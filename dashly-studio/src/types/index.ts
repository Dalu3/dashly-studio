/**
 * Shared types used across more than one feature.
 *
 * Types that belong to a single component live next to that component. Only
 * genuinely cross-cutting contracts go here.
 */

import type { ElementType, ReactNode } from "react";

/** Every styleable component accepts these. */
export interface BaseProps {
    className?: string;
    children?: ReactNode;
}

/**
 * Lets a component render as a different element while keeping semantics
 * correct — e.g. a <Section> that renders as <aside>, or a <Button> that
 * renders as <a>. This is how the design system stays accessible without
 * duplicating a component per tag.
 */
export interface PolymorphicProps<T extends ElementType = ElementType> {
    as?: T;
}

/** Design-system sizing scale, shared by Button, Input, Badge, etc. */
export type Size = "sm" | "md" | "lg";

/** Visual weight of an action. */
export type Variant = "primary" | "secondary" | "ghost";

/** Container width tokens, mirroring --container-* in layout.css. */
export type ContainerWidth = "narrow" | "default" | "wide" | "full";

/** Vertical rhythm tokens, mirroring --space-section-* in spacing.css. */
export type SectionSpacing = "sm" | "md" | "lg" | "none";
