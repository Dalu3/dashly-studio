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

## Strict typography development rules

The semantic fluid typography system is the only source for production
typography. The current semantic roles are defined in
[`src/styles/tokens/typography.css`](src/styles/tokens/typography.css):
`--type-label`, `--type-small`, `--type-body`, `--type-h3`, `--type-h2`,
`--type-display`, and `--type-number`.

- Do not hardcode `font-size`, `font-family`, `font-weight`, `line-height`, or
  `letter-spacing` inside components.
- All production typography must use the centralized typography tokens.
- Do not create new typography tokens without explicit user approval.
- Do not create component-specific font-size tokens when an existing semantic
  token can represent the role.
- Do not override font sizes in media queries unless explicitly approved.
  Typography must scale through the existing fluid `clamp()` tokens; media
  queries should primarily control layout.
- Do not use arbitrary `px`, `rem`, `vw`, or `clamp()` font sizes directly in
  component CSS.
- Before adding any typography value, check the existing token system first.
- Migrate legacy hardcoded values gradually; do not copy them into new
  components.
- Exceptions are allowed only for clearly documented technical or debug UI.

Do not change, rename, delete, or add values to the existing typography tokens
as part of documentation-only work. When migrating a section, work on one
section at a time, compare computed typography at 375, 425, 768, 1024, and
1440px, and verify that sizes do not shrink or jump across breakpoints before
moving to the next section.
