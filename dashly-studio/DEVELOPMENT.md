# Dashly Studio development rules

## Typography governance

Typography has one source of truth:
[`src/styles/tokens/typography.css`](src/styles/tokens/typography.css). The
architecture documented here is locked unless the user explicitly approves a
typography change.

### Approved global semantic roles

| Role | Purpose | Responsive behavior |
| --- | --- | --- |
| `--type-display-primary` | Primary Hero display heading | Fluid, 375px–1440px: 30px → 64px. The 64px desktop maximum remains provisional until the canonical Hero design is selected. |
| `--type-display-marquee` | Decorative marquee/ticker display text | Fluid: 35px at 375px → 64px at 1440px. |
| `--type-section-title` | Primary title shared by major landing-page sections | Fluid: 32px at 375px → 64px at 1440px. |
| `--type-lead` | Prominent introductory copy below a display or section title | Fluid: 16px at 375px → 24px at 1440px. |
| `--type-body` | Standard explanatory and descriptive copy | Fluid: 16px at 375px → 20px at 1440px. |
| `--type-metadata` | Micro metadata such as Hero location, availability and scroll prompt | Fluid: 10px at 375px → 15px at 1440px. |
| `--type-control` | Form labels, inputs, selects, textareas and submit controls | Fixed at 16px; no `clamp()`. |

For fluid roles, 375px is the exact minimum and 1440px is the exact maximum.
The middle value is a mathematically derived linear interpolation between the
approved endpoints. Do not hand-tune the `vw` term.

A semantic role defines font size. Components may select an already-approved
weight, line height, letter spacing, case and other presentation properties.
Differences in those properties do not justify section-specific font-size
tokens.

### Approved component-specific typography

The following typography belongs to a controlled component composition and is
not part of the global semantic scale:

- Header navigation and brand lockup.
- Footer utility headings, links, metadata, tagline variant and wordmark.
- Process step titles, decorative stage numbers and other approved Process
  composition typography.
- Packages prominent card titles and estimate CTA while their global role is
  unconfirmed.

Do not create, rename or change a component-specific typography style or token
without explicit approval. Branding typography must not be folded into the
generic semantic hierarchy.

### Provisional and deprecated tokens

- `--type-display` is a deprecated compatibility alias for
  `--type-display-primary`.
- `--type-label` and `--type-h2` are deprecated. Do not use them in new code.
- `--type-small`, `--type-h3` and `--type-number` remain provisional. Reuse is
  allowed only for their already-approved current mappings; do not expand their
  meaning or change their values.
- Legacy `--font-size-*` and component tokens remain only for sections that
  have not completed controlled migration. Their presence is not permission to
  reuse them in new components.

Deprecated or legacy tokens may be removed only after a scoped migration proves
that active usage is zero and the user approves removal.

### Mandatory rules

1. Never hardcode `font-size` in component CSS or SCSS. This includes raw `px`,
   `rem`, `vw`, local `clamp()` values and a `font` shorthand that supplies its
   own size.
2. Never create a typography token without explicit approval. This includes
   global, section-specific, component-specific and device-specific tokens.
3. Never modify an existing typography token without a separate approved
   design-system decision and impact analysis.
4. Never silently remap an element from one semantic role to another.
5. Never add a local or breakpoint-specific font-size override as a visual fix.
6. Do not create separate mobile, tablet and desktop typography systems.
   Responsive behavior belongs to the semantic token when that role is fluid.
7. A breakpoint font-size override requires explicit Figma evidence of
   non-linear behavior, documented justification and user approval.
8. Do not change typography architecture during unrelated spacing, layout,
   animation, color, accessibility, performance or refactoring work.
9. Reuse the approved global role or approved component style before proposing
   anything new.

### Required mismatch workflow

When typography does not match Figma or looks wrong at a viewport:

1. Do not fix it silently.
2. Identify whether the cause is the semantic role, global token,
   component-specific approved style, mapping, layout, or a Figma version
   conflict.
3. Check the existing semantic tokens, approved component styles and canonical
   Figma design.
4. Report the component and element, current role, problem, Figma evidence,
   recommended role or token action, and affected viewports.
5. Wait for explicit approval.
6. Only then modify the typography system or mapping.

If the existing system cannot reproduce a design, do not work around it. A new
role or exception must be proposed and approved before implementation.

### Required audit after UI migrations

After every significant UI migration, inspect all modified files for:

- hardcoded `font-size` values;
- local `clamp()` font sizes;
- newly introduced typography custom properties;
- media-query font-size overrides;
- `font` shorthand declarations containing a size;
- silent semantic-role changes.

A migration is not complete until this audit and the appropriate build,
typecheck and responsive verification pass.

## Design-system rules

- Components consume centralized design tokens rather than introducing random
  visual values.
- Use semantic color tokens rather than palette primitives.
- Prefer mobile-first layout and reusable component styles.
- Never remove a visible focus indicator.
- Breakpoint values exist in both `src/styles/tokens/layout.css` and
  `src/constants/breakpoints.ts`; update both when an explicitly approved
  breakpoint change is made.
