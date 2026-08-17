/**
 * Conditional className joiner.
 *
 * Deliberately hand-written rather than pulling in `clsx` — it is nine lines,
 * and the project rule is no unnecessary dependencies. Because styling uses CSS
 * Modules (not Tailwind), there are no conflicting utility classes to merge, so
 * `tailwind-merge`-style resolution is not needed either.
 *
 * @example cn(styles.button, isActive && styles.active)
 */
export type ClassValue = string | number | null | undefined | false;

export function cn(...classes: ClassValue[]): string {
    return classes.filter(Boolean).join(" ");
}
