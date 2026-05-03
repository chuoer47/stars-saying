# Architecture

[中文版](./ARCHITECTURE.md)

`stars-saying` is a Next.js App Router application with a child-facing frontend, server-side model APIs, official astronomy data adapters, and local-first learning memory.

## Runtime Shape

- Browser: renders the child-facing UI and stores learning progress, memory entries, wishes, and chat history in `localStorage`.
- Next.js server routes: call model providers and official astronomy APIs so secrets never ship to the browser.
- Local fallback data: keeps chat, library, classroom, wish card, and exploration flows usable when external APIs fail.

## Main User Flows

1. Home: `/`
2. Star selection: `/chat`
3. Static star chat: `/chat/[id]` -> `/api/chat`
4. Random exploration: `/explore` -> `/api/explore/random`
5. Explored body chat: `/api/explore/chat`
6. Memory library: `/memory`, `/memory/[id]/chat`
7. Knowledge and classroom: `/library`, `/knowledge/[id]`, `/classroom`
8. Wish card and wish wall: `/wish`, `/wish-wall`

Adult/internal pages live behind `/settings` and are not linked from the child flow.

## Important Modules

- `src/data/celestial-bodies.ts`: curated star roster and personas.
- `src/data/knowledge-cards.ts`: reviewed science facts and culture/science boundaries.
- `src/data/exploration-catalog.ts`: random exploration catalog.
- `src/lib/chat.ts`: grounded static-body chat logic, retrieval, and child safety.
- `src/lib/exploration-chat.ts`: random-body chat logic.
- `src/lib/exploration-generator.ts`: LLM/fallback summary and personality generation for random bodies.
- `src/lib/official-astronomy.ts`: server-side NASA/JPL/NASA Exoplanet Archive adapter.
- `src/lib/exploration-memory.ts`: `localStorage` persistence helpers.
- `src/lib/speech.ts`: interruptible browser speech playback.
- `src/lib/model-config.ts`: provider configuration from server environment variables.

## Data And Secrets

The browser must never receive raw provider keys. These values must stay in server environment variables:

- `KAFU_LLM_API_KEY`
- `OPENAI_API_KEY`
- `GPT_API_KEY`
- `NASA_API_KEY`
- `SETTINGS_PASSWORD`

The `/settings` UI only displays masked or status-level configuration.

## Design Tradeoffs

- Local-first child flow reduces account and privacy risk.
- Official data is adapted on the server for centralized timeout handling, failure handling, and fallback copy.
- The reviewed knowledge base is preferred over free-form model output to reduce hallucination risk in child-facing astronomy education.
- Adult configuration is isolated from the child navigation to avoid accidental access to internal pages.
