# Agent instructions

Before writing or refactoring UI, read and follow
[`DEVELOPMENT.md`](DEVELOPMENT.md), especially its locked typography governance.

Typography architecture may not be changed without the user's explicit,
task-specific approval. In particular:

- use only existing approved semantic or component-specific typography;
- do not hardcode font sizes or use size-bearing `font` shorthand;
- do not add or modify typography tokens;
- do not add breakpoint or local font-size fixes;
- do not silently change an element's semantic role;
- keep typography work out of unrelated tasks;
- report design-system or Figma conflicts and wait for approval.

After significant UI work, run the typography hardcode audit described in
`DEVELOPMENT.md` on every modified file.
