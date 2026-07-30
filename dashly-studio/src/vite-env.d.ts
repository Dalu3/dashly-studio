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
