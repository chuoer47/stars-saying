# GitHub Release Checklist

Use this before pushing to a public repository.

## Source Control

- [ ] `.env` is ignored.
- [ ] `.env.example` contains only placeholders.
- [ ] `.next/`, `node_modules/`, logs, and local build artifacts are ignored.
- [ ] No Claude/Ralph runtime logs are included.
- [ ] `git status --ignored --short` confirms secrets are ignored.

## Verification

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `/` loads.
- [ ] `/chat` loads and basic greetings are accepted.
- [ ] `/explore` can draw a star.
- [ ] random exploration questions call `/api/explore/chat`.
- [ ] `/settings` requires a password.

## Deployment

- [ ] Set production environment variables in Vercel or the chosen host.
- [ ] Use a non-default `SETTINGS_PASSWORD`.
- [ ] Keep API/model keys server-side.
- [ ] Rotate any key that was ever committed or shared publicly.

