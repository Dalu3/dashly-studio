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

## Conventions

Before writing or refactoring UI, read [`dashly-studio/AGENTS.md`](dashly-studio/AGENTS.md) and
[`dashly-studio/DEVELOPMENT.md`](dashly-studio/DEVELOPMENT.md) — typography governance there is
locked and may not be changed without explicit, task-specific approval.
