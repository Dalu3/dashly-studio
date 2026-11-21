# Dashly Studio

## Git & deploy rules (strict)
- NEVER run `git commit`, `git push`, `git merge`, `git rebase`, `git reset --hard`, `git tag` or any deploy command unless I explicitly ask for it in my current message, using words like "commit", "push" or "deploy".
- Approval is per action: "commit" does not mean "push". Permission given earlier in a session does not carry over to later changes.
- Deploying = pushing to main (the site is served from /docs on main). Treat any push to main as a deploy.
- Running `npm run build` locally is fine for testing, but never commit the rebuilt /docs output unless I ask.
- When work is finished: stop, summarise what changed, list the files, and tell me the exact commands you WOULD run. Then wait.
- Never use --no-verify, --force or --force-with-lease.

## Repository layout

- `/docs` (repo root) — **the production site**. GitHub Pages serves `main` → `/docs`. It is intentionally tracked in git.
- `/dashly-studio` — the Vite + React 18 application source (`src/`, `public/`, `index.html`, `scripts/`).

## Build commands

Run these from `dashly-studio/`:

- `npm run dev` — local dev server.
- `npm run build:preview` — builds to `dist/` only and leaves `/docs` untouched (`DASHLY_SKIP_DOCS_SYNC=1`). **Use this for local verification.**
- `npm run build` — builds **and overwrites `/docs`**, i.e. it stages a production deploy. Only run when a deploy is explicitly requested.
- `npm run typecheck`, `npm run lint` — must both pass before handing work back.

## Future performance work

### Option 3 — styled prerendered hero fallback for LCP (not implemented)

Status: **deferred, future work.** Do not start it without asking.

Today the first paint is handled by two separate things:

- `scripts/postbuild.mjs` prerenders semantic, essentially unstyled markup
  into `#static-page-content` (including `<h1 id="hero-title">`). It exists for
  no-JS visitors and crawlers. `src/main.jsx` hides it the moment the module
  runs and removes it after React commits.
- `index.html` paints `#initial-hero-poster`, a fixed-position `<img>` of the
  hero's own poster, over the whole viewport until React's first commit.

So the element Lighthouse measures as LCP is that poster image, and the
prerendered `<h1>` is deliberately never shown.

Option 3 would instead give the prerendered hero its real styling — the hero
typography, colours and layout inlined as critical CSS in the document head —
so the server-sent `<h1>` is itself the LCP element, painted on the first
frame with no overlay and no wait for the React bundle. The poster would stay
as the background rather than as the thing being measured.

Why it is worth doing: it moves LCP off a ~29 KB image decode and onto text
that is already in the HTML, and it removes the hand-off flash entirely.

Why it is not done yet: it means duplicating locked hero typography into
critical CSS, which `dashly-studio/AGENTS.md` and
`dashly-studio/DEVELOPMENT.md` govern, and keeping the duplicate in sync with
the hero tokens. It also needs care so the prerendered hero and the React hero
agree pixel-for-pixel, or the swap becomes a visible reflow — a worse outcome
than the current poster.

## Conventions

Before writing or refactoring UI, read [`dashly-studio/AGENTS.md`](dashly-studio/AGENTS.md) and
[`dashly-studio/DEVELOPMENT.md`](dashly-studio/DEVELOPMENT.md) — typography governance there is
locked and may not be changed without explicit, task-specific approval.
