/// <reference types="vite/client" />

/**
 * CSS Modules.
 *
 * Vite handles `*.module.css` natively at build time; this declaration is what
 * makes TypeScript understand the import. `Record<string, string>` is
 * intentional — generating exact per-file class name types would need an extra
 * build tool, which the no-unnecessary-dependencies rule rules out.
 */
declare module "*.module.css" {
    const classes: Record<string, string>;
    export default classes;
}

/**
 * Raw shader source. Vite handles the `?raw` suffix natively (any file, no
 * plugin needed) — this declaration is what makes TypeScript understand the
 * resulting import is a plain string.
 */
declare module "*.glsl?raw" {
    const source: string;
    export default source;
}
declare module "*.vert?raw" {
    const source: string;
    export default source;
}
declare module "*.frag?raw" {
    const source: string;
    export default source;
}
