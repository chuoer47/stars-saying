# Ralph Fix Plan

## High Priority
- [x] Build a mobile-first homepage with the product title, subtitle, starry atmosphere, and clear entry points to chat and project introduction.
- [x] Implement celestial body selection with category filters, responsive cards, and at least 8 MVP characters drawn from the 12-body PRD roster.
- [x] Define the celestial body data model, including name, type, avatar/icon, tagline, personality, tone, tags, priority, and suggested questions.
- [x] Create reviewed knowledge card content for the MVP celestial bodies, including summary, key facts, features, misconceptions, fun facts, cultural context, and sources.
- [x] Build the chat page UI with body identity, suggested prompts, message history, loading state, clear-chat action, and mobile-friendly input.
- [x] Implement the LLM chat API using a knowledge-first strategy: identify topic, retrieve local knowledge, inject persona + context, and generate grounded answers.
- [x] Enforce conversation safety rules for off-topic requests, dangerous content, vulgarity, pseudoscience, and uncertainty handling.
- [x] Show related knowledge card access from the chat experience so users can verify and continue learning.
- [x] Build the project introduction page covering background, target users, core features, innovation, technical architecture, science accuracy controls, and roadmap.
- [x] Ensure the core demo flow works well on mainstream mobile browsers and meets the 3-step interaction target.
- [x] Prepare the app for stable demo deployment, including server-side secret handling and a Vercel-friendly setup.

## Medium Priority
- [x] Add streaming or near-real-time response rendering for a smoother chat experience.
- [x] Add local persistence for the latest 20 chat messages/conversations, nickname/avatar preferences, and favorites.
- [x] Implement the knowledge card detail page with structured sections and reviewed source display.
- [x] Add a searchable knowledge library for celestial names, astronomy concepts, and cultural keywords.
- [x] Create the "star classroom" learning modules for solar system, night sky, cosmic scale, and stargazing basics.
- [x] Implement the star wish flow with safe, warm persona-based responses and save/share card generation.
- [x] Add lightweight immersive motion states: starfield, glowing active body, breathing avatar, and subtle feedback toasts.
- [x] Add graceful empty, loading, retry, and failure states across the main experience.
- [x] Add native/mobile share support with fallback to copy link and generated image assets.

## Low Priority
- [x] Expand from 8 MVP characters to the full 12-character launch roster if not already complete.
- [x] Add voice input or voice playback for accessibility and engagement.
- [ ] Add cloud-backed storage and optional accounts after the guest-mode demo is solid.
- [ ] Introduce Supabase/PostgreSQL-backed content management and conversation persistence.
- [ ] Upgrade from keyword retrieval to vector search/RAG only after the structured MVP is reliable.
- [ ] Add analytics/dashboard views for visits, interactions, and popular celestial bodies.
- [ ] Explore multilingual support, real-time sky mode, learning achievements, and exhibition/big-screen adaptations.

## Completed
- [x] Project initialization
- [x] Ralph specification scaffolding created

## Notes
- The MVP scope should optimize for a polished competition demo, not full production breadth.
- The critical experience loop is: choose a celestial body → ask a question → receive a grounded anthropomorphic answer → view a knowledge card → understand project value.
- Favor local JSON/content-driven implementation first; defer complex RAG, accounts, and admin tooling.
- Keep mythology and science clearly separated in both chat and card content.
- Prioritize content accuracy, persona consistency, and mobile clarity over heavy animation or backend complexity.
