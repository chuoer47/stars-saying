# Deployment

## Local Production Check

```bash
npm install
cp .env.example .env
npm run lint
npm run build
npm run start
```

## Vercel

1. Create a GitHub repository and push this project.
2. Import the repository in Vercel.
3. Set the framework preset to Next.js.
4. Add environment variables in Vercel Project Settings.
5. Deploy.

Recommended production variables:

```bash
KAFU_LLM_API_KEY=...
KAFU_LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
KAFU_CHAT_MODEL=qwen3-max
KAFU_EMBEDDING_MODEL=text-embedding-v4
KAFU_VISION_MODEL=qwen3.6-plus
KAFU_RERANK_MODEL=qwen3-rerank
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
