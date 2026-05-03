# 部署说明

[English version](./DEPLOYMENT_en.md)

推荐部署到 Vercel。项目使用 Next.js App Router 和 server routes，Vercel 可以直接识别并构建。

当前线上演示：

- https://stars-saying.vercel.app

## 本地生产检查

```bash
npm install
cp .env.example .env
npm run build
npm run start
```

如果需要开发模式：

```bash
npm run dev
```

## GitHub + Vercel 流程

1. 在 GitHub 创建一个空仓库。
2. 把本项目 push 到 GitHub。
3. 在 Vercel Dashboard 中选择 Import Git Repository。
4. Framework Preset 选择 Next.js。
5. 在 Vercel Project Settings 中添加环境变量。
6. 点击 Deploy。

## Vercel CLI 流程

当前服务器的系统 Node 是 18，而新版 Vercel CLI 需要 Node 20。可以用临时 Node 20 执行 CLI：

```bash
npx -y -p node@20 -p vercel@latest vercel login
npx -y -p node@20 -p vercel@latest vercel link --yes --project stars-saying
npx -y -p node@20 -p vercel@latest vercel --prod --yes
```

## 推荐生产环境变量

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

应用没有模型密钥也能运行，但随机探索的人设生成和聊天会使用本地兜底回复。

## 安全检查

- 不要提交 `.env`。
- 如果密钥曾经被粘贴到公开位置，立即轮换。
- 模型和 NASA API 调用必须保持在服务端。
- 公开部署前设置非默认 `SETTINGS_PASSWORD`。
- 如果没有 `SETTINGS_PASSWORD`，设置区无法正常解锁。
- 部署后检查 `/settings`，确认密钥只显示脱敏或状态信息。

## 路由冒烟测试

部署后检查：

- `/`
- `/chat`
- `/explore`
- `/memory`
- `/library`
- `/classroom`
- `/wish`
- `/wish-wall`
- `/settings`

`/settings` 应要求输入配置好的密码后才显示内部页面。

## 如何停止 Vercel 服务

Vercel 部署不是常驻进程。要彻底下线，删除项目即可：

```bash
npx -y -p node@20 -p vercel@latest vercel project remove stars-saying
```

也可以在 Vercel Dashboard 的 Project Settings -> General 中删除项目。
