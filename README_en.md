# Stars Saying / 假设星星会说话

[中文 README](./README.md)

Stars Saying is a mobile-first astronomy learning web app for children. Children can draw a random cosmic friend, chat with personified celestial bodies, read knowledge cards, study short astronomy lessons, and create local star-wish cards.

The current version focuses on the child-facing learning flow. Competition notes, model configuration, and internal pages are kept behind the password-protected `/settings` area and are not shown in the child navigation.

Live demo:

- Vercel: https://stars-saying.vercel.app

## Highlights

- Personified astronomy chat for the Sun, Moon, planets, stars, constellations, deep-sky objects, and exoplanets.
- API-backed random exploration using server-side NASA/JPL/NASA Exoplanet Archive adapters.
- Local memory library for explored celestial bodies.
- Child-friendly voice input, gentle speech playback, and interruptible audio.
- Horizontal drag interactions and collapsible content to reduce long scrolling on mobile.
- Local classroom progress for learned and unlearned lessons.
- Child safety boundaries for personal information, dangerous content, and unsuitable topics.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel AI SDK / OpenAI-compatible provider
- Local reviewed knowledge base first
- Server-side NASA/JPL official astronomy data adapters
- API-backed random celestial exploration
- Local-first exploration memory library

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

The app works without model keys by using local fallback content. Configure `.env` only when live model generation or a higher NASA API limit is needed.

## Commands

```bash
npm install
npm run dev
npm run build
```

`npm run lint` is still present in `package.json`, but the current Next.js 15 project primarily uses `npm run build` for type and production-build verification.

## Environment

Never commit `.env`. Keep only `.env.example` in the public repository.

Important variables:

- `KAFU_LLM_API_KEY`, `KAFU_LLM_BASE_URL`, `KAFU_CHAT_MODEL`: OpenAI-compatible KAFU model provider.
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`: OpenAI-compatible fallback provider.
- `GPT_API_KEY`, `GPT_BASE_URL`, `GPT_CHAT_MODEL`: compatibility names for model configuration.
- `NASA_API_KEY`: optional NASA API key; `DEMO_KEY` is used when omitted.
- `SETTINGS_PASSWORD`: password for `/settings` and adult/internal routes.

## Project Map

- `src/app`: routes, pages, loading states, and API routes
- `src/components`: child-facing interactive components
- `src/data`: celestial bodies, knowledge cards, and classroom content
- `src/lib`: grounded chat, retrieval, voice, and official astronomy API adapters
- `src/types`: shared domain types
- `docs`: deployment, architecture, mobile, safety, and release documentation
- `.codex`: continuation notes and task state
- `.codex/reference`: archived Ralph-era requirements and plans for audit/history only

## Key Routes

- `/`: child-facing entry
- `/explore`: random API-backed celestial exploration
- `/memory`: local memory library for explored bodies
- `/chat` and `/chat/[id]`: celestial selection and chat
- `/knowledge/[id]` and `/library`: knowledge cards and searchable star atlas
- `/classroom` and `/classroom/[id]`: short learning modules
- `/wish`: wish card generation
- `/wish-wall`: local-first wish wall
- `/settings`: password-protected adult configuration and project notes
- `/intro`, `/account`, `/dashboard`, `/studio`, `/lab`, `/exhibition`: protected adult/internal routes

## Child Safety

- No account is required for the child flow.
- Child input is not publicly published by default.
- Wishes, memory, and chat history stay in the current browser.
- The wish wall blocks dangerous content and common personal information patterns such as phone numbers, addresses, schools, emails, and social handles.
- Chat stays within astronomy learning, observation guidance, and gentle encouragement.

## Documentation

- [架构说明](./docs/ARCHITECTURE.md) / [Architecture](./docs/ARCHITECTURE_en.md)
- [部署说明](./docs/DEPLOYMENT.md) / [Deployment](./docs/DEPLOYMENT_en.md)
- [GitHub 发布检查清单](./docs/GITHUB_RELEASE_CHECKLIST.md) / [GitHub Release Checklist](./docs/GITHUB_RELEASE_CHECKLIST_en.md)
- [手机应用打包](./docs/MOBILE_APP.md) / [Mobile App Packaging](./docs/MOBILE_APP_en.md)
- [儿童安全与隐私](./docs/SAFETY.md) / [Child Safety And Privacy](./docs/SAFETY_en.md)

Vercel is the preferred deployment target because the app uses Next.js App Router and server routes. For mobile packaging, deploy the server-backed web app first, then wrap it with PWA/Capacitor while keeping model keys on the server.

## Continuation

After a context switch, read these files first:

1. `.codex/CHILD_APP_STRATEGY.md`
2. `.codex/TASKS.md`
3. `.codex/STATE.md`
4. `README.md`

`PRD.md` is historical. The current direction is documented in `.codex` and this README.
