# Dashly Studio — typography rule

The laptop/desktop type scale (`--bp-lg`, 64rem / 1024px and up) is fixed to
exactly six sizes, defined in [`src/styles/tokens/typography.css`](src/styles/tokens/typography.css):

| Role                  | Token                | Value |
| ---------------------- | --------------------- | ----- |
| H1                     | `--font-size-h1`      | 60px  |
| H2                     | `--font-size-h2`      | 35px  |
| H3                     | `--font-size-h3`      | 20px  |
| Paragraph              | `--font-size-p`       | 18px  |
| Body / UI text         | `--font-size-body`    | 16px  |
| Form controls & links  | `--font-size-small`   | 14px  |

**No hardcoded `font-size` at `--bp-lg` and up.** Every heading, paragraph,
body and form/link size at 1024px+ must resolve to one of these six
`var(--font-size-*)` tokens — no bare `px`/`rem` value, and no new
component-local size token (`--pkg-title-size-*`, `--footer-*`, etc.) for
that range. Below `--bp-lg`, the existing per-component fluid `clamp()` /
legacy per-breakpoint scale is unaffected by this rule.

**Adding a new desktop size requires the user's explicit approval first.**
If a design genuinely needs a seventh size, ask before adding it — don't
introduce it silently, even as a "temporary" or component-scoped variable.

**Approved exception:** `Stages.module.css` `.copy p` (the process-section
stage description) is deliberately left on the fluid `--process-body-size`
past `--bp-lg` instead of pinning it to `--font-size-p`/`--font-size-body`.
Both of those wrap the text to more lines than the original fluid value at
1024–1440px, and the extra height runs past the stage image's bottom edge —
verified against real geometry, documented in-file. Fixing this for real
means widening the vertical gap in `process.css` (a layout change), not
picking a different type-scale token.
