# Architecture

`stars-saying` is a Next.js App Router application with a server-backed AI and astronomy data layer.

## Runtime Shape

- Browser: renders the child-facing UI, stores local progress, memory entries, wishes, and chat history in `localStorage`.
- Next.js server routes: call model providers and official astronomy APIs so secrets never ship to the browser.
- Local fallback data: keeps chat, library, classroom, wish card, and exploration flows usable when external APIs fail.

## Main User Flows

1. Home (`/`)
2. Star selection (`/chat`)
3. Static star chat (`/chat/[id]` -> `/api/chat`)
4. Random exploration (`/explore` -> `/api/explore/random`)
5. Explored body chat (`/api/explore/chat`)
6. Memory library (`/memory`, `/memory/[id]/chat`)
7. Knowledge and classroom (`/library`, `/knowledge/[id]`, `/classroom`)
8. Wish card and wish wall (`/wish`, `/wish-wall`)

Adult/internal pages live behind `/settings` and are not linked from the child flow.

## Important Modules

- `src/data/celestial-bodies.ts`: curated star roster and personas.
- `src/data/knowledge-cards.ts`: reviewed science facts and culture/science boundaries.
- `src/data/exploration-catalog.ts`: expanded random exploration catalog.
- `src/lib/chat.ts`: grounded static-body chat logic and child safety.
- `src/lib/exploration-chat.ts`: random-body chat logic.
- `src/lib/exploration-generator.ts`: LLM/fallback personality generation for random bodies.
- `src/lib/official-astronomy.ts`: server-side NASA/JPL/NASA Exoplanet Archive adapter.
- `src/lib/exploration-memory.ts`: localStorage persistence helpers.
- `src/lib/speech.ts`: interruptible browser speech playback.
- `src/lib/model-config.ts`: provider configuration from server environment variables.

## Data And Secrets

The browser never receives raw provider keys. These values must stay in server environment variables:

- `KAFU_LLM_API_KEY`
- `OPENAI_API_KEY`
- `GPT_API_KEY`
- `NASA_API_KEY`
- `SETTINGS_PASSWORD`

The settings UI only displays masked or status-level configuration.

