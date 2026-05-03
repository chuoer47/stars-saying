# Deployment

[中文版](./DEPLOYMENT.md)

Vercel is the recommended deployment target. The project uses Next.js App Router and server routes, which Vercel can detect and build directly.

Current live demo:

- https://stars-saying.vercel.app

## Local Production Check

```bash
npm install
cp .env.example .env
npm run build
npm run start
```

For development mode:

```bash
npm run dev
```

## GitHub + Vercel Flow

1. Create an empty GitHub repository.
2. Push this project to GitHub.
3. Import the Git repository in the Vercel Dashboard.
4. Select the Next.js framework preset.
5. Add environment variables in Vercel Project Settings.
6. Deploy.

## Vercel CLI Flow

The current server uses system Node 18, while the latest Vercel CLI requires Node 20. Use a temporary Node 20 runtime for the CLI:

```bash
npx -y -p node@20 -p vercel@latest vercel login
npx -y -p node@20 -p vercel@latest vercel link --yes --project stars-saying
npx -y -p node@20 -p vercel@latest vercel --prod --yes
```

## Recommended Production Variables

```bash
KAFU_LLM_API_KEY=...
KAFU_LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
KAFU_CHAT_MODEL=qwen3-max
KAFU_EMBEDDING_MODEL=text-embedding-v4
KAFU_VISION_MODEL=qwen3.6-plus
KAFU_RERANK_MODEL=qwen3-rerank
OPENAI_API_KEY=...
OPENAI_BASE_URL=...
OPENAI_MODEL=gpt-4o-mini
NASA_API_KEY=...
SETTINGS_PASSWORD=...
```

The app can run without model keys, but random exploration personality generation and chat will use local fallback responses.

## Security Checklist

- Do not commit `.env`.
- Rotate any key that was ever pasted into a public place.
- Keep model and NASA API calls server-side.
- Set a non-default `SETTINGS_PASSWORD` before public deployment.
- Without `SETTINGS_PASSWORD`, the settings area cannot be unlocked.
- Review `/settings` after deployment and confirm keys are masked.

## Route Smoke Test

After deployment, check:

- `/`
- `/chat`
- `/explore`
- `/memory`
- `/library`
- `/classroom`
- `/wish`
- `/wish-wall`
- `/settings`

`/settings` should require the configured password before showing internal pages.

## Stopping Vercel Service

A Vercel deployment is not a long-running process. To fully take it offline, delete the project:

```bash
npx -y -p node@20 -p vercel@latest vercel project remove stars-saying
```

You can also delete the project from Vercel Dashboard -> Project Settings -> General.
