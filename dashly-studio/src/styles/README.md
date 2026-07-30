# Design System

The token layer is the contract for the whole redesign. **Components consume
tokens; they never hardcode values.**

## Rules

1. **No raw values in component CSS.** No hex colours, no `px` spacing, no
   `0.3s ease`, no bare `z-index: 9999`. If a value is worth using twice, it is
   worth a token.
2. **Use semantic colour tokens, not primitives.** `var(--color-text-primary)`,
   never `var(--c-ink-800)`. Primitives exist so the semantic layer can be
   retargeted in one place.
3. **Mobile-first.** Media queries are `min-width` only. Before writing one, ask
   whether `clamp()`, `minmax()` or `flex-wrap` solves it with no breakpoint.
4. **One CSS Module per component**, colocated: `Button.tsx` + `Button.module.css`.
5. **Never remove a focus indicator.** `:focus-visible` is styled globally in
   `base/reset.css`.

## Files

| File | Contains |
|---|---|
| `tokens/color.css` | Primitive palette + semantic colour roles |
| `tokens/typography.css` | Families, weights, fluid size scale, line heights, measure |
| `tokens/spacing.css` | 4px scale + fluid section rhythm |
| `tokens/layout.css` | Breakpoints, gutters, container widths |
| `tokens/radius.css` | Border radius scale |
| `tokens/shadow.css` | Elevation scale + focus ring |
| `tokens/motion.css` | Durations, easings, composed transitions, reduced-motion |
| `tokens/z-index.css` | Ordered stacking ladder |
| `base/reset.css` | Modern reset, base element styles |
| `base/utilities.css` | `.visually-hidden`, `.skip-link` |
| `index.css` | Redesign global entry point (**not yet wired in**) |

## Current wiring state

`src/index.css` (legacy) imports `styles/tokens/index.css`, so **tokens are live
now** and produce no visual change on their own.

`src/styles/index.css` — which also applies the reset and utilities — is **not**
imported by `main.jsx` yet, because applying the reset would restyle components
that have not been redesigned. Switch `main.jsx` over when the first redesigned
section lands, then delete the legacy rules from `src/index.css` section by
section.

## Two-source-of-truth warning

Breakpoint values exist in **both** `tokens/layout.css` and
`src/constants/breakpoints.ts`. CSS custom properties cannot be used inside
`@media` queries, and JS cannot read media queries out of CSS. Change one, change
the other.
