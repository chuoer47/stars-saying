# GitHub Release Checklist

[中文版](./GITHUB_RELEASE_CHECKLIST.md)

Use this checklist before pushing to a public GitHub repository.

## Repository State

- [ ] `.env` is ignored by `.gitignore`.
- [ ] `.env.example` contains placeholders only and no real secrets.
- [ ] `.next/`, `node_modules/`, logs, and local build artifacts are ignored.
- [ ] Claude/Ralph runtime logs are not included in the repository.
- [ ] `git status --ignored --short` confirms secret files are ignored.
- [ ] `git log --all -- .env` has no output, confirming `.env` was never committed.
- [ ] `git remote -v` points to the correct GitHub repository.

## Local Verification

- [ ] `npm run build`
- [ ] `/` loads.
- [ ] `/chat` loads and basic greetings are accepted.
- [ ] `/explore` can draw a celestial body.
- [ ] Random exploration card questions call `/api/explore/chat`.
- [ ] `/settings` requires a password.

## Before Deployment

- [ ] Set production environment variables in Vercel or the chosen host.
- [ ] Use a non-default `SETTINGS_PASSWORD`.
- [ ] Keep API/model keys server-side.
- [ ] Rotate any key that was ever committed or shared publicly.
- [ ] README and `docs/` are split into Chinese primary docs and `_en.md` English docs.

## Recommended GitHub Release Steps

```bash
git status --short --ignored
git log --all -- .env
npm run build
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

If using an HTTPS remote:

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```
