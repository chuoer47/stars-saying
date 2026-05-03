# Technical Specifications

## 1. Product Summary

"假设星星会说话" is a mobile-first astronomy education Web application that turns celestial bodies into anthropomorphic conversation partners. The system should combine structured astronomy knowledge, persona-driven LLM responses, and a lightweight immersive visual layer to deliver a low-friction science learning and competition-demo experience.

### Primary goals
- Lower the barrier to astronomy learning through dialogue and knowledge cards.
- Make users actively explore astronomy through questions rather than passive reading.
- Create a warm, healing, companion-like starry atmosphere.
- Demonstrate innovation, educational value, and implementation feasibility in a competition setting.
- Deliver a complete browser-based demo without requiring app installation or account creation.

### Product boundaries
- This is not a professional observation or astronomy calculation tool.
- Phase 1 should focus on anthropomorphic science interaction and competition presentation.
- Complex astrophysics tooling, heavy observational features, and advanced scientific databases are out of scope for MVP.

## 2. Target Users and Usage Context

### Core audiences
1. Students aged 8-18 who are curious about stars, stories, and space but need simple explanations.
2. University students and astronomy club members who value originality, implementation quality, and interaction design.
3. Competition judges and science educators who need to quickly understand concept, accuracy, innovation, and feasibility.

### Core usage scenarios
- Casual astronomy learning on mobile browsers.
- Interactive demos for science competitions or classroom showcases.
- Shareable emotional/science moments through wish cards or featured Q&A.

## 3. MVP Scope and Priorities

### P0 must-have capabilities
- Homepage / starry entry page.
- Celestial body selection page.
- 8-12 celestial characters for MVP, with at least 8 fully usable.
- Chat page with basic LLM integration.
- Knowledge card experience for each celestial body.
- Project introduction / competition showcase page.
- Mobile adaptation.
- Basic safety prompt and server-side API handling.

### P1 important enhancements
- Streaming responses.
- Suggested questions.
- Star wish flow.
- Knowledge search.
- Star classroom.
- Share links/share images.
- Local chat history persistence.
- Voice features.

### P2 later enhancements
- Accounts.
- Cloud favorites/history.
- Analytics dashboard.
- Vector retrieval / RAG.
- Content admin system.
- More realistic sky interaction.
- Multilingual support.

## 4. Information Architecture

The product should include these primary modules:
1. Homepage / starry entry.
2. Celestial body selection.
3. Celestial chat.
4. Knowledge base.
5. Star wish.
6. Project introduction / competition showcase.

Recommended additional modules by later phase:
- Favorites/history.
- Analytics dashboard.
- User center for guest preferences.

## 5. Page-Level Requirements

## 5.1 Homepage

### Purpose
Communicate the concept immediately and route users to the core experience or the competition-introduction page.

### Required content
- Product title: 假设星星会说话
- Subtitle: 和星星聊天，用温柔的方式认识宇宙
- Lightweight starry background using deep blue/purple gradients and subtle twinkling.
- Primary CTA: 开始和星星对话
- Secondary CTA: 查看作品介绍
- Highlight cards for anthropomorphic chat, astronomy knowledge, star wishing, and competition showcase.

### Interaction and UX requirements
- Users should understand the product purpose within 3 seconds.
- The first screen must stay visually simple and uncluttered.
- Touch targets must be clear and thumb-friendly on mobile.
- No horizontal scrolling or content overlap on mobile browsers.

## 5.2 Celestial Body Selection

### Purpose
Let users choose a celestial character to talk to.

### MVP roster target
Preferred 12-body roster:
- Sun
- Moon
- Mercury
- Venus
- Earth
- Mars
- Jupiter
- Saturn
- Polaris
- Sirius
- Orion
- Big Dipper

### Per-card content requirements
Each card should include:
- Name
- One-line tagline/persona summary
- Avatar or icon
- Knowledge tags
- 2-3 suggested questions
- Body category

### Filtering requirements
Support category filters:
- All
- Solar System
- Stars
- Constellations
- Optional: Recommended

### Acceptance requirements
- At least 8 bodies must be fully conversational in MVP.
- Persona, avatar, and suggested prompts must stay consistent after entering chat.
- Layout should be readable in single-column or two-column mobile arrangements.

## 5.3 Chat Experience

### Purpose
Enable users to ask natural-language questions and receive answers that are both anthropomorphic and scientifically useful.

### Input requirements
- Text input required.
- Suggested prompt tap-to-send required.
- Maximum input length should be limited to about 300 characters.
- Voice input is P1, not MVP-critical.

### Response format requirements
Each answer should generally contain:
1. An in-character opening.
2. A clear, accurate astronomy explanation.
3. A follow-up invitation or guidance for deeper exploration.

### Response behavior requirements
- Stream or provide near-real-time feedback.
- Show an in-progress message such as 星星正在整理光芒…… while generating.
- Permit polite refusal for unrelated or unsafe prompts.
- Permit explicit uncertainty when context is missing.
- Do not fabricate important astronomy facts.

### Chat state requirements
- Show body avatar, name, tagline, and a knowledge card entry point.
- Support clearing the current conversation.
- Store the most recent 20 conversation items locally in MVP.

## 5.4 Knowledge Base and Cards

### Purpose
Provide the trust layer for the product and ground LLM responses.

### Required per-body card fields
Each celestial body card should include at least:
- Name
- Type
- System or classification
- Basic parameters
- Major features
- Common misconception(s)
- Fun fact
- Cultural/mythological story
- Suggested question(s)
- Reviewed source list

### MVP content requirements
- At least 12 knowledge cards are recommended.
- Each card must include at least 5 information categories: overview, parameters, features, fun fact, suggested questions.
- Content must be source-tagged and reviewed before release.

### Search requirements
Support keyword search across:
- Celestial body names
- Astronomy concepts
- Cultural/story keywords

### Performance requirement
Search results should return within 1 second for MVP-scale content.

## 5.5 Immersive Starry Interaction

### Purpose
Increase emotional value without harming usability.

### Supported effects
- Starfield background particles or CSS twinkling.
- Active celestial body glow.
- Subtle breathing animation on avatars during chat.
- Lightweight feedback when answers/cards appear.
- Text status while waiting for AI output.

### Constraints
- Effects must remain lightweight and secondary to readability.
- Use deep blue, light purple, and warm white as core palette cues.
- Avoid heavy 3D scenes in MVP.
- Provide static or reduced-motion fallback for low-end devices.

## 5.6 Star Wish Flow

### Purpose
Allow users to write a wish or reflection and receive a warm, safe, in-character reply.

### Flow requirements
1. Enter wish page.
2. Choose a celestial body or use a random default.
3. Enter a wish or reflection.
4. Submit via 把心愿交给星星.
5. Receive a persona-based reply.
6. Save/share a wish card.

### Safety requirements
- Tone must be warm, positive, and healing.
- Must not make real-world guarantees.
- Must not provide therapy, diagnosis, or medical advice.
- Must not produce negative or manipulative guidance.

## 5.7 Sharing

### MVP sharing capabilities
- Copy share link.
- Generate shareable image.
- Use native browser share on supported mobile devices, with link-copy fallback.

### Shared content requirements
Shared assets may contain:
- Product name
- Celestial body avatar/background
- Featured Q&A or knowledge snippet
- Link or QR representation

### Privacy requirements
- Do not include private user data in shared artifacts.

## 5.8 Project Introduction / Competition Showcase

### Purpose
Explain the project to judges or educators quickly and clearly.

### Required sections
- Project background
- Target users
- Core features
- Innovation points
- Educational value
- Technical architecture
- Data/content safety mechanisms
- Roadmap
- Optional team roles

### Review-speed requirement
A reviewer should understand the project value within about 2 minutes.

## 5.9 Guest Data / User Center

### MVP approach
- No mandatory login.
- Guest mode first.
- Local storage of nickname, avatar preference, recent conversations, and favorites.

### Required actions
- Set nickname.
- Choose avatar.
- Review recent conversations.
- Review saved knowledge cards.
- Clear local data.

### Privacy requirements
- Do not collect sensitive personal data such as legal name, phone number, or precise location.

## 6. System Architecture Requirements

### Recommended architecture
- Frontend and backend in a Next.js App Router application.
- Route Handlers for API endpoints.
- Server-side AI provider calls.
- Local JSON or simple data source for MVP content.
- Optional later expansion to Supabase/PostgreSQL.

### Architecture principles
- Optimize for stable, demoable flow before scaling complexity.
- Keep content structured and reviewable.
- Separate persona data, knowledge data, and UI presentation.
- Ensure AI output is constrained by explicit context and policy.

## 7. Data Models and Structures

## 7.1 Celestial body model
Recommended fields:
- id: string
- name: string
- type: string
- avatar_url: string
- tagline: string
- personality: text
- tone: text
- tags: string[]
- priority: number

### Additional recommended fields for implementation
- category: "solar-system" | "star" | "constellation" | "recommended"
- suggested_questions: string[]
- featured: boolean
- color_theme: string[]

## 7.2 Knowledge card model
Recommended fields:
- id: string
- body_id: string
- title: string
- summary: text
- facts: json
- myths: text
- fun_fact: text
- source: text
- reviewed: boolean

### Additional recommended fields for implementation
- features: string[]
- misconceptions: string[]
- suggested_questions: string[]
- source_links: string[]
- reviewed_at: datetime|null

## 7.3 Conversation model (optional in MVP backend)
- id: string
- user_id: string | null
- body_id: string
- created_at: datetime

## 7.4 Message model
- id: string
- conversation_id: string
- role: "user" | "assistant" | "system"
- content: text
- created_at: datetime

## 7.5 Wish model
- id: string
- body_id: string
- wish_text: text
- reply_text: text
- is_public: boolean
- created_at: datetime

## 8. AI and Prompting Requirements

### Prompting model
The AI layer should combine:
- Current celestial body persona.
- Allowed topic boundaries.
- Safety/refusal policy.
- Structured knowledge context retrieved from local data.
- Output expectations for tone, clarity, uncertainty, and length.

### Required answer policy
The model must:
1. Speak in the chosen celestial body's voice.
2. Prefer provided knowledge context over unsupported improvisation.
3. Explicitly say "不确定" or equivalent when information is insufficient.
4. Redirect unrelated prompts back to astronomy gently.
5. Reject dangerous, vulgar, aggressive, or pseudoscientific requests.
6. Keep typical answers within roughly 150-300 Chinese characters unless UI design later changes this.

### Knowledge-grounded answer pipeline
1. Detect target body and topic keywords from the user message.
2. Retrieve matching local knowledge snippets/cards.
3. Compose a prompt with persona + safety rules + knowledge context.
4. Generate a response constrained by the retrieved material.
5. Return the response and optionally expose related knowledge cards in the UI.

### Myth vs science requirement
When a topic includes both cultural stories and scientific explanations, the response must label or clearly separate them.

## 9. Content Accuracy and Review Requirements

- Structured astronomy content must be manually reviewed before release.
- Knowledge cards should cite sources such as NASA, ESA, textbooks, planetariums, or equivalent trusted references.
- The system must not answer uncertain scientific questions as if they are verified facts.
- Science facts and mythology must remain distinguishable across all surfaces.

## 10. API Requirements

### Core API surface for MVP
Recommended endpoints or equivalent server actions:
- `POST /api/chat` for grounded celestial conversation.
- `GET /api/celestial-bodies` for selection page data.
- `GET /api/knowledge-cards` or `GET /api/knowledge-cards/:id` for card/detail retrieval.
- Optional `POST /api/wishes` for star wish generation.

### Chat API requirements
Input should include:
- body identifier
- user message
- optional recent message history

Server behavior should:
- validate input length and body existence
- retrieve persona and knowledge context
- call the model server-side
- enforce safety rules
- support streaming where feasible
- return related card metadata if available

### Error-handling requirements
- Friendly retryable errors for model/API failures.
- No client-side secret exposure.
- Failures must not trap users in blocked UI states.

## 11. UI and Interaction Requirements

### Visual principles
- Warm, healing, imaginative, and lightweight.
- Unified starry palette and card system.
- Friendly anthropomorphic presentation without childish clutter.

### Mobile-first requirements
- Primary target is mobile web.
- Buttons, cards, and inputs must be thumb-friendly.
- Main flow should remain under 3 steps.
- Scrolling, typing, and tapping should remain smooth on mainstream mobile browsers.

### State requirements
All critical screens should define:
- empty state
- loading state
- failure state
- retry path where applicable

## 12. Performance Requirements

- First screen should show main content within 3 seconds.
- Initial AI response should begin within about 3 seconds where possible.
- Page transitions should feel smooth.
- Search results should return within 1 second for MVP content volume.
- Effects must not create obvious mobile lag.
- Reduced-performance devices should receive a simpler visual mode if needed.

## 13. Security and Privacy Requirements

- No mandatory login for core flow.
- Do not collect unnecessary personal data.
- API keys must remain server-side.
- User input should pass basic safety filtering.
- If conversation data is uploaded later, the product must disclose purpose clearly.
- Shared artifacts must not expose private user text unintentionally.

## 14. Deployment and Operations Requirements

### Recommended deployment
- App and API: Vercel
- Database/content expansion: Supabase/PostgreSQL
- Static assets: Vercel or Supabase Storage

### Competition demo hardening
- Maintain a stable hosted demo link.
- Prepare a backup static/demo mode in case model or network services fail.
- Apply AI budget limits and rate limiting.
- Prepare screenshots or recordings for defense-day fallback.

## 15. Milestones

### Phase 1: Prototype and content preparation
Deliverables:
- page wireframes
- character setting sheet
- 12 celestial knowledge cards
- prompt template

### Phase 2: MVP development
Deliverables:
- homepage
- body selection
- chat page
- knowledge cards
- project introduction page
- deployable demo link

### Phase 3: experience enhancement
Deliverables:
- star wish
- streaming
- sharing
- star classroom
- mobile polish

### Phase 4: competition preparation
Deliverables:
- demo link
- presentation deck
- feature demo video
- architecture diagram
- source/reference explanation

## 16. Acceptance Criteria Summary

### Functional acceptance
- Users can move from homepage to body selection.
- Users can choose a body and enter chat.
- Users can ask a question and receive a reply.
- Users can view the associated knowledge card.
- Users can review the project introduction page.
- Main mobile flow is usable end-to-end.

### Content acceptance
- Every body has a clear persona.
- Science content has no obvious factual errors.
- Answers remain on astronomy theme.
- Myths and science are clearly separated.

### Experience acceptance
- Pages feel stylistically unified and starry.
- Main CTAs are clear.
- Loading/failure/empty states are covered.
- No mandatory login, ads, or unnecessary complexity.

### Technical acceptance
- No API key is exposed in frontend code.
- Chat endpoints handle basic errors.
- First-screen assets stay reasonably small.
- Mobile browsers are supported.
- Core data structures remain clear and extensible.

## 17. Risks and Mitigations

- AI hallucination → knowledge-grounded responses, manual review, explicit uncertainty, refusal patterns.
- API instability → loading states, retry, backup static/demo behavior.
- Content workload → focus MVP on 8-12 representative bodies.
- Performance issues from motion → CSS-first animation and downgrade path.
- Competition explanation clarity → dedicated project introduction page and architecture visuals.
- Cost control → rate limits, short responses, caching where appropriate, provider budget limits.

## 18. Recommended MVP Delivery Strategy

If time is limited, the first release should prioritize:
1. Homepage
2. Celestial selection page
3. 8 celestial characters
4. Chat page
5. One knowledge card per character
6. Suggested prompts
7. Project introduction page
8. Vercel deployment link

The MVP should prove this loop clearly:
Choose a star → ask a question → receive an anthropomorphic educational answer → open the knowledge card → understand the product's value.
