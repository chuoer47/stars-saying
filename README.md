# Stars Saying / 假设星星会说话

“假设星星会说话”是一个移动优先的儿童天文学习 Web App。孩子可以随机抽取宇宙朋友、和拟人化星体聊天、查看知识卡片、进入星空课堂，并生成星空愿望卡或在本机愿望墙展示作品。

当前版本以儿童主流程为核心；竞赛说明、模型配置和内部入口保留在密码保护的 `/settings` 区域，不出现在儿童导航里。

## Highlights

- 拟人化星体聊天：太阳、月球、行星、恒星、星座、深空天体和系外行星。
- API-backed 随机抽星：服务端读取 NASA/JPL/NASA Exoplanet Archive，并生成儿童可读的科普说明和星体性格。
- 本机星体记忆库：抽到的星体会保存在浏览器本地，后续可以继续复习和聊天。
- 儿童语音体验：支持浏览器语音输入、温柔朗读和可打断播放。
- 横向滑动与折叠内容：减少长页面堆叠，更适合移动端。
- 本地课堂记录：区分已学/未学，并支持反向修改。
- 儿童安全边界：个人信息、危险内容和不适合儿童的话题会被拦截或温柔引导。

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel AI SDK / OpenAI provider
- Local reviewed knowledge base first
- Server-side NASA/JPL official astronomy data adapter
- API-backed random star exploration
- Local-first exploration memory library

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

The app works without model keys by using local fallback content. Configure `.env` only when you want live model generation or a higher NASA API limit.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Environment

Never commit `.env`. Use `.env.example` as the public template.

Important variables:

- `KAFU_LLM_API_KEY`, `KAFU_LLM_BASE_URL`, `KAFU_CHAT_MODEL`: OpenAI-compatible KAFU model provider.
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`: OpenAI-compatible fallback provider.
- `NASA_API_KEY`: optional NASA API key; `DEMO_KEY` is used when omitted.
- `SETTINGS_PASSWORD`: password for `/settings` and adult/internal routes.

## Project Map

- `src/app`: routes, pages, loading states, API routes
- `src/components`: interactive child-facing components
- `src/data`: celestial body, knowledge card, and classroom content
- `src/lib`: chat grounding, retrieval, and official astronomy API adapters
- `src/types`: shared domain types
- `.codex`: Codex continuation notes and source-of-truth task tracking
- `.codex/reference`: preserved Ralph-era requirements and fix plan for audit/history only

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
- `/api/chat`: grounded chat API
- `/api/explore/chat`: chat API for randomly explored bodies
- `/api/explore/random`: random official-data-backed exploration API
- `/api/search`: local search API
- `/api/official-knowledge/[id]`: server-side NASA/JPL official data API

## Child Safety

- No account requirement.
- No public publishing by default.
- Wishes and chats stay on the current device unless a future parent/teacher feature explicitly changes that.
- Wish wall blocks dangerous content and personal information such as phone, address, school, email, or social handles.
- Chat stays within astronomy learning, observation guidance, and gentle encouragement.

## Exploration Memory

The exploration module randomly selects from an expanded official-data-backed catalog, fetches NASA/JPL/NASA Exoplanet Archive material server-side, and generates child-friendly summaries/personality settings. If `KAFU_LLM_API_KEY`, `OPENAI_API_KEY`, or `GPT_API_KEY` is configured, the server uses the configured OpenAI-compatible model; otherwise it uses deterministic local fallback text.

## Deployment

Vercel is the preferred deployment target because the app uses Next.js App Router and server routes. See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

For mobile packaging, use a web-first path: deploy the server-backed app, then wrap it with PWA/Capacitor while keeping model keys on the server. See [docs/MOBILE_APP.md](./docs/MOBILE_APP.md).

## Continuation

After a context switch, read these files first:

1. `.codex/CHILD_APP_STRATEGY.md`
2. `.codex/TASKS.md`
3. `.codex/STATE.md`
4. `README.md`

`PRD.md` is historical and now carries a note pointing to `.codex` as the current direction.
