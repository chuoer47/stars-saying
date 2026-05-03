# Child-Facing App Strategy

Date: 2026-05-02

## Product Direction

`stars-saying` is now a child-facing astronomy learning and play app. The app should feel like a safe night-sky playground for children. Adult/internal pages may exist for review and configuration, but only behind the password-protected settings area and never in the child navigation.

Primary audience:
- Children who want to talk with stars, learn simple astronomy facts, and make wish cards.
- Parents or teachers may open the app, but the visible experience should still speak directly to children.

## Keep

- `/`: child-first home screen.
- `/chat`: choose a star friend.
- `/chat/[id]`: child-safe astronomy chat.
- `/knowledge/[id]`: reviewed knowledge card.
- `/library`: searchable astronomy picture-book library.
- `/classroom`: short guided lessons.
- `/classroom/[id]`: lesson detail.
- `/wish`: generate a starry wish card.
- `/wish-wall`: local-first wall for safe wishes and card display.
- `/api/chat`: server-side chat route.
- `/api/search`: local search route.
- `/api/official-knowledge/[id]`: server-side official astronomy data route.

## Keep Hidden Behind Settings

Child-irrelevant routes must not appear in the child navigation. If they exist,
they must stay behind the password-protected settings area:
- Account and cloud sync.
- Supabase/content-management studio.
- Local analytics dashboard.
- Product lab / experiment hub.
- Exhibition/big-screen mode.
- Competition/project-introduction page.

Do not link to adult/developer/admin content from the app.

## Content Plan

Expand beyond the current solar-system and constellation roster:
- Add missing outer planets: Uranus and Neptune.
- Add small bodies: Halley's Comet and Ceres.
- Add deep-sky objects: the Milky Way, Andromeda Galaxy, and Orion Nebula.
- Add exoplanet content: TRAPPIST-1e.

Every added body needs:
- A child-friendly persona.
- Three suggested questions.
- A structured knowledge card.
- A science/culture boundary when relevant.
- Official or reputable source labels.

## Official Astronomy APIs

Use server-side integrations only. Children should see friendly summaries, images, and source labels, not raw scientific tables.

Preferred official sources:
- NASA Image and Video Library API for safe astronomy imagery.
- NASA APOD API for current astronomy image inspiration.
- JPL Horizons API for professional solar-system object data when an object has a Horizons identifier.
- NASA Exoplanet Archive TAP API for confirmed exoplanet facts when an object has an exoplanet name.

Implementation rules:
- `NASA_API_KEY` stays server-side; use `DEMO_KEY` only as a fallback.
- All external calls must have short timeouts and graceful local fallback.
- UI labels must say when official data is unavailable.
- Never let API failure block chat, knowledge cards, or wish cards.

## Child UI Direction

The visual language should be:
- Bright, soft, and readable.
- Wonder-filled without becoming visually noisy.
- Large tap targets and simple words.
- More picture-book than dashboard.

Avoid:
- Admin wording.
- Competition/judging wording.
- Dense technical architecture descriptions.
- Dark-only, serious, or corporate panels.

## Wish Card And Wish Wall

Keep and improve wish-card generation.

Add a child-safe wish wall:
- Local-first with browser storage.
- No account, no real public publishing, no personal details.
- Safe-word and personal-info filters before a wish can appear.
- Children can pin/share/display generated wishes locally.
- Provide gentle copy for blocked wishes and encourage safer rewriting.

## Safety Rules

- Keep astronomy and gentle encouragement as the allowed scope.
- Refuse or redirect dangerous, sexual, hateful, illegal, self-harm, or personal-data requests.
- Do not collect real names, addresses, phone numbers, schools, or contact information.
- Use short explanations and invite children to ask another space question.

## Verification

Before handoff:
- `npm run lint`
- `npm run build`
- Manual route sweep for `/`, `/chat`, `/library`, `/classroom`, `/wish`, `/wish-wall`.
- Confirm removed routes no longer appear in navigation.
- Confirm official API route returns fallback JSON when network/API data is unavailable.
