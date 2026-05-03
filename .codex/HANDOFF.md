# Codex Handoff

This directory is the continuity anchor for future Codex sessions. Treat `/home/lingchen/stars-saying` as the active project root and ignore the old `awesome-stars/.ralph` automation setup unless explicitly asked to inspect history.

## First Read Order

1. `.codex/CHILD_APP_STRATEGY.md`
2. `.codex/TASKS.md`
3. `.codex/STATE.md`
4. `README.md`
5. `PRD.md` only for historical context

## Current Direction

The app is now a child-facing astronomy learning and play experience. Adult/internal routes may exist only behind the password-protected settings area and must stay out of child navigation.

Current core flow:

home -> choose star friend -> chat -> knowledge card -> classroom/library/wish card/wish wall

adult settings -> settings password -> intro/account/dashboard/studio/lab/exhibition

## Working Rules

- Keep visible copy child-friendly and direct.
- Keep all official astronomy API calls server-side.
- Use local reviewed knowledge as the fallback when NASA/JPL data is unavailable.
- Separate mythology/culture from science in user-facing explanations.
- Do not collect real names, phone numbers, addresses, schools, emails, or social handles.
- Avoid bringing back Ralph, Claude Code logs, `.next`, `node_modules`, or `.env` into source control.

## Suggested Loop

1. Pick the top unchecked item in `.codex/TASKS.md`.
2. Inspect the current implementation before changing code.
3. Make the smallest complete implementation slice.
4. Run `npm run lint` and `npm run build`.
5. Update `.codex/TASKS.md` and `.codex/STATE.md` in the same turn.
