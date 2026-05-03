# Codex Task Plan

Source of truth after 2026-05-02 child-facing pivot.

## 2026-05-03 User Requirement Recheck

The current target is `/home/lingchen/stars-saying`, not `awesome-stars`.
Do not supervise Ralph/Claude Code for this work. Codex should directly develop
the app against the latest user-provided child astronomy APP requirements.

Latest merged requirements:
- API-backed expanded celestial exploration with random draw.
- LLM-generated child-facing summary and personality from official astronomy data.
- Save explored science info and personality into the app memory library.
- Voice-first playback and interaction for children with limited reading ability.
- Replace long stacked pages with collapsible or swipe-friendly interactions.
- Maintain immersive starry visual language across pages.
- Add local classroom learning records that distinguish learned and unlearned modules.

Recheck result:
- [x] Expanded `/explore` route exists and calls official astronomy sources server-side.
- [x] Random draw exists through `/api/explore/random`.
- [x] LLM personality generation exists with deterministic fallback.
- [x] Explored bodies are saved into local memory.
- [x] Memory-library communication needs free-form child questions plus voice input, not only preset question buttons.
- [x] Knowledge card and classroom detail pages still need stronger collapsible/swipe-style interaction to reduce long scrolling.
- [x] Classroom progress should allow changing a lesson back to unlearned, not only one-way completion.
- [x] 2026-05-03 follow-up: explored/random-draw bodies appear in the star chat area through local memory entries.
- [x] 2026-05-03 follow-up: explored/random-draw bodies have a dedicated memory chat route.
- [x] 2026-05-03 follow-up: the star chat selection screen is grouped into swipe cards instead of one long list.

## 2026-05-03 Settings And Voice Follow-Up

Plan:
- [x] Add one shared speech helper so playback can be interrupted everywhere.
- [x] Prefer a softer Chinese female browser voice, with slower rate and warmer pitch.
- [x] Replace direct `speechSynthesis` calls in chat, explore, memory, and memory-chat components.
- [x] Add a password-protected `/settings` page.
- [x] Show previous competition/project explanation inside settings.
- [x] Show server-side model/key configuration status from `.env` without revealing secrets.
- [x] Add protected adult/settings-only routes: `/account`, `/dashboard`, `/studio`, `/lab`, `/exhibition`, `/intro`.
- [x] Run lint/build and restart the local service.

## Active Direction

Convert `stars-saying` from a competition/admin-capable demo into a pure child-facing astronomy learning app.

## Done Before Pivot

- [x] Next.js App Router foundation.
- [x] Mobile-first homepage.
- [x] Celestial body selection.
- [x] Persona-based astronomy chat.
- [x] Reviewed local knowledge cards.
- [x] Searchable library.
- [x] Short classroom lessons.
- [x] Starry wish-card generation.
- [x] Local guest persistence for child-safe continuation.

## Current Child-Facing Work

- [x] Define child-facing product strategy in `.codex/CHILD_APP_STRATEGY.md`.
- [x] Remove or hide non-child-facing routes: account, cloud sync, dashboard, studio, lab, exhibition, competition intro.
- [x] Remove navigation and wording about demos, judges, dashboards, cloud sync, Supabase, or admin tooling.
- [x] Expand celestial body categories and add more objects beyond the original solar-system roster.
- [x] Add structured knowledge cards for all new objects.
- [x] Add official astronomy data adapter using server-side NASA/JPL/NASA Exoplanet Archive calls.
- [x] Surface official imagery/facts in a child-friendly knowledge panel with graceful fallback.
- [x] Redesign home, selection, library, classroom, chat, and wish flows with brighter child-focused language.
- [x] Improve starry wish card generation.
- [x] Add `/wish-wall` for local-first child-safe wish sharing and artwork display.
- [x] Update README and `.codex/STATE.md`.
- [x] Run lint/build and route checks.

## Route Contract

Keep:
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
- `/settings`
- `/api/chat`
- `/api/explore/random`
- `/api/search`
- `/api/official-knowledge/[id]`

Protected adult/settings-only:
- `/account`
- `/dashboard`
- `/studio`
- `/lab`
- `/exhibition`
- `/intro`

Remove:
- `/api/cloud/*`
- `/api/content/status`

## Follow-Up Polish

- [x] Phase 2: add API-backed star exploration module with random draw.
- [x] Phase 2: generate child-facing summaries and personality settings from official astronomy data, using LLM when configured and deterministic fallback otherwise.
- [x] Phase 2: save explored bodies into a local app memory library for later review.
- [x] Phase 2: add voice-first affordances for explored bodies and memory entries.
- [x] Phase 2: reduce long-page stacking by using collapsible/slide-style interactions where appropriate.
- [x] Phase 2: strengthen classroom local learning status for learned/unlearned content.
- [x] 2026-05-03: add free-form and voice-assisted memory-library Q&A.
- [x] 2026-05-03: convert knowledge and classroom detail pages into stronger swipe/collapse interactions.
- [x] 2026-05-03: make classroom lesson state reversible between learned and unlearned.
- [x] 2026-05-03: show random-draw memory bodies inside star chat and route them to `/memory/[id]/chat`.
- [x] 2026-05-03: redesign star chat selection as grouped horizontal card rails.
- [x] 2026-05-03: add interruptible gentle speech playback and protected settings/internal routes.
- [ ] Run a visual QA pass in a real mobile browser and tune spacing where children may tap repeatedly.
- [ ] Consider adding parent/teacher-facing privacy copy outside the child flow if the app is prepared for public deployment.
- [ ] If JPL Horizons is slow in the deployment region, keep the current fallback and rely on NASA Image Library plus NASA Exoplanet Archive for live official data.
