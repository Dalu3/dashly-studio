/**
 * Starts scroll-driven section work before it becomes visible, while keeping
 * distant homepage sections completely idle. One viewport plus a small safety
 * margin is enough to cover fast wheel/touch scrolling without prewarming the
 * whole page while the Hero is active.
 */
export const SECTION_PREWARM_ROOT_MARGIN = "125% 0px";

/**
 * Compositor-only decoration needs far less lead time than layout-driven
 * sections. A narrow margin keeps the next section's marquee idle while the
 * Hero fills the screen, but resumes it just before it crosses the edge.
 */
export const ANIMATION_PREWARM_ROOT_MARGIN = "10% 0px";
