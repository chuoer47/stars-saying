# Current State

## Handoff Date

2026-05-02

## Source

This project was extracted from `/home/lingchen/awesome-stars` into `/home/lingchen/stars-saying`.

Excluded from the clean project copy:

- `.git`
- `.claude`
- `.ralph`
- `.ralphrc`
- `.next`
- `node_modules`
- `tsconfig.tsbuildinfo`

Preserved reference files:

- `.codex/reference/ralph-fix-plan.md`
- `.codex/reference/requirements.md`
- `.codex/reference/ralph-agent.md`

## Product Direction

The app is now a pure child-facing astronomy learning app. The current source of truth is:

1. `.codex/CHILD_APP_STRATEGY.md`
2. `.codex/TASKS.md`
3. `.codex/STATE.md`
4. `README.md`

`PRD.md` is historical and has a top note pointing back to `.codex`.

## Implemented Routes

- `/`
- `/explore`
- `/memory`
- `/chat`
- `/chat/[id]`
- `/knowledge/[id]`
- `/library`
- `/classroom`
- `/classroom/[id]`
- `/wish`
- `/wish-wall`
- `/api/chat`
- `/api/explore/random`
- `/api/search`
- `/api/official-knowledge/[id]`

Removed routes now return 404:

- `/account`
- `/dashboard`
- `/studio`
- `/lab`
- `/exhibition`
- `/intro`

## Important Files

- `src/data/celestial-bodies.ts`: child-facing celestial roster, now including outer planets, small bodies, deep-sky objects, and TRAPPIST-1e.
- `src/data/knowledge-cards.ts`: reviewed astronomy knowledge cards for every roster item.
- `src/data/classroom-modules.ts`: short child learning modules.
- `src/lib/chat.ts`: grounded chat and child-safety rules.
- `src/lib/retrieval.ts`: local search/retrieval.
- `src/lib/official-astronomy.ts`: server-side NASA/JPL/NASA Exoplanet Archive adapter with timeout fallback.
- `src/lib/exploration-generator.ts`: LLM-backed child summary/personality generator with deterministic fallback.
- `src/lib/exploration-memory.ts`: browser localStorage memory helpers for explored bodies.
- `src/components/official-knowledge-panel.tsx`: child-friendly official imagery/fact panel.
- `src/components/explore-experience.tsx`: random star exploration UI.
- `src/components/memory-experience.tsx`: local star memory library with voice playback and quick questions.
- `src/components/classroom-module-list.tsx`: classroom learned/unlearned local progress UI.
- `src/components/star-wish-experience.tsx`: wish-card generation with personal-info blocking.
- `src/components/wish-wall-experience.tsx`: local-first wish wall.

## Official API Behavior

Server-side route:

- `/api/official-knowledge/[id]`

Official sources:

- NASA Image and Video Library API
- NASA APOD API
- JPL Horizons API
- NASA Exoplanet Archive TAP API

Behavior:

- `NASA_API_KEY` stays server-side; `DEMO_KEY` is the fallback.
- External calls have timeouts and local fallback.
- Children see friendly facts/images, not raw API tables.
- Verified `trappist-1e` returns live NASA Exoplanet Archive facts.
- Verified `mars` returns live NASA imagery and local-reviewed fallback facts when JPL is slow.

## Phase 2 Implementation

Implemented API-backed star exploration loop:

- `/explore`: random draw a celestial object from an expanded API-backed catalog.
- `/api/explore/random`: server-side official data fetch plus child-friendly summary/personality generation.
- `/memory`: local-first memory library for explored bodies.
- Voice playback should support children with limited reading ability through browser speech synthesis.
- Long content should move toward collapsible or horizontal sections instead of one long stack.
- `/classroom` shows learned/unlearned local progress and supports filtering.

## 2026-05-03 Requirement Recheck

The user clarified that development should continue in `/home/lingchen/stars-saying`
and should be judged against the latest merged child astronomy APP requirements.
Ralph supervision and `awesome-stars` fix-plan work are no longer part of the task.

Current gap list after inspecting source:

- The API-backed exploration module is present and broadly aligned with the
  requested formal astronomy API plus random draw flow.
- The LLM/fallback generator is present and writes child-facing science summary,
  personality, tone, greeting, voice line, and suggested questions.
- The app memory library persists explored bodies locally, but communication is
  still too limited because memory entries only expose preset question buttons.
- Long content has some horizontal sections and `<details>`, but knowledge cards
  and classroom detail pages still stack many panels vertically.
- Classroom learning records exist, but detail pages only mark completed and do
  not allow the child to switch a lesson back to unlearned.

Current implementation target:

1. Add free-form and voice-assisted Q&A to the memory library.
2. Convert knowledge and classroom detail content into stronger swipe/collapse
   interactions.
3. Make classroom progress reversible so learned/unlearned state can be managed
   from the lesson page.

## 2026-05-03 Implementation Update

Completed against the rechecked requirements:

- `src/components/memory-experience.tsx` now supports free-form questions for
  saved exploration-memory bodies, browser speech recognition when available,
  and speech-synthesis playback for answers and greetings.
- `src/app/knowledge/[id]/page.tsx` now groups facts, features, misconceptions,
  and culture/science boundaries into horizontal swipe cards, with recommended
  questions and sources behind collapsible sections.
- `src/app/classroom/[id]/page.tsx` now presents lesson content as swipe cards
  and keeps related bodies collapsed.
- `src/components/learning-progress-button.tsx` now supports switching a lesson
  between learned and unlearned instead of one-way completion only.

Verification on 2026-05-03:

```bash
npm run lint
npm run build
```

Both passed. `next lint` prints its standard Next.js 15 deprecation notice but
reports no ESLint warnings or errors.

## 2026-05-03 Chat Follow-Up

User found that bodies drawn from `/explore` could be reviewed in `/memory` but
did not appear in the main star chat flow. Root cause: `/chat` and `/api/chat`
use the static `celestialBodies` roster, while random exploration entries live
only in browser localStorage and are not visible to the server route.

Implemented fix:

- `src/components/celestial-selection.tsx` now reads local exploration memory
  and shows a "you drew these stars" horizontal rail inside `/chat`.
- Each memory entry links to `/memory/[id]/chat`.
- `src/app/memory/[id]/chat/page.tsx` and
  `src/components/memory-chat-experience.tsx` provide local memory-based chat,
  suggested questions, voice input, and speech playback for explored bodies.
- `src/lib/exploration-memory.ts` now refuses personal-data and unsafe memory
  chat inputs before generating local answers.
- Static `/chat` roster cards are grouped into horizontal swipe rails with
  collapsed question/personality details, reducing long vertical scrolling.

## 2026-05-03 Settings And Voice Plan

New user request:

- Voice playback should be interruptible.
- Voice should feel softer and more like a gentle female voice.
- Read model-related configuration from `stars-saying/.env`.
- Add a password-protected settings area containing prior competition
  explanation, key/model configuration status, and adult/internal routes:
  `/account`, `/dashboard`, `/studio`, `/lab`, `/exhibition`, `/intro`.

Implementation direction:

1. Add a shared client speech helper that cancels current playback before
   starting a new utterance, chooses a Chinese female voice when the browser
   provides one, and uses slower/warmer speech parameters.
2. Replace all component-local speech helpers with this shared helper.
3. Add `SETTINGS_PASSWORD` as the server-side password variable. The app can
   show whether KAFU/OpenAI keys are configured, but must not print raw secrets.
4. Keep these routes outside the child home navigation. They are available only
   after password verification.

## 2026-05-03 Settings And Voice Implementation

Completed the requested settings and voice follow-up:

- `src/lib/speech.ts` now centralizes browser speech playback. It cancels
  current speech before starting another utterance, chooses a Chinese
  female-like voice when available, and uses slower/warmer speech parameters.
- `src/lib/use-gentle-speech.ts` gives client components shared play/stop state
  so buttons can visibly switch between play and stop.
- Chat, exploration, memory, and memory-chat flows now use the shared speech
  helper. Main chat already had stop control; exploration and memory flows now
  also expose explicit stop states.
- `src/lib/model-config.ts` reads KAFU model configuration from `.env` first,
  then OpenAI/GPT-compatible fallback variables, then local fallback.
- `.env` has `SETTINGS_PASSWORD=stars2026` for the adult settings area.
- `/settings` is password protected and shows competition explanation plus
  model/key status without revealing raw secrets.
- `/account`, `/dashboard`, `/studio`, `/lab`, `/exhibition`, and `/intro` are
  restored as adult/internal routes protected by the same settings cookie.
- `src/data/internal-pages.ts`, `src/lib/settings-auth.ts`, and
  `src/components/internal-page-shell.tsx` hold shared internal route content
  and access checks.

Verification on 2026-05-03:

```bash
npm run lint
npm run build
```

Both passed. The production route table includes `/settings` and all six
protected internal routes as dynamic server-rendered pages.

## Verification

Verified on 2026-05-02 from `/home/lingchen/stars-saying`:

```bash
npm run lint
npm run build
```

Results:

- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed.
- Dev server started on `http://localhost:3002`.
- Route checks: `/`, `/library`, `/wish-wall` returned 200.
- Removed route checks: `/dashboard`, `/intro`, `/account` returned 404.
- Official API checks: `/api/official-knowledge/mars` and `/api/official-knowledge/trappist-1e` returned 200.

Additional Phase 2 verification on 2026-05-02:

- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed.
- Existing dev server at `http://localhost:3001` serves `/explore`.
- `/api/explore/random` returned 200 with a live official-data-backed random object.
- Current local environment has no `OPENAI_API_KEY`, so exploration personality generation used `local-fallback`; with the key configured, `src/lib/exploration-generator.ts` will call the configured OpenAI model.

Known environment note:

- Local Node was previously `v18.20.3`; Next builds, but deployment should prefer Node 20+.
